(function () {
  function productUrl(id) {
    return `pages/product.html?id=${encodeURIComponent(id)}`;
  }

  function renderCard(p) {
    const price = window.formatBRL ? window.formatBRL(p.price) : `R$ ${p.price}`;
    const wa = (window.__GIRASSOL_SITE__ && window.__GIRASSOL_SITE__.whatsapp) || "5521964916258";
    const imgSrc = window.GirassolCatalog.assetUrlForHtml(p.image, false);
    return `
      <article class="catalog-card" data-animate="fade-up">
        <div class="catalog-card__frame">
          <a href="${productUrl(p.id)}" class="catalog-card__media">
            <img src="${imgSrc}" alt="${escapeHtml(p.title)}" width="400" height="500" loading="lazy">
            <span class="catalog-card__shine" aria-hidden="true"></span>
            <span class="catalog-card__category">${escapeHtml(p.categoryLabel)}</span>
          </a>
          <div class="catalog-card__body">
            <h3 class="catalog-card__title">
              <a href="${productUrl(p.id)}">${escapeHtml(p.title)}</a>
            </h3>
            <div class="catalog-card__price-row">
              <span class="catalog-card__price">${price}</span>
              <span class="catalog-card__ref">#${escapeHtml(p.id)}</span>
            </div>
            <div class="catalog-card__actions">
              <a href="https://wa.me/${wa}?text=${encodeURIComponent(`Olá! Tenho interesse em: ${p.title}`)}" class="catalog-card__btn catalog-card__btn--wa" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp sobre ${escapeHtml(p.title)}">
                <span class="material-symbols-outlined text-[17px] sm:text-[18px]">chat</span>
                <span class="hidden sm:inline">WhatsApp</span>
              </a>
              <a href="${productUrl(p.id)}" class="catalog-card__btn catalog-card__btn--view">Ver</a>
            </div>
          </div>
        </div>
      </article>`;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function filterProducts(products, category) {
    if (!category || category === "todos") return products;
    return products.filter((p) => p.category === category);
  }

  /** Distribui produtos em 3 fileiras (0,3,6… | 1,4,7… | 2,5,8…). */
  function splitIntoRows(items, rowCount) {
    const rows = Array.from({ length: rowCount }, () => []);
    items.forEach((item, i) => rows[i % rowCount].push(item));
    return rows;
  }

  function renderCatalogRows(list) {
    return splitIntoRows(list, 3)
      .filter((row) => row.length > 0)
      .map(
        (row, index) => `
      <div class="catalog-row" role="list" aria-label="Fileira ${index + 1} de produtos">
        ${row.map(renderCard).join("")}
      </div>`
      )
      .join("");
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const grid = document.getElementById("catalog-grid");
    const filters = document.getElementById("catalog-filters");
    if (!grid || !filters) return;

    let products = [];
    try {
      const data = await window.GirassolCatalog.fetchCatalog("data/products.json");
      products = data.products;
    } catch {
      grid.innerHTML =
        '<p class="col-span-full text-center font-body-md text-body-md text-error py-12">Não foi possível carregar o catálogo. Verifique se está abrindo o site por um servidor local (por exemplo, Live Server).</p>';
      return;
    }

    let active = "todos";

    function render() {
      const list = filterProducts(products, active);
      grid.classList.toggle("catalog-grid--empty", list.length === 0);
      grid.innerHTML = list.length
        ? renderCatalogRows(list)
        : '<p class="catalog-grid-empty col-span-full text-center font-body-md text-body-md text-on-surface-variant py-12">Nenhum produto nesta categoria.</p>';

      if (window.GirassolAnimations) window.GirassolAnimations.observe(grid);
    }

    filters.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        active = btn.getAttribute("data-filter") || "todos";
        filters.querySelectorAll("[data-filter]").forEach((b) => {
          const on = b.getAttribute("data-filter") === active;
          b.classList.toggle("border-primary", on);
          b.classList.toggle("bg-primary-container", on);
          b.classList.toggle("text-on-primary-container", on);
          b.classList.toggle("border-outline-variant", !on);
          b.classList.toggle("text-on-surface-variant", !on);
          b.setAttribute("aria-pressed", on ? "true" : "false");
        });
        render();
      });
    });

    render();
  });
})();
