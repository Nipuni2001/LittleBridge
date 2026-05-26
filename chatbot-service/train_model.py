import json
import pickle
import random
import numpy as np
import nltk

nltk.download('punkt', quiet=True)
nltk.download('punkt_tab', quiet=True)
nltk.download('wordnet', quiet=True)
nltk.download('stopwords', quiet=True)

from nltk.stem import WordNetLemmatizer

# ── importing Keras  ────────────────────
try:
    from tensorflow.keras.models import Sequential
    from tensorflow.keras.layers import Dense, Dropout, BatchNormalization
    from tensorflow.keras.optimizers import Adam
    from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
    print("Using TensorFlow Keras")
except ImportError:
    try:
        from keras.models import Sequential
        from keras.layers import Dense, Dropout, BatchNormalization
        from keras.optimizers import Adam
        from keras.callbacks import EarlyStopping, ReduceLROnPlateau
        print("Using standalone Keras")
    except ImportError:
        print("Keras/TensorFlow not found. Install: pip install tensorflow")
        exit(1)

lemmatizer = WordNetLemmatizer()

# ── Load intents ──────────────────────────────────────────────
with open('intents.json', 'r', encoding='utf-8') as f:
    intents = json.load(f)

words = []       # vocabulary
classes = []     # intent tags
documents = []   # (words, tag) pairs

IGNORE_CHARS = ['?', '!', '.', ',', "'", '"', '-', '(', ')']

print("Processing intents...")

for intent in intents['intents']:
    tag = intent['tag']
    if tag not in classes:
        classes.append(tag)

    for pattern in intent['patterns']:
        # Tokenize
        word_list = nltk.word_tokenize(pattern.lower())
        # Lemmatize and filter
        word_list = [lemmatizer.lemmatize(w) for w in word_list
                     if w not in IGNORE_CHARS]
        words.extend(word_list)
        documents.append((word_list, tag))

# Remove duplicates, sort
words = sorted(set(words))
classes = sorted(set(classes))

print(f"  Vocabulary size : {len(words)}")
print(f"  Intent classes  : {len(classes)}")
print(f"  Training samples: {len(documents)}")

# ── Save metadata ─────────────────────────────────────────────
with open('chatbot/words.pkl', 'wb') as f:
    pickle.dump(words, f)

with open('chatbot/classes.pkl', 'wb') as f:
    pickle.dump(classes, f)

print("Metadata saved (words.pkl, classes.pkl)")

# ── Build training data ───────────────────────────────────────
training = []

for doc_words, tag in documents:
    # Bag of words
    bag = [1 if lemmatizer.lemmatize(w) in doc_words else 0 for w in words]

    # One-hot output
    output = [0] * len(classes)
    output[classes.index(tag)] = 1

    training.append([bag, output])

# Shuffle and split
random.shuffle(training)
training = np.array(training, dtype=object)

X = np.array(list(training[:, 0]), dtype=np.float32)
y = np.array(list(training[:, 1]), dtype=np.float32)

print(f"\nTraining shape: X={X.shape}, y={y.shape}")

# ── Neural Network ────────────────────────────────────────────
model = Sequential([
    # Input layer
    Dense(256, input_shape=(len(words),), activation='relu'),
    BatchNormalization(),
    Dropout(0.4),

    # Processing layer 1
    Dense(128, activation='relu'),
    BatchNormalization(),
    Dropout(0.3),

    # Processing layer 2
    Dense(64, activation='relu'),
    Dropout(0.2),

    # Output layer (softmax for multi-class)
    Dense(len(classes), activation='softmax'),
])

optimizer = Adam(learning_rate=0.001)
model.compile(
    loss='categorical_crossentropy',
    optimizer=optimizer,
    metrics=['accuracy']
)

model.summary()

# ── Callbacks ─────────────────────────────────────────────────
early_stop = EarlyStopping(
    monitor='loss',
    patience=20,
    restore_best_weights=True,
    verbose=1
)

reduce_lr = ReduceLROnPlateau(
    monitor='loss',
    factor=0.5,
    patience=10,
    min_lr=1e-6,
    verbose=1
)

# ── Train ─────────────────────────────────────────────────────
print("\n Training started...")

history = model.fit(
    X, y,
    epochs=300,
    batch_size=8,
    verbose=1,
    callbacks=[early_stop, reduce_lr]
)

final_acc = history.history['accuracy'][-1]
final_loss = history.history['loss'][-1]

print(f"\n Training complete!")
print(f"   Final accuracy : {final_acc:.4f} ({final_acc*100:.1f}%)")
print(f"   Final loss     : {final_loss:.4f}")

# ── Save model ────────────────────────────────────────────────
model.save('chatbot/model.keras')
print(" Model saved to chatbot/model.keras")

print("\n LittleBridge chatbot model is ready!")
print("   Run app.py to start the chatbot server.")
