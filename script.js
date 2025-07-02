
const API_BASE_URL = 'https://alerta-alagamentos-sls.onrender.com/api';

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

function updateAuthButtons() {
    const authToken = localStorage.getItem('authToken');
    const botaoEntrar = document.getElementById('botaoEntrar');
    const botaoCadastrar = document.getElementById('botaoCadastrar');
    const botaoSair = document.getElementById('botaoSair');

    if (authToken) { // Usuário logado
        if (botaoEntrar) botaoEntrar.style.display = 'none';
        if (botaoCadastrar) botaoCadastrar.style.display = 'none';
        if (botaoSair) botaoSair.style.display = 'block'; // Mostra o botão Sair
    } else { // Usuário não logado
        if (botaoEntrar) botaoEntrar.style.display = 'block'; // Mostra Entrar
        if (botaoCadastrar) botaoCadastrar.style.display = 'block'; // Mostra Cadastrar
        if (botaoSair) botaoSair.style.display = 'none'; // Esconde Sair
    }
}

function handleLogout() {
    Swal.fire({
        title: 'Sair?',
        text: "Você tem certeza que deseja sair?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sim, sair!',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('authToken'); // Remove o token
            updateAuthButtons(); // Atualiza a exibição dos botões
            Swal.fire({
                icon: 'success',
                title: 'Desconectado!',
                text: 'Você foi desconectado com sucesso.',
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.href = 'index.html'; 
            });
        }
    });
}

// Função para carregar e exibir as estatísticas
async function carregarEstatisticas() {
    console.log('Atualizando dados do painel de estatísticas...'); 

    try {
        const response = await fetch(`${API_BASE_URL}/complaints`); 
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const complaints = await response.json();

        // 1. Quantidade de denúncias feitas (total de relatos)
        const totalDenuncias = complaints.length;

        // 2. Bairros afetados
        const bairros = complaints.map(complaint => complaint.bairro); // Pega todos os bairros
        const bairrosUnicos = new Set(bairros.filter(Boolean));
        const numBairrosAfetados = bairrosUnicos.size;


        // 4. Relatos hoje (denúncias feitas no dia atual)
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        let relatosHojeCount = 0;
        complaints.forEach(complaint => {
            if (complaint.data_registro) { // Verifica se a data de registro existe
                const dataRegistro = new Date(complaint.data_registro);
                dataRegistro.setHours(0, 0, 0, 0); 
                if (dataRegistro.getTime() === hoje.getTime()) {
                    relatosHojeCount++;
                }
            }
        });

        // Atualizar os elementos HTML com os dados calculados
        document.getElementById('numAlagamentosAtivos').textContent = totalDenuncias;
        document.getElementById('numBairrosAfetados').textContent = numBairrosAfetados;
        document.getElementById('numRelatosHoje').textContent = relatosHojeCount;

    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        document.getElementById('numAlagamentosAtivos').textContent = 'erro ao carregar.';
        document.getElementById('numBairrosAfetados').textContent = 'erro ao carregar.';
        document.getElementById('numRelatosHoje').textContent = 'erro ao carregar.';
    }
}


document.addEventListener('DOMContentLoaded', function() {

    updateAuthButtons();
    carregarEstatisticas();

    const botaoSair = document.getElementById('botaoSair');
    if (botaoSair) {
        botaoSair.addEventListener('click', handleLogout);
    }

    // --- Menu mobile ---
    const botaoMenu = document.querySelector('.botao-menu-mobile');
    const menu = document.querySelector('.menu');
    
    botaoMenu.addEventListener('click', function() {
        menu.classList.toggle('ativo');
        this.innerHTML = menu.classList.contains('ativo') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    function atualizarPainel() {
        console.log('Atualizando dados do painel...');
        
        const cardsAlerta = document.querySelectorAll('.card-alerta');
        cardsAlerta.forEach(card => {
            card.addEventListener('click', function() {
                console.log(`Alerta clicado: ${this.querySelector('h3').textContent}`);

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
            const gravidadeInput = document.getElementById('gravidade').value; 
            const observacoesInput = document.getElementById('observacoes').value.trim(); 

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

            // 3. Preparar os dados para envio
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
        const destino = this.getAttribute('href');
        const targetAttr = this.getAttribute('target'); 

        if (targetAttr === '_blank') {
            const menu = document.querySelector('.menu'); 
            const botaoMenu = document.querySelector('.botao-menu-mobile');
            if (menu && menu.classList.contains('ativo')) {
                 menu.classList.remove('ativo');
                 if (botaoMenu) botaoMenu.innerHTML = '<i class="fas fa-bars"></i>';
            }
            return; 
        }
        
        e.preventDefault();
        
        const menu = document.querySelector('.menu');
        const botaoMenu = document.querySelector('.botao-menu-mobile');
        if (menu && menu.classList.contains('ativo')) {
            menu.classList.remove('ativo');
            if (botaoMenu) botaoMenu.innerHTML = '<i class="fas fa-bars"></i>';
        }

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
