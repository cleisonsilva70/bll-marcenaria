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
    description: "Ambientes residenciais executados pela BLL com diferentes leituras de uso, composição e acabamento.",
    seoTitle: "Projetos Residenciais | BLL Marcenaria",
    image: "assets/IMAGENS/RESIDENCIAIS/1.JPEG",
    folder: "RESIDENCIAIS",
    files: [
      "1.JPEG",
      "2.JPEG",
      "3.JPEG",
      "4.jpg",
      "5.JPEG",
      "6.JPG",
      "7.JPG",
      "8.jpg",
      "9.JPEG",
      "10.JPEG",
      "11.JPEG",
      "12.jpg"
    ]
  },
  especiais: {
    title: "Ambientes especiais",
    description: "Projetos com leitura mais autoral, pensados para destacar identidade, materialidade e experiência de uso.",
    seoTitle: "Ambientes Especiais | BLL Marcenaria",
    image: "assets/IMAGENS/AMBIENTES ESPECIAIS/2.JPG",
    folder: "AMBIENTES ESPECIAIS",
    files: [
      "1.jpg",
      "2.JPG",
      "3.JPG",
      "4.JPG",
      "5.JPEG",
      "6.JPG"
    ]
  },
  corporativos: {
    title: "Ambientes corporativos",
    description: "Espaços corporativos desenvolvidos para equilibrar imagem profissional, funcionalidade e acabamento.",
    seoTitle: "Ambientes Corporativos | BLL Marcenaria",
    image: "assets/IMAGENS/AMBIENTES CORPORATIVOS/1.JPG",
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
      "14.jpg",
      "1.JPG"
    ]
  },
  producao: {
    title: "Produção",
    description: "Registros da fabricação, corte, preparação técnica e processos executados dentro da marcenaria.",
    seoTitle: "Produção da Marcenaria | BLL Marcenaria",
    image: "assets/IMAGENS/CORTE/1.jpg",
    folder: "CORTE",
    files: [
      "1.jpg",
      "2.jpg",
      "3.jpg",
      "4.jpg",
      "5.jpg",
      "6.jpg",
      "7.jpg"
    ]
  },
  montagem: {
    title: "Montagem",
    description: "Registros da instalação, encaixes e montagem dos projetos nos ambientes.",
    seoTitle: "Montagem de Projetos | BLL Marcenaria",
    image: "assets/IMAGENS/MONTAGEM/capa.jpg",
    folder: "MONTAGEM",
    files: [
      "capa.jpg",
      "IMAGEM3.jpg",
      "IMAGEM4.jpg",
      "IMAGEM5.jpg"
    ]
  },
  acabamento: {
    title: "Acabamento",
    description: "Registros dos detalhes de acabamento, finalização e cuidado visual das peças.",
    seoTitle: "Acabamento em Marcenaria | BLL Marcenaria",
    image: "assets/IMAGENS/ACABAMENTO/CAPA.jpg",
    folder: "ACABAMENTO",
    files: [
      "CAPA.jpg",
      "2.jpg",
      "3.jpg",
      "4.jpg",
      "5.jpg",
      "6.jpg"
    ]
  }
};

const galleryFileCollator = new Intl.Collator("pt-BR", {
  numeric: true,
  sensitivity: "base"
});

const staggerGroups = [
  ".project-grid",
  ".differential-grid",
  ".store-mini-grid",
  ".product-grid-premium",
  ".testimonial-row",
  ".horizontal-mobile"
];

const absoluteSiteUrl = (path) => new URL(path, "https://www.bllmarcenaria.com/").href;

const setMetaContent = (selector, content) => {
  const element = document.querySelector(selector);
  if (element && content) {
    element.setAttribute("content", content);
  }
};

const setCanonicalUrl = (url) => {
  const canonical = document.querySelector("link[rel='canonical']");
  if (canonical && url) {
    canonical.setAttribute("href", url);
  }
};

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
  const categoryUrl = absoluteSiteUrl(`galeria.html?categoria=${encodeURIComponent(categoryKey)}`);
  const categoryImageUrl = absoluteSiteUrl(category.image);
  const categorySeoTitle = category.seoTitle || `${category.title} | BLL Marcenaria`;

  galleryTitle.textContent = category.title;
  galleryDescription.textContent = category.description;
  document.title = categorySeoTitle;
  setCanonicalUrl(categoryUrl);
  setMetaContent("meta[name='description']", category.description);
  setMetaContent("meta[property='og:title']", categorySeoTitle);
  setMetaContent("meta[property='og:description']", category.description);
  setMetaContent("meta[property='og:url']", categoryUrl);
  setMetaContent("meta[property='og:image']", categoryImageUrl);
  setMetaContent("meta[property='og:image:alt']", `${category.title} da BLL Marcenaria`);
  setMetaContent("meta[name='twitter:title']", categorySeoTitle);
  setMetaContent("meta[name='twitter:description']", category.description);
  setMetaContent("meta[name='twitter:image']", categoryImageUrl);

  galleryGrid.innerHTML = "";

  const getGalleryFileName = (file) => (typeof file === "string" ? file : file.name);
  const getGalleryFolder = (file) => (typeof file === "string" ? category.folder : file.folder);
  const orderedFiles = [...category.files].sort((a, b) => galleryFileCollator.compare(getGalleryFileName(a), getGalleryFileName(b)));
  if (!orderedFiles.length) {
    const emptyState = document.createElement("div");
    emptyState.className = "gallery-empty";
    emptyState.textContent = "As fotos desta etapa serão adicionadas em breve.";
    galleryGrid.appendChild(emptyState);
  }

  const lightbox = document.createElement("div");
  lightbox.className = "gallery-lightbox";
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <button class="gallery-lightbox-close" type="button" aria-label="Fechar imagem">
      <span aria-hidden="true">&times;</span>
    </button>
    <img class="gallery-lightbox-image" alt="">
  `;
  document.body.appendChild(lightbox);

  const lightboxImage = lightbox.querySelector(".gallery-lightbox-image");
  const lightboxClose = lightbox.querySelector(".gallery-lightbox-close");
  let lastGalleryTrigger = null;

  const closeGalleryLightbox = () => {
    lightbox.hidden = true;
    if (lightboxImage) {
      lightboxImage.src = "";
      lightboxImage.alt = "";
    }
    document.body.classList.remove("modal-open");
    lastGalleryTrigger?.focus();
  };

  const openGalleryLightbox = (image, trigger) => {
    if (!lightboxImage) return;

    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "";
    lastGalleryTrigger = trigger;
    lightbox.hidden = false;
    document.body.classList.add("modal-open");
    lightboxClose?.focus();
  };

  lightboxClose?.addEventListener("click", closeGalleryLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeGalleryLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeGalleryLightbox();
    }
  });

  orderedFiles.forEach((file, index) => {
    const fileName = getGalleryFileName(file);
    const folderName = getGalleryFolder(file);
    const figure = document.createElement("figure");
    figure.className = "gallery-item reveal is-visible";
    figure.setAttribute("role", "button");
    figure.setAttribute("tabindex", "0");
    figure.setAttribute("aria-label", `Abrir imagem ${index + 1} em tela cheia`);

    const image = document.createElement("img");
    image.src = `assets/IMAGENS/${folderName}/${encodeURIComponent(fileName)}`;
    image.alt = `${category.title} - imagem ${index + 1}`;
    image.loading = index < 4 ? "eager" : "lazy";
    image.addEventListener("load", () => {
      if (image.naturalWidth > image.naturalHeight * 1.18) {
        figure.classList.add("is-landscape");
      }
    });

    figure.addEventListener("click", () => openGalleryLightbox(image, figure));
    figure.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openGalleryLightbox(image, figure);
    });

    figure.append(image);
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
      const mercadoLivreUrl = card.dataset.mlUrl?.trim();
      const productName = title.textContent.trim();

      if (mercadoLivreUrl) {
        productModalAction.href = mercadoLivreUrl;
        productModalAction.textContent = "Comprar pelo Mercado Livre";
      } else {
        const message = `Olá, tenho interesse na peça ${productName} da mab.llar e gostaria de receber mais detalhes.`;
        productModalAction.href = `https://wa.me/558496716291?text=${encodeURIComponent(message)}`;
        productModalAction.textContent = "Falar sobre esta peça";
      }
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
    const card = media.closest("[data-product-card]");
    const title = card?.querySelector("h3")?.textContent.trim();

    media.setAttribute("role", "button");
    media.setAttribute("tabindex", "0");
    media.setAttribute("aria-label", title ? `Ver detalhes de ${title}` : "Ver detalhes do produto");

    media.addEventListener("click", () => {
      if (!card) return;
      openProductModal(card, card.querySelector("[data-product-open]"));
    });

    media.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
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
