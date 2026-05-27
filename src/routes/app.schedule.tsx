import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useRoadly, scheduleDrive, removeSchedule } from "@/lib/store";
import { ChevronLeft, Plus, X as XIcon } from "lucide-react";
import type { DriveSession } from "@/lib/store";

export const Route = createFileRoute("/app/schedule")({ component: Schedule });

function Schedule() {
  const navigate = useNavigate();
  const items = useRoadly((s) => s.schedule);
  const [when, setWhen] = useState("");
  const [type, setType] = useState<NonNullable<DriveSession["type"]>>("practice");
  const [note, setNote] = useState("");

  const add = () => {
    if (!when) return;
    scheduleDrive({ when: new Date(when).getTime(), type, note });
    setWhen(""); setNote("");
  };

  return (
    <div className="px-5 pt-2 pb-2">
      <div className="flex items-center gap-3 py-2">
        <button onClick={() => navigate({ to: "/app/home" })} className="p-1 -ml-1"><ChevronLeft className="h-5 w-5" /></button>
        <p className="text-sm font-semibold">Schedule</p>
      </div>

      <div className="mt-3 bg-surface-2 rounded-2xl p-4 space-y-2">
        <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)}
          className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" />
        <select value={type} onChange={(e) => setType(e.target.value as NonNullable<DriveSession["type"]>)}
          className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm">
          <option value="practice">Practice</option>
          <option value="city">City</option>
          <option value="rural">Rural</option>
          <option value="motorway">Motorway</option>
          <option value="night">Night</option>
        </select>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)"
          className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm" />
        <button onClick={add} disabled={!when}
          className="w-full bg-primary text-primary-foreground rounded-xl py-2.5 text-sm font-semibold disabled:opacity-40 flex items-center justify-center gap-2">
          <Plus className="h-4 w-4" /> Add to schedule
        </button>
      </div>

      <p className="text-sm font-semibold text-muted-foreground mt-5">Upcoming</p>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-8">Nothing scheduled.</p>
      ) : (
        <div className="mt-2 space-y-2">
          {items.map((s) => (
            <div key={s.id} className="bg-surface-2 rounded-2xl p-3 flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-semibold capitalize">{s.type} drive</p>
                <p className="text-xs text-muted-foreground">{new Date(s.when).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</p>
                {s.note && <p className="text-xs text-muted-foreground mt-1">{s.note}</p>}
              </div>
              <button onClick={() => removeSchedule(s.id)} className="p-2 text-muted-foreground"><XIcon className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
