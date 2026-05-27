import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, Square, Gauge as GaugeIcon, Route as RouteIcon, Clock } from "lucide-react";
import { addDrive, type DrivePoint, type DriveSession } from "@/lib/store";
import { formatDuration } from "./app.drive";
import { LiveMap } from "@/components/LiveMap";

export const Route = createFileRoute("/app/drive-active")({
  component: DriveActive,
});

function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function DriveActive() {
  const navigate = useNavigate();
  const [running, setRunning] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [distance, setDistance] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [simulated, setSimulated] = useState(false);
  const [path, setPath] = useState<{ lat: number; lng: number }[]>([]);
  const [current, setCurrent] = useState<{ lat: number; lng: number } | null>(null);
  const [heading, setHeading] = useState<number | null>(null);

  const startedAt = useRef(Date.now());
  const pointsRef = useRef<DrivePoint[]>([]);
  const watchId = useRef<number | null>(null);
  const simTimer = useRef<number | null>(null);
  const speedSamples = useRef<number[]>([]);
  const cornerEventsRef = useRef<{ harsh: number; total: number }>({ harsh: 0, total: 0 });
  const brakeEventsRef = useRef<{ harsh: number; total: number }>({ harsh: 0, total: 0 });
  // After pause/resume, skip distance/event diff for the first new point.
  const resumeGapRef = useRef(false);


  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (!running) {
      // Mark the next point (after resume) as a gap so we don't add fake distance.
      resumeGapRef.current = true;
      return;
    }

    const handlePoint = (lat: number, lng: number, kmh: number, hd: number | null) => {
      const now = Date.now();
      const last = pointsRef.current[pointsRef.current.length - 1];
      if (last && !resumeGapRef.current) {
        const d = haversine({ lat: last.lat, lng: last.lng }, { lat, lng });
        // Ignore micro-jitter while effectively stationary (< ~5m and < 2 km/h).
        const moving = d > 0.005 || kmh > 2;
        if (moving) {
          setDistance((cur) => cur + d);
          const dv = last.speed - kmh;
          if (Math.abs(dv) > 1) {
            brakeEventsRef.current.total += 1;
            if (dv > 12) brakeEventsRef.current.harsh += 1;
          }
          if (last.heading != null && hd != null) {
            let dh = Math.abs(hd - last.heading);
            if (dh > 180) dh = 360 - dh;
            if (dh > 5) {
              cornerEventsRef.current.total += 1;
              if (dh > 35 && kmh > 25) cornerEventsRef.current.harsh += 1;
            }
          }
        }
      }
      resumeGapRef.current = false;
      pointsRef.current.push({ t: now, lat, lng, speed: kmh, heading: hd });
      speedSamples.current.push(kmh);
      setSpeed(Math.round(kmh));
      setMaxSpeed((m) => Math.max(m, kmh));
      setCurrent({ lat, lng });
      setHeading(hd);
      setPath(pointsRef.current.map((p) => ({ lat: p.lat, lng: p.lng })));
    };


    if (typeof navigator !== "undefined" && navigator.geolocation) {
      try {
        watchId.current = navigator.geolocation.watchPosition(
          (pos) => {
            const kmh = pos.coords.speed != null ? Math.max(0, pos.coords.speed * 3.6) : 0;
            handlePoint(pos.coords.latitude, pos.coords.longitude, kmh, pos.coords.heading ?? null);
          },
          (err) => { setError(err.message); startSim(); },
          { enableHighAccuracy: true, maximumAge: 1000, timeout: 8000 },
        );
      } catch { startSim(); }
    } else {
      startSim();
    }

    function startSim() {
      setSimulated(true);
      let lat = 53.349; let lng = -6.26; let h = 90; let kmh = 0;
      simTimer.current = window.setInterval(() => {
        kmh = Math.max(0, Math.min(70, kmh + (Math.random() - 0.4) * 8));
        h = (h + (Math.random() - 0.5) * 30 + 360) % 360;
        const step = (kmh / 3600) / 111;
        lat += Math.cos((h * Math.PI) / 180) * step;
        lng += Math.sin((h * Math.PI) / 180) * step;
        handlePoint(lat, lng, kmh, h);
      }, 1000);
    }

    return () => {
      if (watchId.current != null) navigator.geolocation.clearWatch(watchId.current);
      if (simTimer.current != null) clearInterval(simTimer.current);
    };
  }, [running]);

  const stop = () => {
    if (watchId.current != null) navigator.geolocation.clearWatch(watchId.current);
    if (simTimer.current != null) clearInterval(simTimer.current);

    // Use elapsed (active seconds only) so pause time doesn't inflate duration.
    const durationSec = Math.max(1, elapsed || Math.round((Date.now() - startedAt.current) / 1000));
    const samples = speedSamples.current.filter((s) => s > 1);
    const avg = samples.length ? samples.reduce((a, b) => a + b, 0) / samples.length : 0;
    const brakeRatio = brakeEventsRef.current.total ? brakeEventsRef.current.harsh / brakeEventsRef.current.total : 0;
    const cornerRatio = cornerEventsRef.current.total ? cornerEventsRef.current.harsh / cornerEventsRef.current.total : 0;
    const smoothBraking = Math.round(100 - brakeRatio * 100);
    const cornering = Math.round(100 - cornerRatio * 100);
    const variance = samples.length ? samples.reduce((a, b) => a + (b - avg) ** 2, 0) / samples.length : 0;
    const speedConsistency = Math.round(Math.max(0, 100 - variance / 2));
    const observation = Math.round(60 + Math.random() * 30);
    const score = Math.max(1, Math.min(10, (smoothBraking + cornering + speedConsistency + observation) / 40));

    // No usable data? Don't save a junk session.
    if (pointsRef.current.length < 2 || distance < 0.01) {
      navigate({ to: "/app/drive" });
      return;
    }

    const session: DriveSession = {
      id: `d_${Date.now()}`,
      startedAt: startedAt.current,
      endedAt: Date.now(),
      distanceKm: Math.max(distance, 0),
      durationSec,
      avgSpeed: avg,
      maxSpeed: Math.max(maxSpeed, 0),
      smoothBraking, cornering, speedConsistency, observation,
      score: Number(score.toFixed(1)),
      path: pointsRef.current.map((p) => ({ lat: p.lat, lng: p.lng })),
    };
    addDrive(session);
    navigate({ to: "/app/drive-summary", search: { id: session.id } });
  };


  return (
    <div className="flex flex-col min-h-[750px] bg-background">
      {/* Map fills top */}
      <div className="relative h-[58vh] min-h-[400px]">
        <LiveMap path={path} current={current} heading={heading} className="absolute inset-0 rounded-none" />

        {/* Top bar overlay */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-background/95 to-transparent">
          <button onClick={() => navigate({ to: "/app/drive" })} className="bg-surface-2/90 backdrop-blur rounded-full px-3 py-1.5 text-xs font-semibold">Cancel</button>
          <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold backdrop-blur ${running ? "bg-destructive/90 text-destructive-foreground" : "bg-muted/90 text-muted-foreground"}`}>
            {running ? "● REC" : "PAUSED"}
          </span>
        </div>

        {/* Live speed overlay */}
        <div className="absolute bottom-3 left-3 bg-background/85 backdrop-blur rounded-2xl px-4 py-2.5 border border-border">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Speed</p>
          <p className="text-3xl font-extrabold leading-none tabular-nums">{speed}<span className="text-xs font-medium text-muted-foreground ml-1">km/h</span></p>
        </div>

        {simulated && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-warning/95 text-warning-foreground text-[10px] px-2 py-1 rounded-full font-semibold">
            Simulated GPS
          </div>
        )}
        {error && !simulated && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-destructive/95 text-destructive-foreground text-[10px] px-2 py-1 rounded-full font-semibold">
            {error}
          </div>
        )}
      </div>

      {/* Stats panel */}
      <div className="flex-1 px-5 pt-4 pb-4 flex flex-col">
        <div className="grid grid-cols-3 gap-2">
          <Stat icon={<RouteIcon className="h-3.5 w-3.5" />} label="Distance" value={`${distance.toFixed(2)} km`} />
          <Stat icon={<Clock className="h-3.5 w-3.5" />} label="Time" value={formatDuration(elapsed)} />
          <Stat icon={<GaugeIcon className="h-3.5 w-3.5" />} label="Max" value={`${Math.round(maxSpeed)} km/h`} />
        </div>

        <div className="mt-auto flex gap-3 pt-5">
          <button onClick={() => setRunning((r) => !r)} className="flex-1 bg-surface-2 border border-border rounded-2xl py-3.5 font-semibold flex items-center justify-center gap-2">
            {running ? <><Pause className="h-4 w-4" /> Pause</> : <><Play className="h-4 w-4" /> Resume</>}
          </button>
          <button onClick={stop} className="flex-1 bg-destructive text-destructive-foreground rounded-2xl py-3.5 font-semibold flex items-center justify-center gap-2">
            <Square className="h-4 w-4" /> End
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-surface-2 rounded-2xl p-3">
      <div className="flex items-center gap-1 text-muted-foreground">{icon}<p className="text-[10px] uppercase tracking-wider">{label}</p></div>
      <p className="text-base font-bold tabular-nums mt-1">{value}</p>
    </div>
  );
}
