from fastapi import FastAPI
from pydantic import BaseModel
from memory import store_incident
from agent import analyze_incident

app = FastAPI()

class IncidentRequest(BaseModel):
    incident: str

@app.post("/analyze")
def analyze(data: IncidentRequest):
    return {
        "analysis": analyze_incident(data.incident)
    }

@app.post("/teach")
def teach(data: IncidentRequest):

    store_incident(data.incident)

    return {
        "status": "saved"
    }

@app.get("/")
def home():
    return {
        "message": "On-Call Copilot API Running 🚀"
    }