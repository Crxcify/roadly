/// <reference types="google.maps" />
import { useEffect, useState } from "react";

let loaderPromise: Promise<typeof google> | null = null;

export function loadGoogleMaps(): Promise<typeof google> {
  if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
  if ((window as any).google?.maps) return Promise.resolve((window as any).google);
  if (loaderPromise) return loaderPromise;

  const key = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY;
  const channel = import.meta.env.VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID;
  if (!key) return Promise.reject(new Error("Maps key missing"));

  loaderPromise = new Promise((resolve, reject) => {
    (window as any).__roadlyInitMap = () => resolve((window as any).google);
    const script = document.createElement("script");
    const params = new URLSearchParams({
      key,
      loading: "async",
      callback: "__roadlyInitMap",
      libraries: "geometry",
    });
    if (channel) params.set("channel", channel);
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
  return loaderPromise;
}

export function useGoogleMaps() {
  const [ready, setReady] = useState<boolean>(
    typeof window !== "undefined" && !!(window as any).google?.maps,
  );
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (ready) return;
    let cancel = false;
    loadGoogleMaps()
      .then(() => { if (!cancel) setReady(true); })
      .catch((e) => { if (!cancel) setError(e.message); });
    return () => { cancel = true; };
  }, [ready]);
  return { ready, error };
}
