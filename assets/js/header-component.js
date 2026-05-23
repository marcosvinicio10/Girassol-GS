/**
 * Cabeçalho reutilizável — <header-component active="home|catalog|contact">
 * Caminhos relativos: raiz do site ou pasta pages/ (detectado automaticamente).
 */
(function () {
  const CART_STORAGE_KEY = "girassol-gs-cart-v1";

  function isPagesFolder() {
    const p = window.location.pathname || "";
    return p.includes("/pages/");
  }

  function baseHref() {
    return isPagesFolder() ? "../" : "";
  }

  function cartItemCount() {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      const items = raw ? JSON.parse(raw) : [];
      return items.reduce((s, i) => s + (Number(i.qty) || 0), 0);
    } catch {
      return 0;
    }
  }

  function syncCartBadge(host) {
    const n = typeof window.Cart !== "undefined" && window.Cart.count ? window.Cart.count() : cartItemCount();
    host.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = n > 0 ? String(n) : "";
      el.classList.toggle("hidden", n === 0);
    });
  }

  class HeaderComponent extends HTMLElement {
    static get observedAttributes() {
      return ["active"];
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback(name) {
      if (name === "active" && this.isConnected) this.render();
    }

    getActive() {
      const a = (this.getAttribute("active") || "home").toLowerCase();
      if (a === "catalog" || a === "contact" || a === "home") return a;
      return "home";
    }

    render() {
      const b = baseHref();
      const home = `${b}index.html`;
      const catalog = `${b}index.html#catalog`;
      const contato = `${b}index.html#contato`;
      const active = this.getActive();

      const navClass = (name) => (active === name ? "is-active" : "");

      this.innerHTML = `
        <div class="header-glass-outer">
          <div class="header-glass-shell">
            <header class="header-glass" role="banner">
              <div class="header-glass-inner">
                <a class="header-glass-logo" href="${home}">Girassol GS</a>
                <nav class="header-glass-nav" aria-label="Principal">
                  <a class="${navClass("home")}" href="${home}">
                    <span class="material-symbols-outlined nav-icon" aria-hidden="true">home</span>
                    <span class="nav-text">Início</span>
                  </a>
                  <a class="${navClass("catalog")}" href="${catalog}">
                    <span class="material-symbols-outlined nav-icon" aria-hidden="true">shopping_bag</span>
                    <span class="nav-text">Catálogo</span>
                  </a>
                  <a class="${navClass("contact")}" href="${contato}">
                    <span class="material-symbols-outlined nav-icon" aria-hidden="true">mail</span>
                    <span class="nav-text">Contato</span>
                  </a>
                </nav>
                <div class="header-glass-actions">
                  <button type="button" class="header-glass-icon-btn header-glass-cart" data-open-cart aria-label="Abrir carrinho">
                    <span class="material-symbols-outlined" style="font-size:1.35rem">shopping_cart</span>
                    <span class="cart-count hidden" data-cart-count aria-live="polite"></span>
                  </button>
                  <button type="button" class="header-glass-icon-btn md:hidden" data-header-menu-btn aria-expanded="false" aria-controls="header-glass-mobile-nav" aria-label="Abrir menu">
                    <span class="material-symbols-outlined">menu</span>
                  </button>
                </div>
              </div>
            </header>
          </div>
          <div class="header-glass-mobile md:hidden">
            <div id="header-glass-mobile-nav" class="mobile-nav-panel" role="navigation" aria-label="Menu mobile">
              <div class="px-margin-mobile py-3 flex flex-col gap-1">
                <a href="${home}">Início</a>
                <a href="${catalog}">Catálogo</a>
                <a href="${contato}">Contato</a>
              </div>
            </div>
          </div>
        </div>`;
      this._bindMobileMenu();
      syncCartBadge(this);
    }

    _bindMobileMenu() {
      const btn = this.querySelector("[data-header-menu-btn]");
      const panel = this.querySelector("#header-glass-mobile-nav");
      if (!btn || !panel) return;
      btn.addEventListener("click", () => {
        const open = panel.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
  }

  customElements.define("header-component", HeaderComponent);
})();
