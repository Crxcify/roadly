import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getState } from "@/lib/store";
import logoUrl from "@/assets/roadly-logo.png";

export const Route = createFileRoute("/")({
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setProgress((p) => Math.min(100, p + 4)), 40);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const s = getState();
      const next = !s.loggedIn ? "/login" : !s.onboarded ? "/onboarding" : "/app/home";
      navigate({ to: next });
    }
  }, [progress, navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <Logo size={96} />
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-center">Roadly</h1>
          <p className="text-sm text-muted-foreground text-center mt-1">Drive smarter. Pass confidently.</p>
        </div>
        <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden mt-6">
          <div className="h-full bg-primary transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

export function Logo({ size = 64 }: { size?: number }) {
  return (
    <img
      src={logoUrl}
      alt="Roadly logo"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="object-contain drop-shadow-[0_0_24px_rgba(45,212,168,0.35)]"
    />
  );
}
