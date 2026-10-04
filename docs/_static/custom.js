function initCustomDocScripts() {
    // -------------------------------------------------------------
    // 1. Prevent default hover behaviors on cards
    // -------------------------------------------------------------
    const cardLinks = document.querySelectorAll('.nav-card a, .sd-card a, a.sd-card-link');
    cardLinks.forEach(link => {
        ['mouseenter', 'mouseover', 'pointerenter'].forEach(eventType => {
            link.addEventListener(eventType, function (e) {
                e.stopPropagation();
            }, true);
        });
    });

    // -------------------------------------------------------------
    // 2. Track search query in sessionStorage
    // -------------------------------------------------------------
    document.addEventListener("input", function (e) {
        if (e.target && (e.target.matches("readthedocs-search input") || e.target.closest("readthedocs-search"))) {
            const query = e.target.value.trim();
            if (query.length > 1) {
                sessionStorage.setItem("rtd_search_query", query);
            }
        }
    }, true);

    document.addEventListener("click", function (e) {
        const link = e.target.closest("readthedocs-search a, [data-search-result] a, .rst-content a");
        if (link) {
            const searchInput = document.querySelector("readthedocs-search input");
            if (searchInput && searchInput.value) {
                sessionStorage.setItem("rtd_search_query", searchInput.value.trim());
            }
        }
    }, true);

    // -------------------------------------------------------------
    // 3. Breadcrumb / Page Title Navigation Bar Enhancement
    // -------------------------------------------------------------
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
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    }

    // -------------------------------------------------------------
    // 4. Search Highlight & Expand Target Components
    // -------------------------------------------------------------
    handleSearchTargetHighlighting();
}

/**
 * Searches for the user query or URL anchor in the main content,
 * expands parent details/dropdowns and tab sets, scrolls into view, and highlights.
 */
function handleSearchTargetHighlighting() {
    // Check sessionStorage or URL parameters (?highlight= or ?q=)
    const urlParams = new URLSearchParams(window.location.search);
    const query = sessionStorage.getItem("rtd_search_query") || urlParams.get("highlight") || urlParams.get("q");

    // Consume stored search query after retrieval
    sessionStorage.removeItem("rtd_search_query");

    if (!query || query.trim().length < 2) return;

    const queryLower = query.trim().toLowerCase();
    const contentArea = document.querySelector(".rst-content, main, [role='main']");
    if (!contentArea) return;

    // Find target element by URL anchor hash or matching text node content
    let targetElement = null;

    if (window.location.hash) {
        targetElement = document.querySelector(window.location.hash);
    }

    if (!targetElement) {
        const walker = document.createTreeWalker(
            contentArea,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (node) {
                    const parent = node.parentElement;
                    if (!parent) return NodeFilter.FILTER_REJECT;
                    const tag = parent.tagName.toLowerCase();
                    if (['script', 'style', 'noscript', 'textarea'].includes(tag)) return NodeFilter.FILTER_REJECT;
                    return node.textContent.toLowerCase().includes(queryLower)
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_SKIP;
                }
            }
        );

        const matchNode = walker.nextNode();
        if (matchNode) {
            targetElement = matchNode.parentElement;
        }
    }

    if (!targetElement) return;

    // Step A: Expand all parent dropdowns (<details>) and tabs (.sd-tab-set)
    expandParents(targetElement);

    // Step B: Scroll target into view and apply highlight effect
    setTimeout(() => {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });

        // Highlight code block parent or inline container if applicable
        const highlightContainer = targetElement.closest(".highlight, .sd-card, code, p, tr") || targetElement;
        highlightContainer.classList.add("rtd-search-target-highlight");

        setTimeout(() => {
            highlightContainer.classList.remove("rtd-search-target-highlight");
        }, 3500);
    }, 200);
}

/**
 * Recursively opens parent dropdowns (<details>) and activates parent tabs (.sd-tab-content)
 * from top (outermost) to bottom (innermost).
 */
function expandParents(el) {
    const tabLabelsToClick = [];
    let current = el;

    while (current && current !== document.body) {
        // Handle Sphinx-Design Dropdowns (.. dropdown::)
        if (current.tagName === 'DETAILS') {
            current.open = true;
        }

        // Handle Sphinx-Design Tabs (.. tab-set:: / .. tab-item::)
        if (current.classList && current.classList.contains('sd-tab-content')) {
            const tabSet = current.closest('.sd-tab-set');
            if (tabSet) {
                const contents = Array.from(tabSet.querySelectorAll(':scope > .sd-tab-content'));
                const index = contents.indexOf(current);
                const labels = tabSet.querySelectorAll(':scope > .sd-tab-label');

                if (labels[index]) {
                    // Store outermost tabs first
                    tabLabelsToClick.unshift(labels[index]);
                }
            }
        }

        current = current.parentElement;
    }

    // Trigger tab label clicks sequentially from top-level to nested tabs
    tabLabelsToClick.forEach(label => label.click());
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCustomDocScripts);
} else {
    initCustomDocScripts();
}