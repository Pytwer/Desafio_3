    document.querySelectorAll('.custom-checkbox').forEach((checkboxContainer) => {
        const checkbox = checkboxContainer.querySelector('input[type="checkbox"]');

        checkboxContainer.addEventListener('click', (event) => {
            // Evita que o evento seja disparado múltiplas vezes
            event.stopPropagation();

            // Remove a classe 'selected' de todos os botões e desmarca os checkboxes
            document.querySelectorAll('.custom-checkbox').forEach((option) => {
                option.classList.remove('selected');
                option.querySelector('input[type="checkbox"]').checked = false;
            });

            // Adiciona a classe 'selected' e marca o checkbox apenas no botão clicado
            checkbox.checked = true;
            checkboxContainer.classList.add('selected');
        });
    });

    //Seleção de checkbox
    function selecionarCheckbox(checkbox) {
        // Seleciona todos os checkboxes dentro da div container
        var checkboxes = document.querySelectorAll('.container input[type="checkbox"]');

        // Se o checkbox foi marcado, desmarca todos os outros
        checkboxes.forEach(function(item) {
            if (item !== checkbox) {
                item.checked = false; // Desmarca os outros checkboxes
            }
        });
    }
    document.getElementById('cpf').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = value;
    });

    document.querySelector('input[attrname="telephone1"]').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        value = value.replace(/(\d)(\d{4})$/, '$1-$2');
        e.target.value = value;
    });

    document.getElementById('cep').addEventListener('blur', function() {
        const cep = this.value.replace(/\D/g, '');
        if (cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        document.getElementById('street').value = data.logradouro || '';
                        document.getElementById('city').value = data.localidade || '';
                        document.getElementById('state').value = data.uf || '';
                    }
                })
                .catch(error => console.error('Erro ao buscar CEP:', error));
        }
    });
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('inscricaoForm');
        const loadingOverlay = document.getElementById('loadingOverlay');
        
        // Verifica se os elementos existem
        if (!form || !loadingOverlay) {
            console.error('Elementos do formulário não encontrados!');
            return;
        }
    
        // Adiciona máscaras aos campos
        function aplicarMascaras() {
            // Máscara para telefone
            const telefoneInput = document.querySelector('input[attrname="telephone1"]');
            if (telefoneInput) {
                telefoneInput.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                    value = value.replace(/(\d)(\d{4})$/, '$1-$2');
                    e.target.value = value;
                });
            }
    
            // Máscara para CPF
            const cpfInput = document.getElementById('cpf');
            if (cpfInput) {
                cpfInput.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    value = value.replace(/(\d{3})(\d)/, '$1.$2');
                    value = value.replace(/(\d{3})(\d)/, '$1.$2');
                    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                    e.target.value = value;
                });
            }
    
            // Máscara para CEP
            const cepInput = document.getElementById('cep');
            if (cepInput) {
                cepInput.addEventListener('input', function(e) {
                    let value = e.target.value.replace(/\D/g, '');
                    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
                    e.target.value = value;
                });
            }
        }
    
        aplicarMascaras();
    
        // Função principal de validação
        function validarFormulario() {
            let valido = true;
            
            // Validação básica de campos obrigatórios
            const camposObrigatorios = form.querySelectorAll('[required]');
            camposObrigatorios.forEach(campo => {
                if (!campo.value.trim()) {
                    campo.classList.add('campo-invalido');
                    valido = false;
                } else {
                    campo.classList.remove('campo-invalido');
                }
            });
    
            // Validação específica para arquivos
            const validarArquivo = (id) => {
                const arquivo = document.getElementById(id);
                if (arquivo && (!arquivo.files || arquivo.files.length === 0)) {
                    arquivo.closest('.file-upload').classList.add('campo-invalido');
                    return false;
                }
                arquivo.closest('.file-upload').classList.remove('campo-invalido');
                return true;
            };
    
            if (!validarArquivo('identity') || !validarArquivo('residence-proof')) {
                valido = false;
            }
    
            // Validação de termos
            const termos = form.querySelectorAll('.terms [type="checkbox"]');
            let termosAceitos = true;
            termos.forEach(termo => {
                if (!termo.checked) {
                    termo.closest('.terms').classList.add('campo-invalido');
                    termosAceitos = false;
                } else {
                    termo.closest('.terms').classList.remove('campo-invalido');
                }
            });
    
            return valido && termosAceitos;
        }
        
    });