// nav.js - Keeps the active navbar underline synced with scroll position and current page

/**
 * Updates the `.active` class on navbar links based on the current page or scroll position.
 */
function initActiveNavigation() {
    const navLinks = Array.from(document.querySelectorAll('.navbar-nav .nav-link'));
    if (navLinks.length === 0) return;

    const setActiveLink = (activeLink) => {
        navLinks.forEach((link) => {
            link.classList.toggle('active', link === activeLink);
        });
    };

    const pathname = window.location.pathname;
    const isBlogPage = /(^|\/)blog\.html$/i.test(pathname) || /\/blog-posts\//i.test(pathname);
    if (isBlogPage) {
        const blogLink = navLinks.find((link) => {
            const href = link.getAttribute('href') || '';
            return href === 'blog.html' || href.endsWith('/blog.html');
        });
        if (blogLink) {
            setActiveLink(blogLink);
        }
        return;
    }

    const sectionEntries = navLinks
        .map((link) => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#') || href === '#') return null;
            const section = document.querySelector(href);
            return section ? { link, section } : null;
        })
        .filter(Boolean);

    if (sectionEntries.length === 0) return;

    const navbar = document.querySelector('.navbar');

    const updateActiveSection = () => {
        const navbarHeight = navbar ? navbar.offsetHeight : 70;
        const scrollTop = window.scrollY;
        const atBottom = window.innerHeight + scrollTop >= document.documentElement.scrollHeight - 10;

        if (atBottom) {
            setActiveLink(sectionEntries[sectionEntries.length - 1].link);
            return;
        }

        const triggerPosition = scrollTop + navbarHeight + 80;
        let currentEntry = sectionEntries[0];

        for (const entry of sectionEntries) {
            const sectionTop = entry.section.getBoundingClientRect().top + scrollTop;
            if (sectionTop <= triggerPosition) {
                currentEntry = entry;
            }
        }

        setActiveLink(currentEntry.link);
    };

    sectionEntries.forEach(({ link }) => {
        link.addEventListener('click', () => setActiveLink(link));
    });

    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    updateActiveSection();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initActiveNavigation);
} else {
    initActiveNavigation();
}
