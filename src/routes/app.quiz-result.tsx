import { createFileRoute, Link } from "@tanstack/react-router";
import { ProgressRing } from "@/components/ProgressRing";

export const Route = createFileRoute("/app/quiz-result")({
  validateSearch: (s: Record<string, unknown>) => ({
    score: typeof s.score === "number" ? s.score : 0,
    total: typeof s.total === "number" ? s.total : 5,
  }),
  component: Result,
});

function Result() {
  const { score, total } = Route.useSearch();
  const pct = Math.round((score / total) * 100);
  return (
    <div className="px-5 pt-6 pb-6 flex flex-col items-center text-center">
      <p className="text-sm text-muted-foreground">Quick Practice</p>
      <h1 className="text-xl font-bold mt-1">Nice work!</h1>
      <div className="mt-6">
        <ProgressRing value={pct} size={160} stroke={14} label={`${pct}%`} sub={`${score} / ${total}`} />
      </div>
      <p className="text-sm text-muted-foreground mt-6 max-w-[260px]">
        {pct >= 80 ? "You're on fire — keep this pace and you'll smash the test." :
         pct >= 50 ? "Solid effort — review the topics you missed." :
         "Practice these topics more to build confidence."}
      </p>
      <div className="mt-8 w-full space-y-2">
        <Link to="/app/quiz" search={{ topic: "all" }} className="block w-full bg-primary text-primary-foreground rounded-2xl py-3.5 font-semibold">
          Try another
        </Link>
        <Link to="/app/learn" className="block w-full bg-surface-2 border border-border rounded-2xl py-3.5 font-semibold">
          Back to Learn
        </Link>
      </div>
    </div>
  );
}
