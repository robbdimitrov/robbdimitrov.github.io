# Robert Dimitrov

**Interactive CV** is a highly polished, web-based curriculum vitae built with a strict minimalist design philosophy and a high-performance rendering architecture. Designed to feel like a premium native application, it utilizes raw DOM APIs and pure CSS to achieve zero-dependency 60fps interactivity.

## Features

- **Modern Architecture**: Built entirely with Semantic HTML5, Vanilla JavaScript, and Tailwind CSS. Zero heavy frameworks or build-chain bloat.
- **Storefront Dual-Direction Scroll**: Implements a complex, viewport-aware dual-direction sticky scroll for the profile sidebar—mirroring the behavior of premium storefront galleries (e.g. Apple, Amazon).
- **Spotlight UI**: Features a hardware-accelerated, high-end radial gradient tracking effect linked to desktop pointer movements via coalesced `requestAnimationFrame` writes.
- **Touch-Native Flow**: Automatically degrades to a highly optimized `IntersectionObserver`-style scroll tracker for mobile and touch devices, highlighting the active timeline item without layout thrashing.
- **Dynamic Theming**: Fully supports system-aware light and dark modes with a custom glassmorphism toggle and `color-scheme` syncing.
- **Print Optimized**: Features a dedicated `@media print` stylesheet that automatically reformats the CV into a clean, traditional single-column layout suitable for PDF generation and ATS parsers.
- **Anti-Scraping**: Employs dynamic DOM string obfuscation to protect email addresses from basic regex static scrapers.

## Running Locally

1. Install dependencies: `npm install`
2. Build the CSS: `npm run build`
3. Open `src/index.html` in any modern web browser to view the project locally.

## License

Licensed under the [MIT](LICENSE) License.
