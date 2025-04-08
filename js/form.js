// Array para armazenar campos inválidos
const camposInvalidos = [];

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('inscricaoForm');
    const loadingContainer = document.getElementById('loadingContainer');
    
    // Inicializa máscaras e validações
    aplicarMascaras();
    configurarValidacoes();
    configurarCheckboxesPersonalizados();
    
    // Evento de submit do formulário
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Impede o comportamento padrão de submit e reset
        
        console.log('Formulário submetido - iniciando validação');
        
        // Limpa erros anteriores
        camposInvalidos.length = 0;
        
        if (validarFormulario()) {
            console.log('Formulário válido - processando...');
            
            // Mostra o loading
            loadingContainer.style.display = 'flex';
            
            // Simula um tempo de processamento (remova isso na implementação real)
            setTimeout(() => {
                // Esconde o loading após o processamento
                loadingContainer.style.display = 'none';
                
                // Redireciona após o envio
                window.location.href = '/pgs/menu.html';
            }, 2000);
        } else {
            console.log('Formulário inválido. Erros encontrados:');
            camposInvalidos.forEach(campo => console.log(campo.id || campo.name));
            
            // Rolagem para o primeiro erro
            if (camposInvalidos.length > 0) {
                camposInvalidos[0].scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }
    });
});

// Função para aplicar máscaras aos campos
function aplicarMascaras() {
    // Máscara para CPF (000.000.000-00)
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
    
    // Máscara para Telefone ((00) 00000-0000)
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
    
    // Máscara para CEP (00000-000)
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

// Configura validações quando o campo perde o foco
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

// Configura os checkboxes personalizados
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

// Função principal de validação
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

// Função auxiliar para validar campos
function validarCampo(id, validator, element = null) {
    const input = element || document.getElementById(id);
    if (!input) return false;
    
    const isValid = validator(input);
    if (!isValid) camposInvalidos.push(input);
    return isValid;
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
}

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

// Funções auxiliares para manipulação de erros
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