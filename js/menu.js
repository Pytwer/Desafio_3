document.addEventListener('DOMContentLoaded', function() {
    // Verificação de login
    if (!sessionStorage.getItem('loggedInUser')) {
        window.location.href = "/index.html";
        return; // Importante para não continuar a execução
    }

    // Função para debug
    function debugLog(message) {
        console.log('[DEBUG] ' + message);
    }

    // Configuração dos eventos
    function setupEvents() {
        // Botão de logout
        const logoutLink = document.getElementById('logoutLink');
        if (logoutLink) {
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                debugLog('Logout iniciado');
                sessionStorage.removeItem('loggedInUser');
                window.location.href = "/index.html";
            });
        } 
        const downloadButton = document.getElementById('downloadButton');
        if (downloadButton) {
            downloadButton.addEventListener('click', function(e) {
                e.preventDefault();
                debugLog('Download será implementado');
                // Implementação futura
            });
        }
    }

    // Inicializa os eventos
    setupEvents();
});