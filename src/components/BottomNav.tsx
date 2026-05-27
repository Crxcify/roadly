import { Link, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, Gauge, Users, BarChart3 } from "lucide-react";

const items = [
  { to: "/app/home", label: "Home", Icon: Home },
  { to: "/app/learn", label: "Learn", Icon: BookOpen },
  { to: "/app/drive", label: "Drive", Icon: Gauge },
  { to: "/app/community", label: "Community", Icon: Users },
  { to: "/app/progress", label: "Progress", Icon: BarChart3 },
] as const;

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-surface/95 backdrop-blur border-t border-border px-3 pt-2 pb-3">
      <ul className="flex justify-between">
        {items.map(({ to, label, Icon }) => {
          const active = path.startsWith(to);
          return (
            <li key={to} className="flex-1">
              <Link to={to} className="flex flex-col items-center gap-1 py-1">
                <Icon className={`h-5 w-5 ${active ? "text-primary" : "text-muted-foreground"}`} strokeWidth={active ? 2.5 : 1.8} />
                <span className={`text-[10px] ${active ? "text-primary font-semibold" : "text-muted-foreground"}`}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
