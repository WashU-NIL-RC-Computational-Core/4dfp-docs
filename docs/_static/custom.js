document.addEventListener("DOMContentLoaded", function () {
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
        let current = element.parentElement;

        while (current && current !== document.body) {
            if (current.tagName.toLowerCase() === "details") {
                current.open = true;
            } else if (current.classList.contains("sd-dropdown")) {
                const details = current.closest("details");
                if (details) details.open = true;
            }

            if (current.classList.contains("sd-tab-content")) {
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

            current = current.parentElement;
        }
    }

    // -------------------------------------------------------------
    // Custom Search Modal Implementation
    // -------------------------------------------------------------
    function initCustomSearchModal() {
        // Inject Modal HTML into body
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

        // Intercept sidebar search box clicks/focus
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

        // Global hotkey: Cmd+K or Ctrl+K
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

        // Search Input Event
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

        // Keyboard Navigation (Up, Down, Enter)
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
                let project = "";
                let version = "";

                if (window.READTHEDOCS_DATA) {
                    project = window.READTHEDOCS_DATA.project || "";
                    version = window.READTHEDOCS_DATA.version || "";
                }

                // Format query using API v3 search syntax: "project:slug/version search_terms"
                let searchQ = query;
                if (project && version) {
                    searchQ = `project:${project}/${version} ${query}`;
                } else if (project) {
                    searchQ = `project:${project} ${query}`;
                }

                let apiUrl = `/_/api/v3/search/?q=${encodeURIComponent(searchQ)}`;
                let response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                let data = await response.json();

                // Fallback 1: Try without specific version slug if 0 results returned
                if ((!data.results || data.results.length === 0) && project && version) {
                    const fallbackQ = `project:${project} ${query}`;
                    const fallbackResp = await fetch(`/_/api/v3/search/?q=${encodeURIComponent(fallbackQ)}`);
                    if (fallbackResp.ok) {
                        data = await fallbackResp.json();
                    }
                }

                // Fallback 2: Try un-scoped raw query if project index is still empty
                if ((!data.results || data.results.length === 0) && project) {
                    const rawResp = await fetch(`/_/api/v3/search/?q=${encodeURIComponent(query)}`);
                    if (rawResp.ok) {
                        data = await rawResp.json();
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

            let html = '<ul class="custom-search-list">';
            results.slice(0, 10).forEach(res => {
                const pageTitle = res.title || "Untitled";
                let pageUrl = res.path || "";

                if (res.domain && res.path) {
                    pageUrl = `https://${res.domain}${res.path}`;
                }

                // Append highlight parameter for Sphinx target highlighting
                if (pageUrl && !pageUrl.includes("highlight=")) {
                    const parts = pageUrl.split("#");
                    const separator = parts[0].includes("?") ? "&" : "?";
                    pageUrl = `${parts[0]}${separator}highlight=${encodeURIComponent(query)}${parts[1] ? "#" + parts[1] : ""}`;
                }

                let snippet = "";

                // Extract snippet from blocks or top-level highlights in API v3 structure
                if (res.blocks && res.blocks.length > 0) {
                    for (const block of res.blocks) {
                        if (block.highlights && block.highlights.content && block.highlights.content.length > 0) {
                            snippet = block.highlights.content.join(" ... ");
                            break;
                        } else if (block.highlights && block.highlights.title && block.highlights.title.length > 0) {
                            snippet = block.highlights.title.join(" ... ");
                            break;
                        } else if (block.content) {
                            snippet = block.content.substring(0, 150) + "...";
                            break;
                        }
                    }
                }

                if (!snippet && res.highlights) {
                    if (res.highlights.content && res.highlights.content.length > 0) {
                        snippet = res.highlights.content.join(" ... ");
                    } else if (res.highlights.title && res.highlights.title.length > 0) {
                        snippet = res.highlights.title.join(" ... ");
                    }
                }

                html += `
                    <li class="custom-search-item">
                        <a href="${pageUrl}">
                            <div class="custom-search-title">${pageTitle}</div>
                            ${snippet ? `<div class="custom-search-snippet">${snippet}</div>` : ""}
                        </a>
                    </li>
                `;
            });
            html += '</ul>';
            modalResults.innerHTML = html;

            // Handle same-page fragment clicks and parent unfolding
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

    // Initialize custom search modal
    initCustomSearchModal();

    // On-load section expander and scroller
    setTimeout(function () {
        let targetElement = null;

        const highlightedSpans = document.querySelectorAll("span.highlighted");
        if (highlightedSpans.length > 0) {
            targetElement = highlightedSpans[0];
        }

        if (!targetElement && window.location.hash) {
            const hashId = window.location.hash.substring(1);
            targetElement = document.getElementById(hashId) || document.getElementsByName(hashId)[0];
        }

        if (targetElement) {
            expandParents(targetElement);

            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 150);
        }
    }, 300);
});