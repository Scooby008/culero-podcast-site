// Small animated bar-graph indicator used anywhere the site previously
// showed a static "now playing" pulse dot. Reads as a familiar music-app
// signal and can be tinted to a track/station's accent color.
export default function Equalizer({ color = 'var(--gold)', width = 13, height = 11, active = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, width, height, flexShrink: 0 }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          flex: 1,
          height: '100%',
          background: color,
          borderRadius: 1,
          transformOrigin: 'bottom',
          transform: active ? 'scaleY(0.6)' : 'scaleY(0.3)',
          opacity: active ? 1 : 0.5,
          animation: active ? `eqBounce 0.8s ease-in-out ${i * 0.18}s infinite` : 'none',
          transition: 'opacity 0.2s',
        }} />
      ))}
    </div>
  )
}
