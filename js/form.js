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
        
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            if (validateForm()) {
                // Mostra o overlay de carregamento
                loadingOverlay.classList.add('active');
                // Simula o envio dos dados (substitua por AJAX real se necessário)
                setTimeout(function() {
                    // Mostra mensagem de conclusão antes de redirecionar
                    document.querySelector('.loading-text').textContent = 'Inscrição concluída! Redirecionando...';
                    document.querySelector('.loading-image').style.animation = 'none';   
                    // Redireciona após breve pausa
                    setTimeout(function() {
                        window.location.href = '/pgs/menu.html';
                    }, 3000);
                }, 3000); // Tempo simulado de processamento
            }
        });
        function validateForm() {
            let isValid = true;
            // Valida campos de texto obrigatórios
            const requiredFields = form.querySelectorAll('[required]:not([type="file"])');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('invalid');
                    isValid = false;
                }
            });
            // Valida arquivos
            if (!validateFile('identity') || !validateFile('residence-proof')) {
                isValid = false;
            }
            return isValid;
        }
        function validateFile(inputId) {
            const fileInput = document.getElementById(inputId);
            const uploadContainer = fileInput.closest('.file-upload');
            
            if (!fileInput.files || fileInput.files.length === 0) {
                uploadContainer.classList.add('invalid-file');
                return false;
            } else {
                uploadContainer.classList.remove('invalid-file');
                return true;
            }
        }
        function validateForm() {
            let isValid = true;
            const required = form.querySelectorAll('[required]');
            
            required.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('invalid');
                    isValid = false;
                } else {
                    field.classList.remove('invalid');
                }
            });
            // Valida checkboxes de termos
            const terms = form.querySelectorAll('.terms [type="checkbox"]');
            terms.forEach(term => {
                if (!term.checked) isValid = false;
            });
            return isValid;
        }
    });
    const date = document.getElementById('date');
    const hoje = new Date().toISOString().split('T')[0];
    date.setAttribute('max', hoje);
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('inscricaoForm');
    
        // Capturar dados do formulário
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o envio padrão do formulário
    
            // Coletar dados do formulário
            const name = document.getElementById('name').value;
            const birthdate = document.getElementById('date').value;
            const cpf = document.getElementById('cpf').value;
            const gender = document.getElementById('gender').value;
            const email = document.getElementById('email').value;
            const telephone = document.getElementById('telephone').value;
            const identityFile = document.getElementById('identity').files[0]; // PDF do documento de identidade
            const residenceFile = document.getElementById('residence-proof').files[0]; // PDF do comprovante de residência
            const cep = document.getElementById('cep').value;
            const street = document.getElementById('street').value;
            const number = document.getElementById('number').value;
            const city = document.getElementById('city').value;
            const state = document.getElementById('state').value;
    
            // Variável para armazenar as trilhas escolhidas
            let chosenTrilhas = [];
    
            // Verificar quais trilhas foram escolhidas
            if (document.getElementById('trilha_0').checked) {
                chosenTrilhas.push('Programação Front-end');
            }
            if (document.getElementById('trilha_1').checked) {
                chosenTrilhas.push('Programação Back-end');
            }
            if (document.getElementById('trilha_2').checked) {
                chosenTrilhas.push('Programação em Jogos');
            }
            if (document.getElementById('trilha_3').checked) {
                chosenTrilhas.push('Design e Experiência');
            }
            if (document.getElementById('trilha_4').checked) {
                chosenTrilhas.push('Ciência de Dados');
            }
    
            // Armazenar trilhas em localStorage
            localStorage.setItem('chosenTrilhas', JSON.stringify(chosenTrilhas));
    
            // Usar FileReader para ler os arquivos PDF
            const reader = new FileReader();
            reader.onload = function(e) {
                const identityPDF = e.target.result; // URL do PDF do documento de identidade
                const residenceReader = new FileReader();
                residenceReader.onload = function(e) {
                    const residencePDF = e.target.result; // URL do PDF do comprovante de residência
    
                    // Criar objeto JSON para armazenar os PDFs
                    const pdfsData = {
                        identity: identityPDF,
                        residence: residencePDF
                    };
    
                    // Armazenar dados no localStorage
                    localStorage.setItem('name', name);
                    localStorage.setItem('birthdate', birthdate);
                    localStorage.setItem('cpf', cpf);
                    localStorage.setItem('gender', gender);
                    localStorage.setItem('email', email);
                    localStorage.setItem('telephone', telephone);
                    localStorage.setItem('pdfs', JSON.stringify(pdfsData)); // Armazenar como JSON
                    localStorage.setItem('cep', cep);
                    localStorage.setItem('street', street);
                    localStorage.setItem('number', number);
                    localStorage.setItem('city', city);
                    localStorage.setItem('state', state);
    
                    alert('Dados salvos com sucesso!');
                };
    
                if (residenceFile) {
                    residenceReader.readAsDataURL(residenceFile); // Lê o arquivo PDF do comprovante de residência
                } else {
                    residenceReader.onload(); // Chama a função se não houver arquivo
                }
            };
    
            if (identityFile) {
                reader.readAsDataURL(identityFile); // Lê o arquivo PDF do documento de identidade
            } else {
                reader.onload(); // Chama a função se não houver arquivo
            }
            function validateForm() {
                let isValid = true;
                const required = form.querySelectorAll('[required]');
                
                required.forEach(field => {
                    if (!field.value.trim()) {
                        field.classList.add('invalid');
                        isValid = false;
                    } else {
                        field.classList.remove('invalid');
                    }
                });
                // Valida checkboxes de termos
                const terms = form.querySelectorAll('.terms [type="checkbox"]');
                terms.forEach(term => {
                    if (!term.checked) isValid = false;
                });
                return isValid;
            }
        });
    });