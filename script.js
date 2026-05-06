// Navbar scroll effect
const navbar = document.getElementById('navbar');
const fab = document.querySelector('.fab');

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 60;
  navbar.classList.toggle('scrolled', scrolled);
  if (fab) fab.classList.toggle('visible', window.scrollY > 400);
});

// Mobile nav toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Set min date on booking form to today
const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

// Booking form submission
const form = document.getElementById('booking-form');
const successMsg = document.getElementById('booking-success');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const required = form.querySelectorAll('[required]');
    let valid = true;

    required.forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#e05555';
        field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
      }
    });

    if (!valid) return;

    // Simulate submission — wire up to a real backend or booking service here
    form.style.display = 'none';
    successMsg.style.display = 'block';
  });
}

function resetForm() {
  form.reset();
  form.style.display = 'block';
  successMsg.style.display = 'none';
}

// Scroll reveal animation
const revealEls = document.querySelectorAll(
  '.service-card, .contact-item, .stat, .about-text p'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`;
  observer.observe(el);
});

/* ============================================================
   NEW FEATURES LOGIC
   ============================================================ */


// 2. Animated Stats
const animatedStats = document.querySelectorAll('.stat-num');
if (animatedStats.length > 0) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        const suffix = entry.target.getAttribute('data-suffix');
        let current = 0;
        const increment = target / 50; // 50 steps
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            entry.target.textContent = target + suffix;
            clearInterval(timer);
          } else {
            entry.target.textContent = Math.ceil(current) + suffix;
          }
        }, 30);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  animatedStats.forEach(stat => statsObserver.observe(stat));
}


// 4. Style Quiz Logic
const startQuizBtn = document.getElementById('start-quiz');
const restartQuizBtn = document.getElementById('restart-quiz');
const quizIntro = document.getElementById('quiz-intro');
const quizStep1 = document.getElementById('quiz-step-1');
const quizStep2 = document.getElementById('quiz-step-2');
const quizResult = document.getElementById('quiz-result');
const resultTitle = document.getElementById('quiz-result-title');
const resultDesc = document.getElementById('quiz-result-desc');
const quizBtns = document.querySelectorAll('.quiz-btn');

let quizData = { shape: '', type: '' };

if (startQuizBtn) {
  startQuizBtn.addEventListener('click', () => {
    quizIntro.style.display = 'none';
    quizStep1.style.display = 'block';
  });

  restartQuizBtn.addEventListener('click', () => {
    quizResult.style.display = 'none';
    quizData = { shape: '', type: '' };
    quizBtns.forEach(b => b.classList.remove('selected'));
    quizIntro.style.display = 'block';
  });

  quizBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Step 1
      if (btn.hasAttribute('data-shape')) {
        quizData.shape = btn.getAttribute('data-shape');
        quizStep1.style.display = 'none';
        quizStep2.style.display = 'block';
      }
      // Step 2
      else if (btn.hasAttribute('data-type')) {
        quizData.type = btn.getAttribute('data-type');
        quizStep2.style.display = 'none';
        showQuizResult();
      }
    });
  });

  function showQuizResult() {
    let title = 'The Taper Fade';
    let desc = 'A clean, modern look that keeps the weight on top while sharpening the edges.';

    if (quizData.shape === 'round' || quizData.type === 'thick') {
      title = 'The Burst Fade';
      desc = 'Perfect for adding structure to your face shape while keeping the sides neat and stylish.';
    } else if (quizData.shape === 'square') {
      title = 'The Skin Fade';
      desc = 'A sharp, high-contrast cut that complements a strong jawline perfectly.';
    } else if (quizData.type === 'wavy') {
      title = 'Taper with Textured Top';
      desc = 'Let your natural waves flow on top while keeping the sides clean with a sharp taper.';
    }

    resultTitle.textContent = title;
    resultDesc.textContent = desc;
    quizResult.style.display = 'block';
  }
}

// 5. FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    const item = question.parentElement;
    const isActive = item.classList.contains('active');
    
    // Close all
    document.querySelectorAll('.faq-item').forEach(el => {
      el.classList.remove('active');
      el.querySelector('.faq-answer').style.maxHeight = null;
    });

    if (!isActive) {
      item.classList.add('active');
      const answer = item.querySelector('.faq-answer');
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

// 6. Interactive Availability Widget (Live Booking CTA)
const awStatus = document.getElementById('aw-status');
const awTime = document.getElementById('aw-time');

if (awStatus && awTime) {
  setTimeout(() => {
    awStatus.textContent = 'Live Booking Calendar';
    awTime.textContent = 'Check Available Slots →';
    awTime.style.color = 'var(--gold)';
  }, 1500);
}

// 7. Loading Screen
const loadingScreen = document.getElementById('loading-screen');
if (loadingScreen) {
  window.addEventListener('load', () => {
    setTimeout(() => loadingScreen.classList.add('hidden'), 600);
  });
}

// 8. Open/Closed Status Bar
const statusDot  = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
if (statusDot && statusText) {
  const now  = new Date();
  const day  = now.getDay(); // 0=Sun, 5=Fri, 6=Sat
  const hour = now.getHours() + now.getMinutes() / 60;
  const isOpen = (day === 0 || day === 5 || day === 6) && hour >= 10 && hour < 20;
  statusDot.classList.add(isOpen ? 'open' : 'closed');
  statusText.textContent = isOpen ? 'Open Now' : 'Closed Now';
}

// 9. Back to Top Button
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 10. Cookie Banner
const cookieBanner  = document.getElementById('cookie-banner');
const cookieAccept  = document.getElementById('cookie-accept');
if (cookieBanner && !localStorage.getItem('cookieAccepted')) {
  setTimeout(() => cookieBanner.classList.add('visible'), 1500);
  cookieAccept.addEventListener('click', () => {
    cookieBanner.classList.remove('visible');
    localStorage.setItem('cookieAccepted', '1');
  });
}

/* ============================================================
   GALLERY — filters, stagger entrance, lightbox
   ============================================================ */
const galleryItems   = Array.from(document.querySelectorAll('.gallery-item'));
const filterBtns     = document.querySelectorAll('.gallery-filter');
const lightbox       = document.getElementById('lightbox');
const lightboxContent = document.getElementById('lightbox-content');
const lightboxCounter = document.getElementById('lightbox-counter');
const lbClose        = document.getElementById('lightbox-close');
const lbPrev         = document.getElementById('lightbox-prev');
const lbNext         = document.getElementById('lightbox-next');
const lbBackdrop     = document.getElementById('lightbox-backdrop');

// Stagger entrance
const galleryObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = galleryItems.indexOf(el) * 80;
      setTimeout(() => el.classList.add('in-view'), delay);
      galleryObserver.unobserve(el);
    }
  });
}, { threshold: 0.1 });
galleryItems.forEach(item => galleryObserver.observe(item));

// Filter tabs
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      const match = filter === 'all' || item.dataset.type === filter;
      item.classList.toggle('hidden-item', !match);
    });
  });
});

// Lightbox
let currentIndex = 0;
const visibleItems = () => galleryItems.filter(i => !i.classList.contains('hidden-item'));

function openLightbox(index) {
  currentIndex = index;
  renderLightbox();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lightboxContent.innerHTML = '';
}

function renderLightbox() {
  const items = visibleItems();
  const item  = items[currentIndex];
  if (!item) return;
  lightboxContent.innerHTML = '';

  if (item.dataset.type === 'video') {
    const vid = item.querySelector('video').cloneNode(true);
    vid.removeAttribute('autoplay');
    vid.controls = true;
    vid.muted = false;
    vid.style.maxWidth  = '90vw';
    vid.style.maxHeight = '85vh';
    lightboxContent.appendChild(vid);
    vid.play();
  } else {
    const img = document.createElement('img');
    img.src = item.dataset.src;
    img.alt = 'KQ Cutz';
    lightboxContent.appendChild(img);
  }

  lightboxCounter.textContent = `${currentIndex + 1} / ${items.length}`;
  lbPrev.style.display = currentIndex === 0 ? 'none' : 'flex';
  lbNext.style.display = currentIndex === items.length - 1 ? 'none' : 'flex';
}

galleryItems.forEach((item) => {
  item.addEventListener('click', () => {
    const vis = visibleItems();
    const idx = vis.indexOf(item);
    if (idx !== -1) openLightbox(idx);
  });
});

lbClose.addEventListener('click', closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => { if (currentIndex > 0) { currentIndex--; renderLightbox(); } });
lbNext.addEventListener('click', () => { if (currentIndex < visibleItems().length - 1) { currentIndex++; renderLightbox(); } });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   { if (currentIndex > 0) { currentIndex--; renderLightbox(); } }
  if (e.key === 'ArrowRight')  { if (currentIndex < visibleItems().length - 1) { currentIndex++; renderLightbox(); } }
});

/* ============================================================
   VISUAL FEATURES
   ============================================================ */

// Parallax hero
const heroLogo    = document.querySelector('.hero-big-logo');
const heroContent = document.querySelector('.hero-content');
if (heroLogo && heroContent) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroLogo.style.transform    = `translateY(${y * 0.22}px)`;
      heroContent.style.transform = `translateY(${y * 0.12}px)`;
    }
  }, { passive: true });
}

// Spotlight cursor on dark sections
document.querySelectorAll('.section-dark').forEach(section => {
  section.addEventListener('mousemove', e => {
    const r = section.getBoundingClientRect();
    section.style.setProperty('--sx', (e.clientX - r.left) + 'px');
    section.style.setProperty('--sy', (e.clientY - r.top)  + 'px');
  });
});

// 3D tilt service cards — inject shine div & handle mousemove
document.querySelectorAll('.service-card').forEach(card => {
  const shine = document.createElement('div');
  shine.className = 'card-shine';
  card.appendChild(shine);

  card.addEventListener('mousemove', e => {
    const r    = card.getBoundingClientRect();
    const cx   = (e.clientX - r.left) / r.width;
    const cy   = (e.clientY - r.top)  / r.height;
    const rotX = (cy - 0.5) * -14;
    const rotY = (cx - 0.5) *  14;
    card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
    shine.style.setProperty('--mx', (cx * 100) + '%');
    shine.style.setProperty('--my', (cy * 100) + '%');
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
