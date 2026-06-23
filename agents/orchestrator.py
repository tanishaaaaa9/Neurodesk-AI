import os
from groq import Groq
from agents.empath import detect_emotion
from agents.oracle import calculate_churn_risk
from memory.memory import get_customer, update_customer

# Initialize Groq client (FREE)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_ai_response(system_prompt, user_message):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        max_tokens=200,
        temperature=0.7
    )
    return response.choices[0].message.content

def agent_vote(emotion_data, oracle_data, message):
    votes = {"GUARDIAN": 0, "CLOSER": 0, "SUPPORT": 0}

    # EMPATH votes based on emotion
    alert = emotion_data["alert"]
    if alert == "RED":
        votes["GUARDIAN"] += 4
        votes["CLOSER"] -= 2  # Never upsell angry customer
    elif alert == "YELLOW":
        votes["GUARDIAN"] += 2
        votes["SUPPORT"] += 1
    elif alert == "GREEN":
        votes["CLOSER"] += 3
        votes["SUPPORT"] += 1
    else:
        votes["SUPPORT"] += 3

    # ORACLE votes based on churn risk
    recommended = oracle_data["recommended_agent"]
    votes[recommended] += 3

    # Message keyword votes
    msg_lower = message.lower()
    if any(w in msg_lower for w in ["refund", "return", "complaint", "issue", "problem", "broken", "not working"]):
        votes["GUARDIAN"] += 2
    if any(w in msg_lower for w in ["buy", "purchase", "price", "upgrade", "plan", "offer", "discount"]):
        votes["CLOSER"] += 2
    if any(w in msg_lower for w in ["how", "what", "where", "when", "track", "status", "help"]):
        votes["SUPPORT"] += 2

    # Remove negative votes
    votes = {k: max(0, v) for k, v in votes.items()}

    # Find winner
    winner = max(votes, key=votes.get)
    return winner, votes

def process_customer_message(customer_id, customer_name, message):
    # Load customer memory
    customer = get_customer(customer_id)
    customer["name"] = customer_name

    # EMPATH — detect emotion
    emotion_data = detect_emotion(message)

    # ORACLE — calculate churn risk
    oracle_data = calculate_churn_risk(customer)

    # VOTING SYSTEM
    winning_agent, votes = agent_vote(emotion_data, oracle_data, message)

    # Build customer context for AI
    customer_context = f"""
Customer: {customer_name} (ID: {customer_id})
Total interactions: {customer.get('interactions', 0)}
Past emotions: {', '.join(customer.get('emotion_history', ['none'])[-5:])}
Complaints filed: {customer.get('complaints', 0)}
Churn risk: {oracle_data['churn_risk']}%
Compensations given before: {', '.join(customer.get('compensation_given', ['none']))}
"""

    response = ""
    compensation = None
    action_taken = ""

    # GUARDIAN responds
    if winning_agent == "GUARDIAN":
        system_prompt = f"""You are GUARDIAN, NeuroDesk AI's expert complaint resolution agent.
Your personality: Deeply empathetic, calm, solution-focused, warm, human.
Customer data: {customer_context}
Customer emotion: {emotion_data['emotion']} (alert level: {emotion_data['alert']})
Churn risk: {oracle_data['churn_risk']}% — {oracle_data['prediction']}

Rules:
- Start with a genuine heartfelt apology
- Acknowledge their specific problem
- Tell them exactly what you will do to fix it
- Never be robotic or use templates
- Keep it under 3 sentences
- Sound like a caring human, not a bot"""

        response = get_ai_response(system_prompt, message)

        # Auto generate compensation
        complaints_count = customer.get('complaints', 0)
        prev_compensation = customer.get('compensation_given', [])

        if "REFUND20" not in str(prev_compensation):
            compensation = "💳 Instant refund initiated + 20% loyalty coupon CARE20 added to your account"
            action_taken = "Refund initiated + Coupon generated"
        else:
            compensation = "📞 Priority callback scheduled within 30 minutes + Free upgrade applied"
            action_taken = "Priority callback scheduled"

    # CLOSER responds
    elif winning_agent == "CLOSER":
        system_prompt = f"""You are CLOSER, NeuroDesk AI's expert sales agent.
Your personality: Friendly, enthusiastic, helpful, consultative.
Customer data: {customer_context}
Customer emotion: {emotion_data['emotion']} (positive signal)

Rules:
- Be genuinely helpful, not pushy
- Suggest a relevant upgrade or product naturally
- Mention a limited time offer if appropriate
- Keep it under 3 sentences
- Sound friendly and conversational"""

        response = get_ai_response(system_prompt, message)
        action_taken = "Sales opportunity identified"

    # SUPPORT responds
    else:
        system_prompt = f"""You are SUPPORT, NeuroDesk AI's intelligent support agent.
Your personality: Clear, helpful, patient, knowledgeable.
Customer data: {customer_context}
Customer emotion: {emotion_data['emotion']}

Rules:
- Answer the question directly and clearly
- Be helpful and thorough
- Match the customer's energy
- Keep it under 3 sentences
- Sound like a knowledgeable human assistant"""

        response = get_ai_response(system_prompt, message)
        action_taken = "Query resolved"

    # Update customer memory
    emotion_history = customer.get("emotion_history", [])
    emotion_history.append(emotion_data["emotion"])

    complaints = customer.get("complaints", 0)
    if emotion_data["alert"] == "RED":
        complaints += 1

    comp_given = customer.get("compensation_given", [])
    if compensation:
        comp_given.append(action_taken)

    # Update churn risk — decrease if GUARDIAN helped
    new_churn = oracle_data["churn_risk"]
    if winning_agent == "GUARDIAN" and compensation:
        new_churn = max(0, new_churn - 30)

    update_customer(customer_id, {
        "name": customer_name,
        "emotion_history": emotion_history,
        "churn_risk": new_churn,
        "complaints": complaints,
        "compensation_given": comp_given
    })

    return {
        "response": response,
        "compensation": compensation,
        "action_taken": action_taken,
        "emotion": emotion_data,
        "churn_risk_before": oracle_data["churn_risk"],
        "churn_risk_after": new_churn,
        "winning_agent": winning_agent,
        "votes": votes,
        "prediction": oracle_data["prediction"],
        "oracle_level": oracle_data["level"]
    }