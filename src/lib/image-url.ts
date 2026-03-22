/**
 * Turns common "wrong" URLs into ones that work in <img src>.
 * Unsplash gallery links are HTML pages; appending /download redirects to the image file.
 */
export function normalizeProductImageUrl(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    if (host !== 'unsplash.com') return url;

    const pathname = u.pathname.replace(/\/$/, '');
    if (!pathname.startsWith('/photos/') || pathname.length <= '/photos/'.length) {
      return url;
    }
    if (pathname.endsWith('/download')) return url;

    return `${u.origin}${pathname}/download${u.search}`;
  } catch {
    return url;
  }
}
