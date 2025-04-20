document.addEventListener('DOMContentLoaded', () => {
    // --- Get Elements ---
    const root = document.documentElement;
    const bodyElement = document.body; // Reference to body for background styles

    // Preview Area & Components
    const previewArea = document.getElementById('component-preview-area');
    const componentPreviews = document.querySelectorAll('.component-preview'); // All preview elements
    const componentSelectorRadios = document.querySelectorAll('input[name="component-type"]');

    // Page Background Controls
    const bgColorInput = document.getElementById('bg-color');
    const gridSizeSlider = document.getElementById('grid-size');
    const gridOpacitySlider = document.getElementById('grid-opacity');
    const gridSizeValueSpan = document.getElementById('grid-size-value');
    const gridOpacityValueSpan = document.getElementById('grid-opacity-value');

    // Component Color Controls - HSL
    const hueSlider = document.getElementById('hue');
    const saturationSlider = document.getElementById('saturation');
    const lightnessSlider = document.getElementById('lightness');
    const hueValueSpan = document.getElementById('hue-value');
    const saturationValueSpan = document.getElementById('saturation-value');
    const lightnessValueSpan = document.getElementById('lightness-value');

    // Component Color Controls - RGB
    const redSlider = document.getElementById('red');
    const greenSlider = document.getElementById('green');
    const blueSlider = document.getElementById('blue');
    const redValueSpan = document.getElementById('red-value');
    const greenValueSpan = document.getElementById('green-value');
    const blueValueSpan = document.getElementById('blue-value');

    // Direct Input & HEX
    const colorStringInput = document.getElementById('color-string');
    const inputErrorSpan = document.getElementById('input-error');
    const hexInput = document.getElementById('hex-code');
    const copyHexButton = document.getElementById('copy-hex-button');

    // Glass Effect Controls
    const glassBlurSlider = document.getElementById('glass-blur');
    const glassOpacitySlider = document.getElementById('glass-opacity');
    const glassBlurValueSpan = document.getElementById('glass-blur-value');
    const glassOpacityValueSpan = document.getElementById('glass-opacity-value');

    // Utilities
    const randomColorButton = document.getElementById('random-color-button');
    const resetButton = document.getElementById('reset-button');
    const contrastRatioSpan = document.getElementById('contrast-ratio');
    const contrastRatingSpan = document.getElementById('contrast-rating');

    // Theme, Border, Font Controls
    const themeButtons = document.querySelectorAll('.theme-button');
    const borderStyleRadios = document.querySelectorAll('input[name="border-style"]');
    const fontStyleRadios = document.querySelectorAll('input[name="font-style"]');

    // Snippet Controls
    const cssSnippetTextArea = document.getElementById('css-snippet');
    const copySnippetButton = document.getElementById('copy-snippet-button');

    // --- State Variables ---
    let currentComponentType = 'card'; // Default selected component
    let currentBorderStyle = 'sharp';
    let currentFont = "'Source Code Pro', monospace";
    let isUpdating = false; // Flag to prevent update loops

    // Store initial default values from CSS variables or set fallbacks
    const defaultHue = parseInt(getComputedStyle(root).getPropertyValue('--default-hue').trim() || 180);
    const defaultSaturation = parseInt(getComputedStyle(root).getPropertyValue('--default-saturation').trim().replace('%','') || 100);
    const defaultLightness = parseInt(getComputedStyle(root).getPropertyValue('--default-lightness').trim().replace('%','') || 50);
    const defaultFont = getComputedStyle(root).getPropertyValue('--default-font').trim() || "'Source Code Pro', monospace";
    const defaultBorder = getComputedStyle(root).getPropertyValue('--default-border').trim() || 'sharp';
    const defaultGlassBlur = getComputedStyle(root).getPropertyValue('--default-glass-blur').trim() || '5px';
    const defaultGlassOpacity = parseFloat(getComputedStyle(root).getPropertyValue('--default-glass-opacity').trim() || 0.4);
    const defaultPageBgColor = getComputedStyle(root).getPropertyValue('--default-page-bg-color').trim() || '#050818';
    const defaultGridSize = getComputedStyle(root).getPropertyValue('--default-grid-size').trim() || '20px';
    const defaultGridAlpha = parseFloat(getComputedStyle(root).getPropertyValue('--default-grid-alpha').trim() || 0.07);

    // --- Theme Definitions ---
    const themes = {
        'default-cyan': { hue: 180, saturation: 100, lightness: 50, font: "'Source Code Pro', monospace", border: 'sharp' },
        'cyberpunk-pink': { hue: 320, saturation: 90, lightness: 60, font: "'Orbitron', sans-serif", border: 'sharp' },
        'matrix-green': { hue: 130, saturation: 85, lightness: 55, font: "'Share Tech Mono', monospace", border: 'sharp' },
        'warning-red': { hue: 0, saturation: 100, lightness: 50, font: "'Source Code Pro', monospace", border: 'rounded' },
        'arcade-orange': { hue: 35, saturation: 100, lightness: 55, font: "'Press Start 2P', cursive", border: 'rounded' }
    };

    // --- Color Conversion Functions ---
    function hslToRgb(h, s, l) { h = parseInt(h); s = parseInt(s); l = parseInt(l); s /= 100; l /= 100; let c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2, r = 0, g = 0, b = 0; if (0 <= h && h < 60) { r = c; g = x; b = 0; } else if (60 <= h && h < 120) { r = x; g = c; b = 0; } else if (120 <= h && h < 180) { r = 0; g = c; b = x; } else if (180 <= h && h < 240) { r = 0; g = x; b = c; } else if (240 <= h && h < 300) { r = x; g = 0; b = c; } else if (300 <= h && h < 360) { r = c; g = 0; b = x; } r = Math.round((r + m) * 255); g = Math.round((g + m) * 255); b = Math.round((b + m) * 255); return { r, g, b }; }
    function rgbToHsl(r, g, b) { r = parseInt(r); g = parseInt(g); b = parseInt(b); r /= 255; g /= 255; b /= 255; let max = Math.max(r, g, b), min = Math.min(r, g, b); let h = 0, s, l = (max + min) / 2; if (max === min) { h = s = 0; } else { let d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; case b: h = (r - g) / d + 4; break; } h /= 6; } return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }; }
    function rgbToHex(r, g, b) { r = parseInt(r); g = parseInt(g); b = parseInt(b); const toHex = val => { const hex = Number(val).toString(16); return hex.length === 1 ? '0' + hex : hex; }; return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase(); }
    function hexToRgb(hex) { hex = hex.trim(); let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); if (!result) { result = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex); if (result) { result[1] += result[1]; result[2] += result[2]; result[3] += result[3]; } else { return null; } } return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null; }
    function parseCssColor(str) { str = str.trim().toLowerCase(); let match; match = str.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*[\d.]+)?\s*\)$/); if (match) { const r = parseInt(match[1]), g = parseInt(match[2]), b = parseInt(match[3]); if (r <= 255 && g <= 255 && b <= 255) return { type: 'rgb', value: { r, g, b } }; } match = str.match(/^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*(?:,\s*[\d.]+)?\s*\)$/); if (match) { const h = parseInt(match[1]), s = parseInt(match[2]), l = parseInt(match[3]); if (h <= 360 && s <= 100 && l <= 100) return { type: 'hsl', value: { h, s, l } }; } const rgbFromHex = hexToRgb(str); if (rgbFromHex) return { type: 'rgb', value: rgbFromHex }; return null; }

    // --- Contrast Calculation ---
    function getLuminance(r, g, b) { const a = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722; }
    function getContrastRatio(rgb1, rgb2) { const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b); const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b); const brightest = Math.max(lum1, lum2); const darkest = Math.min(lum1, lum2); return (brightest + 0.05) / (darkest + 0.05); }
    function checkContrast() {
        try {
            const textLightnessValue = parseInt(getComputedStyle(root).getPropertyValue('--text-lightness').trim().replace('%',''));
            const textRgb = hslToRgb(parseInt(hueSlider.value), parseInt(saturationSlider.value), textLightnessValue);
            const bgRgb = hexToRgb(getComputedStyle(root).getPropertyValue('--contrast-bg-value').trim());

            if (!textRgb || !bgRgb) { throw new Error("Invalid RGB color(s) for contrast check"); }

            const ratio = getContrastRatio(textRgb, bgRgb);
            contrastRatioSpan.textContent = ratio.toFixed(2);
            let rating = 'Fail'; let ratingClass = 'contrast-rating-fail';
            if (ratio >= 7) { rating = 'AAA'; ratingClass = 'contrast-rating-aaa'; }
            else if (ratio >= 4.5) { rating = 'AA'; ratingClass = 'contrast-rating-aa'; }
            else if (ratio >= 3) { rating = 'AA Large'; ratingClass = 'contrast-rating-aa-large'; }
            contrastRatingSpan.textContent = rating; contrastRatingSpan.className = `contrast-rating ${ratingClass}`;
        } catch (error) {
            console.error("Contrast check failed:", error);
            contrastRatioSpan.textContent = 'N/A'; contrastRatingSpan.textContent = ''; contrastRatingSpan.className = 'contrast-rating';
        }
    }


    // --- Helper Functions ---

    function generateHtmlSnippet(componentType) {
        // Removed corner divs from all snippets
        switch (componentType) {
            case 'header': return `<header class="glowgen-header"><div class="glowgen-content"><h1>Website Title / Logo</h1><p>Optional tagline.</p></div></header>`;
            case 'nav': return `<nav class="glowgen-nav"><div class="glowgen-content"><ul><li><a href="#">Home</a></li><li><a href="#">About</a></li><li><a href="#">Services</a></li><li><a href="#">Contact</a></li></ul></div></nav>`;
            case 'section': return `<section class="glowgen-section"><div class="glowgen-content"><h2>Section Title</h2><p>Section content goes here. Lorem ipsum...</p></div></section>`;
            case 'article': return `<article class="glowgen-article"><div class="glowgen-content"><h2>Article Headline</h2><p><small>Metadata like date/author.</small></p><p>Article content goes here. Pellentesque...</p></div></article>`;
            case 'aside': return `<aside class="glowgen-aside"><div class="glowgen-content"><h3>Sidebar Title</h3><p>Aside content, links, etc.</p><ul><li><a href="#">Related Link</a></li></ul></div></aside>`;
            case 'footer': return `<footer class="glowgen-footer"><div class="glowgen-content"><p>© 2024 Your Site</p><nav><a href="#">Privacy</a> | <a href="#">Terms</a></nav></div></footer>`;
            case 'details': return `<details class="glowgen-details"><summary>Expandable Section Title</summary><div class="glowgen-content details-content"><p>Hidden content revealed on click.</p></div></details>`;
            case 'card': default: return `<div class="glowgen-card"><div class="glowgen-content"><h2>Card Title</h2><p>Card content. Lorem ipsum dolor sit amet...</p><button class="glowgen-button">Action</button></div></div>`;
        }
    }

    function generateCssSnippet(componentType, h, s, l, hex, font, borderStyle, blur, opacity) {
        const glowLightness = getComputedStyle(root).getPropertyValue('--glow-lightness').trim();
        const textLightness = getComputedStyle(root).getPropertyValue('--text-lightness').trim();
        const mainColor = `hsl(${h}, ${s}%, ${l}%)`;
        const glowColor = `hsl(${h}, ${s}%, ${glowLightness})`;
        const textColor = `hsl(${h}, ${s}%, ${textLightness})`;
        const borderRadius = borderStyle === 'rounded' ? '15px' : '0';
        const glassBgBase = getComputedStyle(root).getPropertyValue('--glass-bg-base-color').trim() || '0, 15, 30';
        const glassBgColor = `rgba(${glassBgBase}, ${opacity})`;
        const baseClass = `.glowgen-${componentType}`;

        // Define shared variables in :root for better reusability
        const rootVariables = `
:root {
  /* --- GlowGen Shared Variables --- */
  --gg-hue: ${h};
  --gg-saturation: ${s}%;
  --gg-lightness: ${l}%;
  --gg-glow-lightness: ${glowLightness};
  --gg-text-lightness: ${textLightness};
  --gg-font: ${font};
  --gg-glass-blur: ${blur}px;
  --gg-glass-opacity: ${opacity};
  --gg-glass-bg-base: ${glassBgBase};
  /* Derived */
  --gg-main-color: hsl(var(--gg-hue), var(--gg-saturation), var(--gg-lightness));
  --gg-glow-color: hsl(var(--gg-hue), var(--gg-saturation), var(--gg-glow-lightness));
  --gg-text-color: hsl(var(--gg-hue), var(--gg-saturation), var(--gg-text-lightness));
  --gg-glass-bg: rgba(var(--gg-glass-bg-base), var(--gg-glass-opacity));
  /* Alphas */
  --gg-glow-alpha-high: 0.8;
  --gg-glow-alpha-medium: 0.6;
  --gg-glow-alpha-low: 0.4;
  --gg-glow-alpha-inset: 0.5;
  --gg-text-glow-alpha: 0.7;
}
        `;

        const coreStyles = `
/* --- GlowGen Core Style (${componentType}) --- */
${baseClass} {
  /* Apply variables defined in :root */
  position: relative;
  padding: 40px 50px; /* Adjust as needed */
  font-family: var(--gg-font);
  border: 3px solid var(--gg-main-color);
  border-radius: ${borderRadius};
  color: var(--gg-text-color);
  background-color: var(--gg-glass-bg);
  backdrop-filter: blur(var(--gg-glass-blur));
  -webkit-backdrop-filter: blur(var(--gg-glass-blur));
  text-shadow: 0 0 5px hsla(var(--gg-hue), var(--gg-saturation), var(--gg-text-lightness), var(--gg-text-glow-alpha));
  box-shadow:
    0 0 10px hsla(var(--gg-hue), var(--gg-saturation), var(--gg-glow-lightness), var(--gg-glow-alpha-high)),
    0 0 25px hsla(var(--gg-hue), var(--gg-saturation), var(--gg-glow-lightness), var(--gg-glow-alpha-medium)),
    0 0 45px hsla(var(--gg-hue), var(--gg-saturation), var(--gg-glow-lightness), var(--gg-glow-alpha-low)),
    inset 0 0 15px hsla(var(--gg-hue), var(--gg-saturation), var(--gg-glow-lightness), var(--gg-glow-alpha-inset));
  /* Add transitions if desired */
  /* transition: all 0.2s ease; */
}
${baseClass} .glowgen-content { position: relative; z-index: 1; }
/* Basic hover glow */
${baseClass}:hover {
    box-shadow:
        0 0 calc(10px * 1.5) hsla(var(--gg-hue), var(--gg-saturation), var(--gg-glow-lightness), var(--gg-glow-alpha-high)),
        0 0 calc(25px * 1.5) hsla(var(--gg-hue), var(--gg-saturation), var(--gg-glow-lightness), var(--gg-glow-alpha-medium)),
        0 0 calc(45px * 1.5) hsla(var(--gg-hue), var(--gg-saturation), var(--gg-glow-lightness), var(--gg-glow-alpha-low)),
        inset 0 0 15px hsla(var(--gg-hue), var(--gg-saturation), var(--gg-glow-lightness), var(--gg-glow-alpha-inset));
}
/* NO CORNER STYLES */
        `;

        let innerStyles = ''; // Add specific inner styles based on componentType if needed
        // Add styles for headings, paragraphs, links, buttons within the specific component class
        innerStyles += `
/* --- Inner Element Styles (${componentType}) --- */
${baseClass} h1, ${baseClass} h2, ${baseClass} h3, ${baseClass} h4, ${baseClass} h5, ${baseClass} h6 {
  margin-top: 0; margin-bottom: 0.75em; font-weight: bold;
  color: var(--gg-text-color); /* Use variable */
  text-shadow: 0 0 7px hsla(var(--gg-hue), var(--gg-saturation), var(--gg-text-lightness), var(--gg-text-glow-alpha));
}
${baseClass} p { margin-bottom: 1em; line-height: 1.6; color: var(--gg-text-color); text-shadow: inherit; }
${baseClass} a { color: var(--gg-text-color); text-decoration: none; transition: color 0.2s ease, text-shadow 0.2s ease; text-shadow: inherit; }
${baseClass} a:hover, ${baseClass} a:focus { color: var(--gg-main-color); text-shadow: 0 0 8px hsla(var(--gg-hue), var(--gg-saturation), var(--gg-glow-lightness), 0.6); outline: none; }
${baseClass} button, ${baseClass} .glowgen-button { /* Style buttons */
  display: inline-block; padding: 10px 20px; font-family: inherit; font-weight: bold;
  border: 2px solid var(--gg-main-color); border-radius: 5px; cursor: pointer;
  background-color: hsla(var(--gg-hue), var(--gg-saturation), var(--gg-lightness), 0.2);
  color: var(--gg-text-color); text-shadow: inherit;
  transition: background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease;
}
${baseClass} button:hover, ${baseClass} .glowgen-button:hover,
${baseClass} button:focus, ${baseClass} .glowgen-button:focus {
  background-color: hsla(var(--gg-hue), var(--gg-saturation), var(--gg-lightness), 0.4);
  box-shadow: 0 0 10px hsla(var(--gg-hue), var(--gg-saturation), var(--gg-glow-lightness), 0.5);
  outline: none;
}
${baseClass} button:active, ${baseClass} .glowgen-button:active { transform: scale(0.96); }
/* Add more specific styles for nav links, footer links, details summary etc. */
${baseClass === '.glowgen-nav' ? `${baseClass} ul { list-style: none; padding: 0; margin: 0; display: flex; gap: 20px; flex-wrap: wrap; } ${baseClass} a { border-bottom: 2px solid transparent; } ${baseClass} a:hover, ${baseClass} a:focus { border-bottom-color: var(--gg-main-color); }` : ''}
${baseClass === '.glowgen-footer' ? `${baseClass} { padding: 25px 50px; } ${baseClass} p { text-align: center; opacity: 0.8; } ${baseClass} nav { text-align: center; } ${baseClass} nav a { opacity: 0.8; margin: 0 5px; } ${baseClass} nav a:hover, ${baseClass} nav a:focus { opacity: 1; }` : ''}
${baseClass === '.glowgen-details' ? `${baseClass} summary { cursor: pointer; margin-bottom: 0.5em; } ${baseClass} summary::marker, ${baseClass} summary::-webkit-details-marker { color: var(--gg-main-color); }` : ''}
`;

        const htmlSnippet = generateHtmlSnippet(componentType);
        return `
/* ----------------------------------------- */
/* --- GlowGen Snippet for: ${componentType} --- */
/* Generated HEX: ${hex}                   */
/* Font: ${font}                     */
/* Border: ${borderStyle}                    */
/* Glass: Blur ${blur}px, Opacity ${opacity}        */
/* ----------------------------------------- */

/* --- HTML Structure --- */
${htmlSnippet}


/* --- CSS Styles --- */

/* Add these variables to your :root or a common parent */
${rootVariables}

/* Component Core Styles */
${coreStyles}

/* Inner Element Styles (Examples) */
${innerStyles}
        `.trim();
    }

    function copyToClipboard(text, buttonElement) {
        const originalText = buttonElement.textContent;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                buttonElement.textContent = 'Copied!'; buttonElement.classList.add('copied');
                setTimeout(() => { buttonElement.textContent = originalText; buttonElement.classList.remove('copied'); }, 1500);
            }).catch(err => {
                console.error('Failed to copy: ', err); buttonElement.textContent = 'Error!'; buttonElement.classList.remove('copied');
                setTimeout(() => { buttonElement.textContent = originalText; }, 1500);
            });
        } else {
            try {
                const tempInput = document.createElement('textarea');
                tempInput.style.position = 'absolute'; tempInput.style.left = '-9999px';
                tempInput.value = text; document.body.appendChild(tempInput);
                tempInput.select(); tempInput.setSelectionRange(0, 99999);
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                buttonElement.textContent = 'Copied!'; buttonElement.classList.add('copied');
                setTimeout(() => { buttonElement.textContent = originalText; buttonElement.classList.remove('copied'); }, 1500);
            } catch (err) {
                 console.error('Fallback copy failed: ', err); buttonElement.textContent = 'Error!'; buttonElement.classList.remove('copied');
                  setTimeout(() => { buttonElement.textContent = originalText; }, 1500);
            }
        }
    }

    function applyBorderStyle(styleValue) {
        currentBorderStyle = styleValue;
        componentPreviews.forEach(preview => {
            preview.classList.remove('border-sharp', 'border-rounded');
            preview.classList.add(`border-${styleValue}`);
            preview.dataset.borderStyle = styleValue;
        });
    }

    function updateActiveThemeButton() {
         let activeTheme = null;
         const currentHue = parseInt(hueSlider.value);
         const currentSat = parseInt(saturationSlider.value);
         const currentLig = parseInt(lightnessSlider.value);
         for (const themeName in themes) {
             const theme = themes[themeName];
             if (theme.hue === currentHue && theme.saturation === currentSat && theme.lightness === currentLig &&
                 theme.font === currentFont && theme.border === currentBorderStyle) {
                 activeTheme = themeName;
                 break;
             }
         }
         themeButtons.forEach(button => {
             button.classList.toggle('active', button.dataset.theme === activeTheme);
         });
    }

    // --- Main Update Function ---
    function updateAppearance(source = 'unknown') {
        if (isUpdating && source !== 'init') return;
        isUpdating = true;

        // Read current values from controls
        const h = parseInt(hueSlider.value);
        const s = parseInt(saturationSlider.value);
        const l = parseInt(lightnessSlider.value);
        const r = parseInt(redSlider.value);
        const g = parseInt(greenSlider.value);
        const b = parseInt(blueSlider.value);
        const blur = parseFloat(glassBlurSlider.value);
        const opacityPercent = parseInt(glassOpacitySlider.value);
        const opacity = opacityPercent / 100;
        const pageBg = bgColorInput.value;
        const gridSize = gridSizeSlider.value;
        const gridAlphaPercent = gridOpacitySlider.value;
        const gridAlpha = gridAlphaPercent / 100;

        // --- Synchronize Color Inputs ---
        let currentRgb = {r,g,b};
        if (source === 'hsl' || source === 'direct_hsl' || source === 'theme' || source === 'random' || source === 'reset' || source === 'init') {
             currentRgb = hslToRgb(h, s, l);
             if (source !== 'rgb') { redSlider.value = currentRgb.r; greenSlider.value = currentRgb.g; blueSlider.value = currentRgb.b; }
             redValueSpan.textContent = currentRgb.r; greenValueSpan.textContent = currentRgb.g; blueValueSpan.textContent = currentRgb.b;
        } else if (source === 'rgb' || source === 'direct_rgb') {
            const hsl = rgbToHsl(r, g, b);
            if (source !== 'hsl') { hueSlider.value = hsl.h; saturationSlider.value = hsl.s; lightnessSlider.value = hsl.l; }
            hueValueSpan.textContent = hsl.h; saturationValueSpan.textContent = hsl.s; lightnessValueSpan.textContent = hsl.l;
        }
        const hexColor = rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b);
        hexInput.value = hexColor;
        if (source !== 'direct_hsl' && source !== 'direct_rgb') {
            colorStringInput.value = hexColor; inputErrorSpan.textContent = ''; colorStringInput.setCustomValidity('');
        }

        // --- Update CSS Variables (Global & Component) ---
        root.style.setProperty('--hue', h);
        root.style.setProperty('--saturation', `${s}%`);
        root.style.setProperty('--lightness', `${l}%`);
        let glowLightnessVal = Math.min(100, l + 10);
        root.style.setProperty('--glow-lightness', `${glowLightnessVal}%`);
        let textLightnessVal = Math.min(100, Math.max(40, l + 20));
        root.style.setProperty('--text-lightness', `${textLightnessVal}%`);
        root.style.setProperty('--glass-blur', `${blur}px`);
        root.style.setProperty('--glass-bg-opacity', opacity);
        root.style.setProperty('--page-bg-color', pageBg);
        root.style.setProperty('--grid-size', `${gridSize}px`);
        root.style.setProperty('--grid-alpha', gridAlpha);
        root.style.setProperty('--contrast-bg-value', pageBg);

        // --- Update Value Displays ---
        glassBlurValueSpan.textContent = blur.toFixed(1);
        glassOpacityValueSpan.textContent = opacityPercent;
        gridSizeValueSpan.textContent = gridSize;
        gridOpacityValueSpan.textContent = gridAlpha.toFixed(2);

        // --- Update Snippet & Contrast ---
        const cssSnippet = generateCssSnippet(currentComponentType, h, s, l, hexColor, currentFont, currentBorderStyle, blur, opacity);
        cssSnippetTextArea.value = cssSnippet;
        checkContrast();

        // --- Update Active Theme ---
        updateActiveThemeButton();

        isUpdating = false;
    }


    // --- Event Handlers ---

    // Component Selector
    componentSelectorRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            if (event.target.checked) {
                currentComponentType = event.target.value;
                componentPreviews.forEach(preview => preview.hidden = true);
                const targetPreview = document.getElementById(`preview-${currentComponentType}`);
                if (targetPreview) {
                    targetPreview.hidden = false;
                    applyBorderStyle(currentBorderStyle);
                }
                updateAppearance('component_change');
            }
        });
    });

    // Page Background Controls
    bgColorInput.addEventListener('input', () => updateAppearance('page_bg'));
    gridSizeSlider.addEventListener('input', () => updateAppearance('page_grid'));
    gridOpacitySlider.addEventListener('input', () => updateAppearance('page_grid'));

    // HSL Sliders
    hueSlider.addEventListener('input', () => updateAppearance('hsl'));
    saturationSlider.addEventListener('input', () => updateAppearance('hsl'));
    lightnessSlider.addEventListener('input', () => updateAppearance('hsl'));

    // RGB Sliders
    redSlider.addEventListener('input', () => updateAppearance('rgb'));
    greenSlider.addEventListener('input', () => updateAppearance('rgb'));
    blueSlider.addEventListener('input', () => updateAppearance('rgb'));

    // Glass Sliders
    glassBlurSlider.addEventListener('input', () => updateAppearance('glass'));
    glassOpacitySlider.addEventListener('input', () => updateAppearance('glass'));

    // Direct Text Input
    colorStringInput.addEventListener('change', () => {
        const inputStr = colorStringInput.value; const parsed = parseCssColor(inputStr);
        let source = 'direct_unknown';
        if (parsed) {
            inputErrorSpan.textContent = ''; colorStringInput.setCustomValidity('');
            if (parsed.type === 'hsl') { hueSlider.value = parsed.value.h; saturationSlider.value = parsed.value.s; lightnessSlider.value = parsed.value.l; source = 'direct_hsl'; }
            else if (parsed.type === 'rgb') { redSlider.value = parsed.value.r; greenSlider.value = parsed.value.g; blueSlider.value = parsed.value.b; source = 'direct_rgb'; }
             updateAppearance(source);
        } else { inputErrorSpan.textContent = 'Invalid Format'; colorStringInput.setCustomValidity('Invalid color format'); }
    });

    // Utility Buttons
    randomColorButton.addEventListener('click', () => {
        const h = Math.floor(Math.random() * 361); const s = Math.floor(Math.random() * 71) + 30; const l = Math.floor(Math.random() * 61) + 20;
        hueSlider.value = h; saturationSlider.value = s; lightnessSlider.value = l;
        updateAppearance('random');
    });

    resetButton.addEventListener('click', () => {
        fontStyleRadios.forEach(radio => radio.checked = radio.value === defaultFont);
        currentFont = defaultFont; root.style.setProperty('--main-font', currentFont);
        bgColorInput.value = defaultPageBgColor;
        gridSizeSlider.value = parseFloat(defaultGridSize);
        gridOpacitySlider.value = defaultGridAlpha * 100;
        borderStyleRadios.forEach(radio => radio.checked = radio.value === defaultBorder);
        applyBorderStyle(defaultBorder);
        glassBlurSlider.value = parseFloat(defaultGlassBlur);
        glassOpacitySlider.value = defaultGlassOpacity * 100;
        hueSlider.value = defaultHue; saturationSlider.value = defaultSaturation; lightnessSlider.value = defaultLightness;
        updateAppearance('reset');
    });

    // Copy Buttons
    copyHexButton.addEventListener('click', () => copyToClipboard(hexInput.value, copyHexButton));
    copySnippetButton.addEventListener('click', () => copyToClipboard(cssSnippetTextArea.value, copySnippetButton));

    // Theme Buttons
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const themeName = button.dataset.theme; const theme = themes[themeName];
            if (theme) {
                fontStyleRadios.forEach(radio => radio.checked = radio.value === theme.font);
                borderStyleRadios.forEach(radio => radio.checked = radio.value === theme.border);
                currentFont = theme.font; root.style.setProperty('--main-font', currentFont);
                applyBorderStyle(theme.border);
                hueSlider.value = theme.hue; saturationSlider.value = theme.saturation; lightnessSlider.value = theme.lightness;
                if (theme.blur) glassBlurSlider.value = parseFloat(theme.blur); else glassBlurSlider.value = parseFloat(defaultGlassBlur); // Reset if theme doesn't specify
                if (theme.opacity) glassOpacitySlider.value = theme.opacity * 100; else glassOpacitySlider.value = defaultGlassOpacity * 100; // Reset if theme doesn't specify
                updateAppearance('theme');
            }
        });
    });

    // Border Style Radios
    borderStyleRadios.forEach(radio => {
        radio.addEventListener('change', (event) => { if (event.target.checked) { applyBorderStyle(event.target.value); updateAppearance('border'); } });
    });

    // Font Style Radios
    fontStyleRadios.forEach(radio => {
        radio.addEventListener('change', (event) => { if (event.target.checked) { currentFont = event.target.value; root.style.setProperty('--main-font', currentFont); updateAppearance('font'); } });
    });

    // --- Initial Setup ---
    const initialComponentType = document.querySelector('input[name="component-type"]:checked')?.value || 'card';
    currentComponentType = initialComponentType;
    componentPreviews.forEach(preview => { preview.hidden = (preview.dataset.componentType !== currentComponentType); });

    // Apply initial styles globally & set control values
    applyBorderStyle(currentBorderStyle);
    root.style.setProperty('--main-font', currentFont);
    bgColorInput.value = defaultPageBgColor;
    gridSizeSlider.value = parseFloat(defaultGridSize);
    gridOpacitySlider.value = defaultGridAlpha * 100;
    glassBlurSlider.value = parseFloat(defaultGlassBlur);
    glassOpacitySlider.value = defaultGlassOpacity * 100;
    hueSlider.value = defaultHue;
    saturationSlider.value = defaultSaturation;
    lightnessSlider.value = defaultLightness;

    updateAppearance('init'); // Trigger initial full update

});