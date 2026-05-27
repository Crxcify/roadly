/// <reference types="google.maps" />
import { useEffect, useRef } from "react";
import { useGoogleMaps } from "@/lib/useGoogleMaps";

interface Pt { lat: number; lng: number }

export function RouteMap({ path, className }: { path: Pt[]; className?: string }) {
  const { ready, error } = useGoogleMaps();
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    if (!ready || !ref.current || mapRef.current) return;
    const start = path[0] ?? { lat: 53.349, lng: -6.26 };
    mapRef.current = new google.maps.Map(ref.current, {
      center: start,
      zoom: 14,
      disableDefaultUI: true,
      gestureHandling: "cooperative",
      clickableIcons: false,
      styles: darkStyle,
    });

    if (path.length >= 2) {
      new google.maps.Polyline({
        path,
        strokeColor: "#22c55e",
        strokeOpacity: 1,
        strokeWeight: 4,
        map: mapRef.current,
      });
      new google.maps.Marker({
        map: mapRef.current,
        position: path[0],
        icon: { path: google.maps.SymbolPath.CIRCLE, scale: 6, fillColor: "#22c55e", fillOpacity: 1, strokeColor: "#fff", strokeWeight: 2 },
      });
      new google.maps.Marker({
        map: mapRef.current,
        position: path[path.length - 1],
        icon: { path: google.maps.SymbolPath.CIRCLE, scale: 7, fillColor: "#fff", fillOpacity: 1, strokeColor: "#22c55e", strokeWeight: 3 },
      });
      const bounds = new google.maps.LatLngBounds();
      path.forEach((p) => bounds.extend(p));
      mapRef.current.fitBounds(bounds, 40);
    }
  }, [ready, path]);

  if (error) {
    return <div className={`${className} flex items-center justify-center text-xs text-muted-foreground bg-surface-2 rounded-3xl`}>Map unavailable</div>;
  }
  return (
    <div className={`${className} relative overflow-hidden rounded-3xl bg-surface-2`}>
      <div ref={ref} className="absolute inset-0" />
      {!ready && <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">Loading map…</div>}
    </div>
  );
}

const darkStyle: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#1a1f2e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8b95a8" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f1320" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2a3142" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3d4663" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0d1220" }] },
];
