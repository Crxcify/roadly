import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { QUESTIONS } from "@/lib/data";
import { Check, X as XIcon, BookmarkPlus, Bookmark } from "lucide-react";
import { setState, getState, useRoadly, toggleBookmark } from "@/lib/store";
import { RoadSign } from "@/components/RoadSign";

export const Route = createFileRoute("/app/quiz")({
  validateSearch: (s: Record<string, unknown>) => ({ topic: typeof s.topic === "string" ? s.topic : "all" }),
  component: Quiz,
});

function Quiz() {
  const navigate = useNavigate();
  const { topic } = Route.useSearch();
  const bookmarks = useRoadly((s) => s.bookmarks);

  const questions = useMemo(() => {
    const pool = topic === "all" ? QUESTIONS
      : topic === "bookmarks" ? QUESTIONS.filter((q) => getState().bookmarks.includes(q.id))
      : QUESTIONS.filter((q) => q.topic === topic);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(shuffled.length, topic === "all" || topic === "bookmarks" ? 5 : pool.length));
  }, [topic]);

  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center text-sm">
        No questions in this set yet.
        <button onClick={() => navigate({ to: "/app/learn" })} className="block mx-auto mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold">Back to Learn</button>
      </div>
    );
  }

  const q = questions[i];
  const isLast = i === questions.length - 1;
  const isBookmarked = bookmarks.includes(q.id);

  const next = () => {
    if (picked === null) return;
    const wasCorrect = picked === q.answer;
    const total = correct + (wasCorrect ? 1 : 0);
    if (isLast) {
      const cur = getState().lessonProgress[q.topic] ?? 0;
      setState({ lessonProgress: { ...getState().lessonProgress, [q.topic]: Math.min(20, cur + 1) } });
      navigate({ to: "/app/quiz-result", search: { score: total, total: questions.length } });
      return;
    }
    setCorrect(total);
    setPicked(null);
    setI((x) => x + 1);
  };

  return (
    <div className="px-5 pt-2 pb-4 flex flex-col min-h-[720px]">
      <div className="flex items-center gap-3 py-2">
        <button onClick={() => navigate({ to: "/app/learn" })} className="text-sm">✕</button>
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${((i + 1) / questions.length) * 100}%` }} />
        </div>
        <button onClick={() => toggleBookmark(q.id)} className="p-1">
          {isBookmarked ? <Bookmark className="h-4 w-4 fill-primary text-primary" /> : <BookmarkPlus className="h-4 w-4 text-muted-foreground" />}
        </button>
        <span className="text-xs text-muted-foreground">Q {i + 1}/{questions.length}</span>
      </div>

      <p className="text-sm font-semibold text-center mt-3">{q.prompt}</p>

      {q.signKind && (
        <div className="mx-auto mt-6 h-44 w-44 rounded-3xl bg-surface-2 flex items-center justify-center">
          <RoadSign kind={q.signKind} label={q.signLabel ?? ""} />
        </div>
      )}

      <div className="mt-6 space-y-2">
        {q.choices.map((c, idx) => {
          const isPicked = picked === idx;
          const isAnswer = picked !== null && idx === q.answer;
          const isWrong = isPicked && idx !== q.answer;
          return (
            <button
              key={idx} onClick={() => picked === null && setPicked(idx)}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition text-sm ${
                isAnswer ? "border-primary bg-primary/10" :
                isWrong ? "border-destructive bg-destructive/10" :
                isPicked ? "border-primary bg-primary/10" :
                "border-border bg-surface-2"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`h-5 w-5 rounded-full border flex items-center justify-center ${isAnswer || isPicked ? "border-primary" : "border-border"}`}>
                  {isAnswer && <Check className="h-3 w-3 text-primary" />}
                  {isWrong && <XIcon className="h-3 w-3 text-destructive" />}
                </span>
                <span>{c}</span>
              </div>
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="mt-3 p-3 rounded-2xl bg-surface-2 border border-border text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Why: </span>{q.explanation}
        </div>
      )}

      <button
        onClick={next} disabled={picked === null}
        className="mt-auto bg-primary text-primary-foreground rounded-2xl py-3.5 font-semibold disabled:opacity-40 active:scale-[0.98] transition"
      >
        {isLast ? "Finish" : "Next"}
      </button>
    </div>
  );
}
