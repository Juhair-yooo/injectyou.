import "@/App.css";
import { Toaster } from "@/components/ui/sonner";
import { BootIntro } from "@/components/BootIntro";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { OsPreview } from "@/components/OsPreview";
import { TerminalSim } from "@/components/TerminalSim";
import { Bento } from "@/components/Bento";
import { Changelog } from "@/components/Changelog";
import { DownloadHub } from "@/components/DownloadHub";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { EasterEgg } from "@/components/EasterEgg";

function App() {
  return (
    <div className="App scanlines bg-[#08090E] text-slate-100">
      <BootIntro />
      <Navbar />
      <Hero />
      <OsPreview />
      <TerminalSim />
      <Bento />
      <Changelog />
      <DownloadHub />
      <Faq />
      <Footer />
      <EasterEgg />
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}

export default App;
