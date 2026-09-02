import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MonitorPlay } from "lucide-react";

const PROCS = [
  ["hat.sys", "guardian", "12.1mb"],
  ["inject.ko", "kernel mod", "8.4mb"],
  ["vmkeeper", "watcher", "6.9mb"],
  ["youknow.d", "daemon", "4.2mb"],
];

const Window = ({ id, title, top, setTop, constraintsRef, className, children, testId }) => (
  <motion.div
    drag
    dragConstraints={constraintsRef}
    dragMomentum={false}
    onMouseDown={() => setTop(id)}
    data-testid={testId}
    style={{ zIndex: top === id ? 30 : 10 }}
    whileDrag={{ scale: 1.02 }}
    className={`absolute rounded-xl border border-[#1E2436] bg-[#0F121C]/95 backdrop-blur shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden cursor-grab active:cursor-grabbing ${className}`}
  >
    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#1E2436] bg-[#0B0E16] select-none">
      <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
      <span className="ml-2 font-mono text-xs text-slate-400">{title}</span>
    </div>
    <div className="p-4 cursor-default">{children}</div>
  </motion.div>
);

const Meter = ({ label, value, testId }) => (
  <div>
    <div className="flex justify-between font-mono text-xs text-slate-400 mb-1.5">
      <span>{label}</span>
      <span data-testid={testId} className="text-red-400">{value}%</span>
    </div>
    <div className="h-2 rounded-full bg-[#1E2436] overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-red-700 to-red-500 transition-all duration-700"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export const OsPreview = () => {
  const constraintsRef = useRef(null);
  const [top, setTop] = useState("proc");
  const [cpu, setCpu] = useState(23);
  const [ram, setRam] = useState(38);

  useEffect(() => {
    const t = setInterval(() => {
      setCpu((c) => Math.min(97, Math.max(4, Math.round(c + (Math.random() - 0.5) * 22))));
      setRam((r) => Math.min(94, Math.max(21, Math.round(r + (Math.random() - 0.5) * 10))));
    }, 900);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-red-400 mb-4">// peek inside</p>
          <h2 className="font-black uppercase tracking-tight text-2xl sm:text-3xl lg:text-4xl mb-4">
            The copy, running live
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mb-10 flex items-center gap-2">
            <MonitorPlay className="w-4 h-4 text-red-500" /> drag the windows around. it's your VM now.
          </p>
        </motion.div>

        <div
          ref={constraintsRef}
          data-testid="os-preview-container"
          className="relative h-[560px] rounded-2xl border border-[#1E2436] bg-[#0B0E16] overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(30,36,54,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(30,36,54,0.3) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        >
          <div className="absolute top-4 left-1/2 -translate-x-1/2 font-mono text-xs text-slate-600 uppercase tracking-[0.3em] select-none">
            inJectyou OS · live preview
          </div>

          <Window
            id="proc"
            title="process manager"
            top={top}
            setTop={setTop}
            constraintsRef={constraintsRef}
            testId="os-preview-window-proc"
            className="left-4 sm:left-16 top-16 w-[85vw] sm:w-96"
          >
            <div className="space-y-4 mb-5">
              <Meter label="virtual cpu" value={cpu} testId="os-cpu-meter-display" />
              <Meter label="shadow ram" value={ram} testId="os-ram-meter-display" />
            </div>
            <table className="w-full font-mono text-xs">
              <tbody>
                {PROCS.map(([name, role, mem]) => (
                  <tr key={name} className="border-b border-[#1E2436] last:border-0">
                    <td className="py-2 text-slate-200">{name}</td>
                    <td className="py-2 text-slate-500">{role}</td>
                    <td className="py-2 text-emerald-400 text-right">{mem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Window>

          <Window
            id="notes"
            title="notes.txt"
            top={top}
            setTop={setTop}
            constraintsRef={constraintsRef}
            testId="os-preview-window-notes"
            className="right-4 sm:right-16 top-40 w-[80vw] sm:w-80"
          >
            <p className="font-mono text-xs sm:text-sm text-slate-300 leading-relaxed">
              its a copy of an os if you know you know.
              <br /><br />
              - do not feed the hat after midnight
              <br />
              - the hypervisor suspects nothing
              <br />
              - uptime is a state of mind
            </p>
          </Window>

          <Window
            id="hatcam"
            title="hatcam — live"
            top={top}
            setTop={setTop}
            constraintsRef={constraintsRef}
            testId="os-preview-window-hatcam"
            className="left-[20%] sm:left-[38%] bottom-6 w-56"
          >
            <div className="flex flex-col items-center">
              <img
                src="/logo.png"
                alt="hatcam feed"
                className="w-24 object-contain animate-bounce"
                style={{ animationDuration: "3s" }}
                draggable={false}
              />
              <p className="font-mono text-[10px] text-emerald-400 mt-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                REC · anomaly visible
              </p>
            </div>
          </Window>
        </div>
      </div>
    </section>
  );
};
