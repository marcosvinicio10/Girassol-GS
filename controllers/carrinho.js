class CarrinhoManager {
    constructor() {
        this.carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        this.carrinhoItems = document.querySelector('.carrinho-items');
        this.carrinhoVazio = document.querySelector('.carrinho-vazio');
        this.subtotalElement = document.getElementById('subtotal');
        this.freteElement = document.getElementById('frete');
        this.totalElement = document.getElementById('total');
        
        this.init();
    }

    init() {
        this.renderizarCarrinho();
        this.atualizarResumo();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.querySelector('.finalizar-compra-btn').addEventListener('click', () => {
            if (this.carrinho.length > 0) {
                alert('Compra finalizada com sucesso!');
                this.limparCarrinho();
            }
        });
    }

    renderizarCarrinho() {
        if (this.carrinho.length === 0) {
            this.carrinhoItems.style.display = 'none';
            this.carrinhoVazio.style.display = 'block';
            return;
        }

        this.carrinhoItems.style.display = 'block';
        this.carrinhoVazio.style.display = 'none';
        this.carrinhoItems.innerHTML = '';

        this.carrinho.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'carrinho-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <span class="preco">R$ ${item.price.toFixed(2)}</span>
                    <div class="item-quantidade">
                        <button class="quantidade-btn" data-action="decrease" data-index="${index}">-</button>
                        <span class="quantidade-valor">${item.quantidade}</span>
                        <button class="quantidade-btn" data-action="increase" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="remover-item" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            this.carrinhoItems.appendChild(itemElement);
        });

        // Adicionar event listeners para os botões
        this.carrinhoItems.querySelectorAll('.quantidade-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                const index = parseInt(e.target.dataset.index);
                this.atualizarQuantidade(index, action);
            });
        });

        this.carrinhoItems.querySelectorAll('.remover-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.remover-item').dataset.index);
                this.removerItem(index);
            });
        });
    }

    atualizarQuantidade(index, action) {
        if (action === 'increase') {
            this.carrinho[index].quantidade++;
        } else if (action === 'decrease' && this.carrinho[index].quantidade > 1) {
            this.carrinho[index].quantidade--;
        }

        this.salvarCarrinho();
        this.renderizarCarrinho();
        this.atualizarResumo();
    }

    removerItem(index) {
        this.carrinho.splice(index, 1);
        this.salvarCarrinho();
        this.renderizarCarrinho();
        this.atualizarResumo();
    }

    atualizarResumo() {
        const subtotal = this.carrinho.reduce((total, item) => {
            return total + (item.price * item.quantidade);
        }, 0);

        const frete = subtotal > 0 ? 15 : 0;
        const total = subtotal + frete;

        this.subtotalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
        this.freteElement.textContent = `R$ ${frete.toFixed(2)}`;
        this.totalElement.textContent = `R$ ${total.toFixed(2)}`;
    }

    salvarCarrinho() {
        localStorage.setItem('carrinho', JSON.stringify(this.carrinho));
    }

    limparCarrinho() {
        this.carrinho = [];
        this.salvarCarrinho();
        this.renderizarCarrinho();
        this.atualizarResumo();
    }
}

// Inicializar o gerenciador do carrinho quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new CarrinhoManager();
}); 