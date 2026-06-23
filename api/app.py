from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import sys
import os

# Load environment variables
load_dotenv()

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.orchestrator import process_customer_message
from memory.memory import get_all_customers

app = Flask(__name__)
CORS(app)

# Live stats tracker
stats = {
    "active_conversations": 0,
    "revenue_saved": 0,
    "deals_closed": 0,
    "complaints_resolved": 0,
    "churn_prevented": 0,
    "emotion_alerts": {"red": 0, "yellow": 0, "green": 0, "blue": 0}
}

@app.route("/")
def home():
    return jsonify({"status": "NeuroDesk AI is running", "agents": 6})

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        customer_id = data.get("customer_id", "C001")
        customer_name = data.get("customer_name", "Customer")
        message = data.get("message", "")

        if not message:
            return jsonify({"error": "Message is required"}), 400

        result = process_customer_message(customer_id, customer_name, message)

        # Update live stats
        stats["active_conversations"] += 1
        alert = result["emotion"]["alert"].lower()
        stats["emotion_alerts"][alert] = stats["emotion_alerts"].get(alert, 0) + 1

        if result["winning_agent"] == "GUARDIAN":
            stats["complaints_resolved"] += 1
            stats["revenue_saved"] += 3500
            if result["churn_risk_after"] < result["churn_risk_before"]:
                stats["churn_prevented"] += 1

        if result["winning_agent"] == "CLOSER":
            stats["deals_closed"] += 1
            stats["revenue_saved"] += 2000

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/dashboard", methods=["GET"])
def dashboard():
    all_customers = get_all_customers()
    high_risk = [c for c in all_customers.values() if c.get("churn_risk", 0) >= 70]
    medium_risk = [c for c in all_customers.values() if 40 <= c.get("churn_risk", 0) < 70]

    return jsonify({
        "stats": stats,
        "high_risk_count": len(high_risk),
        "medium_risk_count": len(medium_risk),
        "total_customers": len(all_customers)
    })

@app.route("/customers", methods=["GET"])
def customers():
    all_customers = get_all_customers()
    return jsonify(list(all_customers.values()))

if __name__ == "__main__":
    print("🧠 NeuroDesk AI Backend Starting...")
    print("✅ 6 Agents Loaded")
    print("✅ Memory Brain Active")
    print("✅ Voting System Ready")
    print("🚀 Running on http://localhost:5000")
    app.run(debug=True, port=5000, host="0.0.0.0")