// Carrinho
let cart = [];

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    cart.push(product);
    updateCartCount();
    showNotification('Produto adicionado ao carrinho!');
  }
}

function updateCartCount() {
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) cartCount.textContent = cart.length;
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.remove();
  }, 3000);
} 