"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, Navigation, Sparkles, Locate } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Import leaflet styles
import "leaflet/dist/leaflet.css"

type Landmark = {
  name: string
  lat: number
  lng: number
  description: string
}

const LANDMARKS: Landmark[] = [
  { name: "FEB Canteen", lat: -6.9254, lng: 107.7725, description: "Canteen in Faculty of Economics and Business" },
  { name: "Central Library", lat: -6.9242, lng: 107.7740, description: "Kandaga - Central Library" },
  { name: "Jatinangor Dorm", lat: -6.9230, lng: 107.7760, description: "Student housing block B & C" },
  { name: "Rektorat Building", lat: -6.9275, lng: 107.7750, description: "Rectorate Administrative Building" },
  { name: "Main Gate", lat: -6.9295, lng: 107.7715, description: "Main gate entrance in Jatinangor" },
]

type InteractiveMapProps = {
  currentLocation: string
  onLocationSelect: (location: string) => void
}

// Regex to parse pinpoint format: e.g. "Pinpoint (-6.92540, 107.77250)"
const parseCoords = (str: string): [number, number] | null => {
  const match = str.match(/Pinpoint\s*\(\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)\s*\)/i)
  if (match) {
    return [parseFloat(match[1]), parseFloat(match[2])]
  }
  return null
}

export function InteractiveMap({ currentLocation, onLocationSelect }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const LRef = useRef<any>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Find active landmark if matched by name
  const activeLandmark = LANDMARKS.find(
    (l) => l.name.toLowerCase() === currentLocation.toLowerCase()
  )

  useEffect(() => {
    if (!mapRef.current) return

    let map: any

    // Dynamic import of Leaflet to avoid SSR errors
    import("leaflet").then((L) => {
      if (!mapRef.current) return
      LRef.current = L

      // Fix default icon path issues in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      // Determine initial center
      const initialCoords: [number, number] = [-6.9268, 107.7745] // Unpad Jatinangor center

      map = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView(initialCoords, 16)
      
      mapInstanceRef.current = map

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      }).addTo(map)

      // Add click handler to place a pin and update location field
      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng
        onLocationSelect(`Pinpoint (${lat.toFixed(5)}, ${lng.toFixed(5)})`)
      })

      setMapLoaded(true)
    })

    return () => {
      if (map) {
        map.remove()
        mapInstanceRef.current = null
        markerRef.current = null
      }
    }
  }, [onLocationSelect])

  // Sync marker and view when currentLocation changes
  useEffect(() => {
    if (!mapInstanceRef.current || !LRef.current) return

    const L = LRef.current
    const map = mapInstanceRef.current

    let targetCoords: [number, number] | null = null

    if (activeLandmark) {
      targetCoords = [activeLandmark.lat, activeLandmark.lng]
    } else {
      const parsed = parseCoords(currentLocation)
      if (parsed) {
        targetCoords = parsed
      }
    }

    if (targetCoords) {
      map.setView(targetCoords, map.getZoom())

      if (markerRef.current) {
        markerRef.current.setLatLng(targetCoords)
      } else {
        markerRef.current = L.marker(targetCoords).addTo(map)
      }
    } else {
      // Remove marker if input is cleared/invalid pinpoint
      if (markerRef.current) {
        map.removeLayer(markerRef.current)
        markerRef.current = null
      }
    }
  }, [currentLocation, activeLandmark])

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-ink flex items-center gap-1.5">
          <Navigation className="size-4 text-primary" strokeWidth={2} />
          Pinpoint Map
        </label>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
          <Sparkles className="size-3" />
          Click Map to Pinpoint
        </span>
      </div>

      {/* Styled Map Container */}
      <div className="relative rounded-xl overflow-hidden border border-border shadow-inner bg-muted h-60 z-0">
        <div ref={mapRef} className="h-full w-full" />
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-xs text-xs text-ink-soft">
            Loading map...
          </div>
        )}
      </div>

      {/* Landmarks Selection Chips */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">Quick Nangor Landmarks</span>
        <div className="flex flex-wrap gap-1.5">
          {LANDMARKS.map((landmark) => {
            const isSelected = activeLandmark?.name === landmark.name
            return (
              <button
                key={landmark.name}
                type="button"
                onClick={() => onLocationSelect(landmark.name)}
                className={cn(
                  "cursor-pointer rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-all duration-200 active:scale-95",
                  isSelected
                    ? "border-primary/20 bg-primary/10 text-primary shadow-xs"
                    : "border-border bg-card text-ink-soft hover:bg-muted hover:text-ink"
                )}
              >
                {landmark.name}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex gap-2 items-center justify-between pt-1 border-t border-border/40">
        <div className="text-[10px] text-ink-soft leading-relaxed flex-1">
          {activeLandmark 
            ? `${activeLandmark.name}: ${activeLandmark.description}`
            : "Click anywhere on the map to pinpoint a dropoff spot, or select a landmark."
          }
        </div>
        
        {/* Recenter/Reset button */}
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={() => onLocationSelect(LANDMARKS[0].name)}
          className="h-6 gap-1 text-[10px] px-2 shrink-0 cursor-pointer"
        >
          <Locate className="size-3" />
          Reset Map
        </Button>
      </div>
    </div>
  )
}
