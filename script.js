// Sample products data
const products = [
    {
        id: 1,
        name: "Buquê de Rosas",
        price: 89.90,
        image: "assets/fotoflor.png"
    },
    {
        id: 2,
        name: "Arranjo de Girassóis",
        price: 79.90,
        image: "assets/fotoflor.png"
    },
    {
        id: 3,
        name: "Orquídea Phalaenopsis",
        price: 129.90,
        image: "assets/fotoflor.png"
    },
    {
        id: 4,
        name: "Cesta de Flores",
        price: 149.90,
        image: "assets/fotoflor.png"
    }
];

// Cart functionality
let cart = [];

// Display products
function displayProducts() {
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                <div class="product-buttons">
                    <button class="buy-button" onclick="addToCart(${product.id})">Comprar</button>
                    <button class="details-button" onclick="showDetails(${product.id})">Detalhes</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Add to cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartCount();
        showNotification('Produto adicionado ao carrinho!');
    }
}

// Update cart count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.length;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Show product details
function showDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        alert(`Detalhes do produto: ${product.name}\nPreço: R$ ${product.price.toFixed(2)}`);
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCartCount();
});

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
}); 