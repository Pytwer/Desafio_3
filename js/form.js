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
    dataInput.value = hoje;
    document.addEventListener('DOMContentLoaded', async () => {
        await initDB();
        await auth.checkAuth();
        
        if (!auth.currentUser) {
            window.location.href = '/index.html';
            return;
        }
    
        // Elementos do formulário
        const form = document.getElementById('inscricaoForm');
        const identityInput = document.getElementById('identity');
        const identityImage = document.getElementById('identity-image');
        const residenceInput = document.getElementById('residence-proof');
        const residenceImage = document.getElementById('residence-image');
    
        // Manipuladores para upload de imagens
        identityInput.addEventListener('change', function(e) {
            handleFileUpload(e, identityImage);
        });
    
        residenceInput.addEventListener('change', function(e) {
            handleFileUpload(e, residenceImage);
        });
    
        // Função para lidar com upload de arquivos
        function handleFileUpload(event, imageElement) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imageElement.src = e.target.result;
                    imageElement.dataset.tempFile = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        }
    
        // Manipulador de envio do formulário
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Coletar todos os dados do formulário
            const formData = {
                participantInfo: {
                    name: document.getElementById('name').value,
                    birthdate: document.getElementById('date').value,
                    cpf: document.getElementById('cpf').value,
                    gender: document.getElementById('gender').value,
                    email: document.getElementById('email').value,
                    tel: document.querySelector('input[attrname="telephone1"]').value,
                    identityImage: identityImage.dataset.tempFile || ''
                },
                address: {
                    cep: document.getElementById('cep').value,
                    street: document.getElementById('street').value,
                    number: document.getElementById('number').value,
                    city: document.getElementById('city').value,
                    state: document.getElementById('state').value,
                    residenceProof: residenceImage.dataset.tempFile || ''
                },
                trails: [],
                terms: {
                    terms1: document.querySelectorAll('#terms')[0].checked,
                    terms2: document.querySelectorAll('#terms')[1].checked
                },
                userId: auth.currentUser.id,
                submissionDate: new Date().toISOString()
            };
    
            // Coletar trilhas selecionadas
            document.querySelectorAll('.trilhas input[type="checkbox"]').forEach(checkbox => {
                if (checkbox.checked) {
                    const trailText = checkbox.closest('.custom-checkbox').querySelector('.texto').textContent;
                    formData.trails.push(trailText);
                }
            });
    
            try {
                // Salvar no IndexedDB
                await saveSubmission(formData);
                alert('Inscrição salva com sucesso!');
                
                // Limpar o formulário
                form.reset();
                identityImage.src = '/img/upload.png';
                residenceImage.src = '/img/upload.png';
                delete identityImage.dataset.tempFile;
                delete residenceImage.dataset.tempFile;
                
                // Redirecionar para o perfil
                window.location.href = '/perfil.html';
            } catch (error) {
                console.error('Erro ao salvar inscrição:', error);
                alert('Erro ao salvar inscrição');
            }
        });
    
        // Função para salvar inscrição no IndexedDB
        function saveSubmission(data) {
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(['submissions'], 'readwrite');
                const store = transaction.objectStore('submissions');
                
                const submission = {
                    id: 'sub_' + Date.now(),
                    ...data
                };
    
                const request = store.add(submission);
    
                request.onsuccess = () => resolve();
                request.onerror = () => reject('Erro ao salvar inscrição');
            });
        }
    
        // Máscaras para CPF e Telefone
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
    
        // Buscar CEP
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
    });
    
    // Exportar para usar em outros arquivos
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { saveSubmission };
    }