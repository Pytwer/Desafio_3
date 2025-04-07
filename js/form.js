document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('inscricaoForm');
    const loadingOverlay = document.getElementById('loadingOverlay');
    aplicarMascaras()
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Evita o envio padrão do formulário
        
        // Mostra o loading
        loadingOverlay.style.display = 'flex';
        
        // Redireciona após 2 segundos
        setTimeout(function() {
            window.location.href = '/pgs/menu.html';
        }, 2000);
    });
});
function aplicarMascaras() {
    // Máscara para CPF
    const cpfInput = document.getElementById('cpf');
    cpfInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
    });
    
    // Máscara para Telefone
    const telInput = document.querySelector('input[attrname="telephone1"]');
    telInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        e.target.value = value;
    });
    
    // Máscara para CEP
    const cepInput = document.getElementById('cep');
    cepInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{5})(\d)/, '$1-$2');
        e.target.value = value;
    });
}

function configurarValidacoes() {
    // Validar quando o campo perde o foco
    const campos = [
        { id: 'name', validator: validarNome },
        { id: 'date', validator: validarDataNascimento },
        { id: 'cpf', validator: validarCPF },
        { id: 'email', validator: validarEmail },
        { id: 'cep', validator: validarCEP },
        { id: 'street', validator: validarRua },
        { id: 'number', validator: validarNumero },
        { id: 'city', validator: validarCidade },
        { id: 'state', validator: validarEstado },
        { id: 'tel', validator: validarTelefone, element: document.querySelector('input[attrname="telephone1"]') }
    ];
    
    campos.forEach(campo => {
        const element = campo.element || document.getElementById(campo.id);
        element.addEventListener('blur', function() {
            campo.validator(this);
        });
    });
}

function validarFormulario() {
    let valido = true;
    
    // Validar campos básicos
    valido = validarNome(document.getElementById('name')) && valido;
    valido = validarDataNascimento(document.getElementById('date')) && valido;
    valido = validarCPF(document.getElementById('cpf')) && valido;
    valido = validarEmail(document.getElementById('email')) && valido;
    valido = validarTelefone(document.querySelector('input[attrname="telephone1"]')) && valido;
    
    // Validar documentos
    valido = validarDocumento('identity') && valido;
    
    // Validar endereço
    valido = validarCEP(document.getElementById('cep')) && valido;
    valido = validarRua(document.getElementById('street')) && valido;
    valido = validarNumero(document.getElementById('number')) && valido;
    valido = validarCidade(document.getElementById('city')) && valido;
    valido = validarEstado(document.getElementById('state')) && valido;
    
    // Validar comprovante de residência
    valido = validarDocumento('residence-proof') && valido;
    
    // Validar trilhas selecionadas
    valido = validarTrilhas() && valido;
    
    // Validar termos
    valido = validarTermos() && valido;
    
    return valido;
}

// Funções de validação individuais
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
    
    if (idade < 12) {
        mostrarErro(input, errorElement, 'Você deve ter pelo menos 12 anos');
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
    
    if (value.length !== 11) {
        mostrarErro(input, errorElement, 'CPF inválido');
        return false;
    }
    
    // Validar dígitos verificadores
    if (!validarDigitosCPF(value)) {
        mostrarErro(input, errorElement, 'CPF inválido');
        return false;
    }
    
    removerErro(input, errorElement);
    return true;
}

function validarDigitosCPF(cpf) {
    let soma = 0;
    let resto;
    
    if (cpf === "00000000000") return false;
    
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    
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
    
    if (!input.files || input.files.length === 0) {
        mostrarErro(input, errorElement, 'O documento é obrigatório');
        return false;
    }
    
    const file = input.files[0];
    if (file.type !== 'application/pdf') {
        mostrarErro(input, errorElement, 'Apenas arquivos PDF são aceitos');
        return false;
    }
    
    removerErro(input, errorElement);
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
    const value = input.value.trim();
    const errorElement = criarOuObterErrorElement(input);
    
    if (!value) {
        mostrarErro(input, errorElement, 'O estado é obrigatório');
        return false;
    }
    
    if (value.length !== 2) {
        mostrarErro(input, errorElement, 'Use a sigla do estado (ex: SP)');
        return false;
    }
    
    removerErro(input, errorElement);
    return true;
}

function validarTrilhas() {
    const trilhas = document.querySelectorAll('.trilhas input[type="checkbox"]:checked');
    const errorElement = document.getElementById('trilhas-error') || criarErrorElementGlobal('trilhas-error', 'Por favor, selecione pelo menos uma trilha');
    
    if (trilhas.length === 0) {
        const trilhasContainer = document.querySelector('.trilhas');
        if (!document.getElementById('trilhas-error')) {
            trilhasContainer.parentNode.insertBefore(errorElement, trilhasContainer.nextSibling);
        }
        errorElement.style.display = 'block';
        return false;
    }
    
    errorElement.style.display = 'none';
    return true;
}

function validarTermos() {
    const termos = document.querySelectorAll('input[name="terms"]');
    const errorElement = document.getElementById('termos-error') || criarErrorElementGlobal('termos-error', 'Você deve aceitar os termos para continuar');
    
    let todosAceitos = true;
    termos.forEach(termo => {
        if (!termo.checked) {
            todosAceitos = false;
        }
    });
    
    if (!todosAceitos) {
        const termosContainer = document.querySelector('.terms:last-of-type');
        if (!document.getElementById('termos-error')) {
            termosContainer.parentNode.insertBefore(errorElement, termosContainer.nextSibling);
        }
        errorElement.style.display = 'block';
        return false;
    }
    
    errorElement.style.display = 'none';
    return true;
}

// Funções auxiliares
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
    errorElement.className = 'error-message';
    errorElement.textContent = mensagem;
    errorElement.style.color = 'red';
    errorElement.style.marginTop = '5px';
    errorElement.style.display = 'none';
    return errorElement;
}

function mostrarErro(input, errorElement, mensagem) {
    input.style.borderColor = 'red';
    errorElement.textContent = mensagem;
    errorElement.style.display = 'block';
}

function removerErro(input, errorElement) {
    input.style.borderColor = '';
    errorElement.style.display = 'none';
}

