from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from memory import store_incident
from agent import analyze_incident

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Hackathon/demo ke liye
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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