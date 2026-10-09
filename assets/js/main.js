/* ============================================================
   CONFIG - paste your free Web3Forms access key here
   Get one at https://web3forms.com (enter boy082913@gmail.com)
   ============================================================ */
const WEB3FORMS_ACCESS_KEY = '380227c6-ba7b-40a0-af08-3b1f32f9fd9e';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Icons ---------- */
const renderIcons = () => window.lucide && window.lucide.createIcons();
renderIcons();

/* ---------- Misc ---------- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const accessKeyEl = document.getElementById('access_key');
if (accessKeyEl) accessKeyEl.value = WEB3FORMS_ACCESS_KEY;

/* ---------- Navbar ---------- */
const nav = document.getElementById('nav');
const progress = document.getElementById('scroll-progress');
const onScroll = () => {
  const y = window.scrollY;
  if (nav) nav.classList.toggle('glass', y > 30);
  const h = document.documentElement.scrollHeight - innerHeight;
  if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('hidden') === false;
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    menuBtn.setAttribute('aria-expanded', 'false');
  }));
}

/* ---------- GSAP animations ---------- */
if (window.gsap && !reduceMotion) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from('.hero-in', { y: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.2 });
  if (document.getElementById('hero-canvas')) {
    gsap.from('#hero-canvas', { opacity: 0, duration: 1.6 });
  }

  gsap.utils.toArray('.reveal').forEach((el, i) => {
    gsap.from(el, {
      y: 50, opacity: 0, duration: 0.8, ease: 'power3.out', delay: (i % 3) * 0.08,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  document.querySelectorAll('.counter').forEach(el => {
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(obj, { v: +el.dataset.to, duration: 2, ease: 'power2.out', onUpdate: () => { el.textContent = Math.round(obj.v); } })
    });
  });

  // Hero floating cards parallax on mouse
  const cards = document.querySelectorAll('[data-depth]');
  addEventListener('mousemove', e => {
    const x = (e.clientX / innerWidth - 0.5), y = (e.clientY / innerHeight - 0.5);
    cards.forEach(c => {
      const d = +c.dataset.depth;
      gsap.to(c, { x: -x * d, y: -y * d, duration: 0.8, ease: 'power2.out', overwrite: 'auto' });
    });
  });
} else {
  document.querySelectorAll('.counter').forEach(el => (el.textContent = el.dataset.to));
}

/* ---------- 3D tilt cards ---------- */
if (window.VanillaTilt && !reduceMotion && matchMedia('(hover: hover)').matches) {
  const tiltEls = document.querySelectorAll('[data-tilt]');
  if (tiltEls.length) {
    VanillaTilt.init(tiltEls, { max: 14, speed: 500, glare: true, 'max-glare': 0.18, scale: 1.02 });
  }
}

/* ---------- Active nav link ---------- */
const sections = ['home', 'about', 'services', 'process', 'pricing', 'work', 'faq', 'contact'];
const links = document.querySelectorAll('header nav a.nav-link');
if (links.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(id => { const s = document.getElementById(id); if (s) io.observe(s); });
}

/* ---------- Pricing toggle ---------- */
const bm = document.getElementById('bill-monthly');
const ba = document.getElementById('bill-annual');
if (bm && ba) {
  const on = 'bg-gradient-to-r from-brand-blue to-brand-sky text-white'.split(' ');
  const setBilling = annual => {
    document.querySelectorAll('.price').forEach(p => { p.textContent = annual ? p.dataset.annual : p.dataset.monthly; });
    document.querySelectorAll('.cycle').forEach(c => { c.textContent = annual ? 'mo, billed yearly' : 'mo'; });
    [bm, ba].forEach(b => { b.classList.remove(...on); b.classList.add('text-slate-600'); });
    const active = annual ? ba : bm;
    active.classList.remove('text-slate-600'); active.classList.add(...on);
  };
  bm.addEventListener('click', () => setBilling(false));
  ba.addEventListener('click', () => setBilling(true));
}

// Pre-select plan in the contact form
document.querySelectorAll('.plan-btn').forEach(b => b.addEventListener('click', () => {
  const srv = document.getElementById('service');
  if (srv) srv.value = b.dataset.plan;
}));

/* ---------- Web3Forms submission ---------- */
const form = document.getElementById('contact-form');
const btn = document.getElementById('submit-btn');
const label = document.getElementById('submit-label');

// Form Modal Setup
const formModal = document.getElementById('form-modal');
const formModalContent = document.getElementById('form-modal-content');
const formModalIcon = document.getElementById('form-modal-icon');
const formModalTitle = document.getElementById('form-modal-title');
const formModalText = document.getElementById('form-modal-text');
const closeFormModalBtns = [document.getElementById('close-form-modal'), document.getElementById('form-modal-btn')];

function showModal(isSuccess) {
  if (!formModal) return;
  
  if (isSuccess) {
    if (formModalIcon) {
      formModalIcon.className = 'inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-emerald-100 text-emerald-500';
      formModalIcon.innerHTML = '<i data-lucide="check-circle" class="h-8 w-8"></i>';
    }
    if (formModalTitle) {
      formModalTitle.textContent = 'Success!';
      formModalTitle.className = 'text-2xl font-extrabold text-emerald-600 mb-2';
    }
    if (formModalText) {
      formModalText.textContent = 'Thank you! Your message has been sent successfully. We will get back to you shortly.';
    }
  } else {
    if (formModalIcon) {
      formModalIcon.className = 'inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-red-100 text-red-500';
      formModalIcon.innerHTML = '<i data-lucide="x-circle" class="h-8 w-8"></i>';
    }
    if (formModalTitle) {
      formModalTitle.textContent = 'Error';
      formModalTitle.className = 'text-2xl font-extrabold text-red-600 mb-2';
    }
    if (formModalText) {
      formModalText.textContent = 'Sorry, something went wrong. Please try again later or contact us directly.';
    }
  }
  
  if (window.lucide) lucide.createIcons();
  
  formModal.classList.remove('hidden');
  formModal.classList.add('flex');
  setTimeout(() => {
    if (formModalContent) {
      formModalContent.classList.remove('scale-95', 'opacity-0');
      formModalContent.classList.add('scale-100', 'opacity-100');
    }
  }, 10);
}

function hideModal() {
  if (!formModal) return;
  if (formModalContent) {
    formModalContent.classList.remove('scale-100', 'opacity-100');
    formModalContent.classList.add('scale-95', 'opacity-0');
  }
  setTimeout(() => {
    formModal.classList.add('hidden');
    formModal.classList.remove('flex');
  }, 200);
}

closeFormModalBtns.forEach(b => { if(b) b.addEventListener('click', hideModal) });

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (!form.checkValidity()) { form.reportValidity(); return; }

    if (btn) { btn.disabled = true; btn.classList.add('opacity-70'); }
    if (label) label.textContent = 'Sending...';
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showModal(true);
        form.reset();
        const ak = document.getElementById('access_key');
        if (ak) ak.value = WEB3FORMS_ACCESS_KEY;
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      showModal(false);
    } finally {
      if (btn) { btn.disabled = false; btn.classList.remove('opacity-70'); }
      if (label) label.textContent = 'Send Message';
    }
  });
}

/* ============================================================
   3D HERO SCENE (Three.js)
   ============================================================ */
(function heroScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); }
  catch { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const blue = 0x42a5f5, cyan = 0x29b6f6, purple = 0x9c27b0, deep = 0x1976d2;
  const group = new THREE.Group();
  scene.add(group);

  const icosaGeometry = new THREE.IcosahedronGeometry(2.5, 2);
  const icosaMaterial = new THREE.MeshBasicMaterial({ color: deep, wireframe: true, transparent: true, opacity: 0.1 });
  const icosa = new THREE.Mesh(icosaGeometry, icosaMaterial);
  group.add(icosa);

  const dotGeo = new THREE.BufferGeometry();
  const dots = 300, pos = new Float32Array(dots * 3);
  for (let i = 0; i < dots * 3; i++) pos[i] = (Math.random() - 0.5) * 14;
  dotGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const dotMat = new THREE.PointsMaterial({ color: cyan, size: 0.05, transparent: true, opacity: 0.6 });
  const particles = new THREE.Points(dotGeo, dotMat);
  group.add(particles);

  const makeRing = (r, c, ry) => {
    const geo = new THREE.TorusGeometry(r, 0.015, 4, 64);
    const mat = new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.4 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = Math.PI / 2; mesh.rotation.y = ry;
    return mesh;
  };
  group.add(makeRing(3.8, blue, 0.5), makeRing(4.5, cyan, -0.4), makeRing(5.2, purple, 0.8));

  const pointLight = new THREE.PointLight(cyan, 2, 20);
  scene.add(pointLight);

  addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  gsap.to(group.rotation, { y: Math.PI * 2, x: Math.PI * 0.2, duration: 40, repeat: -1, ease: 'none' });

  let mx = 0, my = 0;
  addEventListener('mousemove', e => { mx = (e.clientX / innerWidth - 0.5) * 2; my = (e.clientY / innerHeight - 0.5) * 2; });

  const animate = () => {
    requestAnimationFrame(animate);
    group.rotation.y += 0.001;
    group.rotation.x += 0.0005;
    camera.position.x += (mx * 1.5 - camera.position.x) * 0.05;
    camera.position.y += (-my * 1.5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  };
  animate();
})();