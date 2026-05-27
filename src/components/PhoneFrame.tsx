import { ReactNode } from "react";

// Phone-shaped frame for the app. On mobile viewports, fills the screen.
export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background py-0 sm:py-8">
      <div
        className={`relative w-full sm:max-w-[420px] sm:h-[860px] h-screen bg-surface sm:rounded-[44px] sm:border sm:border-border overflow-hidden flex flex-col ${className}`}
      >
        <div className="flex-1 overflow-y-auto hide-scrollbar">{children}</div>
      </div>
    </div>
  );
}
