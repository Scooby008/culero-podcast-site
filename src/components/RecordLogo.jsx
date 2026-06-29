export default function RecordLogo({ size = 36, spinning = false }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ animation: spinning ? 'spinRecord 8s linear infinite' : 'none', flexShrink: 0 }}
    >
      <defs>
        <radialGradient id="rlb" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#2c2c3e"/>
          <stop offset="65%" stopColor="#14141e"/>
          <stop offset="100%" stopColor="#050508"/>
        </radialGradient>
        <radialGradient id="rll" cx="38%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#f5d060"/>
          <stop offset="55%" stopColor="#d8b13a"/>
          <stop offset="100%" stopColor="#8f6f1c"/>
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#rlb)" stroke="#222" strokeWidth="1"/>
      <circle cx="50" cy="50" r="44" fill="none" stroke="#fff" strokeOpacity="0.05" strokeWidth="1"/>
      <circle cx="50" cy="50" r="38" fill="none" stroke="#fff" strokeOpacity="0.05" strokeWidth="0.8"/>
      <circle cx="50" cy="50" r="32" fill="none" stroke="#fff" strokeOpacity="0.05" strokeWidth="0.8"/>
      <circle cx="50" cy="50" r="26" fill="none" stroke="#fff" strokeOpacity="0.04" strokeWidth="0.8"/>
      <circle cx="50" cy="50" r="20" fill="none" stroke="#fff" strokeOpacity="0.04" strokeWidth="0.8"/>
      <circle cx="50" cy="50" r="18" fill="url(#rll)"/>
      <circle cx="50" cy="50" r="4" fill="#050508"/>
    </svg>
  )
}
