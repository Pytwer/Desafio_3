document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('nav ul').classList.toggle('active');
    this.classList.toggle('active');
});
const faScript = document.createElement('script');
faScript.src = 'https://kit.fontawesome.com/a076d05399.js';
faScript.crossOrigin = 'anonymous';
document.head.appendChild(faScript);
function supportsVideo() {
    return !!document.createElement('video').canPlayType;
}
document.addEventListener('DOMContentLoaded', function() {
    if (!supportsVideo()) {
        var heroSection = document.querySelector('.hero');
        var isMobile = window.matchMedia("(max-width: 768px)").matches;     
        if (isMobile) {
            heroSection.style.backgroundImage = "url('/img/bannermobile.png')";
        } else {
            heroSection.style.backgroundImage = "url('/img/banner.png')";
        }
        heroSection.style.backgroundSize = "cover";
        heroSection.style.backgroundPosition = "center";
        heroSection.style.backgroundRepeat = "no-repeat";
        var videos = document.querySelectorAll('.hero-video');
        videos.forEach(function(video) {
            video.remove();
        });
    }
});