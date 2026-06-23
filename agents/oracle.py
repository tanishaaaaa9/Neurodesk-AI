def calculate_churn_risk(customer):
    risk = 0

    # Complaints increase risk a lot
    complaints = customer.get("complaints", 0)
    risk += complaints * 20

    # Angry emotions in history
    emotion_history = customer.get("emotion_history", [])
    angry_count = emotion_history.count("angry")
    sad_count = emotion_history.count("sad")
    risk += angry_count * 12
    risk += sad_count * 6

    # Too many interactions without resolution
    interactions = customer.get("interactions", 0)
    if interactions > 5:
        risk += 10
    if interactions > 10:
        risk += 10

    # Cap between 0 and 100
    risk = max(0, min(risk, 100))

    # Decision
    if risk >= 70:
        level = "CRITICAL"
        prediction = f"Will leave within 7 days — Act immediately"
        recommended = "GUARDIAN"
        color = "red"
    elif risk >= 40:
        level = "HIGH"
        prediction = f"High churn risk — Needs attention soon"
        recommended = "GUARDIAN"
        color = "orange"
    elif risk >= 20:
        level = "MEDIUM"
        prediction = f"Medium risk — Monitor this customer"
        recommended = "SUPPORT"
        color = "yellow"
    else:
        level = "LOW"
        prediction = f"Customer is stable — Good to upsell"
        recommended = "CLOSER"
        color = "green"

    return {
        "churn_risk": risk,
        "level": level,
        "prediction": prediction,
        "recommended_agent": recommended,
        "color": color
    }