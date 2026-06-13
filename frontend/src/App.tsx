import React, { useEffect, useState } from "react";
import { ApiService } from "./services/api";
import { ToastMessage } from "./types";
import SreHeader from "./components/SreHeader";
import IncidentInput from "./components/IncidentInput";
import AnalysisResults from "./components/AnalysisResults";
import MemoryRecall from "./components/MemoryRecall";
import TelemetryConsole, { LogEntry } from "./components/TelemetryConsole";
import TeachSystem from "./components/TeachSystem";
import Notification from "./components/Notification";
import TimelineView from "./components/TimelineView";
import WhyDifferent from "./components/WhyDifferent";
import ArchitectureVisual from "./components/ArchitectureVisual";
import DemoGuide from "./components/DemoGuide";
import { Activity, ShieldCheck, Zap, Terminal } from "lucide-react";

export default function App() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Input statesdriven by guided demo
  const [incidentTextInput, setIncidentTextInput] = useState("");
  const [currentIncidentText, setCurrentIncidentText] = useState<string | null>(null);

  // Telemetry indicators
  const [totalResolved, setTotalResolved] = useState(148);
  const [secondsSaved, setSecondsSaved] = useState(72);

  const addLog = (
    level: "INFO" | "SUCCESS" | "WARN" | "ERROR",
    source: "CLIENT" | "API" | "OUTPOST",
    message: string
  ) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        timestamp,
        level,
        source,
        message,
      },
    ]);
  };

  const handleUrlChange = (newUrl: string) => {
    addLog("INFO", "CLIENT", `FastAPI Outpost URL updated in configuration to: ${newUrl}`);
    addToast("info", `Target FastAPI server set to ${newUrl}`);
  };

  const clearLogs = () => {
    setLogs([]);
    addLog("INFO", "CLIENT", "Console logs cleared by operator.");
  };

  useEffect(() => {
    const targetUrl = ApiService.getBaseUrl();
    addLog("INFO", "CLIENT", "On-Call Copilot client initialised.");
    addLog("INFO", "CLIENT", `Target FastAPI Outpost bound at: ${targetUrl}`);
    
    // Add default welcoming toast
    setTimeout(() => {
      addToast("info", "Connected in Pure UI Mode. Set active FastAPI endpoints to process raw alerts.");
    }, 1000);
  }, []);

  const addToast = (type: "success" | "error" | "info", message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto-dismiss in 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4550);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Perform SRE Incident Hindsight Analysis against the FastAPI backend
  const handleAnalyze = async (incidentText: string) => {
    setCurrentIncidentText(incidentText);
    setIncidentTextInput(incidentText);
    setIsLoading(true);
    setAnalysis(null);
    addLog("INFO", "CLIENT", "Initiating incident triage stream...");
    addLog("INFO", "API", `POST /analyze target -> ${ApiService.getBaseUrl()}/analyze`);

    const steps = [
      "Transmitting alert telemetry stream...",
      "Correlating historical indexes inside FastAPI outpost...",
      "Analyzing root causes using LLM reasoning...",
      "Synthesizing actionable recovery playbook...",
    ];

    let currentStepIdx = 0;
    setLoadingStep(steps[currentStepIdx]);

    const stepInterval = setInterval(() => {
      if (currentStepIdx < steps.length - 1) {
        currentStepIdx++;
        setLoadingStep(steps[currentStepIdx]);
        addLog("INFO", "CLIENT", `[Triage Phase] ${steps[currentStepIdx]}`);
      }
    }, 1300);

    const startTime = performance.now();

    try {
      const response = await ApiService.analyzeIncident(incidentText);
      clearInterval(stepInterval);
      const duration = ((performance.now() - startTime) / 1000).toFixed(2);

      setAnalysis(response.analysis);
      setIsLoading(false);
      setTotalResolved((prev) => prev + 1);
      setSecondsSaved((prev) => prev + Math.floor(Math.random() * 20) + 40);

      addLog("SUCCESS", "OUTPOST", `Triage finished successfully in ${duration}s. Status 200 OK.`);
      addLog("SUCCESS", "OUTPOST", `Payload returned: "${response.analysis.substring(0, 160)}..."`);
      addToast("success", "Resolution playbook generated. Telemetry completed successfully.");

    } catch (err: any) {
      clearInterval(stepInterval);
      setIsLoading(false);
      addLog("ERROR", "API", `POST /analyze failed: ${err.message || err}`);
      addToast("error", err.message || "Failed to analyze current incident. Ensure your FastAPI server is online.");
    }
  };

  // Teach incident callback posting to FastAPI /teach
  const handleTeach = async (incidentText: string): Promise<boolean> => {
    addLog("INFO", "CLIENT", "Packaging custom post-mortem draft...");
    addLog("INFO", "API", `POST /teach target -> ${ApiService.getBaseUrl()}/teach`);
    const startTime = performance.now();

    try {
      const response = await ApiService.teachIncident(incidentText);
      const duration = ((performance.now() - startTime) / 1000).toFixed(2);

      if (response.status === "saved") {
        addLog("SUCCESS", "OUTPOST", `Taught system successfully in ${duration}s. Status 200 OK.`);
        addToast("success", "Committed post-mortem event safely into regional memory.");
        return true;
      }
      
      addLog("WARN", "OUTPOST", `Save returned unexpected state: ${JSON.stringify(response)}`);
      return false;

    } catch (err: any) {
      addLog("ERROR", "API", `POST /teach failed: ${err.message || err}`);
      addToast("error", err.message || "Failed to save post-mortem to regional outpost.");
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans pb-16 selection:bg-sky-500/30 selection:text-white">
      {/* Visual cyber mesh pattern backing the mainframe */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-radial-gradient from-slate-900/40 via-slate-950/0 to-transparent pointer-events-none z-0" />

      {/* Modern SRE Header Tagline & Meta Badge bar */}
      <SreHeader onUrlChange={handleUrlChange} />

      {/* Main Container Workspace */}
      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-8 relative z-10">
        
        {/* Core Live Performance SRE Metas (Subtle Datadog Grid Style) */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-4.5 flex items-center justify-between shadow-md border-l-2 border-l-sky-505">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
                Estimated MTTR Reduction
              </span>
              <div className="font-display font-extrabold text-white text-lg mt-1 tracking-tight flex items-baseline gap-1.5">
                42% Decrease
                <span className="text-[10px] text-emerald-405 font-mono font-bold">
                  ↓ ACCELERATED
                </span>
              </div>
            </div>
            <div className="bg-sky-500/10 p-2 rounded-lg text-sky-400 border border-sky-500/10 shrink-0">
              <Activity className="w-4 h-4" />
            </div>
          </div>

          <div className="glass-card p-4.5 flex items-center justify-between shadow-md border-l-2 border-l-amber-500">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
                Historical Incidents Used
              </span>
              <div className="font-display font-extrabold text-white text-lg mt-1 tracking-tight flex items-baseline gap-1.5">
                3 Matches
                <span className="text-[10px] text-amber-550 font-mono font-bold">
                  🧠 RECALLED
                </span>
              </div>
            </div>
            <div className="bg-amber-500/10 p-2 rounded-lg text-amber-400 border border-amber-500/10 shrink-0">
              <Terminal className="w-4 h-4" />
            </div>
          </div>

          <div className="glass-card p-4.5 flex items-center justify-between shadow-md border-l-2 border-l-emerald-500">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
                Confidence Score
              </span>
              <div className="font-display font-extrabold text-white text-lg mt-1 tracking-tight flex items-baseline gap-1.5">
                94% Probability
                <span className="text-[10px] text-emerald-405 font-mono font-bold">
                  ⚡ HIGH RESOLUTION
                </span>
              </div>
            </div>
            <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-400 border border-emerald-500/10 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
          </div>

          <div className="glass-card p-4.5 flex items-center justify-between shadow-md border-l-2 border-l-purple-500">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
                Knowledge Base Size
              </span>
              <div className="font-display font-extrabold text-white text-lg mt-1 tracking-tight">
                {totalResolved} Incidents
              </div>
            </div>
            <div className="bg-purple-500/10 p-2 rounded-lg text-purple-400 border border-purple-500/10 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        </section>

        {/* Demo Presentation Walkthrough Guide */}
        <section className="pt-2">
          <DemoGuide
            onLoadPreset={setIncidentTextInput}
            onAnalyze={handleAnalyze}
            onTeach={async (text) => {
              const success = await handleTeach(text);
              if (success) {
                setTotalResolved((prev) => prev + 1);
              }
            }}
            onReset={() => {
              setAnalysis(null);
              setIncidentTextInput("");
              setCurrentIncidentText(null);
              addLog("INFO", "CLIENT", "System reset to idle state.");
              addToast("info", "Walkthrough reset. High-density buffer cleared.");
            }}
            analysisExists={!!analysis}
            isAnalyzing={isLoading}
            totalResolvedIncidents={totalResolved}
          />
        </section>

        {/* SRE Action & System Architecture Visual Map */}
        <section className="pt-2">
          <ArchitectureVisual />
        </section>

        {/* Primary Interactive Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Column 1: Ingestion Console (lg:col-span-4) */}
          <section className="lg:col-span-4 h-full">
            <IncidentInput
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              value={incidentTextInput}
              onChange={setIncidentTextInput}
            />
          </section>

          {/* Column 2: Live Resolution Timeline (lg:col-span-3) */}
          <section className="lg:col-span-3 h-full">
            <TimelineView
              isLoading={isLoading}
              hasAnalysis={!!analysis}
              loadingStep={loadingStep}
            />
          </section>

          {/* Column 3: SRE Playbook Analysis Results (lg:col-span-5) */}
          <section className="lg:col-span-5 h-full">
            <AnalysisResults
              analysis={analysis}
              isLoading={isLoading}
              loadingStep={loadingStep}
            />
          </section>

        </div>

        {/* SRE Core Advantage & Architectural Difference */}
        <section className="pt-2">
          <WhyDifferent />
        </section>

        {/* Client Telemetry Logs & Teach Outpost Panel Area */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          
          {/* Historical Memory Recall matched cards (lg:col-span-4) */}
          <div className="lg:col-span-12 xl:col-span-4 h-full">
            <MemoryRecall
              currentIncidentText={currentIncidentText}
              isAnalyzing={isLoading}
            />
          </div>

          {/* Real-time Telemetry Logs Output Area (lg:col-span-4) */}
          <div className="lg:col-span-12 xl:col-span-4 h-full">
            <TelemetryConsole
              logs={logs}
              onClearLogs={clearLogs}
            />
          </div>

          {/* Teach System Panel Area (lg:col-span-4) */}
          <div className="lg:col-span-12 xl:col-span-4 h-full">
            <TeachSystem onTeach={handleTeach} />
          </div>

        </section>

      </main>

      <footer className="max-w-7xl mx-auto mt-10 mb-6 flex items-center justify-between px-6 text-[10px] text-slate-500 font-mono tracking-tight shrink-0">
        <div>FASTAPI_TARGET: {ApiService.getBaseUrl()} | HOST: 0.0.0.0 | APP_PORT: 3000</div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> OUTPOST_READY
          </span>
        </div>
      </footer>

      {/* Global custom toast notification dispatcher */}
      <Notification toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
