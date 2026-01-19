// blog.js - Enhanced Blog JavaScript

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
    
    // Blog posts data with images and tags
    const blogPosts = [
        {
            id: 1,
            title: "Getting Started with Arch Linux",
            excerpt: "A beginner's guide to installing and configuring Arch Linux, the flexible and lightweight distribution loved by enthusiasts.",
            category: "Linux",
            tags: ["linux", "tutorial", "beginners"],
            date: "June 15, 2023",
            readTime: "8 min read",
            image: "assets/blog/arch-linux.jpg",
            link: "blog-posts/post1.html",
            views: 1245,
            featured: true
        },
        {
            id: 2,
            title: "Building Secure File Encryption with Fernet",
            excerpt: "Learn how to implement secure file encryption in Python using the cryptography library's Fernet symmetric encryption.",
            category: "Python",
            tags: ["python", "security", "encryption"],
            date: "May 22, 2023",
            readTime: "12 min read",
            image: "assets/blog/encryption.jpg",
            link: "blog-posts/post2.html",
            views: 892,
            featured: true
        },
        {
            id: 3,
            title: "Flask vs Express: Backend Showdown",
            excerpt: "Comparing two popular backend frameworks - Python's Flask and JavaScript's Express.js for building web applications.",
            category: "Web Development",
            tags: ["web-dev", "backend", "flask", "express"],
            date: "April 10, 2023",
            readTime: "10 min read",
            image: "assets/blog/flask-express.jpg",
            link: "blog-posts/post3.html",
            views: 1543,
            featured: true
        },
        {
            id: 4,
            title: "My First Open Source Contribution",
            excerpt: "Sharing my experience making my first contribution to an open source project and tips for getting started.",
            category: "Open Source",
            tags: ["open-source", "github", "beginners"],
            date: "March 5, 2023",
            readTime: "6 min read",
            image: "assets/blog/open-source.jpg",
            link: "blog-posts/post4.html",
            views: 721,
            featured: false
        },
        {
            id: 5,
            title: "Mastering Git: Beyond the Basics",
            excerpt: "Advanced Git techniques for efficient version control and collaboration in software projects.",
            category: "Tools",
            tags: ["tools", "git", "version-control"],
            date: "February 18, 2023",
            readTime: "15 min read",
            image: "assets/blog/git.jpg",
            link: "#",
            views: 2034,
            featured: false
        },
        {
            id: 6,
            title: "Building RESTful APIs with Flask",
            excerpt: "A comprehensive guide to creating robust and scalable REST APIs using Python's Flask framework.",
            category: "Backend",
            tags: ["backend", "python", "flask", "api"],
            date: "January 30, 2023",
            readTime: "14 min read",
            image: "assets/blog/flask-api.jpg",
            link: "#",
            views: 1789,
            featured: false
        },
        {
            id: 7,
            title: "Linux Terminal Productivity Tips",
            excerpt: "Boost your command line efficiency with these time-saving terminal tricks and shortcuts.",
            category: "Linux",
            tags: ["linux", "productivity", "terminal"],
            date: "December 12, 2022",
            readTime: "9 min read",
            image: "assets/blog/terminal.jpg",
            link: "#",
            views: 1321,
            featured: false
        },
        {
            id: 8,
            title: "Docker for Development Environments",
            excerpt: "How to use Docker to create consistent and isolated development environments for your projects.",
            category: "Tools",
            tags: ["tools", "docker", "devops"],
            date: "November 8, 2022",
            readTime: "11 min read",
            image: "assets/blog/docker.jpg",
            link: "#",
            views: 945,
            featured: false
        },
        {
            id: 9,
            title: "Python Virtual Environments Explained",
            excerpt: "Understanding and using Python virtual environments to manage dependencies and avoid conflicts.",
            category: "Python",
            tags: ["python", "tools", "beginners"],
            date: "October 20, 2022",
            readTime: "7 min read",
            image: "assets/blog/python-venv.jpg",
            link: "#",
            views: 1103,
            featured: false
        },
        {
            id: 10,
            title: "SSH Key Management Best Practices",
            excerpt: "Secure SSH key generation, management, and usage for accessing remote servers safely.",
            category: "Security",
            tags: ["security", "linux", "ssh"],
            date: "September 15, 2022",
            readTime: "8 min read",
            image: "assets/blog/ssh.jpg",
            link: "#",
            views: 834,
            featured: false
        },
        {
            id: 11,
            title: "React Hooks: A Complete Guide",
            excerpt: "Master React Hooks for functional components - useState, useEffect, useContext and custom hooks.",
            category: "Web Development",
            tags: ["web-dev", "react", "javascript"],
            date: "August 5, 2022",
            readTime: "13 min read",
            image: "assets/blog/react-hooks.jpg",
            link: "#",
            views: 1890,
            featured: false
        },
        {
            id: 12,
            title: "Bash Scripting for Automation",
            excerpt: "Learn Bash scripting fundamentals to automate repetitive tasks and system administration.",
            category: "Linux",
            tags: ["linux", "bash", "automation", "scripting"],
            date: "July 18, 2022",
            readTime: "10 min read",
            image: "assets/blog/bash.jpg",
            link: "#",
            views: 1276,
            featured: false
        }
    ];
    
    // DOM Elements
    const blogPostsContainer = document.getElementById('blogPostsContainer');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    const blogSearch = document.getElementById('blogSearch');
    const clearSearch = document.getElementById('clearSearch');
    const sortSelect = document.getElementById('sortSelect');
    const tagFilter = document.getElementById('tagFilter');
    const resultsCount = document.getElementById('resultsCount');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const tagButtons = document.querySelectorAll('.tag-btn');
    
    // State variables
    let displayedPosts = 6;
    let currentFilterTag = 'all';
    let currentSearchTerm = '';
    let currentSort = 'newest';
    
    // Initialize blog posts
    renderBlogPosts();
    updateResultsCount();
    
    // Search functionality
    blogSearch.addEventListener('input', function() {
        currentSearchTerm = this.value.toLowerCase();
        if (currentSearchTerm) {
            clearSearch.style.display = 'block';
        } else {
            clearSearch.style.display = 'none';
        }
        filterAndSortPosts();
    });
    
    clearSearch.addEventListener('click', function() {
        blogSearch.value = '';
        currentSearchTerm = '';
        clearSearch.style.display = 'none';
        filterAndSortPosts();
    });
    
    // Sort functionality
    sortSelect.addEventListener('change', function() {
        currentSort = this.value;
        filterAndSortPosts();
    });
    
    // Tag filter functionality
    tagButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active state
            tagButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update filter
            currentFilterTag = this.getAttribute('data-tag');
            filterAndSortPosts();
        });
    });
    
    // Load more posts
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            displayedPosts += 3;
            renderBlogPosts();
            updateResultsCount();
            
            // Hide button if all posts are displayed
            if (displayedPosts >= getFilteredPosts().length) {
                loadMoreContainer.style.display = 'none';
            }
        });
    }
    
    // Filter and sort posts
    function filterAndSortPosts() {
        displayedPosts = 6;
        renderBlogPosts();
        updateResultsCount();
        
        // Show/hide load more button
        if (getFilteredPosts().length > displayedPosts) {
            loadMoreContainer.style.display = 'block';
        } else {
            loadMoreContainer.style.display = 'none';
        }
    }
    
    // Get filtered posts based on search and tag
    function getFilteredPosts() {
        let filtered = [...blogPosts];
        
        // Apply tag filter
        if (currentFilterTag !== 'all') {
            filtered = filtered.filter(post => 
                post.tags.includes(currentFilterTag) || post.category.toLowerCase() === currentFilterTag
            );
        }
        
        // Apply search filter
        if (currentSearchTerm) {
            filtered = filtered.filter(post => 
                post.title.toLowerCase().includes(currentSearchTerm) ||
                post.excerpt.toLowerCase().includes(currentSearchTerm) ||
                post.tags.some(tag => tag.includes(currentSearchTerm))
            );
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            switch(currentSort) {
                case 'newest':
                    return new Date(b.date) - new Date(a.date);
                case 'oldest':
                    return new Date(a.date) - new Date(b.date);
                case 'popular':
                    return b.views - a.views;
                case 'title-asc':
                    return a.title.localeCompare(b.title);
                case 'title-desc':
                    return b.title.localeCompare(a.title);
                default:
                    return new Date(b.date) - new Date(a.date);
            }
        });
        
        return filtered;
    }
    
    // Render blog posts
    function renderBlogPosts() {
        const filteredPosts = getFilteredPosts();
        const postsToShow = filteredPosts.slice(0, displayedPosts);
        
        // Clear container
        blogPostsContainer.innerHTML = '';
        
        // Show no results message if no posts
        if (filteredPosts.length === 0) {
            noResultsMessage.classList.remove('d-none');
            return;
        } else {
            noResultsMessage.classList.add('d-none');
        }
        
        // Render posts
        postsToShow.forEach((post, index) => {
            const postElement = createPostElement(post, index);
            blogPostsContainer.appendChild(postElement);
            
            // Add animation class after a short delay
            setTimeout(() => {
                const card = postElement.querySelector('.blog-post-card');
                if (card) {
                    card.classList.add('animate__fadeInUp');
                }
            }, index * 50);
        });
    }
    
    // Create post element
    function createPostElement(post, index) {
        const postElement = document.createElement('div');
        postElement.className = 'col-lg-4 col-md-6 mb-4';
        postElement.innerHTML = `
            <div class="blog-post-card glass-card" data-delay="${(index % 3) * 100}">
                <img src="${post.image}" alt="${post.title}" class="blog-post-image">
                <div class="blog-post-category">${post.category}</div>
                <h3 class="blog-post-title">${post.title}</h3>
                <p class="blog-post-excerpt">${post.excerpt}</p>
                <div class="blog-post-tags">
                    ${post.tags.map(tag => `<span class="blog-post-tag">${tag}</span>`).join('')}
                </div>
                <div class="blog-post-meta">
                    <span class="blog-post-date"><i class="far fa-calendar"></i> ${post.date}</span>
                    <span class="blog-post-read-time"><i class="far fa-clock"></i> ${post.readTime}</span>
                </div>
                <a href="${post.link}" class="blog-post-link">Read More <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
        return postElement;
    }
    
    // Update results count
    function updateResultsCount() {
        const filteredPosts = getFilteredPosts();
        const totalPosts = filteredPosts.length;
        const showing = Math.min(displayedPosts, totalPosts);
        
        resultsCount.textContent = `Showing ${showing} of ${totalPosts} posts`;
    }
    
    // Animate elements on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate__animated');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                const animationClass = element.getAttribute('data-animation') || 'animate__fadeInUp';
                const delay = element.getAttribute('data-delay') || 0;
                
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
});
