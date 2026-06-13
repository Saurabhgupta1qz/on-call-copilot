import React, { useState } from "react";
import { motion } from "motion/react";
import { Bell, Server, Database, Brain, FileText, ChevronRight, Zap } from "lucide-react";

export default function ArchitectureVisual() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodes = [
    {
      id: "alert",
      title: "Production Alert",
      subtitle: "Ingestion Core",
      icon: Bell,
      color: "border-rose-500/30 text-rose-400 bg-rose-500/5",
      glow: "shadow-[0_0_12px_rgba(239,68,68,0.15)]",
      desc: "Raw Sentry alert, metric trigger or CLI trace ingested via high-density API.",
    },
    {
      id: "fastapi",
      title: "FastAPI Router",
      subtitle: "Regional Outpost",
      icon: Server,
      color: "border-sky-500/30 text-sky-400 bg-sky-500/5",
      glow: "shadow-[0_0_12px_rgba(14,165,233,0.15)]",
      desc: "FastAPI server receives payload and prepares local memory context query.",
    },
    {
      id: "hindsight",
      title: "Hindsight Memory",
      subtitle: "Semantic Graph",
      icon: Database,
      color: "border-amber-500/30 text-amber-400 bg-amber-500/5",
      glow: "shadow-[0_0_12px_rgba(245,158,11,0.15)]",
      desc: "SRE memory database running cosine similarity searches to match historical outages.",
    },
    {
      id: "reasoning",
      title: "Groq Reasoning",
      subtitle: "Llama-3 Cloud Core",
      icon: Brain,
      color: "border-purple-500/30 text-purple-400 bg-purple-500/5",
      glow: "shadow-[0_0_12px_rgba(168,85,247,0.15)]",
      desc: "Groq hardware clusters run zero-shot inference with paired historical cases.",
    },
    {
      id: "playbook",
      title: "SRE Playbook",
      subtitle: "Resolution Plan",
      icon: FileText,
      color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5",
      glow: "shadow-[0_0_12px_rgba(16,185,129,0.15)]",
      desc: "Actionable playbook generated featuring precise root causes, fixes and pitfalls.",
    },
  ];

  return (
    <div className="glass-card p-6.5 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-grid-white/[0.008] bg-[size:16px_16px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[100px] bg-gradient-to-r from-sky-500/5 via-indigo-500/5 to-purple-500/5 blur-3xl pointer-events-none" />

      {/* Brackets */}
      <div className="absolute top-3 left-3 w-3.5 h-3.5 border-t-2 border-l-2 border-slate-750 pointer-events-none" />
      <div className="absolute top-3 right-3 w-3.5 h-3.5 border-t-2 border-r-2 border-slate-750 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-3.5 h-3.5 border-b-2 border-l-2 border-slate-750 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-3.5 h-3.5 border-b-2 border-r-2 border-slate-750 pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-6 border-b border-slate-850/70 relative z-10">
        <div>
          <span className="text-[10px] bg-sky-500/10 border border-sky-500/25 text-sky-400 font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            SYSTEM_ARCHITECTURE_MAP
          </span>
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-display mt-2 flex items-center gap-1.5">
            Real-time Resolution Pipeline <Zap className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">
            Interactive system flow schema. Hover nodes to inspect pipeline operational stages.
          </p>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">
          STATUS: COMPREHENSIVE_ONLINE
        </div>
      </div>

      {/* Visual horizontal chain flow */}
      <div className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          
          {nodes.map((node, index) => {
            const Icon = node.icon;
            const isHovered = hoveredNode === node.id;
            
            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <motion.div
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-xl border text-center relative transition-all duration-300 flex flex-col justify-between min-h-[140px] cursor-pointer ${
                    isHovered 
                      ? `${node.glow} bg-slate-950 border-sky-400/40`
                      : "bg-slate-950/40 border-slate-850"
                  }`}
                >
                  {/* Icon */}
                  <div className={`mx-auto w-10 h-10 rounded-lg border flex items-center justify-center ${node.color} ${isHovered ? 'scale-110 transition-transform' : ''}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Title & Sub */}
                  <div className="mt-2.5">
                    <h4 className="text-xs font-bold text-slate-205 tracking-wide uppercase">
                      {node.title}
                    </h4>
                    <span className="text-[9px] font-mono font-bold text-slate-450 block mt-0.5 uppercase">
                      {node.subtitle}
                    </span>
                  </div>

                  {/* Node Flow index dot */}
                  <span className="absolute top-2 left-2 text-[9px] font-mono text-slate-600 font-bold">
                    0{index + 1}
                  </span>

                  {/* Dynamic mini pulse */}
                  <span className="absolute top-2 right-2 flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400/30"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-505/20"></span>
                  </span>
                </motion.div>

                {/* Arrow connector for Desktop flow */}
                {index < nodes.length - 1 && (
                  <div className="hidden md:flex absolute items-center justify-center pointer-events-none"
                       style={{ 
                         left: `calc(${(index + 1) * 20}% - 14px)`, 
                         top: "35%", 
                         width: "28px" 
                       }}
                  >
                    <ChevronRight className="w-4 h-4 text-slate-700 animate-pulse h-10 shrink-0" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Informative overlay block */}
        <div className="mt-5 bg-slate-950/70 p-4.5 rounded-xl border border-slate-850 flex items-center gap-3 min-h-[64px] transition-all">
          <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-sky-500/10 text-sky-400">
            <Zap className="w-4 h-4 animate-bounce text-sky-450" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-sky-400 uppercase tracking-widest block leading-none">
              Pipeline State Machine
            </span>
            <p className="text-xs text-slate-300 mt-1">
              {hoveredNode 
                ? nodes.find(n => n.id === hoveredNode)?.desc
                : "Continuous cognitive loop handles telemetry patterns instantaneously, querying local fast organizational memories."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
