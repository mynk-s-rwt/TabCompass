export function extractPageContent(): string {
  // Clone the body to avoid modifying the actual DOM
  const clone = document.body.cloneNode(true) as HTMLElement;

  // Remove script, style, nav, footer, and ad elements
  clone.querySelectorAll('script, style, nav, footer, header, aside, .ad, .advertisement, [role="banner"], [role="navigation"]').forEach(el => {
    el.remove();
  });

  const text = clone.innerText || clone.textContent || '';

  // Clean up whitespace
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim()
    .slice(0, 5000); // Limit to 5000 chars
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
