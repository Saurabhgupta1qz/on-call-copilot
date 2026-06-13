import React from "react";
import { AlertCircle, Play, Sparkles } from "lucide-react";

interface IncidentInputProps {
  onAnalyze: (incidentText: string) => void;
  isLoading: boolean;
  value: string;
  onChange: (value: string) => void;
}

export default function IncidentInput({ onAnalyze, isLoading, value, onChange }: IncidentInputProps) {
  const DEMO_INCIDENTS = [
    {
      label: "Database Pool Exhaustion",
      text: "Alert from Datadog: Postgres connection pool is completely exhausted in prod-db-01. Average query wait times spiked to 12s. Kubernetes logs show multiple API web workers throwing 'Could not acquire connection from database pool'. Real-time flash sale triggered our highest concurrent active user spike of the year.",
    },
    {
      label: "Stripe Webhook Timeout",
      text: "Prod Stripe billing service is failing to process invoices. Sentry logs: 'Timeout of 10000ms exceeded during Stripe webhook callback routing'. Payment confirmations are piling up, and customer accounts are not updating, threatening active subscriptions.",
    },
    {
      label: "Redis Memory Limit",
      text: "Cloud Redis cache cluster in production has hit its limits: 'OOM command not allowed when maxmemory > 'maxmemory' is set'. High application latency detected. Sessions are getting evicted, resulting in active shoppers getting logged out of checkout.",
    },
    {
      label: "AWS Credential Expiry",
      text: "Our core authentication microservice is failing to write files to persistent backup buckets. Error in container log: 'AmazonS3Exception: Access Denied / AWS Security Token has expired'. Rotating certificates took too long due to inactive cron job task.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onAnalyze(value);
  };

  const handleQuickClick = (text: string) => {
    onChange(text);
  };

  return (
    <div className="glass-card p-5.5 flex flex-col gap-4 h-full relative overflow-hidden">
      {/* Grid decorator backing */}
      <div className="absolute inset-0 bg-grid-white/[0.012] bg-[size:14px_14px] pointer-events-none" />

      <div className="flex items-center justify-between relative z-10 border-b border-slate-850 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/15">
            <AlertCircle className="w-4 h-4 text-sky-400" />
          </div>
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-widest">Incident Ingestion Console</h2>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          <span className="text-[10px] text-sky-400 font-mono font-bold uppercase tracking-wider">OUTPOST ONLINE</span>
        </div>
      </div>

      <p className="text-slate-400 text-xs leading-relaxed relative z-10">
        Paste production trace metrics, sentry tracebacks, or alerts below. The Hindsight Engine will cross-examine past outages instantly.
      </p>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4 relative z-10">
        <div className="relative flex-1">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isLoading}
            className="w-full h-48 bg-slate-950/70 border border-slate-850 focus:border-sky-500/80 rounded-xl p-4 text-xs md:text-sm font-mono placeholder:text-slate-650 focus:outline-none transition-all resize-none shadow-inner custom-scrollbar text-slate-105"
            placeholder="[SRE ALERT RAW INPUT PROFILE] Paste Sentry traceback details, Datadog triggers, or CLI logs... e.g., 'FATAL: database pool choked during active transaction'"
          />
          {value.length > 0 && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute bottom-3 right-3 text-[10px] text-slate-400 hover:text-slate-100 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 transition-all cursor-pointer font-bold uppercase"
            >
              Clear Console
            </button>
          )}
        </div>

        {/* Demo simulator trigger grid */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
              One Click Demo Scenarios (Pre-Filled)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_INCIDENTS.map((demo, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickClick(demo.text)}
                className="text-[10px] bg-slate-950/40 hover:bg-slate-950/80 text-slate-350 py-2 px-3 rounded-lg border border-slate-850 hover:border-sky-500/30 transition-all text-left truncate group cursor-pointer"
                title={demo.label}
              >
                <div className="font-bold text-slate-200 group-hover:text-sky-305 transition-colors truncate">
                  ⚡ {demo.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="w-full bg-sky-505 hover:bg-sky-500 disabled:opacity-40 text-slate-950 font-extrabold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-500/5 cursor-pointer text-xs uppercase tracking-widest"
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>ACTIVATING REASONING ENGINE...</span>
            </>
          ) : (
            <>
              <span>Analyse Incident Trace</span>
              <Play className="w-3 h-3 fill-current text-slate-950 ml-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
