# On-Call Copilot

On-Call Copilot is an AI-powered incident response assistant designed to help engineers resolve outages and production issues faster. It uses **Hindsight** for persistent long-term memory of past postmortems and **Groq** for high-speed, LLM-based troubleshooting analysis.

When a new incident is submitted, On-Call Copilot runs a comparative analysis:
1. **Without Memory**: Returns general troubleshooting steps using `openai/gpt-oss-120b` via Groq.
2. **With Hindsight Memory**: Uses Hindsight to search the memory bank for matching past incidents, then prompts Groq to extract the matched incident name, root cause, fix that worked, what NOT to try, and an draft customer message.

---

## Features

- **Incident Analyzer**: Compare general troubleshooting paths against context-aware, memory-guided diagnostics side-by-side.
- **Memory Browser**: Explore all stored past incidents and postmortems in a structured sidebar accordion list.
- **Seeding Tool**: Instantly seed the database with 8 realistic, synthetic production incident templates (connection pools, certificate expirations, DNS loops, and more).
- **Resolve & Teach Memory**: Document a live incident resolution to save the postmortem directly to Hindsight memory for future recall.
- **Premium UI / UX**: Beautiful dark-mode, glassmorphic layout, gradient headers, custom buttons, and status indicator.
- **Robust Local Fallback**: Automatically falls back to a local JSON cache (`.local_memories.json`) if API keys are unconfigured or Hindsight is unreachable.

---

## Installation & Setup

### 1. Clone & Navigate
Navigate to the project directory:
```bash
cd on-call-copilot
```

### 2. Set Up a Virtual Environment (Recommended)
Create and activate a virtual environment to isolate dependencies:

**On macOS / Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows (PowerShell):**
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 3. Install Dependencies
Install the required packages from `requirements.txt`:
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Copy `.env.example` to a new `.env` file:
```bash
cp .env.example .env
```

Open `.env` in a text editor and fill in your API credentials:
```env
GROQ_API_KEY=your_groq_api_key_here
HINDSIGHT_API_KEY=your_hindsight_api_key_here
HINDSIGHT_BANK_ID=on_call_copilot_bank
```

*Note: If these keys are left empty or as default placeholders, the application will automatically run in a **Local Demo Mode** using simulated responses and local cached file memory so you can immediately see it in action.*

---

## Running the Application

Launch the Streamlit dashboard:
```bash
streamlit run app.py
```

The app will compile and launch in your default web browser, typically at `http://localhost:8501`.

---

## Project Structure

- `app.py`: Streamlit user interface, memory parsing, layout columns, and styling imports.
- `agent.py`: Core integration logic for Hindsight memory retention/recall and Groq chat completions.
- `seed_data.py`: Pre-configured dataset of 8 production incidents with a batch-save utility.
- `index.css`: Custom CSS styling for visual enhancements (glassmorphic containers, gradient text, button transitions).
- `requirements.txt`: Python package requirements.
- `.gitignore`: Configured to ignore environment secrets, caches, and build folders.
