export const LOGBOOK_ORIGIN = 'https://logbook-admin-nine.vercel.app'
export const VENUE_ID = 'venue-1ypf'

export function logbookApi(path: string) {
  return `/logbook-api${path}`
}

export function logbookAsset(path: string) {
  if (path.startsWith('http')) return path
  return `${LOGBOOK_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}

export type LatLng = { latitude: number; longitude: number }

export type Venue = {
  id: string
  name: string
  description: string
  padding_px: number
  stroke_color: string
  fill_color: string
  boundary: LatLng[]
}

export type MapFeature = {
  id: string
  kind: 'point' | 'line' | 'polygon' | string
  title: string
  description: string
  icon_key: string | null
  latitude: number | null
  longitude: number | null
  nodes: LatLng[] | null
  line_style: string | null
  stroke_color: string | null
  fill_color: string | null
  ground_size_m: number | null
}

function bbox(boundary: LatLng[]) {
  const lats = boundary.map((p) => p.latitude)
  const lngs = boundary.map((p) => p.longitude)
  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
  }
}

function featureTouchesVenue(f: MapFeature, boundary: LatLng[]) {
  const box = bbox(boundary)
  const pts: LatLng[] = []
  if (f.latitude != null && f.longitude != null) {
    pts.push({ latitude: f.latitude, longitude: f.longitude })
  }
  if (f.nodes) pts.push(...f.nodes)
  return pts.some(
    (p) => p.latitude >= box.minLat && p.latitude <= box.maxLat && p.longitude >= box.minLng && p.longitude <= box.maxLng,
  )
}

export async function loadVenueMap() {
  const [venueRes, featRes, remapRes] = await Promise.all([
    fetch(logbookApi(`/api/venue?id=${encodeURIComponent(VENUE_ID)}`)),
    fetch(logbookApi(`/api/map-features?venueId=${encodeURIComponent(VENUE_ID)}`)),
    fetch(logbookApi('/map-icons/icon-key-remap.json')).catch(() => null),
  ])
  if (!venueRes.ok) throw new Error(`venue ${venueRes.status}`)
  const venueJson = (await venueRes.json()) as { venue: Venue | null }
  const venue = venueJson.venue
  if (!venue) throw new Error('полигон не найден')

  let features: MapFeature[] = []
  if (featRes.ok) {
    const data = (await featRes.json()) as { features?: MapFeature[] }
    features = data.features ?? []
  }
  if (features.length === 0) {
    const allRes = await fetch(logbookApi('/api/map-features'))
    if (allRes.ok) {
      const data = (await allRes.json()) as { features?: MapFeature[] }
      features = (data.features ?? []).filter((f) => featureTouchesVenue(f, venue.boundary))
    }
  }

  let remap: Record<string, string> = {}
  if (remapRes && remapRes.ok) {
    remap = (await remapRes.json()) as Record<string, string>
  }

  return { venue, features, remap }
}

const LEAFLET_MARKER = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png'

export function iconUrl(iconKey: string | null | undefined, remap: Record<string, string>) {
  const raw = iconKey && iconKey !== 'leaflet/marker' ? (remap[iconKey] ?? iconKey) : null
  if (!raw) return LEAFLET_MARKER
  const encoded = raw
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/')
  return logbookAsset(`/map-icons/${encoded}.png`)
}
