// Lightweight reactive store using localStorage + Supabase auth/profile.
import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SkillLevel = "beginner" | "intermediate" | "test-ready";
export type Units = "metric" | "imperial";

export interface DrivePoint { t: number; lat: number; lng: number; speed: number; heading: number | null; }
export interface DriveSession {
  id: string;
  startedAt: number;
  endedAt: number;
  distanceKm: number;
  durationSec: number;
  avgSpeed: number;
  maxSpeed: number;
  smoothBraking: number;
  cornering: number;
  speedConsistency: number;
  observation: number;
  score: number;
  path: { lat: number; lng: number }[];
  type?: "city" | "rural" | "motorway" | "night" | "practice";
  notes?: string;
}

export interface MockTestResult { id: string; date: number; score: number; total: number; }

export interface ScheduledDrive { id: string; when: number; type: DriveSession["type"]; note?: string; }

export interface Notification { id: string; title: string; body: string; time: number; read: boolean; emoji: string; }

export interface Settings {
  units: Units;
  voiceCues: boolean;
  notifications: boolean;
  testDate: string | null; // ISO date
  weeklyDriveGoal: number;
}

export interface RoadlyState {
  loggedIn: boolean;
  user: { name: string; email: string; avatar?: string } | null;
  car: { brand: string; model: string } | null;
  level: SkillLevel | null;
  onboarded: boolean;
  drives: DriveSession[];
  mockTests: MockTestResult[];
  streak: number;
  lastStreakDay: string | null;
  lessonProgress: Record<string, number>;
  completedLessons: string[];
  bookmarks: string[];
  unlockedAchievements: string[];
  schedule: ScheduledDrive[];
  notifications: Notification[];
  hazardScores: { id: string; score: number; date: number }[];
  settings: Settings;
  premium: boolean;
  premiumSince: number | null;
}


const KEY = "roadly_state_v3";

const defaultState: RoadlyState = {
  loggedIn: false,
  user: null,
  car: null,
  level: null,
  onboarded: false,
  drives: [],
  mockTests: [],
  streak: 0,
  lastStreakDay: null,
  lessonProgress: {},
  completedLessons: [],
  bookmarks: [],
  unlockedAchievements: [],
  schedule: [],
  notifications: [
    { id: "n1", title: "Welcome to Roadly", body: "Set a test date in Settings to start a countdown.", time: Date.now(), read: false, emoji: "👋" },
  ],
  hazardScores: [],
  settings: { units: "metric", voiceCues: true, notifications: true, testDate: null, weeklyDriveGoal: 3 },
  premium: false,
  premiumSince: null,
};


let state: RoadlyState = load();
const listeners = new Set<() => void>();

// Fields synced to Supabase user_state.data
const SYNC_KEYS = [
  "drives", "mockTests", "streak", "lastStreakDay",
  "lessonProgress", "completedLessons", "bookmarks",
  "unlockedAchievements", "schedule", "notifications",
  "hazardScores", "settings", "premium", "premiumSince",
] as const;

function snapshotForSync(s: RoadlyState) {
  const out: Record<string, unknown> = {};
  for (const k of SYNC_KEYS) out[k] = s[k];
  return out;
}

let currentUserId: string | null = null;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let suppressPush = false;

function schedulePush() {
  if (suppressPush || !currentUserId) return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(async () => {
    pushTimer = null;
    const uid = currentUserId;
    if (!uid) return;
    try {
      await supabase
        .from("user_state")
        .upsert({ user_id: uid, data: snapshotForSync(state) as never }, { onConflict: "user_id" });
    } catch { /* offline-tolerant */ }
  }, 800);
}

function load(): RoadlyState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return { ...defaultState, ...parsed, settings: { ...defaultState.settings, ...(parsed.settings ?? {}) } };
  } catch { return defaultState; }
}

function persist() {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function getState() { return state; }

export function setState(patch: Partial<RoadlyState> | ((s: RoadlyState) => Partial<RoadlyState>)) {
  const p = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...p };
  persist();
  listeners.forEach((l) => l());
  if (Object.keys(p).some((k) => (SYNC_KEYS as readonly string[]).includes(k))) {
    schedulePush();
  }
}

export function useRoadly<T>(selector: (s: RoadlyState) => T): T {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => selector(state),
    () => selector(defaultState),
  );
}

export function bumpStreak() {
  const today = new Date().toDateString();
  if (state.lastStreakDay === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  setState({
    streak: state.lastStreakDay === yesterday ? state.streak + 1 : 1,
    lastStreakDay: today,
  });
}

export function notify(n: Omit<Notification, "id" | "time" | "read">) {
  if (!state.settings.notifications) return;
  setState({ notifications: [{ ...n, id: `n_${Date.now()}`, time: Date.now(), read: false }, ...state.notifications].slice(0, 30) });
}

export function markAllRead() {
  setState({ notifications: state.notifications.map((n) => ({ ...n, read: true })) });
}

export function addDrive(d: DriveSession) {
  setState({ drives: [d, ...state.drives] });
  bumpStreak();
  notify({ emoji: "🚗", title: "Drive saved", body: `${d.distanceKm.toFixed(1)} km · score ${d.score.toFixed(1)}/10` });
  checkAchievements();
}

export function addMockResult(r: MockTestResult) {
  setState({ mockTests: [r, ...state.mockTests] });
  bumpStreak();
  const pct = Math.round((r.score / r.total) * 100);
  notify({ emoji: "🎓", title: "Mock test complete", body: `Scored ${pct}% (${r.score}/${r.total})` });
  checkAchievements();
}

export function addHazardScore(id: string, score: number) {
  setState({ hazardScores: [{ id, score, date: Date.now() }, ...state.hazardScores] });
  bumpStreak();
}

export function completeLesson(id: string) {
  if (state.completedLessons.includes(id)) return;
  setState({ completedLessons: [...state.completedLessons, id] });
  notify({ emoji: "📘", title: "Lesson complete", body: "Nice — onto the next one." });
}

export function toggleBookmark(id: string) {
  const has = state.bookmarks.includes(id);
  setState({ bookmarks: has ? state.bookmarks.filter((b) => b !== id) : [...state.bookmarks, id] });
}

export function scheduleDrive(s: Omit<ScheduledDrive, "id">) {
  setState({ schedule: [...state.schedule, { ...s, id: `s_${Date.now()}` }].sort((a, b) => a.when - b.when) });
  notify({ emoji: "📅", title: "Drive scheduled", body: new Date(s.when).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) });
}

export function removeSchedule(id: string) {
  setState({ schedule: state.schedule.filter((s) => s.id !== id) });
}

import { ACHIEVEMENTS } from "./data";
export function checkAchievements() {
  const bestMock = state.mockTests.reduce((m, t) => Math.max(m, (t.score / t.total) * 100), 0);
  const bestDrive = state.drives.reduce((m, d) => Math.max(m, d.score), 0);
  const stats = { drives: state.drives.length, mocks: state.mockTests.length, streak: state.streak, bestMock, bestDrive };
  const unlocked = new Set(state.unlockedAchievements);
  const newly: string[] = [];
  ACHIEVEMENTS.forEach((a) => {
    if (!unlocked.has(a.id) && a.check(stats)) { unlocked.add(a.id); newly.push(a.id); }
  });
  if (newly.length) {
    setState({ unlockedAchievements: Array.from(unlocked) });
    newly.forEach((id) => {
      const a = ACHIEVEMENTS.find((x) => x.id === id);
      if (a) notify({ emoji: a.icon, title: "Achievement unlocked", body: a.title });
    });
  }
}

export async function logout() {
  try { await supabase.auth.signOut(); } catch { /* ignore */ }
  currentUserId = null;
  setState({ loggedIn: false, user: null, car: null, level: null, onboarded: false });
}

export function resetAll() {
  state = defaultState;
  persist();
  listeners.forEach((l) => l());
  void supabase.auth.signOut().catch(() => {});
}

// Premium gating (local for now; payment provider wires in later).
export const FREE_MOCK_LIMIT = 3;
export const FREE_HAZARD_LIMIT = 2;

export function setPremium(on: boolean) {
  setState({ premium: on, premiumSince: on ? (state.premiumSince ?? Date.now()) : null });
  notify(on
    ? { emoji: "👑", title: "Premium activated", body: "All features unlocked. Welcome to Roadly Premium." }
    : { emoji: "ℹ️", title: "Premium cancelled", body: "Your plan will end at the next billing date." });
}


// --- Supabase auth + profile sync ---
let authInitialized = false;
export function initAuth() {
  if (authInitialized || typeof window === "undefined") return;
  authInitialized = true;

  const hydrate = async (userId: string, email: string) => {
    currentUserId = userId;
    const [{ data: profile }, { data: remote }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id,name,email,avatar_url,car_brand,car_model,skill_level,onboarded")
        .eq("id", userId)
        .maybeSingle(),
      supabase
        .from("user_state")
        .select("data")
        .eq("user_id", userId)
        .maybeSingle(),
    ]);

    // Merge remote sync fields into local state (remote wins for synced keys)
    if (remote?.data && typeof remote.data === "object") {
      const r = remote.data as Partial<RoadlyState>;
      suppressPush = true;
      const merged: Partial<RoadlyState> = {};
      for (const k of SYNC_KEYS) {
        if (k in r && r[k] !== undefined) (merged as Record<string, unknown>)[k] = r[k];
      }
      // ensure settings object is merged with defaults
      if (merged.settings) merged.settings = { ...defaultState.settings, ...merged.settings };
      setState(merged);
      suppressPush = false;
    }

    setState({
      loggedIn: true,
      user: {
        name: profile?.name || email.split("@")[0] || "Driver",
        email: profile?.email || email,
        avatar: profile?.avatar_url ?? undefined,
      },
      car: profile?.car_brand || profile?.car_model
        ? { brand: profile?.car_brand ?? "", model: profile?.car_model ?? "" }
        : state.car,
      level: (profile?.skill_level as SkillLevel) ?? state.level,
      onboarded: Boolean(profile?.onboarded),
    });

    // If no remote row yet, seed it from current local state
    if (!remote) schedulePush();
  };

  supabase.auth.getSession().then(({ data }) => {
    if (data.session?.user) void hydrate(data.session.user.id, data.session.user.email ?? "");
  });

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT" || !session?.user) {
      currentUserId = null;
      setState({ loggedIn: false, user: null, onboarded: false });
      return;
    }
    void hydrate(session.user.id, session.user.email ?? "");
  });
}

export async function saveProfile(patch: {
  name?: string;
  car_brand?: string | null;
  car_model?: string | null;
  skill_level?: SkillLevel | null;
  onboarded?: boolean;
  avatar_url?: string | null;
}) {
  const { data: sess } = await supabase.auth.getUser();
  const uid = sess.user?.id;
  if (!uid) return { error: new Error("Not signed in") };
  const { error } = await supabase.from("profiles").update(patch).eq("id", uid);
  if (error) return { error };
  const next: Partial<RoadlyState> = {};
  if (patch.name !== undefined) next.user = state.user ? { ...state.user, name: patch.name } : state.user;
  if (patch.car_brand !== undefined || patch.car_model !== undefined) {
    next.car = {
      brand: patch.car_brand ?? state.car?.brand ?? "",
      model: patch.car_model ?? state.car?.model ?? "",
    };
  }
  if (patch.skill_level !== undefined) next.level = patch.skill_level;
  if (patch.onboarded !== undefined) next.onboarded = patch.onboarded;
  setState(next);
  return { error: null };
}

export function kmToDisplay(km: number, units: Units = state.settings.units) {
  return units === "imperial" ? { value: km * 0.621371, unit: "mi" } : { value: km, unit: "km" };
}
export function kmhToDisplay(kmh: number, units: Units = state.settings.units) {
  return units === "imperial" ? { value: kmh * 0.621371, unit: "mph" } : { value: kmh, unit: "km/h" };
}
