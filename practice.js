const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbCap = document.getElementById("lb-caption");
const lbSub = document.getElementById("lb-sub");
const lbCount = document.getElementById("lb-counter");

let visibleItems = [];
let currentIndex = 0;

function getVisible() {
  return [...gallery.querySelectorAll(".gallery-item:not(.hidden)")];
}

// ── FILTER ──
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const cat = btn.dataset.filter;
    document.querySelectorAll(".gallery-item").forEach((item) => {
      if (cat === "all" || item.dataset.category === cat) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });
  });
});

// ── OPEN LIGHTBOX ──
gallery.addEventListener("click", (e) => {
  const item = e.target.closest(".gallery-item");
  if (!item) return;
  visibleItems = getVisible();
  currentIndex = visibleItems.indexOf(item);
  showSlide(currentIndex);
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
});

function showSlide(idx) {
  const item = visibleItems[idx];
  const img = item.querySelector("img");
  lbImg.style.opacity = "0";
  setTimeout(() => {
    lbImg.src = img.src.replace("w=600", "w=1200");
    lbImg.alt = img.alt;
    lbImg.style.opacity = "1";
  }, 180);
  lbCap.textContent = item.dataset.title;
  lbSub.textContent = item.dataset.desc;
  lbCount.textContent = `${idx + 1} / ${visibleItems.length}`;
}

// ── NAV ──
document.getElementById("lb-prev").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
  showSlide(currentIndex);
});

document.getElementById("lb-next").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % visibleItems.length;
  showSlide(currentIndex);
});

// ── CLOSE ──
function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("lb-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// ── KEYBOARD ──
document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "ArrowLeft") {
    currentIndex =
      (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    showSlide(currentIndex);
  }
  if (e.key === "ArrowRight") {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    showSlide(currentIndex);
  }
  if (e.key === "Escape") closeLightbox();
});
