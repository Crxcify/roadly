import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Check, Crown, Sparkles } from "lucide-react";
import { setPremium, useRoadly } from "@/lib/store";

export const Route = createFileRoute("/app/premium")({ component: Premium });

const FEATURES = [
  "Unlimited mock tests with full review",
  "All hazard perception clips",
  "Advanced drive analytics & route replay",
  "Personalised study plan based on weak areas",
  "Offline lessons & ad-free experience",
];

function Premium() {
  const navigate = useNavigate();
  const premium = useRoadly((s) => s.premium);
  const premiumSince = useRoadly((s) => s.premiumSince);
  const [plan, setPlan] = useState<"monthly" | "yearly">("yearly");

  if (premium) {
    return (
      <div className="px-5 pt-2 pb-2">
        <div className="flex items-center gap-3 py-2">
          <button onClick={() => navigate({ to: "/app/more" })} className="p-1 -ml-1"><ChevronLeft className="h-5 w-5" /></button>
          <p className="text-sm font-semibold">Roadly Premium</p>
        </div>

        <div className="mt-3 bg-gradient-to-br from-primary/90 to-primary text-primary-foreground rounded-3xl p-5">
          <div className="flex items-center gap-2">
            <Crown className="h-7 w-7" />
            <Sparkles className="h-5 w-5 opacity-80" />
          </div>
          <p className="text-2xl font-extrabold mt-2 leading-tight">You're Premium.</p>
          <p className="text-xs opacity-80 mt-2">
            Member since {premiumSince ? new Date(premiumSince).toLocaleDateString([], { dateStyle: "medium" }) : "today"}.
          </p>
        </div>

        <ul className="mt-5 space-y-2">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-3 bg-surface-2 rounded-2xl p-3">
              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">{f}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => navigate({ to: "/app/home" })}
          className="mt-5 w-full bg-primary text-primary-foreground rounded-2xl py-3.5 font-semibold active:scale-[0.98] transition"
        >
          Back to app
        </button>
        <button
          onClick={() => { if (confirm("Cancel Premium? You'll lose access immediately in this preview.")) setPremium(false); }}
          className="mt-2 w-full text-xs text-muted-foreground py-2"
        >
          Cancel Premium
        </button>
        <p className="text-[11px] text-muted-foreground text-center mt-1">Payments wire in later — this is the in-app entitlement.</p>
      </div>
    );
  }

  return (
    <div className="px-5 pt-2 pb-2">
      <div className="flex items-center gap-3 py-2">
        <button onClick={() => navigate({ to: "/app/more" })} className="p-1 -ml-1"><ChevronLeft className="h-5 w-5" /></button>
        <p className="text-sm font-semibold">Roadly Premium</p>
      </div>

      <div className="mt-3 bg-gradient-to-br from-primary/90 to-primary text-primary-foreground rounded-3xl p-5">
        <Crown className="h-7 w-7" />
        <p className="text-2xl font-extrabold mt-2 leading-tight">Pass faster.<br />Drive smarter.</p>
        <p className="text-xs opacity-80 mt-2">Everything you need to ace your test in one upgrade.</p>
      </div>

      <ul className="mt-5 space-y-2">
        {FEATURES.map((f) => (
          <li key={f} className="flex items-start gap-3 bg-surface-2 rounded-2xl p-3">
            <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <span className="text-sm">{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {([
          { id: "monthly" as const, label: "Monthly", price: "£4.99", sub: "/ month" },
          { id: "yearly" as const, label: "Yearly", price: "£29.99", sub: "/ year", badge: "Save 50%" },
        ]).map((p) => (
          <button key={p.id} onClick={() => setPlan(p.id)}
            className={`relative rounded-2xl p-4 border text-left transition ${plan === p.id ? "border-primary bg-primary/10" : "border-border bg-surface-2"}`}>
            {p.badge && <span className="absolute -top-2 right-3 text-[10px] font-bold bg-warning text-foreground px-2 py-0.5 rounded-full">{p.badge}</span>}
            <p className="text-xs text-muted-foreground">{p.label}</p>
            <p className="text-xl font-extrabold mt-1">{p.price}</p>
            <p className="text-[11px] text-muted-foreground">{p.sub}</p>
          </button>
        ))}
      </div>

      <button
        onClick={() => { setPremium(true); }}
        className="mt-5 w-full bg-primary text-primary-foreground rounded-2xl py-3.5 font-semibold active:scale-[0.98] transition"
      >
        Activate Premium ({plan === "yearly" ? "£29.99/yr" : "£4.99/mo"})
      </button>
      <p className="text-[11px] text-muted-foreground text-center mt-3">
        Real payments will be wired in before launch — this unlocks features in-app.
      </p>
    </div>
  );
}
