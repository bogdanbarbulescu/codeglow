document.addEventListener('DOMContentLoaded', () => {
    // Get slider elements
    const hueSlider = document.getElementById('hue');
    const saturationSlider = document.getElementById('saturation');
    const lightnessSlider = document.getElementById('lightness');

    // Get value display elements
    const hueValueSpan = document.getElementById('hue-value');
    const saturationValueSpan = document.getElementById('saturation-value');
    const lightnessValueSpan = document.getElementById('lightness-value');

    // Get HEX elements
    const hexInput = document.getElementById('hex-code');
    const copyHexButton = document.getElementById('copy-hex-button');

    // Get CSS Snippet elements
    const cssSnippetTextArea = document.getElementById('css-snippet');
    const copySnippetButton = document.getElementById('copy-snippet-button');

    // Get the root element (:root) to set CSS variables
    const root = document.documentElement;

    // --- HSL to HEX Conversion Function (remains the same) ---
    function hslToHex(h, s, l) {
        s /= 100; l /= 100;
        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c / 2,
            r = 0, g = 0, b = 0;
        if (0 <= h && h < 60) { r = c; g = x; b = 0; }
        else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
        else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
        else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
        else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
        else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);
        const toHex = val => {
            const hex = val.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    }
    // --- End HSL to HEX Function ---

    /**
     * Generates a CSS snippet based on the current color settings.
     * @returns {string} - The formatted CSS snippet.
     */
    function generateCssSnippet(h, s, l, hex) {
        // Use the actual derived values for glow/text lightness for accuracy
        const glowLightness = getComputedStyle(root).getPropertyValue('--glow-lightness').trim();
        const textLightness = getComputedStyle(root).getPropertyValue('--text-lightness').trim();
        const mainColor = `hsl(${h}, ${s}%, ${l}%)`;
        const glowColor = `hsl(${h}, ${s}%, ${glowLightness})`;
        const textColor = `hsl(${h}, ${s}%, ${textLightness})`;

        // Use template literals for easy multi-line string formatting
        return `
/* Futuristic Display Style */
/* Generated HEX: ${hex} */

:root {
  --futuristic-hue: ${h};
  --futuristic-saturation: ${s}%;
  --futuristic-lightness: ${l}%;
  --futuristic-glow-lightness: ${glowLightness}; /* Adjusted for glow */
  --futuristic-text-lightness: ${textLightness}; /* Adjusted for text */

  /* Derived Colors */
  --futuristic-main-color: ${mainColor};
  --futuristic-glow-color: ${glowColor};
  --futuristic-text-color: ${textColor};

  /* Adjust alpha values as needed */
  --futuristic-glow-alpha-high: 0.8;
  --futuristic-glow-alpha-medium: 0.6;
  --futuristic-glow-alpha-low: 0.4;
  --futuristic-glow-alpha-inset: 0.5;
  --futuristic-text-glow-alpha: 0.7;
}

/* Example Usage: Apply to your element */
.your-futuristic-element {
  border: 3px solid var(--futuristic-main-color);
  color: var(--futuristic-text-color);
  text-shadow: 0 0 5px hsla(var(--futuristic-hue), var(--futuristic-saturation), var(--futuristic-text-lightness), var(--futuristic-text-glow-alpha));
  box-shadow:
    0 0 10px hsla(var(--futuristic-hue), var(--futuristic-saturation), var(--futuristic-glow-lightness), var(--futuristic-glow-alpha-high)),
    0 0 25px hsla(var(--futuristic-hue), var(--futuristic-saturation), var(--futuristic-glow-lightness), var(--futuristic-glow-alpha-medium)),
    0 0 45px hsla(var(--futuristic-hue), var(--futuristic-saturation), var(--futuristic-glow-lightness), var(--futuristic-glow-alpha-low)),
    inset 0 0 15px hsla(var(--futuristic-hue), var(--futuristic-saturation), var(--futuristic-glow-lightness), var(--futuristic-glow-alpha-inset));

  /* For interactive elements like sliders/buttons inside */
  accent-color: var(--futuristic-main-color);
  background-color: var(--futuristic-main-color); /* Example for button */
}

/* Example for corner elements if used */
.your-futuristic-element .corner-piece {
   border-color: var(--futuristic-main-color);
   box-shadow: 0 0 8px hsla(var(--futuristic-hue), var(--futuristic-saturation), var(--futuristic-glow-lightness), var(--futuristic-glow-alpha-medium));
}
        `.trim(); // .trim() removes leading/trailing whitespace
    }


    /**
     * Main update function called when sliders change.
     */
    function updateColor() {
        const hue = hueSlider.value;
        const saturation = saturationSlider.value;
        const lightness = lightnessSlider.value;

        // Update CSS variables
        root.style.setProperty('--hue', hue);
        root.style.setProperty('--saturation', `${saturation}%`);
        root.style.setProperty('--lightness', `${lightness}%`);

        // Adjust related variables (ensure these run *before* generating snippet)
        let glowLightnessVal = Math.min(100, parseInt(lightness) + 10);
        root.style.setProperty('--glow-lightness', `${glowLightnessVal}%`);
        let textLightnessVal = Math.min(100, Math.max(40, parseInt(lightness) + 20));
        root.style.setProperty('--text-lightness', `${textLightnessVal}%`);

        // Update displayed HSL values
        hueValueSpan.textContent = hue;
        saturationValueSpan.textContent = saturation;
        lightnessValueSpan.textContent = lightness;

        // Update HEX Code Display
        const hexColor = hslToHex(hue, saturation, lightness);
        hexInput.value = hexColor;

        // --- Generate and Display CSS Snippet ---
        const cssSnippet = generateCssSnippet(hue, saturation, lightness, hexColor);
        cssSnippetTextArea.value = cssSnippet;
    }

    // Add event listeners to sliders
    hueSlider.addEventListener('input', updateColor);
    saturationSlider.addEventListener('input', updateColor);
    lightnessSlider.addEventListener('input', updateColor);

    // --- Event Listener for Copy HEX Button (remains the same) ---
     copyHexButton.addEventListener('click', () => {
        const hexValue = hexInput.value;
        const originalText = copyHexButton.textContent;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(hexValue).then(() => {
                copyHexButton.textContent = 'Copied!'; copyHexButton.classList.add('copied');
                setTimeout(() => { copyHexButton.textContent = originalText; copyHexButton.classList.remove('copied'); }, 1500);
            }).catch(err => {
                console.error('Failed to copy HEX: ', err); copyHexButton.textContent = 'Error!';
                setTimeout(() => { copyHexButton.textContent = originalText; }, 1500);
            });
        } else { /* Fallback omitted for brevity, but keep if needed */ }
    });
    // --- End Copy HEX Button Listener ---


    // --- Event Listener for Copy CSS Snippet Button ---
    copySnippetButton.addEventListener('click', () => {
        const snippetValue = cssSnippetTextArea.value;
        const originalText = copySnippetButton.textContent;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(snippetValue).then(() => {
                // Success feedback
                copySnippetButton.textContent = 'Copied!';
                copySnippetButton.classList.add('copied');
                setTimeout(() => {
                    copySnippetButton.textContent = originalText;
                    copySnippetButton.classList.remove('copied');
                }, 1500);
            }).catch(err => {
                console.error('Failed to copy CSS snippet: ', err);
                // Error feedback
                copySnippetButton.textContent = 'Error!';
                 copySnippetButton.classList.remove('copied');
                setTimeout(() => {
                    copySnippetButton.textContent = originalText;
                }, 1500);
            });
        } else {
            // Basic fallback for snippet textarea
            try {
                cssSnippetTextArea.select();
                cssSnippetTextArea.setSelectionRange(0, 99999); // For mobile
                document.execCommand('copy');
                copySnippetButton.textContent = 'Copied!'; copySnippetButton.classList.add('copied');
                setTimeout(() => { copySnippetButton.textContent = originalText; copySnippetButton.classList.remove('copied'); }, 1500);
            } catch (err) {
                 console.error('Fallback snippet copy failed: ', err);
                 copySnippetButton.textContent = 'Error!'; copySnippetButton.classList.remove('copied');
                  setTimeout(() => { copySnippetButton.textContent = originalText; }, 1500);
            }
             window.getSelection().removeAllRanges();
             cssSnippetTextArea.blur();
        }
    });
    // --- End Copy CSS Snippet Button Listener ---

    // Initial call to set colors, HEX, and generate snippet on page load
    updateColor();
});
