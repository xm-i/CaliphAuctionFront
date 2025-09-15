const CDN_ORIGIN = "https://cdn.caliphauction.com";

export function toCdnUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  // Ensure leading slash exactly once
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${CDN_ORIGIN}${p}`;
}

export { CDN_ORIGIN };
