(function () {
    if (
        window.location.pathname.endsWith("/search.html") ||
        window.location.pathname.endsWith("/search/")
    ) {
        return;
    }

    try {
        localStorage.removeItem("sphinx_highlight_terms");
        sessionStorage.removeItem("sphinx_highlight_terms");
    } catch (e) { }

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
    const initialLocalStorage = localStorage.getItem("sphinx_highlight_terms");

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

    window.addEventListener(
        "paste",
        (e) => {
            const path = e.composedPath ? e.composedPath() : [e.target];
            const inputEl = path.find(
                (el) =>
                    el &&
                    el.tagName === "INPUT" &&
                    (el.type === "search" || el.type === "text")
            );

            if (!inputEl) return;

            e.preventDefault();
            e.stopImmediatePropagation();

            const clipboardData = e.clipboardData || window.clipboardData;
            let pastedText = clipboardData ? clipboardData.getData("text") : "";

            if (pastedText) {
                let cleaned = pastedText.replace(/[\r\n\t]+/g, " ").replace(/\s+/g, " ").trim();

                if (cleaned.includes(" ") && !cleaned.startsWith('"') && !cleaned.endsWith('"')) {
                    cleaned = `"${cleaned}"`;
                }

                const nativeSetter = Object.getOwnPropertyDescriptor(
                    HTMLInputElement.prototype,
                    "value"
                ).set;
                nativeSetter.call(inputEl, cleaned);

                sessionStorage.setItem("rtd_search_query", cleaned);

                const inputEvent = new InputEvent("input", {
                    bubbles: true,
                    composed: true,
                    inputType: "insertFromPaste",
                    data: cleaned,
                });
                inputEl.dispatchEvent(inputEvent);

                const changeEvent = new Event("change", { bubbles: true, composed: true });
                inputEl.dispatchEvent(changeEvent);
            }
        },
        true
    );

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
            sessionStorage.removeItem("rtd_search_query");
        }

        console.log(`debug initialSessionStorage ${initialSessionStorage}`);

        if (!rawQuery && initialLocalStorage) {
            rawQuery = initialLocalStorage;
            try {
                localStorage.removeItem("sphinx_highlight_terms");
            } catch (e) { }
        }

        if (!rawQuery) return "";

        let cleaned = rawQuery.trim();
        if (cleaned.startsWith('"') && cleaned.endsWith('"') && cleaned.length > 2) {
            cleaned = cleaned.slice(1, -1).trim();
        }

        return cleaned;
    }

    function clearSphinxHighlights() {
        document
            .querySelectorAll("span.highlighted, mark.highlighted, .highlighted")
            .forEach((el) => {
                if (!el.classList.contains("custom-search-highlight")) {
                    const parent = el.parentNode;
                    if (parent) {
                        while (el.firstChild) {
                            parent.insertBefore(el.firstChild, el);
                        }
                        parent.removeChild(el);
                        parent.normalize();
                    }
                }
            });
    }

    function applyCustomHighlighting() {
        clearSphinxHighlights();

        const rawTerm = getHighlightTerms();
        if (!rawTerm || rawTerm.length < 2) return [];

        function buildFlexRegex(term) {
            const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const flexPattern = escaped.replace(/\s+/g, "\\s+");
            return new RegExp(`(${flexPattern})`, "gi");
        }

        function findAndHighlight(phrases) {
            const targets = [];
            const regexes = phrases.map((p) => buildFlexRegex(p));

            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            const matchingWork = [];
            let node;
            while ((node = walker.nextNode())) {
                const parent = node.parentElement;
                if (
                    parent &&
                    !["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT"].includes(parent.tagName) &&
                    !parent.classList.contains("custom-search-highlight")
                ) {
                    const text = node.nodeValue;
                    for (const regex of regexes) {
                        regex.lastIndex = 0;
                        if (regex.test(text)) {
                            matchingWork.push({ node, regex });
                            break;
                        }
                    }
                }
            }

            matchingWork.forEach(({ node: textNode, regex }) => {
                const text = textNode.nodeValue;
                const frag = document.createDocumentFragment();
                let lastIndex = 0;

                regex.lastIndex = 0;
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

        let targets = findAndHighlight([rawTerm]);

        if (targets.length === 0) {
            const linePhrases = rawTerm
                .split(/(?:\r?\n|in \w+\s+)/g)
                .map((s) => s.trim())
                .filter((s) => s.length > 3);

            if (linePhrases.length > 0) {
                targets = findAndHighlight(linePhrases);
            }
        }

        if (targets.length === 0) {
            const keywords = rawTerm
                .split(/[\s,()\[\]{}:"';\/\\#]+/)
                .map((t) => t.trim())
                .filter((t) => t.length > 3 || /^\d+$/.test(t));

            if (keywords.length > 0) {
                targets = findAndHighlight(keywords);
            }
        }

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
        disableSphinxHighlight();
        const targets = applyCustomHighlighting();
        if (targets.length === 0) return;

        targets.forEach((target) => {
            const ancestors = getAncestorContainers(target);
            revealContainers(ancestors);
        });

        setTimeout(() => {
            targets[0].scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);
    }

    document.addEventListener("DOMContentLoaded", () => {
        processAutoExpand();
    });
})();