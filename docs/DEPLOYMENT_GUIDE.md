# Deployment Guide - TabCompass Chrome Extension

**How to package, publish, and distribute your Chrome extension**

---

## Quick Deployment (For Hackathon Demo)

**Option 1: GitHub Release (Recommended for Hackathon)**

```bash
# 1. Build production version
npm run build

# 2. Create a zip file
cd dist
zip -r ../tabcompass-v1.0.0.zip .
cd ..

# 3. Commit and push to GitHub
git add .
git commit -m "feat: production build v1.0.0"
git push

# 4. Create GitHub release
# Go to: https://github.com/<your-username>/<repo>/releases/new
# - Tag: v1.0.0
# - Title: TabCompass v1.0.0 - Hackathon Release
# - Upload: tabcompass-v1.0.0.zip
# - Click "Publish release"

# 5. Share the release URL with judges/users
```

**Installation for Users (from GitHub):**
1. Download `tabcompass-v1.0.0.zip` from GitHub releases
2. Unzip the file
3. Open Chrome → `chrome://extensions`
4. Enable "Developer mode"
5. Click "Load unpacked"
6. Select the unzipped folder

---

## Full Chrome Web Store Deployment

### Prerequisites

1. **Google Developer Account** ($5 one-time fee)
   - Go to: https://chrome.google.com/webstore/devconsole
   - Sign in with Google account
   - Pay $5 registration fee
   - Verify email

2. **Required Assets**
   - Extension icon (128x128, 48x48, 16x16 PNG)
   - Screenshots (1280x800 or 640x400 PNG/JPG)
   - Promo images (440x280, 920x680, 1400x560)
   - Privacy policy URL (if collecting data)

3. **Store Listing Info**
   - Name: TabCompass
   - Summary (132 chars max)
   - Detailed description
   - Category: Productivity
   - Language: English

---

### Step 1: Prepare Production Build

```bash
# 1. Update version in package.json and manifest.json
# package.json: "version": "1.0.0"
# manifest.json: "version": "1.0.0"

# 2. Build for production
npm run build

# 3. Test the production build locally
# Load dist/ in chrome://extensions
# Verify everything works

# 4. Create a zip file
cd dist
zip -r ../tabcompass-v1.0.0.zip .
cd ..
```

**Important:** The zip should contain the built files directly (not nested in a folder).

```
tabcompass-v1.0.0.zip
├── manifest.json
├── icons/
├── src/
│   ├── background/
│   ├── content/
│   ├── popup/
│   └── onboarding/
└── ...
```

---

### Step 2: Create Store Assets

**1. Icons (Already in project)**
- 16x16: `public/icons/icon16.png`
- 48x48: `public/icons/icon48.png`
- 128x128: `public/icons/icon128.png`

**2. Screenshots (Create 3-5)**
Use Chrome screenshot tool or design tool:

```
Screenshot 1: Popup search interface (1280x800)
Screenshot 2: Search results with tabs (1280x800)
Screenshot 3: Onboarding flow - API key setup (1280x800)
Screenshot 4: Analytics dashboard (if built) (1280x800)
Screenshot 5: Settings page (1280x800)
```

**3. Promotional Images (Optional but recommended)**
- Small tile: 440x280 PNG
- Marquee: 1400x560 PNG
- Large tile: 920x680 PNG

**Tools for creating promo images:**
- Figma (free)
- Canva (free)
- Photoshop
- GIMP (free)

---

### Step 3: Create Store Listing

**Name:** TabCompass

**Summary (132 characters max):**
```
Navigate your browsing history. AI-powered semantic tab search - find tabs by content, not keywords.
```

**Detailed Description:**
```markdown
🧭 TabCompass - Find What You Read, Not What You Remember

TabCompass uses Google's Gemini API to create a semantic memory layer for your browser. Never lose track of important tabs again.

✨ KEY FEATURES

🔍 Semantic Search
Find tabs by meaning, not exact keywords. Search "how to prevent memory leaks" and find relevant React articles even if the title doesn't match.

⏰ Time Travel
Search tabs from weeks or months ago. All tabs are indexed permanently in local storage - no 90-day Chrome history limit.

📊 Usage Analytics
Track where your time goes. See top domains, categories, and productivity patterns.

🔒 100% Private
All data stored locally in your browser. You control your own Gemini API key. No backend servers, no data collection.

💰 Free Forever
Bring your own Gemini API key (1,500 free requests/day). No subscriptions, no hidden costs.

⚡ HOW IT WORKS

1. Install TabCompass
2. Get a free Gemini API key (takes 2 minutes)
3. TabCompass automatically indexes your tabs
4. Press Cmd+Shift+K (Mac) or Ctrl+Shift+K (Windows) to search
5. Find tabs instantly by content, not just title

🎯 PERFECT FOR

- Developers researching solutions
- Students organizing learning materials
- Researchers managing sources
- Anyone with 50+ open tabs

🔐 PRIVACY

- 100% local storage (IndexedDB)
- You control your API key
- No backend servers
- No tracking or analytics
- Open source - audit the code

📦 TECH STACK

Built with Google Gemini API, React, TypeScript, and modern web technologies.

🌟 COMPETITIVE ADVANTAGES

Unlike other tab managers:
- FREE forever (no paid tiers)
- 100% local (no server uploads)
- Semantic search (not just keyword matching)
- Usage analytics included
- Open source

💡 SUPPORT

Report issues: https://github.com/<your-username>/tabcompass/issues
Documentation: https://github.com/<your-username>/tabcompass

Built for the NS Mini-Gemini Hackathon 🚀
```

**Category:** Productivity

**Language:** English

**Privacy Practices:**
```
Data Usage:
- Does NOT collect user data
- Does NOT sell user data
- All data stored locally on user's device

User Data:
- Tab URLs, titles, content (stored locally)
- User-provided Gemini API key (encrypted, stored locally)
- Browsing time analytics (stored locally)

Third-party Services:
- Google Gemini API (for generating embeddings)
  - Only sends tab content when user has API mode enabled
  - User controls their own API key
  - No data stored on Gemini servers
```

---

### Step 4: Submit to Chrome Web Store

1. **Go to Chrome Web Store Developer Dashboard**
   - https://chrome.google.com/webstore/devconsole

2. **Click "New Item"**
   - Upload `tabcompass-v1.0.0.zip`
   - Wait for upload to complete

3. **Fill in Store Listing**
   - Product details
   - Graphic assets (screenshots, icons)
   - Description
   - Category: Productivity
   - Language: English

4. **Privacy Practices**
   - Answer privacy questions
   - Add privacy policy URL (create one on GitHub Pages or your website)

5. **Submit for Review**
   - Click "Submit for review"
   - Review time: Usually 1-3 days (can be longer)

---

### Step 5: Privacy Policy (Required)

Create `PRIVACY_POLICY.md` in your repo:

```markdown
# Privacy Policy for TabCompass

Last updated: January 4, 2026

## Data Collection

TabCompass does NOT collect, store, or transmit any user data to external servers.

## Local Storage

The following data is stored LOCALLY on your device:
- Tab URLs, titles, and extracted content
- Your Gemini API key (encrypted)
- Browsing time analytics
- User preferences and settings

This data never leaves your browser and is stored in:
- Chrome's local storage (chrome.storage.local)
- IndexedDB (browser database)

## Third-Party Services

TabCompass uses Google's Gemini API for generating text embeddings when you enable AI mode:
- You provide your own API key
- Tab content is sent to Gemini API ONLY when generating embeddings
- Google's privacy policy applies: https://policies.google.com/privacy
- You control when and how the API is used

## User Control

You can:
- Delete all stored data from extension settings
- Remove the extension (deletes all data)
- Use Basic mode (no API calls)
- Choose which domains to index

## Changes

We may update this policy. Check this page for updates.

## Contact

Questions? Open an issue: https://github.com/<your-username>/tabcompass/issues
```

Host this on GitHub Pages or your website, then add the URL to Chrome Web Store listing.

---

### Step 6: Review Process

**What Chrome Reviews:**
- ✅ Manifest is valid
- ✅ Permissions are justified
- ✅ No malicious code
- ✅ Privacy policy matches data usage
- ✅ Screenshots match functionality
- ✅ Description is accurate

**Common Rejection Reasons:**
- Missing or incomplete privacy policy
- Excessive permissions not used
- Misleading description/screenshots
- Code obfuscation
- Trademark violations

**Timeline:**
- Initial review: 1-3 days
- If rejected: Fix issues and resubmit
- Updates: Usually faster (few hours to 1 day)

---

### Step 7: After Approval

**Your extension gets:**
- Chrome Web Store URL: `https://chrome.google.com/webstore/detail/<extension-id>`
- Listed in search results
- User reviews and ratings
- Install count tracking

**Share your extension:**
```
Install TabCompass: https://chrome.google.com/webstore/detail/<extension-id>
GitHub: https://github.com/<your-username>/tabcompass
```

---

## Updating Your Extension

### Version Numbering (Semantic Versioning)

```
1.0.0 → 1.0.1  (Bug fix)
1.0.0 → 1.1.0  (New feature)
1.0.0 → 2.0.0  (Breaking change)
```

### Update Process

```bash
# 1. Make changes to code

# 2. Update version
# Edit package.json: "version": "1.0.1"
# Edit public/manifest.json: "version": "1.0.1"

# 3. Build
npm run build

# 4. Create new zip
cd dist
zip -r ../tabcompass-v1.0.1.zip .
cd ..

# 5. Commit changes
git add .
git commit -m "feat: add new feature X"
git tag v1.0.1
git push --tags

# 6. Upload to Chrome Web Store
# Go to Developer Dashboard
# Click on TabCompass
# Click "Package" → "Upload new package"
# Upload tabcompass-v1.0.1.zip
# Click "Submit for review"

# 7. Create GitHub release (optional)
# Upload zip to GitHub releases for transparency
```

**Auto-updates:**
- Users automatically get updates within hours
- No action needed from users

---

## Alternative Distribution Methods

### 1. Direct .zip Distribution (Hackathon)

```bash
# Share the zip file directly
# Users install via "Load unpacked"
# Good for: Demos, testing, hackathons
```

**Pros:**
- Instant distribution
- No review process
- Full control

**Cons:**
- Users need Developer mode
- No auto-updates
- Extension shows warning

---

### 2. GitHub Releases (Open Source Projects)

```bash
# Create releases on GitHub
# Users download and install manually
# Good for: Open source, beta testing
```

**Pros:**
- Version control
- Changelog visible
- Community contributions

**Cons:**
- Manual installation
- No auto-updates
- Developer mode required

---

### 3. Self-Hosted (Enterprise)

```bash
# Host .crx file on your server
# Configure Chrome policy
# Good for: Internal company tools
```

**Requires:**
- Chrome Enterprise enrollment
- Policy configuration
- IT infrastructure

---

## For Your Hackathon (January 4, 2026)

**Recommended Approach:**

```bash
# Day of hackathon:

# 1. Final production build
npm run build

# 2. Create zip
cd dist && zip -r ../tabcompass-hackathon.zip . && cd ..

# 3. Push to GitHub
git add .
git commit -m "feat: hackathon submission v1.0.0"
git push

# 4. Create GitHub release
# Tag: v1.0.0-hackathon
# Upload: tabcompass-hackathon.zip
# Description: Full demo instructions

# 5. Share with judges
# GitHub repo URL
# Release download link
# Installation instructions (from TESTING_GUIDE.md)
# Live demo on your machine

# 6. (Optional) Start Chrome Web Store submission
# Can take 1-3 days, so submit early
# But GitHub release is enough for hackathon
```

**For Demo:**
- Have extension pre-loaded in Chrome
- Have demo data pre-indexed
- Have backup .zip file ready
- Print installation instructions
- Prepare DEMO_SCRIPT.md

---

## Post-Hackathon

If you want to publish publicly:

1. Create Chrome Web Store listing (Steps 1-6 above)
2. Set up privacy policy on GitHub Pages
3. Create marketing materials (screenshots, promo images)
4. Submit for review
5. Share on:
   - Product Hunt
   - Hacker News
   - Reddit (r/webdev, r/chrome, r/productivity)
   - Twitter
   - Dev.to

---

## Useful Links

- **Chrome Web Store Dashboard:** https://chrome.google.com/webstore/devconsole
- **Chrome Extension Docs:** https://developer.chrome.com/docs/extensions/
- **Manifest V3 Migration:** https://developer.chrome.com/docs/extensions/develop/migrate
- **Publishing Guide:** https://developer.chrome.com/docs/webstore/publish/
- **Privacy Best Practices:** https://developer.chrome.com/docs/webstore/program-policies/

---

## Checklist: Ready to Deploy?

### Pre-Deployment
- [ ] All features implemented and tested
- [ ] No console errors or warnings
- [ ] Version updated in package.json and manifest.json
- [ ] README.md complete with installation instructions
- [ ] Demo data prepared
- [ ] Screenshots taken (3-5 images)
- [ ] Privacy policy written
- [ ] CHANGELOG.md created

### Build
- [ ] `npm run build` completes successfully
- [ ] Test production build locally
- [ ] All files present in dist/
- [ ] Zip file created correctly
- [ ] Zip file size < 20MB (Chrome limit)

### GitHub
- [ ] Code pushed to GitHub
- [ ] GitHub release created
- [ ] Zip file uploaded to release
- [ ] Installation instructions in README
- [ ] License file added (MIT)

### Chrome Web Store (Optional)
- [ ] Developer account created ($5 paid)
- [ ] Store listing filled out
- [ ] Screenshots uploaded
- [ ] Privacy policy URL added
- [ ] Package uploaded
- [ ] Submitted for review

### Demo Ready
- [ ] Extension loaded and working
- [ ] Demo script prepared
- [ ] Backup zip file ready
- [ ] Internet connection tested (for API calls)
- [ ] Presentation slides ready

---

**Good luck with your hackathon! 🚀**
