import React from "react";
import { motion } from "motion/react";
import { AlertCircle, CheckCircle2, ShieldAlert, Terminal, MessageSquare, Zap, Layers, Brain } from "lucide-react";

interface AnalysisResultsProps {
  analysis: string | null;
  isLoading: boolean;
  loadingStep: string;
}

interface ParsedSections {
  rootCause: string;
  recommendedFix: string[];
  avoid: string[];
  customerUpdate: string;
}

export function parseAnalysisMarkdown(rawText: string): ParsedSections {
  const sections: ParsedSections = {
    rootCause: "",
    recommendedFix: [],
    avoid: [],
    customerUpdate: "",
  };

  if (!rawText) return sections;

  const lines = rawText.split("\n");
  let currentField: keyof ParsedSections | null = null;

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Detect header boundaries
    if (/^#+\s*(root\s*cause|cause)/i.test(trimmed) || /^root\s*cause\s*:/i.test(trimmed)) {
      currentField = "rootCause";
      continue;
    } else if (/^#+\s*(recommended\s*fix|fix|recommendation)/i.test(trimmed) || /^recommended\s*fix\s*:/i.test(trimmed)) {
      currentField = "recommendedFix";
      continue;
    } else if (/^#+\s*(avoid|pitfalls)/i.test(trimmed) || /^avoid\s*:/i.test(trimmed)) {
      currentField = "avoid";
      continue;
    } else if (/^#+\s*(customer\s*update|status\s*update|update)/i.test(trimmed) || /^customer\s*update\s*:/i.test(trimmed)) {
      currentField = "customerUpdate";
      continue;
    }

    if (currentField) {
      if (currentField === "recommendedFix" || currentField === "avoid") {
        const cleanLine = trimmed.replace(/^[-*+\d\.\)]\s*/, "").trim();
        if (cleanLine) {
          (sections[currentField] as string[]).push(cleanLine);
        }
      } else {
        if (sections[currentField]) {
          sections[currentField] += "\n" + trimmed;
        } else {
          sections[currentField] = trimmed;
        }
      }
    }
  }

  return sections;
}

export default function AnalysisResults({ analysis, isLoading, loadingStep }: AnalysisResultsProps) {
  if (isLoading) {
    // Determine step status based on current loadingStep passed from parent
    const stepsList = [
      { id: "search", label: "Searching Organizational Memory...", icon: "🔍" },
      { id: "retrieve", label: "Retrieving Similar Incidents...", icon: "📚" },
      { id: "reason", label: "Reasoning with Historical Knowledge...", icon: "🧠" },
      { id: "generate", label: "Generating Resolution Plan...", icon: "⚡" }
    ];

    // Simple heuristic to highlight which step we are currently in
    let activeIdx = 0;
    if (loadingStep.includes("Retrieving") || loadingStep.includes("Similar")) activeIdx = 1;
    else if (loadingStep.includes("Reasoning") || loadingStep.includes("Knowledge")) activeIdx = 2;
    else if (loadingStep.includes("Generating") || loadingStep.includes("Resolution")) activeIdx = 3;

    return (
      <div className="glass-card p-8 flex flex-col justify-center min-h-[420px] relative overflow-hidden">
        {/* Absolute Grid overlay */}
        <div className="absolute inset-0 bg-grid-white/[0.015] bg-[size:14px_14px] pointer-events-none" />

        {/* Top Header Decorator */}
        <div className="flex items-center justify-between border-b border-sky-500/10 pb-4 mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase">
              HINDSIGHT_COGNITIVE_PIPELINE
            </span>
          </div>
          <span className="text-[9px] font-mono text-sky-400">
            SPEED: ~14.2 GB/S
          </span>
        </div>

        {/* Micro Radar Sweep & Icon */}
        <div className="flex flex-col items-center mb-6 relative z-10">
          <div className="relative mb-2">
            <div className="w-14 h-14 rounded-full bg-sky-500/10 border border-sky-400/20 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(14,165,233,0.2)]">
              <Brain className="w-6 h-6 text-sky-400 animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full border border-sky-500/20 animate-ping" />
          </div>
          <span className="text-xs text-sky-400 font-mono font-bold uppercase tracking-wider animate-pulse">
            Processing Core Telemetry
          </span>
        </div>

        {/* Interactive Steps List */}
        <div className="space-y-3.5 max-w-sm mx-auto w-full relative z-10 bg-slate-950/40 p-4.5 rounded-xl border border-slate-850/70">
          {stepsList.map((item, idx) => {
            const isCompleted = idx < activeIdx;
            const isActive = idx === activeIdx;
            const isPending = idx > activeIdx;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={`flex items-center justify-between p-2 rounded-lg border text-xs transition-colors ${
                  isActive
                    ? "bg-sky-500/10 border-sky-500/30 text-sky-350 font-medium"
                    : isCompleted
                    ? "bg-slate-900/30 border-slate-800/40 text-emerald-400/90"
                    : "bg-transparent border-transparent text-slate-550"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base leading-none shrink-0">{item.icon}</span>
                  <span className={`${isActive ? "font-semibold" : ""}`}>
                    {item.label}
                  </span>
                </div>

                <div className="shrink-0 flex items-center justify-center pl-2">
                  {isCompleted ? (
                    <span className="text-[10px] font-mono font-bold text-emerald-400">
                      [ DONE ]
                    </span>
                  ) : isActive ? (
                    <div className="w-3.5 h-3.5 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="text-[10px] font-mono text-slate-650">
                      [ IDLE ]
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Global Progress Bar */}
        <div className="mt-6 max-w-sm mx-auto w-full relative z-10 space-y-1.5">
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>COMPLETION PIPELINE</span>
            <span className="font-bold text-sky-405">{25 * (activeIdx + 1)}%</span>
          </div>
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-850">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-indigo-505 transition-all duration-700"
              style={{ width: `${25 * (activeIdx + 1)}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="glass-card p-8 border-dashed flex flex-col items-center justify-center min-h-[420px] text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-center text-slate-500 mb-4 shadow-inner">
          <Terminal className="w-5 h-5 text-slate-400" />
        </div>
        <h3 className="text-slate-300 font-display font-semibold text-sm mb-1 uppercase tracking-wider">
          Awaiting Incident Telemetry
        </h3>
        <p className="text-slate-500 text-xs max-w-xs leading-relaxed">
          Select or paste an active alert in the console panel, then click "Analyze Incident" to initiate SRE hindsight reasoning.
        </p>
      </div>
    );
  }

  const parsed = parseAnalysisMarkdown(analysis);
  const isParsedSuccessfully = parsed.rootCause || parsed.recommendedFix.length > 0 || parsed.avoid.length > 0 || parsed.customerUpdate;

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.3, ease: "easeOut" }
    })
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-sky-400 font-mono" />
          <span className="text-xs uppercase font-mono tracking-widest text-slate-400 font-bold">
            Copilot Resolution Playbook
          </span>
        </div>
        <span className="text-[10px] bg-sky-500/10 border border-sky-500/20 text-sky-400 px-2.5 py-1 rounded-full font-mono font-bold tracking-wider">
          LIVE OUTPOST RETRIEVAL
        </span>
      </div>

      {isParsedSuccessfully && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-sky-500/5 hover:bg-sky-500/10 border border-sky-550/20 text-sky-400 text-[10px] leading-relaxed p-3 rounded-lg flex items-center justify-between font-mono gap-3 transition-colors shadow-inner"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping shrink-0" />
            <span>⚡ PLAYBOOK DERIVED DIRECTLY FROM MATCHED REGIONAL MEMORY INCIDENTS</span>
          </div>
          <span className="text-[8px] bg-sky-500/15 px-2 py-0.5 rounded font-bold border border-sky-500/20 shrink-0 select-none">
            CONNECTED LINK
          </span>
        </motion.div>
      )}

      {isParsedSuccessfully ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Root Cause */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="glass-card p-4.5 flex flex-col min-h-[195px] border-l-4 border-l-amber-500/80 bg-gradient-to-br from-amber-500/[0.02] to-transparent relative overflow-hidden group hover:border-amber-500/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-amber-500/90 font-display">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Root Cause</h3>
              </div>
              <span className="text-[9px] font-mono font-bold text-amber-500/60 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">LIVE OUTCOME</span>
            </div>
            
            <div className="flex-1 bg-slate-950/45 p-3.5 rounded-xl border border-slate-900 text-xs md:text-sm leading-relaxed text-slate-200 overflow-y-auto whitespace-pre-line select-text">
              {parsed.rootCause || "Analyzing baseline anomalies..."}
            </div>
          </motion.div>

          {/* Card 2: Recommended Fix */}
          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="glass-card p-4.5 flex flex-col min-h-[195px] border-l-4 border-l-emerald-500/80 bg-gradient-to-br from-emerald-500/[0.02] to-transparent relative overflow-hidden group hover:border-emerald-500/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-display">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Recommended Fix</h3>
              </div>
              <span className="text-[9px] font-mono font-bold text-emerald-450/60 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">SUCCESS ACTIONS</span>
            </div>

            <div className="flex-1 bg-slate-950/45 p-3.5 rounded-xl border border-slate-900 text-xs md:text-sm leading-relaxed text-slate-200 overflow-y-auto">
              {parsed.recommendedFix.length > 0 ? (
                <ol className="list-decimal list-inside space-y-2">
                  {parsed.recommendedFix.map((fix, idx) => (
                    <li key={idx} className="text-slate-300">
                      <span className="text-slate-100">{fix}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-slate-450 italic">No recommendations parsed. Review complete output stream.</p>
              )}
            </div>
          </motion.div>

          {/* Card 3: Avoid Actions */}
          <motion.div
            custom={2}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="glass-card p-4.5 flex flex-col min-h-[195px] border-l-4 border-l-rose-500/80 bg-gradient-to-br from-rose-500/[0.02] to-transparent relative overflow-hidden group hover:border-rose-500/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-rose-400 font-display">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Things to Avoid</h3>
              </div>
              <span className="text-[9px] font-mono font-bold text-rose-450/60 bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/10">PITFALLS</span>
            </div>

            <div className="flex-1 bg-slate-950/45 p-3.5 rounded-xl border border-slate-900 text-xs md:text-sm leading-relaxed text-slate-200 overflow-y-auto">
              {parsed.avoid.length > 0 ? (
                <ul className="list-disc list-inside space-y-2 text-slate-300">
                  {parsed.avoid.map((item, idx) => (
                    <li key={idx} className="text-slate-300">
                      <span className="text-slate-100">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-450 italic">No historical pitfalls flagged for this class of incident.</p>
              )}
            </div>
          </motion.div>

          {/* Card 4: Customer Board Update */}
          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="glass-card p-4.5 flex flex-col min-h-[195px] border-l-4 border-l-sky-500/80 bg-gradient-to-br from-sky-500/[0.02] to-transparent relative overflow-hidden group hover:border-sky-500/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sky-400 font-display">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-bold uppercase tracking-widest">Customer Update</h3>
              </div>
              <span className="text-[9px] font-mono font-bold text-sky-450/60 bg-sky-500/5 px-2 py-0.5 rounded border border-sky-500/10">STAKEHOLDERS</span>
            </div>

            <div className="flex-1 bg-slate-950/45 p-3.5 rounded-xl border border-slate-900 text-xs md:text-sm leading-relaxed text-sky-200 overflow-y-auto italic pl-4 border-l-2 border-l-sky-500/40">
              {parsed.customerUpdate || "Status updates formulated in real-time."}
            </div>
          </motion.div>
        </div>
      ) : null}

      {/* Unified detailed terminal output card */}
      <motion.div
        custom={4}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        className="glass-card p-4"
      >
        <div className="flex items-center gap-2 mb-2 text-sky-400">
          <Layers className="w-4 h-4" />
          <h3 className="text-xs font-bold uppercase tracking-widest">Complete Output Stream</h3>
        </div>
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar shadow-inner">
          {analysis}
        </div>
      </motion.div>
    </div>
  );
}


