// Insere o cabeçalho com efeito vidro em todas as páginas
const headerHTML = `
<header class="header glass-header">
    <div class="header-content">
        <div class="logo">
            <h1>Girassol</h1>
        </div>
        <nav class="nav-menu">
            <ul>
                <li><a href="../../index.html#home"><span class="nav-icon"><i class="fa-solid fa-house"></i></span><span class="nav-text">Home</span></a></li>
                <li><a href="../../index.html#produtos"><span class="nav-icon"><i class="fa-solid fa-seedling"></i></span><span class="nav-text">Produtos</span></a></li>
            </ul>
        </nav>
        <div class="cart-icon">
            <i class="fas fa-shopping-cart"></i>
            <span class="cart-count">0</span>
        </div>
    </div>
</header>
`;

document.addEventListener('DOMContentLoaded', function() {
    const headerDiv = document.getElementById('header');
    if (headerDiv) {
        headerDiv.innerHTML = headerHTML;
    }
}); 