import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Copy, Check, Share2 } from "lucide-react";
import { useRoadly } from "@/lib/store";

export const Route = createFileRoute("/app/invite")({ component: Invite });

function Invite() {
  const navigate = useNavigate();
  const user = useRoadly((s) => s.user);
  const code = (user?.name ?? "FRIEND").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 6).padEnd(4, "X") + "10";
  const link = `https://roadly.app/join?ref=${code}`;
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  const copy = async (text: string, kind: "code" | "link") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // ignore
    }
  };

  const share = async () => {
    const data = { title: "Roadly", text: `Learn to drive smarter with me on Roadly. Use my code ${code} when you sign up.`, url: link };
    if (navigator.share) {
      try { await navigator.share(data); } catch { /* user cancelled */ }
    } else {
      copy(`${data.text} ${data.url}`, "link");
    }
  };

  return (
    <div className="px-5 pt-2 pb-2">
      <div className="flex items-center gap-3 py-2">
        <button onClick={() => navigate({ to: "/app/more" })} className="p-1 -ml-1"><ChevronLeft className="h-5 w-5" /></button>
        <p className="text-sm font-semibold">Invite a friend</p>
      </div>

      <div className="mt-4 bg-gradient-to-br from-primary/90 to-primary text-primary-foreground rounded-3xl p-5">
        <p className="text-xs uppercase tracking-wider opacity-80">Give 1 week. Get 1 week.</p>
        <p className="text-xl font-extrabold mt-2 leading-tight">Help a learner pass — get free Premium when they sign up.</p>
      </div>

      <p className="text-xs text-muted-foreground mt-5">Your invite code</p>
      <button onClick={() => copy(code, "code")} className="mt-2 w-full bg-surface-2 rounded-2xl p-4 flex items-center justify-between">
        <span className="text-2xl font-extrabold tracking-widest">{code}</span>
        {copied === "code" ? <Check className="h-5 w-5 text-primary" /> : <Copy className="h-5 w-5 text-muted-foreground" />}
      </button>

      <p className="text-xs text-muted-foreground mt-4">Or share your link</p>
      <button onClick={() => copy(link, "link")} className="mt-2 w-full bg-surface-2 rounded-2xl p-4 flex items-center justify-between gap-3">
        <span className="text-sm truncate">{link}</span>
        {copied === "link" ? <Check className="h-5 w-5 text-primary flex-shrink-0" /> : <Copy className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
      </button>

      <button onClick={share} className="mt-5 w-full bg-primary text-primary-foreground rounded-2xl py-3.5 font-semibold flex items-center justify-center gap-2">
        <Share2 className="h-4 w-4" /> Share invite
      </button>
    </div>
  );
}
