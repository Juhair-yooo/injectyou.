import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "[0.000000] injectyou bootloader v4.0.2",
  "[0.042013] mounting virtual layer........ ok",
  "[0.133742] hiding from hypervisor........ ok",
  "[0.388410] loading hat.sys............... ok",
  "[0.512009] verifying copy integrity...... pure",
  "[0.710666] if you know you know.......... confirmed",
  "[0.984201] starting anomaly.............. online",
];

export const BootIntro = () => {
  const [done, setDone] = useState(() => sessionStorage.getItem("ij_booted") === "1");
  const [lines, setLines] = useState([]);
  const [showLogo, setShowLogo] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (done) return;
    document.body.style.overflow = "hidden";
    let i = 0;
    const t = setInterval(() => {
      setLines((l) => [...l, BOOT_LINES[i]]);
      i += 1;
      if (i >= BOOT_LINES.length) {
        clearInterval(t);
        setTimeout(() => setShowLogo(true), 300);
        setTimeout(() => setFading(true), 2100);
        setTimeout(() => {
          sessionStorage.setItem("ij_booted", "1");
          document.body.style.overflow = "";
          setDone(true);
        }, 2900);
      }
    }, 240);
    return () => {
      clearInterval(t);
      document.body.style.overflow = "";
    };
  }, [done]);

  if (done) return null;

  return (
    <AnimatePresence>
      <div
        data-testid="boot-intro-overlay"
        className={`fixed inset-0 z-[100] bg-[#08090E] flex items-center justify-center transition-opacity duration-700 ${fading ? "opacity-0" : "opacity-100"}`}
      >
        <div className="w-full max-w-xl px-6">
          {!showLogo ? (
            <div data-testid="boot-intro-log" className="font-mono text-xs sm:text-sm text-slate-400 space-y-2">
              {lines.map((l, i) => (
                <motion.p key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
                  <span className="text-emerald-400">{l.split("]")[0]}]</span>
                  {l.split("]")[1]}
                </motion.p>
              ))}
              <p className="animate-pulse text-slate-400">_</p>
            </div>
          ) : (
            <motion.div
              data-testid="boot-intro-logo"
              initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 12 }}
              className="flex flex-col items-center text-center"
            >
              <img src="/logo.png" alt="inJectyou" className="w-40 sm:w-52 object-contain drop-shadow-[0_0_40px_rgba(239,68,68,0.6)]" />
              <p className="font-black uppercase tracking-tight text-2xl sm:text-3xl mt-6">
                welcome back
              </p>
              <p className="font-mono text-xs text-red-400 mt-3 tracking-[0.3em] uppercase">
                // the anomaly is online
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};
