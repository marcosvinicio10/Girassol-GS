export function gerarLinkWhatsApp() {
    const numeroWhatsApp = "5521964916258";
    const baseUrl = `https://wa.me/${numeroWhatsApp}?text=`;
    
    // Verifica em qual página está
    if (window.location.pathname.includes('produto')) {
        // Página de produto
        const nomeProduto = document.querySelector('.produto-titulo')?.textContent;
        const precoProduto = document.querySelector('.produto-preco')?.textContent;
        
        if (!nomeProduto || !precoProduto) {
            console.error('Elementos do produto não encontrados');
            return null;
        }

        const mensagem = `Novo Pedido!\nItem: ${nomeProduto}\nPreço: ${precoProduto}\nData da Entrega: Digite Aqui`;
        return baseUrl + encodeURIComponent(mensagem);
    } else if (window.location.pathname.includes('carrinho')) {
        // Página do carrinho
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        
        if (carrinho.length === 0) {
            console.log('Carrinho vazio');
            return null;
        }

        // Formata os itens do carrinho
        const itensFormatados = carrinho.map(item => 
            `${item.name}${item.quantidade > 1 ? `x${item.quantidade}` : ''}`
        ).join(', ');

        // Calcula o preço total
        const precoTotal = carrinho.reduce((total, item) => 
            total + (item.price * item.quantidade), 0
        ).toFixed(2);

        const mensagem = `Novo Pedido\nItens: ${itensFormatados}\nPreço Total: R$ ${precoTotal}\nData de Entrega: Digite aqui`;
        return baseUrl + encodeURIComponent(mensagem);
    }

    console.log('Página não reconhecida');
    return null;
}

// Função para atualizar os botões com os links do WhatsApp
function atualizarBotoesWhatsApp() {
    const link = gerarLinkWhatsApp();
    
    if (link) {
        // Atualiza o botão de comprar na página de produto
        const botaoComprar = document.querySelector('.comprar-btn');
        if (botaoComprar) {
            botaoComprar.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(link, '_blank');
            });
        }

        // Atualiza o botão de finalizar na página do carrinho
        const botaoFinalizar = document.querySelector('.finalizar-pedido-btn');
        if (botaoFinalizar) {
            botaoFinalizar.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(link, '_blank');
            });
        }
    }
}

// Executa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', atualizarBotoesWhatsApp); 