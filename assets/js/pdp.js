(function () {
  function qs(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function productHref(id) {
    return `product.html?id=${encodeURIComponent(id)}`;
  }

  function homeHref() {
    return "../index.html";
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const root = document.getElementById("pdp-root");
    if (!root || !window.GirassolCatalog) return;

    let data;
    try {
      data = await window.GirassolCatalog.fetchCatalog("../data/products.json");
    } catch {
      root.innerHTML =
        '<p class="font-body-md text-error py-12">Abra este arquivo via servidor local para carregar os dados do produto (fetch exige HTTP).</p>';
      return;
    }

    const idParam = qs("id");
    const id = idParam != null && idParam !== "" ? String(idParam) : "1";
    const p = data.byId[id];
    if (!p) {
      root.innerHTML = `<p class="font-body-md text-on-surface-variant py-12">Produto não encontrado. <a class="text-primary underline" href="${homeHref()}">Voltar ao início</a></p>`;
      return;
    }

    const siteName = data.site.name || "Girassol GS";
    document.title = `${p.title} — ${siteName}`;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", p.shortDescription || p.description);

    const wa = data.site.whatsapp || "5521964916258";
    const heroSrc = window.GirassolCatalog.assetUrlForHtml(p.image, true);
    const cartImageSrc = p.image;

    const brandBadges = p.brand
      ? `<span class="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-md text-label-md">${escapeHtml(p.brand)}</span>`
      : "";

    const highlights = [];
    if (p.productionTime) {
      highlights.push({
        icon: "schedule",
        text: `Prazo de produção: ${p.productionTime}`,
      });
    }
    highlights.push({ icon: "local_shipping", text: "Entrega combinada no Rio" });
    highlights.push({ icon: "verified", text: "Flores e embalagens selecionadas" });

    const highlightsHtml = highlights
      .map(
        (h) => `
        <li class="flex items-center gap-3 text-on-surface-variant font-label-md text-label-md">
          <span class="material-symbols-outlined text-secondary text-[20px]" data-fill="1">${h.icon}</span>
          ${escapeHtml(h.text)}
        </li>`
      )
      .join("");

    root.innerHTML = `
      <nav class="mb-8 flex flex-wrap items-center gap-2 text-on-surface-variant opacity-80" aria-label="Trilha" data-animate="fade">
        <a href="${homeHref()}" class="font-label-md text-label-md hover:text-primary">Início</a>
        <span class="material-symbols-outlined text-[16px]">chevron_right</span>
        <a href="${homeHref()}#catalog" class="font-label-md text-label-md hover:text-primary">Catálogo</a>
        <span class="material-symbols-outlined text-[16px]">chevron_right</span>
        <span class="font-label-md text-label-md">${escapeHtml(p.categoryLabel)}</span>
        <span class="material-symbols-outlined text-[16px]">chevron_right</span>
        <span class="font-label-md text-label-md text-on-surface">${escapeHtml(p.title)}</span>
      </nav>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
        <div class="md:col-span-5 flex justify-center md:justify-start" data-animate="fade-up">
          <div class="pdp-media artisanal-border rounded-xl overflow-hidden bg-surface-container-lowest p-1 soft-elevation w-full">
            <img src="${heroSrc}" alt="${escapeHtml(p.title)}" class="w-full aspect-[4/5] rounded-lg" width="480" height="600" id="pdp-hero-img">
          </div>
        </div>

        <div class="md:col-span-7 md:sticky md:top-28 space-y-8" data-animate="fade-up" data-animate-delay="2">
          <div class="space-y-2">
            <div class="flex flex-wrap gap-2">${brandBadges}</div>
            <h1 class="font-display-lg text-display-lg text-on-surface">${escapeHtml(p.title)}</h1>
            <p class="font-price-display text-price-display text-secondary">${window.formatBRL(p.price)}</p>
          </div>

          <div class="artisanal-border bg-surface-container-low p-6 rounded-xl space-y-4">
            <p class="font-body-md text-body-md text-on-surface-variant whitespace-pre-line">${escapeHtml(p.description)}</p>
            <ul class="space-y-2">${highlightsHtml}</ul>
          </div>

          <div class="flex flex-col gap-3">
            <a href="https://wa.me/${wa}?text=${encodeURIComponent(`Olá! Quero encomendar: ${p.title} (ref. #${p.id})`)}" class="w-full bg-primary-container hover:bg-primary-fixed transition-all duration-200 py-4 px-8 rounded-full flex items-center justify-center gap-3 soft-elevation active:scale-95" target="_blank" rel="noopener noreferrer">
              <span class="material-symbols-outlined text-on-primary-container">chat</span>
              <span class="font-label-md text-label-md text-on-primary-container">ENCOMENDAR VIA WHATSAPP</span>
            </a>
            <button type="button" id="pdp-add-cart" class="w-full artisanal-border border-secondary text-secondary hover:bg-secondary/5 transition-all duration-200 py-4 px-8 rounded-full flex items-center justify-center gap-3 active:scale-95">
              <span class="material-symbols-outlined">shopping_bag</span>
              <span class="font-label-md text-label-md">ADICIONAR AO CARRINHO</span>
            </button>
          </div>

          <div class="flex items-center justify-between py-6 border-t border-outline-variant/30">
            <div class="text-center flex-1 border-r border-outline-variant/30">
              <span class="material-symbols-outlined text-secondary mb-1 block">spa</span>
              <p class="font-label-md text-label-md">Cuidados</p>
            </div>
            <div class="text-center flex-1 border-r border-outline-variant/30">
              <span class="material-symbols-outlined text-secondary mb-1 block">inventory_2</span>
              <p class="font-label-md text-label-md">Sob encomenda</p>
            </div>
            <div class="text-center flex-1">
              <span class="material-symbols-outlined text-secondary mb-1 block">eco</span>
              <p class="font-label-md text-label-md">Embalagens</p>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById("pdp-add-cart")?.addEventListener("click", () => {
      if (!window.Cart) return;
      window.Cart.add({
        productId: p.id,
        title: p.title,
        optionId: "default",
        optionLabel: "",
        unitPrice: p.price,
        qty: 1,
        image: cartImageSrc,
      });
      window.Cart.openDrawer();
    });

    const related = window.GirassolCatalog.pickRelated(data.products, p, 4);
    const relSection = document.getElementById("pdp-related");
    if (relSection && related.length) {
      relSection.innerHTML = `
        <section class="mt-24 space-y-12" data-animate="fade-up">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div class="space-y-2">
              <span class="text-secondary font-label-md text-label-md">Você também pode gostar</span>
              <h2 class="font-headline-lg text-headline-lg text-on-surface">Outros produtos</h2>
            </div>
            <a class="text-primary font-label-md text-label-md flex items-center gap-1 group" href="${homeHref()}#catalog">
              Ver catálogo completo
              <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </a>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-gutter">
            ${related
              .map((r) => {
                const img = window.GirassolCatalog.assetUrlForHtml(r.image, true);
                return `
              <div class="group artisanal-border bg-surface-container-lowest rounded-xl overflow-hidden hover:soft-elevation transition-all duration-300">
                <a href="${productHref(r.id)}" class="block p-1">
                  <img src="${img}" alt="${escapeHtml(r.title)}" class="w-full aspect-square object-cover rounded-lg group-hover:scale-105 transition-transform duration-500" loading="lazy" width="400" height="400">
                </a>
                <div class="p-4 sm:p-6 space-y-3">
                  <h3 class="font-headline-md text-headline-md truncate"><a href="${productHref(r.id)}" class="hover:text-primary">${escapeHtml(r.title)}</a></h3>
                  <p class="font-price-display text-price-display text-secondary">${window.formatBRL(r.price)}</p>
                  <a href="${productHref(r.id)}" class="block w-full text-center border border-secondary text-secondary py-2 rounded-full font-label-md text-label-md hover:bg-secondary hover:text-white transition-colors">Ver detalhes</a>
                </div>
              </div>`;
              })
              .join("")}
          </div>
        </section>`;
    }

    if (window.GirassolAnimations) {
      window.GirassolAnimations.observe(root);
      if (relSection) window.GirassolAnimations.observe(relSection);
    }
  });
})();
