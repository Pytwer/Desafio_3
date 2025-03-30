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