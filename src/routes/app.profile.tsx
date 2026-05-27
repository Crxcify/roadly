import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useRoadly, getState, saveProfile } from "@/lib/store";
import { ACHIEVEMENTS, CAR_BRANDS, MODELS_BY_BRAND } from "@/lib/data";
import { Settings, Pencil, ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/app/profile")({
  component: Profile,
});

function Profile() {
  const navigate = useNavigate();
  const user = useRoadly((s) => s.user);
  const car = useRoadly((s) => s.car);
  const drives = useRoadly((s) => s.drives);
  const mocks = useRoadly((s) => s.mockTests);
  const streak = useRoadly((s) => s.streak);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [brand, setBrand] = useState(car?.brand ?? "");
  const [model, setModel] = useState(car?.model ?? "");

  const save = async () => {
    setSaving(true);
    const { error } = await saveProfile({ name: name.trim(), car_brand: brand, car_model: model });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Profile updated");
    setEditing(false);
  };

  return (
    <div className="px-5 pt-2 pb-2">
      <div className="flex items-center justify-between py-2">
        <button onClick={() => navigate({ to: "/app/more" })} className="p-1 -ml-1"><ChevronLeft className="h-5 w-5" /></button>
        <p className="text-sm font-semibold">Profile</p>
        <button onClick={() => navigate({ to: "/app/settings" })} className="p-1"><Settings className="h-5 w-5" /></button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center font-bold text-lg text-primary">
          {(user?.name ?? "A")[0]}
        </div>
        <div className="flex-1">
          {editing ? (
            <input value={name} onChange={(e) => setName(e.target.value)}
              className="bg-surface-2 rounded-xl px-3 py-2 text-sm w-full" />
          ) : (
            <>
              <p className="font-semibold">{user?.name}</p>
              <p className="text-xs text-muted-foreground">Learner Driver</p>
            </>
          )}
        </div>
        <button onClick={() => editing ? save() : setEditing(true)} disabled={saving} className="p-2 bg-surface-2 rounded-full disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
        </button>
      </div>

      <div className="mt-5 bg-surface-2 rounded-3xl p-4">
        <p className="text-xs text-muted-foreground">Your Car</p>
        {editing ? (
          <div className="mt-2 space-y-2">
            <select value={brand} onChange={(e) => { setBrand(e.target.value); setModel(""); }}
              className="w-full bg-background rounded-xl px-3 py-2 text-sm">
              <option value="">Select brand</option>
              {CAR_BRANDS.map((b) => <option key={b}>{b}</option>)}
              <option>Other</option>
            </select>
            {brand && brand !== "Other" ? (
              <select value={model} onChange={(e) => setModel(e.target.value)}
                className="w-full bg-background rounded-xl px-3 py-2 text-sm">
                <option value="">Select model</option>
                {(MODELS_BY_BRAND[brand] ?? []).map((m) => <option key={m}>{m}</option>)}
                <option>Other</option>
              </select>
            ) : (
              <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Model"
                className="w-full bg-background rounded-xl px-3 py-2 text-sm" />
            )}
          </div>
        ) : (
          <div className="mt-2 flex items-center gap-3">
            <div className="h-12 w-16 bg-background rounded-lg flex items-center justify-center text-2xl">🚗</div>
            <div>
              <p className="text-sm font-semibold">{car?.brand ?? "—"}</p>
              <p className="text-xs text-muted-foreground">{car?.model ?? "—"}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Mini value={String(drives.length)} label="Drives" />
        <Mini value={String(mocks.length)} label="Mock Tests" />
        <Mini value={String(streak || 0)} label="Streak" />
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm font-semibold text-muted-foreground">Badges</p>
        <button onClick={() => navigate({ to: "/app/progress" })} className="text-xs text-primary font-semibold">View All</button>
      </div>
      <div className="mt-2 flex gap-3 overflow-x-auto hide-scrollbar pb-2">
        {ACHIEVEMENTS.map((a) => {
          const unlocked = getState().unlockedAchievements.includes(a.id);
          return (
            <div key={a.id} className="flex-shrink-0 w-20 text-center">
              <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-2xl mx-auto ${unlocked ? "bg-warning/20" : "bg-muted/40 grayscale opacity-50"}`}>{a.icon}</div>
              <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{a.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Mini({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-surface-2 rounded-2xl p-3 text-center">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}
