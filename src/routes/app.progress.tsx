import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useRoadly, getState } from "@/lib/store";
import { ACHIEVEMENTS } from "@/lib/data";
import { Flame, GraduationCap, Car, FileQuestion } from "lucide-react";

export const Route = createFileRoute("/app/progress")({
  component: Progress,
});

function Progress() {
  const [tab, setTab] = useState<"overview" | "theory" | "driving">("overview");
  const drives = useRoadly((s) => s.drives);
  const mocks = useRoadly((s) => s.mockTests);
  const streak = useRoadly((s) => s.streak);
  const completed = useRoadly((s) => s.completedLessons);

  const theoryAvg = mocks.length ? Math.round(mocks.reduce((a, t) => a + (t.score / t.total) * 100, 0) / mocks.length) : 0;
  const driveAvg = drives.length ? Math.round((drives.reduce((a, d) => a + d.score, 0) / drives.length) * 10) : 0;
  const overall = tab === "theory" ? theoryAvg : tab === "driving" ? driveAvg : Math.round((theoryAvg + driveAvg) / 2);

  // Build a simple last-5-period trend
  const series = tab === "driving"
    ? drives.slice(0, 5).reverse().map((d) => d.score * 10)
    : tab === "theory"
    ? mocks.slice(0, 5).reverse().map((m) => (m.score / m.total) * 100)
    : mocks.length || drives.length ? [overall] : [];

  return (
    <div className="px-5 pt-2 pb-2">
      <h1 className="text-xl font-bold text-center py-2">Progress</h1>

      <div className="mt-2 bg-surface-2 rounded-full p-1 flex">
        {(["overview", "theory", "driving"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-semibold rounded-full capitalize transition ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4 bg-surface-2 rounded-3xl p-5">
        <p className="text-sm font-semibold text-muted-foreground capitalize">{tab} Progress</p>
        <p className="text-3xl font-extrabold mt-1">{overall}%</p>
        <LineChart values={series.length ? series : [0]} />
      </div>

      <p className="text-sm font-semibold text-muted-foreground mt-5">Stats</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <StatCard icon={<Flame className="h-5 w-5 text-warning" />} value={String(streak || 0)} label="Day Streak" />
        <StatCard icon={<GraduationCap className="h-5 w-5 text-primary" />} value={String(mocks.length)} label="Mock Tests" />
        <StatCard icon={<Car className="h-5 w-5 text-primary" />} value={String(drives.length)} label="Drives" />
        <StatCard icon={<FileQuestion className="h-5 w-5 text-primary" />} value={String(completed.length)} label="Lessons" />
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm font-semibold text-muted-foreground">Achievements</p>
        <span className="text-xs text-muted-foreground">{getState().unlockedAchievements.length} / {ACHIEVEMENTS.length}</span>
      </div>
      <div className="mt-2 space-y-2">
        {ACHIEVEMENTS.map((a) => {
          const unlocked = getState().unlockedAchievements.includes(a.id);
          return (
            <div key={a.id} className={`rounded-2xl p-3 flex items-center gap-3 ${unlocked ? "bg-surface-2" : "bg-surface-2/60"}`}>
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-xl ${unlocked ? "bg-warning/20" : "bg-muted/40 grayscale opacity-60"}`}>{a.icon}</div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${unlocked ? "" : "text-muted-foreground"}`}>{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.desc}</p>
              </div>
              {unlocked && <span className="text-xs text-primary font-semibold">✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-surface-2 rounded-2xl p-3 flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl bg-background/40 flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-lg font-bold leading-none">{value}</p>
        <p className="text-[11px] text-muted-foreground mt-1">{label}</p>
      </div>
    </div>
  );
}

function LineChart({ values }: { values: number[] }) {
  const max = Math.max(100, ...values);
  const min = Math.min(0, ...values);
  const w = 280, h = 90, pad = 8;
  const sx = (i: number) => values.length <= 1 ? w / 2 : pad + (i / (values.length - 1)) * (w - pad * 2);
  const sy = (v: number) => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
  const d = values.map((v, i) => `${i === 0 ? "M" : "L"} ${sx(i).toFixed(1)} ${sy(v).toFixed(1)}`).join(" ");
  return (
    <div className="mt-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24">
        {[25, 50, 75].map((p) => <line key={p} x1="0" x2={w} y1={sy((max - min) * (p / 100) + min)} y2={sy((max - min) * (p / 100) + min)} stroke="var(--color-border)" strokeDasharray="3 3" />)}
        <path d={d} stroke="var(--color-primary)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {values.map((v, i) => <circle key={i} cx={sx(i)} cy={sy(v)} r="3" fill="var(--color-primary)" />)}
      </svg>
    </div>
  );
}
