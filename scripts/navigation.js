// document.addEventListener('DOMContentLoaded', () => {
//             const hamburger = document.querySelector('.hamburger');
//             const nav = document.querySelector('nav');
            
//             hamburger.addEventListener('click', () => {
//                 nav.classList.toggle('open');
//             });

//             // Close menu when clicking outside
//             document.addEventListener('click', (e) => {
//                 if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
//                     nav.classList.remove('open');
//                 }
//             });
//         })

const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');

hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');

if (nav.classList.contains('active')){
    hamburger.textContent = 'x';
    hamburger.setAttribute('aria-label', 'Close navigation');
    hamburger.setAttribute('aria-expanded', 'true');
}else {
    hamburger.textContent = '☰';
    hamburger.setAttribute('aria-label', 'Toggle navigation');
    hamburger.setAttribute('aria-expanded', 'false');
}

});

const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.textContent = '☰';
        hamburger.setAttribute('aria-label', 'Toggle navigation');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)){
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.textContent = '☰';
        hamburger.setAttribute('aria-label', 'Toggle navigation');
        hamburger.setAttribute('aria-expanded', 'false');
    }
})