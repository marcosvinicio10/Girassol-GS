document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Carregado');
    
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    console.log('Carrinho carregado:', carrinho);
    
    const carrinhoItems = document.querySelector('.carrinho-items');
    const carrinhoVazio = document.querySelector('.carrinho-vazio');
    const carrinhoGrid = document.querySelector('.carrinho-grid');

    function atualizarCarrinho() {
        console.log('Atualizando carrinho:', carrinho);
        
        if (carrinho.length === 0) {
            carrinhoGrid.style.display = 'none';
            carrinhoVazio.style.display = 'block';
            return;
        }

        carrinhoGrid.style.display = 'grid';
        carrinhoVazio.style.display = 'none';

        carrinhoItems.innerHTML = carrinho.map(item => `
            <div class="carrinho-item" data-id="${item.id}">
                <img src="${item.image.replace('assets/', '../../assets/')}" alt="${item.name}" class="item-imagem">
                <div class="item-info">
                    <span class="item-nome">${item.name}</span>
                    <span class="item-preco">R$ ${item.price.toFixed(2)}</span>
                    <div class="item-quantidade">
                        <button type="button" class="quantidade-btn diminuir" data-id="${item.id}">-</button>
                        <span class="quantidade-valor">${item.quantidade}</span>
                        <button type="button" class="quantidade-btn aumentar" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button type="button" class="item-remover" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        // Adicionar event listeners aos botões
        document.querySelectorAll('.quantidade-btn.diminuir').forEach(btn => {
            btn.onclick = function() {
                console.log('Botão diminuir clicado');
                const id = parseInt(this.dataset.id);
                console.log('ID do item:', id);
                const item = carrinho.find(item => item.id === id);
                console.log('Item encontrado:', item);
                if (item && item.quantidade > 1) {
                    item.quantidade--;
                    console.log('Nova quantidade:', item.quantidade);
                    localStorage.setItem('carrinho', JSON.stringify(carrinho));
                    atualizarCarrinho();
                    window.dispatchEvent(new Event('carrinhoAtualizado'));
                }
            };
        });

        document.querySelectorAll('.quantidade-btn.aumentar').forEach(btn => {
            btn.onclick = function() {
                console.log('Botão aumentar clicado');
                const id = parseInt(this.dataset.id);
                console.log('ID do item:', id);
                const item = carrinho.find(item => item.id === id);
                console.log('Item encontrado:', item);
                if (item) {
                    item.quantidade++;
                    console.log('Nova quantidade:', item.quantidade);
                    localStorage.setItem('carrinho', JSON.stringify(carrinho));
                    atualizarCarrinho();
                    window.dispatchEvent(new Event('carrinhoAtualizado'));
                }
            };
        });

        document.querySelectorAll('.item-remover').forEach(btn => {
            btn.onclick = function() {
                console.log('Botão remover clicado');
                const id = parseInt(this.dataset.id);
                console.log('ID do item:', id);
                if (confirm('Tem certeza que deseja remover este item do carrinho?')) {
                    carrinho = carrinho.filter(item => item.id !== id);
                    console.log('Carrinho após remoção:', carrinho);
                    localStorage.setItem('carrinho', JSON.stringify(carrinho));
                    atualizarCarrinho();
                    window.dispatchEvent(new Event('carrinhoAtualizado'));
                }
            };
        });

        atualizarResumo();
    }

    function atualizarResumo() {
        const subtotal = carrinho.reduce((total, item) => total + (item.price * item.quantidade), 0);
        const total = subtotal;

        document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
        document.getElementById('total').textContent = `R$ ${total.toFixed(2)}`;
    }

    document.querySelector('.finalizar-pedido-btn').addEventListener('click', () => {
        if (carrinho.length > 0) {
            if (confirm('Deseja finalizar o pedido?')) {
                alert('Pedido finalizado com sucesso!');
                carrinho = [];
                localStorage.removeItem('carrinho');
                atualizarCarrinho();
                window.dispatchEvent(new Event('carrinhoAtualizado'));
            }
        }
    });

    // Inicializar o carrinho
    atualizarCarrinho();
}); 