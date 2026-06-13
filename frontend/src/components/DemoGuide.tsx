import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Trophy, Play, CheckCircle2, RefreshCw, HelpCircle, ArrowRight } from "lucide-react";

interface DemoGuideProps {
  onLoadPreset: (text: string) => void;
  onAnalyze: (text: string) => void;
  onTeach: (text: string) => void;
  onReset: () => void;
  analysisExists: boolean;
  isAnalyzing: boolean;
  totalResolvedIncidents: number;
}

export default function DemoGuide({
  onLoadPreset,
  onAnalyze,
  onTeach,
  onReset,
  analysisExists,
  isAnalyzing,
  totalResolvedIncidents,
}: DemoGuideProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isDismissed, setIsDismissed] = useState(false);

  const demoSteps = [
    {
      step: 1,
      title: "Select an SRE Incident Preset",
      desc: "For maximum wow-factor, click the 'DB connection pool exhausted' or 'S3 Bucket Rate Limit' preset in the Ingestion Console, or click below to pre-load a Sentry crash trace.",
      actionLabel: "⚡ Load Active DB Preset",
      action: () => {
        onLoadPreset(
          "FATAL: database connection pool exhausted at checkout node. Transaction lock storm detected on SRE production dashboard."
        );
        setCurrentStep(2);
      },
    },
    {
      step: 2,
      title: "Activate Cognitive Reasoning Engine",
      desc: "Click 'Analyze Incident' to run high-density semantic scans. Our Hindsight Memory engine queries Fast outposts to correlate incidents.",
      actionLabel: "🚀 Run Live Analysis",
      action: () => {
        onAnalyze(
          "FATAL: database connection pool exhausted at checkout node. Transaction lock storm detected on SRE production dashboard."
        );
        setCurrentStep(3);
      },
    },
    {
      step: 3,
      title: "Observe Multi-stage Triage Stream",
      desc: "Watch the Live Resolution Timeline and Interactive Loading progress checklist in real-time as Hindsight matches past outages.",
      actionLabel: "🔍 Proceed to Memory Recall",
      action: () => {
        setCurrentStep(4);
      },
    },
    {
      step: 4,
      title: "Inspect Historical Matches",
      desc: "Matched post-mortems appear under 'Historical Memory Recall' complete with similarity percentages, tags, failed actions, and successful fixes.",
      actionLabel: "🛠 Inspect Playbook Outputs",
      action: () => {
        setCurrentStep(5);
      },
    },
    {
      step: 5,
      title: "Train Regional Memory Hub",
      desc: "Simulate a live incident team feed: click below to pre-fill a new post-mortem and save it. It will instantly index into the memory size counter!",
      actionLabel: "📚 Load & Commit Post-Mortem",
      action: () => {
        onTeach(
          `INC-551\nTitle: Stripe Gateway Timeout\nRoot Cause: Sequential webhook network hops on payment callbacks.\nFix: Configure asyncio webhook routers and cache idempotent results.\nFailed Attempt: Retrying sequentially inside the transaction loop.`
        );
        setCurrentStep(6);
      },
    },
    {
      step: 6,
      title: "Outage Mitigated!",
      desc: "You have completed the full incident Commander flow. Organizational intelligence expanded! Reset anytime to run another outage simulator.",
      actionLabel: "🔄 Reset Walkthrough Flow",
      action: () => {
        onReset();
        setCurrentStep(1);
      },
    },
  ];

  if (isDismissed) return null;

  const currentStepData = demoSteps[currentStep - 1] || demoSteps[0];

  return (
    <div className="bg-gradient-to-r from-sky-950/40 via-indigo-950/20 to-slate-950/50 border border-sky-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden backdrop-blur-sm">
      {/* Decorative neon gradient glow */}
      <div className="absolute top-0 right-0 w-[200px] h-full bg-gradient-to-l from-sky-500/5 to-transparent pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-sky-400">
              Interactive Demo Day Presentation Guide
            </span>
          </div>

          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-display flex items-center gap-1.5 mt-1">
            <Trophy className="w-4 h-4 text-sky-400 animate-pulse" />
            Judge Guided Journey • Step {currentStep} of 6: {currentStepData.title}
          </h3>

          <p className="text-slate-300 text-xs max-w-3xl leading-relaxed mt-1">
            {currentStepData.desc}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
          <button
            onClick={currentStepData.action}
            disabled={isAnalyzing && currentStep === 2}
            className="bg-sky-500 hover:bg-sky-450 disabled:opacity-40 text-slate-950 font-extrabold text-[10.5px] px-4 py-2 rounded-xl transition-all shadow-lg shadow-sky-500/10 cursor-pointer uppercase tracking-wider flex items-center gap-1"
          >
            {currentStepData.actionLabel}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="text-[10px] text-slate-500 hover:text-slate-300 font-mono tracking-tight font-bold cursor-pointer underline px-2 hover:bg-slate-900/50 py-1.5 rounded"
          >
            Hide helper
          </button>
        </div>
      </div>

      {/* Progress tick bar indicator */}
      <div className="flex gap-1.5 mt-4 border-t border-slate-900/60 pt-3">
        {demoSteps.map((s) => (
          <div
            key={s.step}
            onClick={() => setCurrentStep(s.step)}
            className={`h-1 cursor-pointer rounded-full flex-1 transition-all ${
              s.step === currentStep
                ? "bg-sky-450"
                : s.step < currentStep
                ? "bg-emerald-500"
                : "bg-slate-800"
            }`}
            title={`Step ${s.step}: ${s.title}`}
          />
        ))}
      </div>
    </div>
  );
}
