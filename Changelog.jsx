import { motion } from "framer-motion";

const RELEASES = [
  {
    version: "v4.0.2",
    date: "2026-08-19",
    tag: "LATEST",
    tagColor: "bg-red-600/20 text-red-400 border-red-600/30",
    dotColor: "bg-red-500",
    items: [
      "patched the hat render loop — brim no longer flickers on boot",
      "moved distribution to the drive. checksum row retired, link row born",
      "quieter on boot. the hypervisor heard nothing",
    ],
  },
  {
    version: "v4.0.0",
    date: "2026-06-02",
    tag: "MAJOR",
    tagColor: "bg-amber-600/20 text-amber-400 border-amber-600/30",
    dotColor: "bg-slate-600",
    items: [
      "shadow kernel rewritten from scratch",
      "4D landing page shipped — the hat learned to float",
      "zero-trace mode now default, not optional",
    ],
  },
  {
    version: "v3.3.7",
    date: "2026-02-14",
    tag: null,
    dotColor: "bg-slate-700",
    items: [
      "memory injection matrix v2",
      "went on a diet: 38mb total footprint",
      "valentine's release. we love those who know",
    ],
  },
  {
    version: "v1.0.0",
    date: "2025-10-31",
    tag: "GENESIS",
    tagColor: "bg-emerald-600/20 text-emerald-400 border-emerald-600/30",
    dotColor: "bg-slate-700",
    items: [
      "first copy leaks into the wild",
      "halloween, obviously",
      "one hat. one face. one copy.",
    ],
  },
];

export const Changelog = () => {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-red-400 mb-4">// version history</p>
          <h2 className="font-black uppercase tracking-tight text-2xl sm:text-3xl lg:text-4xl">
            Changelog
          </h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 top-2 bottom-2 w-px bg-[#1E2436]" />

          <div className="space-y-12">
            {RELEASES.map((release, i) => (
              <motion.div
                key={release.version}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative pl-8"
              >
                {/* Timeline dot */}
                <div className={`absolute left-[-4.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-[#08090E] ${release.dotColor}`} />

                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="font-mono text-sm text-slate-200 font-bold flex items-center gap-2">
                    <span className="text-red-500">→</span>
                    {release.version}
                  </span>
                  <span className="font-mono text-xs text-slate-600">{release.date}</span>
                  {release.tag && (
                    <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded border ${release.tagColor}`}>
                      {release.tag}
                    </span>
                  )}
                </div>

                <ul className="space-y-1.5">
                  {release.items.map((item, j) => (
                    <li key={j} className="font-mono text-xs text-slate-400 flex gap-2">
                      <span className="text-slate-600 shrink-0">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
