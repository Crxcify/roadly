import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRoadly } from "@/lib/store";
import { ProgressRing } from "@/components/ProgressRing";
import { ChevronLeft, Share2, Check, Circle } from "lucide-react";
import { formatDuration } from "./app.drive";
import { RouteMap } from "@/components/RouteMap";

export const Route = createFileRoute("/app/drive-summary")({
  validateSearch: (s: Record<string, unknown>) => ({ id: typeof s.id === "string" ? s.id : "" }),
  component: Summary,
});

function Summary() {
  const navigate = useNavigate();
  const { id } = Route.useSearch();
  const drive = useRoadly((s) => s.drives.find((d) => d.id === id) ?? s.drives[0]);
  const user = useRoadly((s) => s.user);

  if (!drive) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        No drive yet. <Link to="/app/drive" className="text-primary">Start one</Link>
      </div>
    );
  }

  const items = [
    { label: "Smooth Braking", note: drive.smoothBraking > 80 ? "Great control" : "Needs work", good: drive.smoothBraking > 70 },
    { label: "Speed Consistency", note: drive.speedConsistency > 75 ? "Well done" : "Vary less", good: drive.speedConsistency > 65 },
    { label: "Cornering", note: drive.cornering > 80 ? "Good" : "Smoother turns", good: drive.cornering > 70 },
    { label: "Observation", note: drive.observation > 75 ? "Sharp eyes" : "Keep improving", good: drive.observation > 70 },
  ];

  return (
    <div className="px-5 pt-2 pb-6">
      <div className="flex items-center justify-between py-2">
        <button onClick={() => navigate({ to: "/app/drive" })} className="p-1 -ml-1"><ChevronLeft className="h-5 w-5" /></button>
        <p className="text-sm font-semibold">Drive Summary</p>
        <button
          onClick={() => {
            const text = `Just drove ${drive.distanceKm.toFixed(1)} km in ${formatDuration(drive.durationSec)} — scored ${drive.score.toFixed(1)}/10 on Roadly 🚗`;
            if (navigator.share) navigator.share({ title: "My Roadly drive", text }).catch(() => {});
            else navigator.clipboard?.writeText(text);
          }}
          className="p-1"
        ><Share2 className="h-5 w-5" /></button>
      </div>

      {drive.path.length >= 2 && (
        <RouteMap path={drive.path} className="mt-3 h-44" />
      )}

      <div className="mt-3">
        <h2 className="text-lg font-extrabold text-primary">Great drive, {user?.name ?? "Driver"}!</h2>
        <p className="text-xs text-muted-foreground mt-1">You stayed consistent and smooth throughout your drive.</p>
      </div>

      <div className="mt-4 flex justify-end">
        <ProgressRing value={drive.score * 10} size={120} label={drive.score.toFixed(1)} sub="/10" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Tile label="Distance" value={`${drive.distanceKm.toFixed(2)} km`} />
        <Tile label="Duration" value={formatDuration(drive.durationSec)} />
        <Tile label="Avg" value={`${Math.round(drive.avgSpeed)} km/h`} />
      </div>

      <div className="mt-4 space-y-2">
        {items.map((it) => (
          <div key={it.label} className="bg-surface-2 rounded-2xl p-3 flex items-center gap-3">
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${it.good ? "bg-primary/20" : "bg-warning/20"}`}>
              {it.good ? <Check className="h-4 w-4 text-primary" /> : <Circle className="h-4 w-4 text-warning" />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{it.label}</p>
              <p className="text-xs text-muted-foreground">{it.note}</p>
            </div>
            {it.good ? <Check className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5 text-warning" />}
          </div>
        ))}
      </div>

      <FullAnalysisCta />

    </div>
  );
}

function FullAnalysisCta() {
  const premium = useRoadly((s) => s.premium);
  const navigate = useNavigate();
  if (!premium) {
    return (
      <button
        onClick={() => navigate({ to: "/app/premium" })}
        className="mt-5 w-full bg-primary text-primary-foreground rounded-2xl py-3.5 font-semibold inline-flex items-center justify-center gap-2"
      >
        🔒 Unlock Full Analysis · Premium
      </button>
    );
  }
  return (
    <div className="mt-5 bg-surface-2 border border-border rounded-2xl p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Premium insights</p>
      <ul className="mt-2 text-sm space-y-1 text-muted-foreground">
        <li>• Route replay with heatmap of harsh events</li>
        <li>• Per-segment scoring vs. average learner</li>
        <li>• Personalised drills based on weak skills</li>
      </ul>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-2 rounded-2xl p-3 text-center">
      <p className="text-sm font-bold tabular-nums">{value}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

