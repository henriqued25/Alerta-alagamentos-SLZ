// login.js - Validação simples do formulário de login

document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('formLogin');
    const emailInput = document.getElementById('emailLogin');
    const senhaInput = document.getElementById('senhaLogin');
    const linkEsqueciSenha = document.getElementById('linkEsqueciSenha');

    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const senha = senhaInput.value;

        if (!email) {
            alert('Por favor, insira seu e-mail.');
            emailInput.focus();
            return;
        }

        // Simples validação de formato de e-mail
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, insira um e-mail válido.');
            emailInput.focus();
            return;
        }

        if (!senha) {
            alert('Por favor, insira sua senha.');
            senhaInput.focus();
            return;
        }

        // Aqui você faria a autenticação real, mas por enquanto só um alerta:
        alert(`Tentando login com:\nE-mail: ${email}\nSenha: ${'*'.repeat(senha.length)}`);

        formLogin.reset();
    });

    linkEsqueciSenha.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Função "Esqueci minha senha" ainda não implementada.');
    });
});
