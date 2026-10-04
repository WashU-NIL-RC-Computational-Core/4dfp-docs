function initCustomDocScripts() {
    const cardLinks = document.querySelectorAll('.nav-card a, .sd-card a, a.sd-card-link');
    cardLinks.forEach(link => {
        ['mouseenter', 'mouseover', 'pointerenter'].forEach(eventType => {
            link.addEventListener(eventType, function (e) {
                e.stopPropagation();
            }, true);
        });
    });

    document.addEventListener("input", function (e) {
        if (e.target && (e.target.matches("readthedocs-search input") || e.target.closest("readthedocs-search"))) {
            const query = e.target.value.trim();
            if (query.length > 1) {
                sessionStorage.setItem("rtd_search_query", query);
            }
        }
    }, true);

    document.addEventListener("click", function (e) {
        const link = e.target.closest("readthedocs-search a, [data-search-result] a");
        if (link) {
            const searchInput = document.querySelector("readthedocs-search input");
            if (searchInput && searchInput.value) {
                sessionStorage.setItem("rtd_search_query", searchInput.value.trim());
            }
        }
    }, true);

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

    function expandParents(element) {
        if (!element) return;

        let ancestors = [];
        let current = element.parentElement;

        while (current && current !== document.body) {
            if (current.tagName.toLowerCase() === "details" || current.classList.contains("sd-dropdown")) {
                const detailsEl = current.tagName.toLowerCase() === "details" ? current : current.closest("details");
                if (detailsEl) ancestors.push({ type: "details", el: detailsEl });
            } else if (current.classList.contains("sd-tab-content")) {
                ancestors.push({ type: "tab", el: current });
            }
            current = current.parentElement;
        }

        ancestors.reverse();

        const processed = new Set();

        ancestors.forEach(item => {
            if (processed.has(item.el)) return;
            processed.add(item.el);

            if (item.type === "details") {
                item.el.open = true;
                item.el.setAttribute("open", "");
                item.el.dispatchEvent(new Event("toggle", { bubbles: true }));
            } else if (item.type === "tab") {
                const tabContent = item.el;
                const tabSet = tabContent.closest(".sd-tab-set");
                if (tabSet) {
                    // Find index of this tab content within its tab set
                    const allContents = Array.from(tabSet.querySelectorAll(":scope > .sd-tab-content"));
                    let targetIndex = allContents.indexOf(tabContent);

                    if (targetIndex === -1) {
                        const fallbackContents = Array.from(tabSet.children).filter(c => c.classList.contains("sd-tab-content"));
                        targetIndex = fallbackContents.indexOf(tabContent);
                    }

                    if (targetIndex !== -1) {
                        const labels = Array.from(tabSet.querySelectorAll(":scope > label.sd-tab-label, :scope > label"));
                        const inputs = Array.from(tabSet.querySelectorAll(":scope > input"));

                        const label = labels[targetIndex] || tabSet.querySelectorAll("label")[targetIndex];
                        const input = inputs[targetIndex] || tabSet.querySelectorAll("input")[targetIndex];

                        if (input) {
                            input.checked = true;
                            input.dispatchEvent(new Event("change", { bubbles: true }));
                        }
                        if (label) {
                            label.click();
                        } else if (input) {
                            input.click();
                        }
                    }
                }
            }
        });
    }

    function checkForTargetAndExpand() {
        const urlParams = new URLSearchParams(window.location.search);
        let highlightTerm = urlParams.get("highlight");

        if (!highlightTerm) {
            highlightTerm = sessionStorage.getItem("rtd_search_query");
        }

        const hasHash = window.location.hash.length > 1;

        if (!highlightTerm && !hasHash) return;

        let attempts = 0;
        const maxAttempts = 30;

        const pollInterval = setInterval(() => {
            attempts++;
            let targetElement = null;

            targetElement = document.querySelector("span.highlighted, mark.highlighted, mark");

            if (!targetElement && highlightTerm) {
                const cleanTerm = highlightTerm.trim();
                const contentArea = document.querySelector(".rst-content") || document.querySelector("main") || document.body;
                const candidateNodes = contentArea.querySelectorAll("pre, code, span, p, td, div.highlight");

                for (let el of candidateNodes) {
                    if (el.closest(".wy-nav-side") || el.closest("footer")) continue;

                    if (el.textContent.includes(cleanTerm)) {
                        targetElement = el;
                        break;
                    }
                }
            }

            if (!targetElement && hasHash) {
                const hashId = decodeURIComponent(window.location.hash.substring(1));
                targetElement = document.getElementById(hashId) || document.getElementsByName(hashId)[0];
            }

            if (targetElement) {
                clearInterval(pollInterval);
                expandParents(targetElement);

                sessionStorage.removeItem("rtd_search_query");

                setTimeout(() => {
                    targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 250);
            } else if (attempts >= maxAttempts) {
                sessionStorage.removeItem("rtd_search_query");
                clearInterval(pollInterval);
            }
        }, 100);
    }

    checkForTargetAndExpand();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCustomDocScripts);
} else {
    initCustomDocScripts();
}