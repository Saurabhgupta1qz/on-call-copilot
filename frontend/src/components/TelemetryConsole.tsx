import React, { useState, useEffect, useRef } from "react";
import { Terminal, Trash2, Activity, Wifi } from "lucide-react";
import { ApiService } from "../services/api";

export interface LogEntry {
  id: string;
  timestamp: string;
  level: "INFO" | "SUCCESS" | "WARN" | "ERROR";
  source: "CLIENT" | "API" | "OUTPOST";
  message: string;
}

interface TelemetryConsoleProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

export default function TelemetryConsole({ logs, onClearLogs }: TelemetryConsoleProps) {
  const [filter, setFilter] = useState<string>("ALL");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const filteredLogs = logs.filter((log) => {
    if (filter === "ALL") return true;
    return log.level === filter;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case "SUCCESS":
        return "text-emerald-400";
      case "ERROR":
        return "text-rose-400";
      case "WARN":
        return "text-amber-400";
      default:
        return "text-sky-400";
    }
  };

  const getLevelBg = (level: string) => {
    switch (level) {
      case "SUCCESS":
        return "bg-emerald-500/10 border-emerald-500/20";
      case "ERROR":
        return "bg-rose-500/10 border-rose-500/20";
      case "WARN":
        return "bg-amber-500/10 border-amber-500/20";
      default:
        return "bg-sky-500/10 border-sky-500/20";
    }
  };

  return (
    <div className="glass-card p-5 flex flex-col h-[340px] relative overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-sky-400" />
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-100 leading-none">
              Client & API Telemetry Console
            </h2>
            <p className="text-[10px] text-slate-450 font-mono mt-1">
              Active Outpost Target: {ApiService.getBaseUrl()}
            </p>
          </div>
        </div>

        {/* Console control filters */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-850">
            {["ALL", "INFO", "SUCCESS", "ERROR"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilter(lvl)}
                className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-tight transition-all cursor-pointer ${
                  filter === lvl
                    ? "bg-sky-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            onClick={onClearLogs}
            className="p-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title="Clear Console"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal log panel */}
      <div className="flex-1 bg-slate-950/80 rounded-xl border border-slate-850/85 p-4 font-mono text-xs flex flex-col overflow-hidden relative shadow-inner">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar text-[11px]"
        >
          {filteredLogs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center gap-2">
              <Activity className="w-6 h-6 text-slate-600 animate-pulse" />
              <p>Console silent. Initiate analysis or train models to stream telemetry.</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-2.5 transition-all py-1 border-b border-slate-900/40 hover:bg-slate-900/20"
              >
                {/* Timestamp */}
                <span className="text-slate-500 shrink-0 select-none">[{log.timestamp}]</span>

                {/* Level Tag */}
                <span
                  className={`px-1.5 py-0.5 rounded text-[8px] font-bold border uppercase shrink-0 tracking-wider ${getLevelColor(
                    log.level
                  )} ${getLevelBg(log.level)}`}
                >
                  {log.level}
                </span>

                {/* Source Tag */}
                <span className="text-slate-400 font-bold shrink-0">[{log.source}]</span>

                {/* Log message */}
                <span className="text-slate-350 break-all leading-relaxed whitespace-pre-wrap">
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Live indicator tag at the terminal base */}
        <div className="absolute bottom-2 right-4 flex items-center gap-1.5 bg-slate-900 px-2 py-0.5 rounded border border-slate-850 text-[9px] text-slate-400 select-none">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span>SYS_CONN: STABLE</span>
        </div>
      </div>
    </div>
  );
}
