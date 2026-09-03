const galleryImages = document.querySelectorAll(".gallery img");
const lightbox = document.querySelector(".lightbox");
const lightboxImg = document.querySelector(".lightbox-img");

const closeBtn = document.querySelector(".close");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

let currentIndex = 0;

// Open lightbox

galleryImages.forEach((img, index) => {
  img.addEventListener("click", () => {
    currentIndex = index;
    showImage();

    lightbox.classList.add("active");
  });
});

function showImage() {
  lightboxImg.src = galleryImages[currentIndex].src;
}

// Close

closeBtn.addEventListener("click", () => {
  lightbox.classList.remove("active");
});

// Next

nextBtn.addEventListener("click", () => {
  currentIndex++;

  if (currentIndex >= galleryImages.length) {
    currentIndex = 0;
  }

  showImage();
});

// Previous

prevBtn.addEventListener("click", () => {
  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = galleryImages.length - 1;
  }

  showImage();
});

// Close by clicking outside

lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove("active");
  }
});

// Keyboard navigation

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;

  if (e.key === "ArrowRight") {
    nextBtn.click();
  }

  if (e.key === "ArrowLeft") {
    prevBtn.click();
  }

  if (e.key === "Escape") {
    lightbox.classList.remove("active");
  }
});

// FILTERS

const filterButtons = document.querySelectorAll(".filter-btn");
const images = document.querySelectorAll(".image");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;

    images.forEach((image) => {
      if (filter === "all") {
        image.style.display = "block";
      } else if (image.classList.contains(filter)) {
        image.style.display = "block";
      } else {
        image.style.display = "none";
      }
    });
  });
});
