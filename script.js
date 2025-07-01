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
    const API_BASE_URL = 'https://alerta-alagamentos-sls.onrender.com/api'; // Sua URL base da API

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
    
    // --- Formulário de relato
   const formularioRelato = document.querySelector('.formulario-relato');
    if (formularioRelato) {
        formularioRelato.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // 1. Coletar dados do formulário
            const localizacaoInput = document.getElementById('localizacao').value.trim();
            const ruaAfetadaInput = document.getElementById('ruaAfetada').value.trim(); 
            const gravidadeInput = document.getElementById('gravidade').value; // Será usado para 'impactos'
            const observacoesInput = document.getElementById('observacoes').value.trim(); // Novo campo 'observacoes'

            const dataOcorrencia = new Date().toISOString();

            // 2. Validação frontend
            if (!localizacaoInput || !gravidadeInput || !ruaAfetadaInput) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Atenção',
                    text: 'Por favor, preencha todos os campos obrigatórios (Bairro, Rua Afetada e Gravidade)!',
                    confirmButtonColor: '#010101'
                });
                return;
            }

            // 3. Preparar os dados para envio (sem latitude/longitude)
            const relatoData = {
                data_alagamento: dataOcorrencia,
                bairro: localizacaoInput,
                rua_avenida: ruaAfetadaInput, 
                impactos: gravidadeInput,   
                observacoes: observacoesInput, 
            };

            // 4. Obter o token de autenticação
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                Swal.fire({
                    icon: 'info',
                    title: 'Não autenticado',
                    text: 'Você precisa estar logado para relatar um alagamento.',
                    confirmButtonColor: '#010101'
                });
                return;
            }

            // 5. Enviar para a API
            try {
                Swal.fire({
                    title: 'Enviando Relato...',
                    text: 'Por favor, aguarde.',
                    icon: 'info',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                const response = await fetch(`${API_BASE_URL}/complaints`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify(relatoData) // Envia os dados como JSON
                });

                const responseData = await response.json();

                if (response.ok) { // Status 2xx
                    Swal.fire({
                        icon: 'success',
                        title: 'Relato Enviado!',
                        text: 'Seu relato de alagamento foi enviado com sucesso. Obrigado por contribuir!',
                        confirmButtonColor: '#010101'
                    });
                    formularioRelato.reset(); // Limpa o formulário
                } else { // Erro da API
                    let errorMessage = 'Ocorreu um erro ao enviar o relato. Tente novamente.';
                    if (responseData && responseData.message) {
                        errorMessage = responseData.message;
                    } else if (response.status === 401 || response.status === 403) {
                         errorMessage = 'Sessão expirada ou não autorizado. Faça login novamente.';
                    }

                    Swal.fire({
                        icon: 'error',
                        title: 'Erro no Envio',
                        text: errorMessage,
                        confirmButtonColor: '#010101'
                    });
                }

            } catch (error) {
                console.error('Erro na requisição de relato:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro de Conexão',
                    text: 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
                    confirmButtonColor: '#010101'
                });
            }
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
