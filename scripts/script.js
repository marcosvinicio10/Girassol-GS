// Exemplo de produtos separados por categoria
const products = [
  {
    id: 1,
    name: "Buquê de Rosas",
    price: 89.90,
    desc: "Rosas vermelhas frescas, perfeitas para presentear.",
    image: "../assets/fotoflor.png",
    category: "buques"
  },
  {
    id: 2,
    name: "Buquê de Girassóis",
    price: 79.90,
    desc: "Girassóis vibrantes para alegrar o dia.",
    image: "../assets/fotoflor.png",
    category: "buques"
  },
  {
    id: 3,
    name: "Arranjo Primavera",
    price: 129.90,
    desc: "Arranjo colorido com flores da estação.",
    image: "../assets/fotoflor.png",
    category: "arranjos"
  },
  {
    id: 4,
    name: "Arranjo de Orquídeas",
    price: 149.90,
    desc: "Orquídeas elegantes em vaso decorativo.",
    image: "../assets/fotoflor.png",
    category: "arranjos"
  },
  {
    id: 5,
    name: "Cesta de Café",
    price: 99.90,
    desc: "Cesta com flores e delícias para o café da manhã.",
    image: "../assets/fotoflor.png",
    category: "presentes"
  },
  {
    id: 6,
    name: "Kit Spa Floral",
    price: 119.90,
    desc: "Presenteie com flores e autocuidado.",
    image: "../assets/fotoflor.png",
    category: "presentes"
  }
];

function createProductCard(product) {
  return `
    <div class="product-card" data-id="${product.id}">
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <div class="product-info">
        <div class="product-title">${product.name}</div>
        <div class="product-price">R$ ${product.price.toFixed(2)}</div>
        <div class="product-desc">${product.desc}</div>
        <div class="product-actions">
          <button class="cart-btn" title="Adicionar ao carrinho"><i class="fa-solid fa-cart-plus"></i></button>
          <button class="like-btn" title="Curtir"><i class="fa-regular fa-heart"></i></button>
        </div>
      </div>
    </div>
  `;
}

function displayCarousels() {
  const buques = products.filter(p => p.category === "buques");
  const arranjos = products.filter(p => p.category === "arranjos");
  const presentes = products.filter(p => p.category === "presentes");

  document.getElementById('carousel-buques').innerHTML = buques.map(createProductCard).join('');
  document.getElementById('carousel-arranjos').innerHTML = arranjos.map(createProductCard).join('');
  document.getElementById('carousel-presentes').innerHTML = presentes.map(createProductCard).join('');

  // Like button animation
  document.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.toggle('liked');
      const icon = this.querySelector('i');
      if(this.classList.contains('liked')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
      } else {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
      }
    });
  });
  // Carrinho (exemplo de ação)
  document.querySelectorAll('.cart-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      alert('Produto adicionado ao carrinho!');
    });
  });
}

document.addEventListener('DOMContentLoaded', displayCarousels); 