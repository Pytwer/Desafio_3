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
            
            // Recuperar trilhas como string
            const trilhas = localStorage.getItem('trilhas') || 'Nenhuma trilha selecionada';

            // Recuperar as imagens em base64
            const identityBase64 = localStorage.getItem('identity');
            const residenceBase64 = localStorage.getItem('residenceProof');

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
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 30px;
                        background-color: #f9f9f9;
                    }
                    .container {
                        background-color: white;
                        padding: 30px;
                        border-radius: 8px;
                        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        text-align: center;
                        color: #2c3e50;
                        margin-bottom: 30px;
                        padding-bottom: 15px;
                        border-bottom: 2px solid #3498db;
                    }
                    p {
                        margin: 12px 0;
                        padding: 8px 0;
                        border-bottom: 1px solid #eee;
                    }
                    strong {
                        color: #2c3e50;
                        display: inline-block;
                        width: 200px;
                    }
                    a {
                        color: #3498db;
                        text-decoration: none;
                        font-weight: bold;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                    .footer {
                        margin-top: 30px;
                        text-align: center;
                        font-size: 12px;
                        color: #7f8c8d;
                    }
                    @media print {
                        body {
                            background-color: white;
                            padding: 0;
                        }
                        .container {
                            box-shadow: none;
                            padding: 0;
                        }
                    }
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
                    <p><strong>Documento de Identidade:</strong> <a href="${identityBase64}" download="documento_identidade.png">Baixar Documento</a></p>
                    <p><strong>CEP:</strong> ${cep}</p>
                    <p><strong>Rua:</strong> ${street}</p>
                    <p><strong>Número:</strong> ${number}</p>
                    <p><strong>Cidade:</strong> ${city}</p>
                    <p><strong>Estado:</strong> ${state}</p>
                    <p><strong>Trilhas de Aprendizagem:</strong> ${trilhas}</p>
                    <p><strong>Comprovante de Residência:</strong> <a href="${residenceBase64}" download="comprovante_residencia.png">Baixar Comprovante</a></p>
                </body>
                </html>
            `;

            // Criar um blob com o conteúdo HTML do comprovante
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);

            // Criar um link para download do comprovante
            const link = document.createElement('a');
            link.href = url;
            link.download = 'comprovante_inscricao.html';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url); // Liberar o objeto URL
        });
    } else {
        console.error('Botão de gerar comprovante não encontrado.');
    }
});