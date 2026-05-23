(function () {
  const STORAGE_KEY = "girassol-gs-cart-v1";

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("girassol:cart", { detail: items }));
  }

  /** Caminho salvo no carrinho é relativo à raiz do site (`assets/figs/...`). Em `pages/` o navegador precisa de `../`. */
  function resolveCartImageSrc(url) {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    const path = url.replace(/^\//, "");
    const inPages = /\/pages\//i.test(window.location.pathname || "");
    if (inPages && !path.startsWith("../")) return `../${path}`;
    return path;
  }

  function formatBRL(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  function notifyCart(items) {
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      const n = items.reduce((s, i) => s + (i.qty || 0), 0);
      el.textContent = n > 0 ? String(n) : "";
      el.classList.toggle("hidden", n === 0);
    });
  }

  function lineKey(item) {
    return `${item.productId}::${item.optionId || "default"}`;
  }

  const Cart = {
    items() {
      return load();
    },

    count() {
      return this.items().reduce((s, i) => s + (i.qty || 0), 0);
    },

    subtotal() {
      return this.items().reduce((s, i) => s + i.unitPrice * (i.qty || 0), 0);
    },

    add(payload) {
      const items = load();
      const key = lineKey(payload);
      const idx = items.findIndex((i) => lineKey(i) === key);
      if (idx >= 0) {
        items[idx].qty += payload.qty || 1;
      } else {
        items.push({
          productId: payload.productId,
          title: payload.title,
          optionId: payload.optionId || "default",
          optionLabel: payload.optionLabel || "",
          unitPrice: payload.unitPrice,
          qty: payload.qty || 1,
          image: payload.image || "",
        });
      }
      save(items);
      notifyCart(items);
    },

    setQty(productId, optionId, qty) {
      const items = load();
      const key = `${productId}::${optionId || "default"}`;
      const idx = items.findIndex((i) => lineKey(i) === key);
      if (idx < 0) return;
      if (qty <= 0) items.splice(idx, 1);
      else items[idx].qty = qty;
      save(items);
      notifyCart(items);
      this.renderDrawer();
    },

    remove(productId, optionId) {
      this.setQty(productId, optionId, 0);
    },

    clear() {
      save([]);
      notifyCart([]);
      this.renderDrawer();
    },

    openDrawer() {
      const overlay = document.getElementById("cart-drawer-overlay");
      const drawer = document.getElementById("cart-drawer");
      overlay?.classList.add("is-open");
      drawer?.classList.add("is-open");
      document.body.classList.add("overflow-hidden");
      this.renderDrawer();
    },

    closeDrawer() {
      document.getElementById("cart-drawer-overlay")?.classList.remove("is-open");
      document.getElementById("cart-drawer")?.classList.remove("is-open");
      document.body.classList.remove("overflow-hidden");
    },

    renderDrawer() {
      const list = document.getElementById("cart-drawer-lines");
      const empty = document.getElementById("cart-drawer-empty");
      const sub = document.getElementById("cart-drawer-subtotal");
      if (!list || !empty || !sub) return;

      const items = load();
      if (items.length === 0) {
        list.innerHTML = "";
        empty.classList.remove("hidden");
        sub.textContent = formatBRL(0);
        return;
      }
      empty.classList.add("hidden");
      sub.textContent = formatBRL(this.subtotal());
      list.innerHTML = items
        .map((item) => {
          const opt = item.optionLabel
            ? `<p class="font-body-md text-body-md text-on-surface-variant">${item.optionLabel}</p>`
            : "";
          const imgSrc = resolveCartImageSrc(item.image);
          return `
          <div class="cart-line" data-line="${lineKey(item)}">
            <div class="rounded-lg overflow-hidden border border-outline-variant/30 bg-surface-container-lowest aspect-square">
              ${
                imgSrc
                  ? `<img src="${imgSrc}" alt="" class="w-full h-full object-cover" width="72" height="72">`
                  : `<div class="w-full h-full flex items-center justify-center text-on-surface-variant"><span class="material-symbols-outlined">local_florist</span></div>`
              }
            </div>
            <div>
              <p class="font-label-md text-label-md text-on-surface">${item.title}</p>
              ${opt}
              <p class="font-price-display text-price-display text-secondary mt-1">${formatBRL(item.unitPrice)}</p>
            </div>
            <div class="flex flex-col items-end gap-2">
              <button type="button" class="text-on-surface-variant hover:text-error text-sm font-label-md" data-remove-line="${item.productId}" data-option="${item.optionId || "default"}">Remover</button>
              <div class="flex items-center gap-1 border border-outline-variant rounded-full px-1">
                <button type="button" class="p-1 rounded-full hover:bg-surface-container" data-qty-dec="${item.productId}" data-option="${item.optionId || "default"}"><span class="material-symbols-outlined text-[18px]">remove</span></button>
                <span class="min-w-[1.5rem] text-center font-label-md text-label-md">${item.qty}</span>
                <button type="button" class="p-1 rounded-full hover:bg-surface-container" data-qty-inc="${item.productId}" data-option="${item.optionId || "default"}"><span class="material-symbols-outlined text-[18px]">add</span></button>
              </div>
            </div>
          </div>`;
        })
        .join("");

      list.querySelectorAll("[data-remove-line]").forEach((btn) => {
        btn.addEventListener("click", () => {
          Cart.remove(btn.getAttribute("data-remove-line"), btn.getAttribute("data-option"));
        });
      });
      list.querySelectorAll("[data-qty-dec]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-qty-dec");
          const opt = btn.getAttribute("data-option");
          const line = load().find((i) => lineKey(i) === `${id}::${opt}`);
          if (line) Cart.setQty(id, opt, line.qty - 1);
        });
      });
      list.querySelectorAll("[data-qty-inc]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-qty-inc");
          const opt = btn.getAttribute("data-option");
          const line = load().find((i) => lineKey(i) === `${id}::${opt}`);
          if (line) Cart.setQty(id, opt, line.qty + 1);
        });
      });
    },
  };

  function ensureDrawerMarkup() {
    if (document.getElementById("cart-drawer")) return;

    const site = window.__GIRASSOL_SITE__ || {};
    const wa = site.whatsapp || "5521964916258";

    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div id="cart-drawer-overlay" class="cart-drawer-overlay" aria-hidden="true"></div>
      <aside id="cart-drawer" class="cart-drawer" aria-label="Carrinho de compras" aria-hidden="true">
        <div class="flex items-center justify-between px-5 py-4 border-b border-outline-variant/40">
          <h2 class="font-headline-md text-headline-md text-on-surface">Seu carrinho</h2>
          <button type="button" id="cart-drawer-close" class="p-2 rounded-full hover:bg-surface-container text-on-surface-variant" aria-label="Fechar carrinho">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="flex-1 overflow-y-auto px-5 py-4">
          <p id="cart-drawer-empty" class="font-body-md text-body-md text-on-surface-variant text-center py-12 hidden">Nenhum item ainda. Explore o catálogo e adicione seus favoritos.</p>
          <div id="cart-drawer-lines"></div>
        </div>
        <div class="border-t border-outline-variant/40 px-5 py-4 space-y-3 bg-surface-container-low/80">
          <div class="flex justify-between items-center">
            <span class="font-label-md text-label-md text-on-surface-variant">Subtotal</span>
            <span id="cart-drawer-subtotal" class="font-price-display text-price-display text-on-surface">R$ 0,00</span>
          </div>
          <a href="https://wa.me/${wa}?text=${encodeURIComponent("Olá! Gostaria de finalizar meu pedido na Girassol GS.")}" class="block w-full text-center bg-primary-container text-on-primary-container font-label-md text-label-md py-3.5 rounded-full artisanal-shadow hover:brightness-95 transition-all" id="cart-checkout-wa">Finalizar no WhatsApp</a>
          <button type="button" id="cart-clear" class="w-full border border-outline text-on-surface font-label-md text-label-md py-3 rounded-full hover:bg-surface-container transition-colors">Limpar carrinho</button>
        </div>
      </aside>`;
    document.body.appendChild(wrap.firstElementChild);
    document.body.appendChild(wrap.firstElementChild);

    document.getElementById("cart-drawer-overlay")?.addEventListener("click", () => Cart.closeDrawer());
    document.getElementById("cart-drawer-close")?.addEventListener("click", () => Cart.closeDrawer());
    document.getElementById("cart-clear")?.addEventListener("click", () => Cart.clear());
  }

  document.addEventListener("DOMContentLoaded", () => {
    ensureDrawerMarkup();
    notifyCart(load());

    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-open-cart]")) {
        e.preventDefault();
        Cart.openDrawer();
      }
    });

    window.addEventListener("girassol:cart", (e) => notifyCart(e.detail));

    window.addEventListener("storage", (e) => {
      if (e.key !== STORAGE_KEY) return;
      if (e.newValue == null || e.newValue === "") {
        notifyCart([]);
        return;
      }
      try {
        notifyCart(JSON.parse(e.newValue));
      } catch {
        notifyCart([]);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") Cart.closeDrawer();
    });
  });

  window.Cart = Cart;
  window.formatBRL = formatBRL;
})();
