# model/model_loader.py
from transformers import pipeline

# Load your huggingface model (example: go-emotions)
classifier = pipeline("text-classification", model="joeddav/distilbert-base-uncased-go-emotions-student")

def predict_text(text: str):
    """
    Returns a prediction dictionary
    """
    result = classifier(text, top_k=3)  # top 3 emotions
    # Format prediction
    top_emotions = [r['label'] for r in result]
    scores = [r['score'] for r in result]
    main_emotion = top_emotions[0]
    score = scores[0]
    return {
        "top_emotions": top_emotions,
        "scores": scores,
        "main_emotion": main_emotion,
        "score": score
    }
