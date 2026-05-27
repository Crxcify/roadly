import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronDown, Mail, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/app/help")({ component: Help });

const FAQ = [
  { q: "How does drive tracking work?", a: "Roadly uses your phone's GPS to measure speed, distance, cornering and braking smoothness. You can grant location access when starting a drive, or use the built-in simulator if you'd rather not share GPS." },
  { q: "Is my data private?", a: "All your drives, scores and personal info are stored locally on this device. Nothing is uploaded to a server." },
  { q: "How are drive scores calculated?", a: "Each drive is scored 0–10 from four factors: braking smoothness, cornering, speed consistency and observation (variation in heading). Smoother and steadier driving scores higher." },
  { q: "Can I change my name or car?", a: "Yes — go to Profile and tap the pencil icon. Your name, car brand and model can all be edited." },
  { q: "What's the difference between Quick Practice and Mock Test?", a: "Quick Practice is a short 5-question drill on a single topic. The Mock Test pulls 10 random questions from every category, mimicking the real driving theory test." },
  { q: "How do I reset all my progress?", a: "Open the More tab and tap 'Reset all data' at the bottom. This clears drives, scores, streak and onboarding." },
];

function Help() {
  const navigate = useNavigate();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="px-5 pt-2 pb-2">
      <div className="flex items-center gap-3 py-2">
        <button onClick={() => navigate({ to: "/app/more" })} className="p-1 -ml-1"><ChevronLeft className="h-5 w-5" /></button>
        <p className="text-sm font-semibold">Help & Support</p>
      </div>

      <p className="text-xs text-muted-foreground mt-2">Frequently asked questions</p>
      <div className="mt-2 space-y-2">
        {FAQ.map((f, i) => (
          <button key={i} onClick={() => setOpen(open === i ? null : i)}
            className="w-full text-left bg-surface-2 rounded-2xl p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">{f.q}</p>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${open === i ? "rotate-180" : ""}`} />
            </div>
            {open === i && <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{f.a}</p>}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-6">Get in touch</p>
      <div className="mt-2 space-y-2">
        <a href="mailto:support@roadly.app" className="flex items-center gap-3 bg-surface-2 rounded-2xl p-4">
          <Mail className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-semibold">Email support</p>
            <p className="text-xs text-muted-foreground">support@roadly.app — reply within 24h</p>
          </div>
        </a>
        <a href="#" className="flex items-center gap-3 bg-surface-2 rounded-2xl p-4">
          <MessageCircle className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-semibold">Live chat</p>
            <p className="text-xs text-muted-foreground">Mon–Fri, 9am–6pm</p>
          </div>
        </a>
      </div>
    </div>
  );
}
