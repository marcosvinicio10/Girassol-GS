document.addEventListener('DOMContentLoaded', () => {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const carrinhoItems = document.querySelector('.carrinho-items');
    const carrinhoVazio = document.querySelector('.carrinho-vazio');
    const carrinhoGrid = document.querySelector('.carrinho-grid');

    function atualizarCarrinho() {
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
                        <button class="quantidade-btn" onclick="alterarQuantidade(${item.id}, -1)">-</button>
                        <span class="quantidade-valor">${item.quantidade}</span>
                        <button class="quantidade-btn" onclick="alterarQuantidade(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="item-remover" onclick="removerItem(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        atualizarResumo();
    }

    function atualizarResumo() {
        const subtotal = carrinho.reduce((total, item) => total + (item.price * item.quantidade), 0);
        const total = subtotal;

        document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
        document.getElementById('total').textContent = `R$ ${total.toFixed(2)}`;
    }

    window.alterarQuantidade = (id, delta) => {
        const item = carrinho.find(item => item.id === id);
        if (item) {
            item.quantidade = Math.max(1, item.quantidade + delta);
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            atualizarCarrinho();
            window.dispatchEvent(new Event('carrinhoAtualizado'));
        }
    };

    window.removerItem = (id) => {
        const index = carrinho.findIndex(item => item.id === id);
        if (index !== -1) {
            carrinho.splice(index, 1);
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            atualizarCarrinho();
            window.dispatchEvent(new Event('carrinhoAtualizado'));
        }
    };

    document.querySelector('.finalizar-pedido-btn').addEventListener('click', () => {
        if (carrinho.length > 0) {
            alert('Pedido finalizado com sucesso!');
            localStorage.removeItem('carrinho');
            atualizarCarrinho();
            window.dispatchEvent(new Event('carrinhoAtualizado'));
        }
    });

    atualizarCarrinho();
}); 