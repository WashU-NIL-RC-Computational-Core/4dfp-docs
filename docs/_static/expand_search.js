(function () {
    if (
        window.location.pathname.endsWith("/search.html") ||
        window.location.pathname.endsWith("/search/")
    ) {
        return;
    }

    document.addEventListener("paste", (e) => {
        const path = e.composedPath ? e.composedPath() : [e.target];
        const inputEl = path.find(
            (el) =>
                el &&
                el.tagName === "INPUT" &&
                (el.type === "search" || el.type === "text")
        );

        if (inputEl) {
            const clipboardData = e.clipboardData || window.clipboardData;
            let pastedText = clipboardData ? clipboardData.getData("text") : "";

            if (pastedText) {
                let cleaned = pastedText.replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim();

                if (cleaned.includes(" ") && !cleaned.startsWith('"') && !cleaned.endsWith('"')) {
                    cleaned = `"${cleaned}"`;
                }

                console.log(`debug paste query: ${cleaned}`);

                sessionStorage.setItem("rtd_search_query", cleaned);

                setTimeout(() => {
                    if (inputEl.value !== cleaned) {
                        inputEl.value = cleaned;
                        inputEl.dispatchEvent(new Event("input", { bubbles: true }));
                    }
                }, 10);
            }
        }
    });

    document.addEventListener("input", (e) => {
        const path = e.composedPath ? e.composedPath() : [e.target];
        const inputEl = path.find(
            (el) =>
                el &&
                el.tagName === "INPUT" &&
                (el.type === "search" || el.type === "text")
        );

        if (inputEl) {
            const query = inputEl.value.trim();
            if (query.length > 0) {
                sessionStorage.setItem("rtd_search_query", query);
            } else {
                sessionStorage.removeItem("rtd_search_query");
            }
        }
    });

    document.addEventListener("click", (e) => {
        const path = e.composedPath ? e.composedPath() : [e.target];
        const link = path.find((el) => el && el.tagName === "A" && el.hasAttribute("href"));

        if (link) {
            const query = sessionStorage.getItem("rtd_search_query");
            if (query) {
                try {
                    const url = new URL(link.href, window.location.origin);
                    if (!url.searchParams.has("highlight")) {
                        url.searchParams.set("highlight", query);
                        link.href = url.toString();
                    }
                } catch (err) {
                    // Ignore invalid URLs
                }
            }
        }
    });

    const initialSearch = window.location.search;
    const initialReferrer = document.referrer;
    const initialLocalStorage = localStorage.getItem("sphinx_highlight_terms");
    const initialSessionStorage = sessionStorage.getItem("rtd_search_query");

    function getHighlightTerms() {
        let rawQuery = "";

        const urlParams = new URLSearchParams(initialSearch);
        rawQuery =
            urlParams.get("highlight") ||
            urlParams.get("q") ||
            urlParams.get("search") ||
            "";

        if (!rawQuery && initialSessionStorage) {
            rawQuery = initialSessionStorage;
            sessionStorage.removeItem("rtd_search_query");
        }

        if (!rawQuery && initialLocalStorage) {
            rawQuery = initialLocalStorage;
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

        return containers.reverse();
    }

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
                    item.label.click();
                }
            }
        });
    }

    function findTargets() {
        const targets = [];

        const sphinxHighlights = document.querySelectorAll(
            "span.highlighted, mark.highlighted, .highlighted"
        );
        if (sphinxHighlights.length > 0) {
            sphinxHighlights.forEach((el) => targets.push(el));
            return targets;
        }

        const term = getHighlightTerms();

        if (term.length > 0) {
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            let node;
            while ((node = walker.nextNode())) {
                const text = node.nodeValue;
                if (text.replace(/[\r\n]+/g, ' ').toLowerCase().includes(term.toLowerCase())) {
                    console.log(`debug text ${text.replace(/[\r\n]+/g, ' ').toLowerCase()}`);
                    console.log(`debug term ${term}`);
                    const parent = node.parentElement;
                    if (
                        parent &&
                        !["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"].includes(parent.tagName)
                    ) {
                        targets.push(parent);
                        break;
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

        setTimeout(() => {
            targets[0].scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);

        return true;
    }

    document.addEventListener("DOMContentLoaded", () => {
        processAutoExpand();
    });

    const observer = new MutationObserver(() => {
        if (document.querySelector("span.highlighted, mark.highlighted")) {
            processAutoExpand();
            observer.disconnect();
        }
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }

    [100, 300, 600].forEach((delay) => {
        setTimeout(processAutoExpand, delay);
    });
})();