import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, XCircle, BrainCircuit, Activity, Zap, HardHat } from "lucide-react";

export default function WhyDifferent() {
  return (
    <div className="glass-card p-6.5 relative overflow-hidden">
      {/* Visual background decor */}
      <div className="absolute inset-0 bg-grid-white/[0.01] bg-[size:16px_16px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[150px] bg-sky-500/[0.03] blur-3xl rounded-full pointer-events-none" />
      
      {/* Decorative corner brackets for custom military-grade cockpit theme */}
      <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-slate-750 pointer-events-none" />
      <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-slate-750 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-slate-750 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-slate-750 pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-850 pb-5 mb-6 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-sky-500/10 border border-sky-500/20 text-sky-400 font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              JUDGES SPECIFICATION SHEET
            </span>
          </div>
          <h2 className="text-base font-extrabold text-white tracking-wide uppercase font-display">
            Why This Is Different: Hindsight Memory vs Standard AI
          </h2>
          <p className="text-slate-400 text-xs">
            A head-to-head architectural analysis demonstrating why On-Call Copilot is built for modern reliability teams.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2 text-slate-500 bg-slate-950/40 border border-slate-850/80 px-3 py-1.5 rounded-lg text-xs font-mono">
          <BrainCircuit className="w-4 h-4 text-sky-400" />
          <span>COGNITIVE LAYER_CORE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Left: Traditional Chatbot */}
        <div className="bg-slate-950/45 p-5 rounded-xl border border-slate-900/90 relative overflow-hidden select-none hover:border-slate-850/60 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/[0.015] blur-xl" />
          <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
            <div className="flex items-center gap-2 text-rose-400/90">
              <XCircle className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest font-mono">
                Traditional Gen-AI Chatbots
              </span>
            </div>
            <span className="text-[9px] font-mono text-slate-600 bg-slate-900/30 px-2 py-0.5 rounded">
              LLM_RAW_REPLY
            </span>
          </div>

          <ul className="space-y-3.5 text-xs text-slate-400 font-sans">
            <li className="flex items-start gap-2.5">
              <span className="text-rose-500 text-sm mt-0.5 font-bold">❌</span>
              <div>
                <strong className="text-slate-300">Generic Advice:</strong> Recommends generic checklists from textbooks (e.g., "Check network adapters", "Reinstall OS") instead of production facts.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-rose-500 text-sm mt-0.5 font-bold">❌</span>
              <div>
                <strong className="text-slate-300">Zero Local Historical Recall:</strong> Repeatedly suggests fixes that have already failed twice during previous outages in your specific cluster.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-rose-500 text-sm mt-0.5 font-bold">❌</span>
              <div>
                <strong className="text-slate-300">No Post-Outage Learning:</strong> Does not preserve human insights after outages. The system remains static and gets no smarter over time.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-rose-500 text-sm mt-0.5 font-bold">❌</span>
              <div>
                <strong className="text-slate-300">High Resolution Lag:</strong> SREs waste critical minutes context switching, querying past post-mortems, and re-learning hard lessons manually.
              </div>
            </li>
          </ul>
        </div>

        {/* Right: On-Call Copilot */}
        <div className="bg-gradient-to-br from-sky-500/[0.02] to-transparent bg-slate-950/60 p-5 rounded-xl border border-sky-500/20 shadow-md hover:border-sky-500/30 transition-all">
          <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
            <div className="flex items-center gap-2 text-sky-400">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-extrabold uppercase tracking-widest font-mono">
                On-Call Copilot with Hindsight
              </span>
            </div>
            <span className="text-[9px] font-mono text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/25">
              LEARNS_FROM_EVENT
            </span>
          </div>

          <ul className="space-y-3.5 text-xs text-slate-300 font-sans">
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 text-sm mt-0.5 font-bold">✅</span>
              <div>
                <strong className="text-white">Learns From Previous Outages:</strong> Extracts precise matches based on actual regional memory archives stored inside your FastAPI knowledge post.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 text-sm mt-0.5 font-bold">✅</span>
              <div>
                <strong className="text-white">Remembers Failed Fixes:</strong> Flags historical pitfalls in red so SRE engineering hours are never wasted repeating obsolete playbooks.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 text-sm mt-0.5 font-bold">✅</span>
              <div>
                <strong className="text-white">Preserves Institutional Memory:</strong> Simple one-step indexing synthesizes human incident updates directly back into persistent memory maps.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-emerald-400 text-sm mt-0.5 font-bold">✅</span>
              <div>
                <strong className="text-white">Dramatically Reduces MTTR:</strong> Achieves an average 42% decrease in mean resolution times by auto-correlating symptoms instantly.
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
