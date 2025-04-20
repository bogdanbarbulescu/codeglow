# GlowGen Component Styler ✨🎨

GlowGen is a web-based visual tool designed to help developers and designers create stylish web components. It allows you to interactively customize various aesthetic properties like color, effects (glow, glassmorphism, solid), borders, and fonts, and instantly preview the results across common HTML component types. The tool generates ready-to-use HTML and CSS code snippets to kickstart your projects.

![GlowGen Screenshot](placeholder_screenshot.png)
*(Add a compelling screenshot or GIF of the app here!)*

**[Live Demo Link (Optional - Add link if hosted)]**

## Features

*   **Multiple Style Modes:**
    *   **Glow / Neon:** Create components with glowing borders, text shadows, and optional glassmorphism (`backdrop-filter`). Ideal for dark themes and futuristic UIs.
    *   **Solid Dark:** Design professional-looking components with opaque backgrounds suitable for dark page themes. Uses standard box shadows.
    *   **Solid Light:** Similar to Solid Dark, but optimized for light page themes with appropriate color contrast.
*   **Live Component Previews:**
    *   See your style changes applied instantly to a variety of common HTML component structures:
        *   Header (`<header>`)
        *   Navigation (`<nav>`)
        *   Section (`<section>`)
        *   Article (`<article>`)
        *   Aside (`<aside>`)
        *   Footer (`<footer>`)
        *   Details/Summary (`<details>`/`<summary>`)
        *   Card (`<div>`)
    *   **Single Preview Focus:** View one component type at a time in the main preview area.
    *   **Thumbnail Navigation:** Quickly switch between component previews using the thumbnail bar.
*   **Extensive Customization:**
    *   **Accent Color:** Control the primary theme color using HSL sliders, RGB sliders, or direct HEX/RGB/HSL input.
    *   **Page Background:** Customize the overall page background color and the grid overlay (size, opacity).
    *   **Glass Effect (Glow Mode):** Adjust background blur (`backdrop-filter`) and opacity.
    *   **Box Shadow (Solid Modes):** Control standard box shadow properties (offset X/Y, blur, spread, color, opacity).
    *   **Border Style:** Choose between Sharp corners, Rounded corners, or No border.
    *   **Global Font:** Select from a curated list of Google Fonts (Orbitron, Source Code Pro, Press Start 2P, Share Tech Mono) applied globally.
*   **Interactive Previews:** Hover over links and buttons in the preview pane to see interaction styles applied live. Expand/collapse the `<details>` component.
*   **Code Snippet Generation:**
    *   Generates clean HTML structure for the selected component.
    *   Generates corresponding CSS with:
        *   Clearly defined CSS Custom Properties (`:root` variables) for easy theme integration.
        *   Mode-specific styles.
        *   Basic interaction styles (`:hover`, `:focus`, `:active`).
    *   Copy-to-clipboard functionality for the full HTML+CSS snippet.
*   **Utilities:**
    *   **Themes:** Apply predefined style configurations (primarily for Glow mode currently).
    *   **Random Accent:** Generate a random accent color for inspiration.
    *   **Reset All:** Revert all settings (page, component, font, etc.) back to their defaults.
    *   **Contrast Checker:** Displays the WCAG contrast ratio between the component's calculated text and background colors for accessibility awareness.
*   **Responsive Design:** The tool's interface adapts to different screen sizes.

## How to Use

1.  **(Optional) Select Style Mode:** Choose between "Glow / Neon", "Solid Dark", or "Solid Light" to set the base visual style.
2.  **(Optional) Adjust Page Background:** Use the controls to set the overall page background color and grid appearance.
3.  **Choose Accent Color:** Use the HSL, RGB, or Direct Input controls to select the main color for borders, highlights, etc.
4.  **Configure Component Effects:**
    *   If in "Glow" mode, adjust the Glass Effect (Blur, Opacity).
    *   If in "Solid Dark" or "Solid Light" mode, adjust the Box Shadow properties.
5.  **Set Border & Font:** Choose the desired Component Border style and Global Font.
6.  **Select Component Preview:** Click a component name in the Thumbnail Bar at the bottom of the preview pane to view it in the main preview area.
7.  **Observe Live Preview:** All style changes are reflected instantly on the currently selected component preview. Hover over links/buttons to see interaction styles.
8.  **Check Contrast:** Refer to the Contrast Checker in the Utilities section.
9.  **Get Code:** Once satisfied, go to the "Code Snippet" section in the controls.
10. **Copy Code:** Click the "Copy Code" button to copy the generated HTML structure and CSS styles to your clipboard.
11. **Integrate:** Paste the HTML into your project structure and the CSS (including the `:root` variables) into your stylesheet. Remember to include the link to the selected Google Font in your HTML's `<head>` if you aren't already using it.

## Getting Started (Local Development)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/[YourUsername]/[YourRepoName].git
    ```
2.  **Navigate to the directory:**
    ```bash
    cd [YourRepoName]
    ```
3.  **Open `index.html`:** Simply open the `index.html` file in your web browser. No build step is required for the basic functionality.

## Technology Stack

*   HTML5
*   CSS3 (Custom Properties, Flexbox, Grid, Backdrop Filter)
*   Vanilla JavaScript (DOM Manipulation, Event Handling)
*   Google Fonts

## Contributing

Contributions are welcome! Whether it's reporting a bug, suggesting a feature, or submitting a pull request, your help is appreciated.

1.  **Issues:** Please open an issue first to discuss any significant changes or features you'd like to add. For bugs, provide clear steps to reproduce.
2.  **Pull Requests:**
    *   Fork the repository.
    *   Create a new branch for your feature or bug fix (`git checkout -b feature/your-feature-name` or `bugfix/issue-description`).
    *   Make your changes.
    *   Commit your changes with clear messages.
    *   Push your branch to your fork (`git push origin feature/your-feature-name`).
    *   Open a Pull Request back to the main repository.

Please try to follow the existing code style.

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

Happy Styling! ✨
