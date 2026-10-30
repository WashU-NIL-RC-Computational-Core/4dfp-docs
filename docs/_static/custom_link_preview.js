(function () {
    // All Read the Docs Addons link preview styles injected directly into the Shadow DOM
    const shadowStyles = `
      /* Container & Card Framing */
      :host, .tooltip, [part="card"] {
        font-family: ivystyle-sans, sans-serif !important;
        border: 1px solid #e1e4e5 !important;
        border-top: 3px solid #BA0C2F !important; /* Brand Red Top Accent */
        border-radius: 6px !important;
        background-color: #ffffff !important;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        color: #212529 !important;
        padding: 14px 18px !important;
        max-width: 420px !important;
      }
  
      /* Term Title Header */
      [slot="title"], dt, h1, h2, h3 {
        font-family: ivystyle-sans, sans-serif !important;
        font-weight: 700 !important;
        font-size: 1.05rem !important;
        color: #BA0C2F !important; /* Brand Red */
        margin-top: 0 !important;
        margin-bottom: 8px !important;
        padding-bottom: 4px !important;
        border-bottom: 1px solid #e9ecef !important;
        letter-spacing: -0.01em;
      }
  
      /* Body Text & Descriptions */
      [slot="content"], dd, p {
        font-family: ivystyle-sans, sans-serif !important;
        font-size: 0.875rem !important;
        line-height: 1.5 !important;
        color: #212529 !important;
        margin-bottom: 8px !important;
      }
  
      /* Hyperlinks */
      a {
        color: #BA0C2F !important;
        text-decoration: none !important;
        font-weight: 600 !important;
      }
      a:hover {
        text-decoration: underline !important;
      }
  
      /* Code Blocks (<pre> and highlight containers) */
      div[class*='highlight'], pre {
        background-color: #f8f9fa !important;
        color: #24292e !important;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
        font-size: 0.8125rem !important;
        line-height: 1.45 !important;
        padding: 10px 12px !important;
        border: 1px solid #e1e4e5 !important;
        border-radius: 6px !important;
        margin: 10px 0 !important;
        white-space: pre-wrap !important; /* Prevents overflow */
        word-break: break-word !important; /* Forces line wraps */
        overflow-x: auto !important;
      }
  
      /* Inline Snippets */
      code, tt.literal, code.literal {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
        background-color: #f1f3f5 !important;
        color: #212529 !important;
        border: 1px solid #e9ecef !important;
        border-radius: 4px !important;
        padding: 2px 5px !important;
        font-size: 0.8125rem !important;
        white-space: break-spaces !important;
      }
  
      /* Unordered & Ordered Lists */
      ul, ol {
        margin-top: 4px !important;
        margin-bottom: 8px !important;
        padding-left: 20px !important;
      }
  
      li {
        font-size: 0.875rem !important;
        line-height: 1.45 !important;
        margin-bottom: 4px !important;
      }
    `;

    function injectShadowStyles(hostEl) {
        if (hostEl && hostEl.shadowRoot && !hostEl.shadowRoot.querySelector('#rtd-preview-shadow-style')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'rtd-preview-shadow-style';
            styleEl.textContent = shadowStyles;
            hostEl.shadowRoot.appendChild(styleEl);
        }
    }

    // Monitor DOM for Read the Docs Addons component creation
    const observer = new MutationObserver(() => {
        const previewEls = document.querySelectorAll('readthedocs-linkpreview, readthedocs-addons-tooltip');
        previewEls.forEach(injectShadowStyles);
    });

    document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();