// Insere o cabeçalho com efeito vidro em todas as páginas
const headerHTML = `
 <header class="header">
                <div class="header-content">
                    <div class="logo">
                        <h1>Girassol</h1>
                    </div>
                    <nav class="nav-menu">
                        <ul>
                            <li><a href="/index.html"><i class="fas fa-home nav-icon"></i><span class="nav-text">Início</span></a></li>
                            <li><a href="/index.html#produtos"><i class="fas fa-shopping-bag nav-icon"></i><span class="nav-text">Produtos</span></a></li>
                            <li><a href="/index.html#contato"><i class="fas fa-envelope nav-icon"></i><span class="nav-text">Contato</span></a></li>
                            <li>
                                <div class="cart-icon" id="cartIcon">
                                    <i class="fas fa-shopping-cart"></i>
                                    <span class="cart-count">0</span>
                                </div>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
`;

document.addEventListener('DOMContentLoaded', function() {
    const headerDiv = document.getElementById('header-placeholder');
    if (headerDiv) {
        headerDiv.innerHTML = headerHTML;
    }
});

class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.atualizarContadorCarrinho();
    }

    render() {
        this.innerHTML = `
            <header class="header">
                <div class="header-content">
                    <div class="logo">
                        <h1>Girassol</h1>
                    </div>
                    <nav class="nav-menu">
                        <ul>
                            <li><a href="/index.html"><i class="fas fa-home nav-icon"></i><span class="nav-text">Início</span></a></li>
                            <li><a href="/index.html#produtos"><i class="fas fa-shopping-bag nav-icon"></i><span class="nav-text">Produtos</span></a></li>
                            <li><a href="/index.html#contato"><i class="fas fa-envelope nav-icon"></i><span class="nav-text">Contato</span></a></li>
                            <li>
                                <a href="/src/pages/carrinho.html" class="cart-icon" id="cartIcon">
                                    <i class="fas fa-shopping-cart"></i>
                                    <span class="cart-count">0</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        `;
    }

    setupEventListeners() {
        // Atualizar contador quando o carrinho mudar
        window.addEventListener('storage', (e) => {
            if (e.key === 'carrinho') {
                this.atualizarContadorCarrinho();
            }
        });

        // Atualizar contador quando a página carregar
        document.addEventListener('DOMContentLoaded', () => {
            this.atualizarContadorCarrinho();
        });
    }

    atualizarContadorCarrinho() {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const totalItems = carrinho.reduce((total, item) => total + item.quantidade, 0);
        const cartCount = this.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    }
}

customElements.define('header-component', Header); 