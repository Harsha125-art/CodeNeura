import re

def clean_text(text):
    # Remove emojis
    text = re.sub(r'[^\x00-\x7F]+','', text)
    # Remove extra spaces and punctuation
    text = re.sub(r'[^\w\s]', '', text)
    text = text.strip().lower()
    return text
