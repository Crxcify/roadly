import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { HAZARD_CLIPS } from "@/lib/data";
import { addHazardScore, useRoadly, FREE_HAZARD_LIMIT } from "@/lib/store";
import { ChevronLeft, Lock, Crown, Eye } from "lucide-react";

export const Route = createFileRoute("/app/hazard")({ component: Hazard });

function Hazard() {
  const navigate = useNavigate();
  const premium = useRoadly((s) => s.premium);
  const [clipIdx, setClipIdx] = useState(0);
  const clip = HAZARD_CLIPS[clipIdx];
  const locked = !premium && clipIdx >= FREE_HAZARD_LIMIT;
  const [t, setT] = useState(0);
  const [running, setRunning] = useState(false);
  const [tapAt, setTapAt] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const timer = useRef<number | null>(null);

  const reset = () => { setT(0); setTapAt(null); setScore(null); setFlash(false); };

  const start = () => {
    if (locked) { navigate({ to: "/app/premium" }); return; }
    reset();
    setRunning(true);
  };

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      setT((cur) => {
        const next = cur + 0.1;
        if (next >= clip.durationSec) {
          window.clearInterval(interval);
          setRunning(false);
          setTapAt((prev) => {
            if (prev === null) {
              setScore(0);
              addHazardScore(clip.id, 0);
            }
            return prev;
          });
          return clip.durationSec;
        }
        return next;
      });
    }, 100);
    timer.current = interval;
    return () => window.clearInterval(interval);
  }, [running, clip.durationSec, clip.id]);

  const tap = () => {
    if (!running || tapAt !== null) return;
    setTapAt(t);
    setFlash(true);
    window.setTimeout(() => setFlash(false), 250);
    let s = 0;
    if (t < clip.windowStart) s = 0;
    else if (t > clip.windowEnd) s = 1;
    else {
      const ratio = 1 - (t - clip.windowStart) / (clip.windowEnd - clip.windowStart);
      s = Math.round(1 + ratio * 4);
    }
    setScore(s);
    addHazardScore(clip.id, s);
    setRunning(false);
    if (timer.current) window.clearInterval(timer.current);
  };

  return (
    <div className="px-5 pt-2 pb-6">
      <div className="flex items-center gap-3 py-2">
        <button onClick={() => navigate({ to: "/app/home" })} className="p-1 -ml-1"><ChevronLeft className="h-5 w-5" /></button>
        <p className="text-sm font-semibold">Hazard Perception</p>
      </div>

      <div className="flex items-start gap-2 mt-1 bg-surface-2 rounded-xl p-3">
        <Eye className="h-4 w-4 text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Tap the screen the instant a hazard <span className="text-foreground font-semibold">starts developing</span> — not when it's right in front of you. Earlier = higher score.
        </p>
      </div>

      <div onClick={locked ? undefined : tap}
        className="relative mt-3 aspect-video rounded-2xl overflow-hidden cursor-pointer select-none shadow-lg">
        <Scene scene={clip.scene} t={t} duration={clip.durationSec} />

        {/* HUD top bar */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
          <div className="text-[10px] font-semibold bg-background/80 backdrop-blur rounded-full px-2 py-1">{clip.title}</div>
          <div className="text-[10px] font-mono bg-background/80 backdrop-blur rounded-full px-2 py-1 tabular-nums">{t.toFixed(1)}s</div>
        </div>

        {/* Timeline */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="relative h-1.5 bg-background/40 rounded-full overflow-hidden">
            {score !== null && (
              <div className="absolute top-0 h-full bg-emerald-500/40"
                style={{ left: `${(clip.windowStart / clip.durationSec) * 100}%`, width: `${((clip.windowEnd - clip.windowStart) / clip.durationSec) * 100}%` }} />
            )}
            <div className="absolute top-0 left-0 h-full bg-primary" style={{ width: `${(t / clip.durationSec) * 100}%` }} />
            {tapAt !== null && (
              <div className="absolute -top-1 h-3.5 w-0.5 bg-white shadow"
                style={{ left: `${(tapAt / clip.durationSec) * 100}%` }} />
            )}
          </div>
        </div>

        {/* Tap flash */}
        {flash && <div className="absolute inset-0 bg-primary/30 animate-in fade-in duration-150" />}

        {locked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/80 backdrop-blur-sm">
            <Lock className="h-6 w-6 text-primary" />
            <p className="text-xs font-semibold">Premium clip</p>
            <button onClick={(e) => { e.stopPropagation(); navigate({ to: "/app/premium" }); }}
              className="text-[11px] font-semibold bg-primary text-primary-foreground rounded-full px-3 py-1 inline-flex items-center gap-1">
              <Crown className="h-3 w-3" /> Unlock
            </button>
          </div>
        )}
        {!locked && !running && score === null && (
          <button onClick={(e) => { e.stopPropagation(); start(); }}
            className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl shadow-xl flex items-center justify-center hover:scale-105 transition-transform">▶</button>
        )}
        {running && tapAt === null && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold bg-background/70 backdrop-blur rounded-full px-2 py-1 animate-pulse">
            Tap when you spot the hazard
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-3">{clip.description}</p>
      <p className="text-[11px] text-muted-foreground mt-1">
        Clip {clipIdx + 1} of {HAZARD_CLIPS.length}{!premium && <> · {FREE_HAZARD_LIMIT} free, rest are Premium</>}
      </p>

      {score !== null && (
        <div className="mt-4 bg-surface-2 rounded-2xl p-4">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Your score</p>
            <p className="text-4xl font-extrabold text-primary mt-1">{score} / 5</p>
            <p className="text-xs text-muted-foreground mt-2">
              {score === 0 && tapAt !== null && "Too early — you tapped before the hazard developed."}
              {score === 0 && tapAt === null && "Missed — no tap registered."}
              {score === 1 && "Late — try to spot it sooner."}
              {score >= 2 && score < 4 && "Good — try to spot it a bit sooner."}
              {score >= 4 && "Excellent — spotted it early."}
            </p>
          </div>
          <div className="mt-3 text-[11px] text-muted-foreground grid grid-cols-2 gap-2">
            <div className="bg-surface rounded-lg p-2"><span className="text-muted-foreground">Hazard window</span><div className="text-foreground font-semibold tabular-nums">{clip.windowStart.toFixed(1)}–{clip.windowEnd.toFixed(1)}s</div></div>
            <div className="bg-surface rounded-lg p-2"><span className="text-muted-foreground">You tapped</span><div className="text-foreground font-semibold tabular-nums">{tapAt !== null ? `${tapAt.toFixed(1)}s` : "—"}</div></div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => { setClipIdx((i) => (i + 1) % HAZARD_CLIPS.length); reset(); }}
              className="flex-1 bg-surface border border-border rounded-xl py-2 text-sm font-semibold">Next clip</button>
            <button onClick={start} className="flex-1 bg-primary text-primary-foreground rounded-xl py-2 text-sm font-semibold">Retry</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------- Scene renderer ---------------------------- */

function Scene({ scene, t, duration }: { scene: "child" | "cyclist" | "junction"; t: number; duration: number }) {
  // p = playback progress 0..1
  const p = Math.min(1, t / duration);
  return (
    <svg viewBox="0 0 320 180" className="w-full h-full block" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.55 0.06 240)" />
          <stop offset="100%" stopColor="oklch(0.38 0.04 240)" />
        </linearGradient>
        <linearGradient id="road" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.22 0.01 240)" />
          <stop offset="100%" stopColor="oklch(0.32 0.01 240)" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="320" height="95" fill="url(#sky)" />
      {/* Distant horizon buildings */}
      <rect x="10" y="78" width="40" height="18" fill="oklch(0.3 0.02 240)" />
      <rect x="55" y="70" width="25" height="26" fill="oklch(0.28 0.02 240)" />
      <rect x="240" y="74" width="60" height="22" fill="oklch(0.3 0.02 240)" />
      {/* Ground */}
      <rect y="95" width="320" height="85" fill="oklch(0.34 0.03 140)" />
      {/* Road (perspective trapezoid) */}
      <polygon points="60,180 260,180 195,95 125,95" fill="url(#road)" />
      {/* Center dashed line */}
      {[0, 1, 2, 3, 4].map((i) => {
        const k = i / 5;
        const y1 = 95 + k * 85;
        const y2 = 95 + (k + 0.07) * 85;
        const xTop = 160; const xBot = 160;
        const x1 = xTop + (xBot - xTop) * k;
        return <line key={i} x1={x1} y1={y1} x2={x1} y2={y2} stroke="oklch(0.95 0.02 90)" strokeWidth={1 + k * 2} opacity="0.85" />;
      })}
      {/* Kerb edges */}
      <line x1="125" y1="95" x2="60" y2="180" stroke="oklch(0.7 0.02 240)" strokeWidth="1" opacity="0.6" />
      <line x1="195" y1="95" x2="260" y2="180" stroke="oklch(0.7 0.02 240)" strokeWidth="1" opacity="0.6" />
      {/* Pavement */}
      <polygon points="0,180 60,180 125,95 0,95" fill="oklch(0.4 0.01 240)" />
      <polygon points="260,180 320,180 320,95 195,95" fill="oklch(0.4 0.01 240)" />

      {scene === "child" && <ChildScene p={p} />}
      {scene === "cyclist" && <CyclistScene p={p} />}
      {scene === "junction" && <JunctionScene p={p} />}

      {/* Bonnet (driver POV) */}
      <path d="M0,180 L0,168 Q160,150 320,168 L320,180 Z" fill="oklch(0.18 0.02 240)" />
      <ellipse cx="160" cy="172" rx="120" ry="4" fill="oklch(0.95 0.05 240)" opacity="0.08" />
    </svg>
  );
}

/* Hazard developing: residential street, parked car, ball rolls out THEN child appears */
function ChildScene({ p }: { p: number }) {
  // Window 5–8s on a 12s clip ≈ p 0.42–0.66.
  // Ball starts rolling at p≈0.35, child appears at p≈0.5.
  const ballP = Math.max(0, Math.min(1, (p - 0.35) / 0.2));
  const childP = Math.max(0, Math.min(1, (p - 0.5) / 0.25));
  return (
    <g>
      {/* Parked cars on left pavement edge */}
      <g>
        <rect x="38" y="128" width="48" height="22" rx="4" fill="oklch(0.55 0.12 25)" />
        <rect x="44" y="122" width="36" height="10" rx="2" fill="oklch(0.65 0.1 25)" />
        <circle cx="50" cy="152" r="3" fill="oklch(0.15 0 0)" />
        <circle cx="80" cy="152" r="3" fill="oklch(0.15 0 0)" />
        <rect x="30" y="156" width="56" height="20" rx="4" fill="oklch(0.5 0.08 240)" />
        <rect x="36" y="150" width="42" height="10" rx="2" fill="oklch(0.6 0.08 240)" />
        <circle cx="42" cy="178" r="3.5" fill="oklch(0.15 0 0)" />
        <circle cx="78" cy="178" r="3.5" fill="oklch(0.15 0 0)" />
      </g>
      {/* Ball rolling from behind parked car into road */}
      {ballP > 0 && (
        <circle cx={86 + ballP * 30} cy={160 - Math.abs(Math.sin(ballP * 6)) * 4} r="3.5" fill="oklch(0.85 0.2 30)" stroke="oklch(0.2 0 0)" strokeWidth="0.5" />
      )}
      {/* Child stepping out */}
      {childP > 0 && (
        <g opacity={Math.min(1, childP * 2)} transform={`translate(${88 + childP * 22}, ${135 - childP * 4})`}>
          <circle cx="0" cy="0" r="4" fill="oklch(0.78 0.08 60)" />
          <rect x="-3.5" y="3" width="7" height="11" rx="1.5" fill="oklch(0.7 0.2 25)" />
          <rect x="-3" y="14" width="2.5" height="8" fill="oklch(0.3 0.05 240)" />
          <rect x="0.5" y="14" width="2.5" height="8" fill="oklch(0.3 0.05 240)" />
        </g>
      )}
    </g>
  );
}

/* Country lane cyclist appearing around a bend */
function CyclistScene({ p }: { p: number }) {
  // Window 4–7s on 12s ≈ p 0.33–0.58. Cyclist becomes visible ~p=0.3.
  const cP = Math.max(0, Math.min(1, (p - 0.3) / 0.55));
  // Comes from right-far down toward bottom-right of road
  const x = 200 - cP * 50;
  const y = 110 + cP * 50;
  const scale = 0.4 + cP * 1.2;
  return (
    <g>
      {/* Hedgerow / bushes on both sides */}
      <ellipse cx="40" cy="110" rx="50" ry="20" fill="oklch(0.4 0.08 140)" />
      <ellipse cx="280" cy="108" rx="55" ry="22" fill="oklch(0.4 0.08 140)" />
      <ellipse cx="20" cy="130" rx="40" ry="18" fill="oklch(0.35 0.08 140)" />
      <ellipse cx="300" cy="128" rx="40" ry="18" fill="oklch(0.35 0.08 140)" />
      {/* Cyclist */}
      {cP > 0 && (
        <g transform={`translate(${x}, ${y}) scale(${scale})`}>
          {/* wheels */}
          <circle cx="-6" cy="14" r="5" fill="none" stroke="oklch(0.1 0 0)" strokeWidth="1.5" />
          <circle cx="6" cy="14" r="5" fill="none" stroke="oklch(0.1 0 0)" strokeWidth="1.5" />
          {/* frame */}
          <line x1="-6" y1="14" x2="2" y2="6" stroke="oklch(0.1 0 0)" strokeWidth="1.5" />
          <line x1="6" y1="14" x2="2" y2="6" stroke="oklch(0.1 0 0)" strokeWidth="1.5" />
          <line x1="2" y1="6" x2="-2" y2="0" stroke="oklch(0.1 0 0)" strokeWidth="1.5" />
          {/* rider */}
          <rect x="-3" y="-4" width="6" height="8" rx="1" fill="oklch(0.72 0.22 25)" />
          <circle cx="0" cy="-8" r="3" fill="oklch(0.78 0.08 60)" />
          {/* helmet */}
          <path d="M-3,-9 Q0,-12 3,-9" stroke="oklch(0.2 0.05 240)" strokeWidth="1.5" fill="none" />
        </g>
      )}
    </g>
  );
}

/* Town junction: car emerging from side road on the left */
function JunctionScene({ p }: { p: number }) {
  // Window 6–9s on 12s ≈ p 0.5–0.75. Car nose appears at p≈0.45.
  const cP = Math.max(0, Math.min(1, (p - 0.45) / 0.45));
  return (
    <g>
      {/* Side road opening on left pavement */}
      <polygon points="60,180 125,180 125,130 95,130" fill="oklch(0.25 0.01 240)" />
      <line x1="95" y1="130" x2="60" y2="180" stroke="oklch(0.7 0.02 240)" strokeWidth="1" opacity="0.6" />
      {/* Give way markings */}
      <line x1="100" y1="140" x2="118" y2="140" stroke="oklch(0.9 0.02 90)" strokeWidth="1.5" strokeDasharray="2 2" />
      {/* Buildings flanking */}
      <rect x="0" y="60" width="60" height="80" fill="oklch(0.42 0.04 30)" />
      <rect x="6" y="78" width="10" height="14" fill="oklch(0.7 0.1 220)" />
      <rect x="22" y="78" width="10" height="14" fill="oklch(0.7 0.1 220)" />
      <rect x="38" y="78" width="10" height="14" fill="oklch(0.7 0.1 220)" />
      <rect x="260" y="60" width="60" height="80" fill="oklch(0.45 0.04 80)" />
      {/* Emerging car (nose first from the side road) */}
      {cP > 0 && (
        <g transform={`translate(${85 + cP * 35}, ${145 + cP * 6})`}>
          <rect x="-22" y="-8" width="40" height="16" rx="3" fill="oklch(0.6 0.18 50)" />
          <rect x="-16" y="-13" width="26" height="8" rx="2" fill="oklch(0.7 0.15 50)" />
          <rect x="14" y="-4" width="4" height="3" fill="oklch(0.95 0.18 90)" />
          <rect x="14" y="2" width="4" height="3" fill="oklch(0.95 0.18 90)" />
          <circle cx="-14" cy="9" r="3" fill="oklch(0.12 0 0)" />
          <circle cx="12" cy="9" r="3" fill="oklch(0.12 0 0)" />
        </g>
      )}
    </g>
  );
}
