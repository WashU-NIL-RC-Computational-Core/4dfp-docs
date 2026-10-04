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
    // 2. Track search query (Shadow-DOM aware for RTD Web Components)
    // -------------------------------------------------------------
    document.addEventListener("input", function (e) {
        const path = e.composedPath ? e.composedPath() : [e.target];
        for (let el of path) {
            if (el.tagName === 'INPUT' && (el.type === 'search' || el.type === 'text' || el.placeholder?.toLowerCase().includes('search'))) {
                const query = el.value.trim();
                if (query.length > 1) {
                    sessionStorage.setItem("rtd_search_query", query);
                }
            }
        }
    }, true);

    document.addEventListener("click", function (e) {
        const path = e.composedPath ? e.composedPath() : [e.target];
        for (let el of path) {
            if (el.tagName === 'A' && el.href) {
                const searchInput = findSearchInputInDOM();
                if (searchInput && searchInput.value) {
                    sessionStorage.setItem("rtd_search_query", searchInput.value.trim());
                } else {
                    try {
                        const url = new URL(el.href);
                        const q = url.searchParams.get("highlight") || url.searchParams.get("q");
                        if (q) sessionStorage.setItem("rtd_search_query", q);
                    } catch (err) { }
                }
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
    // 4. Run Search Target Unfold & Highlight Logic
    // -------------------------------------------------------------
    handleSearchTargetHighlighting();
}

/**
 * Searches Shadow DOMs for RTD Search Inputs
 */
function findSearchInputInDOM() {
    let input = document.querySelector("readthedocs-search input, input[type='search']");
    if (input) return input;

    const rtdSearch = document.querySelector("readthedocs-search");
    if (rtdSearch && rtdSearch.shadowRoot) {
        return rtdSearch.shadowRoot.querySelector("input");
    }
    return null;
}

/**
 * Locates text query, expands nested components, and scrolls target into view (no highlight animation)
 */
function handleSearchTargetHighlighting() {
    const urlParams = new URLSearchParams(window.location.search);
    let query = sessionStorage.getItem("rtd_search_query") || urlParams.get("highlight") || urlParams.get("q") || urlParams.get("query");

    // Consume query so normal refreshes don't re-trigger
    sessionStorage.removeItem("rtd_search_query");

    const contentArea = document.querySelector(".rst-content, main, [role='main']");
    if (!contentArea) return;

    let targetElement = null;

    // STEP A: PRIORITIZE TEXT CONTENT MATCH OVER URL HASH
    if (query && query.trim().length > 1) {
        const queryLower = query.trim().toLowerCase();
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

    // STEP B: FALLBACK TO LOCATION HASH ONLY IF NO TEXT MATCH WAS FOUND
    if (!targetElement && window.location.hash) {
        try {
            targetElement = document.querySelector(window.location.hash);
        } catch (e) { }
    }

    if (!targetElement) return;

    // STEP C: EXPAND ALL PARENT DROPDOWNS & NESTED TABS
    expandParents(targetElement);

    setTimeout(() => {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350);
}

function expandParents(el) {
    const tabsToActivate = [];
    let current = el;

    while (current && current !== document.body) {
        if (current.tagName === 'DETAILS') {
            current.open = true;
            current.setAttribute('open', '');
            current.dispatchEvent(new Event('toggle', { bubbles: true }));
        }

        if (current.classList && current.classList.contains('sd-tab-content')) {
            tabsToActivate.unshift(current);
        }

        current = current.parentElement;
    }

    // Activate collected tabs sequentially from top-level to nested
    tabsToActivate.forEach(activateSdTab);
}

/**
 * Activates a specific Sphinx-Design tab content element
 */
function activateSdTab(tabContent) {
    const tabSet = tabContent.closest('.sd-tab-set');
    if (!tabSet) return;

    const contents = Array.from(tabSet.children).filter(c => c.classList.contains('sd-tab-content'));
    const index = contents.indexOf(tabContent);

    if (index !== -1) {
        const inputs = Array.from(tabSet.children).filter(c => c.tagName === 'INPUT' && c.type === 'radio');
        const labels = Array.from(tabSet.children).filter(c => c.classList.contains('sd-tab-label'));

        const targetInput = inputs[index];
        const targetLabel = labels[index];

        if (targetInput) {
            targetInput.checked = true;
            targetInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        if (targetLabel) {
            targetLabel.click();
        }
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCustomDocScripts);
} else {
    initCustomDocScripts();
}