import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRoadly, logout, resetAll } from "@/lib/store";
import { BookOpen, Car, GraduationCap, Bookmark, Settings, HelpCircle, UserPlus, LogOut, ChevronRight, Crown } from "lucide-react";

export const Route = createFileRoute("/app/more")({
  component: More,
});

function More() {
  const navigate = useNavigate();
  const user = useRoadly((s) => s.user);
  const premium = useRoadly((s) => s.premium);


  const items = [
    { icon: <BookOpen className="h-4 w-4" />, label: "My Lessons", to: "/app/learn" },
    { icon: <Car className="h-4 w-4" />, label: "My Drives", to: "/app/drive" },
    { icon: <GraduationCap className="h-4 w-4" />, label: "Mock Tests", to: "/app/mock-test" },
    { icon: <Bookmark className="h-4 w-4" />, label: "Bookmarks", to: "/app/learn" },
  ] as const;

  const settings = [
    { icon: <Settings className="h-4 w-4" />, label: "Settings", to: "/app/settings" as const },
    { icon: <HelpCircle className="h-4 w-4" />, label: "Help & Support", to: "/app/help" as const },
    { icon: <UserPlus className="h-4 w-4" />, label: "Invite a Friend", to: "/app/invite" as const },
  ];

  return (
    <div className="px-5 pt-2 pb-2">
      <h1 className="text-xl font-bold text-center py-2">More</h1>

      <Link to="/app/profile" className="mt-2 flex items-center gap-3 bg-surface-2 rounded-2xl p-3">
        <div className="h-11 w-11 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
          {(user?.name ?? "A")[0]}
        </div>
        <div className="flex-1">
          <p className="font-semibold text-sm">{user?.name ?? "Driver"}</p>
          <p className="text-xs text-muted-foreground">Learner Driver</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>

      <div className="mt-4 bg-surface-2 rounded-2xl divide-y divide-border">
        {items.map((it) => (
          <Link key={it.label} to={it.to} className="flex items-center gap-3 px-4 py-3">
            <span className="text-primary">{it.icon}</span>
            <span className="flex-1 text-sm">{it.label}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
      </div>

      <div className="mt-3 bg-surface-2 rounded-2xl divide-y divide-border">
        {settings.map((it) => (
          <Link key={it.label} to={it.to} className="flex items-center gap-3 px-4 py-3">
            <span className="text-primary">{it.icon}</span>
            <span className="flex-1 text-sm text-left">{it.label}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        ))}
        <Link to="/app/community" className="flex items-center gap-3 px-4 py-3">
          <span className="text-primary">👥</span>
          <span className="flex-1 text-sm">Community</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>

      <Link to="/app/premium" className="mt-4 block bg-gradient-to-br from-surface-2 to-surface rounded-2xl p-4 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-bold flex items-center gap-2">
              Roadly Premium <Crown className="h-4 w-4 text-warning" />
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[210px]">
              {premium ? "You're a Premium member. Tap to manage your plan." : "Unlock all features and track your progress like a pro."}
            </p>
          </div>
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${premium ? "bg-primary/15 text-primary" : "bg-primary text-primary-foreground"}`}>
            {premium ? "Active" : "Upgrade"}
          </span>
        </div>
      </Link>


      <button
        onClick={() => { logout(); navigate({ to: "/login" }); }}
        className="mt-4 w-full bg-surface-2 border border-border rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2 text-destructive"
      >
        <LogOut className="h-4 w-4" /> Log out
      </button>

      <button
        onClick={() => { if (confirm("Reset all data?")) { resetAll(); navigate({ to: "/login" }); } }}
        className="mt-2 w-full text-xs text-muted-foreground py-2"
      >
        Reset all data
      </button>
    </div>
  );
}
