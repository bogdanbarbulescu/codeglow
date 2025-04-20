document.addEventListener('DOMContentLoaded', () => {
    // --- Get Elements ---
    const root = document.documentElement;
    const dataDisplayElement = document.querySelector('.data-display');

    // Color Controls - HSL
    const hueSlider = document.getElementById('hue');
    const saturationSlider = document.getElementById('saturation');
    const lightnessSlider = document.getElementById('lightness');
    const hueValueSpan = document.getElementById('hue-value');
    const saturationValueSpan = document.getElementById('saturation-value');
    const lightnessValueSpan = document.getElementById('lightness-value');

    // Color Controls - RGB
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
    const resetButton = document.getElementById('reset-button'); // Renamed ID
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
    let currentBorderStyle = 'sharp';
    let currentFont = "'Source Code Pro', monospace";
    let isUpdating = false; // Flag to prevent update loops

    // Store initial default values from CSS variables or set fallbacks
    // Read initial values carefully, providing defaults if CSS vars aren't set yet
    const defaultHue = parseInt(getComputedStyle(root).getPropertyValue('--default-hue').trim() || 180);
    const defaultSaturation = parseInt(getComputedStyle(root).getPropertyValue('--default-saturation').trim().replace('%','') || 100);
    const defaultLightness = parseInt(getComputedStyle(root).getPropertyValue('--default-lightness').trim().replace('%','') || 50);
    const defaultFont = getComputedStyle(root).getPropertyValue('--default-font').trim() || "'Source Code Pro', monospace";
    const defaultBorder = getComputedStyle(root).getPropertyValue('--default-border').trim() || 'sharp';
    const defaultGlassBlur = getComputedStyle(root).getPropertyValue('--default-glass-blur').trim() || '5px';
    const defaultGlassOpacity = parseFloat(getComputedStyle(root).getPropertyValue('--default-glass-opacity').trim() || 0.4);

    // --- Theme Definitions ---
    const themes = { // Themes could optionally include glass settings too
        'default-cyan': { hue: 180, saturation: 100, lightness: 50, font: "'Source Code Pro', monospace", border: 'sharp' },
        'cyberpunk-pink': { hue: 320, saturation: 90, lightness: 60, font: "'Orbitron', sans-serif", border: 'sharp' },
        'matrix-green': { hue: 130, saturation: 85, lightness: 55, font: "'Share Tech Mono', monospace", border: 'sharp' },
        'warning-red': { hue: 0, saturation: 100, lightness: 50, font: "'Source Code Pro', monospace", border: 'rounded' },
        'arcade-orange': { hue: 35, saturation: 100, lightness: 55, font: "'Press Start 2P', cursive", border: 'rounded' }
        // Example adding glass to a theme:
        // 'glassy-matrix': { hue: 130, saturation: 85, lightness: 55, font: "'Share Tech Mono', monospace", border: 'rounded', blur: '8px', opacity: 0.3 }
    };

    // --- Color Conversion Functions ---

    function hslToRgb(h, s, l) {
        h = parseInt(h); s = parseInt(s); l = parseInt(l); // Ensure numbers
        s /= 100; l /= 100;
        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c / 2, r = 0, g = 0, b = 0;
        if (0 <= h && h < 60) { r = c; g = x; b = 0; } else if (60 <= h && h < 120) { r = x; g = c; b = 0; } else if (120 <= h && h < 180) { r = 0; g = c; b = x; } else if (180 <= h && h < 240) { r = 0; g = x; b = c; } else if (240 <= h && h < 300) { r = x; g = 0; b = c; } else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
        r = Math.round((r + m) * 255); g = Math.round((g + m) * 255); b = Math.round((b + m) * 255);
        return { r, g, b };
    }

    function rgbToHsl(r, g, b) {
        r = parseInt(r); g = parseInt(g); b = parseInt(b); // Ensure numbers
        r /= 255; g /= 255; b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s, l = (max + min) / 2; // Initialize h
        if (max === min) { h = s = 0; } // achromatic
        else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    function rgbToHex(r, g, b) {
        r = parseInt(r); g = parseInt(g); b = parseInt(b); // Ensure numbers
        const toHex = val => { const hex = Number(val).toString(16); return hex.length === 1 ? '0' + hex : hex; };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    }

    function hexToRgb(hex) {
        hex = hex.trim();
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) { // Try shorthand HEX
            result = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
            if (result) {
                result[1] += result[1]; result[2] += result[2]; result[3] += result[3];
            } else { return null; }
        }
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function parseCssColor(str) {
        str = str.trim().toLowerCase();
        let match;
        // Match rgb(r, g, b) or rgba(r, g, b, a)
        match = str.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*[\d.]+)?\s*\)$/);
        if (match) {
            const r = parseInt(match[1]), g = parseInt(match[2]), b = parseInt(match[3]);
            if (r <= 255 && g <= 255 && b <= 255) return { type: 'rgb', value: { r, g, b } };
        }
        // Match hsl(h, s%, l%) or hsla(h, s%, l%, a)
        match = str.match(/^hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*(?:,\s*[\d.]+)?\s*\)$/);
        if (match) {
            const h = parseInt(match[1]), s = parseInt(match[2]), l = parseInt(match[3]);
            if (h <= 360 && s <= 100 && l <= 100) return { type: 'hsl', value: { h, s, l } };
        }
        // Try HEX
        const rgbFromHex = hexToRgb(str);
        if (rgbFromHex) return { type: 'rgb', value: rgbFromHex };

        return null;
    }

    // --- Contrast Calculation ---
    function getLuminance(r, g, b) {
        const a = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    function getContrastRatio(rgb1, rgb2) {
        const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
        const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        return (brightest + 0.05) / (darkest + 0.05);
    }

    function checkContrast() {
        try {
            const textLightnessValue = parseInt(getComputedStyle(root).getPropertyValue('--text-lightness').trim().replace('%',''));
            const textRgb = hslToRgb(parseInt(hueSlider.value), parseInt(saturationSlider.value), textLightnessValue);
            const bgRgb = hexToRgb(getComputedStyle(root).getPropertyValue('--bg-color-value').trim());

            if (!textRgb || !bgRgb) { throw new Error("Invalid RGB color(s)"); }

            const ratio = getContrastRatio(textRgb, bgRgb);
            contrastRatioSpan.textContent = ratio.toFixed(2);

            let rating = 'Fail';
            let ratingClass = 'contrast-rating-fail';
            if (ratio >= 7) { rating = 'AAA'; ratingClass = 'contrast-rating-aaa'; }
            else if (ratio >= 4.5) { rating = 'AA'; ratingClass = 'contrast-rating-aa'; }
            else if (ratio >= 3) { rating = 'AA Large'; ratingClass = 'contrast-rating-aa-large'; }

            contrastRatingSpan.textContent = rating;
            contrastRatingSpan.className = `contrast-rating ${ratingClass}`;
        } catch (error) {
            console.error("Contrast check failed:", error);
            contrastRatioSpan.textContent = 'N/A';
            contrastRatingSpan.textContent = '';
            contrastRatingSpan.className = 'contrast-rating';
        }
    }


    // --- Helper Functions ---

    function generateCssSnippet(h, s, l, hex, font, borderStyle, blur, opacity) {
        const glowLightness = getComputedStyle(root).getPropertyValue('--glow-lightness').trim();
        const textLightness = getComputedStyle(root).getPropertyValue('--text-lightness').trim();
        const mainColor = `hsl(${h}, ${s}%, ${l}%)`;
        const glowColor = `hsl(${h}, ${s}%, ${glowLightness})`;
        const textColor = `hsl(${h}, ${s}%, ${textLightness})`;
        const borderRadius = borderStyle === 'rounded' ? '15px' : '0';
        const glassBgBase = getComputedStyle(root).getPropertyValue('--glass-bg-base-color').trim() || '0, 15, 30'; // Fallback base color
        const glassBgColor = `rgba(${glassBgBase}, ${opacity})`;

        return `
/* GlowGen Style Snippet */
/* Generated HEX: ${hex} */
/* Font: ${font} */
/* Border: ${borderStyle} */
/* Glass Blur: ${blur}px, Opacity: ${opacity} */

:root {
  --glowgen-hue: ${h};
  --glowgen-saturation: ${s}%;
  --glowgen-lightness: ${l}%;
  --glowgen-glow-lightness: ${glowLightness};
  --glowgen-text-lightness: ${textLightness};
  --glowgen-font: ${font};
  --glowgen-glass-blur: ${blur}px;
  --glowgen-glass-opacity: ${opacity};
  --glowgen-glass-bg-base: ${glassBgBase};

  /* Derived Colors */
  --glowgen-main-color: ${mainColor};
  --glowgen-glow-color: ${glowColor};
  --glowgen-text-color: ${textColor};
  --glowgen-glass-bg: rgba(var(--glowgen-glass-bg-base), var(--glowgen-glass-opacity));
}

/* Example Usage */
.your-glowgen-element {
  font-family: var(--glowgen-font);
  border: 3px solid var(--glowgen-main-color);
  border-radius: ${borderRadius};
  color: var(--glowgen-text-color);
  background-color: var(--glowgen-glass-bg);
  backdrop-filter: blur(var(--glowgen-glass-blur));
  -webkit-backdrop-filter: blur(var(--glowgen-glass-blur)); /* Safari */
  text-shadow: 0 0 5px hsla(var(--glowgen-hue), var(--glowgen-saturation), var(--glowgen-text-lightness), var(--glowgen-text-glow-alpha));
  box-shadow:
    0 0 10px hsla(var(--glowgen-hue), var(--glowgen-saturation), var(--glowgen-glow-lightness), var(--glowgen-glow-alpha-high)),
    0 0 25px hsla(var(--glowgen-hue), var(--glowgen-saturation), var(--glowgen-glow-lightness), var(--glowgen-glow-alpha-medium)),
    0 0 45px hsla(var(--glowgen-hue), var(--glowgen-saturation), var(--glowgen-glow-lightness), var(--glowgen-glow-alpha-low)),
    inset 0 0 15px hsla(var(--glowgen-hue), var(--glowgen-saturation), var(--glowgen-glow-lightness), var(--glowgen-glow-alpha-inset));
}

/* Corner handling */
.your-glowgen-element.border-rounded .corner { display: none; }
.your-glowgen-element.border-sharp .corner {
   display: block;
   border-color: var(--glowgen-main-color);
   box-shadow: 0 0 8px hsla(var(--glowgen-hue), var(--glowgen-saturation), var(--glowgen-glow-lightness), var(--glowgen-corner-glow-alpha));
}
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
                tempInput.style.position = 'absolute'; tempInput.style.left = '-9999px'; // Hide visually
                tempInput.value = text; document.body.appendChild(tempInput);
                tempInput.select(); tempInput.setSelectionRange(0, 99999); // For mobile
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
        dataDisplayElement.classList.remove('border-sharp', 'border-rounded');
        dataDisplayElement.classList.add(`border-${styleValue}`);
        dataDisplayElement.dataset.borderStyle = styleValue;
    }

    function updateActiveThemeButton() {
         let activeTheme = null;
         const currentHue = parseInt(hueSlider.value);
         const currentSat = parseInt(saturationSlider.value);
         const currentLig = parseInt(lightnessSlider.value);
         // Note: Themes currently don't store glass settings, so we don't check them here
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

        // --- Synchronize Color Inputs ---
        let currentRgb = {r,g,b}; // Keep track of the definitive RGB
        if (source === 'hsl' || source === 'direct_hsl' || source === 'theme' || source === 'random' || source === 'reset' || source === 'init') {
             currentRgb = hslToRgb(h, s, l);
             if (source !== 'rgb') { // Update RGB sliders if they weren't the source
                 redSlider.value = currentRgb.r;
                 greenSlider.value = currentRgb.g;
                 blueSlider.value = currentRgb.b;
             }
             redValueSpan.textContent = currentRgb.r;
             greenValueSpan.textContent = currentRgb.g;
             blueValueSpan.textContent = currentRgb.b;
        } else if (source === 'rgb' || source === 'direct_rgb') {
            const hsl = rgbToHsl(r, g, b);
            if (source !== 'hsl') { // Update HSL sliders if they weren't the source
                 hueSlider.value = hsl.h;
                 saturationSlider.value = hsl.s;
                 lightnessSlider.value = hsl.l;
            }
            hueValueSpan.textContent = hsl.h;
            saturationValueSpan.textContent = hsl.s;
            lightnessValueSpan.textContent = hsl.l;
        }
        // Always update HEX and potentially Direct Input
        const hexColor = rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b);
        hexInput.value = hexColor;
        if (source !== 'direct_hsl' && source !== 'direct_rgb') {
            colorStringInput.value = hexColor;
            inputErrorSpan.textContent = '';
            colorStringInput.setCustomValidity('');
        }

        // --- Update CSS Variables ---
        root.style.setProperty('--hue', h);
        root.style.setProperty('--saturation', `${s}%`);
        root.style.setProperty('--lightness', `${l}%`);
        let glowLightnessVal = Math.min(100, l + 10);
        root.style.setProperty('--glow-lightness', `${glowLightnessVal}%`);
        let textLightnessVal = Math.min(100, Math.max(40, l + 20));
        root.style.setProperty('--text-lightness', `${textLightnessVal}%`);
        root.style.setProperty('--glass-blur', `${blur}px`);
        root.style.setProperty('--glass-bg-opacity', opacity);
        // Font and Border are handled by their specific event listeners setting CSS vars/classes

        // --- Update Value Displays ---
        glassBlurValueSpan.textContent = blur.toFixed(1);
        glassOpacityValueSpan.textContent = opacityPercent;

        // --- Update Snippet & Contrast ---
        const cssSnippet = generateCssSnippet(h, s, l, hexColor, currentFont, currentBorderStyle, blur, opacity);
        cssSnippetTextArea.value = cssSnippet;
        checkContrast();

        // --- Update Active Theme ---
        updateActiveThemeButton();

        isUpdating = false;
    }


    // --- Event Handlers ---

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
        const inputStr = colorStringInput.value;
        const parsed = parseCssColor(inputStr);
        let source = 'direct_unknown';

        if (parsed) {
            inputErrorSpan.textContent = '';
            colorStringInput.setCustomValidity('');
            if (parsed.type === 'hsl') {
                hueSlider.value = parsed.value.h;
                saturationSlider.value = parsed.value.s;
                lightnessSlider.value = parsed.value.l;
                source = 'direct_hsl';
            } else if (parsed.type === 'rgb') {
                redSlider.value = parsed.value.r;
                greenSlider.value = parsed.value.g;
                blueSlider.value = parsed.value.b;
                source = 'direct_rgb';
            }
             updateAppearance(source);
        } else {
            inputErrorSpan.textContent = 'Invalid Format';
            colorStringInput.setCustomValidity('Invalid color format');
        }
    });

    // Utility Buttons
    randomColorButton.addEventListener('click', () => {
        const h = Math.floor(Math.random() * 361);
        const s = Math.floor(Math.random() * 71) + 30;
        const l = Math.floor(Math.random() * 61) + 20;
        hueSlider.value = h; saturationSlider.value = s; lightnessSlider.value = l;
        updateAppearance('random');
    });

    resetButton.addEventListener('click', () => {
        // Reset font and border first
        fontStyleRadios.forEach(radio => radio.checked = radio.value === defaultFont);
        borderStyleRadios.forEach(radio => radio.checked = radio.value === defaultBorder);
        currentFont = defaultFont;
        root.style.setProperty('--main-font', currentFont);
        applyBorderStyle(defaultBorder);
        // Reset glass sliders
        glassBlurSlider.value = parseFloat(defaultGlassBlur);
        glassOpacitySlider.value = defaultGlassOpacity * 100;
        // Reset color sliders
        hueSlider.value = defaultHue;
        saturationSlider.value = defaultSaturation;
        lightnessSlider.value = defaultLightness;
        // Trigger full update
        updateAppearance('reset');
    });

    // Copy Buttons
    copyHexButton.addEventListener('click', () => copyToClipboard(hexInput.value, copyHexButton));
    copySnippetButton.addEventListener('click', () => copyToClipboard(cssSnippetTextArea.value, copySnippetButton));

    // Theme Buttons
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const themeName = button.dataset.theme;
            const theme = themes[themeName];
            if (theme) {
                fontStyleRadios.forEach(radio => radio.checked = radio.value === theme.font);
                borderStyleRadios.forEach(radio => radio.checked = radio.value === theme.border);
                currentFont = theme.font;
                root.style.setProperty('--main-font', currentFont);
                applyBorderStyle(theme.border);
                // Apply theme colors to sliders
                hueSlider.value = theme.hue;
                saturationSlider.value = theme.saturation;
                lightnessSlider.value = theme.lightness;
                // If theme includes glass settings, apply them (optional)
                if (theme.blur) glassBlurSlider.value = parseFloat(theme.blur);
                if (theme.opacity) glassOpacitySlider.value = theme.opacity * 100;
                // Trigger full update
                updateAppearance('theme');
            }
        });
    });

    // Border Style Radios
    borderStyleRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            if (event.target.checked) {
                applyBorderStyle(event.target.value);
                updateAppearance('border');
            }
        });
    });

    // Font Style Radios
    fontStyleRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            if (event.target.checked) {
                currentFont = event.target.value;
                root.style.setProperty('--main-font', currentFont); // Update CSS var for inheritance
                updateAppearance('font');
            }
        });
    });

    // --- Initial Setup ---
    applyBorderStyle(currentBorderStyle);
    root.style.setProperty('--main-font', currentFont);
    glassBlurSlider.value = parseFloat(defaultGlassBlur);
    glassOpacitySlider.value = defaultGlassOpacity * 100;
    hueSlider.value = defaultHue;
    saturationSlider.value = defaultSaturation;
    lightnessSlider.value = defaultLightness;
    updateAppearance('init'); // Trigger initial full update

});