document.addEventListener('DOMContentLoaded', function() {
    const gerarComprovanteButton = document.getElementById('gerarComprovante');

    // Verifica se o botão de gerar comprovante existe
    if (gerarComprovanteButton) {
        // Gerar arquivo HTML com as informações do formulário
        gerarComprovanteButton.addEventListener('click', function() {
            // Recuperar dados do localStorage
            const name = localStorage.getItem('name');
            const birthdate = localStorage.getItem('birthdate');
            const cpf = localStorage.getItem('cpf');
            const gender = localStorage.getItem('gender');
            const email = localStorage.getItem('email');
            const telephone = localStorage.getItem('telephone');
            const cep = localStorage.getItem('cep');
            const street = localStorage.getItem('street');
            const number = localStorage.getItem('number');
            const city = localStorage.getItem('city');
            const state = localStorage.getItem('state');
            
            // Recuperar trilhas escolhidas
            const chosenTrilhas = JSON.parse(localStorage.getItem('chosenTrilhas')) || [];
            const chosenTrilhasText = chosenTrilhas.length > 0 ? chosenTrilhas.join(', ') : 'Nenhuma trilha selecionada';

            // Recuperar os PDFs em JSON
            const pdfsData = JSON.parse(localStorage.getItem('pdfs'));
            const identityPDF = pdfsData ? pdfsData.identity : '';
            const residencePDF = pdfsData ? pdfsData.residence : '';

            // Verificar se os dados estão salvos
            if (!name || !birthdate || !cpf || !gender || !email || !telephone || !cep || !street || !number || !city || !state) {
                alert('Não há dados salvos para gerar o comprovante.');
                return;
            }

            // Criar conteúdo do HTML do comprovante
            const htmlContent = `
                <!DOCTYPE html>
                <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Comprovante de Inscrição</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        h1 { text-align: center; }
                        p { margin: 10px 0; }
                    </style>
                </head>
                <body>
                    <h1>Comprovante de Inscrição</h1>
                    <p><strong>Nome:</strong> ${name}</p>
                    <p><strong>Data de Nascimento:</strong> ${birthdate}</p>
                    <p><strong>CPF:</strong> ${cpf}</p>
                    <p><strong>Sexo:</strong> ${gender}</p>
                    <p><strong>E-mail:</strong> ${email}</p>
                    <p><strong>Telefone:</strong> ${telephone}</p>
                    <p><strong>Documento de Identidade:</strong></p>
                    <a href="${identityPDF}" target="_blank">Visualizar Documento de Identidade</a>
                    <p><strong>CEP:</strong> ${cep}</p>
                    <p><strong>Rua:</strong> ${street}</p>
                    <p><strong>Número:</strong> ${number}</p>
                    <p><strong>Cidade:</strong> ${city}</p>
                    <p><strong>Estado:</strong> ${state}</p>
                    <p><strong>Trilhas de Aprendizagem:</strong> ${chosenTrilhasText}</p>
                    <p><strong>Comprovante de Residência:</strong></p>
                    <a href="${residencePDF}" target="_blank">Visualizar Comprovante de Residência</a>
                </body>
                </html>
            `;

            // Criar um blob com o conteúdo HTML do comprovante
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);

            // Criar um link para download do comprovante
            const link = document.createElement('a');
            link.href = url;
            link.download = 'comprovante_inscricao.html'; // Nome do arquivo a ser baixado
            document.body.appendChild(link);
            link.click(); // Simula o clique no link para iniciar o download
            document.body.removeChild(link); // Remove o link do DOM
            URL.revokeObjectURL(url); // Liberar o objeto URL
        });
    } else {
        console.error('Botão de gerar comprovante não encontrado.');
    }
});
document.getElementById('editButton').addEventListener('click', function() {
    localStorage.clear();
});
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