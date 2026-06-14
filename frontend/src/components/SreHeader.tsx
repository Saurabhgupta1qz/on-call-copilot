import React, { useState } from "react";
import { Flame, Server, Brain, Zap, BookOpen, ShieldCheck } from "lucide-react";
import { ApiService } from "../services/api";

interface SreHeaderProps {
  onUrlChange?: (newUrl: string) => void;
}

export default function SreHeader({ onUrlChange }: SreHeaderProps) {
  const [backendUrl, setBackendUrl] = useState(ApiService.getBaseUrl());
  const [isEditingUrl, setIsEditingUrl] = useState(false);

  const handleUrlSave = (e: React.FormEvent) => {
    e.preventDefault();
    ApiService.setBaseUrl(backendUrl);
    setIsEditingUrl(false);
    if (onUrlChange) {
      onUrlChange(backendUrl);
    }
  };

  return (
    <div className="mx-auto max-w-7xl w-full px-6 pt-6">
      <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between glass-card px-6 py-5 relative overflow-hidden shrink-0 z-10 gap-6">
        {/* Visual background lights for Modern Ops aesthetics */}
        <div className="absolute top-0 right-[20%] w-[350px] h-[100px] bg-sky-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center primary-glow shrink-0 transition-transform hover:scale-105 duration-200">
            <Flame className="w-6 h-6 text-slate-900 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-2xl font-display font-extrabold tracking-tight text-white leading-none">
                ON-CALL COPILOT
              </h1>
              <span className="text-[9px] px-2 py-0.5 rounded-full border border-sky-500/20 bg-sky-950/40 text-sky-400 font-mono font-bold leading-none">
                ENTERPRISE V3.0
              </span>
            </div>
            <p className="text-slate-250 text-sm font-semibold tracking-tight mt-1 mb-0.5 font-display">
              AI Incident Commander with Organizational Memory
            </p>
            <p className="text-sky-400 text-xs italic font-medium opacity-90">
              "Learn from every outage. Resolve the next one faster."
            </p>
          </div>
        </div>

        {/* Backend Target Settings UI */}
        <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
          <form onSubmit={handleUrlSave} className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-full border border-slate-800/80">
            <Server className="w-3.5 h-3.5 text-slate-400 ml-2.5" />
            {isEditingUrl ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                  className="bg-slate-900 text-slate-200 text-xs font-mono rounded px-2 py-0.5 border border-slate-700 focus:outline-none focus:border-sky-500 max-w-[200px]"
                  placeholder="https://on-call-copilot.onrender.com"
                  autoFocus
                />
                <button
                  type="submit"
                  className="text-[10px] bg-sky-500 hover:bg-sky-450 text-slate-950 px-2.5 py-1 rounded-full font-bold cursor-pointer transition-colors"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-350 bg-slate-900/40 px-2.5 py-0.5 rounded-full border border-slate-800/80">
                  {backendUrl}
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingUrl(true)}
                  className="text-[10px] hover:text-sky-400 text-slate-400 mr-2.5 font-mono hover:underline cursor-pointer"
                >
                  Change Target
                </button>
              </div>
            )}
          </form>

          {/* Live system status Indicator */}
          <div className="flex items-center gap-2 bg-slate-950/65 px-3 py-1.5 rounded-full border border-slate-800/80 text-xs font-mono">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400"></span>
            </div>
            <span className="text-[10px] font-bold text-slate-300">
              FASTAPI OUTPOST
            </span>
          </div>
        </div>
      </header>

      {/* Row of Enterprise Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {[
          { text: "Memory Powered", icon: Brain, color: "text-sky-400 bg-sky-500/5 border-sky-500/20" },
          { text: "Instant Root Cause Analysis", icon: Zap, color: "text-amber-400 bg-amber-500/5 border-amber-500/20" },
          { text: "Continuous Learning", icon: BookOpen, color: "text-emerald-400 bg-emerald-500/5 border-emerald-500/20" },
          { text: "Enterprise Reliability", icon: ShieldCheck, color: "text-purple-400 bg-purple-500/5 border-purple-500/20" }
        ].map((badge, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border font-sans text-xs font-semibold ${badge.color} transition-all duration-300 hover:scale-[1.02] hover:bg-slate-900/25`}
          >
            <badge.icon className="w-4 h-4 shrink-0 animate-pulse" />
            <span>{badge.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

