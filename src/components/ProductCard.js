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

    render() {
        const product = JSON.parse(this.getAttribute('product') || '{}');
        
        this.shadowRoot.innerHTML = `
            <style>
                @import url('/styles/product-card.css');
            </style>
            
            <div class="card">
                <div class="image-container">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="price">${this.formatPrice(product.price)}</div>
                    <label class="favorite">
                        <input type="checkbox">
                        <svg viewBox="0 0 24 24" width="19" height="19">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </label>
                </div>
                
                <div class="content">
                    <div class="brand">${product.brand}</div>
                    <div class="product-name">${product.name}</div>
                    
                
                <div class="button-container">
                    <button class="button buy-button">Comprar</button>
                    <button class="button cart-button">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        // Adicionar eventos
        const favoriteInput = this.shadowRoot.querySelector('.favorite input');
        favoriteInput.addEventListener('change', (e) => {
            const svg = e.target.nextElementSibling;
            if (e.target.checked) {
                svg.style.fill = '#ffd426';
                svg.style.animation = 'bouncing 0.5s ease-in-out';
            } else {
                svg.style.fill = '';
                svg.style.animation = '';
            }
        });

        const buyButton = this.shadowRoot.querySelector('.buy-button');
        buyButton.addEventListener('click', () => {
            // Implementar lógica de compra
            console.log('Comprar:', product);
        });

        const cartButton = this.shadowRoot.querySelector('.cart-button');
        cartButton.addEventListener('click', () => {
            // Implementar lógica do carrinho
            console.log('Adicionar ao carrinho:', product);
        });
    }
}

customElements.define('product-card', ProductCard); 