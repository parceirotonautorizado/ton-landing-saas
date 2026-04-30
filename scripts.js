/**
 * Scripts da Landing Page Ton
 * Funcionalidades: Seleção de recebimento, FAQ accordion, Scroll suave
 */

// Selecionar tipo de recebimento (1 dia útil / Na hora)
function selecionarRecebimento(elemento) {
    document.querySelectorAll('.card-recebimento').forEach(function(card) {
        card.classList.remove('ativo');
        card.setAttribute('aria-pressed', 'false');
    });
    elemento.classList.add('ativo');
    elemento.setAttribute('aria-pressed', 'true');
}

// FAQ - Abrir/Fechar perguntas
function toggleFaq(elemento) {
    var faqItem = elemento.parentElement;
    var estavaAberto = faqItem.classList.contains('aberto');

    // Fecha todos os itens do FAQ
    document.querySelectorAll('.faq-item').forEach(function(item) {
        item.classList.remove('aberto');
        var btn = item.querySelector('.faq-pergunta');
        if (btn) btn.setAttribute('aria-expanded', 'false');
    });

    // Abre o item clicado se não estava aberto
    if (!estavaAberto) {
        faqItem.classList.add('aberto');
        elemento.setAttribute('aria-expanded', 'true');
    }
}

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    // Suporte a teclado nos cards de recebimento
    document.querySelectorAll('.card-recebimento').forEach(function(card) {
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selecionarRecebimento(this);
            }
        });
    });

    // Suporte a teclado nas perguntas do FAQ
    document.querySelectorAll('.faq-pergunta').forEach(function(btn) {
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFaq(this);
            }
        });
    });

    // Scroll suave para links com âncora (#) — usando passive para melhor performance
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var headerOffset = 80;
                var offsetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        }, { passive: false });
    });

    console.log('✅ Landing Page Ton carregada com sucesso!');
});

// ============================================================
// BANNER DE COOKIES LGPD
// Regra 6 da Diretriz de Criação de Website:
// - Checkboxes opcionais desmarcados por padrão
// - Usuário pode gerenciar preferências
// - Cookies necessários sempre ativos
// ============================================================

(function() {
    var CHAVE_STORAGE = 'ton_cookie_consent';

    function salvarConsentimento(analiticos, marketing) {
        try {
            localStorage.setItem(CHAVE_STORAGE, JSON.stringify({
                necessario: true,
                analiticos: analiticos,
                marketing: marketing,
                data: new Date().toISOString()
            }));
        } catch(e) {}
    }

    function ocultarBanner() {
        var banner = document.getElementById('cookie-banner');
        if (!banner) return;
        // 1. Desliza para baixo via CSS transition
        banner.style.transform = 'translateY(100%)';
        // 2. Após a transição terminar, esconde de vez
        setTimeout(function() {
            banner.style.display = 'none';
        }, 420);
    }

    function exibirBanner() {
        var banner = document.getElementById('cookie-banner');
        if (!banner) return;
        // Garante que está visível e posicionado fora da tela antes de animar
        banner.style.display = 'block';
        banner.style.transform = 'translateY(100%)';
        // Um frame para o browser registrar o estado inicial antes de animar
        requestAnimationFrame(function() {
            banner.style.transform = 'translateY(0)';
        });
    }

    function reabrirBanner() {
        // Restaura checkboxes para o estado salvo
        try {
            var salvo = JSON.parse(localStorage.getItem(CHAVE_STORAGE) || 'null');
            if (salvo) {
                var chkA = document.getElementById('cookie-analiticos');
                var chkM = document.getElementById('cookie-marketing');
                if (chkA) chkA.checked = !!salvo.analiticos;
                if (chkM) chkM.checked  = !!salvo.marketing;
            }
        } catch(e) {}
        exibirBanner();
    }

    document.addEventListener('DOMContentLoaded', function() {
        var banner      = document.getElementById('cookie-banner');
        var btnAceitar  = document.getElementById('cookie-btn-aceitar');
        var btnRejeitar = document.getElementById('cookie-btn-rejeitar');
        var btnSalvar   = document.getElementById('cookie-btn-salvar');
        var linkPol     = document.getElementById('link-politica-cookies');
        var linkPref    = document.getElementById('link-preferencias-cookies');

        if (!banner) return;

        // Exibe apenas se o usuário ainda não escolheu
        var jaEscolheu = false;
        try { jaEscolheu = !!localStorage.getItem(CHAVE_STORAGE); } catch(e) {}
        if (!jaEscolheu) {
            setTimeout(exibirBanner, 600);
        }

        if (btnAceitar) {
            btnAceitar.addEventListener('click', function() {
                var chkA = document.getElementById('cookie-analiticos');
                var chkM = document.getElementById('cookie-marketing');
                if (chkA) chkA.checked = true;
                if (chkM) chkM.checked  = true;
                salvarConsentimento(true, true);
                ocultarBanner();
            });
        }

        if (btnRejeitar) {
            btnRejeitar.addEventListener('click', function() {
                var chkA = document.getElementById('cookie-analiticos');
                var chkM = document.getElementById('cookie-marketing');
                if (chkA) chkA.checked = false;
                if (chkM) chkM.checked  = false;
                salvarConsentimento(false, false);
                ocultarBanner();
            });
        }

        if (btnSalvar) {
            btnSalvar.addEventListener('click', function() {
                var chkA = document.getElementById('cookie-analiticos');
                var chkM = document.getElementById('cookie-marketing');
                salvarConsentimento(
                    chkA ? chkA.checked : false,
                    chkM ? chkM.checked  : false
                );
                ocultarBanner();
            });
        }

        // Links do rodapé reabrem o banner
        if (linkPol)  linkPol.addEventListener('click',  function(e) { e.preventDefault(); reabrirBanner(); });
        if (linkPref) linkPref.addEventListener('click', function(e) { e.preventDefault(); reabrirBanner(); });
    });
})();
