import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Database, HelpCircle, FileCheck, CheckSquare, Sparkles } from "lucide-react";

interface TimelineViewProps {
  isLoading: boolean;
  hasAnalysis: boolean;
  loadingStep?: string;
}

export default function TimelineView({ isLoading, hasAnalysis, loadingStep = "" }: TimelineViewProps) {
  // Map our steps to highlight states
  const stages = [
    {
      id: "alert",
      title: "Alert Received",
      desc: "Raw system metrics or alerts ingested into the buffer.",
      icon: Bell,
      isActive: true, // Always active once initiated
      isDone: hasAnalysis || isLoading,
    },
    {
      id: "memory",
      title: "Memory Retrieved",
      desc: "FastAPI semantic correlation against regional index maps.",
      icon: Database,
      isActive: isLoading || hasAnalysis,
      isDone: hasAnalysis && !isLoading,
    },
    {
      id: "cause",
      title: "Root Cause Identified",
      desc: "LLMs isolate anomalies and compute match confidence.",
      icon: HelpCircle,
      isActive: hasAnalysis || (isLoading && (loadingStep.includes("Analyzing") || loadingStep.includes("Synthesizing"))),
      isDone: hasAnalysis && !isLoading,
    },
    {
      id: "suggest",
      title: "Resolution Suggested",
      desc: "Detailed playbook and avoidance warnings generated.",
      icon: FileCheck,
      isActive: hasAnalysis,
      isDone: hasAnalysis && !isLoading,
    },
    {
      id: "stored",
      title: "Knowledge Stored",
      desc: "Post-mortem answers indexed to reinforce organizational memory.",
      icon: CheckSquare,
      isActive: false, // Highlights when the operator teaches the system
      isDone: false,
    },
  ];

  return (
    <div className="glass-card p-5.5 relative overflow-hidden h-full flex flex-col justify-between">
      {/* Absolute Grid details */}
      <div className="absolute inset-0 bg-grid-white/[0.012] bg-[size:14px_14px] pointer-events-none" />

      <div>
        <div className="flex items-center gap-2 border-b border-slate-850 pb-3 mb-5 justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
            <span className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase">
              Incident resolution timeline
            </span>
          </div>
          <span className="text-[9px] font-mono text-slate-500 bg-slate-950/40 px-2 py-0.5 rounded border border-slate-850">
            AUTO_SENSING
          </span>
        </div>

        {/* Real-time Vertical Step Stream */}
        <div className="relative z-10 pl-3 space-y-6">
          {/* Vertical Track bar */}
          <div className="absolute left-[20px] top-2 bottom-2 w-[2px] bg-slate-850 pointer-events-none">
            {/* Dynamic line glow */}
            <motion.div
              layout
              className="w-full bg-sky-500"
              initial={{ height: "15%" }}
              animate={{
                height: hasAnalysis
                  ? "85%"
                  : isLoading
                  ? "55%"
                  : "15%",
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </div>

          {stages.map((stage, idx) => {
            const isHighlight = stage.isDone || stage.isActive;
            const StageIcon = stage.icon;

            return (
              <div key={stage.id} className="flex gap-4 relative">
                {/* Node Dot / Circle */}
                <div className="relative z-10 shrink-0">
                  <motion.div
                    animate={{
                      scale: isHighlight ? 1.08 : 1.0,
                      borderColor: stage.isDone
                        ? "#10B981"
                        : stage.isActive
                        ? "#0EA5E9"
                        : "#334155",
                    }}
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      stage.isDone
                        ? "bg-emerald-500/10 text-emerald-400"
                        : stage.isActive
                        ? "bg-sky-500/10 text-sky-400"
                        : "bg-slate-950 text-slate-650"
                    }`}
                  >
                    <StageIcon className="w-4 h-4" />
                  </motion.div>

                  {/* Pulsing indicator under active node */}
                  {stage.isActive && !stage.isDone && (
                    <span className="absolute inset-0 rounded-full border border-sky-400/50 animate-ping pointer-events-none" />
                  )}
                </div>

                {/* Text Description Block */}
                <div>
                  <h4
                    className={`text-xs font-bold leading-normal transition-colors duration-300 ${
                      stage.isDone
                        ? "text-emerald-450"
                        : stage.isActive
                        ? "text-sky-305"
                        : "text-slate-500"
                    }`}
                  >
                    {stage.title}
                  </h4>
                  <p className="text-[10.5px] text-slate-450 leading-relaxed mt-0.5">
                    {stage.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mini state bulletin */}
      <div className="relative z-10 mt-6 pt-3.5 border-t border-slate-850/60 flex items-center justify-between text-[10px] font-mono text-slate-500 bg-slate-950/20 p-2.5 rounded-lg">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" />
          <span>REALTIME_COGNITIVE_FEED</span>
        </div>
        <span>{isLoading ? "TRIAGE_FLOWING" : hasAnalysis ? "PLAYBOOK_READY" : "AWAITING_ALERT"}</span>
      </div>
    </div>
  );
}
