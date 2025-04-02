document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('nav ul').classList.toggle('active');
    this.classList.toggle('active');
});

const faScript = document.createElement('script');
faScript.src = 'https://kit.fontawesome.com/a076d05399.js';
faScript.crossOrigin = 'anonymous';
document.head.appendChild(faScript);


window.addEventListener('DOMContentLoaded', async () => {
    try {
        await initDB();
        
        // Verificar autenticação em páginas protegidas
        const protectedPages = ['/formulario.html', '/perfil.html'];
        if (protectedPages.includes(window.location.pathname)) {
            const user = await auth.checkAuth();
            if (!user) {
                window.location.href = '/index.html';
            }
        }
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// Exportar para usar em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initDB, auth };
}