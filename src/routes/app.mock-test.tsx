import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, Clock, Flag, Bookmark, Crown, Lock } from "lucide-react";
import { QUESTIONS, TOPICS } from "@/lib/data";
import { ProgressRing } from "@/components/ProgressRing";
import { RoadSign } from "@/components/RoadSign";
import { addMockResult, useRoadly, FREE_MOCK_LIMIT } from "@/lib/store";

export const Route = createFileRoute("/app/mock-test")({
  component: MockTest,
});


// UK car/motorcycle theory test format
const TEST_LENGTH = 50;
const PASS_MARK = 43;
const TIME_LIMIT_SEC = 57 * 60; // 57 minutes

interface Answered { qid: string; picked: number; correct: boolean; }

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function MockTest() {
  const navigate = useNavigate();
  const lastTests = useRoadly((s) => s.mockTests);
  const premium = useRoadly((s) => s.premium);
  const last = lastTests[0];
  const used = lastTests.length;
  const remaining = Math.max(0, FREE_MOCK_LIMIT - used);
  const locked = !premium && remaining === 0;
  const [running, setRunning] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [lastAnswers, setLastAnswers] = useState<Answered[]>([]);


  // Build a 50-question test. If the pool is smaller, repeat with reshuffles.
  const test = useMemo(() => {
    const pool = [...QUESTIONS].sort(() => Math.random() - 0.5);
    const out = [...pool];
    while (out.length < TEST_LENGTH) {
      out.push(...[...QUESTIONS].sort(() => Math.random() - 0.5));
    }
    return out.slice(0, TEST_LENGTH);
  }, [running]);

  const [i, setI] = useState(0);
  const [picks, setPicks] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [showReview, setShowReview] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SEC);
  const submittedRef = useRef(false);

  // Countdown timer
  useEffect(() => {
    if (!running) return;
    setTimeLeft(TIME_LIMIT_SEC);
    submittedRef.current = false;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const submit = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    const answers: Answered[] = test.map((q, idx) => {
      const picked = picks[idx] ?? -1;
      return { qid: q.id, picked, correct: picked === q.answer };
    });
    const score = answers.filter((a) => a.correct).length;
    addMockResult({ id: `m_${Date.now()}`, date: Date.now(), score, total: TEST_LENGTH });
    setLastAnswers(answers);
    setRunning(false);
    setShowReview(false);
  };

  // Auto-submit on timeout
  useEffect(() => {
    if (running && timeLeft === 0) submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, running]);

  if (reviewing) {
    return (
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-center gap-3 py-2">
          <button onClick={() => setReviewing(false)} className="p-1 -ml-1"><ChevronLeft className="h-5 w-5" /></button>
          <p className="text-sm font-semibold">Review Answers</p>
        </div>
        <div className="mt-3 space-y-3">
          {lastAnswers.map((a, idx) => {
            const q = QUESTIONS.find((x) => x.id === a.qid);
            if (!q) return null;
            return (
              <div key={`${a.qid}-${idx}`} className={`bg-surface-2 rounded-2xl p-4 border ${a.correct ? "border-primary/40" : "border-destructive/40"}`}>
                <p className="text-xs text-muted-foreground">Q{idx + 1} · {a.correct ? "✓ Correct" : a.picked === -1 ? "— Skipped" : "✗ Incorrect"}</p>
                <p className="text-sm font-semibold mt-1">{q.prompt}</p>
                <div className="mt-2 space-y-1">
                  {q.choices.map((c, ci) => (
                    <div key={ci} className={`text-xs rounded-lg px-3 py-2 ${ci === q.answer ? "bg-primary/15 text-foreground" : ci === a.picked ? "bg-destructive/15 text-foreground" : "text-muted-foreground"}`}>
                      {c} {ci === q.answer && "✓"} {ci === a.picked && ci !== q.answer && "✗"}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2 italic">{q.explanation}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (!running) {
    const score = last?.score ?? 0;
    const total = last?.total ?? TEST_LENGTH;
    const pct = last ? Math.round((score / total) * 100) : 0;
    const passed = last ? score >= PASS_MARK : false;

    const wrongByTopic: Record<string, number> = {};
    lastAnswers.forEach((a) => {
      if (a.correct) return;
      const q = QUESTIONS.find((x) => x.id === a.qid);
      if (q) wrongByTopic[q.topic] = (wrongByTopic[q.topic] ?? 0) + 1;
    });
    const weak = Object.entries(wrongByTopic).sort((a, b) => b[1] - a[1]).slice(0, 3)
      .map(([id]) => TOPICS.find((t) => t.id === id)?.title ?? id);

    return (
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-center justify-between py-2">
          <button onClick={() => navigate({ to: "/app/learn" })} className="p-1 -ml-1"><ChevronLeft className="h-5 w-5" /></button>
          <p className="text-sm font-semibold">Mock Theory Test</p>
          <div className="w-5" />
        </div>

        <div className="mt-3 bg-surface-2 rounded-2xl p-4 border border-border">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">UK theory test format</p>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-lg font-bold">50</p>
              <p className="text-[10px] text-muted-foreground leading-tight">Multiple-choice questions</p>
            </div>
            <div>
              <p className="text-lg font-bold">57<span className="text-xs"> min</span></p>
              <p className="text-[10px] text-muted-foreground leading-tight">Time allowed</p>
            </div>
            <div>
              <p className="text-lg font-bold">43<span className="text-xs">/50</span></p>
              <p className="text-[10px] text-muted-foreground leading-tight">Pass mark (86%)</p>
            </div>
          </div>
        </div>

        {last ? (
          <div className="mt-5 flex flex-col items-center">
            <ProgressRing value={pct} size={170} stroke={14} label={`${score}/${total}`} sub={passed ? "PASS" : "Not yet"} />
            <p className={`text-sm font-semibold mt-4 ${passed ? "text-primary" : "text-destructive"}`}>
              {passed ? "🎉 You passed!" : `${PASS_MARK - score} more correct needed`}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{lastTests.length} mock test{lastTests.length === 1 ? "" : "s"} completed</p>
            {lastAnswers.length > 0 && (
              <button onClick={() => setReviewing(true)} className="mt-4 w-full bg-surface-2 border border-border rounded-2xl py-3 text-sm font-semibold">
                Review Answers
              </button>
            )}
          </div>
        ) : (
          <div className="mt-5 bg-surface-2 rounded-3xl p-5 text-center">
            <p className="text-4xl">🎓</p>
            <p className="text-sm font-semibold mt-3">Ready for a full mock?</p>
            <p className="text-xs text-muted-foreground mt-1">Same length, timing and pass mark as the real DVSA test.</p>
          </div>
        )}

        <div className="mt-5 bg-surface-2 rounded-2xl p-4">
          <p className="font-semibold text-sm">Your Weak Areas</p>
          {weak.length === 0 ? (
            <p className="text-xs text-muted-foreground mt-2">Take a mock test — we'll highlight topics to revise.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {weak.map((w) => <li key={w}>• {w}</li>)}
            </ul>
          )}
        </div>

        {!premium && (
          <div className="mt-4 flex items-center justify-between bg-surface-2 border border-border rounded-2xl px-4 py-2.5">
            <p className="text-xs text-muted-foreground">
              {locked ? <>Free mock tests used ({used}/{FREE_MOCK_LIMIT}).</> : <>Free tests left: <span className="text-foreground font-semibold">{remaining}/{FREE_MOCK_LIMIT}</span></>}
            </p>
            <button onClick={() => navigate({ to: "/app/premium" })} className="text-[11px] font-semibold text-primary inline-flex items-center gap-1">
              <Crown className="h-3 w-3" /> Go Premium
            </button>
          </div>
        )}

        {locked ? (
          <button
            onClick={() => navigate({ to: "/app/premium" })}
            className="mt-3 w-full bg-primary text-primary-foreground rounded-2xl py-3.5 font-semibold inline-flex items-center justify-center gap-2"
          >
            <Lock className="h-4 w-4" /> Unlock unlimited mocks
          </button>
        ) : (
          <button
            onClick={() => { setRunning(true); setI(0); setPicks({}); setFlagged(new Set()); setShowReview(false); }}
            className="mt-3 w-full bg-primary text-primary-foreground rounded-2xl py-3.5 font-semibold">
            {last ? "Take Another Test" : "Start Mock Test"}
          </button>
        )}

      </div>
    );
  }

  // Review screen before submission
  if (showReview) {
    const answered = Object.keys(picks).length;
    return (
      <div className="px-5 pt-2 pb-4">
        <div className="flex items-center justify-between py-2">
          <button onClick={() => setShowReview(false)} className="p-1 -ml-1"><ChevronLeft className="h-5 w-5" /></button>
          <p className="text-sm font-semibold">Review & Submit</p>
          <div className="flex items-center gap-1 text-xs font-mono bg-surface-2 px-2 py-1 rounded-lg">
            <Clock className="h-3 w-3" /> {formatTime(timeLeft)}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Answered <span className="text-foreground font-semibold">{answered}</span> of {TEST_LENGTH}
          {flagged.size > 0 && <> · <span className="text-foreground font-semibold">{flagged.size}</span> flagged</>}
        </p>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {test.map((_, idx) => {
            const isAnswered = picks[idx] !== undefined;
            const isFlagged = flagged.has(idx);
            return (
              <button
                key={idx}
                onClick={() => { setI(idx); setShowReview(false); }}
                className={`relative aspect-square rounded-lg text-xs font-semibold border transition ${
                  isAnswered ? "bg-primary/15 border-primary/40 text-foreground" : "bg-surface-2 border-border text-muted-foreground"
                }`}
              >
                {idx + 1}
                {isFlagged && <Flag className="absolute top-0.5 right-0.5 h-2.5 w-2.5 text-amber-400 fill-amber-400" />}
              </button>
            );
          })}
        </div>
        <button onClick={submit} className="mt-5 w-full bg-primary text-primary-foreground rounded-2xl py-3.5 font-semibold">
          Submit Test
        </button>
        <button onClick={() => setShowReview(false)} className="mt-2 w-full bg-surface-2 border border-border rounded-2xl py-3 text-sm font-semibold">
          Keep Going
        </button>
      </div>
    );
  }

  const q = test[i];
  const isLast = i === test.length - 1;
  const picked = picks[i] ?? null;
  const isFlagged = flagged.has(i);
  const answeredCount = Object.keys(picks).length;
  const lowTime = timeLeft <= 5 * 60;

  const goNext = () => {
    if (isLast) { setShowReview(true); return; }
    setI((x) => x + 1);
  };

  return (
    <div className="px-5 pt-2 pb-4 flex flex-col min-h-[720px]">
      <div className="flex items-center gap-2 py-2">
        <button
          onClick={() => { if (confirm("Exit the test? Your progress will be lost.")) setRunning(false); }}
          className="text-sm px-1"
        >✕</button>
        <div className={`flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-lg ${lowTime ? "bg-destructive/20 text-destructive" : "bg-surface-2"}`}>
          <Clock className="h-3 w-3" /> {formatTime(timeLeft)}
        </div>
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${((i + 1) / test.length) * 100}%` }} />
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">{i + 1}/{test.length}</span>
      </div>

      <div className="flex items-center justify-between mt-1">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {answeredCount}/{TEST_LENGTH} answered
        </p>
        <button
          onClick={() => setFlagged((f) => { const n = new Set(f); if (n.has(i)) n.delete(i); else n.add(i); return n; })}
          className={`flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-1 rounded-md border transition ${
            isFlagged ? "bg-amber-400/15 border-amber-400/40 text-amber-300" : "bg-surface-2 border-border text-muted-foreground"
          }`}
        >
          <Bookmark className={`h-3 w-3 ${isFlagged ? "fill-amber-400 text-amber-400" : ""}`} /> {isFlagged ? "Flagged" : "Flag"}
        </button>
      </div>

      <p className="text-sm font-semibold text-center mt-4">{q.prompt}</p>
      {q.signKind && (
        <div className="mx-auto mt-4 h-40 w-40 rounded-3xl bg-surface-2 flex items-center justify-center">
          <RoadSign kind={q.signKind} label={q.signLabel ?? ""} size={120} />
        </div>
      )}
      <div className="mt-5 space-y-2">
        {q.choices.map((c, idx) => {
          const isSel = picked === idx;
          return (
            <button
              key={idx}
              onClick={() => setPicks((p) => ({ ...p, [i]: idx }))}
              className={`w-full p-3.5 rounded-2xl border text-left transition text-sm ${
                isSel ? "border-primary bg-primary/10" : "border-border bg-surface-2"
              }`}
            >
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-background border border-border text-[11px] font-bold mr-2">
                {String.fromCharCode(65 + idx)}
              </span>
              {c}
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-5 flex gap-2">
        <button
          onClick={() => setI((x) => Math.max(0, x - 1))}
          disabled={i === 0}
          className="flex-1 bg-surface-2 border border-border rounded-2xl py-3.5 font-semibold disabled:opacity-40"
        >
          Previous
        </button>
        <button
          onClick={goNext}
          className="flex-[2] bg-primary text-primary-foreground rounded-2xl py-3.5 font-semibold"
        >
          {isLast ? "Review & Submit" : picked === null ? "Skip" : "Next"}
        </button>
      </div>
    </div>
  );
}
