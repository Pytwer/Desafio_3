document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginCpf = document.getElementById('loginCpf');
    const loginPassword = document.getElementById('loginPassword');
    const loginMessage = document.getElementById('loginMessage');
    const showRegisterForm = document.getElementById('showRegisterForm');
    const registerLinkDiv = document.querySelector('.register-link');
    const registerForm = document.getElementById('registerForm');
    const registerCpf = document.getElementById('registerCpf');
    const registerPassword = document.getElementById('registerPassword');
    const registerMessage = document.getElementById('registerMessage');
    const showLoginForm = document.getElementById('showLoginForm');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingText = document.querySelector('.loading-text');
    let users = JSON.parse(localStorage.getItem('users')) || [];
    registerLinkDiv.style.display = 'none';
    function formatCpf(cpf) {
        cpf = cpf.replace(/\D/g, '');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return cpf;
    }
    function unformatCpf(cpf) {
        return cpf.replace(/\D/g, '');
    }
    function validateCpf(cpf) {
        cpf = unformatCpf(cpf);
        return /^\d{11}$/.test(cpf);
    }
    function validatePassword(password) {
        return password.length >= 6;
    }
    function showMessage(element, message, isError = true) {
        element.textContent = message;
        element.style.display = 'block';
        element.style.color = isError ? '#ff3333' : '#33cc33';  
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
    function showLoading(message) {
        loadingText.textContent = message;
        loadingOverlay.style.display = 'flex';
    }
    function hideLoading() {
        loadingOverlay.style.display = 'none';
    }
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
    loginCpf.addEventListener('input', function(e) {
        let value = e.target.value;
        const originalLength = value.length;
        value = formatCpf(value);
        e.target.value = value;
        if (validateCpf(value)) {
            const cpfDigits = unformatCpf(value);
            const userExists = users.some(u => u.cpf === cpfDigits);
            registerLinkDiv.style.display = userExists ? 'none' : 'block';
        } else {
            registerLinkDiv.style.display = 'none';
        }
    });
    registerCpf.addEventListener('input', function(e) {
        e.target.value = formatCpf(e.target.value);
    });
    const rememberMe = document.getElementById('rememberMe');
    if (localStorage.getItem('rememberedUser')) {
        const rememberedUser = JSON.parse(localStorage.getItem('rememberedUser'));
        loginCpf.value = formatCpf(rememberedUser.cpf);
        loginPassword.value = rememberedUser.password;
        rememberMe.checked = true;
    }
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const cpf = unformatCpf(loginCpf.value);
        const password = loginPassword.value.trim();
        if (!validateCpf(loginCpf.value)) {
            showMessage(loginMessage, 'CPF deve conter exatamente 11 dígitos numéricos.');
            registerLinkDiv.style.display = 'none';
            return;
        }
            if (!validatePassword(password)) {
            showMessage(loginMessage, 'Senha deve ter no mínimo 6 caracteres.');
            return;
        }
        showLoading('Validando credenciais...');
        setTimeout(() => {
            const user = users.find(u => u.cpf === cpf);
            if (!user) {
                hideLoading();
                showMessage(loginMessage, 'Usuário não encontrado.');
                registerLinkDiv.style.display = 'block';
                return;
            }
            if (user.password !== password) {
                hideLoading();
                showMessage(loginMessage, 'Senha incorreta. Tente novamente.');
                return;
            }
            if (rememberMe.checked) {
                localStorage.setItem('rememberedUser', JSON.stringify({ cpf, password }));
            } else {
                localStorage.removeItem('rememberedUser');
            }
            hideLoading();
            showMessage(loginMessage, 'Login realizado com sucesso!', false);
            sessionStorage.setItem('loggedUserCpf', formatCpf(cpf));
            setTimeout(() => {
                window.location.href = '/pgs/menu.html';
            }, 1000);
        }, 1000);
    });
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const cpf = unformatCpf(registerCpf.value);
        const password = registerPassword.value.trim();
        if (!validateCpf(registerCpf.value)) {
            showMessage(registerMessage, 'CPF deve conter exatamente 11 dígitos numéricos.');
            return;
        }
        if (!validatePassword(password)) {
            showMessage(registerMessage, 'Senha deve ter no mínimo 6 caracteres.');
            return;
        }
        showLoading('Criando sua conta...');
        setTimeout(() => {
            const userExists = users.some(u => u.cpf === cpf);
            if (userExists) {
                hideLoading();
                showMessage(registerMessage, 'CPF já cadastrado. Faça login ou use outro CPF.');
                return;
            }
            users.push({ cpf, password });
            localStorage.setItem('users', JSON.stringify(users));
            hideLoading();
            showMessage(registerMessage, 'Cadastro realizado com sucesso!', false);
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