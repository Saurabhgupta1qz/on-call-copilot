import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, ChevronRight, GraduationCap, HardDriveDownload, Sparkles } from "lucide-react";

interface TeachSystemProps {
  onTeach: (text: string) => Promise<boolean>;
}

export default function TeachSystem({ onTeach }: TeachSystemProps) {
  const [draftText, setDraftText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftText.trim() || isSaving) return;

    setIsSaving(true);
    const success = await onTeach(draftText);
    setIsSaving(false);

    if (success) {
      setSavedSuccess(true);
      setDraftText("");
      setTimeout(() => {
        setSavedSuccess(false);
      }, 5000);
    }
  };

  const loadExample = () => {
    setDraftText(`INC-109
Title: S3 Bucket Rate Limiting Outage

Root Cause:
Application made raw list-objects calls sequentially. High traffic spikes led AWS to rate limit our bucket requests.

Fix:
Enable S3 prefix distribution and configure client-side exponential backoff retries.

Failed Attempt:
Adding more container memory limits, which actually increased concurrent thread crashes.

Customer Message:
Temporary latency when uploading cloud avatars.`);
  };

  return (
    <div className="glass-card p-5 border-emerald-500/20 shrink-0 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            📊 Teach the System
            <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-bold uppercase tracking-wider font-mono">
              Training Mode
            </span>
          </h2>
        </div>
        
        <p className="text-xs text-slate-400 mb-4">
          New post-mortem knowledge? Add it to the organizational memory database.
        </p>

        <AnimatePresence mode="wait">
          {!savedSuccess ? (
            <motion.form
              key="teach-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="relative">
                <textarea
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  disabled={isSaving}
                  className="w-full h-36 bg-slate-900 border border-slate-700/80 rounded-xl p-3.5 text-xs font-sans text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all resize-none shadow-sm custom-scrollbar"
                  placeholder="Incident link or resolution summary..."
                />
                
                {draftText.length === 0 && (
                  <button
                    type="button"
                    onClick={loadExample}
                    className="absolute top-3 right-3 text-[9px] bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 px-2 py-1 rounded transition-colors cursor-pointer"
                  >
                    Load Sample Post-Mortem
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isSaving || !draftText.trim()}
                className="w-full bg-slate-700 hover:bg-slate-600 text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/45 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    <span>Saving Knowledge...</span>
                  </>
                ) : (
                  <>
                    <HardDriveDownload className="w-3.5 h-3.5" />
                    <span>Save Knowledge</span>
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="save-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-emerald-950/20 border border-emerald-500/25 rounded-xl p-5 text-center space-y-4 shadow-lg shadow-emerald-950/10 my-2"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-emerald-400 font-display font-bold text-sm uppercase tracking-wider">
                  📚 Knowledge Stored
                </h4>
                <p className="text-slate-400 text-xs mt-1 max-w-xs mx-auto leading-relaxed">
                  Post-mortem indexed into regional SRE backplane successfully.
                </p>
              </div>

              {/* Dynamic Cascade Checkpoints */}
              <div className="text-left bg-slate-950/60 p-3 rounded-lg border border-slate-900 space-y-2">
                {[
                  "🛰️ Knowledge Graph Updated",
                  "🧠 Organizational Memory Expanded",
                  "🛡️ Future Incidents Will Benefit"
                ].map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.15 }}
                    className="flex items-center gap-2 text-[11px] font-mono font-bold text-emerald-405"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span>{point}</span>
                  </motion.div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setSavedSuccess(false)}
                className="text-[10px] text-emerald-400 hover:text-emerald-350 font-mono uppercase tracking-wider flex items-center gap-1 mx-auto transition-colors mt-2 font-bold hover:underline cursor-pointer"
              >
                Index another post-mortem <ChevronRight className="w-3.5 h-3.5 animate-pulse" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/40 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
        <Sparkles className="w-3 h-3 text-emerald-500" />
        <span>Synthesized into semantic indexes automatically</span>
      </div>
    </div>
  );
}
