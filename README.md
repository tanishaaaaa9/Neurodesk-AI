<p align="center">
  <img src="frontend/src/assets/hero.png" alt="NeuroDesk AI" width="120" />
</p>
<h1 align="center">NeuroDesk AI</h1>
<p align="center">
  A multi-agent AI platform that reads customer emotions, predicts churn in real time, and routes every conversation to the right agent — automatically.
</p>
<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10-blue?style=flat-square&logo=python" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/LLaMA_3.3-70B-8B5CF6?style=flat-square" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" />
</p>

## What It Does

Most customer support tools react to what a user says. NeuroDesk AI reacts to how they *feel*.

Every incoming message passes through a 6-agent voting pipeline. Agents score the message independently — for emotion, churn risk, and intent — then the highest-scoring agent takes the conversation. An angry customer with a complaint never gets a sales pitch. A happy customer asking about upgrades never gets routed to a complaint handler.

The result: the right response, from the right agent, every single time.

## Agent Pipeline

```text
  Customer Message
        │
   ┌────┴────┐
   │         │
EMPATH    ORACLE
(Emotion) (Churn Risk)
   │         │
   └────┬────┘
        │
   ORCHESTRATOR  ←  Voting system picks the winner
        │
   ┌────┼────┐
   │    │    │
GUARDIAN SUPPORT CLOSER
```

## Agents

* 🎭 **EMPATH**: Runs every message through HuggingFace `distilroberta-base` NLP. Fires RED / YELLOW / GREEN / BLUE emotion alerts. Falls back to keyword detection if the API is unavailable.
* 🔮 **ORACLE**: Scores churn risk from 0–100% using complaint count, emotion history, and interaction frequency. Classifies as LOW / MEDIUM / HIGH / CRITICAL.
* 🛡️ **GUARDIAN**: Activates on RED alerts or high churn risk. Auto-generates refunds, loyalty coupons, and priority callbacks. Deescalates before damage is done.
* 💬 **SUPPORT**: Handles general queries with LLaMA 3.3 70B via Groq. Sounds human, not scripted.
* 💰 **CLOSER**: Upsells only when emotion is GREEN and buying intent is detected. Never pitches to an unhappy customer.
* 📊 **ANALYST**: Streams live emotion charts, revenue impact, and churn dashboards — refreshed every 3 seconds.

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Backend** | Python 3.10, Flask, Flask-CORS |
| **AI Inference** | Groq API — LLaMA 3.3 70B |
| **Emotion Model** | HuggingFace — j-hartmann/emotion-english-distilroberta-base |
| **Frontend** | React 18, Vite, Framer Motion, Recharts |
| **Memory** | JSON-based persistent customer state |
| **Infra** | Docker, Docker Compose |

## Project Structure

```text
neurodesk-ai/
├── agents/
│   ├── orchestrator.py     # Voting logic + agent routing
│   ├── empath.py           # Emotion detection
│   └── oracle.py           # Churn risk scoring
├── api/
│   └── app.py              # Flask REST API
├── memory/
│   ├── memory.py           # Customer read/write helpers
│   └── customers.json      # Persistent customer state
├── frontend/
│   └── src/
│       ├── App.jsx         # War Room — main chat UI
│       └── LandingPage.jsx
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

## Getting Started

### Prerequisites

* Python 3.10+
* Node.js 20+
* Groq API key — free tier is enough
* HuggingFace API key — optional, keyword fallback works without it

### Environment Variables

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key   # optional
```

### Run with Docker

```bash
git clone https://github.com/tanishaaaaa9/Neurodesk-AI.git
cd Neurodesk-AI
docker-compose up --build
```

**Frontend** → `http://localhost:5173` · **Backend** → `http://localhost:5000`

### Run Manually

**Backend**

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python api/app.py
```

**Frontend** — new terminal

```bash
cd frontend
npm install
npm run dev
```

<p align="center">Built with Python · React · LLaMA 3.3 · HuggingFace</p>
