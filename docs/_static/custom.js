document.addEventListener("DOMContentLoaded", function () {
    // Inject custom CSS for text highlight
    const highlightStyle = document.createElement('style');
    highlightStyle.textContent = `
        mark.custom-highlight {
            background-color: #fef08a !important;
            color: #000000 !important;
            padding: 2px 4px !important;
            border-radius: 3px !important;
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(highlightStyle);

    // Disable native Sphinx search word highlighting
    if (window.Documentation) {
        window.Documentation.highlightSearchWords = function () { };
    }

    const cardLinks = document.querySelectorAll('.nav-card a, .sd-card a, a.sd-card-link');
    cardLinks.forEach(link => {
        ['mouseenter', 'mouseover', 'pointerenter'].forEach(eventType => {
            link.addEventListener(eventType, function (e) {
                e.stopPropagation();
            }, true);
        });
    });

    const navTopLink = document.querySelector(".wy-nav-top a");
    const breadcrumbList = document.querySelector("ul.wy-breadcrumbs");

    if (navTopLink && !navTopLink.querySelector(".wy-nav-top-page-title")) {
        let pathSegments = [];

        if (breadcrumbList) {
            const items = Array.from(breadcrumbList.querySelectorAll("li"))
                .filter(li => !li.classList.contains("wy-breadcrumbs-aside"));

            items.forEach(li => {
                const clone = li.cloneNode(true);
                clone.querySelectorAll(".headerlink, a.icon, i, span.icon").forEach(el => el.remove());

                const text = clone.textContent
                    .replace(/[\uE000-\uF8FF\u200B\u00A0¶»>]/g, "")
                    .trim();

                if (text && text.toLowerCase() !== "docs") {
                    pathSegments.push(text);
                }
            });
        }

        if (pathSegments.length === 0) {
            const pageHeading = document.querySelector(".rst-content h1");
            if (pageHeading) {
                const headingClone = pageHeading.cloneNode(true);
                headingClone.querySelectorAll(".headerlink, a, i, span.icon").forEach(el => el.remove());
                const h1Text = headingClone.textContent.replace(/[\uE000-\uF8FF\u200B\u00A0¶]/g, "").trim();
                if (h1Text) pathSegments.push(h1Text);
            }
        }

        if (pathSegments.length > 0) {
            const titleSpan = document.createElement("span");
            titleSpan.className = "wy-nav-top-page-title";
            titleSpan.textContent = "/ " + pathSegments.join(" / ");
            navTopLink.appendChild(titleSpan);
        }
    }

    const navTop = document.querySelector(".wy-nav-top");
    if (navTop) {
        navTop.addEventListener("click", function (event) {
            const hamburger = navTop.querySelector("i, svg, [data-toggle='wy-nav-top']");
            const isHamburger = hamburger && hamburger.contains(event.target);

            if (!isHamburger) {
                event.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        });
    }

    const contentWrap = document.querySelector(".wy-nav-content-wrap");
    const navSide = document.querySelector(".wy-nav-side");

    if (contentWrap && navSide) {
        contentWrap.addEventListener("click", function (event) {
            const isMenuOpen = navSide.classList.contains("shift") || contentWrap.classList.contains("shift");

            if (isMenuOpen) {
                const hamburger = document.querySelector(".wy-nav-top i") || document.querySelector('[data-toggle="wy-nav-shift"]');
                if (hamburger) {
                    hamburger.click();
                } else {
                    document.querySelectorAll(".shift").forEach(el => el.classList.remove("shift"));
                }
            }
        });
    }

    // Stop-words list for filtering out generic prose terms during highlighting
    const STOP_WORDS = new Set([
        "a", "an", "the", "in", "on", "at", "to", "for", "of", "with", "by", "from",
        "up", "about", "into", "over", "after", "is", "are", "was", "were", "be",
        "been", "being", "have", "has", "had", "do", "does", "did", "and", "but",
        "or", "nor", "so", "yet", "if", "not", "no", "this", "that", "these", "those"
    ]);

    // Activates tabs (Sphinx-Design, Sphinx-Tabs, ARIA tabpanels)
    function activateTabForElement(element) {
        if (!element || !element.classList) return;

        // 1. Sphinx-Design Tabs (.sd-tab-content)
        if (element.classList.contains("sd-tab-content")) {
            const tabSet = element.closest(".sd-tab-set");
            if (tabSet) {
                const contents = Array.from(tabSet.querySelectorAll(":scope > .sd-tab-content, .sd-tab-content"));
                const idx = contents.indexOf(element);
                const labels = tabSet.querySelectorAll(".sd-tab-label");
                const inputs = tabSet.querySelectorAll("input");

                if (inputs[idx]) {
                    inputs[idx].checked = true;
                    inputs[idx].dispatchEvent(new Event("change", { bubbles: true }));
                }
                if (labels[idx]) {
                    labels[idx].click();
                }
            }
        }

        // 2. Sphinx-Tabs (.sphinx-tabs-panel) or ARIA Tab Panels
        if (element.classList.contains("sphinx-tabs-panel") ||
            (element.getAttribute && element.getAttribute("role") === "tabpanel") ||
            element.classList.contains("tab-pane") ||
            element.classList.contains("tab-content")) {

            element.removeAttribute("hidden");
            element.style.display = "";
            element.classList.add("active", "is-active", "show");

            const panelId = element.id;
            const tabContainer = element.closest(".sphinx-tabs, .tabs, [role='tablist']") || element.parentElement;

            if (tabContainer) {
                let tabBtn = null;
                if (panelId) {
                    tabBtn = tabContainer.querySelector(`[aria-controls="${panelId}"], [data-target="#${panelId}"], a[href="#${panelId}"]`);
                }
                if (!tabBtn) {
                    const panels = Array.from(tabContainer.querySelectorAll(".sphinx-tabs-panel, [role='tabpanel'], .tab-pane"));
                    const idx = panels.indexOf(element);
                    const btns = tabContainer.querySelectorAll(".sphinx-tabs-tab, [role='tab'], .nav-link, .tab-label");
                    tabBtn = btns[idx];
                }

                if (tabBtn) {
                    try { tabBtn.click(); } catch (e) { }
                    tabBtn.setAttribute("aria-selected", "true");
                    tabBtn.classList.add("active", "selected");
                }
            }
        }
    }

    // Unfolds parent containers (<details>, Sphinx-Design dropdowns, tabs, collapsibles)
    function expandParents(element) {
        if (!element) return;

        let current = element;
        while (current && current !== document.body) {
            // Activate tab panel if element resides inside a tab
            activateTabForElement(current);

            // Native <details> tag
            if (current.tagName && current.tagName.toLowerCase() === "details") {
                current.open = true;
                current.setAttribute("open", "");
            }

            // Sphinx-Design Dropdowns (.sd-dropdown)
            if (current.classList) {
                if (current.classList.contains("sd-dropdown")) {
                    current.classList.remove("sd-is-closed");
                    current.classList.add("sd-is-open");
                    const details = current.tagName && current.tagName.toLowerCase() === "details" ? current : current.closest("details");
                    if (details) {
                        details.open = true;
                        details.setAttribute("open", "");
                    }
                }

                // Collapsible Admonitions & Togglebuttons
                if (current.classList.contains("togglebutton") ||
                    current.classList.contains("toggle-details") ||
                    current.classList.contains("admonition-toggle") ||
                    current.classList.contains("toggle-hidden") ||
                    current.classList.contains("admonition-hidden") ||
                    current.classList.contains("toggle") ||
                    current.classList.contains("dropdown")) {

                    current.classList.remove("toggle-hidden", "admonition-hidden", "collapsed", "is-closed");

                    if (current.tagName && current.tagName.toLowerCase() === "details") {
                        current.open = true;
                        current.setAttribute("open", "");
                    } else {
                        const toggleBtn = current.querySelector("summary, .sd-dropdown-title, .toggle-button, .toggle-details-toggle, .admonition-title");
                        if (toggleBtn) {
                            try { toggleBtn.click(); } catch (e) { }
                        }
                    }
                }
            }

            current = current.parentElement;
        }

        // Open child dropdowns if element itself is a container
        if (element.querySelectorAll) {
            const childDropdowns = element.querySelectorAll("details, .sd-dropdown");
            childDropdowns.forEach(d => {
                if (d.tagName && d.tagName.toLowerCase() === "details") {
                    d.open = true;
                    d.setAttribute("open", "");
                }
                if (d.classList && d.classList.contains("sd-dropdown")) {
                    d.classList.remove("sd-is-closed");
                    d.classList.add("sd-is-open");
                }
            });
        }
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function normalizeForComparison(str) {
        if (!str) return "";
        return str.toLowerCase()
            .replace(/[\r\n]+/g, " ")
            .replace(/[^a-z0-9]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    // Strips native Sphinx single-word highlights and rejoins text nodes
    function removeAllHighlightsAndNormalize(scopeElement = document.body) {
        const highlights = scopeElement.querySelectorAll("mark.custom-highlight, span.highlighted, mark");
        highlights.forEach(mark => {
            if (mark.closest("#custom-search-modal")) return;

            const parent = mark.parentNode;
            if (parent) {
                const textNode = document.createTextNode(mark.textContent);
                parent.replaceChild(textNode, mark);
                parent.normalize();
            }
        });
    }

    function findExactTextNode(container, phrase) {
        const words = phrase.split(/\s+/).filter(Boolean);
        if (words.length === 0) return null;

        const phrasePattern = words.map(w => escapeRegExp(w)).join("\\s+");
        const phraseRegex = new RegExp(phrasePattern, "gi");

        const walker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (node) {
                    if (!node.parentElement) return NodeFilter.FILTER_REJECT;
                    const tag = node.parentElement.tagName.toLowerCase();
                    if (["script", "style", "noscript", "input", "textarea", "select"].includes(tag)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (node.parentElement.closest("#custom-search-modal")) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    phraseRegex.lastIndex = 0;
                    return phraseRegex.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
                }
            }
        );

        return walker.nextNode() ? walker.currentNode : null;
    }

    function highlightTextNode(node, phrase) {
        const words = phrase.split(/\s+/).filter(Boolean);
        const phrasePattern = words.map(w => escapeRegExp(w)).join("\\s+");
        const phraseRegex = new RegExp(phrasePattern, "gi");

        phraseRegex.lastIndex = 0;
        const match = phraseRegex.exec(node.nodeValue);

        if (match) {
            const mark = document.createElement("mark");
            mark.className = "custom-highlight";

            const highlightedText = node.splitText(match.index);
            highlightedText.splitText(match[0].length);

            mark.textContent = highlightedText.nodeValue;
            highlightedText.parentNode.replaceChild(mark, highlightedText);

            return mark;
        }
        return null;
    }

    function highlightSignificantTokens(container, tokens) {
        if (!container || !tokens || tokens.length === 0) return;

        const keyTokens = tokens.filter(t => (t.length >= 4 || /^\d+$/.test(t)) && !STOP_WORDS.has(t));
        if (keyTokens.length === 0) return;

        const pattern = keyTokens.map(t => escapeRegExp(t)).join("|");
        const regex = new RegExp(`\\b(${pattern})\\b`, "gi");

        const walker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (node) {
                    if (!node.parentElement) return NodeFilter.FILTER_REJECT;
                    const tag = node.parentElement.tagName.toLowerCase();
                    if (["script", "style", "noscript", "input", "textarea", "select", "mark"].includes(tag)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    if (node.parentElement.closest("#custom-search-modal")) return NodeFilter.FILTER_REJECT;
                    regex.lastIndex = 0;
                    return regex.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
                }
            }
        );

        const nodesToProcess = [];
        while (walker.nextNode()) {
            nodesToProcess.push(walker.currentNode);
        }

        nodesToProcess.forEach(node => {
            regex.lastIndex = 0;
            const match = regex.exec(node.nodeValue);
            if (match) {
                const mark = document.createElement("mark");
                mark.className = "custom-highlight";

                const highlightedText = node.splitText(match.index);
                highlightedText.splitText(match[0].length);

                mark.textContent = highlightedText.nodeValue;
                highlightedText.parentNode.replaceChild(mark, highlightedText);
            }
        });
    }

    function findAndHighlightText(searchTerm, scopeElement = document.body) {
        if (!searchTerm || searchTerm.trim().length < 2) return null;

        removeAllHighlightsAndNormalize(scopeElement);

        const mainContent = scopeElement.querySelector(".rst-content, main, [role='main']") || scopeElement;
        const cleanedTerm = searchTerm.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
        if (!cleanedTerm) return null;

        // Step 1: Look for exact full contiguous text node match
        const exactNode = findExactTextNode(mainContent, cleanedTerm);
        if (exactNode) {
            return highlightTextNode(exactNode, cleanedTerm);
        }

        // Step 2: Split multi-line query into separate lines and test each line
        const rawLines = searchTerm.split(/[\r\n]+/).map(l => l.trim()).filter(l => l.length >= 4);
        for (let line of rawLines) {
            const lineNode = findExactTextNode(mainContent, line);
            if (lineNode) {
                return highlightTextNode(lineNode, line);
            }
        }

        // Step 3: Extract error codes and identifiers from multi-line query
        const keyPhrases = [];
        const numbers = cleanedTerm.match(/\b\d{4,}\b/g);
        if (numbers) keyPhrases.push(...numbers);

        const identifiers = cleanedTerm.match(/\b[A-Za-z0-9_]{5,}\b/g);
        if (identifiers) {
            identifiers.forEach(id => {
                if (!STOP_WORDS.has(id.toLowerCase())) {
                    keyPhrases.push(id);
                }
            });
        }

        for (let phrase of keyPhrases) {
            const phraseNode = findExactTextNode(mainContent, phrase);
            if (phraseNode) {
                return highlightTextNode(phraseNode, phrase);
            }
        }

        // Step 4: Token Density Scoring Fallback for containers across tabs & code blocks
        const allTokens = cleanedTerm.toLowerCase()
            .replace(/[^a-z0-9_]/g, " ")
            .split(/\s+/)
            .filter(t => t.length > 1 && !STOP_WORDS.has(t));

        if (allTokens.length === 0) return null;

        const candidateContainers = mainContent.querySelectorAll(
            "details, .sd-dropdown, .sphinx-tabs-panel, .sd-tab-content, [role='tabpanel'], div.highlight, pre, code, .admonition, section, div.section, p, li"
        );

        let bestContainer = null;
        let maxScore = 0;

        candidateContainers.forEach(container => {
            if (container.closest("#custom-search-modal")) return;

            const text = container.textContent.toLowerCase();
            let score = 0;

            const uniqueTokens = new Set(allTokens);
            uniqueTokens.forEach(token => {
                if (text.includes(token)) {
                    if (/^\d{4,}$/.test(token) || token.length > 6) {
                        score += 4;
                    } else {
                        score += 1;
                    }
                }
            });

            if (score > maxScore) {
                maxScore = score;
                bestContainer = container;
            }
        });

        if (bestContainer && maxScore >= 2) {
            highlightSignificantTokens(bestContainer, allTokens);
            return bestContainer;
        }

        return null;
    }

    function getRTDMetadata() {
        let project = "";
        let version = "";

        if (window.READTHEDOCS_DATA) {
            project = window.READTHEDOCS_DATA.project || "";
            version = window.READTHEDOCS_DATA.version || "";
        }

        if (!project) {
            const projMeta = document.querySelector('meta[name="readthedocs-project-slug"], meta[name="project"]');
            if (projMeta) project = projMeta.content;
        }

        if (!version) {
            const verMeta = document.querySelector('meta[name="readthedocs-version-slug"], meta[name="version"]');
            if (verMeta) version = verMeta.content;
        }

        if (!project) {
            const hostParts = window.location.hostname.split('.');
            if (hostParts.length >= 3 && hostParts[1] === "readthedocs") {
                project = hostParts[0];
            }
        }

        if (!version) {
            const pathSegments = window.location.pathname.split('/').filter(Boolean);
            if (pathSegments.length > 0) {
                if (pathSegments[0].length === 2 && pathSegments[1]) {
                    version = pathSegments[1];
                } else if (!['docs', 'index.html'].includes(pathSegments[0])) {
                    version = pathSegments[0];
                }
            }
        }

        return { project, version };
    }

    function highlightAndExpand(query, hashId) {
        let targetElement = null;

        if (query && query.trim().length > 0) {
            targetElement = findAndHighlightText(query.trim());
        }

        if (!targetElement && hashId) {
            targetElement = document.getElementById(hashId) || document.getElementsByName(hashId)[0];
        }

        if (targetElement && hashId && query && targetElement.id === hashId) {
            const deeperMatch = findAndHighlightText(query.trim(), targetElement);
            if (deeperMatch) {
                targetElement = deeperMatch;
            }
        }

        if (targetElement) {
            expandParents(targetElement);

            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 150);

            return true;
        }

        return false;
    }

    // -------------------------------------------------------------
    // Custom Search Modal Implementation
    // -------------------------------------------------------------
    function initCustomSearchModal() {
        const modalHtml = `
            <div id="custom-search-modal" class="custom-modal-backdrop" style="display:none;">
                <div class="custom-modal-container">
                    <div class="custom-modal-header">
                        <svg class="custom-modal-search-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input type="search" id="custom-modal-input" placeholder="Search documentation..." autocomplete="off" />
                        <span class="custom-modal-close">&times;</span>
                    </div>
                    <div id="custom-modal-results" class="custom-modal-results">
                        <div class="custom-modal-state">Type to start searching...</div>
                    </div>
                    <div class="custom-modal-footer">
                        <span><kbd>↑</kbd> <kbd>↓</kbd> Navigate</span>
                        <span><kbd>↵</kbd> Select</span>
                        <span><kbd>ESC</kbd> Close</span>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML("beforeend", modalHtml);

        const modal = document.getElementById("custom-search-modal");
        const modalInput = document.getElementById("custom-modal-input");
        const modalResults = document.getElementById("custom-modal-results");
        const modalClose = modal.querySelector(".custom-modal-close");

        let selectedIndex = -1;
        let debounceTimer = null;

        function openModal(initialQuery = "") {
            modal.style.display = "flex";
            document.body.style.overflow = "hidden";
            modalInput.value = initialQuery;
            modalInput.focus();
            if (initialQuery.trim().length >= 2) {
                performSearch(initialQuery);
            } else {
                modalResults.innerHTML = '<div class="custom-modal-state">Type to start searching...</div>';
            }
        }

        function closeModal() {
            modal.style.display = "none";
            document.body.style.overflow = "";
            modalInput.value = "";
            selectedIndex = -1;
        }

        const sidebarSearchInput = document.querySelector("#rtd-search-form input[name='q'], input[name='q']");
        if (sidebarSearchInput) {
            sidebarSearchInput.addEventListener("focus", function (e) {
                e.preventDefault();
                sidebarSearchInput.blur();
                openModal(sidebarSearchInput.value);
            });
            sidebarSearchInput.addEventListener("click", function (e) {
                e.preventDefault();
                openModal(sidebarSearchInput.value);
            });
        }

        document.addEventListener("keydown", function (e) {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                if (modal.style.display === "flex") {
                    closeModal();
                } else {
                    openModal();
                }
            } else if (e.key === "Escape" && modal.style.display === "flex") {
                closeModal();
            }
        });

        modalClose.addEventListener("click", closeModal);
        modal.addEventListener("click", function (e) {
            if (e.target === modal) closeModal();
        });

        modalInput.addEventListener("input", function () {
            const query = modalInput.value.trim();
            clearTimeout(debounceTimer);
            selectedIndex = -1;

            if (query.length < 2) {
                modalResults.innerHTML = '<div class="custom-modal-state">Type to start searching...</div>';
                return;
            }

            debounceTimer = setTimeout(() => {
                performSearch(query);
            }, 250);
        });

        modalInput.addEventListener("keydown", function (e) {
            const items = modalResults.querySelectorAll(".custom-search-item");
            if (items.length === 0) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                selectedIndex = (selectedIndex + 1) % items.length;
                updateSelection(items);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                updateSelection(items);
            } else if (e.key === "Enter" && selectedIndex >= 0) {
                e.preventDefault();
                items[selectedIndex].querySelector("a").click();
            }
        });

        function updateSelection(items) {
            items.forEach((item, index) => {
                if (index === selectedIndex) {
                    item.classList.add("selected");
                    item.scrollIntoView({ block: "nearest" });
                } else {
                    item.classList.remove("selected");
                }
            });
        }

        async function performSearch(rawQuery) {
            modalResults.innerHTML = '<div class="custom-modal-state">Searching...</div>';

            try {
                const { project, version } = getRTDMetadata();

                const cleanQuery = rawQuery.replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
                const sanitized = cleanQuery.replace(/[()[\]{}:*?~^"\\\/]/g, ' ').replace(/\s+/g, ' ').trim();
                const queryWords = sanitized.split(" ").filter(Boolean);

                if (queryWords.length === 0) {
                    modalResults.innerHTML = '<div class="custom-modal-state">No results found</div>';
                    return;
                }

                let primaryQ = queryWords.length === 1 ? `${sanitized}*` : `"${sanitized}"`;
                let scopedQuery = project
                    ? (version ? `project:${project}/${version} ${primaryQ}` : `project:${project} ${primaryQ}`)
                    : primaryQ;

                let apiUrl = `/_/api/v3/search/?q=${encodeURIComponent(scopedQuery)}`;
                let response = await fetch(apiUrl);
                let data = null;

                if (response.ok) {
                    data = await response.json();
                }

                if ((!data || !data.results || data.results.length === 0) && queryWords.length > 1) {
                    const andQuery = queryWords.join(" AND ");
                    const scopedAndQ = project
                        ? (version ? `project:${project}/${version} ${andQuery}` : `project:${project} ${andQuery}`)
                        : andQuery;

                    const andResp = await fetch(`/_/api/v3/search/?q=${encodeURIComponent(scopedAndQ)}`);
                    if (andResp.ok) {
                        data = await andResp.json();
                    }
                }

                let results = data && data.results ? data.results : [];
                let filteredResults = [];
                const queryNorm = normalizeForComparison(sanitized);

                results.forEach(res => {
                    let matchingBlocks = [];
                    if (res.blocks && res.blocks.length > 0) {
                        res.blocks.forEach(block => {
                            const snippetText = block.highlights && block.highlights.content ? block.highlights.content.join(" ") : "";
                            const combinedText = `${block.title || ''} ${block.content || ''} ${snippetText}`;
                            const normCombined = normalizeForComparison(combinedText);

                            if (normCombined.includes(queryNorm)) {
                                matchingBlocks.push(block);
                            }
                        });
                    }

                    const pageSnippet = res.highlights && res.highlights.content ? res.highlights.content.join(" ") : "";
                    const combinedPageText = `${res.title || ''} ${pageSnippet}`;
                    const normPage = normalizeForComparison(combinedPageText);

                    if (matchingBlocks.length > 0) {
                        filteredResults.push({
                            ...res,
                            blocks: matchingBlocks
                        });
                    } else if (normPage.includes(queryNorm)) {
                        filteredResults.push({
                            ...res,
                            blocks: []
                        });
                    }
                });

                renderResults(filteredResults, cleanQuery);
            } catch (err) {
                console.error("Custom Search Error:", err);
                const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname) || window.location.protocol === "file:";

                if (isLocal) {
                    modalResults.innerHTML = `
                        <div class="custom-modal-state">
                            Read the Docs API search is unavailable in local previews.<br>
                            <a href="${window.location.origin}/search.html?q=${encodeURIComponent(rawQuery)}" style="color: #2563eb; text-decoration: underline; margin-top: 8px; display: inline-block;">
                                Open standard local search page &rarr;
                            </a>
                        </div>
                    `;
                } else {
                    modalResults.innerHTML = `<div class="custom-modal-state">Error fetching search results (${err.message}).</div>`;
                }
            }
        }

        function renderResults(results, query) {
            if (!results || results.length === 0) {
                modalResults.innerHTML = '<div class="custom-modal-state">No results found</div>';
                return;
            }

            let items = [];

            results.forEach(res => {
                const pageTitle = res.title || "Untitled";
                let basePath = res.path || "";

                if (res.blocks && res.blocks.length > 0) {
                    res.blocks.forEach(block => {
                        let blockTitle = block.title || pageTitle;
                        let anchor = block.id ? `#${block.id}` : "";
                        let separator = basePath.includes("?") ? "&" : "?";
                        let fullUrl = `${basePath}${separator}highlight=${encodeURIComponent(query)}${anchor}`;

                        let snippet = "";
                        if (block.highlights) {
                            if (block.highlights.content && block.highlights.content.length > 0) {
                                snippet = block.highlights.content.join(" ... ");
                            } else if (block.highlights.title && block.highlights.title.length > 0) {
                                snippet = block.highlights.title.join(" ... ");
                            }
                        }
                        if (!snippet && block.content) {
                            snippet = block.content.substring(0, 150) + "...";
                        }

                        items.push({
                            title: blockTitle !== pageTitle ? `${pageTitle} › ${blockTitle}` : pageTitle,
                            url: fullUrl,
                            snippet: snippet
                        });
                    });
                } else {
                    let separator = basePath.includes("?") ? "&" : "?";
                    let fullUrl = `${basePath}${separator}highlight=${encodeURIComponent(query)}`;

                    let snippet = "";
                    if (res.highlights) {
                        if (res.highlights.content && res.highlights.content.length > 0) {
                            snippet = res.highlights.content.join(" ... ");
                        } else if (res.highlights.title && res.highlights.title.length > 0) {
                            snippet = res.highlights.title.join(" ... ");
                        }
                    }

                    items.push({
                        title: pageTitle,
                        url: fullUrl,
                        snippet: snippet
                    });
                }
            });

            let html = '<ul class="custom-search-list">';
            items.slice(0, 15).forEach(item => {
                html += `
                    <li class="custom-search-item">
                        <a href="${item.url}">
                            <div class="custom-search-title">${item.title}</div>
                            ${item.snippet ? `<div class="custom-search-snippet">${item.snippet}</div>` : ""}
                        </a>
                    </li>
                `;
            });
            html += '</ul>';
            modalResults.innerHTML = html;

            modalResults.querySelectorAll("a").forEach(link => {
                link.addEventListener("click", function (e) {
                    const targetUrl = new URL(link.href, window.location.origin);
                    if (targetUrl.pathname === window.location.pathname) {
                        e.preventDefault();
                        closeModal();
                        window.history.pushState(null, "", link.href);

                        const searchParams = new URLSearchParams(targetUrl.search);
                        const queryParam = searchParams.get("highlight") || query;
                        const hashId = targetUrl.hash ? decodeURIComponent(targetUrl.hash.substring(1)) : "";

                        highlightAndExpand(queryParam, hashId);
                    }
                });
            });
        }
    }

    initCustomSearchModal();

    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get("highlight");
    const hashId = window.location.hash ? decodeURIComponent(window.location.hash.substring(1)) : "";

    if (queryParam || hashId) {
        let attempts = 0;
        const interval = setInterval(() => {
            attempts++;
            removeAllHighlightsAndNormalize();
            const found = highlightAndExpand(queryParam, hashId);
            if (found || attempts >= 10) {
                clearInterval(interval);
            }
        }, 150);
    }
});