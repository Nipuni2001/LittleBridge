import json
import pickle
import random
import numpy as np
import os
import nltk

nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)
nltk.download('wordnet', quiet=True)

from nltk.stem import WordNetLemmatizer

try:
    from tensorflow.keras.models import load_model
except ImportError:
    from keras.models import load_model

lemmatizer = WordNetLemmatizer()

# Paths relative to chatbot-service root
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)


class ChatbotPredictor:
    """
    NLP-powered chatbot for LittleBridge.
    
    Attributes:
        model      : Trained Keras neural network
        words      : Vocabulary list
        classes    : Intent class labels
        intents    : Full intents data (patterns + responses)
        threshold  : Minimum confidence to match an intent
    """

    def __init__(self, threshold: float = 0.65):
        self.threshold = threshold
        self._load_artifacts()

    def _load_artifacts(self):
        """Load model, vocabulary, classes, and intents."""
        model_path   = os.path.join(BASE_DIR, 'model.keras')
        words_path   = os.path.join(BASE_DIR, 'words.pkl')
        classes_path = os.path.join(BASE_DIR, 'classes.pkl')
        intents_path = os.path.join(ROOT_DIR, 'intents.json')

        if not os.path.exists(model_path):
            raise FileNotFoundError(
                f"Model not found at {model_path}. "
                "Run 'python train_model.py' first."
            )

        self.model   = load_model(model_path)
        self.words   = pickle.load(open(words_path, 'rb'))
        self.classes = pickle.load(open(classes_path, 'rb'))

        with open(intents_path, 'r', encoding='utf-8') as f:
            self.intents = json.load(f)

        print(f"Chatbot loaded | vocab={len(self.words)} | intents={len(self.classes)}")

    # ── Text preprocessing ─────────────────────────────────────

    def _tokenize(self, text: str) -> list:
        """Tokenize and lemmatize input text."""
        ignore = set(['?', '!', '.', ',', "'", '"', '-', '(', ')'])
        tokens = nltk.word_tokenize(text.lower())
        return [lemmatizer.lemmatize(t) for t in tokens if t not in ignore]

    def _bag_of_words(self, tokens: list) -> np.ndarray:
        """Convert tokens to bag-of-words feature vector."""
        return np.array(
            [1 if w in tokens else 0 for w in self.words],
            dtype=np.float32
        )

    # ── Prediction ─────────────────────────────────────────────

    def predict_intent(self, text: str) -> list:
        """
        Returns list of (tag, probability) sorted by probability desc.
        Only returns items above self.threshold.
        """
        tokens = self._tokenize(text)
        bow    = self._bag_of_words(tokens)

        # Model expects batch dimension
        probs = self.model.predict(np.array([bow]), verbose=0)[0]

        results = [
            {'tag': self.classes[i], 'probability': float(p)}
            for i, p in enumerate(probs)
            if p > self.threshold
        ]
        return sorted(results, key=lambda x: x['probability'], reverse=True)

    def get_response(self, text: str) -> dict:
        """
        Main entry point. Returns a dict with:
            response    : str — chatbot reply
            intent      : str — matched intent tag
            confidence  : float — highest probability
            matched     : bool — whether a confident match was found
        """
        intents_list = self.predict_intent(text)

        if not intents_list:
            # Fallback: low confidence
            return {
                'response': self._fallback_response(text),
                'intent': 'unknown',
                'confidence': 0.0,
                'matched': False,
            }

        top = intents_list[0]
        tag = top['tag']

        # Find matching intent and pick a random response
        for intent in self.intents['intents']:
            if intent['tag'] == tag:
                response = random.choice(intent['responses'])
                return {
                    'response': response,
                    'intent': tag,
                    'confidence': top['probability'],
                    'matched': True,
                }

        return {
            'response': self._fallback_response(text),
            'intent': 'unknown',
            'confidence': 0.0,
            'matched': False,
        }

    def _fallback_response(self, text: str) -> str:
        """Intelligent fallback when no intent matches."""
        text_lower = text.lower()

        # Keyword-based fallback for common topics
        if any(w in text_lower for w in ['adopt', 'adoption', 'parent']):
            return ("I can help with adoption! The process has 7 stages and takes "
                    "about 6 months. Would you like to know about documents required, "
                    "the timeline, or how to get started?")

        if any(w in text_lower for w in ['donat', 'sponsor', 'give', 'contribut']):
            return ("For sponsorship, you can donate money, clothes, books, food, "
                    "or medical supplies to verified orphanages. You can even do it "
                    "anonymously as a guest! Visit the Sponsorship page to start.")

        if any(w in text_lower for w in ['orphanage', 'home', 'center']):
            return ("All orphanages on LittleBridge are verified by NGOs. "
                    "You can browse them on the Orphanages page or find ones near "
                    "you when you log in. What would you like to know?")

        if any(w in text_lower for w in ['document', 'paper', 'certif', 'id']):
            return ("The required documents for adoption include: National ID, "
                    "Birth Certificate, Marriage Certificate, Proof of Income, "
                    "Bank Statements, Medical Certificate, Police Clearance, "
                    "and 2 Reference Letters. Need more details?")

        return ("I'm not quite sure I understood that. Could you rephrase? "
                "I can help with adoption processes, document requirements, "
                "sponsorship, finding orphanages, or general platform navigation.")


