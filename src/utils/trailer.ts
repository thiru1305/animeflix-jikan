// utils/trailer.ts
export function buildTrailerUrl(trailer?: { embed_url?: string | null; youtube_id?: string | null }) {
  // Prefer MAL’s embed, otherwise build from youtube_id
  const base =
    trailer?.embed_url ??
    (trailer?.youtube_id ? `https://www.youtube-nocookie.com/embed/${trailer.youtube_id}` : '');

  if (!base) return '';

  // Autoplay tends to be allowed when muted; playsinline avoids fullscreen on mobile
  const hasQuery = base.includes('?');
  const join = hasQuery ? '&' : '?';
  return `${base}${join}autoplay=1&mute=0&playsinline=1&rel=0&modestbranding=1`
}
