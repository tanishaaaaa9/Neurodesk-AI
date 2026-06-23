# 🧠 Neurodesk-AI 🚀

Hey there! Welcome to **Neurodesk-AI**. 

Basically, this is a super cool project where we have different AI agents teaming up to do awesome stuff. It's got a sleek React frontend where you can see all the magic happen, and a Python backend where the AI brains (like the Orchestrator and the Empath) actually live.

We also built a memory system so the AI actually remembers things from past conversations. Pretty neat, right?

<!-- 
Hey! If you want to show off what the dashboard looks like, just put a screenshot named "dashboard.png" inside a "docs" folder, and remove the arrows below!
-->
<!-- ![Dashboard Preview](docs/dashboard.png) -->

## ✨ What's cool about it?
* **Multiple AI Brains:** Different agents handling different tasks so they don't get confused.
* **React Frontend:** A modern, snappy UI to interact with the agents.
* **Memory Storage:** It remembers context using local JSON files. No goldfish memory here!
* **Docker Ready:** If you like containers, we got a `docker-compose` ready to go.

## 🛠️ What we used
* **Frontend:** React, Vite, CSS
* **Backend:** Python, Flask
* **The Magic:** Local file memory and AI logic!

## 🎮 How to run it on your machine

Wanna play around with it? Here is how you get it running:

**1. Grab the code**
```bash
git clone https://github.com/tanishaaaaa9/Neurodesk-AI.git
cd Neurodesk-AI
```

**2. Start the Python Backend**
```bash
python -m venv venv
# On Windows run this:
venv\Scripts\activate
# On Mac/Linux run this:
source venv/bin/activate

pip install -r requirements.txt
```

**3. Start the React Frontend**
Open a *new* terminal window, then:
```bash
cd frontend
npm install
npm run dev
```
Boom! You're good to go. 

## ✌️ Contributing
If you're on the team and want to add stuff, make sure you create a new branch first!
`git checkout -b your-cool-feature`
