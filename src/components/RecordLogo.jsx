import { useId } from 'react'

// Mixes an "r, g, b" triplet toward white/black to build gradient stops.
function mix(rgb, target, amount) {
  const [r, g, b] = rgb.split(',').map(n => parseInt(n.trim(), 10))
  const m = c => Math.round(c + (target - c) * amount)
  return `rgb(${m(r)}, ${m(g)}, ${m(b)})`
}

// The vinyl-record brand mark. Pass `accentColor` (an "r, g, b" string) to
// tint the label to match whatever's currently playing — falls back to the
// brand gold when nothing is playing or no color could be extracted.
export default function RecordLogo({ size = 36, spinning = false, accentColor = null }) {
  const uid = useId()
  const labelId = `rll-${uid}`
  const bodyId = `rlb-${uid}`
  const rgb = accentColor || '216, 177, 58'
  const stopLight = mix(rgb, 255, 0.55)
  const stopMid = `rgb(${rgb})`
  const stopDark = mix(rgb, 0, 0.45)

  return (
    <svg
      width={size} height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ animation: spinning ? 'spinRecord 8s linear infinite' : 'none', flexShrink: 0, transition: 'filter 0.3s' }}
    >
      <defs>
        <radialGradient id={bodyId} cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#2c2c3e"/>
          <stop offset="65%" stopColor="#14141e"/>
          <stop offset="100%" stopColor="#050508"/>
        </radialGradient>
        <radialGradient id={labelId} cx="38%" cy="35%" r="55%">
          <stop offset="0%" stopColor={stopLight}/>
          <stop offset="55%" stopColor={stopMid}/>
          <stop offset="100%" stopColor={stopDark}/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#${bodyId})`} stroke="#222" strokeWidth="1"/>
      <circle cx="50" cy="50" r="44" fill="none" stroke="#fff" strokeOpacity="0.05" strokeWidth="1"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#fff" strokeOpacity="0.05" strokeWidth="0.8"/>
      <circle cx="50" cy="50" r="32" fill="none" stroke="#fff" strokeOpacity="0.05" strokeWidth="0.8"/>
      <circle cx="50" cy="50" r="26" fill="none" stroke="#fff" strokeOpacity="0.04" strokeWidth="0.8"/>
      <circle cx="50" cy="50" r="20" fill="none" stroke="#fff" strokeOpacity="0.04" strokeWidth="0.8"/>
      <circle cx="50" cy="50" r="18" fill={`url(#${labelId})`}/>
      <circle cx="50" cy="50" r="4" fill="#050508"/>
    </svg>
  )
}
