// Strip a "Culero Podcast NN" / "CULERO PODCAST NN" style prefix (any casing,
// any punctuation after the number) to get just the episode's place-name.
// Used anywhere we display an episode label, so every tab shows the same
// clean "EP {n} · {City}" format instead of raw, inconsistently-cased DB text.
export function episodeName(title, trackNumber) {
  const name = (title || '')
    .replace(/culero\s+podc?x?ast\s*\d*\s*[-–.·]*\s*/i, '')
    .trim()
  return name || `Episode ${trackNumber ?? '?'}`
}

// Title-cases a place name pulled from raw data (which is sometimes ALL CAPS,
// e.g. "MEMPHIS 2") so it reads consistently next to normally-cased entries.
export function toTitleCase(str) {
  if (!str) return str
  // Leave strings that are already mixed-case (not all-caps) alone.
  if (str !== str.toUpperCase()) return str
  return str.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
}
