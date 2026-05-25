const header = document.querySelector("[data-header]");
const menu = document.querySelector("[data-menu]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const revealItems = document.querySelectorAll(".reveal");
const autoCarousels = document.querySelectorAll("[data-auto-carousel]");
const partnerLogos = document.querySelectorAll(".partner-logo");
const parallaxCards = document.querySelectorAll("[data-parallax-card]");
const productOpenButtons = document.querySelectorAll("[data-product-open]");
const productModal = document.querySelector("[data-product-modal]");
const productModalStage = document.querySelector("[data-product-modal-stage]");
const productModalThumbs = document.querySelector("[data-product-modal-thumbs]");
const productModalTitle = document.querySelector("[data-product-modal-title]");
const productModalSummary = document.querySelector("[data-product-modal-summary]");
const productModalSpecs = document.querySelector("[data-product-modal-specs]");
const productModalDescription = document.querySelector("[data-product-modal-description]");
const productModalClose = document.querySelectorAll("[data-product-close]");
const productModalAction = productModal?.querySelector(".btn.btn-primary");
const galleryGrid = document.querySelector("[data-gallery-grid]");
const galleryTitle = document.querySelector("[data-gallery-title]");
const galleryDescription = document.querySelector("[data-gallery-description]");
let lastProductTrigger = null;
let activeProductCard = null;

const galleryCollections = {
  residenciais: {
    title: "Projetos residenciais",
    description: "Ambientes residenciais executados pela BLL com diferentes leituras de uso, composicao e acabamento.",
    folder: "RESIDENCIAIS",
    files: [
      "RESIDENCIAL 3 (4).JPEG",
      "RESIDENCIAL 3 (3).JPEG",
      "RESIDENCIAL 1.JPEG",
      "RESIDENCIAL 3 (2).JPEG",
      "RESIDENCIAL 3.JPEG",
      "RESIDENCIAL 3 (2).JPG",
      "RESIDENCIAL 3 (3).JPG",
      "RESIDENCIAL 3 (6).JPEG",
      "RESIDENCIAL 3 (1).JPEG",
      "RESIDENCIAL 3 (5).jpeg",
      "RESIDENCIAL 3 (5).jpg",
      "RESIDENCIAL 3 (1).jpg",
      "RESIDENCIAL 2.jpg"
    ]
  },
  especiais: {
    title: "Ambientes especiais",
    description: "Projetos com leitura mais autoral, pensados para destacar identidade, materialidade e experiencia de uso.",
    folder: "AMBIENTES ESPECIAIS",
    files: [
      "IMG_0661.HEIC",
      "IMG_6625.JPEG",
      "IMG_0356.JPG",
      "IMG_0796.JPG",
      "IMG_0063.JPG",
      "IMG_6173.JPG"
    ]
  },
  corporativos: {
    title: "Ambientes corporativos",
    description: "Espacos corporativos desenvolvidos para equilibrar imagem profissional, funcionalidade e acabamento.",
    folder: "AMBIENTES CORPORATIVOS",
    files: [
      "6.JPEG",
      "7.JPEG",
      "10.JPEG",
      "11.JPEG",
      "12.JPEG",
      "15.JPEG",
      "8.JPEG",
      "9.JPEG",
      "13.JPEG",
      "5.JPEG",
      "3.JPEG",
      "2.JPEG",
      "4.JPEG",
      "14.HEIC",
      "1.JPG"
    ]
  }
};

const staggerGroups = [
  ".project-grid",
  ".differential-grid",
  ".store-mini-grid",
  ".product-grid-premium",
  ".testimonial-row",
  ".horizontal-mobile"
];

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const closeMenu = () => {
  if (!menu || !menuToggle) return;
  menu.classList.remove("is-open");
  menuToggle.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
};

if (menu && menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (galleryGrid && galleryTitle && galleryDescription) {
  const params = new URLSearchParams(window.location.search);
  const categoryKey = params.get("categoria") || "residenciais";
  const category = galleryCollections[categoryKey] || galleryCollections.residenciais;

  galleryTitle.textContent = category.title;
  galleryDescription.textContent = category.description;

  galleryGrid.innerHTML = "";

  category.files.forEach((fileName, index) => {
    const figure = document.createElement("figure");
    figure.className = "gallery-item reveal is-visible";

    const image = document.createElement("img");
    image.src = `assets/IMAGENS/${category.folder}/${encodeURIComponent(fileName)}`;
    image.alt = `${category.title} - imagem ${index + 1}`;
    image.loading = index < 4 ? "eager" : "lazy";
    image.addEventListener("load", () => {
      if (image.naturalWidth > image.naturalHeight * 1.18) {
        figure.classList.add("is-landscape");
      }
    });

    const caption = document.createElement("figcaption");
    caption.textContent = `${category.title} ${index + 1}`;

    figure.append(image, caption);
    galleryGrid.appendChild(figure);
  });
}

partnerLogos.forEach((logo) => {
  const label = logo.querySelector("span");
  if (!label) return;

  const slug = label.textContent
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!slug) return;

  const img = document.createElement("img");
  img.src = `assets/partners/${slug}.svg`;
  img.alt = `Logo ${label.textContent.trim()}`;
  img.loading = "lazy";

  img.addEventListener("load", () => {
    logo.classList.add("has-logo");
    logo.classList.remove("is-placeholder");
  });

  img.addEventListener("error", () => {
    img.remove();
    logo.classList.add("is-placeholder");
  });

  logo.prepend(img);
});

autoCarousels.forEach((carousel) => {
  let isPaused = false;
  let resumeTimer;
  const mobileQuery = window.matchMedia("(max-width: 860px)");
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  const pause = () => {
    isPaused = true;
    window.clearTimeout(resumeTimer);
  };

  const resume = () => {
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(() => {
      isPaused = false;
    }, 2500);
  };

  const getStep = () => {
    const firstCard = carousel.querySelector(".project-card, .testimonial-card, figure");
    if (!firstCard) return carousel.clientWidth * 0.84;
    const styles = window.getComputedStyle(carousel);
    const gap = parseFloat(styles.gap || styles.columnGap || "24");
    return firstCard.getBoundingClientRect().width + gap;
  };

  window.setInterval(() => {
    if (reduceMotionQuery.matches || !mobileQuery.matches || isPaused || carousel.scrollWidth <= carousel.clientWidth) return;

    const step = getStep();
    const nearEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - step * 0.5;
    carousel.scrollTo({
      left: nearEnd ? 0 : carousel.scrollLeft + step,
      behavior: "smooth"
    });
  }, 3200);

  carousel.addEventListener("mouseenter", pause);
  carousel.addEventListener("mouseleave", resume);
  carousel.addEventListener("pointerdown", pause);
  carousel.addEventListener("pointerup", resume);
  carousel.addEventListener("pointercancel", resume);
  carousel.addEventListener("touchstart", pause, { passive: true });
  carousel.addEventListener("touchend", resume, { passive: true });
  carousel.addEventListener("touchcancel", resume, { passive: true });
});

staggerGroups.forEach((selector) => {
  document.querySelectorAll(selector).forEach((group) => {
    group.querySelectorAll(".reveal").forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${Math.min(index * 110, 420)}ms`);
    });
  });
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const parallaxQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

if (parallaxQuery.matches) {
  parallaxCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      card.style.setProperty("--px", `${x * 0.12}px`);
      card.style.setProperty("--py", `${y * 0.12}px`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--px", "0px");
      card.style.setProperty("--py", "0px");
    });
  });
}

const closeProductModal = () => {
  if (!productModal) return;

  productModal.hidden = true;

  if (productModalStage) productModalStage.innerHTML = "";
  if (productModalThumbs) productModalThumbs.innerHTML = "";
  if (productModalTitle) productModalTitle.textContent = "";
  if (productModalSummary) productModalSummary.textContent = "";
  if (productModalSpecs) productModalSpecs.innerHTML = "";
  if (productModalDescription) productModalDescription.innerHTML = "";

  document.body.classList.remove("modal-open");
  activeProductCard = null;
  lastProductTrigger?.focus();
};

if (productModal) {
  const createStageMedia = (item) => {
    if (!productModalStage) return;

    productModalStage.innerHTML = "";
    if (!item) return;

    if (item.kind === "video") {
      const video = document.createElement("video");
      video.className = "product-modal-media";
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.poster = item.poster || item.thumb || "";
      video.src = item.src;

      if (item.alt) {
        video.setAttribute("aria-label", item.alt);
      }

      productModalStage.appendChild(video);
      return;
    }

    const image = document.createElement("img");
    image.className = "product-modal-media";
    image.src = item.src;
    image.alt = item.alt || "";
    image.loading = "eager";
    productModalStage.appendChild(image);
  };

  const readGalleryItems = (card) => {
    const items = [];
    const galleryNodes = card.querySelectorAll(".product-gallery-data [data-kind]");

    galleryNodes.forEach((node) => {
      const kind = node.dataset.kind || "image";
      const src = node.dataset.src;
      if (!src) return;

      items.push({
        kind,
        src,
        thumb: node.dataset.thumb || src,
        poster: node.dataset.poster || node.dataset.thumb || "",
        alt: node.dataset.alt || ""
      });
    });

    if (items.length) return items;

    const fallbackImage = card.querySelector(".product-media img");
    if (!fallbackImage) return items;

    items.push({
      kind: "image",
      src: fallbackImage.currentSrc || fallbackImage.src,
      thumb: fallbackImage.currentSrc || fallbackImage.src,
      alt: fallbackImage.alt || ""
    });

    return items;
  };

  const renderGalleryThumbs = (items) => {
    if (!productModalThumbs) return;

    productModalThumbs.innerHTML = "";
    if (!items.length) return;

    let activeIndex = 0;

    const setActiveItem = (index) => {
      activeIndex = index;
      createStageMedia(items[index]);

      productModalThumbs.querySelectorAll(".product-modal-thumb").forEach((thumb, thumbIndex) => {
        const isActive = thumbIndex === activeIndex;
        thumb.classList.toggle("is-active", isActive);
        thumb.setAttribute("aria-pressed", String(isActive));
      });
    };

    items.forEach((item, index) => {
      const thumb = document.createElement("button");
      thumb.type = "button";
      thumb.className = "product-modal-thumb";
      thumb.setAttribute("aria-label", item.alt || `Midia ${index + 1}`);

      if (item.kind === "video") {
        thumb.classList.add("is-video");
      }

      const thumbImage = document.createElement("img");
      thumbImage.src = item.thumb || item.poster || item.src;
      thumbImage.alt = "";
      thumbImage.loading = "lazy";
      thumb.appendChild(thumbImage);

      if (item.kind === "video") {
        const badge = document.createElement("span");
        badge.className = "product-modal-thumb-badge";
        badge.textContent = "Video";
        thumb.appendChild(badge);
      }

      thumb.addEventListener("click", () => setActiveItem(index));
      productModalThumbs.appendChild(thumb);
    });

    setActiveItem(0);
  };

  const openProductModal = (card, triggerButton) => {
    if (activeProductCard === card && !productModal.hidden) return;

    const title = card.querySelector("h3");
    const summary = card.querySelector(".product-card-body > p");
    const specs = card.querySelector(".product-specs");
    const description = card.querySelector(".product-modal-data");
    const galleryItems = readGalleryItems(card);

    if (productModalTitle) {
      productModalTitle.textContent = title ? title.textContent.trim() : "";
    }

    if (productModalSummary) {
      productModalSummary.textContent = summary ? summary.textContent.trim() : "";
    }

    if (productModalSpecs) {
      productModalSpecs.innerHTML = specs ? specs.innerHTML : "";
    }

    if (productModalDescription) {
      productModalDescription.innerHTML = description ? description.innerHTML : "";
    }

    renderGalleryThumbs(galleryItems);

    if (title && productModalAction) {
      const message = `Ola, tenho interesse na peca ${title.textContent.trim()} da Loja BLL e gostaria de receber mais detalhes.`;
      productModalAction.href = `https://wa.me/5584991212716?text=${encodeURIComponent(message)}`;
    }

    lastProductTrigger = triggerButton || card.querySelector("[data-product-open]");
    activeProductCard = card;
    productModal.hidden = false;
    document.body.classList.add("modal-open");
    productModal.querySelector(".product-modal-close")?.focus();
  };

  productOpenButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest("[data-product-card]");
      if (!card) return;
      openProductModal(card, button);
    });
  });

  document.querySelectorAll("[data-product-card] .product-media").forEach((media) => {
    media.addEventListener("click", () => {
      const card = media.closest("[data-product-card]");
      if (!card) return;
      openProductModal(card, card.querySelector("[data-product-open]"));
    });
  });

  productModalClose.forEach((element) => {
    element.addEventListener("click", closeProductModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !productModal.hidden) {
      closeProductModal();
    }
  });
}
