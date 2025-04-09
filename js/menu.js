document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    function checkMobile() {
        if (window.innerWidth <= 992) {
            menuToggle.style.display = 'block';
        } else {
            menuToggle.style.display = 'none';
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }
    }
    checkMobile();
    window.addEventListener('resize', checkMobile);
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    });
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const userCpfElement = document.querySelector('.user-info h3');
    const loggedUserCpf = sessionStorage.getItem('loggedUserCpf');
    if (loggedUserCpf) {
        userCpfElement.textContent = loggedUserCpf;
    } else {
        window.location.href = '/index.html';
    }
    userCpfElement.insertAdjacentElement('afterend', logoutButton);
});