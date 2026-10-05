(function () {
    // Do not run on search result pages
    if (
        window.location.pathname.endsWith("/search.html") ||
        window.location.pathname.endsWith("/search/")
    ) {
        return;
    }

    // =========================================================================
    // 1. CRITICAL: Capture search terms IMMEDIATELY when the script executes.
    // Sphinx's `sphinx_highlight.js` deletes `?highlight=` from `window.location.search`
    // via `history.replaceState()` before DOMContentLoaded fires!
    // =========================================================================
    const initialSearch = window.location.search;
    const initialReferrer = document.referrer;
    const initialLocalStorage = localStorage.getItem("sphinx_highlight_terms");

    /**
     * Parses search terms from pre-captured URL, localStorage, or referrer.
     */
    function getHighlightTerms() {
        let rawQuery = "";

        // A. Check initial URL params captured before Sphinx erased them
        const urlParams = new URLSearchParams(initialSearch);
        rawQuery =
            urlParams.get("highlight") ||
            urlParams.get("q") ||
            urlParams.get("search") ||
            "";

        // B. Check localStorage fallback
        if (!rawQuery && initialLocalStorage) {
            rawQuery = initialLocalStorage;
        }

        // C. Check referrer if coming directly from search.html?q=...
        if (!rawQuery && initialReferrer) {
            try {
                const refParams = new URL(initialReferrer).searchParams;
                rawQuery = refParams.get("q") || refParams.get("highlight") || "";
            } catch (e) {
                // Ignore invalid referrer URLs
            }
        }

        if (!rawQuery) return [];

        const tokens = rawQuery
            .split(/[\s,()\[\]{}:"';\/\\#]+/)
            .map((t) => t.trim())
            .filter((t) => t.length > 1);

        return tokens;
    }

    function getAncestorContainers(element) {
        const containers = [];
        let curr = element;

        while (curr && curr !== document.body) {
            if (curr.tagName === "DETAILS" || curr.classList.contains("sd-dropdown")) {
                containers.push({ type: "details", el: curr });
            }

            if (curr.classList.contains("sd-tab-content")) {
                let prev = curr.previousElementSibling;
                while (prev) {
                    if (prev.tagName === "LABEL" && prev.classList.contains("sd-tab-label")) {
                        const label = prev;
                        containers.push({ type: "tab", input: prev, label: label, content: curr });
                        break;
                    }
                    prev = prev.previousElementSibling;
                }
            }
            curr = curr.parentElement;
        }

        // Reverse to process top-down (Outermost Dropdown -> Outer Tab -> Inner Tab)
        return containers.reverse();
    }

    /**
     * Opens parent dropdowns and activates tabs in top-down sequence
     */
    function revealContainers(containers) {
        containers.forEach((item) => {
            if (item.type === "details") {
                item.el.open = true;
                item.el.setAttribute("open", "");
            } else if (item.type === "tab") {
                if (item.input && !item.input.checked) {
                    item.input.checked = true;
                    item.input.dispatchEvent(new Event("change", { bubbles: true }));
                }
                if (item.label) {
                    item.label.click(); // Trigger sphinx-design CSS/JS tab switching
                }
            }
        });
    }

    /**
     * Finds target elements on the page:
     * 1. Built-in Sphinx highlight spans (span.highlighted)
     * 2. Manual DOM search for parsed error terms if Sphinx missed them
     */
    function findTargets() {
        const targets = [];

        // 1. Existing Sphinx highlight spans
        const sphinxHighlights = document.querySelectorAll(
            "span.highlighted, mark.highlighted, .highlighted"
        );
        if (sphinxHighlights.length > 0) {
            sphinxHighlights.forEach((el) => targets.push(el));
            return targets;
        }

        // 2. Manual search using captured terms
        const terms = getHighlightTerms();

        if (terms.length > 0) {
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            let node;
            while ((node = walker.nextNode())) {
                const text = node.nodeValue;
                for (const term of terms) {
                    if (term.length > 2 || /^\d+$/.test(term)) {
                        if (text.toLowerCase().includes(term.toLowerCase())) {
                            const parent = node.parentElement;
                            if (
                                parent &&
                                !["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"].includes(parent.tagName)
                            ) {
                                targets.push(parent);
                                break; // Found matching element
                            }
                        }
                    }
                }
            }
        }

        return targets;
    }

    function processAutoExpand() {
        const targets = findTargets();
        if (targets.length === 0) return false;

        targets.forEach((target) => {
            const ancestors = getAncestorContainers(target);
            revealContainers(ancestors);
        });

        // Scroll first match into view
        setTimeout(() => {
            targets[0].scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);

        return true;
    }

    // --- Execution Triggers ---
    document.addEventListener("DOMContentLoaded", () => {
        processAutoExpand();
    });

    // Dynamic DOM observer for asynchronous Sphinx highlighting
    const observer = new MutationObserver(() => {
        if (document.querySelector("span.highlighted, mark.highlighted")) {
            processAutoExpand();
            observer.disconnect();
        }
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Timed fallbacks to ensure expansion completes
    [100, 300, 600].forEach((delay) => {
        setTimeout(processAutoExpand, delay);
    });
})();