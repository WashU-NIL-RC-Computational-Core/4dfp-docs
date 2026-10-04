document.addEventListener("DOMContentLoaded", function () {
    const highlightStyle = document.createElement('style');
    highlightStyle.textContent = `
        mark.custom-highlight, span.highlighted {
            background-color: #F1B434 !important;
            color: #000000 !important;
            padding: 2px 4px !important;
            border-radius: 3px !important;
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(highlightStyle);

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

    function expandParents(element) {
        if (!element) return;
        let current = element.parentElement;

        while (current && current !== document.body) {
            if (current.tagName && current.tagName.toLowerCase() === "details") {
                current.open = true;
                current.setAttribute("open", "");
            } else if (current.classList && current.classList.contains("sd-dropdown")) {
                const details = current.tagName && current.tagName.toLowerCase() === "details" ? current : current.closest("details");
                if (details) {
                    details.open = true;
                    details.setAttribute("open", "");
                }
            }

            if (current.classList && current.classList.contains("sd-tab-content")) {
                const tabSet = current.closest(".sd-tab-set");
                if (tabSet) {
                    const contents = Array.from(tabSet.children).filter(c =>
                        c.classList.contains("sd-tab-content")
                    );
                    const targetIndex = contents.indexOf(current);

                    const inputs = Array.from(tabSet.children).filter(c =>
                        c.tagName && c.tagName.toLowerCase() === "input"
                    );
                    const labels = Array.from(tabSet.children).filter(c =>
                        c.classList.contains("sd-tab-label")
                    );

                    if (inputs[targetIndex]) {
                        inputs[targetIndex].checked = true;
                        inputs[targetIndex].dispatchEvent(new Event("change", { bubbles: true }));
                    }
                    if (labels[targetIndex]) {
                        labels[targetIndex].click();
                    }
                }
            }

            if (current.classList && (current.classList.contains("togglebutton") || current.classList.contains("toggle-details") || current.classList.contains("admonition-toggle"))) {
                if (current.tagName && current.tagName.toLowerCase() === "details") {
                    current.open = true;
                } else {
                    const toggleBtn = current.querySelector(".toggle-button, .toggle-details-toggle");
                    if (toggleBtn && (current.classList.contains("admonition-hidden") || current.classList.contains("toggle-hidden"))) {
                        toggleBtn.click();
                    }
                }
            }

            current = current.parentElement;
        }
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function findAndHighlightText(searchTerm, scopeElement = document.body) {
        if (!searchTerm || searchTerm.length < 2) return null;

        document.querySelectorAll("mark.custom-highlight").forEach(mark => {
            const parent = mark.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(mark.textContent), mark);
                parent.normalize();
            }
        });

        const searchRegex = new RegExp(`(${escapeRegExp(searchTerm)})`, "gi");
        const mainContent = scopeElement.querySelector(".rst-content, main, [role='main']") || scopeElement;

        const walker = document.createTreeWalker(
            mainContent,
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
                    if (searchRegex.test(node.nodeValue)) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_SKIP;
                }
            }
        );

        const matchingNodes = [];
        while (walker.nextNode()) {
            matchingNodes.push(walker.currentNode);
        }

        if (matchingNodes.length === 0) return null;

        const firstNode = matchingNodes[0];
        const match = searchRegex.exec(firstNode.nodeValue);

        if (match) {
            const mark = document.createElement("mark");
            mark.className = "custom-highlight span.highlighted";

            const highlightedText = firstNode.splitText(match.index);
            highlightedText.splitText(match[0].length);

            mark.textContent = highlightedText.nodeValue;
            highlightedText.parentNode.replaceChild(mark, highlightedText);

            return mark;
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

    function formatWildcardQuery(query) {
        if (!query) return "";
        return query.trim().split(/\s+/).map(word => {
            if (word.includes("*") || word.includes("?") || word.startsWith('"') || word.length < 2) {
                return word;
            }
            return `${word}*`;
        }).join(" ");
    }

    function highlightAndExpand(query, hashId) {
        let targetElement = null;

        const existingHighlights = document.querySelectorAll("span.highlighted, mark.custom-highlight");
        if (existingHighlights.length > 0) {
            targetElement = existingHighlights[0];
        }

        if (!targetElement && query && query.trim().length > 0) {
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

        async function performSearch(query) {
            modalResults.innerHTML = '<div class="custom-modal-state">Searching...</div>';

            try {
                const { project, version } = getRTDMetadata();
                const wildcardQ = formatWildcardQuery(query);

                let scopedQuery = project
                    ? (version ? `project:${project}/${version} ${wildcardQ}` : `project:${project} ${wildcardQ}`)
                    : wildcardQ;

                let apiUrl = `/_/api/v3/search/?q=${encodeURIComponent(scopedQuery)}`;
                let response = await fetch(apiUrl);
                let data = null;

                if (response.ok) {
                    data = await response.json();
                }

                if (!data || !data.results || data.results.length === 0) {
                    const exactQ = project
                        ? (version ? `project:${project}/${version} ${query}` : `project:${project} ${query}`)
                        : query;
                    const exactResp = await fetch(`/_/api/v3/search/?q=${encodeURIComponent(exactQ)}`);
                    if (exactResp.ok) {
                        data = await exactResp.json();
                    }
                }

                if ((!data || !data.results || data.results.length === 0) && project && version) {
                    const fallbackParams = new URLSearchParams({ q: `project:${project} ${wildcardQ}` });
                    const fallbackResp = await fetch(`/_/api/v3/search/?${fallbackParams.toString()}`);
                    if (fallbackResp.ok) {
                        data = await fallbackResp.json();
                    }
                }

                renderResults(data && data.results ? data.results : [], query);
            } catch (err) {
                console.error("Custom Search Error:", err);
                const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname) || window.location.protocol === "file:";

                if (isLocal) {
                    modalResults.innerHTML = `
                        <div class="custom-modal-state">
                            Read the Docs API search is unavailable in local previews.<br>
                            <a href="${window.location.origin}/search.html?q=${encodeURIComponent(query)}" style="color: #2563eb; text-decoration: underline; margin-top: 8px; display: inline-block;">
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
            const found = highlightAndExpand(queryParam, hashId);
            if (found || attempts >= 10) {
                clearInterval(interval);
            }
        }, 150);
    }
});