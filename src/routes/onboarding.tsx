import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { CAR_BRANDS, MODELS_BY_BRAND } from "@/lib/data";
import { getState, saveProfile, setState, type SkillLevel } from "@/lib/store";
import { Check, ChevronLeft, Loader2, Sparkles, MapPin, Trophy, Calendar, Target } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

const STEPS = 6; // 0..5
type Step = 0 | 1 | 2 | 3 | 4 | 5;

function Onboarding() {
  const navigate = useNavigate();
  const existing = getState().user;
  const existingSettings = getState().settings;
  const [step, setStep] = useState<Step>(0);
  const [name, setName] = useState(existing?.name ?? "");
  const [brand, setBrand] = useState<string>("");
  const [customBrand, setCustomBrand] = useState("");
  const [model, setModel] = useState<string>("");
  const [customModel, setCustomModel] = useState("");
  const [level, setLevel] = useState<SkillLevel | null>(null);
  const [testDate, setTestDate] = useState<string>(existingSettings.testDate ?? "");
  const [weeklyGoal, setWeeklyGoal] = useState<number>(existingSettings.weeklyDriveGoal ?? 3);

  const finalBrand = brand === "Other" ? customBrand.trim() : brand;
  const models = brand && brand !== "Other" ? MODELS_BY_BRAND[brand] ?? [] : [];
  const finalModel = model === "Other" || brand === "Other" ? customModel.trim() : model;

  // step 0 is welcome (always ok), step 5 (goals) is optional → always ok
  const canNext =
    step === 0 ||
    step === 5 ||
    (step === 1 && name.trim().length >= 2) ||
    (step === 2 && Boolean(brand) && (brand !== "Other" || customBrand.trim().length > 0)) ||
    (step === 3 && finalModel.length > 0) ||
    (step === 4 && level !== null);

  const isOptional = step === 5;
  const [saving, setSaving] = useState(false);

  const finish = async () => {
    setSaving(true);
    const { error } = await saveProfile({
      name: name.trim(),
      car_brand: finalBrand,
      car_model: finalModel,
      skill_level: level,
      onboarded: true,
    });
    if (error) { setSaving(false); toast.error(error.message); return; }
    setState((s) => ({
      settings: {
        ...s.settings,
        testDate: testDate || null,
        weeklyDriveGoal: weeklyGoal,
      },
    }));
    setSaving(false);
    toast.success("You're all set — let's drive 🚗");
    navigate({ to: "/app/home" });
  };

  const next = async () => {
    if (step < STEPS - 1) { setStep((s) => (s + 1) as Step); return; }
    await finish();
  };

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full px-6 pt-2 pb-6">
        <div className="flex items-center gap-3 py-2">
          {step > 0 ? (
            <button onClick={() => setStep((s) => (s - 1) as Step)} className="p-2 -ml-2">
              <ChevronLeft className="h-5 w-5" />
            </button>
          ) : <div className="w-9" />}
          <div className="flex-1 flex gap-1.5">
            {Array.from({ length: STEPS }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i < step ? "bg-primary" : i === step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground tabular-nums w-9 text-right">
            {step + 1}/{STEPS}
          </span>
        </div>

        <div key={step} className="flex-1 flex flex-col motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-right-2 motion-safe:duration-300">
          {step === 0 && (
            <Step
              eyebrow="Welcome"
              title={`Hey${existing?.name ? ` ${existing.name.split(" ")[0]}` : ""} — let's set up Roadly.`}
              subtitle="Takes about 30 seconds. We'll personalise your lessons, drives and test prep."
            >
              <div className="space-y-3 mt-2">
                {[
                  { icon: <Sparkles className="h-4 w-4" />, title: "Tailored lessons", body: "Practice the areas you need most." },
                  { icon: <MapPin className="h-4 w-4" />, title: "Real driving feedback", body: "Score every drive with smart analytics." },
                  { icon: <Trophy className="h-4 w-4" />, title: "Test-ready in weeks", body: "Mock tests built to the DVSA format." },
                ].map((b) => (
                  <div key={b.title} className="flex items-start gap-3 bg-surface-2 rounded-2xl p-3.5">
                    <div className="h-9 w-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
                      {b.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{b.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{b.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Step>
          )}

          {step === 1 && (
            <Step eyebrow="Profile" title="What should we call you?" subtitle="Your name shows up across the app — pick whatever you'd like.">
              <input
                autoFocus value={name} onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sam Carter"
                className="w-full bg-surface-2 border border-border rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
              />
              <p className="text-xs text-muted-foreground mt-3">You can change this any time in your profile.</p>
            </Step>
          )}

          {step === 2 && (
            <Step eyebrow="Your car" title="What car do you drive?" subtitle="Pick your brand — this helps personalise your drives.">
              <SelectGrid options={[...CAR_BRANDS, "Other"]} value={brand} onChange={(v) => { setBrand(v); setModel(""); }} />
              {brand === "Other" && (
                <input
                  autoFocus value={customBrand} onChange={(e) => setCustomBrand(e.target.value)}
                  placeholder="Enter brand name"
                  className="mt-4 w-full bg-surface-2 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
                />
              )}
            </Step>
          )}

          {step === 3 && (
            <Step eyebrow="Your car" title={`Pick your ${finalBrand || "car"} model`} subtitle="Choose your model or enter your own.">
              {brand !== "Other" && (
                <SelectGrid options={[...models, "Other"]} value={model} onChange={setModel} />
              )}
              {(brand === "Other" || model === "Other") && (
                <input
                  autoFocus value={customModel} onChange={(e) => setCustomModel(e.target.value)}
                  placeholder="Enter model name"
                  className="mt-4 w-full bg-surface-2 border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
                />
              )}
            </Step>
          )}

          {step === 4 && (
            <Step eyebrow="Skill level" title="Where are you with driving?" subtitle="We'll tailor lessons and drives to your level.">
              <div className="space-y-3">
                {([
                  { id: "beginner", title: "Beginner", desc: "Just starting out — building basics", emoji: "🌱" },
                  { id: "intermediate", title: "Intermediate", desc: "Comfortable on familiar roads", emoji: "🚗" },
                  { id: "test-ready", title: "Test Ready", desc: "Polishing for the driving test", emoji: "🏁" },
                ] as { id: SkillLevel; title: string; desc: string; emoji: string }[]).map((opt) => {
                  const active = level === opt.id;
                  return (
                    <button
                      key={opt.id} onClick={() => setLevel(opt.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition active:scale-[0.99] ${active ? "border-primary bg-primary/10" : "border-border bg-surface-2"}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{opt.emoji}</span>
                        <div>
                          <div className="font-semibold">{opt.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{opt.desc}</div>
                        </div>
                      </div>
                      <div className={`h-6 w-6 rounded-full border flex items-center justify-center flex-shrink-0 ${active ? "bg-primary border-primary" : "border-border"}`}>
                        {active && <Check className="h-4 w-4 text-primary-foreground" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </Step>
          )}

          {step === 5 && (
            <Step eyebrow="Your goals" title="Set your targets" subtitle="Optional — we'll show a countdown and keep you on track.">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" /> Driving test date
                </span>
                <input
                  type="date"
                  value={testDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setTestDate(e.target.value)}
                  className="mt-2 w-full bg-surface-2 border border-border rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
                />
                <p className="text-[11px] text-muted-foreground mt-1.5">Don't have one yet? Skip and add it later.</p>
              </label>

              <div className="mt-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Target className="h-3.5 w-3.5" /> Weekly drive goal
                </span>
                <div className="mt-2 flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const active = weeklyGoal === n;
                    return (
                      <button
                        key={n}
                        onClick={() => setWeeklyGoal(n)}
                        className={`flex-1 py-3 rounded-xl border font-semibold transition ${
                          active ? "bg-primary text-primary-foreground border-primary" : "bg-surface-2 border-border text-muted-foreground"
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5">Drives per week — we'll nudge you to stay consistent.</p>
              </div>
            </Step>
          )}
        </div>

        {isOptional && (
          <button
            onClick={finish}
            disabled={saving}
            className="mb-2 text-xs font-semibold text-muted-foreground py-2 active:scale-[0.98] transition"
          >
            Skip for now
          </button>
        )}

        <button
          disabled={!canNext || saving} onClick={next}
          className="bg-primary text-primary-foreground rounded-2xl py-3.5 font-semibold disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition flex items-center justify-center gap-2"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {step === 0 ? "Get started" : step < STEPS - 1 ? "Continue" : saving ? "Saving…" : "Start driving"}
        </button>
      </div>
    </PhoneFrame>
  );
}

function Step({ eyebrow, title, subtitle, children }: { eyebrow?: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="flex-1 overflow-y-auto hide-scrollbar pt-4 pb-6">
      {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>}
      <h1 className="text-2xl font-extrabold leading-tight mt-1">{title}</h1>
      <p className="text-sm text-muted-foreground mt-2 mb-6">{subtitle}</p>
      {children}
    </div>
  );
}

function SelectGrid({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt} onClick={() => onChange(opt)}
            className={`px-3 py-3 rounded-xl text-sm font-medium border text-left transition ${
              active ? "bg-primary/15 border-primary text-foreground" : "bg-surface-2 border-border text-muted-foreground"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
