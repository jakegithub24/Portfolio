// script.js - Main JavaScript for animations and interactions

document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animate elements on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate__animated');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                const animationClass = element.getAttribute('data-animation') || 'animate__fadeInUp';
                const delay = element.getAttribute('data-delay') || 2;
                
                setTimeout(() => {
                    element.classList.add(animationClass);
                }, delay);
            }
        });
    };
    
    // Initial check for animations
    animateOnScroll();
    
    // Check on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Initialize tooltips if any
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Hero shell animation after container fade-in completes
    initHeroShellAnimation();
});

/**
 * Animates each block in `#heroShell` after the hero container fade-in finishes:
 * 1) comment fades in, 2) command types letter by letter (excluding `$`), 3) output snaps in.
 */
function initHeroShellAnimation() {
    const shell = document.getElementById('heroShell');
    if (!shell) return;

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const children = Array.from(shell.children);
    const blocks = [];
    let currentBlock = null;

    for (const el of children) {
        if (el.classList.contains('comment')) {
            currentBlock = { comment: el, prompt: null, command: null, outputs: [] };
            blocks.push(currentBlock);
        } else if (currentBlock) {
            if (el.classList.contains('prompt')) {
                currentBlock.prompt = el;
            } else if (el.classList.contains('command')) {
                currentBlock.command = el;
                el.dataset.text = el.textContent;
                el.textContent = '';
            } else if (el.classList.contains('output')) {
                currentBlock.outputs.push(el);
            }
        }
    }

    if (blocks.length === 0) return;

    const shellBody = shell.closest('.code-window-body');
    if (shellBody && shellBody.offsetHeight > 0) {
        shellBody.style.minHeight = shellBody.offsetHeight + 'px';
    }
    shell.classList.add('shell-animated');

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const typeCommand = async (commandEl, text) => {
        commandEl.classList.add('is-visible', 'is-typing');
        for (let i = 0; i < text.length; i++) {
            commandEl.textContent += text[i];
            await wait(25);
        }
        commandEl.classList.remove('is-typing');
    };

    const runSequence = async () => {
        for (let i = 0; i < blocks.length; i++) {
            const block = blocks[i];

            block.comment.classList.add('is-visible');
            await wait(160);

            if (block.prompt) {
                block.prompt.classList.add('is-visible');
            }
            if (block.command) {
                await typeCommand(block.command, block.command.dataset.text || '');
                await wait(80);
            }

            block.outputs.forEach((outputEl) => outputEl.classList.add('is-visible'));

            if (i < blocks.length - 1) {
                await wait(140);
            }
        }
    };

    const heroContainer = shell.closest('.hero-image-container');
    let hasStarted = false;
    const startOnce = () => {
        if (hasStarted) return;
        hasStarted = true;
        runSequence();
    };

    if (!heroContainer) {
        startOnce();
        return;
    }

    heroContainer.addEventListener('animationend', (event) => {
        if (event.target === heroContainer) {
            startOnce();
        }
    }, { once: true });

    // Fallback in case the fade-in animation already ended or Animate.css didn't load
    const computed = window.getComputedStyle(heroContainer);
    const durationSec = parseFloat(computed.animationDuration) || 0;
    const fallbackMs = computed.animationName === 'none' || durationSec === 0 ? 50 : Math.ceil(durationSec * 1000) + 150;
    setTimeout(startOnce, fallbackMs);
}
