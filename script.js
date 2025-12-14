// Animate on scroll
// DEFINES: An IntersectionObserver to detect when elements enter the viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        // LOGIC: Checks if the observed element is currently visible
        if (entry.isIntersecting) {
            // CONNECTS: Adds the 'show' class to trigger CSS animations
            entry.target.classList.add('show');
        } else {
            // CONNECTS: Removes the class to reset the animation state
            entry.target.classList.remove('show');
        }
    });
});

// DEFINES: Selects all elements with the class 'hidden' to be animated
const hiddenElements = document.querySelectorAll('.hidden');
// CONNECTS: Attaches the observer to each selected element
hiddenElements.forEach((el) => observer.observe(el));


/* Navigation active state and smooth scrolling */
(function() {
    // DEFINES: Selects all navigation links and content sections
    const navLinks = document.querySelectorAll('.main-nav .nav-link');
    const sections = document.querySelectorAll('main section');

    // Active link highlighting
    // DEFINES: Options for the observer (when to trigger)
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50% 0px', // Adjust this to determine when a section is considered active
        threshold: 0 // As soon as any part of the section is visible
    };

    // DEFINES: Observer to update nav links based on scroll position
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // CONNECTS: Loops through links to update 'active' class
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    // LOGIC: Matches the link href with the section ID
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    // CONNECTS: Observes each section element
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
})();


// Scroll-to-top button
// DEFINES: Selects the scroll-to-top button element
const scrollTopBtn = document.querySelector('.scroll-to-top');
if (scrollTopBtn) {
    // CONNECTS: Adds a scroll event listener to the window
    window.addEventListener('scroll', () => {
        // LOGIC: Shows button if scrolled down more than 300px
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
}

// Typing animation
// CONNECTS: Waits for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // DEFINES: Configuration for the Typed.js library
    const options = {
        strings: [
            'a Cyber Security Student',
            'a Web Developer',
            'an Android Developer',
            'a Tech Enthusiast'
        ],
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 1000,
        loop: true
    };

    // LOGIC: Checks if Typed library is loaded and initializes it
    if (typeof Typed !== 'undefined') {
        new Typed('#typed-text', options);
    } else {
        // FALLBACK: Sets static text if library fails
        const t = document.getElementById('typed-text');
        if (t) t.textContent = options.strings[0];
    }
});

// Guard ScrollReveal usage (optional library)
if (typeof ScrollReveal !== 'undefined') {
    // DEFINES: ScrollReveal instance with default settings
    const scrollReveal = ScrollReveal({
        origin: 'top',
        distance: '30px',
        duration: 700,
        reset: true
    });

    // CONNECTS: Applies reveal animation to elements with '.scroll-reveal'
    scrollReveal.reveal('.scroll-reveal', {
        interval: 100
    });
}

// IntersectionObserver to reveal timeline items (makes Education visible)
(() => {
    // DEFINES: Selects timeline items
    const items = document.querySelectorAll('.timeline-item');
    if (!items || items.length === 0) return;

    // DEFINES: Observer for timeline items
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // CONNECTS: Adds visibility class and stops observing
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    // CONNECTS: Observes each timeline item
    items.forEach(item => observer.observe(item));
})();

/* Code typing animator
   - Finds `pre code.animate-code` blocks, clears their content and types them when scrolled into view.
   - Honor `data-speed` attribute (ms per character). Defaults to 18ms.
   - Respects `prefers-reduced-motion: reduce` by skipping animations.
*/
(function(){
    // LOGIC: Respects user preference for reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // DEFINES: Selects code blocks to animate
    const blocks = document.querySelectorAll('pre code.animate-code');
    if (!blocks || blocks.length === 0) return;

    blocks.forEach(cb => {
        // LOGIC: Stores original text and clears content for typing effect
        const full = cb.textContent.replace(/\n+$/,'');
        cb.dataset.full = full;
        cb.textContent = '';
        const span = document.createElement('span');
        span.className = 'code-typed';
        cb.appendChild(span);
    });

    // DEFINES: Observer to trigger typing when visible
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cb = entry.target;
                // CONNECTS: Starts the typing function
                startTyping(cb);
                obs.unobserve(cb);
            }
        });
    }, { threshold: 0.2 });

    blocks.forEach(b => io.observe(b));

    // DEFINES: Function to type characters one by one
    function startTyping(cb) {
        const span = cb.querySelector('.code-typed');
        if (!span) return;
        const full = cb.dataset.full || '';
        const speed = parseInt(cb.dataset.speed) || 18;
        let i = 0;

        // Type one character at a time
        function step() {
            if (i <= full.length) {
                span.textContent = full.slice(0, i);
                i++;
                setTimeout(step, speed);
            }
        }

        step();
    }
})();

    /*
      Line-by-line animations helper
      - Finds common content containers and applies the `.line-fade` class to their child elements
        and sets incremental `transitionDelay` so each line appears staggered.
      - Uses an IntersectionObserver per container type to add the `.visible` class when scrolled into view.
    */
    (function(){
        // DEFINES: Configuration groups for staggered animations
        const groups = [
            { selector: '.timeline-item .timeline-content', children: ['h3', '.timeline-meta', 'p'] },
            { selector: '.skill-item', children: ['img', 'span'] },
            { selector: '.project-card .card-body', children: ['h3', '.muted', '.project-tags', '.project-links'] },
            { selector: '.about-content', children: ['.lead', '.about-highlights li', '.social-row'] },
            { selector: '.achievement-card', children: ['.achievement-icon', 'h3', 'p'] }
        ];

        groups.forEach(group => {
            // DEFINES: Selects containers based on group selector
            const containers = document.querySelectorAll(group.selector);
            if (!containers || containers.length === 0) return;

            containers.forEach(container => {
                // Apply .line-fade to each specified child selector if present
                const lines = [];
                group.children.forEach(ch => {
                    container.querySelectorAll(ch).forEach(el => lines.push(el));
                });

                // If no explicit children matched, fallback: animate direct children
                const toAnimate = lines.length ? lines : Array.from(container.children);

                toAnimate.forEach((el, i) => {
                    // CONNECTS: Adds class and delay for staggered effect
                    el.classList.add('line-fade');
                    // set progressive delay (80ms steps) for a subtle stagger
                    el.style.transitionDelay = (i * 80) + 'ms';
                });
            });

            // Observe containers and toggle visible class on their child lines
            const io = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const container = entry.target;
                        // CONNECTS: Triggers visibility on children
                        container.querySelectorAll('.line-fade').forEach(el => el.classList.add('visible'));
                        obs.unobserve(container);
                    }
                });
            }, { threshold: 0.12 });

            containers.forEach(c => io.observe(c));
        });
    })();

/* Project modal: open/close and populate details from data attributes */
(function(){
    // DEFINES: Selects the modal and its internal elements
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    const modalTitle = modal.querySelector('#modal-title');
    const modalDesc = modal.querySelector('.modal-desc');
    const modalImage = modal.querySelector('.modal-image');
    const modalTech = modal.querySelector('.modal-tech');
    const modalGit = modal.querySelector('.modal-github');
    const modalDemo = modal.querySelector('.modal-demo');

    // DEFINES: Function to close the modal
    function closeModal() {
        modal.setAttribute('aria-hidden','true');
        document.body.style.overflow = '';
    }

    // DEFINES: Function to populate and open modal based on card data
    function openModalFromCard(card) {
        const title = card.dataset.title || '';
        const desc = card.dataset.description || '';
        const image = card.dataset.image || '';
        const tech = (card.dataset.tech || '').split(',').map(t => t.trim()).filter(Boolean);

        // CONNECTS: Updates modal content
        if (modalTitle) modalTitle.textContent = title;
        if (modalDesc) modalDesc.textContent = desc;
        if (modalImage) { modalImage.src = image; modalImage.alt = title; }
        if (modalTech) {
            modalTech.innerHTML = '';
            tech.forEach(t => {
                const s = document.createElement('span');
                s.className = 'tag';
                s.textContent = t;
                modalTech.appendChild(s);
            });
        }

        // Show modal
        modal.setAttribute('aria-hidden','false');
        document.body.style.overflow = 'hidden';
    }

    // open on View Details button click (event delegation)
    // CONNECTS: Global click listener for view buttons
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action="view"]');
        if (btn) {
            const card = btn.closest('.project-card');
            if (card) openModalFromCard(card);
        }

        // close on overlay or close button
        if (e.target.closest('[data-action="close"]')) {
            closeModal();
        }
    });

    // close on Escape key
    // CONNECTS: Keyboard listener for accessibility
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
            closeModal();
        }
    });

})();

// Initialize Particles.js
if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        "particles": {
            "number": { "value": 40, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#007bff" },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.5, "random": false },
            "size": { "value": 3, "random": true },
            "line_linked": { "enable": true, "distance": 150, "color": "#007bff", "opacity": 0.4, "width": 1 },
            "move": { "enable": true, "speed": 1, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": { "enable": false, "mode": "grab" },
                "onclick": { "enable": true, "mode": "push" },
                "resize": true
            },
            "modes": {
                "grab": { "distance": 140, "line_linked": { "opacity": 1 } },
                "push": { "particles_nb": 4 }
            }
        },
        "retina_detect": false
    });
}

// Cursor Glow & Spark Trail
const cursorGlow = document.querySelector('.cursor-glow');

document.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    }

    const spark = document.createElement('div');
    spark.className = 'cursor-spark';
    spark.style.left = e.clientX + 'px';
    spark.style.top = e.clientY + 'px';
    
    // Random direction for the spark to fly
    const x = (Math.random() - 0.5) * 40;
    const y = (Math.random() - 0.5) * 40;
    spark.style.setProperty('--x', `${x}px`);
    spark.style.setProperty('--y', `${y}px`);
    
    document.body.appendChild(spark);
    
    setTimeout(() => { spark.remove(); }, 500);
});

document.addEventListener('mousedown', () => {
    if (cursorGlow) cursorGlow.classList.add('active');
});

document.addEventListener('mouseup', () => {
    if (cursorGlow) cursorGlow.classList.remove('active');
});

// Contact Form Validation
(function() {
    const contactForm = document.querySelector('#contact form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameInput = contactForm.querySelector('input[name="name"]');
        const emailInput = contactForm.querySelector('input[name="email"]');
        const messageInput = contactForm.querySelector('textarea[name="message"]');
        
        // Basic validation
        if (!nameInput.value.trim()) {
            alert('Please enter your name.');
            nameInput.focus();
            return;
        }

        if (!isValidEmail(emailInput.value)) {
            alert('Please enter a valid email address.');
            emailInput.focus();
            return;
        }

        if (!messageInput.value.trim()) {
            alert('Please enter a message.');
            messageInput.focus();
            return;
        }

        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Send to Formspree
        const formData = new FormData(contactForm);
        
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                alert('Thank you! Your message has been sent successfully.');
                contactForm.reset();
            } else {
                alert('Oops! There was a problem submitting your form.');
            }
        }).catch(error => {
            alert('Oops! There was a problem submitting your form.');
        }).finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    });

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
})();

// Glitch Text Sound Effect
const glitchTitle = document.querySelector('.hero h1');
const glitchSound = document.getElementById('glitch-sound');

if (glitchTitle && glitchSound) {
    glitchSound.volume = 0.2; // Lower volume
    
    glitchTitle.addEventListener('mouseenter', () => {
        glitchSound.currentTime = 0;
        // Play sound (browser may block if no prior user interaction)
        glitchSound.play().catch(e => console.warn("Audio play blocked:", e));
    });
}

// Scroll Progress Bar Logic
window.addEventListener('scroll', () => {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (progressBar) {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navList = document.querySelector('.nav-list');
const navLinksItems = document.querySelectorAll('.nav-link');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navList.classList.toggle('active');
    });

    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navList.classList.remove('active');
        });
    });
}

// Terminal Typing Animation in About Section
(function() {
    const terminal = document.querySelector('.terminal-window');
    if (!terminal) return;

    const cmdSpan = terminal.querySelector('.cmd');
    const argSpan = terminal.querySelector('.arg');
    const outputDiv = terminal.querySelector('.code-output');
    // Select the last line (prompt) to hide it initially
    const lastLine = terminal.querySelector('.terminal-body .code-line:last-child');

    if (!cmdSpan || !argSpan || !outputDiv) return;

    // Store original text
    const cmdText = cmdSpan.textContent;
    const argText = argSpan.textContent;
    const paragraphs = Array.from(outputDiv.querySelectorAll('p')).map(p => p.textContent);

    // Clear initial state
    cmdSpan.textContent = '';
    argSpan.textContent = '';
    outputDiv.innerHTML = ''; // Remove paragraphs
    if (lastLine) lastLine.style.visibility = 'hidden';

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                obs.unobserve(entry.target);
                runAnimation();
            }
        });
    }, { threshold: 0.4 });

    observer.observe(terminal);

    async function runAnimation() {
        // Type command
        await typeText(cmdSpan, cmdText, 50);
        await typeText(argSpan, argText, 50);
        
        // Simulate Enter key pause
        await new Promise(r => setTimeout(r, 300));

        // Type output paragraphs
        for (const text of paragraphs) {
            const p = document.createElement('p');
            outputDiv.appendChild(p);
            await typeText(p, text, 15); // Faster typing for body
        }

        // Show last line
        if (lastLine) lastLine.style.visibility = 'visible';
    }

    function typeText(element, text, speed) {
        return new Promise(resolve => {
            let i = 0;
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            }
            type();
        });
    }
})();

// Project Filtering Logic
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                if (filterValue === 'all' || (categories && categories.includes(filterValue))) {
                    card.classList.remove('hide-project');
                } else {
                    card.classList.add('hide-project');
                }
            });
        });
    });
}

// DEFINES: Initialize Chart.js Radar Chart for Skills
const chartCanvas = document.getElementById('skillsChart');
if (chartCanvas) {
    // Only initialize chart when it scrolls into view
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                new Chart(chartCanvas, {
                    type: 'radar',
                    data: {
                        labels: ['React', 'HTML5', 'CSS3', 'JavaScript', 'Node.js', 'SQL', 'Python', 'Git', 'Linux'],
                        datasets: [{
                            label: 'Skill Level',
                            data: [75, 90, 85, 80, 70, 70, 85, 85, 75], // Values matching your HTML data
                            backgroundColor: 'rgba(0, 123, 255, 0.2)', // Primary color with opacity
                            borderColor: '#007bff',
                            pointBackgroundColor: '#00bfff',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: '#00bfff',
                            borderWidth: 2
                        }]
                    },
                    options: {
                        scales: {
                            r: {
                                angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                                pointLabels: { color: '#fff', font: { size: 12, family: "'Poppins', sans-serif" } },
                                ticks: { display: false, backdropColor: 'transparent', max: 100 }
                            }
                        },
                        plugins: {
                            legend: { display: false }
                        },
                        responsive: true
                    }
                });
                chartObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    chartObserver.observe(chartCanvas.parentElement);
}
