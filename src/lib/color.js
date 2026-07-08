// Visual-identity helpers: derive an accent color from a track's cover art
// (or, when no artwork exists, a stable hash-based color) so each mixtape
// or radio station reads as visually distinct instead of uniform gray/gold.

const cache = new Map()

// Sample the average color of an image and return it as an "r, g, b" string
// (ready to drop into rgba(${c}, 0.1)). Resolves null on any failure —
// callers should fall back to the brand gold in that case.
export function extractDominantColor(url) {
  if (!url) return Promise.resolve(null)
  if (cache.has(url)) return Promise.resolve(cache.get(url))

  return new Promise(resolve => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      try {
        const size = 24
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, size, size)
        const { data } = ctx.getImageData(0, 0, size, size)
        let r = 0, g = 0, b = 0, count = 0
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 100) continue
          r += data[i]; g += data[i + 1]; b += data[i + 2]
          count++
        }
        if (!count) { cache.set(url, null); resolve(null); return }
        r = Math.round(r / count); g = Math.round(g / count); b = Math.round(b / count)
        const max = Math.max(r, g, b), min = Math.min(r, g, b)
        // Skip near-white / near-black flat art — it won't read as an accent
        if (max - min < 12 && (max > 235 || max < 25)) { cache.set(url, null); resolve(null); return }
        const result = `${r}, ${g}, ${b}`
        cache.set(url, result)
        resolve(result)
      } catch {
        cache.set(url, null)
        resolve(null)
      }
    }
    img.onerror = () => { cache.set(url, null); resolve(null) }
    img.src = url
  })
}

// Deterministic "identity" color for things with no artwork (radio stations).
// Same input always produces the same color, so a station's swatch is stable
// across visits without needing real cover art.
export function hashColorRgb(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  const hue = Math.abs(hash) % 360
  return hslToRgbString(hue, 58, 50)
}

function hslToRgbString(h, s, l) {
  s /= 100; l /= 100
  const k = n => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  const r = Math.round(255 * f(0)), g = Math.round(255 * f(8)), b = Math.round(255 * f(4))
  return `${r}, ${g}, ${b}`
}
