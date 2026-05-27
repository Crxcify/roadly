import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { Logo } from "./index";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("Enter your email."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (mode === "signup" && name.trim().length < 2) { setError("Enter your name."); return; }

    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/app/home`,
            data: { name: name.trim() },
          },
        });
        if (error) throw error;
        toast.success("Account created");
        // Auto-confirm is on, so session exists immediately.
        if (data.session) {
          navigate({ to: "/onboarding" });
        } else {
          setMode("login");
          setError("Check your email to confirm, then sign in.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        toast.success("Welcome back");
        // Allow store hydrate to populate onboarded flag, then route.
        setTimeout(async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          const { data: profile } = await supabase
            .from("profiles").select("onboarded").eq("id", user.id).maybeSingle();
          navigate({ to: profile?.onboarded ? "/app/home" : "/onboarding" });
        }, 50);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg.replace("AuthApiError: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const social = async (provider: "google" | "apple") => {
    setError("");
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: `${window.location.origin}/app/home`,
      });
      if (result.error) throw result.error;
      // result.redirected → browser will navigate; otherwise session is set.
      if (!result.redirected) {
        const { data: { user } } = await supabase.auth.getUser();
        const { data: profile } = user
          ? await supabase.from("profiles").select("onboarded").eq("id", user.id).maybeSingle()
          : { data: null };
        navigate({ to: profile?.onboarded ? "/app/home" : "/onboarding" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
      setLoading(false);
    }
  };

  return (
    <PhoneFrame>
      <div className="flex flex-col h-full px-6 pt-8 pb-10">
        <div className="flex flex-col items-center gap-3 mt-6">
          <Logo size={72} />
          <h1 className="text-2xl font-extrabold mt-2">Welcome to Roadly</h1>
          <p className="text-sm text-muted-foreground text-center">
            {mode === "login" ? "Sign in to keep learning" : "Create your learner account"}
          </p>
        </div>

        <form className="mt-8 space-y-3" onSubmit={submit}>
          {mode === "signup" && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
                placeholder="Full name" autoComplete="name" disabled={loading}
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
              placeholder="Email" autoComplete="email" disabled={loading}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-2xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
              placeholder="Password (min 6 chars)" autoComplete={mode === "login" ? "current-password" : "new-password"} disabled={loading}
            />
          </div>
          {error && <p className="text-xs text-destructive px-1">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full bg-primary text-primary-foreground font-semibold rounded-2xl py-3.5 mt-3 active:scale-[0.98] transition flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "login" ? "Continue" : "Create account"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-2">
          <button type="button" onClick={() => social("google")} disabled={loading}
            className="w-full bg-surface-2 border border-border rounded-2xl py-3 text-sm font-medium disabled:opacity-60">
            Continue with Google
          </button>
          <button type="button" onClick={() => social("apple")} disabled={loading}
            className="w-full bg-surface-2 border border-border rounded-2xl py-3 text-sm font-medium disabled:opacity-60">
            Continue with Apple
          </button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-auto pt-8">
          {mode === "login" ? "New here?" : "Already have an account?"}{" "}
          <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} className="text-primary font-semibold">
            {mode === "login" ? "Create account" : "Sign in"}
          </button>
        </p>
      </div>
    </PhoneFrame>
  );
}
