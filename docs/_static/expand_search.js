(function () {
    if (
        window.location.pathname.endsWith("/search.html") ||
        window.location.pathname.endsWith("/search/")
    ) {
        return;
    }

    const disableSphinxHighlight = () => {
        if (window.SphinxHighlight) {
            window.SphinxHighlight.highlightSearchWords = function () { };
        }
    };
    disableSphinxHighlight();
    Object.defineProperty(window, "SphinxHighlight", {
        get: function () {
            return { highlightSearchWords: function () { } };
        },
        set: function () { },
        configurable: true,
    });

    if (window.location.search.includes("highlight=")) {
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete("highlight");
        window.history.replaceState({}, "", cleanUrl.toString());
    }

    const initialSearch = window.location.search;
    const initialSessionStorage = sessionStorage.getItem("rtd_search_query");

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
                sessionStorage.setItem("rtd_search_query", cleaned);
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
                } catch (err) { }
            }
        }
    });

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
            initialSessionStorage = null;
            sessionStorage.removeItem("rtd_search_query");
        }

        if (!rawQuery) return [];

        return rawQuery;
    }

    function applyCustomHighlighting() {
        const terms = getHighlightTerms();
        if (terms.length === 0) return [];

        const validTerms = terms.filter((t) => t.length > 2 || /^\d+$/.test(t));
        if (validTerms.length === 0) return [];

        const escaped = validTerms
            .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
            .join("|");
        const regex = new RegExp(`(${escaped})`, "gi");

        const targets = [];
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const matchingNodes = [];
        let node;
        while ((node = walker.nextNode())) {
            const parent = node.parentElement;
            if (
                parent &&
                !["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT"].includes(parent.tagName) &&
                !parent.classList.contains("custom-search-highlight")
            ) {
                if (regex.test(node.nodeValue)) {
                    matchingNodes.push(node);
                }
            }
        }

        matchingNodes.forEach((textNode) => {
            const text = textNode.nodeValue;
            const frag = document.createDocumentFragment();
            let lastIndex = 0;

            text.replace(regex, (match, p1, offset) => {
                if (offset > lastIndex) {
                    frag.appendChild(document.createTextNode(text.substring(lastIndex, offset)));
                }

                const mark = document.createElement("mark");
                mark.className = "custom-search-highlight";
                mark.textContent = match;
                frag.appendChild(mark);
                targets.push(mark);

                lastIndex = offset + match.length;
            });

            if (lastIndex < text.length) {
                frag.appendChild(document.createTextNode(text.substring(lastIndex)));
            }

            if (textNode.parentNode) {
                textNode.parentNode.replaceChild(frag, textNode);
            }
        });

        return targets;
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

    function processAutoExpand() {
        const targets = applyCustomHighlighting();
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
        disableSphinxHighlight();
        processAutoExpand();
    });
})();