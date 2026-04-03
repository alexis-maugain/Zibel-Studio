gsap.registerPlugin(ScrollTrigger);

// Initial Hero Animation
gsap.from(".gs-hero > *", {
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out",
    delay: 0.2
});

// Fade Up Elements on Scroll
gsap.utils.toArray(".gs-fade").forEach(element => {
    gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// Navbar blur on scroll
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if(window.scrollY > 50) {
        nav.classList.add('bg-deepBlack/50');
    } else {
        nav.classList.remove('bg-deepBlack/50');
    }
});

// Mascot guide animation in Timeline
if(window.innerWidth > 768) {
    gsap.to(".gs-mascot-guide", {
        scrollTrigger: {
            trigger: "#process",
            start: "top center",
            end: "bottom center",
            scrub: 1
        },
        left: "100%",
        ease: "none"
    });
}

// Portfolio Interactions
document.addEventListener('DOMContentLoaded', () => {
    // View All Portfolio
    const viewAllBtn = document.getElementById('view-all-btn');
    const extraProjects = document.querySelectorAll('.portfolio-extra');
    
    if(viewAllBtn) {
        viewAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            extraProjects.forEach(proj => {
                proj.classList.remove('hidden');
                // Optional manual fade for newly revealed items
                gsap.fromTo(proj, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
            });
            viewAllBtn.style.display = 'none';
            ScrollTrigger.refresh();
        });
    }

    // Modal Logic
    const modal = document.getElementById('project-modal');
    const modalContent = document.getElementById('project-modal-content');
    const closeBtn = document.getElementById('close-modal');
    const cards = document.querySelectorAll('.project-card');
    
    if(modal) {
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const title = card.getAttribute('data-title');
                const category = card.getAttribute('data-category');
                const img = card.getAttribute('data-img');
                const desc = card.getAttribute('data-desc');
                
                document.getElementById('modal-title').textContent = title;
                document.getElementById('modal-category').textContent = category;
                document.getElementById('modal-img').src = img;
                document.getElementById('modal-desc').textContent = desc;
                
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                
                // Small delay to allow display:flex to apply before opacity transition
                setTimeout(() => {
                    modal.classList.remove('opacity-0');
                    modalContent.classList.remove('scale-95');
                    modalContent.classList.add('scale-100');
                }, 10);
            });
        });
        
        const closeModal = () => {
            modal.classList.add('opacity-0');
            modalContent.classList.remove('scale-100');
            modalContent.classList.add('scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if(e.target === modal) closeModal();
        });
    }
});