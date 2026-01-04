export function extractPageContent(): string {
  // === WEIGHTED CONTENT EXTRACTION ===
  // Title is most important for search relevance, so we repeat it 3x
  // Structure: TITLE (3x) | HEADINGS | META DESCRIPTIONS | BODY CONTENT

  const title = document.title || '';
  const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
  const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
  const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';

  // Clone the body to avoid modifying the actual DOM
  const clone = document.body.cloneNode(true) as HTMLElement;

  // Remove script, style, nav, footer, and ad elements
  // Extended list to better filter YouTube, Twitter, and similar sites
  const selectorsToRemove = [
    'script', 'style', 'noscript', 'iframe', 'svg',
    'nav', 'footer', 'header', 'aside',
    '.ad', '.advertisement', '.sidebar', '.menu', '.navigation', '.nav',
    '.cookie-banner', '.popup', '.modal', '.tooltip',
    '[role="banner"]', '[role="navigation"]', '[role="complementary"]',
    '[aria-hidden="true"]',
    // YouTube specific
    'ytd-mini-guide-renderer', 'ytd-guide-renderer', 'tp-yt-app-drawer',
    '#guide', '#masthead', '#secondary', '#related', '#comments',
    '[aria-label="Guide"]', '[aria-label="Navigation"]',
    // Twitter/X specific
    '[data-testid="sidebarColumn"]', '[data-testid="primaryColumn"] > div:first-child',
    // Common noise
    '.share-buttons', '.social-share', '.comments-section', '.related-posts',
  ];

  clone.querySelectorAll(selectorsToRemove.join(',')).forEach(el => el.remove());

  // Extract headings (h1, h2) for additional context
  const headings: string[] = [];
  clone.querySelectorAll('h1, h2').forEach(h => {
    const text = (h.textContent || '').trim();
    if (text && text.length > 3 && text.length < 200) {
      headings.push(text);
    }
  });
  const uniqueHeadings = [...new Set(headings)].slice(0, 5); // Top 5 unique headings

  // Try to find main content area
  const mainContent = (clone.querySelector('main, article, [role="main"], #content, .content, #primary, .post-content, .article-content, .entry-content')
    || clone) as HTMLElement;

  // Get body text and clean it up
  let bodyText = (mainContent.innerText || mainContent.textContent || '')
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, ' ')
    .trim();

  // Remove common boilerplate phrases
  const boilerplatePhrases = [
    'Accept all cookies', 'Cookie preferences', 'Privacy policy',
    'Terms of service', 'Sign in', 'Sign up', 'Subscribe',
    'Share on Twitter', 'Share on Facebook', 'Share on LinkedIn',
    'Skip to content', 'Skip to main content', 'Loading...',
  ];
  for (const phrase of boilerplatePhrases) {
    bodyText = bodyText.replace(new RegExp(phrase, 'gi'), '');
  }

  // Build weighted content string
  // Title repeated 3x gives it ~3x importance in the embedding
  const weightedParts: string[] = [];

  // Title (highest weight - repeat 3x)
  if (title) {
    weightedParts.push(title, title, title);
  }

  // OG Title if different from title
  if (ogTitle && ogTitle !== title) {
    weightedParts.push(ogTitle);
  }

  // Headings (high weight)
  if (uniqueHeadings.length > 0) {
    weightedParts.push(...uniqueHeadings);
  }

  // Meta descriptions (medium weight)
  if (metaDesc) weightedParts.push(metaDesc);
  if (ogDesc && ogDesc !== metaDesc) weightedParts.push(ogDesc);

  // Body content (lower weight, but provides context)
  if (bodyText) {
    weightedParts.push(bodyText);
  }

  const combined = weightedParts.join(' | ');

  // Limit to 5000 chars for API efficiency
  return combined.slice(0, 5000);
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
