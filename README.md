<h1 align="center">Neurodesk-AI</h1>

<p align="center">
  <strong>A powerful multi-agent AI orchestrator featuring cognitive memory, specialized LLM agents, and a sleek, modern React dashboard.</strong>
</p>

<br>

<!-- 
======================================================================
SCREENSHOT INSTRUCTIONS:
To add a screenshot here, simply:
1. Create a folder named "docs" in your project folder.
2. Put your screenshot image in that folder (e.g., "dashboard.png").
3. Uncomment (remove the <!- - and - ->) from the image tag below and make sure the file name matches.
======================================================================
-->
<!-- <p align="center"><img src="docs/dashboard.png" alt="Neurodesk-AI Dashboard" width="800"></p> -->

## ✨ Features
* **Modular Agent System:** Specialized AI agents (Orchestrator, Empath, Oracle) handling distinct cognitive tasks.
* **Modern React Interface:** A beautiful, responsive frontend built with Vite and React.
* **Persistent Memory:** Context-aware interactions using local JSON-based memory storage.
* **Dockerized:** Ready for containerized deployment via Docker Compose.

## 🛠️ Tech Stack
* **Frontend:** React, Vite, JavaScript, CSS
* **Backend/Agents:** Python, Flask (API)
* **Infrastructure:** Docker, Docker Compose

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (for frontend)
* [Python 3.10+](https://www.python.org/) (for backend agents)
* [Docker](https://www.docker.com/) (optional, for containerized running)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/tanishaaaaa9/Neurodesk-AI.git
cd Neurodesk-AI
```

**2. Setup Backend**
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

**3. Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

## 🤝 Collaborators
When working as a team, please create a new branch for your features before making a Pull Request to the `main` branch:
```bash
git checkout -b feature/your-feature-name
```
