export function extractPageContent(): string {
  // Start with the most important content: title and meta description
  const title = document.title || '';
  const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
  const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';

  // Build priority content (title + descriptions)
  const priorityContent = [title, ogTitle, metaDesc, ogDesc]
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i) // dedupe
    .join(' | ');

  // Clone the body to avoid modifying the actual DOM
  const clone = document.body.cloneNode(true) as HTMLElement;

  // Remove script, style, nav, footer, and ad elements
  // Extended list to better filter YouTube and similar sites
  clone.querySelectorAll(`
    script, style, noscript, iframe,
    nav, footer, header, aside,
    .ad, .advertisement, .sidebar, .menu, .navigation,
    [role="banner"], [role="navigation"], [role="complementary"],
    ytd-mini-guide-renderer, ytd-guide-renderer, tp-yt-app-drawer,
    #guide, #masthead, #secondary, #related,
    [aria-label="Guide"], [aria-label="Navigation"]
  `.replace(/\s+/g, '')).forEach(el => {
    el.remove();
  });

  // Try to find main content area
  const mainContent = (clone.querySelector('main, article, [role="main"], #content, .content, #primary')
    || clone) as HTMLElement;

  const bodyText = (mainContent.innerText || mainContent.textContent || '')
    .replace(/\s+/g, ' ')
    .trim();

  // Combine priority content with body text, prioritizing metadata
  const combined = priorityContent + ' ' + bodyText;

  return combined.slice(0, 5000); // Limit to 5000 chars
}

export function extractMetadata(): {
  title: string;
  description: string;
  keywords: string[];
} {
  const title = document.title;
  const descMeta = document.querySelector('meta[name="description"]');
  const description = descMeta?.getAttribute('content') || '';
  const keywordsMeta = document.querySelector('meta[name="keywords"]');
  const keywords = keywordsMeta?.getAttribute('content')?.split(',').map(k => k.trim()) || [];

  return { title, description, keywords };
}
