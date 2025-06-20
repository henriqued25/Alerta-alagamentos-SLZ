// script.js - Versão traduzida

document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile
    const botaoMenu = document.querySelector('.botao-menu-mobile');
    const menu = document.querySelector('.menu');
    
    botaoMenu.addEventListener('click', function() {
        menu.classList.toggle('ativo');
        this.innerHTML = menu.classList.contains('ativo') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    
    // Atualização do painel
    function atualizarPainel() {
        console.log('Atualizando dados do painel...');
        
        const cardsAlerta = document.querySelectorAll('.card-alerta');
        cardsAlerta.forEach(card => {
            card.addEventListener('click', function() {
                console.log(`Alerta clicado: ${this.querySelector('h3').textContent}`);
                // Aqui você pode adicionar a lógica para mostrar mais detalhes
            });
        });
    }
    
    // Formulário de relato
    const formulario = document.querySelector('.formulario-relato');
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const localizacao = this.querySelector('#localizacao').value;
            const gravidade = this.querySelector('#gravidade').value;
            
            if (!localizacao || !gravidade) {
                alert('Por favor, preencha todos os campos obrigatórios!');
                return;
            }
            
            console.log('Relato enviado:', { localizacao, gravidade });
            alert('Relato enviado com sucesso! Obrigado por contribuir.');
            this.reset();
        });
    }
    
    // Pesquisa
    const pesquisa = document.querySelector('.caixa-pesquisa');
    if (pesquisa) {
        const campoPesquisa = pesquisa.querySelector('input');
        const botaoPesquisa = pesquisa.querySelector('.botao-pesquisa');
        
        botaoPesquisa.addEventListener('click', function() {
            if (campoPesquisa.value.trim()) {
                console.log(`Buscando por: ${campoPesquisa.value}`);
                alert(`Resultados para: ${campoPesquisa.value}`);
            }
        });
        
        campoPesquisa.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                console.log(`Buscando por: ${this.value}`);
                alert(`Resultados para: ${this.value}`);
            }
        });
    }
    
    // Navegação suave
    const linksMenu = document.querySelectorAll('.link-menu');
    linksMenu.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const destino = this.getAttribute('href');
            if (destino !== '#') {
                document.querySelector(destino).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Efeito no cabeçalho ao rolar
    window.addEventListener('scroll', function() {
        const scroll = window.scrollY;
        const cabecalho = document.querySelector('.cabecalho');
        
        if (scroll > 100) {
            cabecalho.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        } else {
            cabecalho.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });
    
    // Inicialização
    atualizarPainel();
});