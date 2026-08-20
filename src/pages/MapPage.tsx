import { useEffect, useMemo, useState } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, Polygon, Polyline, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { geoIcon, getIconAspectRatio, groundSizeM } from '@/lib/geoIcon'
import { iconUrl, loadVenueMap, type MapFeature, type Venue } from '@/lib/logbook'
import 'leaflet/dist/leaflet.css'

function lineDash(style: string | null | undefined) {
  if (style === 'dashed') return '12 8'
  if (style === 'dotted') return '4 8'
  return undefined
}

function FeaturePopup({ title, description }: { title: string; description?: string }) {
  return (
    <div className="min-w-[12rem] max-w-xs">
      <p className="font-display text-lg leading-snug text-ink">{title || 'Без названия'}</p>
      {description ? <p className="mt-1 text-sm leading-relaxed text-ink/75">{description}</p> : null}
    </div>
  )
}

function FitBounds({ venue }: { venue: Venue }) {
  const map = useMap()
  useEffect(() => {
    if (venue.boundary.length < 2) return
    const bounds = L.latLngBounds(venue.boundary.map((p) => [p.latitude, p.longitude] as L.LatLngTuple))
    map.fitBounds(bounds, { padding: [40, 40] })
  }, [map, venue])
  return null
}

function MapZoom({ onZoom }: { onZoom: (zoom: number) => void }) {
  const map = useMap()
  useMapEvents({
    zoom() {
      onZoom(map.getZoom())
    },
    zoomend() {
      onZoom(map.getZoom())
    },
  })
  return null
}

function PointMarker({
  feature,
  remap,
  zoom,
}: {
  feature: MapFeature
  remap: Record<string, string>
  zoom: number
}) {
  const map = useMap()
  const url = iconUrl(feature.icon_key, remap)
  const [aspect, setAspect] = useState(1)
  const lat = feature.latitude
  const lng = feature.longitude

  useEffect(() => {
    let cancelled = false
    getIconAspectRatio(url).then((ratio) => {
      if (!cancelled) setAspect(ratio)
    })
    return () => {
      cancelled = true
    }
  }, [url])

  const icon = useMemo(() => {
    if (lat == null || lng == null) return null
    return geoIcon({
      map,
      url,
      lat,
      lng,
      groundSizeM: groundSizeM(feature.ground_size_m),
      aspect,
    })
  }, [map, url, lat, lng, feature.ground_size_m, aspect, zoom])

  if (lat == null || lng == null || !icon) return null
  return (
    <Marker position={[lat, lng]} icon={icon}>
      <Popup>
        <FeaturePopup title={feature.title} description={feature.description} />
      </Popup>
    </Marker>
  )
}

export function PolygonMap() {
  const [venue, setVenue] = useState<Venue | null>(null)
  const [features, setFeatures] = useState<MapFeature[]>([])
  const [remap, setRemap] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)
  const [zoom, setZoom] = useState(13)

  useEffect(() => {
    let cancelled = false
    loadVenueMap()
      .then((data) => {
        if (cancelled) return
        setVenue(data.venue)
        setFeatures(data.features)
        setRemap(data.remap)
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'не удалось загрузить карту')
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return <p className="p-6 text-center text-parchment/70">Карта: {error}</p>
  }
  if (!venue) {
    return <p className="flex h-full items-center justify-center text-parchment/50">Загрузка карты…</p>
  }

  const boundary = venue.boundary.map((p) => [p.latitude, p.longitude] as [number, number])
  const center = boundary[0] ?? [55.43, 60.37]

  return (
    <MapContainer center={center} zoom={13} className="h-full w-full rounded-xl" scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds venue={venue} />
      <MapZoom onZoom={setZoom} />
      {boundary.length >= 3 ? (
        <Polygon
          positions={boundary}
          pathOptions={{
            color: venue.stroke_color || '#C45C26',
            fillColor: venue.fill_color || '#C45C26',
            fillOpacity: 0.12,
            weight: 2,
            dashArray: '8 6',
          }}
        >
          <Popup>
            <FeaturePopup title={venue.name} description={venue.description} />
          </Popup>
        </Polygon>
      ) : null}
      {features.map((f) => {
        if (f.kind === 'polygon' && f.nodes && f.nodes.length >= 3) {
          return (
            <Polygon
              key={f.id}
              positions={f.nodes.map((n) => [n.latitude, n.longitude] as [number, number])}
              pathOptions={{
                color: f.stroke_color ?? '#C45C26',
                fillColor: f.fill_color ?? '#C45C26',
                fillOpacity: 0.35,
                weight: 2,
              }}
            >
              <Popup>
                <FeaturePopup title={f.title} description={f.description} />
              </Popup>
            </Polygon>
          )
        }
        if (f.kind === 'line' && f.nodes && f.nodes.length >= 2) {
          return (
            <Polyline
              key={f.id}
              positions={f.nodes.map((n) => [n.latitude, n.longitude] as [number, number])}
              pathOptions={{
                color: f.stroke_color ?? '#8B5A2B',
                weight: 4,
                dashArray: lineDash(f.line_style),
              }}
            >
              <Popup>
                <FeaturePopup title={f.title} description={f.description} />
              </Popup>
            </Polyline>
          )
        }
        if (f.kind === 'point') {
          return <PointMarker key={f.id} feature={f} remap={remap} zoom={zoom} />
        }
        return null
      })}
    </MapContainer>
  )
}

export function MapPage() {
  return (
    <div className="h-[min(100vh,720px)] overflow-hidden rounded-xl border border-gold/20">
      <PolygonMap />
    </div>
  )
}
