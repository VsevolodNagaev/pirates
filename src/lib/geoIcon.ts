import L from 'leaflet'

export const DEFAULT_GROUND_SIZE_M = 100
export const MIN_GEO_ICON_PX = 10
export const MAX_GEO_ICON_PX = 480

const aspectCache = new Map<string, number>()

export function groundSizeM(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value) || value <= 0) return DEFAULT_GROUND_SIZE_M
  return value
}

/** Высота иконки в px: ground_size_m метров на земле при текущем зуме. */
export function groundMetersToIconHeightPx(
  map: L.Map,
  lat: number,
  lng: number,
  meters: number,
) {
  if (meters <= 0) return MIN_GEO_ICON_PX
  const center = L.latLng(lat, lng)
  const dLat = (meters / 6378137) * (180 / Math.PI)
  const north = L.latLng(lat + dLat, lng)
  const px = Math.abs(map.latLngToLayerPoint(center).y - map.latLngToLayerPoint(north).y)
  return Math.min(Math.max(Math.round(px), MIN_GEO_ICON_PX), MAX_GEO_ICON_PX)
}

export function getIconAspectRatio(url: string): Promise<number> {
  const cached = aspectCache.get(url)
  if (cached != null) return Promise.resolve(cached)
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const ratio = img.naturalWidth / Math.max(img.naturalHeight, 1)
      aspectCache.set(url, ratio)
      resolve(ratio)
    }
    img.onerror = () => resolve(1)
    img.src = url
  })
}

export function geoIcon(opts: {
  map: L.Map
  url: string
  lat: number
  lng: number
  groundSizeM: number
  aspect: number
}) {
  const heightPx = groundMetersToIconHeightPx(opts.map, opts.lat, opts.lng, opts.groundSizeM)
  const widthPx = Math.max(MIN_GEO_ICON_PX, Math.round(heightPx * opts.aspect))
  return L.icon({
    iconUrl: opts.url,
    iconSize: [widthPx, heightPx],
    iconAnchor: [widthPx / 2, heightPx],
    popupAnchor: [0, -heightPx * 0.9],
  })
}
