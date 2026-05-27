import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { COMMUNITY } from "@/lib/data";
import { useRoadly } from "@/lib/store";
import { Heart, MessageCircle, Send, Trophy, Flame, Target, Share2, Sparkles, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/app/community")({
  component: Community,
});

interface Comment { id: string; name: string; text: string; time: string }
interface Post {
  id: string;
  name: string;
  text: string;
  time: string;
  likes: number;
  comments: Comment[];
  liked?: boolean;
  badge?: "passed" | "milestone" | "streak" | null;
}

const SEED_COMMENTS: Record<string, Comment[]> = {
  c1: [
    { id: "c1-1", name: "Tom", text: "Massive congrats! 🥳", time: "1h" },
    { id: "c1-2", name: "Aoife", text: "What centre did you do it at?", time: "30m" },
  ],
  c2: [{ id: "c2-1", name: "Sophie", text: "Beast! 💪", time: "3h" }],
  c3: [],
};

function Community() {
  const me = useRoadly((s) => s.user);
  const drives = useRoadly((s) => s.drives);
  const streak = useRoadly((s) => s.streak);
  const myBest = drives.reduce((m, d) => Math.max(m, d.score), 0);

  const [tab, setTab] = useState<"feed" | "leaderboard" | "challenges">("feed");
  const [posts, setPosts] = useState<Post[]>(
    COMMUNITY.map((c) => ({
      ...c,
      comments: SEED_COMMENTS[c.id] ?? [],
      badge: c.id === "c1" ? "passed" : c.id === "c2" ? "milestone" : "streak",
    })),
  );
  const [draft, setDraft] = useState("");
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState("");

  const toggleLike = (id: string) => {
    setPosts((ps) => ps.map((p) => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const post = () => {
    if (!draft.trim()) return;
    setPosts((ps) => [{
      id: `p_${Date.now()}`,
      name: me?.name ?? "You",
      text: draft.trim(),
      time: "now",
      likes: 0,
      comments: [],
      badge: null,
    }, ...ps]);
    setDraft("");
  };

  const sharePassed = () => {
    setPosts((ps) => [{
      id: `p_${Date.now()}`,
      name: me?.name ?? "You",
      text: "just hit a personal best on a drive! 🚗💨",
      time: "now",
      likes: 0,
      comments: [],
      badge: "milestone",
    }, ...ps]);
  };

  const sendComment = (postId: string) => {
    if (!commentDraft.trim()) return;
    setPosts((ps) => ps.map((p) => p.id === postId
      ? { ...p, comments: [...p.comments, { id: `cm_${Date.now()}`, name: me?.name ?? "You", text: commentDraft.trim(), time: "now" }] }
      : p));
    setCommentDraft("");
  };

  const leaderboard = [
    { name: "Mia", score: 98, change: 0 },
    { name: "Jake", score: 92, change: 2 },
    { name: "Sophie", score: 89, change: -1 },
    { name: me?.name ?? "You", score: Math.max(60, Math.round(myBest * 10)), change: 3, me: true },
    { name: "Liam", score: 71, change: 1 },
    { name: "Aoife", score: 68, change: 0 },
  ].sort((a, b) => b.score - a.score);

  const challenges = [
    { id: "c1", title: "3 drives this week", desc: "Stack up the practice", progress: Math.min(3, drives.length), goal: 3, icon: "🚗", reward: "+50 XP" },
    { id: "c2", title: "Hit a 5-day streak", desc: "Open the app daily", progress: Math.min(5, streak), goal: 5, icon: "🔥", reward: "Streak badge" },
    { id: "c3", title: "Score 9.0+ on a drive", desc: "Smooth & steady", progress: myBest >= 9 ? 1 : 0, goal: 1, icon: "✨", reward: "Smooth Operator" },
    { id: "c4", title: "Complete 3 mock tests", desc: "Prove you're test-ready", progress: 0, goal: 3, icon: "🎓", reward: "Scholar badge" },
  ];

  return (
    <div className="px-5 pt-2 pb-2">
      <h1 className="text-xl font-bold text-center py-2">Community</h1>

      {/* Featured banner */}
      <div className="mt-2 bg-gradient-to-br from-primary/90 to-primary rounded-3xl p-4 text-primary-foreground">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider opacity-90">
          <Sparkles className="h-3 w-3" /> Weekly Challenge
        </div>
        <p className="text-base font-extrabold mt-1 leading-tight">Drive 3 times this week & climb the leaderboard</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 bg-primary-foreground/20 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-primary-foreground rounded-full" style={{ width: `${Math.min(100, (drives.length / 3) * 100)}%` }} />
          </div>
          <span className="text-xs font-bold">{Math.min(3, drives.length)}/3</span>
        </div>
      </div>

      <div className="mt-3 bg-surface-2 rounded-full p-1 flex">
        {(["feed", "leaderboard", "challenges"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 text-xs font-semibold rounded-full capitalize transition ${tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "feed" && (
        <>
          {/* Composer */}
          <div className="mt-4 bg-surface-2 rounded-2xl p-3">
            <div className="flex gap-2">
              <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                {(me?.name ?? "Y")[0].toUpperCase()}
              </div>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Share a win, ask a question..."
                rows={2}
                className="flex-1 bg-surface border border-border rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60 resize-none"
              />
            </div>
            <div className="flex gap-1.5 mt-2">
              <button onClick={sharePassed} className="text-[11px] bg-surface border border-border px-2.5 py-1 rounded-full flex items-center gap-1">
                <Trophy className="h-3 w-3 text-warning" /> Share win
              </button>
              <button onClick={() => setDraft("Just hit a " + streak + " day streak 🔥")} className="text-[11px] bg-surface border border-border px-2.5 py-1 rounded-full flex items-center gap-1">
                <Flame className="h-3 w-3 text-destructive" /> Streak
              </button>
              <button onClick={post} disabled={!draft.trim()} className="ml-auto bg-primary text-primary-foreground rounded-full px-4 py-1.5 text-xs font-semibold flex items-center gap-1 disabled:opacity-50">
                <Send className="h-3 w-3" /> Post
              </button>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {posts.map((p) => (
              <div key={p.id} className="bg-surface-2 rounded-2xl p-3">
                <div className="flex gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">{p.name[0].toUpperCase()}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold">{p.name}</p>
                      {p.badge === "passed" && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-semibold">🎉 Passed test</span>}
                      {p.badge === "milestone" && <span className="text-[10px] bg-warning/20 text-warning px-1.5 py-0.5 rounded-full font-semibold">🏆 Milestone</span>}
                      {p.badge === "streak" && <span className="text-[10px] bg-destructive/20 text-destructive px-1.5 py-0.5 rounded-full font-semibold">🔥 On streak</span>}
                    </div>
                    <p className="text-sm mt-0.5">{p.text}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">{p.time}</p>
                  </div>
                </div>
                <div className="flex gap-4 mt-2.5 pt-2 border-t border-border text-xs text-muted-foreground">
                  <button onClick={() => toggleLike(p.id)} className="flex items-center gap-1.5 active:scale-95 transition">
                    <Heart className={`h-4 w-4 ${p.liked ? "fill-destructive text-destructive" : ""}`} />
                    <span className={p.liked ? "text-destructive font-semibold" : ""}>{p.likes}</span>
                  </button>
                  <button onClick={() => setOpenComments(openComments === p.id ? null : p.id)} className="flex items-center gap-1.5">
                    <MessageCircle className="h-4 w-4" /> {p.comments.length}
                  </button>
                  <button className="ml-auto flex items-center gap-1.5"><Share2 className="h-4 w-4" /></button>
                </div>
                {openComments === p.id && (
                  <div className="mt-2 pt-2 border-t border-border space-y-2">
                    {p.comments.length === 0 && <p className="text-xs text-muted-foreground">No comments yet — be the first.</p>}
                    {p.comments.map((c) => (
                      <div key={c.id} className="flex gap-2">
                        <div className="h-7 w-7 rounded-full bg-surface flex items-center justify-center text-[11px] font-bold shrink-0">{c.name[0]}</div>
                        <div className="flex-1 bg-surface rounded-2xl px-3 py-1.5">
                          <p className="text-[11px] font-semibold">{c.name} <span className="text-muted-foreground font-normal ml-1">{c.time}</span></p>
                          <p className="text-xs">{c.text}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <input
                        value={commentDraft}
                        onChange={(e) => setCommentDraft(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") sendComment(p.id); }}
                        placeholder="Write a comment..."
                        className="flex-1 bg-surface border border-border rounded-full px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/60"
                      />
                      <button onClick={() => sendComment(p.id)} className="bg-primary text-primary-foreground rounded-full px-3 text-xs font-semibold">Send</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "leaderboard" && (
        <>
          <div className="mt-4 flex justify-between items-end gap-2">
            {leaderboard.slice(0, 3).map((p, i) => {
              const heights = ["h-20", "h-24", "h-16"];
              const order = [1, 0, 2];
              const idx = order.indexOf(i);
              const podiumIdx = order[i];
              const real = leaderboard[podiumIdx];
              return null;
            })}
          </div>
          {/* podium */}
          <div className="mt-4 flex items-end justify-center gap-2 h-32">
            {[1, 0, 2].map((rank) => {
              const p = leaderboard[rank];
              const heights = [88, 104, 72];
              const h = heights[rank];
              const colors = ["bg-muted", "bg-warning/30", "bg-primary/20"];
              const medals = ["🥈", "🥇", "🥉"];
              return (
                <div key={p.name} className="flex flex-col items-center flex-1 max-w-[80px]">
                  <span className="text-2xl">{medals[rank]}</span>
                  <p className="text-xs font-bold truncate w-full text-center">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.score}%</p>
                  <div className={`w-full rounded-t-xl mt-1 ${colors[rank]} flex items-start justify-center pt-1`} style={{ height: h }}>
                    <span className="text-xs font-bold">{rank + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 space-y-1.5">
            {leaderboard.map((p, i) => (
              <div key={p.name} className={`flex items-center gap-3 rounded-2xl p-2.5 ${(p as any).me ? "bg-primary/15 border border-primary" : "bg-surface-2"}`}>
                <span className="w-6 text-center font-bold text-sm">{i + 1}</span>
                <div className="h-8 w-8 rounded-full bg-surface flex items-center justify-center text-xs font-bold">{p.name[0]}</div>
                <span className="flex-1 text-sm font-semibold truncate">{p.name}</span>
                <span className={`text-[10px] flex items-center gap-0.5 ${p.change > 0 ? "text-primary" : p.change < 0 ? "text-destructive" : "text-muted-foreground"}`}>
                  {p.change > 0 ? <TrendingUp className="h-3 w-3" /> : null}
                  {p.change > 0 ? `+${p.change}` : p.change}
                </span>
                <span className="text-sm font-bold text-primary tabular-nums">{p.score}%</span>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "challenges" && (
        <div className="mt-4 space-y-2">
          {challenges.map((c) => {
            const pct = (c.progress / c.goal) * 100;
            const done = c.progress >= c.goal;
            return (
              <div key={c.id} className={`bg-surface-2 rounded-2xl p-3 ${done ? "border border-primary" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-surface flex items-center justify-center text-xl shrink-0">{c.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{c.title}</p>
                      {done && <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-bold">DONE</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">{c.desc}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 bg-surface rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, pct)}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground tabular-nums">{c.progress}/{c.goal}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Target className="h-3 w-3" /> Reward: <span className="font-semibold text-foreground">{c.reward}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
