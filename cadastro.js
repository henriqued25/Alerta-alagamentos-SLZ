// cadastro.js

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formCadastro');
    const API_BASE_URL = 'https://alerta-alagamentos-sls.onrender.com/api';

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;

        if (!nome || !email || !senha || !confirmarSenha) {
            Swal.fire({ 
                icon: 'warning',
                title: 'Atenção',
                text: 'Por favor, preencha todos os campos.',
                confirmButtonColor: '#010101'
            });
            return;
        }

        if (senha.length < 6) {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção',
                text: 'A senha deve ter pelo menos 6 caracteres.',
                confirmButtonColor: '#010101'
            });
            return;
        }

        if (senha !== confirmarSenha) {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção',
                text: 'As senhas não coincidem.',
                confirmButtonColor: '#010101'
            });
            return;
        }

        // Dados a serem enviados para a API
        const userData = {
            nome: nome,
            email: email,
            senha: senha
        };

        try {
            Swal.fire({ 
                title: 'Cadastrando...',
                text: 'Por favor, aguarde.',
                icon: 'info',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Requisição para a API de cadastro
            const response = await fetch(`${API_BASE_URL}/users/cadastro`, { 
                
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const responseData = await response.json(); 

            if (response.ok) { 
                Swal.fire({
                    icon: 'success',
                    title: 'Cadastro realizado com sucesso!',
                    text: 'Você será redirecionado para a página de login.',
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    window.location.href = 'login.html'; // Redireciona para o login
                });
            } else { // Se a API retornou um erro (status 4xx, 5xx)
                let errorMessage = 'Erro ao cadastrar. Tente novamente mais tarde.';
                if (responseData && responseData.message) {
                    errorMessage = responseData.message; // Mensagem de erro da API
                } else if (response.status === 409) {
                    errorMessage = 'Este e-mail já está cadastrado.';
                } else if (response.status === 400) {
                    errorMessage = 'Dados inválidos. Verifique as informações fornecidas.';
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Erro no Cadastro',
                    text: errorMessage,
                    confirmButtonColor: '#010101'
                });
            }

        } catch (error) {
            console.error('Erro na requisição de cadastro:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro de Conexão',
                text: 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
                confirmButtonColor: '#010101'
            });
        }
    });
});

