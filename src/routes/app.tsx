import { createFileRoute, Outlet, redirect, useLocation } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app")({
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user) throw redirect({ to: "/login" });

    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarded")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile?.onboarded) throw redirect({ to: "/onboarding" });

    if (location.pathname === "/app" || location.pathname === "/app/") {
      throw redirect({ to: "/app/home" });
    }
  },
  component: AppLayout,
});

function AppLayout() {
  const path = useLocation({ select: (l) => l.pathname });
  // Hide bottom nav on immersive screens
  const hideNav = path.includes("/quiz") || path.includes("/drive-active") || path.includes("/mock-test/run");
  return (
    <PhoneFrame>
      <div className="flex flex-col min-h-full">
        <div className="flex-1 pb-4">
          <Outlet />
        </div>
        {!hideNav && <BottomNav />}
      </div>
    </PhoneFrame>
  );
}
