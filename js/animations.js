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