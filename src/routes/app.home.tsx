import { createFileRoute, Link } from "@tanstack/react-router";
import { useRoadly } from "@/lib/store";
import { LESSONS } from "@/lib/data";
import { ProgressRing } from "@/components/ProgressRing";
import { Bell, BookOpen, Car, Gauge, AlertTriangle, Eye, Calendar, Menu } from "lucide-react";

export const Route = createFileRoute("/app/home")({
  component: Home,
});

function Home() {
  const user = useRoadly((s) => s.user);
  const drives = useRoadly((s) => s.drives);
  const mockTests = useRoadly((s) => s.mockTests);
  const streak = useRoadly((s) => s.streak);
  const settings = useRoadly((s) => s.settings);
  const schedule = useRoadly((s) => s.schedule);
  const notifications = useRoadly((s) => s.notifications);
  const goal = settings.weeklyDriveGoal;

  const completedLessons = useRoadly((s) => s.completedLessons);

  // Theory = % of lessons completed
  const theoryPct = LESSONS.length
    ? Math.min(100, Math.round((completedLessons.length / LESSONS.length) * 100))
    : 0;
  // Driving = average drive score (0-10) scaled to %
  const drivingPct = drives.length
    ? Math.min(100, Math.round((drives.reduce((a, d) => a + d.score, 0) / drives.length) * 10))
    : 0;
  // Mock = average mock-test percentage
  const mockPct = mockTests.length
    ? Math.min(100, Math.round(mockTests.reduce((a, t) => a + (t.score / t.total) * 100, 0) / mockTests.length))
    : 0;
  // Overall = average of the three categories that have any data
  const parts = [
    { v: theoryPct, has: completedLessons.length > 0 },
    { v: drivingPct, has: drives.length > 0 },
    { v: mockPct, has: mockTests.length > 0 },
  ].filter((p) => p.has);
  const overall = parts.length ? Math.round(parts.reduce((a, p) => a + p.v, 0) / parts.length) : 0;

  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const today = (new Date().getDay() + 6) % 7;
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Drives this week
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - today);
  startOfWeek.setHours(0, 0, 0, 0);
  const drivesThisWeek = drives.filter((d) => d.startedAt >= startOfWeek.getTime()).length;

  // Test countdown
  const testDate = settings.testDate ? new Date(settings.testDate) : null;
  const daysToTest = testDate ? Math.max(0, Math.ceil((testDate.getTime() - Date.now()) / 86400000)) : null;

  const nextScheduled = schedule.find((s) => s.when > Date.now());

  return (
    <div className="px-5 pt-3 pb-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Good morning, {user?.name ?? "Driver"} 👋</p>
          <h1 className="text-2xl font-extrabold mt-1 leading-tight">Let's drive<br />your future.</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/app/notifications" className="relative h-10 w-10 rounded-full bg-surface-2 flex items-center justify-center">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />}
          </Link>
          <Link to="/app/more" className="h-10 w-10 rounded-full bg-surface-2 flex items-center justify-center">
            <Menu className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Test countdown */}
      {daysToTest !== null ? (
        <Link to="/app/settings" className="mt-5 block bg-gradient-to-br from-primary/90 to-primary text-primary-foreground rounded-3xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider opacity-80">Driving Test</p>
              <p className="text-3xl font-extrabold mt-1">{daysToTest} <span className="text-base font-semibold">days to go</span></p>
              <p className="text-xs opacity-80 mt-1">{testDate!.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" })}</p>
            </div>
            <Calendar className="h-12 w-12 opacity-60" />
          </div>
        </Link>
      ) : (
        <Link to="/app/settings" className="mt-5 block bg-surface-2 rounded-3xl p-4 border border-dashed border-border">
          <div className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-semibold">Set your driving test date</p>
              <p className="text-xs text-muted-foreground mt-0.5">We'll keep you on track with a countdown.</p>
            </div>
          </div>
        </Link>
      )}

      {/* Progress card */}
      <div className="mt-4 bg-surface-2 rounded-3xl p-5">
        <h2 className="text-sm font-semibold text-muted-foreground">Your Progress</h2>
        <div className="mt-3 flex items-center gap-5">
          <ProgressRing value={overall} label={`${overall}%`} sub="Overall" />
          <div className="flex-1 space-y-2.5">
            <Stat icon="📘" label="Theory" value={`${theoryPct}%`} />
            <Stat icon="🚗" label="Driving" value={`${drivingPct}%`} />
            <Stat icon="🎓" label="Mock Tests" value={`${mockPct}%`} />
          </div>
        </div>
      </div>

      {/* Weekly drive goal */}
      <div className="mt-4 bg-surface-2 rounded-3xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Weekly drive goal</p>
            <p className="font-bold mt-0.5">{drivesThisWeek} / {goal} drives</p>
          </div>
          <Link to="/app/drive" className="text-xs font-semibold bg-primary text-primary-foreground rounded-full px-3 py-1.5">
            Drive
          </Link>
        </div>
        <div className="h-1.5 bg-muted rounded-full mt-3 overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${Math.min(100, (drivesThisWeek / goal) * 100)}%` }} />
        </div>
      </div>

      {/* Streak */}
      <div className="mt-4 bg-surface-2 rounded-3xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔥</span>
            <div>
              <p className="text-lg font-bold leading-none">{streak || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Day Streak</p>
            </div>
          </div>
          <p className="text-xs font-semibold text-primary">{streak >= 3 ? "Keep it up!" : "Start a streak today"}</p>
        </div>
        <div className="mt-4 flex justify-between">
          {days.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span className="text-[11px] text-muted-foreground">{d}</span>
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs ${i < today ? "bg-primary/40 text-primary-foreground" : i === today ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {i <= today ? "✓" : ""}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continue learning */}
      <div className="mt-5">
        <h2 className="text-sm font-semibold text-muted-foreground mb-2">Continue Learning</h2>
        <Link to="/app/learn" className="block bg-surface-2 rounded-3xl p-4 flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-destructive/15 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Road Signs and Meanings</p>
            <p className="text-xs text-muted-foreground mt-0.5">Pick up where you left off</p>
          </div>
          <BookOpen className="h-5 w-5 text-muted-foreground" />
        </Link>
      </div>

      {/* Quick actions */}
      <div className="mt-5 grid grid-cols-2 gap-2">
        <Link to="/app/hazard" className="bg-surface-2 rounded-3xl p-4">
          <Eye className="h-6 w-6 text-warning" />
          <p className="text-sm font-semibold mt-3">Hazard Practice</p>
          <p className="text-xs text-muted-foreground mt-1">Spot the developing hazard</p>
        </Link>
        <Link to="/app/drive-active" className="bg-primary text-primary-foreground rounded-3xl p-4">
          <Gauge className="h-6 w-6" />
          <p className="text-sm font-semibold mt-3">Start a drive</p>
          <p className="text-xs opacity-80 mt-1">GPS tracked &amp; scored</p>
        </Link>
      </div>

      {/* Next scheduled drive */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-muted-foreground">Next Scheduled Drive</h2>
          <Link to="/app/schedule" className="text-xs text-primary font-semibold">Schedule</Link>
        </div>
        {nextScheduled ? (
          <Link to="/app/schedule" className="block bg-surface-2 rounded-3xl p-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-primary/15 flex items-center justify-center">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm capitalize">{nextScheduled.type ?? "Practice"} drive</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(nextScheduled.when).toLocaleString([], { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </Link>
        ) : (
          <Link to="/app/schedule" className="block bg-surface-2 rounded-3xl p-4 border border-dashed border-border text-center text-xs text-muted-foreground">
            + Schedule a practice drive
          </Link>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <span className="text-muted-foreground">{label}</span>
      </div>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
