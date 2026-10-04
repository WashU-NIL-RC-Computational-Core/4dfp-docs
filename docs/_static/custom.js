document.addEventListener("DOMContentLoaded", function () {
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
            } else if (current.classList && current.classList.contains("sd-dropdown")) {
                const details = current.tagName.toLowerCase() === "details" ? current : current.closest("details");
                if (details) details.open = true;
            }

            if (current.classList && current.classList.contains("sd-tab-content")) {
                const tabSet = current.closest(".sd-tab-set");
                if (tabSet) {
                    const contents = Array.from(tabSet.children).filter(c =>
                        c.classList.contains("sd-tab-content")
                    );
                    const targetIndex = contents.indexOf(current);

                    const inputs = Array.from(tabSet.children).filter(c =>
                        c.tagName.toLowerCase() === "input"
                    );

                    if (inputs[targetIndex]) {
                        inputs[targetIndex].checked = true;
                        inputs[targetIndex].dispatchEvent(new Event("change", { bubbles: true }));
                    }
                }
            }

            if (current.classList && (current.classList.contains("togglebutton") || current.classList.contains("toggle-details"))) {
                if (current.tagName.toLowerCase() === "details") {
                    current.open = true;
                } else {
                    const toggleBtn = current.querySelector(".toggle-button");
                    if (toggleBtn && current.classList.contains("admonition-hidden")) {
                        toggleBtn.click();
                    }
                }
            }

            current = current.parentElement;
        }
    }

    // Dynamic metadata extraction with host and meta-tag fallbacks
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

        // Hostname fallback (e.g. "4dfp.readthedocs.io" -> "4dfp")
        if (!project) {
            const hostParts = window.location.hostname.split('.');
            if (hostParts.length >= 3 && hostParts[1] === "readthedocs") {
                project = hostParts[0];
            }
        }

        // URL path fallback (e.g. "/en/latest/index.html" -> "latest")
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

        async function performSearch(query) {
            modalResults.innerHTML = '<div class="custom-modal-state">Searching...</div>';

            try {
                const { project, version } = getRTDMetadata();

                // RTD API v3 syntax: project:<project_slug>/<version_slug> <query>
                let scopedQuery = query;
                if (project) {
                    if (version) {
                        scopedQuery = `project:${project}/${version} ${query}`;
                    } else {
                        scopedQuery = `project:${project} ${query}`;
                    }
                }

                const params = new URLSearchParams({ q: scopedQuery });
                let apiUrl = `/_/api/v3/search/?${params.toString()}`;
                let response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                let data = await response.json();

                // Fallback: If 0 results on branch version, try project-wide search
                if ((!data.results || data.results.length === 0) && project && version) {
                    const fallbackParams = new URLSearchParams({ q: `project:${project} ${query}` });
                    const fallbackResp = await fetch(`/_/api/v3/search/?${fallbackParams.toString()}`);
                    if (fallbackResp.ok) {
                        data = await fallbackResp.json();
                    }
                }

                renderResults(data.results || [], query);
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
                link.addEventListener("click", function () {
                    const targetUrl = new URL(link.href, window.location.origin);
                    if (targetUrl.pathname === window.location.pathname) {
                        closeModal();
                        if (targetUrl.hash) {
                            const hashId = targetUrl.hash.substring(1);
                            const targetElement = document.getElementById(hashId) || document.getElementsByName(hashId)[0];
                            if (targetElement) {
                                expandParents(targetElement);
                                setTimeout(() => {
                                    targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
                                }, 100);
                            }
                        }
                    }
                });
            });
        }
    }

    initCustomSearchModal();

    function handleHighlightAndScroll() {
        function processTarget() {
            let targetElement = document.querySelector("span.highlighted");

            if (!targetElement && window.location.hash) {
                const hashId = decodeURIComponent(window.location.hash.substring(1));
                targetElement = document.getElementById(hashId) || document.getElementsByName(hashId)[0];
            }

            if (targetElement) {
                expandParents(targetElement);
                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 100);
                return true;
            }
            return false;
        }

        if (!processTarget()) {
            let attempts = 0;
            const interval = setInterval(() => {
                attempts++;
                if (processTarget() || attempts > 10) {
                    clearInterval(interval);
                }
            }, 150);
        }
    }

    handleHighlightAndScroll();
});