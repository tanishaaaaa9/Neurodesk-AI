FROM python:3.10-slim

WORKDIR /app

# Copy requirements or just install directly
COPY requirements.txt .
# Fallback if requirements.txt doesn't have everything
RUN pip install flask flask-cors requests groq huggingface_hub python-dotenv

# Copy everything else
COPY . .

# Expose backend port
EXPOSE 5000

# Run the app
CMD ["python", "api/app.py"]
