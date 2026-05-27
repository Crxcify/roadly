import { createFileRoute, Link } from "@tanstack/react-router";
import { TOPICS } from "@/lib/data";
import { useRoadly } from "@/lib/store";
import { GraduationCap, BookOpen, Car as CarIcon, ShieldAlert, AlertTriangle, Construction } from "lucide-react";

export const Route = createFileRoute("/app/learn")({
  component: Learn,
});

const ICONS: Record<string, React.ReactNode> = {
  "road-signs": <AlertTriangle className="h-5 w-5 text-destructive" />,
  "rules": <BookOpen className="h-5 w-5 text-primary" />,
  "traffic": <Construction className="h-5 w-5 text-warning" />,
  "vehicle": <ShieldAlert className="h-5 w-5 text-primary" />,
  "hazard": <CarIcon className="h-5 w-5 text-destructive" />,
};

function Learn() {
  const progress = useRoadly((s) => s.lessonProgress);
  return (
    <div className="px-5 pt-2 pb-2">
      <h1 className="text-xl font-bold text-center py-2">Learn</h1>

      <Link to="/app/quiz" search={{ topic: "all" }} className="block mt-3 rounded-3xl p-5 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-lg font-extrabold">Quick Practice</p>
          <p className="text-xs opacity-80 mt-0.5">5 Questions</p>
          <div className="inline-flex items-center mt-4 bg-background/90 text-foreground rounded-full px-4 py-1.5 text-xs font-semibold">
            Start
          </div>
        </div>
        <GraduationCap className="absolute right-4 top-1/2 -translate-y-1/2 h-20 w-20 opacity-30" />
      </Link>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">Topics</h2>
        <Link to="/app/mock-test" className="text-xs text-primary font-semibold">Mock test →</Link>
      </div>

      <div className="mt-3 space-y-2.5">
        {TOPICS.map((t) => {
          const done = progress[t.id] ?? 0;
          return (
            <Link
              key={t.id} to="/app/quiz" search={{ topic: t.id }}
              className="flex items-center gap-3 bg-surface-2 rounded-2xl p-3"
            >
              <div className="h-10 w-10 rounded-xl bg-background/40 flex items-center justify-center">
                {ICONS[t.id]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{t.title}</p>
                <div className="h-1 rounded-full bg-muted mt-2 overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${(done / t.total) * 100}%` }} />
                </div>
              </div>
              <p className="text-xs font-semibold text-muted-foreground tabular-nums">{done} / {t.total}</p>
            </Link>
          );
        })}
      </div>

      <Link to="/app/mock-test" className="mt-5 block text-center bg-surface-2 rounded-2xl py-3 text-sm font-semibold">
        🎓 Take a Mock Test
      </Link>
    </div>
  );
}
