document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formCadastro');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;

        if (!nome || !email || !senha || !confirmarSenha) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        if (senha.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem.');
            return;
        }

       Swal.fire({
  icon: 'success',
  title: 'Cadastro realizado com sucesso!',
  showConfirmButton: false,
  timer: 2000
}).then(() => {
  window.location.href = 'login.html';
});

    });
});

