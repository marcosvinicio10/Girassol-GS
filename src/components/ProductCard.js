class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['id', 'name', 'price', 'image', 'brand', 'description', 'production-time'];
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
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
        
        // Detectar se está na página de produto para ajustar o caminho
        const isProductPage = window.location.pathname.includes('produto.html');
        const productPagePath = isProductPage ? 'produto.html' : 'src/pages/produto.html';
        
        window.location.href = productPagePath;
    }

    render() {
        const name = this.getAttribute('name');
        const price = this.getAttribute('price');
        const image = this.getAttribute('image');
        const brand = this.getAttribute('brand');
        const description = this.getAttribute('description');
        const id = this.getAttribute('id');

        // Detectar se está na página de produto para ajustar o caminho do CSS
        const isProductPage = window.location.pathname.includes('produto.html');
        const cssPath = isProductPage ? '../../styles/product-card.css' : '/styles/product-card.css';

        this.shadowRoot.innerHTML = `
            <style>
                @import url('${cssPath}');
            </style>

            <div class="product-card">
                <img src="${image}" alt="${name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${name}</h3>
                    <p class="product-description">${description}</p>
                    <div class="product-price">
                        R$ ${parseFloat(price).toFixed(2)}
                        <button class="button">
                            <svg viewBox="0 0 16 16" class="bi bi-cart-check" height="24" width="24" xmlns="http://www.w3.org/2000/svg" fill="#fff">
                                <path d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"></path>
                                <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
                            </svg>
                            <p class="text">Comprar</p>
                        </button>
                    </div>
                    <div class="favorite">
                        <input type="checkbox" id="favorite-${id}" class="favorite-checkbox">
                        <label for="favorite-${id}" class="favorite-label">
                            <i class="fas fa-heart"></i>
                        </label>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const card = this.shadowRoot.querySelector('.product-card');
        const buyBtn = this.shadowRoot.querySelector('.button');
        const productImage = this.shadowRoot.querySelector('.product-image');
        const favoriteCheckbox = this.shadowRoot.querySelector('.favorite-checkbox');

        // Evento para o botão de comprar
        buyBtn.addEventListener('click', () => {
            this.navigateToProduct();
        });

        // Evento para a imagem do produto
        productImage.addEventListener('click', (e) => {
            e.stopPropagation();
            this.navigateToProduct();
        });

        // Evento para o card inteiro
        card.addEventListener('click', (e) => {
            // Não navegar se o clique foi em um botão ou no checkbox
            if (!e.target.closest('.button') && !e.target.closest('.favorite-checkbox')) {
                this.navigateToProduct();
            }
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
}

customElements.define('product-card', ProductCard); 