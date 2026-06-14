# 🚨 On-Call Copilot

> AI Incident Commander with Organizational Memory

"Learn from every outage. Resolve the next one faster."

---

## 🎯 Problem

SRE and DevOps teams repeatedly face similar production incidents:

- Database connection pool exhaustion
- API latency spikes
- Kubernetes pod crashes
- Payment processing failures
- Infrastructure outages

Engineers spend valuable time searching dashboards, runbooks, and previous incidents before taking action.

---

## 💡 Solution

On-Call Copilot is an AI-powered Incident Response Assistant that:

1. Analyzes incident descriptions in real time.
2. Recalls similar historical incidents from organizational memory.
3. Identifies the most likely root cause.
4. Recommends remediation actions.
5. Generates customer-facing status updates.

The system continuously learns from past incidents and improves future responses.

---

## ✨ Key Features

### 🧠 Organizational Memory

Store and retrieve historical incident knowledge using Hindsight Memory.

### ⚡ Root Cause Analysis

Uses LLM-powered reasoning to identify probable causes from incident traces.

### 🔍 Historical Incident Recall

Finds relevant past outages and remediation patterns.

### 📢 Customer Communication

Automatically drafts customer-facing incident updates.

### 📈 Reduced MTTR

Helps teams resolve incidents faster by surfacing known solutions instantly.

---

## 🏗️ Architecture

```text
                ┌─────────────────────┐
                │   Frontend (Vite)   │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ FastAPI Backend     │
                └──────────┬──────────┘
                           │
          ┌────────────────┴───────────────┐
          ▼                                ▼

 ┌─────────────────┐             ┌─────────────────┐
 │ Hindsight Memory│             │ Groq LLM        │
 │ Incident Recall │             │ RCA Generation  │
 └─────────────────┘             └─────────────────┘

          ▼
  Root Cause Analysis
          ▼
  Recommended Fixes
          ▼
 Customer Updates
```

---

## 📂 Project Structure

```text
on-call-copilot/
│
├── backend/
│   ├── api.py               # FastAPI routes
│   ├── agent.py             # AI reasoning engine
│   ├── memory.py            # Hindsight integration
│   ├── seed_data.py         # Sample incidents
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── IncidentInput.tsx
│   │   │   ├── AnalysisResults.tsx
│   │   │   ├── MemoryRecall.tsx
│   │   │   └── TelemetryConsole.tsx
│   │   │
│   │   ├── services/
│   │   │   └── api.ts
│   │   │
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── README.md
└── .gitignore
```

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite

### Backend

- FastAPI
- Python

### AI

- Groq LLM

### Memory Layer

- Hindsight

### Deployment

- Vercel
- Render

---

## 🚀 Live Demo

### Frontend

https://on-call-copilot.vercel.app

### Backend

https://on-call-copilot.onrender.com

---

## ⚙️ Environment Variables

### Backend

```env
GROQ_API_KEY=your_key
HINDSIGHT_API_KEY=your_key
BANK_ID=your_bank_id
```

---

## 🧪 Example Incident

```text
Stripe webhook processing is timing out during invoice creation.
Payments are delayed and subscriptions are not being activated.
```

### Generated Output

#### Root Cause

Database latency caused webhook processing to exceed timeout limits.

#### Recommended Fix

- Optimize database queries
- Increase webhook timeout
- Move heavy processing to async workers

#### Customer Update

We are aware of delays affecting payment processing and subscription activation. Our team is actively working on a fix and service will be restored shortly.

---

## 🎥 Hackathon Demo Flow

1. Load Incident Preset
2. Analyze Incident
3. Recall Historical Incidents
4. Generate Root Cause Analysis
5. Review Recommended Fixes
6. Generate Customer Update

---

## 🌟 Impact

- Faster incident resolution
- Reduced MTTR
- Better knowledge retention
- Improved customer communication
- AI-powered operational excellence

---

## 👨‍💻 Team

Built for Hackathons, SRE teams, and modern cloud operations.

**On-Call Copilot — Learn from every outage. Resolve the next one faster.**
