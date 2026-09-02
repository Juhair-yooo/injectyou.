import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const KONAMI = [
  "arrowup", "arrowup",
  "arrowdown", "arrowdown",
  "arrowleft", "arrowright",
  "arrowleft", "arrowright",
  "b", "a",
];

export const EasterEgg = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let progress = [];
    const onKey = (e) => {
      progress = [...progress, e.key.toLowerCase()].slice(-KONAMI.length);
      if (progress.join(",") === KONAMI.join(",")) {
        setOpen(true);
        toast.success("access granted", { description: "you were always one of them." });
        progress = [];
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-testid="easter-egg-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[110] bg-black/95 backdrop-blur flex flex-col items-center justify-center cursor-pointer px-6 text-center"
        >
          <motion.img
            src="/logo.png"
            alt="the hat knows"
            initial={{ scale: 0.4, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 50, damping: 10 }}
            className="w-48 sm:w-64 object-contain drop-shadow-[0_0_40px_rgba(239,68,68,0.6)] animate-bounce"
            style={{ animationDuration: "3s" }}
            draggable={false}
          />
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-black uppercase tracking-tight text-4xl sm:text-5xl lg:text-6xl text-red-500 mt-10"
          >
            you know.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="font-mono text-xs sm:text-sm text-slate-400 mt-6 tracking-[0.25em] uppercase"
          >
            its a copy of an os. and you always knew.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            data-testid="easter-egg-dismiss-hint"
            className="font-mono text-[10px] text-slate-600 mt-12 uppercase tracking-[0.3em]"
          >
            click anywhere to go back to not knowing
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
