/// <reference types="google.maps" />
import { useEffect, useRef } from "react";
import { useGoogleMaps } from "@/lib/useGoogleMaps";

interface Pt { lat: number; lng: number }

interface Props {
  path: Pt[];
  current?: Pt | null;
  heading?: number | null;
  className?: string;
}

export function LiveMap({ path, current, heading, className }: Props) {
  const { ready, error } = useGoogleMaps();
  const ref = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const lineRef = useRef<google.maps.Polyline | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  // init
  useEffect(() => {
    if (!ready || !ref.current || mapRef.current) return;
    const center = current ?? path[path.length - 1] ?? { lat: 53.349, lng: -6.26 };
    mapRef.current = new google.maps.Map(ref.current, {
      center,
      zoom: 16,
      disableDefaultUI: true,
      gestureHandling: "greedy",
      clickableIcons: false,
      styles: darkMapStyle,
    });
    lineRef.current = new google.maps.Polyline({
      path: path,
      strokeColor: "#22c55e",
      strokeOpacity: 1,
      strokeWeight: 4,
      map: mapRef.current,
    });
  }, [ready]);

  // update path + marker
  useEffect(() => {
    if (!mapRef.current || !lineRef.current) return;
    lineRef.current.setPath(path);
    const pos = current ?? path[path.length - 1];
    if (!pos) return;
    if (!markerRef.current) {
      markerRef.current = new google.maps.Marker({
        map: mapRef.current,
        position: pos,
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 5,
          fillColor: "#22c55e",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 2,
          rotation: heading ?? 0,
        },
      });
    } else {
      markerRef.current.setPosition(pos);
      const icon = markerRef.current.getIcon() as google.maps.Symbol;
      markerRef.current.setIcon({ ...icon, rotation: heading ?? icon.rotation ?? 0 });
    }
    mapRef.current.panTo(pos);
  }, [path, current, heading]);

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

const darkMapStyle: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#1a1f2e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8b95a8" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0f1320" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2a3142" }] },
  { featureType: "road.arterial", elementType: "geometry", stylers: [{ color: "#343b50" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#3d4663" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9aa3b8" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0d1220" }] },
];
