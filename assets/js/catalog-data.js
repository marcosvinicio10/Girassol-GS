(function () {
  const DEFAULT_SITE = {
    name: "Girassol GS",
    whatsapp: "5521964916258",
  };

  const CATEGORY_LABELS = {
    buques: "Buquês",
    caixas: "Caixas",
    unidades: "Unidades",
    borboletas: "Borboletas LED",
  };

  function truncate(text, max) {
    if (!text) return "";
    const t = String(text).trim();
    if (t.length <= max) return t;
    return `${t.slice(0, max - 1).trim()}…`;
  }

  /**
   * JSON oficial usa `assets/N.jpg`; arquivos ficam em `assets/figs/`.
   * Caminhos já em `assets/figs/` ou absolutos (http) permanecem.
   */
  function normalizeImagePath(path) {
    if (!path) return "";
    const p0 = String(path).trim().replace(/^\.\//, "");
    if (/^https?:\/\//i.test(p0)) return p0;
    let p = p0.replace(/^\//, "");
    if (p.startsWith("assets/figs/")) return p;
    if (p.startsWith("assets/")) return p.replace(/^assets\//, "assets/figs/");
    if (p.startsWith("figs/")) return `assets/${p}`;
    return p;
  }

  function mapProduct(raw) {
    const img = normalizeImagePath(raw.image);
    return {
      id: String(raw.id),
      title: raw.name,
      name: raw.name,
      price: Number(raw.price),
      image: img,
      category: raw.category,
      categoryLabel: CATEGORY_LABELS[raw.category] || raw.category,
      description: raw.description || "",
      shortDescription: truncate(raw.description || "", 150),
      brand: raw.brand || "",
      productionTime: raw.productionTime || "",
    };
  }

  /** URL para <img src> conforme a página (raiz ou `pages/`). */
  function assetUrlForHtml(normalizedPath, fromPagesFolder) {
    if (!normalizedPath) return "";
    if (/^https?:\/\//i.test(normalizedPath)) return normalizedPath;
    const p = normalizedPath.replace(/^\//, "");
    return fromPagesFolder ? `../${p}` : p;
  }

  function pickRelated(products, current, limit) {
    const n = limit || 4;
    const others = products.filter((x) => x.id !== current.id);
    const same = others.filter((x) => x.category === current.category);
    const diff = others.filter((x) => x.category !== current.category);
    return [...same, ...diff].slice(0, n);
  }

  async function fetchCatalog(jsonUrl) {
    const res = await fetch(jsonUrl, { cache: "no-store" });
    if (!res.ok) throw new Error("Falha ao carregar catálogo");
    const data = await res.json();
    const rawList = Array.isArray(data.products) ? data.products : [];
    const products = rawList.map(mapProduct).sort((a, b) => Number(a.id) - Number(b.id));
    window.__GIRASSOL_SITE__ = Object.assign({}, DEFAULT_SITE, data.site && typeof data.site === "object" ? data.site : {});
    const byId = Object.fromEntries(products.map((p) => [p.id, p]));
    return { products, byId, site: window.__GIRASSOL_SITE__ };
  }

  window.GirassolCatalog = {
    fetchCatalog,
    mapProduct,
    normalizeImagePath,
    assetUrlForHtml,
    pickRelated,
    DEFAULT_SITE,
  };
})();
