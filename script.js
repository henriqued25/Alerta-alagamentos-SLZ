// script.js

// Variável global para o mapa e marcadores;
let map;
let markers = []; // Para armazenar os marcadores de alagamento;

// Função de inicialização do Google Maps
// Esta função é chamada automaticamente pela API do Google Maps quando ela termina de carregar.
function initMap() {
    const saoLuisCoords = { lat: -2.5297, lng: -44.3039 }; // Coordenadas aproximadas de São Luís, MA;

    map = new google.maps.Map(document.getElementById('map'), {
        center: saoLuisCoords,
        zoom: 12, // Nível de zoom inicial
        mapTypeControl: false, // Desabilita o controle de tipo de mapa (satélite/roadmap)
        streetViewControl: false, // Desabilita o Street View
        fullscreenControl: false // Desabilita o controle de tela cheia
    });

    console.log('Mapa do Google Maps inicializado.');
    
    // Adiciionar dados de alagamento;
    // exemplo: carregarAlagamentosNoMapa();
}


document.addEventListener('DOMContentLoaded', function() {
    const API_BASE_URL = 'https://alerta-alagamentos-sls.onrender.com/api';

    // --- Menu mobile ---
    const botaoMenu = document.querySelector('.botao-menu-mobile');
    const menu = document.querySelector('.menu');
    
    botaoMenu.addEventListener('click', function() {
        menu.classList.toggle('ativo');
        this.innerHTML = menu.classList.contains('ativo') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
    
    // --- Atualização do painel (mantido por enquanto, pode ser integrado à API depois) ---
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
    
    // --- Formulário de relato (será integrado à API em breve) ---
    const formularioRelato = document.querySelector('.formulario-relato'); 
    if (formularioRelato) {
        formularioRelato.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const localizacao = this.querySelector('#localizacao').value;
            const gravidade = this.querySelector('#gravidade').value;
            
            if (!localizacao || !gravidade) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Atenção',
                    text: 'Por favor, preencha todos os campos obrigatórios!',
                    confirmButtonColor: '#010101'
                });
                return;
            }
            
            console.log('Relato enviado:', { localizacao, gravidade });
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Relato enviado com sucesso! Obrigado por contribuir.',
                confirmButtonColor: '#010101'
            });
            this.reset();
        });
    }
    
    // --- Pesquisa ---
    const pesquisa = document.querySelector('.caixa-pesquisa');
    if (pesquisa) {
        const campoPesquisa = pesquisa.querySelector('input');
        const botaoPesquisa = pesquisa.querySelector('.botao-pesquisa');
        
        botaoPesquisa.addEventListener('click', function() {
            if (campoPesquisa.value.trim()) {
                console.log(`Buscando por: ${campoPesquisa.value}`);
                Swal.fire({
                    icon: 'info',
                    title: 'Pesquisa',
                    text: `Resultados para: ${campoPesquisa.value}`,
                    confirmButtonColor: '#010101'
                });
            }
        });
        
        campoPesquisa.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                console.log(`Buscando por: ${this.value}`);
                Swal.fire({
                    icon: 'info',
                    title: 'Pesquisa',
                    text: `Resultados para: ${this.value}`,
                    confirmButtonColor: '#010101'
                });
            }
        });
    }
    
    // --- Navegação suave ---
    const linksMenu = document.querySelectorAll('.link-menu');
    linksMenu.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const destino = this.getAttribute('href');
            // Fechar menu mobile se estiver ativo
            menu.classList.remove('ativo');
            botaoMenu.innerHTML = '<i class="fas fa-bars"></i>';

            if (destino.startsWith('index.html#') || destino.startsWith('#')) {
                const targetId = destino.split('#')[1];
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            } else {
                window.location.href = destino;
            }
        });
    });
    
    // --- Efeito no cabeçalho ao rolar ---
    window.addEventListener('scroll', function() {
        const scroll = window.scrollY;
        const cabecalho = document.querySelector('.cabecalho');
        
        if (scroll > 100) {
            cabecalho.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        } else {
            cabecalho.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });

    atualizarPainel(); 
});
