import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { ToastMessage } from "../types";

interface NotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function Notification({ toasts, onDismiss }: NotificationProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => {
          let bgColor = "bg-slate-900/95 border-sky-500/30 text-sky-200";
          let Icon = Info;
          let iconColor = "text-sky-400";

          if (toast.type === "success") {
            bgColor = "bg-slate-900/95 border-emerald-500/30 text-emerald-200";
            Icon = CheckCircle;
            iconColor = "text-emerald-400";
          } else if (toast.type === "error") {
            bgColor = "bg-slate-900/95 border-rose-500/30 text-rose-200";
            Icon = AlertTriangle;
            iconColor = "text-rose-400";
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl ${bgColor}`}
            >
              <div className="mt-0.5">
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <div className="flex-1 text-sm font-sans font-medium tracking-tight pr-2">
                {toast.message}
              </div>
              <button
                onClick={() => onDismiss(toast.id)}
                className="text-slate-400 hover:text-slate-100 transition-colors p-0.5 rounded hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
