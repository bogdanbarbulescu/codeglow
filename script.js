document.addEventListener('DOMContentLoaded', () => {
    // --- Get Elements ---
    const root = document.documentElement;
    const bodyElement = document.body;

    // Layout Panes
    const previewPaneContainer = document.querySelector('.preview-pane-container');
    const controlsPane = document.querySelector('.controls-pane');

    // Preview Area & Components
    const previewArea = document.getElementById('component-preview-area');
    const componentPreviews = document.querySelectorAll('.component-preview'); // All preview elements

    // Thumbnail Selector
    const thumbnailContainer = document.getElementById('thumbnail-selector');
    const thumbnailButtons = document.querySelectorAll('.thumbnail-button');

    // Style Mode Selector
    const styleModeRadios = document.querySelectorAll('input[name="style-mode"]');
    const glassControlsFieldset = document.getElementById('glass-controls'); // Wrapper div now
    const shadowControlsFieldset = document.getElementById('shadow-controls'); // Wrapper div now

    // Page Background Controls
    const bgColorInput = document.getElementById('bg-color');
    const gridSizeSlider = document.getElementById('grid-size');
    const gridOpacitySlider = document.getElementById('grid-opacity');
    const gridSizeValueSpan = document.getElementById('grid-size-value');
    const gridOpacityValueSpan = document.getElementById('grid-opacity-value');

    // Accent Color Controls - HSL
    const hueSlider = document.getElementById('hue');
    const saturationSlider = document.getElementById('saturation');
    const lightnessSlider = document.getElementById('lightness');
    const hueValueSpan = document.getElementById('hue-value');
    const saturationValueSpan = document.getElementById('saturation-value');
    const lightnessValueSpan = document.getElementById('lightness-value');

    // Accent Color Controls - RGB
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

    // Standard Shadow Controls
    const shadowOffsetXSlider = document.getElementById('shadow-offset-x');
    const shadowOffsetYSlider = document.getElementById('shadow-offset-y');
    const shadowBlurSlider = document.getElementById('shadow-blur');
    const shadowSpreadSlider = document.getElementById('shadow-spread');
    const shadowColorInput = document.getElementById('shadow-color');
    const shadowOpacitySlider = document.getElementById('shadow-opacity');
    const shadowOffsetXValueSpan = document.getElementById('shadow-offset-x-value');
    const shadowOffsetYValueSpan = document.getElementById('shadow-offset-y-value');
    const shadowBlurValueSpan = document.getElementById('shadow-blur-value');
    const shadowSpreadValueSpan = document.getElementById('shadow-spread-value');
    const shadowOpacityValueSpan = document.getElementById('shadow-opacity-value');

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
    let currentStyleMode = 'glow';
    let currentComponentType = 'card'; // Default selected component
    let currentBorderStyle = 'sharp';
    let currentFont = "'Source Code Pro', monospace";
    let isUpdating = false;

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
    const defaultShadowOffsetX = getComputedStyle(root).getPropertyValue('--default-shadow-offset-x').trim() || '0px';
    const defaultShadowOffsetY = getComputedStyle(root).getPropertyValue('--default-shadow-offset-y').trim() || '2px';
    const defaultShadowBlurRadius = getComputedStyle(root).getPropertyValue('--default-shadow-blur-radius').trim() || '4px';
    const defaultShadowSpreadRadius = getComputedStyle(root).getPropertyValue('--default-shadow-spread-radius').trim() || '0px';
    const defaultShadowColorValue = getComputedStyle(root).getPropertyValue('--default-shadow-color-value').trim() || 'rgba(0, 0, 0, 0.25)';

    // --- Theme Definitions ---
    const themes = {
        'default-cyan': { mode: 'glow', hue: 180, saturation: 100, lightness: 50, font: "'Source Code Pro', monospace", border: 'sharp' },
        'cyberpunk-pink': { mode: 'glow', hue: 320, saturation: 90, lightness: 60, font: "'Orbitron', sans-serif", border: 'sharp' },
        'matrix-green': { mode: 'glow', hue: 130, saturation: 85, lightness: 55, font: "'Share Tech Mono', monospace", border: 'sharp' },
        'warning-red': { mode: 'glow', hue: 0, saturation: 100, lightness: 50, font: "'Source Code Pro', monospace", border: 'rounded' },
        'arcade-orange': { mode: 'glow', hue: 35, saturation: 100, lightness: 55, font: "'Press Start 2P', cursive", border: 'rounded' }
    };

    // --- Color Conversion Functions ---
    function hslToRgb(h, s, l) { h = parseInt(h); s = parseInt(s); l = parseInt(l); s /= 100; l /= 100; let c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2, r = 0, g = 0, b = 0; if (0 <= h && h < 60) { r = c; g = x; b = 0; } else if (60 <= h && h < 120) { r = x; g = c; b = 0; } else if (120 <= h && h < 180) { r = 0; g = c; b = x; } else if (180 <= h && h < 240) { r = 0; g = x; b = c; } else if (240 <= h && h < 300) { r = x; g = 0; b = c; } else if (300 <= h && h < 360) { r = c; g = 0; b = x; } r = Math.round((r + m) * 255); g = Math.round((g + m) * 255); b = Math.round((b + m) * 255); return { r, g, b }; }
    function rgbToHsl(r, g, b) { r = parseInt(r); g = parseInt(g); b = parseInt(b); r /= 255; g /= 255; b /= 255; let max = Math.max(r, g, b), min = Math.min(r, g, b); let h = 0, s, l = (max + min) / 2; if (max === min) { h = s = 0; } else { let d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; case b: h = (r - g) / d + 4; break; } h /= 6; } return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }; }
    function rgbToHex(r, g, b) { r = parseInt(r); g = parseInt(g); b = parseInt(b); const toHex = val => { const hex = Number(val).toString(16); return hex.length === 1 ? '0' + hex : hex; }; return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase(); }
    function hexToRgb(hex) { hex = hex.trim(); let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); if (!result) { result = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex); if (result) { result[1] += result[1]; result[2] += result[2]; result[3] += result[3]; } else { return null; } } return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null; }
    function parseCssColor(str) { str = str.trim().toLowerCase(); let match; match = str.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*[\d.]+)?\s*\)$/); if (match) { const r = parseInt(match[1]), g = parseInt(match[2]), b = parseInt(match[3]); if (r <= 255 && g <= 255 && b <= 255) return { type: 'rgb', value: { r, g, b } }; } match = str.match(/^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*(?:,\s*[\d.]+)?\s*\)$/); if (match) { const h = parseInt(match[1]), s = parseInt(match[2]), l = parseInt(match[3]); if (h <= 360 && s <= 100 && l <= 100) return { type: 'hsl', value: { h, s, l } }; } const rgbFromHex = hexToRgb(str); if (rgbFromHex) return { type: 'rgb', value: rgbFromHex }; return null; }
    function hexOpacityToRgba(hex, opacityPercent) { const rgb = hexToRgb(hex); if (!rgb) return 'rgba(0,0,0,0.1)'; const opacity = parseInt(opacityPercent) / 100; return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity.toFixed(2)})`; }

    // --- Contrast Calculation ---
    function getLuminance(r, g, b) { const a = [r, g, b].map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722; }
    function getContrastRatio(rgb1, rgb2) { const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b); const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b); const brightest = Math.max(lum1, lum2); const darkest = Math.min(lum1, lum2); return (brightest + 0.05) / (darkest + 0.05); }
    function checkContrast(componentTextColorRgb, componentBgColorRgb) {
        try {
            if (!componentTextColorRgb || !componentBgColorRgb) { throw new Error("Invalid RGB color(s) for contrast check"); }
            const ratio = getContrastRatio(componentTextColorRgb, componentBgColorRgb);
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
        const previewElement = document.getElementById(`preview-${componentType}`);
        if (!previewElement) return `<!-- HTML for ${componentType} not found -->`;
        const clone = previewElement.cloneNode(true);
        clone.className = `glowgen-${componentType}`; // Base class
        clone.removeAttribute('id');
        clone.removeAttribute('data-component-type');
        clone.removeAttribute('data-border-style');
        clone.removeAttribute('hidden');
        clone.classList.remove('component-preview', 'style-mode-glow', 'style-mode-solid-dark', 'style-mode-solid-light', 'border-sharp', 'border-rounded', 'border-none');
        const innerContent = clone.querySelector('.component-content');
        if (innerContent) { innerContent.classList.remove('component-content'); innerContent.classList.add('glowgen-content'); }
        const button = clone.querySelector('.card-button');
        if (button) { button.classList.remove('card-button'); button.classList.add('glowgen-button'); }
        const rawHtml = clone.outerHTML;
        return rawHtml.split('\n').map(line => '  ' + line.trim()).join('\n').trim();
    }

    function generateCssSnippet(mode, componentType, h, s, l, hex, font, borderStyle, blur, opacity, shadow) {
        const accentColor = `hsl(${h}, ${s}%, ${l}%)`;
        const borderRadius = borderStyle === 'rounded' ? '15px' : '0';
        const borderCss = borderStyle === 'none' ? 'border: none;' : `border: 3px solid var(--gg-border-color);`;
        const baseClass = `.glowgen-${componentType}`; // Use specific class

        // --- Root Variables ---
        const rootVariables = `
:root {
  /* --- GlowGen Global Settings --- */
  --gg-font: ${font};
  /* --gg-page-bg: ${getComputedStyle(root).getPropertyValue('--page-bg-color').trim()}; */ /* Optional */

  /* --- Component Accent Color --- */
  --gg-accent-hue: ${h};
  --gg-accent-saturation: ${s}%;
  --gg-accent-lightness: ${l}%;
  --gg-accent-color: ${accentColor};

  /* --- Mode-Specific Variables --- */
  ${mode === 'glow' ? `
  /* Glow Mode */
  --gg-glow-lightness: ${Math.min(100, l + 10)}%;
  --gg-text-lightness: ${Math.min(100, Math.max(60, l + 15))}%;
  --gg-glass-blur: ${blur}px;
  --gg-glass-opacity: ${opacity};
  --gg-glass-bg-base: ${getComputedStyle(root).getPropertyValue('--glass-bg-base-color').trim() || '0, 15, 30'};
  --gg-border-color: var(--gg-accent-color);
  /* Derived Glow */
  --gg-glow-color: hsl(var(--gg-accent-hue), var(--gg-accent-saturation), var(--gg-glow-lightness));
  --gg-text-color: hsl(var(--gg-accent-hue), var(--gg-accent-saturation), var(--gg-text-lightness));
  --gg-glass-bg: rgba(var(--gg-glass-bg-base), var(--gg-glass-opacity));
  /* Alphas */
  --gg-glow-alpha-high: 0.8; --gg-glow-alpha-medium: 0.6; --gg-glow-alpha-low: 0.4;
  --gg-glow-alpha-inset: 0.5; --gg-text-glow-alpha: 0.7;
  ` : ''}
  ${mode === 'solid-dark' ? `
  /* Solid Dark Mode */
  --gg-bg-color: hsl(${h}, 10%, 15%);
  --gg-text-color: hsl(${h}, 15%, 85%);
  --gg-border-color: hsl(${h}, ${s}%, ${Math.max(10, l * 0.8)}%);
  --gg-shadow-color-value: ${shadow.color};
  --gg-box-shadow: ${shadow.offsetX} ${shadow.offsetY} ${shadow.blur} ${shadow.spread} var(--gg-shadow-color-value);
  ` : ''}
   ${mode === 'solid-light' ? `
  /* Solid Light Mode */
  --gg-bg-color: hsl(${h}, 20%, 95%);
  --gg-text-color: hsl(${h}, 15%, 15%);
  --gg-border-color: hsl(${h}, ${s}%, ${Math.min(90, l * 1.2)}%);
  --gg-shadow-color-value: ${shadow.color};
  --gg-box-shadow: ${shadow.offsetX} ${shadow.offsetY} ${shadow.blur} ${shadow.spread} var(--gg-shadow-color-value);
  ` : ''}
}
        `;

        // --- Component Base Styles ---
        const coreStyles = `
/* --- GlowGen Component Style (${componentType}) --- */
${baseClass} {
  position: relative;
  padding: 40px 50px; /* Adjust as needed */
  font-family: var(--gg-font);
  ${borderCss}
  border-radius: ${borderRadius};
  color: var(--gg-text-color);
  background-color: ${mode === 'glow' ? 'var(--gg-glass-bg)' : 'var(--gg-bg-color)'};
  ${mode === 'glow' ? `backdrop-filter: blur(var(--gg-glass-blur)); -webkit-backdrop-filter: blur(var(--gg-glass-blur));` : ''}
  text-shadow: ${mode === 'glow' ? '0 0 5px hsla(var(--gg-accent-hue), var(--gg-accent-saturation), var(--gg-text-lightness), var(--gg-text-glow-alpha))' : 'none'};
  box-shadow: ${mode === 'glow' ? `
    0 0 10px hsla(var(--gg-accent-hue), var(--gg-accent-saturation), var(--gg-glow-lightness), var(--gg-glow-alpha-high)),
    0 0 25px hsla(var(--gg-accent-hue), var(--gg-accent-saturation), var(--gg-glow-lightness), var(--gg-glow-alpha-medium)),
    0 0 45px hsla(var(--gg-accent-hue), var(--gg-accent-saturation), var(--gg-glow-lightness), var(--gg-glow-alpha-low)),
    inset 0 0 15px hsla(var(--gg-accent-hue), var(--gg-accent-saturation), var(--gg-glow-lightness), var(--gg-glow-alpha-inset))`
    : 'var(--gg-box-shadow)'};
  /* Add transitions if desired */
  /* transition: all 0.2s ease; */
}
${baseClass} .glowgen-content { position: relative; z-index: 1; }

/* --- Interaction Styles --- */
/* Glow Hover */
${mode === 'glow' ? `
${baseClass}:hover {
    box-shadow:
        0 0 calc(10px * 1.5) hsla(var(--gg-accent-hue), var(--gg-accent-saturation), var(--gg-glow-lightness), var(--gg-glow-alpha-high)),
        0 0 calc(25px * 1.5) hsla(var(--gg-accent-hue), var(--gg-accent-saturation), var(--gg-glow-lightness), var(--gg-glow-alpha-medium)),
        0 0 calc(45px * 1.5) hsla(var(--gg-accent-hue), var(--gg-accent-saturation), var(--gg-glow-lightness), var(--gg-glow-alpha-low)),
        inset 0 0 15px hsla(var(--gg-accent-hue), var(--gg-accent-saturation), var(--gg-glow-lightness), var(--gg-glow-alpha-inset));
}
${baseClass} a:hover, ${baseClass} a:focus { color: var(--gg-accent-color); text-shadow: 0 0 8px hsla(var(--gg-accent-hue), var(--gg-accent-saturation), var(--gg-glow-lightness), 0.6); outline: none; }
${baseClass} button:hover, ${baseClass} .glowgen-button:hover,
${baseClass} button:focus, ${baseClass} .glowgen-button:focus { background-color: hsla(var(--gg-accent-hue), var(--gg-accent-saturation), var(--gg-accent-lightness), 0.4); border-color: var(--gg-glow-color); color: var(--gg-glow-color); box-shadow: 0 0 10px hsla(var(--gg-accent-hue), var(--gg-accent-saturation), var(--gg-glow-lightness), 0.5); outline: none; }
` : ''}

/* Solid Dark Hover */
${mode === 'solid-dark' ? `
${baseClass}:hover { background-color: hsl(${h}, 10%, 20%); }
${baseClass} a:hover, ${baseClass} a:focus { color: var(--gg-accent-color); text-decoration: underline; outline: none; }
${baseClass} button:hover, ${baseClass} .glowgen-button:hover,
${baseClass} button:focus, ${baseClass} .glowgen-button:focus { background-color: hsl(var(--gg-accent-hue), var(--gg-accent-saturation), ${Math.min(95, l * 1.1)}%); box-shadow: var(--gg-box-shadow); outline: none; }
` : ''}

/* Solid Light Hover */
${mode === 'solid-light' ? `
${baseClass}:hover { background-color: hsl(${h}, 20%, 90%); }
${baseClass} a:hover, ${baseClass} a:focus { color: var(--gg-accent-color); text-decoration: underline; outline: none; }
${baseClass} button:hover, ${baseClass} .glowgen-button:hover,
${baseClass} button:focus, ${baseClass} .glowgen-button:focus { background-color: hsl(var(--gg-accent-hue), var(--gg-accent-saturation), ${Math.max(5, l * 0.9)}%); box-shadow: var(--gg-box-shadow); outline: none; }
` : ''}

/* Active Button State (All Modes) */
${baseClass} button:active, ${baseClass} .glowgen-button:active { transform: scale(0.96); }

/* --- Basic Inner Element Styles --- */
${baseClass} h1, ${baseClass} h2, ${baseClass} h3 { margin-top: 0; margin-bottom: 0.75em; font-weight: bold; }
${baseClass} p { margin-bottom: 1em; line-height: 1.6; }
${baseClass} nav ul { list-style: none; padding: 0; margin: 0; display: flex; gap: 20px; flex-wrap: wrap; }
${baseClass} nav a { padding: 5px 0; }
/* Add more specific inner styles as needed */
        `;

        const htmlSnippet = generateHtmlSnippet(componentType);
        return `
/* --- GlowGen Snippet --- */
/* Mode: ${mode}, Component: ${componentType} */
/* Accent: ${hex} */

/* --- HTML Structure (Example for ${componentType}) --- */
${htmlSnippet}


/* --- CSS Styles --- */

/* Add these variables to your :root */
${rootVariables}

/* Component Styles (use class on your element) */
${coreStyles}
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
            preview.classList.remove('border-sharp', 'border-rounded', 'border-none');
            if (styleValue !== 'none') {
                preview.classList.add(`border-${styleValue}`);
            }
            preview.dataset.borderStyle = styleValue;
        });
    }

    function applyStyleModeClass(modeValue) {
         componentPreviews.forEach(preview => {
            preview.classList.remove('style-mode-glow', 'style-mode-solid-dark', 'style-mode-solid-light');
            preview.classList.add(`style-mode-${modeValue}`);
        });
    }

    function updateActiveThemeButton() {
         let activeTheme = null;
         const currentHue = parseInt(hueSlider.value);
         const currentSat = parseInt(saturationSlider.value);
         const currentLig = parseInt(lightnessSlider.value);
         for (const themeName in themes) {
             const theme = themes[themeName];
             // Check if current settings match theme settings (including mode)
             if (theme.mode === currentStyleMode &&
                 theme.hue === currentHue && theme.saturation === currentSat && theme.lightness === currentLig &&
                 theme.font === currentFont && theme.border === currentBorderStyle) {
                 activeTheme = themeName;
                 break;
             }
         }
         themeButtons.forEach(button => {
             button.classList.toggle('active', button.dataset.theme === activeTheme);
         });
    }

    // Function to show/hide controls based on mode
    function updateControlVisibility(mode) {
        if (mode === 'glow') {
            glassControlsFieldset.hidden = false;
            shadowControlsFieldset.hidden = true;
        } else if (mode === 'solid-dark' || mode === 'solid-light') {
            glassControlsFieldset.hidden = true;
            shadowControlsFieldset.hidden = false;
        } else {
            glassControlsFieldset.hidden = true;
            shadowControlsFieldset.hidden = true;
        }
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
        const shadowOffsetX = shadowOffsetXSlider.value + 'px';
        const shadowOffsetY = shadowOffsetYSlider.value + 'px';
        const shadowBlur = shadowBlurSlider.value + 'px';
        const shadowSpread = shadowSpreadSlider.value + 'px';
        const shadowColorHex = shadowColorInput.value;
        const shadowOpacity = shadowOpacitySlider.value;
        const shadowColorRgba = hexOpacityToRgba(shadowColorHex, shadowOpacity);
        const shadowObject = { offsetX: shadowOffsetX, offsetY: shadowOffsetY, blur: shadowBlur, spread: shadowSpread, color: shadowColorRgba };

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

        // --- Update CSS Variables (Global & Component Accent) ---
        root.style.setProperty('--accent-hue', h);
        root.style.setProperty('--accent-saturation', `${s}%`);
        root.style.setProperty('--accent-lightness', `${l}%`);
        root.style.setProperty('--glass-blur', `${blur}px`);
        root.style.setProperty('--glass-bg-opacity', opacity);
        root.style.setProperty('--shadow-offset-x', shadowOffsetX);
        root.style.setProperty('--shadow-offset-y', shadowOffsetY);
        root.style.setProperty('--shadow-blur-radius', shadowBlur);
        root.style.setProperty('--shadow-spread-radius', shadowSpread);
        root.style.setProperty('--shadow-color-value', shadowColorRgba);
        root.style.setProperty('--page-bg-color', pageBg);
        root.style.setProperty('--grid-size', `${gridSize}px`);
        root.style.setProperty('--grid-alpha', gridAlpha);

        // --- Calculate Component BG/Text for Contrast Check ---
        let componentBgRgb;
        let componentTextColorRgb;
        if (currentStyleMode === 'glow') {
            const baseRgbValues = (getComputedStyle(root).getPropertyValue('--glass-bg-base-color').trim() || '0, 15, 30').split(',').map(Number);
            componentBgRgb = { r: baseRgbValues[0], g: baseRgbValues[1], b: baseRgbValues[2] };
            const textLightness = Math.min(100, Math.max(60, l + 15));
            componentTextColorRgb = hslToRgb(h, s, textLightness);
        } else if (currentStyleMode === 'solid-dark') {
            componentBgRgb = hslToRgb(h, 10, 15);
            componentTextColorRgb = hslToRgb(h, 15, 85);
        } else if (currentStyleMode === 'solid-light') {
            componentBgRgb = hslToRgb(h, 20, 95);
            componentTextColorRgb = hslToRgb(h, 15, 15);
        } else {
            componentBgRgb = hexToRgb(pageBg); // Fallback
            componentTextColorRgb = hslToRgb(h, s, Math.min(100, Math.max(60, l + 15)));
        }
        // Update contrast checker background reference variable
        root.style.setProperty('--contrast-bg-value', rgbToHex(componentBgRgb.r, componentBgRgb.g, componentBgRgb.b));

        // --- Update Value Displays ---
        glassBlurValueSpan.textContent = blur.toFixed(1);
        glassOpacityValueSpan.textContent = opacityPercent;
        gridSizeValueSpan.textContent = gridSize;
        gridOpacityValueSpan.textContent = gridAlpha.toFixed(2);
        shadowOffsetXValueSpan.textContent = shadowOffsetXSlider.value;
        shadowOffsetYValueSpan.textContent = shadowOffsetYSlider.value;
        shadowBlurValueSpan.textContent = shadowBlurSlider.value;
        shadowSpreadValueSpan.textContent = shadowSpreadSlider.value;
        shadowOpacityValueSpan.textContent = shadowOpacity;

        // --- Update Snippet & Contrast ---
        checkContrast(componentTextColorRgb, componentBgRgb);
        const cssSnippet = generateCssSnippet(currentStyleMode, currentComponentType, h, s, l, hexColor, currentFont, currentBorderStyle, blur, opacity, shadowObject);
        cssSnippetTextArea.value = cssSnippet;

        // --- Update Active Theme ---
        updateActiveThemeButton();

        isUpdating = false;
    }


    // --- Event Handlers ---

    // Style Mode Selector
    styleModeRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            if (event.target.checked) {
                currentStyleMode = event.target.value;
                updateControlVisibility(currentStyleMode);
                applyStyleModeClass(currentStyleMode);
                updateAppearance('mode_change');
            }
        });
    });

    // Thumbnail Selector (Component Type)
    thumbnailButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentComponentType = button.dataset.component;

            // Update active button state
            thumbnailButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Show the correct preview
            componentPreviews.forEach(preview => {
                preview.hidden = (preview.dataset.componentType !== currentComponentType);
            });

            // Update snippet for the new component
            updateAppearance('component_change');
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

    // Shadow Sliders/Input
    shadowOffsetXSlider.addEventListener('input', () => updateAppearance('shadow'));
    shadowOffsetYSlider.addEventListener('input', () => updateAppearance('shadow'));
    shadowBlurSlider.addEventListener('input', () => updateAppearance('shadow'));
    shadowSpreadSlider.addEventListener('input', () => updateAppearance('shadow'));
    shadowColorInput.addEventListener('input', () => updateAppearance('shadow'));
    shadowOpacitySlider.addEventListener('input', () => updateAppearance('shadow'));

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
        // Reset global styles
        fontStyleRadios.forEach(radio => radio.checked = radio.value === defaultFont);
        currentFont = defaultFont; root.style.setProperty('--main-font', currentFont);
        bgColorInput.value = defaultPageBgColor;
        gridSizeSlider.value = parseFloat(defaultGridSize);
        gridOpacitySlider.value = defaultGridAlpha * 100;
        // Reset component styles
        styleModeRadios.forEach(radio => radio.checked = radio.value === 'glow');
        currentStyleMode = 'glow';
        updateControlVisibility(currentStyleMode);
        applyStyleModeClass(currentStyleMode);
        borderStyleRadios.forEach(radio => radio.checked = radio.value === defaultBorder);
        applyBorderStyle(defaultBorder);
        glassBlurSlider.value = parseFloat(defaultGlassBlur);
        glassOpacitySlider.value = defaultGlassOpacity * 100;
        shadowOffsetXSlider.value = parseFloat(defaultShadowOffsetX);
        shadowOffsetYSlider.value = parseFloat(defaultShadowOffsetY);
        shadowBlurSlider.value = parseFloat(defaultShadowBlurRadius);
        shadowSpreadSlider.value = parseFloat(defaultShadowSpreadRadius);
        try { const rgbaMatch = defaultShadowColorValue.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/); if (rgbaMatch) { shadowColorInput.value = rgbToHex(parseInt(rgbaMatch[1]), parseInt(rgbaMatch[2]), parseInt(rgbaMatch[3])); shadowOpacitySlider.value = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) * 100 : 100; } else { shadowColorInput.value = '#000000'; shadowOpacitySlider.value = 25; } } catch { shadowColorInput.value = '#000000'; shadowOpacitySlider.value = 25; }
        hueSlider.value = defaultHue; saturationSlider.value = defaultSaturation; lightnessSlider.value = defaultLightness;
        // Reset selected component to default
        currentComponentType = 'card';
        thumbnailButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.component === 'card'));
        componentPreviews.forEach(preview => { preview.hidden = (preview.dataset.componentType !== 'card'); });
        // Trigger full update
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
                styleModeRadios.forEach(radio => radio.checked = radio.value === theme.mode);
                currentStyleMode = theme.mode;
                updateControlVisibility(currentStyleMode);
                applyStyleModeClass(currentStyleMode);
                fontStyleRadios.forEach(radio => radio.checked = radio.value === theme.font);
                currentFont = theme.font; root.style.setProperty('--main-font', currentFont);
                borderStyleRadios.forEach(radio => radio.checked = radio.value === theme.border);
                applyBorderStyle(theme.border);
                hueSlider.value = theme.hue; saturationSlider.value = theme.saturation; lightnessSlider.value = theme.lightness;
                glassBlurSlider.value = parseFloat(theme.blur || defaultGlassBlur);
                glassOpacitySlider.value = (theme.opacity !== undefined ? theme.opacity : defaultGlassOpacity) * 100;
                shadowOffsetXSlider.value = parseFloat(theme.shadowOffsetX || defaultShadowOffsetX);
                shadowOffsetYSlider.value = parseFloat(theme.shadowOffsetY || defaultShadowOffsetY);
                shadowBlurSlider.value = parseFloat(theme.shadowBlur || defaultShadowBlurRadius);
                shadowSpreadSlider.value = parseFloat(theme.shadowSpread || defaultShadowSpreadRadius);
                try { const rgbaMatch = (theme.shadowColor || defaultShadowColorValue).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/); if (rgbaMatch) { shadowColorInput.value = rgbToHex(parseInt(rgbaMatch[1]), parseInt(rgbaMatch[2]), parseInt(rgbaMatch[3])); shadowOpacitySlider.value = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) * 100 : 100; } else { shadowColorInput.value = '#000000'; shadowOpacitySlider.value = 25; } } catch { shadowColorInput.value = '#000000'; shadowOpacitySlider.value = 25; }
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
    // Set initial component visibility based on default active thumbnail
    const initialComponentType = document.querySelector('.thumbnail-button.active')?.dataset.component || 'card';
    currentComponentType = initialComponentType;
    componentPreviews.forEach(preview => { preview.hidden = (preview.dataset.componentType !== currentComponentType); });

    const initialStyleMode = document.querySelector('input[name="style-mode"]:checked')?.value || 'glow';
    currentStyleMode = initialStyleMode;
    updateControlVisibility(currentStyleMode);
    applyStyleModeClass(currentStyleMode);

    // Apply initial styles globally & set control values
    applyBorderStyle(currentBorderStyle);
    root.style.setProperty('--main-font', currentFont);
    bgColorInput.value = defaultPageBgColor;
    gridSizeSlider.value = parseFloat(defaultGridSize);
    gridOpacitySlider.value = defaultGridAlpha * 100;
    glassBlurSlider.value = parseFloat(defaultGlassBlur);
    glassOpacitySlider.value = defaultGlassOpacity * 100;
    shadowOffsetXSlider.value = parseFloat(defaultShadowOffsetX);
    shadowOffsetYSlider.value = parseFloat(defaultShadowOffsetY);
    shadowBlurSlider.value = parseFloat(defaultShadowBlurRadius);
    shadowSpreadSlider.value = parseFloat(defaultShadowSpreadRadius);
    try { const rgbaMatch = defaultShadowColorValue.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/); if (rgbaMatch) { shadowColorInput.value = rgbToHex(parseInt(rgbaMatch[1]), parseInt(rgbaMatch[2]), parseInt(rgbaMatch[3])); shadowOpacitySlider.value = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) * 100 : 100; } else { shadowColorInput.value = '#000000'; shadowOpacitySlider.value = 25; } } catch { shadowColorInput.value = '#000000'; shadowOpacitySlider.value = 25; }
    hueSlider.value = defaultHue;
    saturationSlider.value = defaultSaturation;
    lightnessSlider.value = defaultLightness;

    updateAppearance('init'); // Trigger initial full update

});