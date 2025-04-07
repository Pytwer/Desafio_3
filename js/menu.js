document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    
    // Verifica se está em mobile
    function checkMobile() {
        if (window.innerWidth <= 992) {
            menuToggle.style.display = 'block';
        } else {
            menuToggle.style.display = 'none';
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }
    }
    
    // Verifica no carregamento
    checkMobile();
    
    // Verifica no redimensionamento da tela
    window.addEventListener('resize', checkMobile);
    
    // Evento de clique no botão do menu
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    });
    
    // Fechar menu ao clicar no overlay
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // Elemento onde o CPF será exibido
    const userCpfElement = document.querySelector('.user-info h3');
    
    // Recuperar o CPF do usuário logado
    const loggedUserCpf = sessionStorage.getItem('loggedUserCpf');
    
    // Se existir um CPF armazenado, atualiza o elemento
    if (loggedUserCpf) {
        userCpfElement.textContent = loggedUserCpf;
    } else {
        // Se não houver CPF armazenado, redireciona para o login
        window.location.href = '/index.html';
    }
    // Adicionar o botão próximo ao CPF
    userCpfElement.insertAdjacentElement('afterend', logoutButton);
});
