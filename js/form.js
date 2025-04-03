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
            const identityFile = document.getElementById('identity').files[0];
            const residenceFile = document.getElementById('residence-proof').files[0];
            const cep = document.getElementById('cep').value;
            const street = document.getElementById('street').value;
            const number = document.getElementById('number').value;
            const city = document.getElementById('city').value;
            const state = document.getElementById('state').value;
    
            // Capturar trilhas de aprendizagem em variáveis separadas
            const trilhaFrontend = document.getElementById('trilha_frontend').checked ? 'Programação Front-end' : '';
            const trilhaBackend = document.getElementById('trilha_backend').checked ? 'Programação Back-end' : '';
            const trilhaJogos = document.getElementById('trilha_jogos').checked ? 'Programação em Jogos' : '';
            const trilhaDesign = document.getElementById('trilha_design').checked ? 'Design e Experiência' : '';
            const trilhaDados = document.getElementById('trilha_dados').checked ? 'Ciência de Dados' : '';
    
            // Armazenar trilhas em localStorage
            localStorage.setItem('trilhaFrontend', trilhaFrontend);
            localStorage.setItem('trilhaBackend', trilhaBackend);
            localStorage.setItem('trilhaJogos', trilhaJogos);
            localStorage.setItem('trilhaDesign', trilhaDesign);
            localStorage.setItem('trilhaDados', trilhaDados);
    
            // Usar FileReader para ler as imagens
            const reader = new FileReader();
            reader.onload = function(e) {
                const identityBase64 = e.target.result; // URL da imagem do documento de identidade
                const residenceReader = new FileReader();
                residenceReader.onload = function(e) {
                    const residenceBase64 = e.target.result; // URL da imagem do comprovante de residência
    
                    // Armazenar dados no localStorage
                    localStorage.setItem('name', name);
                    localStorage.setItem('birthdate', birthdate);
                    localStorage.setItem('cpf', cpf);
                    localStorage.setItem('gender', gender);
                    localStorage.setItem('email', email);
                    localStorage.setItem('telephone', telephone);
                    localStorage.setItem('identity', identityBase64);
                    localStorage.setItem('cep', cep);
                    localStorage.setItem('street', street);
                    localStorage.setItem('number', number);
                    localStorage.setItem('city', city);
                    localStorage.setItem('state', state);
                    localStorage.setItem('residenceProof', residenceBase64);
    
                    alert('Dados salvos com sucesso!');
                };
    
                if (residenceFile) {
                    residenceReader.readAsDataURL(residenceFile); // Lê o arquivo de imagem do comprovante de residência
                } else {
                    residenceReader.onload(); // Chama a função se não houver arquivo
                }
            };
    
            if (identityFile) {
                reader.readAsDataURL(identityFile); // Lê o arquivo de imagem do documento de identidade
            } else {
                reader.onload(); // Chama a função se não houver arquivo
            }
        });
    });