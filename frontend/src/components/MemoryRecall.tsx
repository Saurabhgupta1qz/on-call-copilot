import React, { useState, useEffect } from "react";
import { Brain, Sparkles, Target, Ban, CheckCircle, HelpCircle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface Memory {
  id: string;
  title: string;
  matchScore: number;
  rootCause: string;
  successfulFix: string;
  failedAttempt: string;
  tags: string[];
}

interface MemoryRecallProps {
  currentIncidentText: string | null;
  isAnalyzing: boolean;
}

const HISTORICAL_MEMORIES: Memory[] = [
  {
    id: "INC-101",
    title: "Database Connection Pool Exhaustion",
    matchScore: 92,
    rootCause: "Database connection pool size reached limit allocation under high transactional traffic.",
    successfulFix: "Increment application proxy pool limits to 50 and implement transaction timeout safeguards.",
    failedAttempt: "Scaling pool replicas dynamically (triggered subsequent DB lock storms).",
    tags: ["Postgres", "SQL", "Pool", "Scale"],
  },
  {
    id: "INC-104",
    title: "Redis Cluster Memory Allocation Overrun",
    matchScore: 87,
    rootCause: "Memory exceeded configured maxmemory thresholds resulting in user session evictions.",
    successfulFix: "Configure maxmemory-policy to volatile-lru and expand cache cluster allocation sizing.",
    failedAttempt: "Executing cold restarts of Redis service (nuked all active sessions).",
    tags: ["Redis", "Caching", "OOM"],
  },
  {
    id: "INC-103",
    title: "Stripe Webhook Gateway Timeout",
    matchScore: 91,
    rootCause: "External callback delays choked processing threads on the public ingest worker route.",
    successfulFix: "Offload request parsing to asynchronous Kafka queue pipelines with 200 responses immediately.",
    failedAttempt: "Implementing raw retries in the ingress threads (completely bottlenecked worker pools).",
    tags: ["Stripe", "Webhook", "Billing"],
  },
  {
    id: "INC-102",
    title: "AWS S3 SecToken Expiration",
    matchScore: 84,
    rootCause: "Transient security credentials expired before certificate rotators published credentials.",
    successfulFix: "Enforce persistent background renewal checks with hard crash-reboot triggers on auth failure.",
    failedAttempt: "Blindly restarting nodes (repeatedly failed using expired cached token profiles).",
    tags: ["AWS", "S3", "Auth", "Cert"],
  },
];

export default function MemoryRecall({ currentIncidentText, isAnalyzing }: MemoryRecallProps) {
  const [matchedMemories, setMatchedMemories] = useState<Memory[]>([]);

  useEffect(() => {
    if (!currentIncidentText) {
      // Default placeholder cards for initial demonstration
      setMatchedMemories(HISTORICAL_MEMORIES.slice(0, 2));
      return;
    }

    const normalizedText = currentIncidentText.toLowerCase();

    // Dynamically calculate score matches based on keywords to show a true "live recall" effect!
    const scored = HISTORICAL_MEMORIES.map((memory) => {
      let extraScore = 0;
      if (memory.id === "INC-101" && (normalizedText.includes("database") || normalizedText.includes("pool") || normalizedText.includes("postgres") || normalizedText.includes("connection"))) {
        extraScore = 12;
      } else if (memory.id === "INC-104" && (normalizedText.includes("redis") || normalizedText.includes("cache") || normalizedText.includes("limit") || normalizedText.includes("memory") || normalizedText.includes("oom"))) {
        extraScore = 11;
      } else if (memory.id === "INC-103" && (normalizedText.includes("stripe") || normalizedText.includes("webhook") || normalizedText.includes("timeout") || normalizedText.includes("billing"))) {
        extraScore = 10;
      } else if (memory.id === "INC-102" && (normalizedText.includes("aws") || normalizedText.includes("s3") || normalizedText.includes("token") || normalizedText.includes("credential") || normalizedText.includes("expired"))) {
        extraScore = 9;
      }

      const calculatedScore = extraScore > 0 ? Math.min(98, memory.matchScore + extraScore) : Math.max(20, memory.matchScore - 40 - Math.floor(Math.random() * 15));
      return {
        ...memory,
        matchScore: calculatedScore,
      };
    });

    // Sort by highest match score, show matches above 50% first
    const sorted = scored.sort((a, b) => b.matchScore - a.matchScore);
    setMatchedMemories(sorted);
  }, [currentIncidentText]);

  return (
    <div className="glass-card p-5 flex flex-col h-full relative overflow-hidden">
      {/* Absolute Grid Lines Backing for tech visual */}
      <div className="absolute inset-0 bg-grid-white/[0.015] bg-[size:16px_16px] pointer-events-none" />

      {/* Connection Flow Visual Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Brain className="w-5 h-5 text-sky-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-100 flex items-center gap-1.5">
              Historical Memory Recall
            </h3>
            <p className="text-[10px] text-sky-400 font-mono">
              Semantic lookup correlated from organizational logs
            </p>
          </div>
        </div>
        <span className="text-[10px] bg-sky-500/10 text-sky-400 font-mono px-3 py-0.5 rounded border border-sky-400/20 font-bold">
          {isAnalyzing ? "RECALLING..." : "INDEX SYNCED"}
        </span>
      </div>

      {/* SVG Animated Connection Lines Area */}
      {isAnalyzing && (
        <div className="absolute inset-x-0 top-14 h-4 overflow-hidden pointer-events-none z-10 bg-slate-900/30">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="8" x2="100%" y2="8" stroke="rgb(56, 189, 248)" strokeWidth="1.5" strokeDasharray="6 6" className="animate-marquee" style={{ strokeDashoffset: '20px' }} />
            <circle cx="50%" cy="8" r="4" fill="rgb(56, 189, 248)" className="animate-pulse" />
          </svg>
        </div>
      )}

      {/* Historical Incidents Container */}
      <div className="mt-4 flex-1 space-y-4 overflow-y-auto max-h-[380px] pr-1 custom-scrollbar relative z-10">
        {matchedMemories.map((memory, index) => {
          const isHighMatch = memory.matchScore >= 80;
          return (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border relative transition-all ${
                isHighMatch
                  ? "bg-slate-950/60 border-sky-500/20 shadow-[0_0_15px_-3px_rgba(14,165,233,0.1)]"
                  : "bg-slate-900/30 border-slate-800/80 grayscale opacity-70"
              } hover:border-sky-500/45 group`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      isHighMatch ? "bg-sky-500/10 text-sky-450 border border-sky-500/20" : "bg-slate-800 text-slate-400"
                    }`}>
                      {memory.id}
                    </span>
                    <h4 className="font-display font-medium text-xs text-slate-200 group-hover:text-sky-300 transition-colors">
                      {memory.title}
                    </h4>
                  </div>
                  <div className="flex gap-1.5 mt-1 flex-wrap">
                    {memory.tags.map((tag) => (
                      <span key={tag} className="text-[9px] text-slate-500 font-mono">
                        #{tag.toLowerCase()}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Score Indicator Badge */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center gap-1">
                    <Target className={`w-3.5 h-3.5 ${isHighMatch ? "text-sky-450" : "text-slate-500"}`} />
                    <span className={`font-mono text-xs font-bold ${isHighMatch ? "text-sky-300" : "text-slate-400"}`}>
                      {memory.matchScore}% Match
                    </span>
                  </div>

                  {/* Similarity Level bar */}
                  <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        isHighMatch ? "bg-sky-500" : "bg-slate-600"
                      }`}
                      style={{ width: `${memory.matchScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Memory Data Fields Structure */}
              <div className="mt-3.5 space-y-2.5 pt-3 border-t border-slate-900 text-[11px] leading-relaxed">
                <div>
                  <span className="text-[9px] uppercase font-mono font-bold text-amber-500 flex items-center gap-1.5">
                    <HelpCircle className="w-3 h-3 text-amber-500" />
                    Historical Root Cause:
                  </span>
                  <p className="text-slate-300 pl-4 mt-0.5 font-sans italic">
                    "{memory.rootCause}"
                  </p>
                </div>

                <div>
                  <span className="text-[9px] uppercase font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                    Successful Fix:
                  </span>
                  <p className="text-slate-150 pl-4 mt-0.5 font-medium">
                    {memory.successfulFix}
                  </p>
                </div>

                <div>
                  <span className="text-[9px] uppercase font-mono font-bold text-rose-450 flex items-center gap-1.5">
                    <Ban className="w-3 h-3 text-rose-400/80" />
                    Failed Attempt to Avoid:
                  </span>
                  <p className="text-slate-400 pl-4 mt-0.5">
                    {memory.failedAttempt}
                  </p>
                </div>
              </div>

              {/* Action Pulse Dot for highest matches */}
              {isHighMatch && (
                <div className="absolute top-2 right-2 flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-500"></span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Flow link visual indicator */}
      <div className="mt-4 pt-3.5 border-t border-slate-800/60 leading-none flex items-center justify-between text-[10px] text-slate-500 font-mono relative z-10">
        <span>KNOWLEDGE-BASE: ACTIVE</span>
        <div className="flex items-center gap-1 text-sky-400">
          <span>PIPELINE SYNCHRONIZED</span>
          <ArrowRight className="w-3 h-3 text-sky-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
