// Theme toggle with local storage persistence
const toggle = document.getElementById("themeToggle");
toggle?.addEventListener("click", () => {
  document.body.classList.toggle("light");
  localStorage.setItem("pushkar-theme", document.body.classList.contains("light") ? "light" : "dark");
});
if (localStorage.getItem("pushkar-theme") === "light") {
  document.body.classList.add("light");
}

// Lightbox Modal for Full-Resolution Image Inspection
const lightboxModal = document.getElementById("lightboxModal");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxBackdrop = document.querySelector(".lightbox-backdrop");

function openLightbox(src) {
  if (!lightboxModal || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxModal.classList.add("active");
  lightboxModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightboxModal) return;
  lightboxModal.classList.remove("active");
  lightboxModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-zoom]").forEach(el => {
  el.addEventListener("click", (e) => {
    const src = el.getAttribute("data-zoom");
    if (src) openLightbox(src);
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightboxBackdrop?.addEventListener("click", closeLightbox);
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightboxModal?.classList.contains("active")) {
    closeLightbox();
  }
});

// Toast notification for email copying
const toast = document.getElementById("toast");
const copyEmailBtn = document.getElementById("copyEmailBtn");
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("active");
  setTimeout(() => { toast.classList.remove("active"); }, 3200);
}

copyEmailBtn?.addEventListener("click", () => {
  const email = copyEmailBtn.getAttribute("data-email") || "pushkarsehrawat0369@gmail.com";
  navigator.clipboard.writeText(email).then(() => {
    showToast(`✓ Copied ${email} to clipboard!`);
  }).catch(() => {
    showToast(`✓ Email: ${email}`);
  });
});

// Smooth reveal on scroll
const reveal = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("revealed");
      reveal.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".reveal").forEach(el => { reveal.observe(el); });

const style = document.createElement("style");
style.textContent = ".reveal { opacity: 0; transform: translateY(40px) scale(0.95); transition: all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275); } .reveal.revealed { opacity: 1; transform: translateY(0) scale(1); }";
document.head.appendChild(style);

// EXTREME 3D TILT EFFECT (2050 Aesthetic)
const tiltElements = document.querySelectorAll('[class~="3d-tilt"], .glass-card');
tiltElements.forEach(el => {
  el.style.transformStyle = "preserve-3d";
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPct = (x / rect.width - 0.5) * 2;
    const yPct = (y / rect.height - 0.5) * 2;
    const rotateX = -yPct * 30; // Increased to 30deg for more 4D feel
    const rotateY = xPct * 30;
    
    el.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.08, 1.08, 1.08)`;
    el.style.transition = "transform 0.1s ease-out";
    el.style.zIndex = "10";
    
    const children = el.querySelectorAll('img, h3, .floating-icon, strong, .card-img-wrap, .frame-content');
    children.forEach(child => {
      child.style.transform = `translateZ(80px)`; // Deep 4D pop
      child.style.transition = "transform 0.1s ease-out";
    });
  });
  
  el.addEventListener('mouseleave', () => {
    el.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    el.style.transition = "transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)";
    el.style.zIndex = "1";
    const children = el.querySelectorAll('img, h3, .floating-icon, strong, .card-img-wrap, .frame-content');
    children.forEach(child => {
      child.style.transform = `translateZ(0px)`;
      child.style.transition = "transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)";
    });
  });
});

// ==========================================
// 4D TIME-SPACE WARP BACKGROUND (CANVAS)
// ==========================================
const canvas = document.getElementById("canvas4d");
const ctx = canvas.getContext("2d");

let width, height;
let stars = [];
const numStars = 800;
let scrollVelocity = 0;
let lastScrollY = window.scrollY;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

window.addEventListener("resize", resize);
resize();

// Map time dimension to scroll velocity
window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;
  const deltaY = currentScrollY - lastScrollY;
  scrollVelocity = deltaY * 0.15; // Calculate warp speed based on scroll speed
  lastScrollY = currentScrollY;
});

class Star {
  constructor() {
    this.reset(true);
  }
  
  reset(randomZ = false) {
    this.x = (Math.random() - 0.5) * 2000;
    this.y = (Math.random() - 0.5) * 2000;
    this.z = randomZ ? Math.random() * 2000 : 2000;
    this.pz = this.z;
  }
  
  update(speedBase) {
    this.pz = this.z;
    // 4D factor: Time dilation based on scroll velocity + base speed
    const currentSpeed = speedBase + Math.abs(scrollVelocity) * 15;
    this.z -= currentSpeed;
    
    if (this.z < 1) {
      this.reset();
    }
  }
  
  draw() {
    const fov = 300;
    // Projection from 3D to 2D
    const sx = (this.x / this.z) * fov + width / 2;
    const sy = (this.y / this.z) * fov + height / 2;
    
    const px = (this.x / this.pz) * fov + width / 2;
    const py = (this.y / this.pz) * fov + height / 2;
    
    const isLightMode = document.body.classList.contains("light");
    
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(sx, sy);
    
    // Scale opacity based on depth (Z)
    const opacity = 1 - (this.z / 2000);
    const color = isLightMode ? `rgba(0, 0, 0, ${opacity})` : `rgba(200, 255, 67, ${opacity})`;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(0.5, (1 - this.z / 2000) * 3);
    ctx.stroke();
  }
}

for (let i = 0; i < numStars; i++) {
  stars.push(new Star());
}

function animate4D() {
  ctx.clearRect(0, 0, width, height);
  
  // Base speed is very slow to represent standard time flow
  const baseSpeed = 2;
  
  // Decay scroll velocity (friction)
  scrollVelocity *= 0.95;
  
  // Optional: subtle rotation to give a 4D twist
  const twist = Math.sin(Date.now() * 0.0005) * 0.2;
  
  ctx.save();
  ctx.translate(width/2, height/2);
  ctx.rotate(twist + scrollVelocity * 0.005);
  ctx.translate(-width/2, -height/2);

  stars.forEach(star => {
    star.update(baseSpeed);
    star.draw();
  });
  
  ctx.restore();
  
  requestAnimationFrame(animate4D);
}

animate4D();
