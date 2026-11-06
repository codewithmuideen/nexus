# Aegisfort Security Website

A static, responsive corporate site for a security company. It's built in HTML5, CSS3 and vanilla JS, with no frameworks and no build step. Open `index.html` in a browser to view it.

## Structure
```
security-website/
├── index.html        # All sections (A–K), inline SVG icon sprite
├── css/style.css     # Design tokens (top of file), components, responsive rules
├── js/script.js      # Sticky nav, mobile menu, dropdowns, reveal, counters, image fallback
└── assets/
    ├── images/       # Put your own optimised photos here
    └── icons/logo.svg
```

## Customising
- **Brand name and logo:** "Aegisfort" is a placeholder. Replace `assets/icons/logo.svg` and the `.brand-name` text, which appears in the header and the footer.
- **Colours and fonts:** edit the variables in `:root` at the top of `css/style.css`.
- **Statistics:** edit `data-target` / `data-suffix` on each `.stat-num` in `index.html`. The current figures (1,000+ / 52+ / 5,000+) are placeholders, so use your verified numbers.
- **Trust claims:** "Licensed", "< 8 min" response time, "99.9%" uptime, "15+ years" and the testimonial are placeholders too. Replace them with real, verifiable claims before launch.
- **Contact details:** the phone number, email and address in the CTA and footer are placeholders.

## Images
The photos are currently hotlinked from Unsplash (free licence), so you can preview the site immediately. Before going live:
1. Download the photos you want, or your own shots, into `assets/images/`. Export them as WebP or JPG, around 1600px wide for large images and 900px for cards.
2. Update each `src` in `index.html` to point to `assets/images/your-file.webp`.

If any image fails to load, `script.js` swaps it for a branded navy panel, so the layout never shows a broken-image icon.

## Browser support
This works in all modern browsers (Chrome, Edge, Firefox, Safari). Animations respect `prefers-reduced-motion`.
