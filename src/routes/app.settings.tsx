import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useRoadly, setState } from "@/lib/store";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/app/settings")({ component: SettingsPage });

function SettingsPage() {
  const navigate = useNavigate();
  const settings = useRoadly((s) => s.settings);
  const update = (patch: Partial<typeof settings>) => setState({ settings: { ...settings, ...patch } });

  return (
    <div className="px-5 pt-2 pb-2">
      <div className="flex items-center gap-3 py-2">
        <button onClick={() => navigate({ to: "/app/more" })} className="p-1 -ml-1"><ChevronLeft className="h-5 w-5" /></button>
        <p className="text-sm font-semibold">Settings</p>
      </div>

      <div className="mt-3 bg-surface-2 rounded-2xl p-4">
        <p className="text-xs text-muted-foreground">Driving test date</p>
        <input
          type="date"
          value={settings.testDate ?? ""}
          onChange={(e) => update({ testDate: e.target.value || null })}
          className="mt-2 w-full bg-background border border-border rounded-xl px-3 py-2 text-sm"
        />
      </div>

      <div className="mt-3 bg-surface-2 rounded-2xl p-4">
        <p className="text-xs text-muted-foreground mb-2">Units</p>
        <div className="flex gap-2">
          {(["metric", "imperial"] as const).map((u) => (
            <button key={u} onClick={() => update({ units: u })}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize ${settings.units === u ? "bg-primary text-primary-foreground" : "bg-background border border-border text-muted-foreground"}`}>
              {u === "metric" ? "km / km·h⁻¹" : "mi / mph"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 bg-surface-2 rounded-2xl divide-y divide-border">
        <Toggle label="Voice cues during drives" value={settings.voiceCues} onChange={(v) => update({ voiceCues: v })} />
        <Toggle label="Notifications" value={settings.notifications} onChange={(v) => update({ notifications: v })} />
      </div>

      <div className="mt-3 bg-surface-2 rounded-2xl p-4">
        <p className="text-xs text-muted-foreground">Weekly drive goal</p>
        <div className="flex items-center gap-3 mt-2">
          <input type="range" min={1} max={10} value={settings.weeklyDriveGoal}
            onChange={(e) => update({ weeklyDriveGoal: Number(e.target.value) })} className="flex-1 accent-[var(--color-primary)]" />
          <span className="text-sm font-bold w-10 text-right">{settings.weeklyDriveGoal}</span>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="w-full flex items-center justify-between px-4 py-3 text-left">
      <span className="text-sm">{label}</span>
      <span className={`h-6 w-11 rounded-full transition ${value ? "bg-primary" : "bg-muted"} relative`}>
        <span className={`absolute top-0.5 ${value ? "right-0.5" : "left-0.5"} h-5 w-5 rounded-full bg-background transition-all`} />
      </span>
    </button>
  );
}
