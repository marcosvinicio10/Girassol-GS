import { gerarLinkWhatsApp } from './whatsapp.js';

function showDetails(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    alert(`Detalhes do produto: ${product.name}\nPreço: R$ ${product.price.toFixed(2)}`);
  }
}

document.querySelector('.comprar-btn').addEventListener('click', (e) => {
    e.preventDefault(); // Previne o comportamento padrão do link
    const link = gerarLinkWhatsApp();
    if (link) {
        window.open(link, '_blank');
    }
}); 