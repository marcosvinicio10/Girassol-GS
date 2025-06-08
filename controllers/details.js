function showDetails(productId) {
  const product = products.find(p => p.id === productId);
  if (product) {
    alert(`Detalhes do produto: ${product.name}\nPreço: R$ ${product.price.toFixed(2)}`);
  }
} 