// Dados dos produtos
const products = [
  {
    id: 1,
    name: "Buquê de Rosas",
    price: 89.90,
    image: "../assets/fotoflor.png"
  },
  {
    id: 2,
    name: "Arranjo de Girassóis",
    price: 79.90,
    image: "../assets/fotoflor.png"
  },
  {
    id: 3,
    name: "Orquídea Phalaenopsis",
    price: 129.90,
    image: "../assets/fotoflor.png"
  },
  {
    id: 4,
    name: "Cesta de Flores",
    price: 149.90,
    image: "../assets/fotoflor.png"
  }
];

function displayProducts() {
  const productsCarousel = document.getElementById('carousel-buques');
  if (!productsCarousel) return;
  productsCarousel.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="image-container">
        <img src="${product.image}" alt="${product.name}" />
        <div class="price">R$ ${product.price.toFixed(2)}</div>
      </div>
      <label class="favorite">
        <input type="checkbox">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000000">
          <path d="M12 20a1 1 0 0 1-.437-.1C11.214 19.73 3 15.671 3 9a5 5 0 0 1 8.535-3.536l.465.465.465-.465A5 5 0 0 1 21 9c0 6.646-8.212 10.728-8.562 10.9A1 1 0 0 1 12 20z"></path>
        </svg>
      </label>
      <div class="content">
        <div class="brand">Girassol</div>
        <div class="product-name">${product.name}</div>
        <div class="button-container">
          <button class="buy-button button">Comprar</button>
          <button class="cart-button button">
            <svg viewBox="0 0 27.97 25.074" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,1.175A1.173,1.173,0,0,1,1.175,0H3.4A2.743,2.743,0,0,1,5.882,1.567H26.01A1.958,1.958,0,0,1,27.9,4.035l-2.008,7.459a3.532,3.532,0,0,1-3.4,2.61H8.36l.264,1.4a1.18,1.18,0,0,0,1.156.955H23.9a1.175,1.175,0,0,1,0,2.351H9.78a3.522,3.522,0,0,1-3.462-2.865L3.791,2.669A.39.39,0,0,0,3.4,2.351H1.175A1.173,1.173,0,0,1,0,1.175ZM6.269,22.724a2.351,2.351,0,1,1,2.351,2.351A2.351,2.351,0,0,1,6.269,22.724Zm16.455-2.351a2.351,2.351,0,1,1-2.351,2.351A2.351,2.351,0,0,1,22.724,20.373Z" id="cart-shopping-solid"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
    productsCarousel.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', displayProducts); 