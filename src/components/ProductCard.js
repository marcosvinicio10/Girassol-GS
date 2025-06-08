class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['product'];
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'product' && oldValue !== newValue) {
            this.render();
        }
    }

    formatPrice(price) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    }

    getShortDescription(description) {
        // Retorna os primeiros 60 caracteres da descrição
        return description.length > 60 ? description.substring(0, 60) + '...' : description;
    }

    navigateToProduct() {
        const product = {
            id: this.getAttribute('id'),
            name: this.getAttribute('name'),
            price: parseFloat(this.getAttribute('price')),
            image: this.getAttribute('image'),
            brand: this.getAttribute('brand'),
            description: this.getAttribute('description'),
            productionTime: this.getAttribute('production-time')
        };

        localStorage.setItem('selectedProduct', JSON.stringify(product));
        window.location.href = '/src/pages/produto.html';
    }

    render() {
        const name = this.getAttribute('name');
        const price = this.getAttribute('price');
        const image = this.getAttribute('image');
        const brand = this.getAttribute('brand');
        const description = this.getAttribute('description');
        const id = this.getAttribute('id');

        this.shadowRoot.innerHTML = `
            <style>
                @import url('/styles/product-card.css');
            </style>

            <div class="product-card">
                <img src="${image}" alt="${name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${name}</h3>
                    <p class="product-description">${description}</p>
                    <div class="product-price">R$ ${parseFloat(price).toFixed(2)}</div>
                    <div class="product-actions">
                        <button class="buy-btn">Comprar</button>
                        <button class="cart-btn">Adicionar ao carrinho</button>
                        <div class="favorite">
                            <input type="checkbox" id="favorite-${id}" class="favorite-checkbox">
                            <label for="favorite-${id}" class="favorite-label">
                                <i class="fas fa-heart"></i>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const card = this.shadowRoot.querySelector('.product-card');
        const buyBtn = this.shadowRoot.querySelector('.buy-btn');
        const cartBtn = this.shadowRoot.querySelector('.cart-btn');
        const productImage = this.shadowRoot.querySelector('.product-image');
        const favoriteCheckbox = this.shadowRoot.querySelector('.favorite-checkbox');

        // Evento para o botão de comprar
        buyBtn.addEventListener('click', () => {
            this.navigateToProduct();
        });

        // Evento para o botão de adicionar ao carrinho
        cartBtn.addEventListener('click', () => {
            this.adicionarAoCarrinho();
        });

        // Evento para a imagem do produto
        productImage.addEventListener('click', () => {
            this.navigateToProduct();
        });

        // Evento para o checkbox de favorito
        favoriteCheckbox.addEventListener('change', (e) => {
            const icon = e.target.nextElementSibling.querySelector('i');
            if (e.target.checked) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        });
    }

    adicionarAoCarrinho() {
        const product = {
            id: this.getAttribute('id'),
            name: this.getAttribute('name'),
            price: parseFloat(this.getAttribute('price')),
            image: this.getAttribute('image'),
            brand: this.getAttribute('brand'),
            description: this.getAttribute('description'),
            productionTime: this.getAttribute('production-time')
        };

        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        
        // Verificar se o produto já está no carrinho
        const produtoExistente = carrinho.find(item => item.id === product.id);
        
        if (produtoExistente) {
            produtoExistente.quantidade++;
        } else {
            carrinho.push({
                ...product,
                quantidade: 1
            });
        }
        
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        
        // Mostrar mensagem de sucesso
        alert('Produto adicionado ao carrinho!');
    }
}

customElements.define('product-card', ProductCard); 