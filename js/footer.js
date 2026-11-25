// footer.js - Dynamically sets the copyright year in the footer

/**
 * Populates the footer year element with the current four-digit year.
 */
function setFooterYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setFooterYear);
} else {
    setFooterYear();
}
