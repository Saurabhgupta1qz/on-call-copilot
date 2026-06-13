import os
import streamlit as st
import logging
from agent import (
    generic_response,
    memory_response,
    save_incident,
    list_all_memories,
    hindsight_manager,
    groq_manager
)
from seed_data import seed_all

# Set Streamlit Page Configuration
st.set_page_config(
    page_title="On-Call Copilot — AI Incident Response",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Load index.css custom styles
def load_css(file_name):
    if os.path.exists(file_name):
        with open(file_name, "r") as f:
            st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)
    else:
        logging.warning(f"CSS file {file_name} not found.")

load_css("index.css")

# Helper function to parse Hindsight memory string back into components
def parse_memory(memory_text):
    lines = memory_text.split("\n")
    parsed = {
        "id": "UNKNOWN",
        "raw_text": "No raw text available.",
        "root_cause": "N/A",
        "fix": "N/A",
        "what_didnt_work": "N/A",
        "customer_message": "N/A"
    }
    
    current_key = None
    for line in lines:
        if line.startswith("Incident ID:"):
            parsed["id"] = line.replace("Incident ID:", "").strip()
            current_key = None
        elif line.startswith("Raw Incident Description:"):
            parsed["raw_text"] = line.replace("Raw Incident Description:", "").strip()
            current_key = "raw_text"
        elif line.startswith("Root Cause:"):
            parsed["root_cause"] = line.replace("Root Cause:", "").strip()
            current_key = "root_cause"
        elif line.startswith("Fix That Worked:"):
            parsed["fix"] = line.replace("Fix That Worked:", "").strip()
            current_key = "fix"
        elif line.startswith("What Didn't Work / What NOT to Try:"):
            parsed["what_didnt_work"] = line.replace("What Didn't Work / What NOT to Try:", "").strip()
            current_key = "what_didnt_work"
        elif line.startswith("Customer Message:"):
            parsed["customer_message"] = line.replace("Customer Message:", "").strip()
            current_key = "customer_message"
        elif current_key and line.strip() and not line.startswith("Incident Postmortem:"):
            # Append to multi-line fields
            parsed[current_key] += " " + line.strip()
            
    return parsed

# App Header
st.markdown('<h1 class="gradient-text">🤖 On-Call Copilot</h1>', unsafe_allow_html=True)
st.markdown(
    "<p style='color: #94a3b8; font-size: 1.15rem; margin-top: -10px; margin-bottom: 2rem;'>"
    "An AI incident response agent powered by <strong>Hindsight</strong> memory and <strong>Groq</strong> reasoning."
    "</p>",
    unsafe_allow_html=True
)

# Sidebar - Connection Status
st.sidebar.markdown('<h2 style="font-family: \'Outfit\', sans-serif; color: #f1f5f9;">⚙️ System Status</h2>', unsafe_allow_html=True)

# Detect if we are using mock fallbacks
is_hindsight_mock = hindsight_manager.use_fallback
is_groq_mock = groq_manager.use_mock

if is_hindsight_mock or is_groq_mock:
    status_msg = "⚠️ Running in Local Demo Mode (using cached mock database)"
    st.sidebar.warning(status_msg)
else:
    st.sidebar.success("⚡ Connected to Groq & Hindsight APIs")

# Sidebar - Memory Browser
st.sidebar.markdown('<hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.05); margin: 1.5rem 0;">', unsafe_allow_html=True)
st.sidebar.markdown('<h2 style="font-family: \'Outfit\', sans-serif; color: #f1f5f9;">📁 Memory Browser</h2>', unsafe_allow_html=True)
st.sidebar.markdown("<p style='color: #94a3b8; font-size: 0.85rem;'>Past incidents currently stored in your memory bank.</p>", unsafe_allow_html=True)

# Seeding Button
if st.sidebar.button("💾 Seed 8 Past Incidents"):
    with st.spinner("Seeding database..."):
        seeded_count = seed_all()
        st.sidebar.success(f"Successfully seeded {seeded_count} incidents!")
        st.rerun()

# Retrieve stored memories
memories = list_all_memories()

if not memories:
    st.sidebar.info("No memories found. Click 'Seed 8 Past Incidents' to populate.")
else:
    st.sidebar.markdown(f"<div style='font-size: 0.85rem; color: #6366f1; font-weight: 600; margin-bottom: 0.5rem;'>Total: {len(memories)} memories</div>", unsafe_allow_html=True)
    
    for i, m in enumerate(memories):
        parsed = parse_memory(m)
        incident_label = f"{parsed['id']}"
        # Make a short summary from root cause
        summary = parsed['root_cause'][:60] + "..." if len(parsed['root_cause']) > 60 else parsed['root_cause']
        
        with st.sidebar.expander(f"📌 {incident_label} - {summary}"):
            st.markdown(f"<div class='memory-item'>", unsafe_allow_html=True)
            st.markdown(f"**Description:** {parsed['raw_text']}")
            st.markdown(f"**Root Cause:** {parsed['root_cause']}")
            st.markdown(f"**Fix:** {parsed['fix']}")
            st.markdown(f"**What NOT to Try:** {parsed['what_didnt_work']}")
            st.markdown(f"**Customer Message:** *\"{parsed['customer_message']}\"*")
            st.markdown(f"</div>", unsafe_allow_html=True)

# Main Area - Incident Analyzer
st.markdown('<div class="glass-card pulse-card" style="border-left: 4px solid #6366f1;">', unsafe_allow_html=True)
st.markdown('<h3>🔍 Active Incident Analyzer</h3>', unsafe_allow_html=True)
st.markdown("<p style='color: #94a3b8; font-size: 0.9rem;'>Enter raw alert logs, stack traces, or customer bug reports below to analyze troubleshooting paths.</p>", unsafe_allow_html=True)

incident_input = st.text_area(
    "Active Incident Description",
    placeholder="Example: Gateway is returning 502 Bad Gateway for all payments. Check app logs...",
    label_visibility="collapsed",
    height=140
)

# Keep track of active query in state
if "analyzer_triggered" not in st.session_state:
    st.session_state.analyzer_triggered = False
if "active_incident" not in st.session_state:
    st.session_state.active_incident = ""

if st.button("🔥 Analyze Incident"):
    if not incident_input.strip():
        st.error("Please enter an incident description to analyze.")
    else:
        st.session_state.analyzer_triggered = True
        st.session_state.active_incident = incident_input
st.markdown('</div>', unsafe_allow_html=True)

# Single-View Analysis with Swap Control
if st.session_state.analyzer_triggered:
    st.markdown('<h3 style="margin-top: 2rem;">📊 Diagnostic Result</h3>', unsafe_allow_html=True)
    
    if "analysis_view" not in st.session_state:
        st.session_state.analysis_view = "With Memory"

    view_col, swap_col = st.columns([3, 1])
    with view_col:
        st.session_state.analysis_view = st.radio(
            "Choose analysis mode",
            ["With Memory", "Without Memory"],
            index=0,
            horizontal=True,
        )
    with swap_col:
        if st.button("🔄 Swap"):
            st.session_state.analysis_view = (
                "Without Memory"
                if st.session_state.analysis_view == "With Memory"
                else "With Memory"
            )
            st.experimental_rerun()

    with st.spinner("Analyzing troubleshooting pathway..."):
        generic_res = generic_response(st.session_state.active_incident)
        hindsight_res = memory_response(st.session_state.active_incident)

    if st.session_state.analysis_view == "Without Memory":
        st.markdown('<div class="glass-card without-memory-card" style="height: 100%;">', unsafe_allow_html=True)
        st.markdown('<span class="badge badge-red">❌ Without Memory</span>', unsafe_allow_html=True)
        st.markdown('<h4 style="margin-top: 0.5rem; margin-bottom: 1rem;">Generic AI Assistant Response</h4>', unsafe_allow_html=True)
        st.markdown(generic_res)
        st.markdown('</div>', unsafe_allow_html=True)
    else:
        st.markdown('<div class="glass-card with-memory-card" style="height: 100%;">', unsafe_allow_html=True)
        st.markdown('<span class="badge badge-green">✨ With Hindsight Memory</span>', unsafe_allow_html=True)
        st.markdown('<h4 style="margin-top: 0.5rem; margin-bottom: 1rem;">Context-Aware Copilot Response</h4>', unsafe_allow_html=True)
        st.markdown(hindsight_res)
        st.markdown('</div>', unsafe_allow_html=True)

# "Resolve & Teach" Form
st.markdown('<hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.05); margin: 3.5rem 0 2rem 0;">', unsafe_allow_html=True)

st.markdown('<div class="glass-card teach-card">', unsafe_allow_html=True)
st.markdown('<h3>✍️ Resolve & Teach Memory</h3>', unsafe_allow_html=True)
st.markdown("<p style='color: #94a3b8; font-size: 0.9rem;'>Teach On-Call Copilot about a new resolved incident. This details the postmortem to Hindsight to improve future matches.</p>", unsafe_allow_html=True)

with st.form("teach_form", clear_on_submit=True):
    sub_col1, sub_col2 = st.columns([1, 2])
    with sub_col1:
        new_inc_id = st.text_input("Incident ID", placeholder="e.g. INC-101")
    with sub_col2:
        new_raw_text = st.text_area("Raw Incident Description / Error Log", placeholder="Paste the original error logs or description...")
        
    new_root_cause = st.text_area("Root Cause", placeholder="Why did this incident occur?")
    new_fix = st.text_area("Fix That Worked", placeholder="What exact steps were taken to resolve it?")
    new_didnt_work = st.text_area("What NOT to Try (Optional)", placeholder="What did you try that did not work, or what should future responders avoid?")
    new_cust_msg = st.text_area("Customer Message", placeholder="Draft a public message/status update suitable for customers.")
    
    submit_teach = st.form_submit_button("🎓 Save to Hindsight Memory")
    
    if submit_teach:
        if not new_inc_id.strip() or not new_raw_text.strip() or not new_root_cause.strip() or not new_fix.strip():
            st.error("Please fill in the Incident ID, Raw Incident Description, Root Cause, and Fix fields to teach the agent.")
        else:
            success = save_incident(
                incident_id=new_inc_id,
                root_cause=new_root_cause,
                fix=new_fix,
                what_didnt_work=new_didnt_work,
                customer_message=new_cust_msg,
                raw_text=new_raw_text
            )
            if success:
                st.success(f"Incident {new_inc_id} successfully saved to memory!")
                st.rerun()
            else:
                st.error("Failed to save incident memory. Check logs for details.")

st.markdown('</div>', unsafe_allow_html=True)
