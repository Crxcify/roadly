import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRoadly, markAllRead } from "@/lib/store";
import { ChevronLeft } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/app/notifications")({ component: Notifications });

function Notifications() {
  const navigate = useNavigate();
  const items = useRoadly((s) => s.notifications);
  useEffect(() => { markAllRead(); }, []);
  return (
    <div className="px-5 pt-2 pb-2">
      <div className="flex items-center gap-3 py-2">
        <button onClick={() => navigate({ to: "/app/home" })} className="p-1 -ml-1"><ChevronLeft className="h-5 w-5" /></button>
        <p className="text-sm font-semibold">Notifications</p>
      </div>
      {items.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-12">No notifications yet.</p>
      ) : (
        <div className="mt-2 space-y-2">
          {items.map((n) => (
            <div key={n.id} className="bg-surface-2 rounded-2xl p-3 flex gap-3">
              <div className="h-10 w-10 rounded-xl bg-background/40 flex items-center justify-center text-xl">{n.emoji}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.body}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.time).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
