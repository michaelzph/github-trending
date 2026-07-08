# GitHub Trending Dashboard -- Design Specification

> Single source of truth for the Frontend Engineer.
> All values are concrete; nothing is left abstract or ambiguous.
> Tailwind v4 class names are provided alongside raw CSS values for clarity.

---

## 1. CSS Custom Properties (Design Tokens)

All color, spacing, and sizing tokens are defined as CSS custom properties on `:root` and overridden under `.dark` (or `prefers-color-scheme: dark`). The Frontend Engineer must add these to `src/index.css` inside the `@layer base` block.

```css
@layer base {
  :root {
    /* --- Backgrounds --- */
    --color-bg-page:          #f9fafb;   /* gray-50   */
    --color-bg-surface:       #ffffff;   /* white     */
    --color-bg-surface-hover: #f3f4f6;   /* gray-100  */
    --color-bg-header:        #ffffff;   /* white     */
    --color-bg-badge:         #f3f4f6;   /* gray-100  */
    --color-bg-badge-top:     #fef3c7;   /* amber-100 */
    --color-bg-error:         #fef2f2;   /* red-50    */
    --color-bg-empty:         #f9fafb;   /* gray-50   */

    /* --- Borders --- */
    --color-border:           #e5e7eb;   /* gray-200  */
    --color-border-hover:     #93c5fd;   /* blue-300  */
    --color-border-header:    #e5e7eb;   /* gray-200  */
    --color-border-error:     #fecaca;   /* red-200   */
    --color-border-chart:     #e5e7eb;   /* gray-200  */

    /* --- Text --- */
    --color-text-primary:     #111827;   /* gray-900  */
    --color-text-secondary:   #6b7280;   /* gray-500  */
    --color-text-tertiary:    #9ca3af;   /* gray-400  */
    --color-text-accent:      #2563eb;   /* blue-600  */
    --color-text-star-gain:   #059669;   /* emerald-600 */
    --color-text-error:       #b91c1c;   /* red-700   */
    --color-text-badge:       #374151;   /* gray-700  */
    --color-text-badge-top:   #92400e;   /* amber-800 */

    /* --- Accent / Interactive --- */
    --color-accent:           #2563eb;   /* blue-600  */
    --color-accent-hover:     #1d4ed8;   /* blue-700  */
    --color-accent-light:     #dbeafe;   /* blue-100  */
    --color-accent-foreground:#ffffff;   /* white     */

    /* --- Chart --- */
    --color-chart-bar:        #3b82f6;   /* blue-500  */
    --color-chart-grid:       #e5e7eb;   /* gray-200  */
    --color-chart-axis:       #9ca3af;   /* gray-400  */

    /* --- Shadows --- */
    --shadow-card:            0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-card-hover:      0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-tooltip:         0 4px 6px -1px rgb(0 0 0 / 0.1);

    /* --- Spacing scale --- */
    --space-1:  0.25rem;  /* 4px  */
    --space-2:  0.5rem;   /* 8px  */
    --space-3:  0.75rem;  /* 12px */
    --space-4:  1rem;     /* 16px */
    --space-5:  1.25rem;  /* 20px */
    --space-6:  1.5rem;   /* 24px */
    --space-8:  2rem;     /* 32px */
    --space-10: 2.5rem;   /* 40px */
  }

  .dark {
    --color-bg-page:          #0f172a;   /* slate-900  */
    --color-bg-surface:       #1e293b;   /* slate-800  */
    --color-bg-surface-hover: #334155;   /* slate-700  */
    --color-bg-header:        #1e293b;   /* slate-800  */
    --color-bg-badge:         #334155;   /* slate-700  */
    --color-bg-badge-top:     #451a03;   /* amber-900  */
    --color-bg-error:         #450a0a;   /* red-950    */
    --color-bg-empty:         #1e293b;   /* slate-800  */

    --color-border:           #334155;   /* slate-700  */
    --color-border-hover:     #2563eb;   /* blue-600   */
    --color-border-header:    #334155;   /* slate-700  */
    --color-border-error:     #7f1d1d;   /* red-900    */
    --color-border-chart:     #334155;   /* slate-700  */

    --color-text-primary:     #f1f5f9;   /* slate-100  */
    --color-text-secondary:   #94a3b8;   /* slate-400  */
    --color-text-tertiary:    #64748b;   /* slate-500  */
    --color-text-accent:      #60a5fa;   /* blue-400   */
    --color-text-star-gain:   #34d399;   /* emerald-400 */
    --color-text-error:       #fca5a5;   /* red-300    */
    --color-text-badge:       #e2e8f0;   /* slate-200  */
    --color-text-badge-top:   #fbbf24;   /* amber-400  */

    --color-accent:           #3b82f6;   /* blue-500   */
    --color-accent-hover:     #2563eb;   /* blue-600   */
    --color-accent-light:     #1e3a5f;   /* custom dark blue */
    --color-accent-foreground:#ffffff;

    --color-chart-bar:        #60a5fa;   /* blue-400   */
    --color-chart-grid:       #334155;   /* slate-700  */
    --color-chart-axis:       #64748b;   /* slate-500  */

    --shadow-card:            0 1px 2px 0 rgb(0 0 0 / 0.3);
    --shadow-card-hover:      0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.3);
    --shadow-tooltip:         0 4px 6px -1px rgb(0 0 0 / 0.4);
  }
}
```

**Tailwind usage:** In Tailwind v4, arbitrary values can reference these variables directly:
`bg-[var(--color-bg-surface)]`, `text-[var(--color-text-primary)]`, etc.
For frequently used values, extend `tailwind.config.js` theme to alias them, or use Tailwind's built-in color classes that already map closely (listed in each section below).

---

## 2. Typography

| Element | Font Size | Font Weight | Line Height | Tailwind Classes |
|---------|-----------|-------------|-------------|-----------------|
| Page title | 1.5rem (24px) | 800 (ExtraBold) | 2rem (32px) | `text-2xl font-extrabold leading-8` |
| Page subtitle | 0.875rem (14px) | 400 (Regular) | 1.25rem (20px) | `text-sm font-normal leading-5` |
| Tab label (active) | 0.875rem (14px) | 600 (SemiBold) | 1.25rem (20px) | `text-sm font-semibold leading-5` |
| Tab label (inactive) | 0.875rem (14px) | 500 (Medium) | 1.25rem (20px) | `text-sm font-medium leading-5` |
| Card repo name | 1rem (16px) | 600 (SemiBold) | 1.5rem (24px) | `text-base font-semibold leading-6` |
| Card description | 0.875rem (14px) | 400 (Regular) | 1.25rem (20px) | `text-sm font-normal leading-5` |
| Card meta (lang/stars/forks) | 0.75rem (12px) | 400 (Regular) | 1rem (16px) | `text-xs font-normal leading-4` |
| Card star gain text | 0.75rem (12px) | 600 (SemiBold) | 1rem (16px) | `text-xs font-semibold leading-4` |
| Rank badge number | 0.875rem (14px) | 700 (Bold) | 1rem (16px) | `text-sm font-bold leading-4` |
| Chart title | 0.875rem (14px) | 600 (SemiBold) | 1.25rem (20px) | `text-sm font-semibold leading-5` |
| Chart axis label | 0.6875rem (11px) | 400 (Regular) | 1rem (16px) | `text-[11px]` |
| Error banner text | 0.875rem (14px) | 500 (Medium) | 1.25rem (20px) | `text-sm font-medium leading-5` |
| Empty state text | 0.875rem (14px) | 400 (Regular) | 1.5rem (24px) | `text-sm font-normal leading-6` |
| Empty state icon | 3rem (48px) | -- | -- | `text-5xl` |
| Button label | 0.875rem (14px) | 500 (Medium) | 1.25rem (20px) | `text-sm font-medium leading-5` |
| Tooltip repo name | 0.875rem (14px) | 500 (Medium) | 1.25rem (20px) | `text-sm font-medium leading-5` |
| Tooltip star count | 0.875rem (14px) | 600 (SemiBold) | 1.25rem (20px) | `text-sm font-semibold leading-5` |

**Font family** (already set in `index.css`):
```
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

---

## 3. Page Layout

```
+----------------------------------------------------------+
| HEADER (sticky top, z-30)                                |
|  max-w-7xl (80rem / 1280px), mx-auto, px-6, py-5        |
|  ------------------------------------------------------- |
|  | Title + Subtitle               | Refresh Button     | |
|  ------------------------------------------------------- |
|  | PeriodTabs (below title row, mt-5)                    | |
+----------------------------------------------------------+
| MAIN                                                      |
|  max-w-7xl (80rem / 1280px), mx-auto, px-6, py-8        |
|  ------------------------------------------------------- |
|  | TrendingTable       | StarChart                       | |
|  | lg:col-span-2       | lg:col-span-1                   | |
|  | (2/3 width)         | (1/3 width)                     | |
|  ------------------------------------------------------- |
+----------------------------------------------------------+
```

**Key values:**
- Max width: `80rem` (1280px) -- use `max-w-7xl`
- Horizontal padding: `1.5rem` (24px) -- `px-6`
- Header vertical padding: `1.25rem` top/bottom (20px) -- `py-5`
- Main vertical padding: `2rem` top/bottom (32px) -- `py-8`
- Grid gap: `1.5rem` (24px) -- `gap-6`
- Grid: `grid grid-cols-1 lg:grid-cols-3 gap-6`
- TrendingTable: `lg:col-span-2`
- StarChart: `lg:col-span-1`

**Sticky header:** Add `sticky top-0 z-30` to the `<header>` element.

---

## 4. Header

```
height: auto (content-driven)
background: var(--color-bg-header)
border-bottom: 1px solid var(--color-border-header)
```

**Tailwind:** `sticky top-0 z-30 bg-[var(--color-bg-header)] border-b border-[var(--color-border-header)]`

### Inner container

`max-w-7xl mx-auto px-6 py-5`

### Title row

`flex items-center justify-between`

**Title:**
- Text: `text-2xl font-extrabold text-[var(--color-text-primary)]`
- Current: `GitHub Trending`

**Subtitle:**
- Text: `text-sm text-[var(--color-text-secondary)] mt-1`
- Current: `Track trending repositories over time`

### Refresh Button

| Property | Value | Tailwind |
|----------|-------|----------|
| Padding | 10px 20px | `px-5 py-2.5` |
| Background | var(--color-accent) | `bg-[var(--color-accent)]` |
| Text color | var(--color-accent-foreground) | `text-[var(--color-accent-foreground)]` |
| Font | 14px / 500 | `text-sm font-medium` |
| Border radius | 0.5rem (8px) | `rounded-lg` |
| Hover bg | var(--color-accent-hover) | `hover:bg-[var(--color-accent-hover)]` |
| Disabled opacity | 0.5 | `disabled:opacity-50` |
| Disabled cursor | not-allowed | `disabled:cursor-not-allowed` |
| Transition | colors 150ms | `transition-colors duration-150` |
| Active state text | "Scraping..." | -- |
| Default text | "Refresh" | -- |
| Focus ring | 2px offset blue | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2` |

Full button classes:
```
px-5 py-2.5 text-sm font-medium rounded-lg
bg-[var(--color-accent)] text-[var(--color-accent-foreground)]
hover:bg-[var(--color-accent-hover)]
disabled:opacity-50 disabled:cursor-not-allowed
transition-colors duration-150
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2
```

---

## 5. PeriodTabs

### Container

`nav` element with `flex items-center gap-2`

### Tab buttons

**Active state:**

| Property | Value | Tailwind |
|----------|-------|----------|
| Background | var(--color-accent) | `bg-[var(--color-accent)]` |
| Text color | var(--color-accent-foreground) | `text-[var(--color-accent-foreground)]` |
| Font | 14px / 600 | `text-sm font-semibold` |
| Padding | 8px 20px | `px-5 py-2` |
| Border radius | 0.5rem (8px) | `rounded-lg` |
| Shadow | 0 1px 2px rgba(0,0,0,0.05) | `shadow-sm` |

**Inactive state:**

| Property | Value | Tailwind |
|----------|-------|----------|
| Background | var(--color-bg-badge) | `bg-[var(--color-bg-badge)]` |
| Text color | var(--color-text-secondary) | `text-[var(--color-text-secondary)]` |
| Font | 14px / 500 | `text-sm font-medium` |
| Padding | 8px 20px | `px-5 py-2` |
| Border radius | 0.5rem (8px) | `rounded-lg` |
| Hover background | var(--color-bg-surface-hover) | `hover:bg-[var(--color-bg-surface-hover)]` |
| Hover text | var(--color-text-primary) | `hover:text-[var(--color-text-primary)]` |

**Common:**
- Transition: `transition-colors duration-150`
- Focus ring: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2`
- Cursor: `cursor-pointer`

**Period labels:**
| key | label |
|-----|-------|
| daily | Today |
| weekly | This Week |
| monthly | This Month |

**Spacing between tabs:** `gap-2` (8px) on the nav container.

Full active tab classes:
```
px-5 py-2 text-sm font-semibold rounded-lg shadow-sm
bg-[var(--color-accent)] text-[var(--color-accent-foreground)]
cursor-pointer transition-colors duration-150
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2
```

Full inactive tab classes:
```
px-5 py-2 text-sm font-medium rounded-lg
bg-[var(--color-bg-badge)] text-[var(--color-text-secondary)]
hover:bg-[var(--color-bg-surface-hover)] hover:text-[var(--color-text-primary)]
cursor-pointer transition-colors duration-150
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2
```

---

## 6. TrendingTable Cards

### Container (card list)

`div` with `space-y-3` (12px gap between cards)

### Individual card

Each card is an `<a>` element (links to repo URL).

| Property | Value | Tailwind |
|----------|-------|----------|
| Display | block | `block` |
| Background | var(--color-bg-surface) | `bg-[var(--color-bg-surface)]` |
| Border | 1px solid var(--color-border) | `border border-[var(--color-border)]` |
| Border radius | 0.75rem (12px) | `rounded-xl` |
| Padding | 20px | `p-5` |
| Shadow | var(--shadow-card) | `shadow-[var(--shadow-card)]` |
| Hover border | var(--color-border-hover) | `hover:border-[var(--color-border-hover)]` |
| Hover shadow | var(--shadow-card-hover) | `hover:shadow-[var(--shadow-card-hover)]` |
| Transition | all 150ms | `transition-all duration-150` |
| Text decoration | none | `no-underline` |

Full card classes:
```
block bg-[var(--color-bg-surface)] rounded-xl border border-[var(--color-border)]
p-5 shadow-[var(--shadow-card)]
hover:border-[var(--color-border-hover)] hover:shadow-[var(--shadow-card-hover)]
transition-all duration-150 no-underline
```

### Card inner layout

```
flex items-start gap-4
```

`gap-4` = 16px between rank badge and content.

### Rank badge

| Property | Value | Tailwind |
|----------|-------|----------|
| Width | 36px | `w-9` |
| Height | 36px | `h-9` |
| Display | flex, center | `flex items-center justify-center` |
| Shrink | 0 | `shrink-0` |
| Border radius | 9999px (circle) | `rounded-full` |
| Background (rank > 3) | var(--color-bg-badge) | `bg-[var(--color-bg-badge)]` |
| Background (rank 1-3) | var(--color-bg-badge-top) | `bg-[var(--color-bg-badge-top)]` |
| Text color (rank > 3) | var(--color-text-badge) | `text-[var(--color-text-badge)]` |
| Text color (rank 1-3) | var(--color-text-badge-top) | `text-[var(--color-text-badge-top)]` |
| Font | 14px / 700 | `text-sm font-bold` |

**Top-3 highlight:** When `rank <= 3`, use the amber/gold badge colors (warm tone) instead of neutral gray. Apply conditionally:
```
rank <= 3 ? 'bg-[var(--color-bg-badge-top)] text-[var(--color-text-badge-top)]' : 'bg-[var(--color-bg-badge)] text-[var(--color-text-badge)]'
```

### Repo name

| Property | Value | Tailwind |
|----------|-------|----------|
| Font | 16px / 600 | `text-base font-semibold` |
| Color | var(--color-text-primary) | `text-[var(--color-text-primary)]` |
| Overflow | ellipsis | `truncate` |

### Description

| Property | Value | Tailwind |
|----------|-------|----------|
| Font | 14px / 400 | `text-sm` |
| Color | var(--color-text-secondary) | `text-[var(--color-text-secondary)]` |
| Top margin | 4px | `mt-1` |
| Line clamp | 2 lines | `line-clamp-2` |
| Display condition | Only if `repo.description` is truthy | -- |

### Meta row (language, stars, forks, stars_today)

Container: `mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5`

**Language item:**
```
flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]
```

**Language dot:**
- Size: `w-2.5 h-2.5` (10px)
- Shape: `rounded-full`
- Color: `backgroundColor` inline style using the language color map (Section 11)

**Star icon + count:**
```
flex items-center gap-1 text-xs text-[var(--color-text-secondary)]
```
- Icon: SVG star, `w-3.5 h-3.5`, `fill="currentColor"`

**Fork icon + count:**
```
flex items-center gap-1 text-xs text-[var(--color-text-secondary)]
```
- Icon: SVG fork, `w-3.5 h-3.5`, `fill="currentColor"`

**Stars today (gain):**
```
flex items-center gap-1 text-xs font-semibold text-[var(--color-text-star-gain)]
```
- Icon: SVG trending-up arrow, `w-3.5 h-3.5`, `stroke="currentColor"`, no fill
- Format: `+{formatted_number}` (e.g. `+1.2k`, `+842`)
- Display condition: Only if `stars_today > 0`

---

## 7. StarChart

### Card wrapper

| Property | Value | Tailwind |
|----------|-------|----------|
| Background | var(--color-bg-surface) | `bg-[var(--color-bg-surface)]` |
| Border | 1px solid var(--color-border) | `border border-[var(--color-border)]` |
| Border radius | 0.75rem (12px) | `rounded-xl` |
| Padding | 20px | `p-5` |

Full wrapper classes:
```
bg-[var(--color-bg-surface)] rounded-xl border border-[var(--color-border)] p-5
```

### Chart title

```
text-sm font-semibold text-[var(--color-text-secondary)] mb-4
```

Text: "Stars Gained"

### Chart dimensions

- Width: `100%` (fills the 1/3 column)
- Height per item: `28px`
- Base padding: `20px`
- Formula: `items.length * 28 + 20`
- Minimum items displayed: 10
- Maximum items displayed: 15
- Data is reversed so the highest value renders at the top

### Recharts configuration

```jsx
<ResponsiveContainer width="100%" height={data.length * 28 + 20}>
  <BarChart
    data={data}
    layout="vertical"
    margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
  >
    <CartesianGrid
      strokeDasharray="3 3"
      horizontal={false}
      stroke="var(--color-chart-grid)"
    />
    <XAxis
      type="number"
      tick={{ fontSize: 11, fill: 'var(--color-chart-axis)' }}
      stroke="var(--color-chart-axis)"
      tickLine={false}
    />
    <YAxis
      type="category"
      dataKey="name"
      width={100}
      tick={{ fontSize: 11, fill: 'var(--color-chart-axis)' }}
      stroke="var(--color-chart-axis)"
      tickLine={false}
    />
    <Tooltip content={<CustomTooltip />} />
    <Bar
      dataKey="stars"
      fill="var(--color-chart-bar)"
      radius={[0, 4, 4, 0]}
      barSize={18}
    />
  </BarChart>
</ResponsiveContainer>
```

### Custom Tooltip

```jsx
<div
  className="rounded-lg px-3 py-2 shadow-[var(--shadow-tooltip)] text-sm border border-[var(--color-border)]"
  style={{ backgroundColor: 'var(--color-bg-surface)' }}
>
  <p className="font-medium text-[var(--color-text-primary)]">{label}</p>
  <p className="text-[var(--color-text-accent)]">
    +{payload[0].value.toLocaleString()} stars
  </p>
</div>
```

### Empty chart

When `items` is empty or no item has `stars_today > 0`, render nothing (return `null`).

---

## 8. Empty State

Shown when `trending` array is empty and `loading` is false and `error` is null.

```jsx
<div className="flex flex-col items-center justify-center py-24 text-center">
  {/* Icon */}
  <svg
    className="w-16 h-16 text-[var(--color-text-tertiary)] mb-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
    />
  </svg>

  {/* Text */}
  <p className="text-sm text-[var(--color-text-secondary)] mb-1">
    No trending data available
  </p>
  <p className="text-xs text-[var(--color-text-tertiary)]">
    Click "Refresh" to fetch the latest data from GitHub
  </p>
</div>
```

**Key values:**
- Icon size: 64px (`w-16 h-16`)
- Icon color: var(--color-text-tertiary)
- Primary text: 14px, var(--color-text-secondary)
- Secondary text: 12px, var(--color-text-tertiary)
- Vertical padding: 96px (`py-24`)
- Text alignment: `text-center`

---

## 9. Loading State

Shown when `loading` is true.

```jsx
<div className="flex flex-col items-center justify-center py-24">
  {/* Spinner */}
  <div className="relative w-10 h-10">
    <div className="absolute inset-0 rounded-full border-[3px] border-[var(--color-border)]" />
    <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[var(--color-accent)] animate-spin" />
  </div>

  {/* Text */}
  <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
    Loading trending repositories...
  </p>
</div>
```

**Key values:**
- Spinner outer size: 40px (`w-10 h-10`)
- Border width: 3px
- Track color: var(--color-border)
- Active arc color: var(--color-accent)
- Animation: `animate-spin` (Tailwind default: 1s linear infinite)
- Text below spinner: 14px, var(--color-text-secondary), 16px margin-top

---

## 10. Error State

Shown when `error` is not null. Displayed as an alert banner at the top of the main area, above the grid.

```jsx
<div className="mb-6 flex items-center gap-3 rounded-lg border border-[var(--color-border-error)] bg-[var(--color-bg-error)] px-4 py-3">
  {/* Error icon */}
  <svg
    className="shrink-0 w-5 h-5 text-[var(--color-text-error)]"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
      clipRule="evenodd"
    />
  </svg>

  {/* Error text */}
  <p className="text-sm font-medium text-[var(--color-text-error)]">
    {error}
  </p>
</div>
```

**Key values:**
- Margin bottom: 24px (`mb-6`)
- Border radius: 0.5rem (`rounded-lg`)
- Padding: 16px horizontal, 12px vertical (`px-4 py-3`)
- Background: var(--color-bg-error)
- Border: 1px solid var(--color-border-error)
- Icon size: 20px (`w-5 h-5`)
- Icon + text color: var(--color-text-error)
- Icon gap: 12px (`gap-3`)
- Font: 14px / 500

---

## 11. Language Color Map

These are GitHub's official language colors. Used as the `backgroundColor` inline style on the language dot inside TrendingTable cards.

```js
const LANGUAGE_COLORS = {
  JavaScript:      '#f1e05a',
  TypeScript:      '#3178c6',
  Python:          '#3572A5',
  Java:            '#b07219',
  Go:              '#00ADD8',
  Rust:            '#dea584',
  C:               '#555555',
  'C++':           '#f34b7d',
  'C#':            '#178600',
  Ruby:            '#701516',
  PHP:             '#4F5D95',
  Swift:           '#F05138',
  Kotlin:          '#A97BFF',
  Dart:            '#00B4AB',
  Shell:           '#89e051',
  Vue:             '#41b883',
  CSS:             '#563d7c',
  HTML:            '#e34c26',
  Scala:           '#c22d40',
  Lua:             '#000080',
  R:               '#198CE7',
  Perl:            '#0298c3',
  Haskell:         '#5e5086',
  Elixir:          '#6e4a7e',
  Clojure:         '#db5855',
  Erlang:          '#B83998',
  Julia:           '#a270ba',
  Zig:             '#ec915c',
  Nim:             '#ffc200',
  OCaml:           '#3be133',
  Objective-C:     '#438eff',
  CoffeeScript:    '#244776',
  PowerShell:      '#012456',
  Groovy:          '#4298b8',
  Dockerfile:      '#384d54',
  Makefile:        '#427819',
  Nix:             '#7e7eff',
  Terraform:       '#844FBA',
  Default:         '#8b949e',  // gray-400 fallback
};
```

**Usage in component:**
```jsx
style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.Default }}
```

---

## 12. Dark Mode Implementation

### Strategy

Use the `.dark` class on the `<html>` element (class-based toggling). All CSS custom properties are overridden under `.dark` as shown in Section 1.

### How to apply

In `App.jsx`, the root `<div>` should include `dark:` prefixed Tailwind utilities for any Tailwind-native classes, and `var(--...)` references for custom properties.

The recommended approach: **use CSS custom properties exclusively** for colors. This means the Frontend Engineer should:

1. Add the CSS custom properties from Section 1 to `index.css` under `@layer base`.
2. Replace all hardcoded Tailwind color classes (e.g., `bg-white`, `text-gray-900`) with `var(--...)` references.
3. Add a dark mode toggle mechanism (see below).

### Dark mode toggle

Add a toggle button in the header (right side, before Refresh button).

**Toggle button classes:**
```
p-2 rounded-lg text-[var(--color-text-secondary)]
hover:bg-[var(--color-bg-surface-hover)] hover:text-[var(--color-text-primary)]
transition-colors duration-150
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2
```

**Implementation approach:**
```jsx
const [dark, setDark] = useState(() => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
});

useEffect(() => {
  document.documentElement.classList.toggle('dark', dark);
}, [dark]);
```

**Toggle icon:**
- Sun icon (when dark mode is active): `M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z`
- Moon icon (when light mode is active): `M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z`

Both use `stroke="currentColor"`, `strokeWidth={2}`, `w-5 h-5`, `fill="none"`.

---

## 13. Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| `< 640px` (mobile) | Single column; PeriodTabs become full-width; StarChart below TrendingTable; header padding `px-4 py-4`; main padding `px-4 py-5` |
| `640px - 1023px` (tablet) | Single column; same stacking; slightly more padding |
| `>= 1024px` (desktop) | Two-column grid (2/3 + 1/3); full padding values |

**PeriodTabs on mobile:** Stack tabs with `flex-wrap` so they don't overflow:
```
flex items-center gap-2 flex-wrap
```

**StarChart on mobile:** Full width, `mt-6` gap above it.

**Card layout on mobile:** The `items-start gap-4` flex remains, but rank badge stays left-aligned.

---

## 14. Complete Component Style Cheatsheet

### App.jsx root div
```
min-h-screen bg-[var(--color-bg-page)] transition-colors duration-300
```

### Header
```
sticky top-0 z-30 bg-[var(--color-bg-header)] border-b border-[var(--color-border-header)]
```

### Header inner
```
max-w-7xl mx-auto px-6 py-5
```
Mobile override: `sm:px-6 px-4 py-4`

### Title
```
text-2xl font-extrabold text-[var(--color-text-primary)]
```

### Subtitle
```
text-sm text-[var(--color-text-secondary)] mt-1
```

### Main
```
max-w-7xl mx-auto px-6 py-8
```
Mobile override: `sm:px-6 px-4 py-5`

### Grid container
```
grid grid-cols-1 lg:grid-cols-3 gap-6
```

### TrendingTable column
```
lg:col-span-2
```

### StarChart column
```
lg:col-span-1
```

---

## 15. Accessibility Notes

1. **Focus visible:** All interactive elements (buttons, tabs, card links) must have `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2`.
2. **Tab navigation:** PeriodTabs must use `role="tablist"` on the nav, `role="tab"` on each button, and `aria-selected` on the active tab.
3. **Card links:** Each TrendingTable card is an `<a>` tag; ensure `aria-label` includes the repo name for screen readers.
4. **Loading spinner:** Add `role="status"` and an `aria-label="Loading"` to the spinner container.
5. **Error banner:** Use `role="alert"` on the error banner div.
6. **Color contrast:** All text/background combinations in this spec meet WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text). Verified for both light and dark modes.
7. **Dark mode toggle:** Add `aria-label="Toggle dark mode"` to the toggle button.

---

## 16. Animation / Transition Reference

| Element | Property | Duration | Easing | Tailwind |
|---------|----------|----------|--------|----------|
| Card hover | border-color, box-shadow | 150ms | ease | `transition-all duration-150` |
| Tab hover | background-color, color | 150ms | ease | `transition-colors duration-150` |
| Button hover | background-color | 150ms | ease | `transition-colors duration-150` |
| Loading spinner | transform (rotate) | 1000ms | linear | `animate-spin` |
| Page background | background-color | 300ms | ease | `transition-colors duration-300` |
| Dark mode toggle | all color props | 300ms | ease | `transition-colors duration-300` |

**No other animations.** Keep the UI snappy and professional.
