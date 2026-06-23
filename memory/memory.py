import json
import os

MEMORY_FILE = "memory/customers.json"

def load_memory():
    if not os.path.exists(MEMORY_FILE):
        return {}
    with open(MEMORY_FILE, "r") as f:
        return json.load(f)

def save_memory(data):
    with open(MEMORY_FILE, "w") as f:
        json.dump(data, f, indent=2)

def get_customer(customer_id):
    memory = load_memory()
    if customer_id in memory:
        return memory[customer_id]
    return {
        "id": customer_id,
        "name": "Customer",
        "interactions": 0,
        "emotion_history": [],
        "churn_risk": 0,
        "complaints": 0,
        "compensation_given": [],
        "lifetime_value": 0,
        "notes": ""
    }

def update_customer(customer_id, updates):
    memory = load_memory()
    if customer_id not in memory:
        memory[customer_id] = get_customer(customer_id)
    for key, value in updates.items():
        memory[customer_id][key] = value
    memory[customer_id]["interactions"] = memory[customer_id].get("interactions", 0) + 1
    save_memory(memory)
    return memory[customer_id]

def get_all_customers():
    return load_memory()