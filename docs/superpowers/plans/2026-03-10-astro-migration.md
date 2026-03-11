# Jekyll to Astro Migration Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate serkanh.github.io from Jekyll to Astro with a dark shadcn-style design matching the V2 Pencil mockup.

**Architecture:** Astro static site with content collections for blog posts. Tailwind CSS v4 for styling with zinc dark palette. Lucide icons. GitHub Pages deployment via Astro's static adapter.

**Tech Stack:** Astro 5.x, Tailwind CSS v4, @astrojs/sitemap, lucide (icons), JetBrains Mono + Inter fonts

---

## File Structure

```
src/
  components/
    Nav.astro          # Top navigation bar (logo, links, search, socials)
    Footer.astro       # Footer with tech stack + social icons
    PostCard.astro     # Card component for post grid
    Tag.astro          # Monospace tag pill
  layouts/
    BaseLayout.astro   # HTML shell, head, nav + footer wrapper
    PostLayout.astro   # Single post layout (back link, header, prose content, prev/next)
  pages/
    index.astro        # Homepage: hero + 6-card post grid
    posts/
      index.astro      # All posts listing
      [...slug].astro  # Dynamic post pages
    tags/
      index.astro      # All tags page
      [tag].astro      # Posts filtered by tag
    resources.astro    # Resources page (migrated)
    one-liners.astro   # One-liners page (migrated)
  content/
    posts/             # Migrated markdown posts (from _posts/)
    config.ts          # Content collection schema
  styles/
    global.css         # Tailwind imports + custom styles
astro.config.mjs       # Astro config (site, integrations)
tailwind.config.mjs    # Tailwind config (zinc palette, fonts)
package.json
tsconfig.json
```

## Design Tokens (from V2 Pencil mockup)

- **Background:** `#09090B` (zinc-950)
- **Card bg:** `#18181B` (zinc-900)
- **Borders:** `#27272A` (zinc-800)
- **Muted text:** `#52525B` (zinc-600), `#71717A` (zinc-500), `#A1A1AA` (zinc-400)
- **Primary text:** `#FAFAFA` (zinc-50)
- **Accent blue:** `#3B82F6` (blue-500)
- **Status green:** `#22C55E` (green-500)
- **Fonts:** Inter (body), JetBrains Mono (code/tags)

---

## Chunk 1: Project Setup

### Task 1: Initialize Astro project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/styles/global.css`
- Create: `tailwind.config.mjs`

- [ ] **Step 1: Initialize Astro**

```bash
cd /Users/shaytac/Projects/serkanh.github.io
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict
```

- [ ] **Step 2: Install dependencies**

```bash
npm install @astrojs/tailwind @astrojs/sitemap tailwindcss @tailwindcss/typography lucide-astro
```

- [ ] **Step 3: Configure Astro**

Update `astro.config.mjs` with site URL, tailwind + sitemap integrations, static output for GitHub Pages.

- [ ] **Step 4: Configure Tailwind**

Set up `tailwind.config.mjs` with Inter + JetBrains Mono fonts, extend zinc palette, enable typography plugin.

- [ ] **Step 5: Create global.css**

Tailwind directives + custom scrollbar styling + code block theme.

- [ ] **Step 6: Verify build**

```bash
npm run build
```

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: initialize Astro project with Tailwind CSS"
```

### Task 2: Content collection + post migration

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/posts/*.md` (22 files migrated from `_posts/`)

- [ ] **Step 1: Define content collection schema**

Schema: title (string), date (date), categories (string - comma-separated), description (optional string), tags (optional array).

- [ ] **Step 2: Migrate all 22 posts**

For each `_posts/YYYY-MM-DD-slug.markdown`:
- Move to `src/content/posts/slug.md`
- Update frontmatter: remove `layout`, keep `title`/`date`/`categories`, add `tags` array parsed from categories
- Keep content as-is (markdown compatible)

- [ ] **Step 3: Verify collection loads**

Create a minimal index page that queries the collection to confirm no schema errors.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: migrate 22 Jekyll posts to Astro content collection"
```

### Task 3: Components

**Files:**
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/PostCard.astro`
- Create: `src/components/Tag.astro`

- [ ] **Step 1: Build Nav component**

Logo with green dot, nav links with lucide icons, search bar with ⌘K badge, GitHub + LinkedIn icons.

- [ ] **Step 2: Build Footer component**

"Built with Astro · Tailwind CSS · shadcn/ui" + social icons.

- [ ] **Step 3: Build PostCard component**

Props: title, date, description, tags, slug, readingTime. Dark card with border, monospace tags, blue "Read more →".

- [ ] **Step 4: Build Tag component**

Props: name, href. Monospace pill with zinc-800 background.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat: add Nav, Footer, PostCard, Tag components"
```

### Task 4: Layouts

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/layouts/PostLayout.astro`

- [ ] **Step 1: Build BaseLayout**

HTML shell with Inter/JetBrains Mono fonts, meta tags, SEO, global.css, Nav + Footer + slot.

- [ ] **Step 2: Build PostLayout**

Extends BaseLayout. Back link, post meta (date, reading time), title, tags, prose-styled article content, prev/next navigation.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "feat: add BaseLayout and PostLayout"
```

### Task 5: Pages

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/posts/index.astro`
- Create: `src/pages/posts/[...slug].astro`
- Create: `src/pages/tags/index.astro`
- Create: `src/pages/tags/[tag].astro`
- Create: `src/pages/resources.astro`
- Create: `src/pages/one-liners.astro`

- [ ] **Step 1: Build homepage**

Hero section (gradient title, bio, status pill, CTA buttons) + "Latest Posts" heading with "View all" button + 3-column grid of 6 most recent PostCards.

- [ ] **Step 2: Build posts listing page**

All posts in reverse chronological order, same card grid.

- [ ] **Step 3: Build dynamic post page**

Uses PostLayout. Renders markdown content with Tailwind Typography prose classes.

- [ ] **Step 4: Build tags pages**

Tags index (all unique tags) + filtered posts by tag.

- [ ] **Step 5: Build resources + one-liners pages**

Migrate content from existing markdown files.

- [ ] **Step 6: Verify full build + dev server**

```bash
npm run dev
npm run build
```

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add all pages (home, posts, tags, resources)"
```

### Task 6: GitHub Pages deployment + cleanup

**Files:**
- Create: `.github/workflows/deploy.yml`
- Remove: Old Jekyll files (`_includes/`, `_layouts/`, `_config.yml`, `Gemfile`, etc.)

- [ ] **Step 1: Add GitHub Actions deploy workflow**

Astro's official GitHub Pages action.

- [ ] **Step 2: Remove old Jekyll files**

Remove `_includes/`, `_layouts/`, `_posts/`, `_config.yml`, `Gemfile`, `Gemfile.lock`, `_site/`, old HTML pages that are now Astro pages.

- [ ] **Step 3: Keep static assets**

Keep `images/`, `download/`, `assets/` in `public/`.

- [ ] **Step 4: Final build verification**

```bash
npm run build && npx serve dist
```

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "chore: remove Jekyll files, add GitHub Pages deploy workflow"
```

### Task 7: Create PR

- [ ] **Step 1: Push and create PR**

```bash
git push -u origin new-page
gh pr create --title "feat: migrate from Jekyll to Astro" --base master
```
