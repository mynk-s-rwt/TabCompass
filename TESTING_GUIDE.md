# Testing Guide - TabCompass Chrome Extension

**How to test the extension during development in the browser**

---

## Development Workflow

### 1. **Initial Build & Load**

```bash
# Start development build with watch mode
npm run dev

# This will:
# - Build to dist/ folder
# - Watch for file changes
# - Rebuild automatically
```

Then load in Chrome:
1. Open Chrome and go to `chrome://extensions`
2. Enable **"Developer mode"** (toggle in top-right)
3. Click **"Load unpacked"**
4. Select the `dist/` folder from your project
5. Extension will appear in toolbar

### 2. **Testing After Each Change**

After you make code changes:

**For most changes:**
- Click the **Reload icon** (↻) on your extension card at `chrome://extensions`
- Or use keyboard shortcut: `Ctrl+R` (Windows/Linux) or `Cmd+R` (Mac) while on the extensions page

**For manifest.json changes:**
- You must click **Remove** and re-load the unpacked extension

### 3. **Debugging Different Parts**

**Popup (Search UI):**
- Right-click extension icon → "Inspect popup"
- Opens DevTools for popup
- Can see console logs, network requests, React components

**Background Script:**
- On `chrome://extensions`, click **"Inspect views: service worker"**
- This shows background script console
- See indexing logs, API calls, errors

**Content Script:**
- Open any webpage
- Right-click → "Inspect" (normal DevTools)
- Content script logs appear in page console
- Look for "TabCompass" prefixed logs

**Onboarding/Options Pages:**
- These are full pages, just right-click → Inspect like normal webpages

### 4. **Quick Testing Per Phase**

**Phase 1 (Setup):**
```bash
npm run build
# Load in chrome://extensions
# Check: No errors, icon appears
```

**Phase 2-6 (Backend):**
```bash
# After each task
npm run dev
# Reload extension
# Check background script console for logs
# Test: Open tabs → check IndexedDB (Application tab in DevTools)
```

**Phase 7 (Popup UI):**
```bash
# After UI changes
npm run dev
# Reload extension
# Click extension icon → popup should open
# Inspect popup to see React components
```

**Phase 8 (Onboarding):**
```bash
# After onboarding changes
npm run dev
# Reload extension
# Navigate to: chrome-extension://<your-extension-id>/src/onboarding/index.html
# Or clear storage and trigger fresh install
```

### 5. **Checking IndexedDB (Storage)**

To verify tabs are being indexed:
1. Open DevTools on any page
2. Go to **Application** tab
3. Expand **IndexedDB** → **TabCompass** → **tabs**
4. You'll see all indexed tabs with embeddings

### 6. **Clearing Data for Fresh Testing**

```javascript
// In background script console, run:
chrome.storage.local.clear()
// Then in Application → IndexedDB → right-click → Delete database
```

Or use the extension's settings page (once built).

### 7. **Hot Reload (Optional Enhancement)**

The `@crxjs/vite-plugin` in the implementation should provide some hot reload capabilities, but for full reload:

```bash
# Keep this running during development
npm run dev

# Every save will trigger rebuild
# You still need to manually reload extension in chrome://extensions
```

### 8. **Common Issues & Fixes**

**Extension not updating after code change:**
- Make sure `npm run dev` is running
- Wait for build to complete (check terminal)
- Click reload on extension card

**Popup not opening:**
- Check background script console for errors
- Verify manifest.json has correct popup path
- Check if popup HTML is in dist/

**Content script not injecting:**
- Check matches pattern in manifest
- Some pages block content scripts (chrome://, chrome-extension://)
- Check page console for errors

**API calls failing:**
- Check network tab in popup DevTools
- Verify CORS (Gemini API should allow extension origins)
- Check API key is saved (chrome.storage.local)

### 9. **Testing Checklist Per Phase**

```bash
# Phase 1: Setup
✓ Extension loads without errors
✓ Icon appears in toolbar
✓ No red errors in chrome://extensions

# Phase 2-3: Types & Storage
✓ TypeScript compiles (no errors in terminal)
✓ Can import types

# Phase 4-5: API & Indexing
✓ Open tabs → check background console for "Indexed tab: ..."
✓ Check IndexedDB → tabs store has entries
✓ Verify embeddings array exists (if API key set)

# Phase 6: Search
✓ Open popup (click icon or Cmd+Shift+K)
✓ Type query → results appear
✓ Click result → tab opens/switches

# Phase 7-8: UI & Onboarding
✓ Fresh install → onboarding opens
✓ Complete flow → settings save
✓ Popup UI looks correct

# Phase 9: Analytics
✓ Switch tabs → check IndexedDB analytics store
✓ Verify time entries saved

# Phase 10: Testing
✓ Run through full user flow
✓ Fix any bugs found
```

---

## Pro Tips

**Tip 1: Keep Extensions Page Pinned**
- Pin `chrome://extensions` in a tab during development
- After each code change:
  1. Check terminal (build complete?)
  2. Switch to `chrome://extensions` tab
  3. Click reload
  4. Test your feature

**Tip 2: Watch Mode**
- Always keep `npm run dev` running in a terminal
- It will automatically rebuild on file changes
- Just reload the extension after rebuild completes

**Tip 3: DevTools Console Filtering**
- In background console, filter by "TabCompass" to see only your logs
- Use `console.log('[TabCompass]', ...)` pattern for easy filtering

**Tip 4: Test Incrementally**
- Test after every task completion
- Don't wait until end of phase
- Easier to debug when you know what changed

**Tip 5: Multiple Chrome Profiles**
- Use a separate Chrome profile for testing
- Keeps your main profile clean
- Can test fresh install experience easily

---

## Quick Reference: Where to Check What

| What You're Testing | Where to Check |
|---------------------|----------------|
| Extension loads | `chrome://extensions` → no errors |
| Background logs | Extensions page → "Inspect service worker" |
| Popup UI | Right-click icon → "Inspect popup" |
| Content extraction | Any webpage DevTools console |
| Indexed tabs | DevTools → Application → IndexedDB → tabs |
| API key saved | DevTools → Application → Storage → Local |
| Time tracking | DevTools → Application → IndexedDB → analytics |
| Network requests | Popup DevTools → Network tab |
| React components | Popup DevTools → Components tab (React DevTools) |

---

## Debugging Workflow Example

**Problem: Tabs not being indexed**

1. Open `chrome://extensions`
2. Click "Inspect service worker" (background script)
3. Open a new tab
4. Check background console for:
   - ✓ "pageLoaded" message
   - ✓ "Indexed tab: ..." message
   - ✗ Any errors?
5. If no logs, check:
   - Is content script injected? (Check page console)
   - Is indexing enabled in settings?
   - Is domain excluded?
6. Check IndexedDB to verify data saved

---

**This workflow lets you test incrementally after every task!**
