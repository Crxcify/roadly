import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useRoadly } from "@/lib/store";
import { RouteMap } from "@/components/RouteMap";
import { MapPin, Navigation } from "lucide-react";

export const Route = createFileRoute("/app/drive")({
  component: Drive,
});

function Drive() {
  const [tab, setTab] = useState<"routes" | "drives">("routes");
  const drives = useRoadly((s) => s.drives);
  const last = drives[0];

  return (
    <div className="px-5 pt-2 pb-2">
      <h1 className="text-xl font-bold text-center py-2">Drive</h1>

      <div className="mt-2 bg-surface-2 rounded-full p-1 flex">
        {(["routes", "drives"] as const).map((t) => (
          <button
            key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-semibold rounded-full capitalize transition ${
              tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >{t}</button>
        ))}
      </div>

      {tab === "routes" ? (
        <>
          {last && last.path && last.path.length >= 2 ? (
            <RouteMap path={last.path} className="mt-4 h-56" />
          ) : (
            <div className="mt-4 relative bg-surface-2 rounded-3xl overflow-hidden h-56 flex flex-col items-center justify-center gap-2">
              <MapPin className="h-10 w-10 text-primary/60" />
              <p className="text-sm font-semibold">Ready when you are</p>
              <p className="text-xs text-muted-foreground">Your route will appear here</p>
            </div>
          )}

          <div className="mt-4 bg-surface-2 rounded-3xl p-4">
            <p className="text-xs text-muted-foreground">{last ? "Last Drive" : "No drives yet"}</p>
            <div className="flex items-end justify-between mt-1">
              <p className="text-2xl font-extrabold">{last ? last.distanceKm.toFixed(1) : "0.0"} km</p>
              {last && <span className="text-sm font-bold text-primary">{last.score.toFixed(1)}/10</span>}
            </div>
            <div className="mt-3 flex gap-6">
              <div>
                <p className="text-lg font-bold">{last ? formatDuration(last.durationSec) : "00:00:00"}</p>
                <p className="text-xs text-muted-foreground">Time</p>
              </div>
              <div>
                <p className="text-lg font-bold">{last ? Math.round(last.avgSpeed) : 0} km/h</p>
                <p className="text-xs text-muted-foreground">Avg Speed</p>
              </div>
            </div>
          </div>

          <Link to="/app/drive-active" className="mt-4 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-2xl py-3.5 font-semibold active:scale-[0.98] transition">
            <Navigation className="h-4 w-4" /> Start Live Drive
          </Link>
        </>
      ) : (
        <div className="mt-4 space-y-2">
          {drives.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-12">No drives yet — start your first one!</p>
          )}
          {drives.map((d) => (
            <Link key={d.id} to="/app/drive-summary" search={{ id: d.id }} className="block bg-surface-2 rounded-2xl p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm">{new Date(d.startedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</p>
                  <p className="text-xs text-muted-foreground mt-1">{d.distanceKm.toFixed(1)} km · {formatDuration(d.durationSec)}</p>
                </div>
                <span className="text-primary font-bold">{d.score.toFixed(1)}/10</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function formatDuration(sec: number) {
  const h = Math.floor(sec / 3600).toString().padStart(2, "0");
  const m = Math.floor((sec % 3600) / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

