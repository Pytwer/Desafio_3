const camposInvalidos = [];
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('inscricaoForm');
    const loadingContainer = document.getElementById('loadingContainer');
    aplicarMascaras();
    configurarValidacoes();
    configurarCheckboxesPersonalizados();
    form.addEventListener('submit', function(e) {
        e.preventDefault(); 
        console.log('Formulário submetido - iniciando validação');
        camposInvalidos.length = 0;
        if (validarFormulario()) {
            console.log('Formulário válido - processando...');
            loadingContainer.style.display = 'flex';
            setTimeout(() => {
                saveToLocalStorage();
                loadingContainer.style.display = 'none';
                window.location.href = '/pgs/menu.html';
            }, 2000);
        } else {
            console.log('Formulário inválido. Erros encontrados:');
            camposInvalidos.forEach(campo => console.log(campo.id || campo.name));
            if (camposInvalidos.length > 0) {
                camposInvalidos[0].scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }
    });
});
function aplicarMascaras() {
    const cpfInput = document.getElementById('cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 11);
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value;
        });
    }
    const telInput = document.querySelector('input[attrname="telephone1"]');
    if (telInput) {
        telInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 11);
            if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            }
            if (value.length > 10) {
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            } else if (value.length > 6) {
                value = value.replace(/(\d{4})(\d)/, '$1-$2');
            }
            e.target.value = value;
        });
    }
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.substring(0, 8);
            if (value.length > 5) {
                value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = value;
        });
    }
}
function configurarValidacoes() {
    const campos = [
        { id: 'name', validator: validarNome },
        { id: 'date', validator: validarDataNascimento },
        { id: 'cpf', validator: validarCPF },
        { id: 'email', validator: validarEmail },
        { element: document.querySelector('input[attrname="telephone1"]'), validator: validarTelefone },
        { id: 'cep', validator: validarCEP },
        { id: 'street', validator: validarRua },
        { id: 'number', validator: validarNumero },
        { id: 'city', validator: validarCidade },
        { id: 'state', validator: validarEstado }
    ];
    campos.forEach(campo => {
        const element = campo.element || document.getElementById(campo.id);
        if (element) {
            element.addEventListener('blur', function() {
                campo.validator(this);
            });
            element.addEventListener('input', function() {
                if (this.classList.contains('input-error')) {
                    const errorElement = this.nextElementSibling;
                    if (errorElement && errorElement.classList.contains('error-message')) {
                        errorElement.style.display = 'none';
                        this.classList.remove('input-error');
                    }
                }
            });
        }
    });
}
function configurarCheckboxesPersonalizados() {
    const customCheckboxes = document.querySelectorAll('.custom-checkbox');
    customCheckboxes.forEach((checkboxContainer) => {
        const checkbox = checkboxContainer.querySelector('input[type="checkbox"]');
        checkboxContainer.addEventListener('click', (event) => {
            if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox') {
                return;
            }
            event.preventDefault();
            if (checkbox.checked) {
                checkbox.checked = false;
                checkboxContainer.classList.remove('selected');
            } else {
                document.querySelectorAll('.custom-checkbox').forEach((option) => {
                    option.classList.remove('selected');
                    option.querySelector('input[type="checkbox"]').checked = false;
                });
                checkbox.checked = true;
                checkboxContainer.classList.add('selected');
            }
            const errorElement = document.getElementById('trilhas-error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        });
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                document.querySelectorAll('.custom-checkbox').forEach((option) => {
                    option.classList.remove('selected');
                    option.querySelector('input[type="checkbox"]').checked = false;
                });
                checkboxContainer.classList.add('selected');
                this.checked = true;
            } else {
                checkboxContainer.classList.remove('selected');
            }
        });
    });
}
function validarFormulario() {
    camposInvalidos.length = 0;
    const validacoes = [
        { nome: 'Nome', valido: validarCampo('name', validarNome) },
        { nome: 'Data Nascimento', valido: validarCampo('date', validarDataNascimento) },
        { nome: 'CPF', valido: validarCampo('cpf', validarCPF) },
        { nome: 'Email', valido: validarCampo('email', validarEmail) },
        { nome: 'Telefone', valido: validarCampo(null, validarTelefone, document.querySelector('input[attrname="telephone1"]')) },
        { nome: 'Documento Identidade', valido: validarDocumento('identity') },
        { nome: 'CEP', valido: validarCampo('cep', validarCEP) },
        { nome: 'Rua', valido: validarCampo('street', validarRua) },
        { nome: 'Número', valido: validarCampo('number', validarNumero) },
        { nome: 'Cidade', valido: validarCampo('city', validarCidade) },
        { nome: 'Estado', valido: validarCampo('state', validarEstado) },
        { nome: 'Comprovante Residência', valido: validarDocumento('residence-proof') },
        { nome: 'Trilhas', valido: validarTrilhas() },
        { nome: 'Termos', valido: validarTermos() }
    ];
    return validacoes.every(v => v.valido);
}
function validarCampo(id, validator, element = null) {
    const input = element || document.getElementById(id);
    if (!input) return false;
    const isValid = validator(input);
    if (!isValid) camposInvalidos.push(input);
    return isValid;
}
function validarNome(input) {
    const value = input.value.trim();
    const errorElement = criarOuObterErrorElement(input);
    if (!value) {
        mostrarErro(input, errorElement, 'O nome completo é obrigatório');
        return false;
    }
    if (value.split(' ').length < 2) {
        mostrarErro(input, errorElement, 'Digite seu nome completo');
        return false;
    }
    removerErro(input, errorElement);
    return true;
}
function validarDataNascimento(input) {
    const value = input.value;
    const errorElement = criarOuObterErrorElement(input);
    if (!value) {
        mostrarErro(input, errorElement, 'A data de nascimento é obrigatória');
        return false;
    }
    const dataNascimento = new Date(value);
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const mes = hoje.getMonth() - dataNascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
    } 
    if (idade < 16) {
        mostrarErro(input, errorElement, 'Você deve ter pelo menos 16 anos');
        return false;
    } 
    removerErro(input, errorElement);
    return true;
}
function validarCPF(input) {
    const value = input.value.replace(/\D/g, '');
    const errorElement = criarOuObterErrorElement(input);
    if (!value) {
        mostrarErro(input, errorElement, 'O CPF é obrigatório');
        return false;
    }
    if (value.length !== 11 || !validarDigitosCPF(value)) {
        mostrarErro(input, errorElement, 'CPF inválido');
        return false;
    }
    removerErro(input, errorElement);
    return true;
}b 
function validarDigitosCPF(cpf) {
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0;
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    let resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    return true;
}
function validarEmail(input) {
    const value = input.value.trim();
    const errorElement = criarOuObterErrorElement(input);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
        mostrarErro(input, errorElement, 'O e-mail é obrigatório');
        return false;
    }
    if (!regex.test(value)) {
        mostrarErro(input, errorElement, 'E-mail inválido');
        return false;
    }
    removerErro(input, errorElement);
    return true;
}
function validarTelefone(input) {
    const value = input.value.replace(/\D/g, '');
    const errorElement = criarOuObterErrorElement(input);
    if (!value) {
        mostrarErro(input, errorElement, 'O telefone é obrigatório');
        return false;
    }
    if (value.length < 10 || value.length > 11) {
        mostrarErro(input, errorElement, 'Telefone inválido');
        return false;
    }
    removerErro(input, errorElement);
    return true;
}
function validarDocumento(id) {
    const input = document.getElementById(id);
    const errorElement = criarOuObterErrorElement(input);
    const imageElement = document.getElementById(`${id}-image`);
    if (!input.files || input.files.length === 0) {
        mostrarErro(input, errorElement, 'O documento é obrigatório');
        if (imageElement) imageElement.style.border = '2px solid #ff4444';
        return false;
    }
    const file = input.files[0];
    if (file.type !== 'application/pdf') {
        mostrarErro(input, errorElement, 'Apenas arquivos PDF são aceitos');
        if (imageElement) imageElement.style.border = '2px solid #ff4444';
        return false;
    }
    removerErro(input, errorElement);
    if (imageElement) {
        imageElement.style.border = '2px solid #4CAF50';
        setTimeout(() => imageElement.style.border = 'none', 2000);
    }
    return true;
}
function validarCEP(input) {
    const value = input.value.replace(/\D/g, '');
    const errorElement = criarOuObterErrorElement(input);
    if (!value) {
        mostrarErro(input, errorElement, 'O CEP é obrigatório');
        return false;
    }
    if (value.length !== 8) {
        mostrarErro(input, errorElement, 'CEP inválido');
        return false;
    }
    removerErro(input, errorElement);
    return true;
}
function validarRua(input) {
    const value = input.value.trim();
    const errorElement = criarOuObterErrorElement(input);
    
    if (!value) {
        mostrarErro(input, errorElement, 'A rua é obrigatória');
        return false;
    }
    
    removerErro(input, errorElement);
    return true;
}
function validarNumero(input) {
    const value = input.value.trim();
    const errorElement = criarOuObterErrorElement(input);
    if (!value) {
        mostrarErro(input, errorElement, 'O número é obrigatório');
        return false;
    }
    if (isNaN(value)) {
        mostrarErro(input, errorElement, 'O número deve conter apenas dígitos');
        return false;
    }
    removerErro(input, errorElement);
    return true;
}
function validarCidade(input) {
    const value = input.value.trim();
    const errorElement = criarOuObterErrorElement(input);
    if (!value) {
        mostrarErro(input, errorElement, 'A cidade é obrigatória');
        return false;
    }
    removerErro(input, errorElement);
    return true;
}
function validarEstado(input) {
    const value = input.value.trim().toUpperCase();
    const errorElement = criarOuObterErrorElement(input);
    const estados = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
    if (!value) {
        mostrarErro(input, errorElement, 'O estado é obrigatório');
        return false;
    }
    if (value.length !== 2 || !estados.includes(value)) {
        mostrarErro(input, errorElement, 'Use a sigla do estado (ex: SP)');
        return false;
    }
    input.value = value;
    removerErro(input, errorElement);
    return true;
}
function validarTrilhas() {
    const trilhasSelecionadas = document.querySelectorAll('.trilhas input[type="checkbox"]:checked');
    const errorElement = document.getElementById('trilhas-error') || criarErrorElementGlobal('trilhas-error', 'Por favor, selecione pelo menos uma trilha');
    if (trilhasSelecionadas.length === 0) {
        const trilhasContainer = document.querySelector('.trilhas');
        if (!document.getElementById('trilhas-error')) {
            trilhasContainer.parentNode.insertBefore(errorElement, trilhasContainer.nextSibling);
        }
        errorElement.style.display = 'block';
        camposInvalidos.push(trilhasContainer);
        return false;
    }
    errorElement.style.display = 'none';
    return true;
}
function validarTermos() {
    const termos = document.querySelectorAll('input[name="terms"]');
    const errorElement = document.getElementById('termos-error') || criarErrorElementGlobal('termos-error', 'Você deve aceitar os termos para continuar');
    const todosAceitos = Array.from(termos).every(termo => termo.checked);
    if (!todosAceitos) {
        const termosContainer = document.querySelector('.terms:last-of-type');
        if (!document.getElementById('termos-error')) {
            termosContainer.parentNode.insertBefore(errorElement, termosContainer.nextSibling);
        }
        errorElement.style.display = 'block';
        camposInvalidos.push(termosContainer);
        return false;
    }
    errorElement.style.display = 'none';
    return true;
}
function criarOuObterErrorElement(input) {
    let errorElement = input.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
    return errorElement;
}
function criarErrorElementGlobal(id, mensagem) {
    const errorElement = document.createElement('div');
    errorElement.id = id;
    errorElement.className = 'error-message global-error';
    errorElement.textContent = mensagem;
    errorElement.style.color = '#ff4444';
    errorElement.style.marginTop = '5px';
    errorElement.style.display = 'none';
    return errorElement;
}
function mostrarErro(input, errorElement, mensagem) {
    input.classList.add('input-error');
    errorElement.textContent = mensagem;
    errorElement.style.display = 'block';
    errorElement.style.color = '#ff4444';
    errorElement.style.fontSize = '0.8rem';
    errorElement.style.marginTop = '5px';
}
function removerErro(input, errorElement) {
    input.classList.remove('input-error');
    errorElement.style.display = 'none';
}
function getFormData() {
    const formData = {
        nome: document.getElementById('name').value,
        dataNascimento: document.getElementById('date').value,
        cpf: document.getElementById('cpf').value,
        sexo: document.getElementById('gender').value,
        email: document.getElementById('email').value,
        telefone: document.querySelector('input[attrname="telephone1"]').value,
        cep: document.getElementById('cep').value,
        rua: document.getElementById('street').value,
        numero: document.getElementById('number').value,
        cidade: document.getElementById('city').value,
        estado: document.getElementById('state').value,
        trilhas: Array.from(document.querySelectorAll('.trilhas input[type="checkbox"]:checked'))
            .map(checkbox => {
                const index = checkbox.id.split('_')[1];
                const labels = [
                    "Programação Front-end",
                    "Programação Back-end",
                    "Programação em Jogos",
                    "Design e Experiência",
                    "Ciência de Dados"
                ];
                return labels[index];
            }),
        termosAceitos: document.querySelectorAll('input[name="terms"]:checked').length === 2
    };
    return formData;
}
function saveToLocalStorage() {
    const formData = getFormData();
    localStorage.setItem('inscricaoTrilhas', JSON.stringify(formData));
    console.log('Dados salvos no localStorage:', formData);
}
function printSavedData() {
    const savedData = localStorage.getItem('inscricaoTrilhas');
    if (!savedData) {
        console.log('Nenhum dado encontrado no localStorage.');
        return;
    }
    const formData = JSON.parse(savedData);
    console.log('=== DADOS SALVOS NO LOCALSTORAGE ===');
    console.log('Informações Pessoais:');
    console.log(`Nome: ${formData.nome}`);
    console.log(`Data de Nascimento: ${formData.dataNascimento}`);
    console.log(`CPF: ${formData.cpf}`);
    console.log(`Sexo: ${formData.sexo}`);
    console.log(`E-mail: ${formData.email}`);
    console.log(`Telefone: ${formData.telefone}`);
    console.log('\nEndereço:');
    console.log(`CEP: ${formData.cep}`);
    console.log(`Rua: ${formData.rua}`);
    console.log(`Número: ${formData.numero}`);
    console.log(`Cidade: ${formData.cidade}`);
    console.log(`Estado: ${formData.estado}`);
    console.log('\nTrilhas Selecionadas:');
    formData.trilhas.forEach((trilha, index) => {
        console.log(`${index + 1}. ${trilha}`);
    });
    console.log(`\nTermos Aceitos: ${formData.termosAceitos ? 'Sim' : 'Não'}`);
    console.log('====================================');
}