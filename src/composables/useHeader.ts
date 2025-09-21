import { watch, onMounted } from "vue";

export interface SeoParams {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

function setTag(selector: string, attr: string, value: string | undefined) {
  if (!value) return;
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) {
    if (selector.startsWith("meta[")) {
      el = document.createElement("meta");
      const m = selector.match(/meta\[(name|property)="([^"]+)"\]/);
      if (m) (el as HTMLMetaElement).setAttribute(m[1], m[2]);
      document.head.appendChild(el);
    } else if (selector.startsWith("link[")) {
      el = document.createElement("link");
      const m = selector.match(/link\[(rel)="([^"]+)"\]/);
      if (m) (el as HTMLLinkElement).setAttribute(m[1], m[2]);
      document.head.appendChild(el);
    }
  }
  el?.setAttribute(attr, value);
}

export function applySeo(params: SeoParams) {
  const siteName = "カリフオークション";
  if (params.title) {
    document.title = `${params.title} | ${siteName}`;
    setTag(
      'meta[name="twitter:title"]',
      "content",
      `${params.title} | ${siteName}`
    );
    setTag(
      'meta[property="og:title"]',
      "content",
      `${params.title} | ${siteName}`
    );
  }
  if (params.description) {
    setTag('meta[name="description"]', "content", params.description);
    setTag('meta[name="twitter:description"]', "content", params.description);
    setTag('meta[property="og:description"]', "content", params.description);
  }
  if (params.image) {
    setTag('meta[property="og:image"]', "content", params.image);
    setTag('meta[name="twitter:image"]', "content", params.image);
  }
  if (params.url) {
    setTag('meta[property="og:url"]', "content", params.url);
    setTag('link[rel="canonical"]', "href", params.url);
  }
}

export function useHeader(getter: () => SeoParams) {
  const apply = () => applySeo(getter());
  onMounted(apply);
  watch(getter, apply, { deep: true });
}
