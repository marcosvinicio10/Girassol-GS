(function () {
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)");

  function markVisible(el) {
    el.classList.add("is-visible");
  }

  function observeElements(elements) {
    if (!elements.length) return;

    if (REDUCED.matches) {
      elements.forEach(markVisible);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          markVisible(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" }
    );

    elements.forEach((el) => {
      if (!el.classList.contains("is-visible")) observer.observe(el);
    });
  }

  function observe(root) {
    const scope = root && root.querySelectorAll ? root : document;
    const nodes = scope.querySelectorAll("[data-animate]:not(.is-visible)");
    observeElements(Array.from(nodes));
  }

  function init() {
    observe(document);
  }

  document.addEventListener("DOMContentLoaded", init);

  window.GirassolAnimations = { init, observe };
})();
