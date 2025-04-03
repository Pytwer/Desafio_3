// Função para gerar PDF usando a API PDFREST
function generatePDF() {
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

    // Verificar se as informações estão salvas
    if (!name || !birthdate || !cpf || !gender || !email || !telephone || !cep || !street || !number || !city || !state) {
        console.log('Não há informações salvas.');
        alert('Não há informações salvas.');
        return;
    }

    // Exibir informações no console
    console.log('Informações do Formulário:');
    console.log(`Nome: ${name}`);
    console.log(`Data de Nascimento: ${birthdate}`);
    console.log(`CPF: ${cpf}`);
    console.log(`Sexo: ${gender}`);
    console.log(`E-mail: ${email}`);
    console.log(`Telefone: ${telephone}`);
    console.log(`CEP: ${cep}`);
    console.log(`Rua: ${street}`);
    console.log(`Número: ${number}`);
    console.log(`Cidade: ${city}`);
    console.log(`Estado: ${state}`);

    // Criar o conteúdo do PDF
    const pdfContent = `
        <h1>Comprovante de Inscrição</h1>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Data de Nascimento:</strong> ${birthdate}</p>
        <p><strong>CPF:</strong> ${cpf}</p>
        <p><strong>Sexo:</strong> ${gender}</p>
        <p><strong>E-mail:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${telephone}</p>
        <p><strong>CEP:</strong> ${cep}</p>
        <p><strong>Rua:</strong> ${street}</p>
        <p><strong>Número:</strong> ${number}</p>
        <p><strong>Cidade:</strong> ${city}</p>
        <p><strong>Estado:</strong> ${state}</p>
    `;

    // Configurações da requisição para a API PDFREST
    const apiUrl = 'https://api.pdfrest.com/v1/pdf'; // Substitua pela URL correta da API PDFREST
    const apiKey = 'bb501049-7076-4863-986b-03b956a2d2cd'; // Substitua pela sua chave de API

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            content: pdfContent,
            options: {
                format: 'A4',
                orientation: 'portrait'
            }
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.url) {
            // Baixar o PDF
            const link = document.createElement('a');
            link.href = data.url;
            link.download = 'comprovante_inscricao.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert('Erro ao gerar o PDF.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao gerar o PDF.');
    });
}

// Adicionar evento ao botão de comprovante no menu
document.getElementById('comprovanteButton').addEventListener('click', generatePDF);