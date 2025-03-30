document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('nav ul').classList.toggle('active');
    this.classList.toggle('active');
});

// Carrega Font Awesome dinamicamente
const faScript = document.createElement('script');
faScript.src = 'https://kit.fontawesome.com/a076d05399.js';
faScript.crossOrigin = 'anonymous';
document.head.appendChild(faScript);