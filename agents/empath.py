import requests
import os

def detect_emotion(text):
    # Try HuggingFace API first
    try:
        API_URL = "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base"
        headers = {"Authorization": f"Bearer {os.getenv('HUGGINGFACE_API_KEY')}"}
        response = requests.post(API_URL, headers=headers, json={"inputs": text}, timeout=5)
        result = response.json()

        if isinstance(result, list) and len(result) > 0:
            emotions = result[0]
            if isinstance(emotions, list):
                top = max(emotions, key=lambda x: x['score'])
                emotion = top['label'].lower()
                score = round(top['score'], 2)

                if emotion in ['anger', 'disgust']:
                    return {"emotion": "angry", "score": score, "alert": "RED", "emoji": "😡"}
                elif emotion in ['sadness', 'fear']:
                    return {"emotion": "sad", "score": score, "alert": "YELLOW", "emoji": "😢"}
                elif emotion in ['joy', 'surprise']:
                    return {"emotion": "happy", "score": score, "alert": "GREEN", "emoji": "😊"}
                else:
                    return {"emotion": "neutral", "score": score, "alert": "BLUE", "emoji": "😐"}
    except:
        pass

    # Fallback — keyword detection (works without API)
    text_lower = text.lower()

    angry_words = ["angry", "furious", "terrible", "worst", "hate", "refund",
                   "useless", "pathetic", "ridiculous", "unacceptable", "disgusting",
                   "rubbish", "horrible", "awful", "fraud", "cheating", "scam",
                   "late", "delay", "never", "cancel", "quit", "leave", "!!"]

    happy_words = ["love", "great", "amazing", "excellent", "wonderful", "fantastic",
                   "perfect", "awesome", "good", "happy", "satisfied", "impressed",
                   "recommend", "best", "thank", "appreciate"]

    sad_words = ["sad", "disappointed", "unhappy", "unfortunate", "regret",
                 "sorry", "miss", "lost", "failed", "broken"]

    angry_score = sum(1 for w in angry_words if w in text_lower)
    happy_score = sum(1 for w in happy_words if w in text_lower)
    sad_score = sum(1 for w in sad_words if w in text_lower)

    if angry_score >= 2 or "!!" in text or text.isupper():
        return {"emotion": "angry", "score": 0.9, "alert": "RED", "emoji": "😡"}
    elif angry_score == 1:
        return {"emotion": "angry", "score": 0.7, "alert": "RED", "emoji": "😡"}
    elif happy_score >= 1:
        return {"emotion": "happy", "score": 0.8, "alert": "GREEN", "emoji": "😊"}
    elif sad_score >= 1:
        return {"emotion": "sad", "score": 0.7, "alert": "YELLOW", "emoji": "😢"}
    else:
        return {"emotion": "neutral", "score": 0.6, "alert": "BLUE", "emoji": "😐"}