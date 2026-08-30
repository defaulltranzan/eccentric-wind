/** Static Tailwind build for Himalayan Magic Adventure.
 *  Replaces the runtime cdn.tailwindcss.com Play CDN.
 *  Output: public/tailwind.css   (build: npm run build:css) */
module.exports = {
  content: [
    './public/**/*.html',
    './public/**/*.js',
    '!./public/tailwind.css',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        border: 'var(--border)',
        accent: { DEFAULT: 'var(--accent)', hover: 'var(--accent-hover)' },
        muted: { DEFAULT: 'var(--muted)', foreground: 'var(--muted-foreground)' },
      },
      fontFamily: {
        heading: ['Oswald', 'sans-serif'],
        display: ['Oswald', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        sans: ['"IBM Plex Sans"', 'sans-serif'],
      },
      letterSpacing: { tightest: '-.04em', widest: '.15em' },
    },
  },
  // Classes assembled at runtime in treks.js / mountains.js / edit.js / *-render.js
  safelist: [
    { pattern: /^(col|row)-span-[1-6]$/, variants: ['sm', 'md', 'lg'] },
    { pattern: /^grid-cols-(1|2|3|4|5|6|10|12)$/, variants: ['sm', 'md', 'lg'] },
    { pattern: /^(bg|text|border|fill|stroke)-(accent|border|card|background|foreground|muted)$/ },
    { pattern: /^(bg|border)-accent\/(5|8|10|15|20|30|40|50)$/ },
    'line-through', 'hidden', 'flex', 'animate-pulse', 'opacity-0', 'opacity-100',
    'translate-y-full', 'translate-x-full',
  ],
  plugins: [],
};
