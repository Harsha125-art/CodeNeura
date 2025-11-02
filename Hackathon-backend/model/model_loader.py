from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F

MODEL_NAME = "joeddav/distilbert-base-uncased-go-emotions-student"

# Load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
model.eval()

EMOTIONS = [
    "admiration", "amusement", "anger", "annoyance", "approval",
    "caring", "confusion", "curiosity", "desire", "disappointment",
    "disapproval", "disgust", "embarrassment", "excitement", "fear",
    "gratitude", "grief", "joy", "love", "nervousness",
    "optimism", "pride", "realization", "relief", "remorse",
    "sadness", "surprise"
]

def predict_text(text, top_k=3):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
        probs = F.softmax(outputs.logits, dim=1)[0]
    
    top_probs, top_indices = torch.topk(probs, top_k)
    top_emotions = [EMOTIONS[i] for i in top_indices]
    top_scores = [float(p) for p in top_probs]
    
    return {
        "top_emotions": top_emotions,
        "scores": top_scores,
        "main_emotion": top_emotions[0],
        "score": top_scores[0]
    }
