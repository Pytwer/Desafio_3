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

    // Função para validar CPF (11 dígitos numéricos)
    function validateCpf(cpf) {
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
        registerLinkDiv.style.display = 'none'; // Esconde ao mudar para registro
    });
    
    showLoginForm.addEventListener('click', function(e) {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
        registerMessage.style.display = 'none';
        registerLinkDiv.style.display = 'none'; // Esconde ao voltar para login
    });
    
    // Verificar CPF digitado no login para mostrar/ocultar link de cadastro
    loginCpf.addEventListener('input', function() {
        const cpf = this.value.trim();
        
        if (validateCpf(cpf)) {
            const userExists = users.some(u => u.cpf === cpf);
            registerLinkDiv.style.display = userExists ? 'none' : 'block';
        } else {
            registerLinkDiv.style.display = 'none';
        }
    });
    
    // Lembrar credenciais
    const rememberMe = document.getElementById('rememberMe');
    
    // Verificar se há credenciais salvas
    if (localStorage.getItem('rememberedUser')) {
        const rememberedUser = JSON.parse(localStorage.getItem('rememberedUser'));
        loginCpf.value = rememberedUser.cpf;
        loginPassword.value = rememberedUser.password;
        rememberMe.checked = true;
    }
    
    // Evento de submit do formulário de login
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const cpf = loginCpf.value.trim();
        const password = loginPassword.value.trim();
        
        // Validar CPF
        if (!validateCpf(cpf)) {
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
                registerLinkDiv.style.display = 'block'; // Mostra link de cadastro
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
            
            // Redirecionar para a página principal (simulado)
            setTimeout(() => {
                window.location.href = '/pgs/menu.html';
            }, 1000);
            
        }, 1500);
    });
    
    // Evento de submit do formulário de registro
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const cpf = registerCpf.value.trim();
        const password = registerPassword.value.trim();
        
        // Validar CPF
        if (!validateCpf(cpf)) {
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
                loginCpf.value = cpf;
                loginPassword.value = password;
                registerMessage.style.display = 'none';
                registerLinkDiv.style.display = 'none';
            }, 1000);
            
        }, 1500);
    });
    
    // Máscara para CPF (apenas números)
    [loginCpf, registerCpf].forEach(input => {
        input.addEventListener('input', function() {
            let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                e.target.value = value;
        });
    });
});