document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário de login
    const loginForm = document.getElementById('loginForm');
    const loginCpf = document.getElementById('loginCpf');
    const loginPassword = document.getElementById('loginPassword');
    const loginMessage = document.getElementById('loginMessage');
    const showRegisterForm = document.getElementById('showRegisterForm');
    const registerLinkDiv = document.querySelector('.register-link');

    // Elementos do formulário de registro
    const registerForm = document.getElementById('registerForm');
    const registerCpf = document.getElementById('registerCpf');
    const registerPassword = document.getElementById('registerPassword');
    const registerMessage = document.getElementById('registerMessage');
    const showLoginForm = document.getElementById('showLoginForm');
    
    // Elementos do loading
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingText = document.querySelector('.loading-text');
    
    // Armazenamento de usuários (simulado)
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Esconder o link de cadastro inicialmente
    registerLinkDiv.style.display = 'none';

    // Função para formatar CPF (XXX.XXX.XXX-XX)
    function formatCpf(cpf) {
        cpf = cpf.replace(/\D/g, '');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return cpf;
    }

    // Função para remover formatação do CPF (apenas números)
    function unformatCpf(cpf) {
        return cpf.replace(/\D/g, '');
    }

    // Função para validar CPF (11 dígitos numéricos)
    function validateCpf(cpf) {
        cpf = unformatCpf(cpf);
        return /^\d{11}$/.test(cpf);
    }
    
    // Função para validar senha (mínimo 6 caracteres)
    function validatePassword(password) {
        return password.length >= 6;
    }
    
    // Função para mostrar mensagem de erro
    function showMessage(element, message, isError = true) {
        element.textContent = message;
        element.style.display = 'block';
        element.style.color = isError ? '#ff3333' : '#33cc33';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
    
    // Função para mostrar loading
    function showLoading(message) {
        loadingText.textContent = message;
        loadingOverlay.style.display = 'flex';
    }
    
    // Função para esconder loading
    function hideLoading() {
        loadingOverlay.style.display = 'none';
    }
    
    // Alternar entre formulários de login e registro
    showRegisterForm.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginMessage.style.display = 'none';
        registerLinkDiv.style.display = 'none';
    });
    
    showLoginForm.addEventListener('click', function(e) {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        registerMessage.style.display = 'none';
        registerLinkDiv.style.display = 'none';
    });
    
    // Máscara de formatação para CPF no login
    loginCpf.addEventListener('input', function(e) {
        let value = e.target.value;
        const originalLength = value.length;
        
        // Aplica formatação
        value = formatCpf(value);
        e.target.value = value;
        
        // Verifica se o CPF está completo para mostrar/ocultar link de cadastro
        if (validateCpf(value)) {
            const cpfDigits = unformatCpf(value);
            const userExists = users.some(u => u.cpf === cpfDigits);
            registerLinkDiv.style.display = userExists ? 'none' : 'block';
        } else {
            registerLinkDiv.style.display = 'none';
        }
    });
    
    // Máscara de formatação para CPF no registro
    registerCpf.addEventListener('input', function(e) {
        e.target.value = formatCpf(e.target.value);
    });
    
    // Lembrar credenciais
    const rememberMe = document.getElementById('rememberMe');
    
    // Verificar se há credenciais salvas
    if (localStorage.getItem('rememberedUser')) {
        const rememberedUser = JSON.parse(localStorage.getItem('rememberedUser'));
        loginCpf.value = formatCpf(rememberedUser.cpf);
        loginPassword.value = rememberedUser.password;
        rememberMe.checked = true;
    }
    
    // Evento de submit do formulário de login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const cpf = unformatCpf(loginCpf.value);
        const password = loginPassword.value.trim();
        
        // Validar CPF
        if (!validateCpf(loginCpf.value)) {
            showMessage(loginMessage, 'CPF deve conter exatamente 11 dígitos numéricos.');
            registerLinkDiv.style.display = 'none';
            return;
        }
        
        // Validar senha
        if (!validatePassword(password)) {
            showMessage(loginMessage, 'Senha deve ter no mínimo 6 caracteres.');
            return;
        }
        
        showLoading('Validando credenciais...');
        
        // Simular delay de requisição
        setTimeout(() => {
            // Verificar se o usuário existe
            const user = users.find(u => u.cpf === cpf);
            
            if (!user) {
                hideLoading();
                showMessage(loginMessage, 'Usuário não encontrado.');
                registerLinkDiv.style.display = 'block';
                return;
            }
            
            // Verificar senha
            if (user.password !== password) {
                hideLoading();
                showMessage(loginMessage, 'Senha incorreta. Tente novamente.');
                return;
            }
            
            // Lembrar credenciais se marcado
            if (rememberMe.checked) {
                localStorage.setItem('rememberedUser', JSON.stringify({ cpf, password }));
            } else {
                localStorage.removeItem('rememberedUser');
            }
            
            hideLoading();
            showMessage(loginMessage, 'Login realizado com sucesso!', false);
            sessionStorage.setItem('loggedUserCpf', formatCpf(cpf));
            
            // Redirecionar para a página principal (simulado)
            setTimeout(() => {
                window.location.href = '/pgs/menu.html';
            }, 1000);
            
        }, 1000);
    });
    
    // Evento de submit do formulário de registro
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const cpf = unformatCpf(registerCpf.value);
        const password = registerPassword.value.trim();
        
        // Validar CPF
        if (!validateCpf(registerCpf.value)) {
            showMessage(registerMessage, 'CPF deve conter exatamente 11 dígitos numéricos.');
            return;
        }
        
        // Validar senha
        if (!validatePassword(password)) {
            showMessage(registerMessage, 'Senha deve ter no mínimo 6 caracteres.');
            return;
        }
        
        showLoading('Criando sua conta...');
        
        // Simular delay de requisição
        setTimeout(() => {
            // Verificar se o usuário já existe
            const userExists = users.some(u => u.cpf === cpf);
            
            if (userExists) {
                hideLoading();
                showMessage(registerMessage, 'CPF já cadastrado. Faça login ou use outro CPF.');
                return;
            }
            
            // Adicionar novo usuário
            users.push({ cpf, password });
            localStorage.setItem('users', JSON.stringify(users));
            
            hideLoading();
            showMessage(registerMessage, 'Cadastro realizado com sucesso!', false);
            
            // Preencher automaticamente o formulário de login
            setTimeout(() => {
                registerForm.style.display = 'none';
                loginForm.style.display = 'block';
                loginCpf.value = formatCpf(cpf);
                loginPassword.value = password;
                registerMessage.style.display = 'none';
                registerLinkDiv.style.display = 'none';
            }, 1000);
            
        }, 1000);
    });
});