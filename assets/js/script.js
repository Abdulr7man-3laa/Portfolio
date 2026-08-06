'use strict';

// ─── Theme toggle ───
const themeBtn = document.querySelector("[data-theme-btn]");

// Apply saved theme immediately on load
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light-theme");
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
    const isLight = document.body.classList.contains("light-theme");
    localStorage.setItem("theme", isLight ? "light" : "dark");

    // Redraw chart to match new theme
    if (cachedRatingHistory) {
      drawRatingChart("cfChart", cachedRatingHistory);
    }
  });
}

// ─── Sidebar toggle ───
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

if (sidebarBtn && sidebar) {
  sidebarBtn.addEventListener("click", () => sidebar.classList.toggle("active"));
}

// ─── Page navigation ───
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

function navigateToPage(target, shouldScroll = true) {
  // Ensure the target exists, fallback to 'about'
  let found = false;
  pages.forEach((page) => {
    if (page.dataset.page === target) found = true;
  });
  if (!found) target = "about";

  // Update active state on nav links
  navigationLinks.forEach((navLink) => {
    navLink.classList.toggle("active", navLink.innerHTML.toLowerCase().trim() === target);
  });

  // Update active state on pages
  pages.forEach((page) => {
    page.classList.toggle("active", page.dataset.page === target);
  });

  // Save to localStorage
  localStorage.setItem("activePage", target);
  if (shouldScroll) window.scrollTo(0, 0);
}

navigationLinks.forEach((link) => {
  link.addEventListener("click", function () {
    const target = this.innerHTML.toLowerCase().trim();
    navigateToPage(target, true);
  });
});

// Restore page on load without forcing scroll to top
const savedPage = localStorage.getItem("activePage");
if (savedPage) {
  navigateToPage(savedPage, false);
}

// ─── Category buttons (Skills) ───
// Removed in favor of new Bento Grid layout.

// ─── Certificate Lightbox ───
const certLightbox = document.getElementById("certLightbox");
const certLightboxImg = document.getElementById("certLightboxImg");
const certLightboxTitle = document.getElementById("certLightboxTitle");
const certLightboxClose = document.getElementById("certLightboxClose");

function openCertLightbox(imgSrc, title) {
  if (!certLightbox || !certLightboxImg) return;
  certLightboxImg.src = imgSrc;
  certLightboxImg.alt = title;
  certLightboxTitle.textContent = title;
  certLightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCertLightbox() {
  if (!certLightbox) return;
  certLightbox.classList.remove("active");
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-certificates-item]").forEach((item) => {
  item.addEventListener("click", () => {
    const img = item.querySelector("[data-certificates-avatar]");
    const title = item.querySelector("[data-certificates-title]");
    if (img && title) {
      openCertLightbox(img.src, title.textContent.trim());
    }
  });
});

if (certLightboxClose) {
  certLightboxClose.addEventListener("click", closeCertLightbox);
}

if (certLightbox) {
  certLightbox.addEventListener("click", (e) => {
    if (
      e.target === certLightbox ||
      e.target.classList.contains("cert-lightbox-backdrop")
    ) {
      closeCertLightbox();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && certLightbox && certLightbox.classList.contains("active")) {
    closeCertLightbox();
  }
});

// ─── Certificate Carousel ───
(function () {
  const carousel = document.getElementById("certCarousel");
  const thumb = document.getElementById("certScrollThumb");

  if (!carousel) return;

  // ── Scroll progress thumb ──
  function updateThumb() {
    if (!thumb) return;
    const max = carousel.scrollWidth - carousel.clientWidth;
    const ratio = carousel.clientWidth / carousel.scrollWidth;
    const thumbW = ratio * 100;
    const pct = max > 0 ? carousel.scrollLeft / max : 0;
    const maxTranslate = (100 - thumbW) / ratio;
    thumb.style.width = thumbW + "%";
    thumb.style.transform = `translateX(${pct * maxTranslate}%)`;
  }

  carousel.addEventListener("scroll", updateThumb, { passive: true });
  updateThumb();

  // ── Drag-to-scroll + click — using Pointer Events API ──
  let isDragging = false;
  let startX = 0;
  let startScroll = 0;
  let lastX = 0;
  let velocity = 0;
  let rafId = null;
  let pointerDownTarget = null; // capture target before is-dragging blocks children

  carousel.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;             // left click only
    cancelAnimationFrame(rafId);
    isDragging = false;
    pointerDownTarget = e.target;           // save BEFORE is-dragging disables children
    startX = e.clientX;
    lastX = e.clientX;
    startScroll = carousel.scrollLeft;
    velocity = 0;
    carousel.setPointerCapture(e.pointerId);
    carousel.classList.add("is-dragging");
  });

  carousel.addEventListener("pointermove", (e) => {
    if (!carousel.hasPointerCapture(e.pointerId)) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 6) isDragging = true; // only a real drag if moved >6px
    velocity = e.clientX - lastX;
    lastX = e.clientX;
    carousel.scrollLeft = startScroll - dx;
  });

  carousel.addEventListener("pointerup", (e) => {
    if (!carousel.hasPointerCapture(e.pointerId)) return;
    carousel.releasePointerCapture(e.pointerId);
    carousel.classList.remove("is-dragging");

    if (!isDragging) {
      // True click — use the saved target (e.target is carousel due to pointer-events:none on children)
      const slide = pointerDownTarget?.closest(".cert-slide");
      if (slide) {
        const imgSrc = slide.dataset.certImg;
        const title = slide.dataset.certTitle;
        if (imgSrc && title) openCertLightbox(imgSrc, title);
      }
    } else {
      // Release with momentum coast
      momentum();
    }

    isDragging = false;
  });

  carousel.addEventListener("pointercancel", () => {
    carousel.classList.remove("is-dragging");
    isDragging = false;
  });

  function momentum() {
    if (Math.abs(velocity) < 0.5) return;
    carousel.scrollLeft -= velocity;
    velocity *= 0.92;
    rafId = requestAnimationFrame(momentum);
  }
})();



// ─── Portfolio Data & Logic ───
const projectsData = {
  "shuryan": {
    title: "ShurYan Healthcare Platform",
    category: ".NET Core + React",
    award: "Best Project · DEPI",
    description: "ShurYan is a comprehensive digital healthcare ecosystem designed to bridge the gap between patients, doctors, pharmacies, and labs. It features role-based portals, real-time notifications, and secure payment integration. Built with Clean Architecture, it ensures scalability and maintainability for high-traffic healthcare environments.",
    thumbnail: "./assets/images/Projects/ShurYan/BG1.jpg",
    defaultImage: "./assets/images/Projects/ShurYan/Solution.jpeg",
    galleryGroups: [
      {
        label: "DEPI",
        images: [
          "./assets/images/Projects/ShurYan/DEPI-1.jpg",
          "./assets/images/Projects/ShurYan/DEPI-2.jpeg",
          "./assets/images/Projects/ShurYan/DEPI-3.jpeg",
          "./assets/images/Projects/ShurYan/DEPI-4.jpg"
        ]
      },
      {
        label: "ZagTech",
        images: [
          "./assets/images/Projects/ShurYan/ZagTech-1.JPG",
          "./assets/images/Projects/ShurYan/ZagTech-2.jpg",
          "./assets/images/Projects/ShurYan/ZagTech-3.jpg"
        ]
      }
    ],
    tags: ["ASP.NET Core", "React", "SQL Server", "Clean Architecture", "JWT", "SignalR"],
    liveLink: "#",
    githubLink: "#"
  },
  "ecommerce": {
    title: "E-Commerce API",
    category: ".NET Core",
    description: "A robust RESTful API for modern e-commerce platforms. Features include product management, secure cart and checkout flows, order tracking, and advanced user authentication using JWT and Refresh Tokens. Optimized for performance with EF Core and SQL Server.",
    thumbnail: "./assets/images/Projects/Ecommerce/1.png",
    defaultImage: "./assets/images/Projects/Ecommerce/1.png",
    images: [
      "./assets/images/Projects/Ecommerce/1.png",
      "./assets/images/Projects/Ecommerce/2.png",
      "./assets/images/Projects/Ecommerce/3.png",
      "./assets/images/Projects/Ecommerce/4.png"
    ],
    tags: [".NET 8", "EF Core", "SQL Server", "Swagger", "JWT Auth"],
    liveLink: "#",
    githubLink: "https://github.com/E-Commerce-DeepDive/API"
  },
  "ballbreaker": {
    title: "Ball Breaker Game",
    category: "Java",
    description: "An arcade-style Brick Breaker game developed using Java 2D graphics. It features multiple levels of difficulty, power-ups, and a smooth physics engine for ball-paddle-brick collisions. A great exploration of object-oriented design patterns and game loops.",
    thumbnail: "./assets/images/Projects/Ball-Breaker/Start point.png",
    defaultImage: "./assets/images/Projects/Ball-Breaker/Start point.png",
    images: [
      "./assets/images/Projects/Ball-Breaker/Start point.png",
      "./assets/images/Projects/Ball-Breaker/Level 2.png",
      "./assets/images/Projects/Ball-Breaker/Game Over.png"
    ],
    tags: ["Java", "Java 2D", "Game Development", "OOP"],
    liveLink: "#",
    githubLink: "https://github.com/Abdulr7man-3laa/Ball-Breaker-Game"
  },
  "quran-manager": {
    title: "Quran Playlist Manager",
    category: "C++",
    description: "A specialized tool for managing Quranic recitation playlists. Built entirely in C++ using custom-implemented Doubly Linked Lists to handle dynamic playlist operations like adding, removing, and reordering tracks efficiently. Demonstrates strong foundational data structure knowledge.",
    thumbnail: "./assets/images/Projects/quran_cover.png",
    defaultImage: "./assets/images/Projects/quran_cover.png",
    images: ["./assets/images/Projects/quran_cover.png"],
    tags: ["C++", "Data Structures", "Linked Lists", "CLI"],
    liveLink: "#",
    githubLink: "https://github.com/Abdulr7man-3laa/Quran-Playlist-Manager"
  },
  "netsec-toolkit": {
    title: "NetSec Toolkit",
    category: "Python",
    description: "A comprehensive cybersecurity utility built in Python. Features include network scanning, packet sniffing, and vulnerability assessment tools using libraries like Scapy.",
    thumbnail: "./assets/images/Projects/netsec_toolkit_cover.png",
    defaultImage: "./assets/images/Projects/netsec_toolkit_cover.png",
    images: ["./assets/images/Projects/netsec_toolkit_cover.png"],
    tags: ["Python", "Scapy", "Cybersecurity", "Networking"],
    liveLink: "#",
    githubLink: "https://github.com/Abdulr7man-3laa/NetSec-Toolkit"
  },
  "network-scanner": {
    title: "Network Scanner",
    category: "Python",
    description: "An advanced network discovery tool that utilizes ARP requests to map out devices on a local network. Built with Python for fast and efficient scanning and host identification.",
    thumbnail: "./assets/images/Projects/network_scanner_cover.png",
    defaultImage: "./assets/images/Projects/network_scanner_cover.png",
    images: ["./assets/images/Projects/network_scanner_cover.png"],
    tags: ["Python", "ARP", "Networking", "Security"],
    liveLink: "#",
    githubLink: "https://github.com/Abdulr7man-3laa/Network-Scanner"
  },
  "mac-changer": {
    title: "MAC Address Changer",
    category: "Python",
    description: "A Python-based system utility that allows users to easily spoof their MAC address. Uses the subprocess module to interact directly with system network interfaces for enhanced privacy.",
    thumbnail: "./assets/images/Projects/mac_changer_cover.png",
    defaultImage: "./assets/images/Projects/mac_changer_cover.png",
    images: ["./assets/images/Projects/mac_changer_cover.png"],
    tags: ["Python", "Subprocess", "Spoofing", "Privacy"],
    liveLink: "#",
    githubLink: "https://github.com/Abdulr7man-3laa/MAC-Address-Changer"
  },
  "contact-manager": {
    title: "Contact Manager",
    category: "C++",
    description: "A C++ contact management system that enables users to add, search, edit, and organize contacts. Features dynamic storage, file saving, and robust search capabilities. Demonstrates object-oriented programming with modular design for efficient contact tracking and management.",
    thumbnail: "./assets/images/Projects/contact_manager_cover.png",
    defaultImage: "./assets/images/Projects/contact_manager_cover.png",
    images: ["./assets/images/Projects/contact_manager_cover.png"],
    tags: ["C++", "OOP", "File I/O", "Dynamic Storage"],
    liveLink: "#",
    githubLink: "https://github.com/Abdulr7man-3laa/Contact-Manager"
  }
};

(function () {
  // ── FILTERING ──
  const filterBtns = document.querySelectorAll("[data-pf-filter]");
  const pfItems = document.querySelectorAll("[data-pf-item]");
  const pfEmpty = document.getElementById("pfEmpty");

  function filterPortfolio(filterValue) {
    let hasVisibleItems = false;
    filterBtns.forEach(btn => {
      const isActive = btn.dataset.pfValue === filterValue;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-selected", isActive);
    });
    pfItems.forEach(item => {
      const match = filterValue === "all" || item.dataset.pfCategory === filterValue;
      if (match) {
        item.classList.remove("pf-hidden");
        void item.offsetWidth;
        item.classList.add("pf-entering");
        hasVisibleItems = true;
      } else {
        item.classList.add("pf-hidden");
        item.classList.remove("pf-entering");
      }
    });
    if (pfEmpty) pfEmpty.style.display = hasVisibleItems ? "none" : "flex";
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => filterPortfolio(btn.dataset.pfValue));
  });

  // ── SLIDER STATE ──
  let sliderImages = [];
  let sliderIndex = 0;
  let sliderTimer = null;

  const sliderEl = document.getElementById("pfModalSlider");
  const slideImg = document.getElementById("pfModalSlideImg");
  const dotsEl = document.getElementById("pfSliderDots");
  const btnPrev = document.getElementById("pfSliderPrev");
  const btnNext = document.getElementById("pfSliderNext");

  function renderSlide() {
    if (!slideImg) return;
    // Smooth crossfade + subtle scale out
    slideImg.style.opacity = "0";
    slideImg.style.transform = "translateZ(0) scale(1.04)";
    setTimeout(() => {
      slideImg.src = sliderImages[sliderIndex];
      slideImg.alt = `Slide ${sliderIndex + 1}`;
      slideImg.style.opacity = "1";
      slideImg.style.transform = "translateZ(0) scale(1)";
    }, 380);

    // Update dots
    if (dotsEl) {
      dotsEl.querySelectorAll(".pf-slider__dot").forEach((d, i) =>
        d.classList.toggle("active", i === sliderIndex)
      );
    }

    // Hide arrows when only 1 image
    const single = sliderImages.length <= 1;
    if (btnPrev) btnPrev.style.display = single ? "none" : "";
    if (btnNext) btnNext.style.display = single ? "none" : "";
    if (dotsEl) dotsEl.style.display = single ? "none" : "";
  }

  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = sliderImages.map((_, i) =>
      `<button class="pf-slider__dot${i === 0 ? " active" : ""}" data-idx="${i}" aria-label="Go to slide ${i + 1}"></button>`
    ).join("");
    dotsEl.querySelectorAll(".pf-slider__dot").forEach(btn => {
      btn.addEventListener("click", () => {
        sliderIndex = parseInt(btn.dataset.idx);
        renderSlide();
        restartAutoPlay();
      });
    });
  }

  function goNext() {
    sliderIndex = (sliderIndex + 1) % sliderImages.length;
    renderSlide();
  }

  function goPrev() {
    sliderIndex = (sliderIndex - 1 + sliderImages.length) % sliderImages.length;
    renderSlide();
  }

  function startAutoPlay() {
    stopAutoPlay();
    if (sliderImages.length > 1) sliderTimer = setInterval(goNext, 3000);
  }

  function stopAutoPlay() {
    if (sliderTimer) { clearInterval(sliderTimer); sliderTimer = null; }
  }

  function restartAutoPlay() { stopAutoPlay(); startAutoPlay(); }

  function initSlider(images) {
    sliderImages = images;
    sliderIndex = 0;
    buildDots();
    renderSlide();
    startAutoPlay();
  }

  // Pause on hover
  if (sliderEl) {
    sliderEl.addEventListener("mouseenter", stopAutoPlay);
    sliderEl.addEventListener("mouseleave", startAutoPlay);
  }
  if (btnPrev) btnPrev.addEventListener("click", (e) => { e.stopPropagation(); goPrev(); restartAutoPlay(); });
  if (btnNext) btnNext.addEventListener("click", (e) => { e.stopPropagation(); goNext(); restartAutoPlay(); });

  // ── GALLERY GROUPS ──
  function renderGalleryGroups(groups, allImages) {
    const groupsEl = document.getElementById("pfGalleryGroups");
    if (!groupsEl) return;
    groupsEl.innerHTML = groups.map((g, i) =>
      `<button class="pf-gallery-group-btn" data-group-idx="${i}">${g.label}</button>`
    ).join("");
    groupsEl.querySelectorAll(".pf-gallery-group-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.groupIdx);
        const isActive = btn.classList.contains("active");
        // Deactivate all buttons
        groupsEl.querySelectorAll(".pf-gallery-group-btn").forEach(b => b.classList.remove("active"));
        if (isActive) {
          // Was active → reset to all images
          initSlider(allImages);
        } else {
          // Activate this group
          btn.classList.add("active");
          initSlider(groups[idx].images);
        }
      });
    });
  }

  // ── MODAL LOGIC ──
  const modal = document.getElementById("pfModal");
  const modalBackdrop = document.getElementById("pfModalBackdrop");
  const modalClose = document.getElementById("pfModalClose");

  const ui = {
    category: document.getElementById("pfModalCategory"),
    award: document.getElementById("pfModalAward"),
    title: document.getElementById("pfModalTitle"),
    desc: document.getElementById("pfModalDesc"),
    tags: document.getElementById("pfModalTags"),
    live: document.getElementById("pfModalLive"),
    github: document.getElementById("pfModalGithub")
  };

  let lastFocusedElement = null;

  function openModal(projectId) {
    const data = projectsData[projectId];
    if (!data) return;

    lastFocusedElement = document.activeElement;

    // Tag the slider with the project ID for per-project CSS overrides
    if (sliderEl) sliderEl.dataset.project = projectId;

    // ── Slider / Images ──
    const groupsEl = document.getElementById("pfGalleryGroups");
    if (data.galleryGroups) {
      // Build full image list: defaultImage + ALL group images combined
      const allImages = [
        data.defaultImage,
        ...data.galleryGroups.flatMap(g => g.images)
      ];
      initSlider(allImages);
      // Gallery group buttons removed — slider covers all images automatically
      if (groupsEl) { groupsEl.innerHTML = ""; groupsEl.style.display = "none"; }
    } else {
      // Plain images array
      const imgs = (data.images && data.images.length) ? data.images : [data.thumbnail || data.defaultImage];
      initSlider(imgs);
      if (groupsEl) { groupsEl.innerHTML = ""; groupsEl.style.display = "none"; }
    }

    // ── Text details ──
    if (ui.category) ui.category.textContent = data.category;
    if (ui.title) ui.title.textContent = data.title;
    if (ui.desc) ui.desc.textContent = data.description;

    if (ui.award) {
      if (data.award) {
        ui.award.textContent = data.award;
        ui.award.style.display = "inline-flex";
      } else {
        ui.award.style.display = "none";
      }
    }

    if (ui.tags) ui.tags.innerHTML = data.tags.map(t => `<span>${t}</span>`).join("");

    if (ui.live) {
      ui.live.href = data.liveLink;
      ui.live.style.display = data.liveLink === "#" ? "none" : "inline-flex";
    }
    if (ui.github) {
      ui.github.href = data.githubLink;
      ui.github.style.display = data.githubLink === "#" ? "none" : "inline-flex";
    }

    // ── Show modal ──
    if (modal) {
      modal.classList.add("active");
      modal.setAttribute("aria-hidden", "false");
    }
    document.body.style.overflow = "hidden";
    setTimeout(() => { if (modalClose) modalClose.focus(); }, 100);
  }

  function closeModal() {
    stopAutoPlay();
    if (modal) {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
    }
    document.body.style.overflow = "";
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  // ── Card click bindings ──
  pfItems.forEach(item => {
    item.addEventListener("click", () => openModal(item.dataset.projectId));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(item.dataset.projectId); }
    });
  });

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) closeModal();
  });

  // Init
  filterPortfolio("all");
})();



// ─── Codeforces API ───
const CF_HANDLE = "BoDa_Alaa";
let cachedRatingHistory = null;

async function fetchCodeforcesData() {
  try {
    const [userRes, ratingRes] = await Promise.all([
      fetch("https://codeforces.com/api/user.info?handles=" + CF_HANDLE),
      fetch("https://codeforces.com/api/user.rating?handle=" + CF_HANDLE),
    ]);

    const userData = await userRes.json();
    const ratingData = await ratingRes.json();

    if (userData.status === "OK" && userData.result.length > 0) {
      const user = userData.result[0];
      let contestsCount = 0;

      if (ratingData.status === "OK") {
        cachedRatingHistory = ratingData.result;
        contestsCount = ratingData.result.length;
        drawRatingChart("cfChart", ratingData.result);
      }

      const rating = user.rating != null ? user.rating : "Unrated";
      const rank = capitalize(user.rank || "—");
      const org = user.organization || "";

      const linkIcon = `<a href="https://codeforces.com/profile/${CF_HANDLE}" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; justify-content: center; color: var(--orange-yellow-crayola); margin-left: 6px; transform: translateY(2px); transition: color 0.2s ease;" title="View full profile on Codeforces"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg></a>`;
      const cfSummary = document.getElementById("cfSummaryText");
      if (cfSummary) {
        cfSummary.innerHTML = `<strong>${rating}</strong> rating (<span id="cfRankSpan">${rank}</span>) &middot; <strong>${contestsCount}</strong> contests${org ? ` &middot; ${org}` : ""}${linkIcon}`;
      }

      applyRankColor("cfRankSpan", user.rank);
    }
  } catch (err) {
    console.error("Codeforces API error:", err);
    const cfSummary = document.getElementById("cfSummaryText");
    if (cfSummary) {
      cfSummary.innerText = "Codeforces stats unavailable.";
    }
  }
}

function setTextById(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function capitalize(str) {
  if (!str) return "—";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getRankColor(rank) {
  if (!rank) return "#808080";
  const colors = {
    newbie: "#808080",
    pupil: "#008000",
    specialist: "#03A89E",
    expert: "#0000FF",
    "candidate master": "#AA00AA",
    master: "#FF8C00",
    "international master": "#FF8C00",
    grandmaster: "#FF0000",
    "international grandmaster": "#FF0000",
    "legendary grandmaster": "#FF0000",
  };
  return colors[rank.toLowerCase()] || "#808080";
}

function applyRankColor(id, rank) {
  const el = document.getElementById(id);
  if (el && rank) {
    el.style.color = getRankColor(rank);
  }
}

// ─── Rating Chart (Canvas) ───
function drawRatingChart(canvasId, ratingData) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !ratingData || ratingData.length === 0) return;

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  const container = canvas.parentElement;
  const w = container.clientWidth;
  const h = 260;

  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  ctx.scale(dpr, dpr);

  const pad = { top: 28, right: 28, bottom: 44, left: 52 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const ratings = ratingData.map((d) => d.newRating);
  const minR = 0;
  const maxR = Math.ceil((Math.max(...ratings) + 150) / 200) * 200;

  const xPos = (i) =>
    pad.left + (i / Math.max(ratingData.length - 1, 1)) * chartW;
  const yPos = (r) =>
    pad.top + chartH - ((r - minR) / (maxR - minR)) * chartH;

  // Clear
  ctx.clearRect(0, 0, w, h);

  // Rating tier bands (very subtle)
  const tiers = [
    { lo: 0, hi: 1200, color: "rgba(128,128,128,0.04)" },
    { lo: 1200, hi: 1400, color: "rgba(0,128,0,0.04)" },
    { lo: 1400, hi: 1600, color: "rgba(3,168,158,0.04)" },
  ];
  tiers.forEach((t) => {
    if (t.lo >= maxR) return;
    const y1 = yPos(Math.min(t.hi, maxR));
    const y2 = yPos(t.lo);
    ctx.fillStyle = t.color;
    ctx.fillRect(pad.left, y1, chartW, y2 - y1);
  });

  // Horizontal grid + labels
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let r = 0; r <= maxR; r += 200) {
    const y = yPos(r);
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.font = "11px Outfit, sans-serif";
    ctx.fillText(r.toString(), pad.left - 10, y);
  }

  // Gradient fill under curve
  const grad = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
  grad.addColorStop(0, "rgba(26, 185, 232, 0.10)");
  grad.addColorStop(1, "rgba(224, 184, 76, 0)");

  ctx.beginPath();
  ratingData.forEach((d, i) => {
    const x = xPos(i);
    const y = yPos(d.newRating);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.lineTo(xPos(ratingData.length - 1), h - pad.bottom);
  ctx.lineTo(pad.left, h - pad.bottom);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Rating line
  ctx.beginPath();
  ctx.strokeStyle = "#1ab9e8";
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ratingData.forEach((d, i) => {
    const x = xPos(i);
    const y = yPos(d.newRating);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Data points
  ratingData.forEach((d, i) => {
    const x = xPos(i);
    const y = yPos(d.newRating);

    // Soft glow
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(26, 185, 232, 0.08)";
    ctx.fill();

    // Dot
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#1ab9e8";
    ctx.fill();
    ctx.strokeStyle = "rgba(30, 30, 30, 0.9)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // X-axis labels
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.font = "10px Outfit, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ratingData.forEach((d, i) => {
    // Show every label if few contests, or skip some if many
    if (ratingData.length <= 15 || i % 2 === 0 || i === ratingData.length - 1) {
      ctx.fillText("#" + (i + 1), xPos(i), h - pad.bottom + 10);
    }
  });
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", fetchCodeforcesData);

// Redraw chart on resize (debounced)
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (cachedRatingHistory) {
      drawRatingChart("cfChart", cachedRatingHistory);
    }
  }, 250);
});

// ─── References filter + row keyboard support ───
(function () {
  const refFilterBtns = document.querySelectorAll("[data-ref-filter]");
  const refItems = document.querySelectorAll("[data-ref-item]");
  const refEmpty = document.getElementById("refEmpty");

  // Map button label → category value (lowercased to match data-ref-category)
  function btnToCategory(btn) {
    return btn.textContent.trim().toLowerCase();
  }

  function filterRefs(category) {
    let anyVisible = false;
    let visibleIndex = 0;

    refItems.forEach((item) => {
      const match =
        category === "all" ||
        item.dataset.refCategory === category;

      if (match) {
        item.style.display = "";
        // Stagger entrance
        item.style.transitionDelay = visibleIndex * 55 + "ms";
        anyVisible = true;
        visibleIndex++;
      } else {
        item.style.display = "none";
        item.style.transitionDelay = "0ms";
      }
    });

    if (refEmpty) refEmpty.style.display = anyVisible ? "none" : "";
  }

  refFilterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      refFilterBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      filterRefs(btnToCategory(this));
    });
  });

  // Keyboard: Enter / Space activates a ref-row
  refItems.forEach((row) => {
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        row.click();
      }
    });
  });
})();

// ─── PDF Lightbox ───
(function () {
  const lightbox = document.getElementById("pdfLightbox");
  const frame = document.getElementById("pdfLightboxFrame");
  const titleEl = document.getElementById("pdfLightboxTitle");
  const closeBtn = document.getElementById("pdfLightboxClose");
  const downloadBtn = document.getElementById("pdfDownloadBtn");

  if (!lightbox) return;

  function openPDF(src, title) {
    frame.src = src;
    titleEl.textContent = title;
    if (downloadBtn) { downloadBtn.href = src; downloadBtn.download = title; }
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closePDF() {
    lightbox.classList.remove("active");
    frame.src = "";
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-ref-item]").forEach((card) => {
    card.addEventListener("click", () => {
      const pdf = card.dataset.pdf;
      const title = card.dataset.refTitle || "Document";
      if (pdf) openPDF(pdf, title);
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closePDF);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("pdf-lightbox-backdrop")) {
      closePDF();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) closePDF();
  });
})();

// ─── Contact Form ───
(function () {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("contactSubmitBtn");
  const formStatus = document.getElementById("formStatus");
  const textarea = document.getElementById("contactMessage");
  const counter = document.getElementById("charCounter");

  if (!form) return;

  // Character counter
  if (textarea && counter) {
    textarea.addEventListener("input", () => {
      const len = textarea.value.length;
      const max = parseInt(textarea.getAttribute("maxlength"), 10) || 500;
      counter.textContent = len + "\u2009/\u2009" + max;
      counter.classList.toggle("near-limit", len >= max * 0.8 && len < max);
      counter.classList.toggle("at-limit", len >= max);
    });
  }

  // Field validation helpers
  function validateField(input, errorId, rules) {
    const group = input.closest(".form-group");
    const errorEl = document.getElementById(errorId);
    let message = "";

    for (const rule of rules) {
      if (!rule.test(input.value)) { message = rule.message; break; }
    }

    if (errorEl) errorEl.textContent = message;
    group.classList.toggle("has-error", !!message);
    group.classList.toggle("is-valid", !message && input.value.trim() !== "");
    return !message;
  }

  const fields = [
    {
      id: "contactName", errorId: "nameError",
      rules: [
        { test: (v) => v.trim() !== "", message: "Please enter your name." },
        { test: (v) => v.trim().length >= 2, message: "Name must be at least 2 characters." },
      ],
    },
    {
      id: "contactEmail", errorId: "emailError",
      rules: [
        { test: (v) => v.trim() !== "", message: "Please enter your email address." },
        { test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), message: "Please enter a valid email address." },
      ],
    },
    {
      id: "contactSubject", errorId: "subjectError",
      rules: [
        { test: (v) => v.trim() !== "", message: "Please enter a subject." },
      ],
    },
    {
      id: "contactMessage", errorId: "messageError",
      rules: [
        { test: (v) => v.trim() !== "", message: "Please write your message." },
        { test: (v) => v.trim().length >= 10, message: "Message must be at least 10 characters." },
      ],
    },
  ];

  // Validate on blur
  fields.forEach(({ id, errorId, rules }) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("blur", () => validateField(input, errorId, rules));
    }
  });

  // Submit handler
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validate all
    let allValid = true;
    fields.forEach(({ id, errorId, rules }) => {
      const input = document.getElementById(id);
      if (input && !validateField(input, errorId, rules)) allValid = false;
    });

    if (!allValid) return;

    // Loading state
    submitBtn.classList.add("is-loading");
    submitBtn.disabled = true;
    if (formStatus) { formStatus.textContent = ""; formStatus.className = "form-status"; }

    // Collect values
    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const subject = document.getElementById("contactSubject").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    // Simulate send with mailto fallback after brief delay
    setTimeout(() => {
      submitBtn.classList.remove("is-loading");
      submitBtn.disabled = false;

      try {
        const body = encodeURIComponent(
          "From: " + name + " <" + email + ">\n\n" + message
        );
        window.location.href =
          "mailto:abdulrhman.alaa.dev@gmail.com" +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + body;

        if (formStatus) {
          formStatus.textContent = "\u2714 Message prepared \u2014 your email client will open.";
          formStatus.className = "form-status success";
        }
        form.reset();
        if (counter) counter.textContent = "0\u2009/\u2009500";
        fields.forEach(({ id }) => {
          const g = document.getElementById(id)?.closest(".form-group");
          if (g) { g.classList.remove("has-error", "is-valid"); }
        });

      } catch (_) {
        if (formStatus) {
          formStatus.textContent = "\u26A0 Something went wrong. Try emailing directly.";
          formStatus.className = "form-status error";
        }
      }
    }, 1500);
  });
})();

// ─── Resume counter-up animation ───
(function () {
  let countersRun = false;

  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

  function runCounters() {
    const nums = document.querySelectorAll('[data-counter], [data-counter-decimal]');
    nums.forEach((el) => {
      const isDecimal = el.hasAttribute('data-counter-decimal');
      const target = parseFloat(isDecimal
        ? el.getAttribute('data-counter-decimal')
        : el.getAttribute('data-counter'));
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutQuart(progress);
        const current = isDecimal
          ? (eased * target).toFixed(1)
          : Math.round(eased * target);

        el.innerHTML = isDecimal
          ? current
          : current + (suffix ? '<sup>' + suffix + '</sup>' : '');

        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    });
  }

  const resumeArticle = document.querySelector('[data-page="resume"]');
  if (resumeArticle) {
    const observer = new MutationObserver(() => {
      if (resumeArticle.classList.contains('active') && !countersRun) {
        countersRun = true;
        setTimeout(runCounters, 350);
      }
      if (!resumeArticle.classList.contains('active')) {
        countersRun = false; // reset so counters replay next visit
      }
    });
    observer.observe(resumeArticle, { attributes: true, attributeFilter: ['class'] });
  }
})();

// Copy Discord logic
window.copyDiscord = function (btn) {
  navigator.clipboard.writeText('abdulr7man_3laa');

  let tooltip = btn.querySelector('.copy-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('span');
    tooltip.className = 'copy-tooltip';
    tooltip.textContent = 'Copied!';
    btn.appendChild(tooltip);
  }

  tooltip.classList.add('active');
  setTimeout(() => {
    tooltip.classList.remove('active');
  }, 2000);
};

// Fetch GitHub Stats
(async function fetchGithubStats() {
  const username = "Abdulr7man-3laa";
  try {
    const apiRes = await fetch(`https://api.github.com/users/${username}`);
    const apiData = await apiRes.json();
    const reposCount = apiData.public_repos !== undefined ? apiData.public_repos : "—";

    const contRes = await fetch(`https://github-contributions-api.deno.dev/${username}.json`);
    const contData = await contRes.json();

    const summaryElem = document.getElementById('githubSummaryText');
    if (summaryElem) {
      if (contData.totalContributions !== undefined) {
        summaryElem.innerHTML = `<strong>${contData.totalContributions}</strong> contributions in the last year &middot; <strong>${reposCount}</strong> public repos`;
      } else {
        summaryElem.innerText = "GitHub stats loaded.";
      }
    }
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    const summaryElem = document.getElementById('githubSummaryText');
    if (summaryElem) summaryElem.innerText = "GitHub stats unavailable.";
  }
})();

// ─── Spatial UI Interactive Logic ───
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.bento-card-container');
  const bezels = document.querySelectorAll('.bento-outer-bezel');

  // 1. Mouse coordinate tracking for the spotlight effect
  document.addEventListener('mousemove', (e) => {
    bezels.forEach(bezel => {
      const rect = bezel.getBoundingClientRect();
      // Calculate mouse position relative to the element
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Update CSS variables for the spotlight gradients
      bezel.style.setProperty('--mouse-x', `${x}px`);
      bezel.style.setProperty('--mouse-y', `${y}px`);

      // Also pass down to inner bezel for secondary spotlight
      const innerBezel = bezel.querySelector('.bento-inner-bezel');
      if (innerBezel) {
        innerBezel.style.setProperty('--mouse-x', `${x}px`);
        innerBezel.style.setProperty('--mouse-y', `${y}px`);
      }
    });
  });

  // 2. 3D Spatial Tilt Effect (Awwwards Style)
  cards.forEach(card => {
    const outerBezel = card.querySelector('.bento-outer-bezel');
    if (!outerBezel) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate rotation angles
      // The origin (0,0) is center of the card
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Max rotation in degrees
      const maxRotate = 4;

      const rotateX = ((y - centerY) / centerY) * -maxRotate;
      const rotateY = ((x - centerX) / centerX) * maxRotate;

      // Apply the transformation
      outerBezel.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    // Reset on mouse leave
    card.addEventListener('mouseleave', () => {
      outerBezel.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
});
