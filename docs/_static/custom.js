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