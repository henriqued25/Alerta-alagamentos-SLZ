// login.js

document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('formLogin');
    const emailInput = document.getElementById('emailLogin');
    const senhaInput = document.getElementById('senhaLogin');
    const linkEsqueciSenha = document.getElementById('linkEsqueciSenha');

    const API_BASE_URL = 'https://alerta-alagamentos-sls.onrender.com/api';

    formLogin.addEventListener('submit', async (e) => { 
        e.preventDefault();

        const email = emailInput.value.trim();
        const senha = senhaInput.value;

        // Validações usando SweetAlert2 para consistência
        if (!email) {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção',
                text: 'Por favor, insira seu e-mail.',
                confirmButtonColor: '#010101'
            });
            emailInput.focus();
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção',
                text: 'Por favor, insira um e-mail válido.',
                confirmButtonColor: '#010101'
            });
            emailInput.focus();
            return;
        }

        if (!senha) {
            Swal.fire({
                icon: 'warning',
                title: 'Atenção',
                text: 'Por favor, insira sua senha.',
                confirmButtonColor: '#010101'
            });
            senhaInput.focus();
            return;
        }

        // Dados a serem enviados para a API
        const loginData = {
            email: email,
            senha: senha 
        };

        try {
            Swal.fire({ // Exibe um SweetAlert de carregamento
                title: 'Entrando...',
                text: 'Por favor, aguarde.',
                icon: 'info',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Requisição para a API de login
            const response = await fetch(`${API_BASE_URL}/users/login`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            const responseData = await response.json(); // Pega a resposta JSON da API

            if (response.ok) { 
                const token = responseData.token; 

                if (token) {
                    localStorage.setItem('authToken', token); // Armazena o token no localStorage
                    Swal.fire({
                        icon: 'success',
                        title: 'Login realizado com sucesso!',
                        text: 'Você será redirecionado para a página inicial.',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        window.location.href = 'index.html'; // Redireciona para a página principal
                    });
                } else {
                    // Se a API retornou OK, mas sem token (erro inesperado da API)
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro de Login',
                        text: 'Login bem-sucedido, mas nenhum token recebido. Por favor, tente novamente.',
                        confirmButtonColor: '#010101'
                    });
                }
            } else { // Se a API retornou um erro (status 4xx, 5xx)
                let errorMessage = 'Erro ao fazer login. Credenciais inválidas ou tente novamente mais tarde.';
                if (responseData && responseData.message) {
                    errorMessage = responseData.message; // Mensagem de erro da API
                } else if (response.status === 401) { // 401 Unauthorized para credenciais erradas
                    errorMessage = 'E-mail ou senha inválidos. Por favor, verifique suas credenciais.';
                } else if (response.status === 400) { // Exemplo: 400 Bad Request
                    errorMessage = 'Dados de login inválidos.';
                }

                Swal.fire({
                    icon: 'error',
                    title: 'Erro no Login',
                    text: errorMessage,
                    confirmButtonColor: '#010101'
                });
            }

        } catch (error) {
            console.error('Erro na requisição de login:', error);
            Swal.fire({
                icon: 'error',
                title: 'Erro de Conexão',
                text: 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
                confirmButtonColor: '#010101'
            });
        }
    });

    linkEsqueciSenha.addEventListener('click', (e) => {
        e.preventDefault();
        Swal.fire({
            icon: 'info',
            title: 'Função em Desenvolvimento',
            text: 'A função "Esqueci minha senha" ainda não foi implementada.',
            confirmButtonColor: '#010101'
        });
    });
});
