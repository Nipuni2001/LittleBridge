import os
import uuid
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=[
    os.getenv('FRONTEND_URL', 'http://localhost:5173'),
    'http://localhost:3000',
])

# ── Load NLP model ────────────────────────────────────────────
print("Loading LittleBridge NLP model...")
try:
    from chatbot import ChatbotPredictor
    predictor = ChatbotPredictor(threshold=0.60)
    MODEL_LOADED = True
    print("NLP model ready")
except FileNotFoundError as e:
    print(f"  {e}")
    print("    Run 'python train_model.py' to generate the model first.")
    predictor = None
    MODEL_LOADED = False
except Exception as e:
    print(f" Failed to load model: {e}")
    predictor = None
    MODEL_LOADED = False

# ── In-memory conversation store ─────────────────────────────
# In production: replace with Redis
conversations: dict = {}
MAX_HISTORY = 20

PORT = int(os.getenv('FLASK_PORT', 5001))
DEBUG = os.getenv('FLASK_DEBUG', 'True') == 'True'


# ── Routes ────────────────────────────────────────────────────

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'model_loaded': MODEL_LOADED,
        'timestamp': time.time(),
    })


@app.route('/chat', methods=['POST'])
def chat():
    """
    Request body:
    {
        "message": "How long does adoption take?",
        "conversation_id": "user-123-abc",   // optional
        "user_context": {                     // optional
            "user_id": 1,
            "user_type": "adopter",
            "user_name": "Priya"
        }
    }
    """
    if not MODEL_LOADED or predictor is None:
        return jsonify({
            'success': False,
            'error': 'Chatbot model not loaded. Please run train_model.py first.',
        }), 503

    data = request.get_json(silent=True) or {}
    message = (data.get('message') or '').strip()

    if not message:
        return jsonify({'success': False, 'error': 'Message is required'}), 400

    # Limit message length
    if len(message) > 500:
        message = message[:500]

    # Get or create conversation ID
    conversation_id = data.get('conversation_id') or str(uuid.uuid4())
    user_context = data.get('user_context', {})

    # Store user message in history
    if conversation_id not in conversations:
        conversations[conversation_id] = []

    conversations[conversation_id].append({
        'role': 'user',
        'content': message,
        'timestamp': time.time(),
    })

    # ── Get NLP response ──────────────────────────────────────
    try:
        result = predictor.get_response(message)
        response_text = result['response']

        # Personalise if user name available
        user_name = user_context.get('user_name', '')
        if user_name and len(conversations[conversation_id]) == 1:
            # First message — greet by name
            if result['intent'] == 'greeting':
                response_text = response_text.replace(
                    'Hello!', f'Hello, {user_name}!'
                ).replace(
                    'Hi there!', f'Hi, {user_name}!'
                )

    except Exception as e:
        print(f"Prediction error: {e}")
        response_text = ("I'm having a brief technical issue. "
                        "Please try again in a moment.")
        result = {'intent': 'error', 'confidence': 0.0, 'matched': False}

    # Store bot response in history
    conversations[conversation_id].append({
        'role': 'assistant',
        'content': response_text,
        'timestamp': time.time(),
    })

    # Trim history
    if len(conversations[conversation_id]) > MAX_HISTORY:
        conversations[conversation_id] = conversations[conversation_id][-MAX_HISTORY:]

    return jsonify({
        'success': True,
        'response': response_text,
        'intent': result.get('intent'),
        'confidence': round(result.get('confidence', 0), 4),
        'matched': result.get('matched', False),
        'conversation_id': conversation_id,
    })


@app.route('/reset', methods=['POST'])
def reset():
    """Clear conversation history for a session."""
    data = request.get_json(silent=True) or {}
    cid = data.get('conversation_id')
    if cid and cid in conversations:
        del conversations[cid]
    return jsonify({'success': True})


@app.route('/intents', methods=['GET'])
def list_intents():
    """Dev endpoint — lists all intent tags."""
    if not MODEL_LOADED or predictor is None:
        return jsonify({'error': 'Model not loaded'}), 503
    tags = [i['tag'] for i in predictor.intents['intents']]
    return jsonify({'intents': tags, 'count': len(tags)})


# ── Start server ──────────────────────────────────────────────

if __name__ == '__main__':
    print(f"\nLittleBridge Chatbot Service")
    print(f"   Port    : {PORT}")
    print(f"   Debug   : {DEBUG}")
    print(f"   Model   : {' Loaded' if MODEL_LOADED else ' Not loaded (run train_model.py)'}")
    print(f"   API URL : http://localhost:{PORT}/chat\n")

    app.run(host='0.0.0.0', port=PORT, debug=DEBUG)
