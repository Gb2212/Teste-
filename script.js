// ===== Tema claro/escuro (lembra a escolha) =====
const root = document.documentElement;
try { root.dataset.theme = localStorage.getItem('tema') || 'dark'; } catch (e) { root.dataset.theme = 'dark'; }

// ===== Botões criados pelo JS: tema e menu mobile =====
const nav = document.querySelector('.nav');
const actions = document.createElement('div');
actions.className = 'header-actions';
actions.innerHTML = `
  <button class="icon-btn" id="temaBtn" aria-label="Alternar tema"></button>
  <button class="icon-btn menu-btn" id="menuBtn" aria-label="Abrir menu">☰</button>`;
nav.before(actions);

const temaBtn = document.getElementById('temaBtn');
const atualizaIcone = () => { temaBtn.textContent = root.dataset.theme === 'dark' ? '☀️' : '🌙'; };
atualizaIcone();
temaBtn.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('tema', root.dataset.theme); } catch (e) {}
  atualizaIcone();
});
document.getElementById('menuBtn').addEventListener('click', () => nav.classList.toggle('open'));

// ===== Barra de progresso + botão "voltar ao topo" =====
const barra = document.createElement('div');
barra.className = 'progress';
const topo = document.createElement('button');
topo.className = 'icon-btn to-top';
topo.textContent = '↑';
topo.setAttribute('aria-label', 'Voltar ao topo');
document.body.append(barra, topo);

window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  barra.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
  topo.classList.toggle('show', scrollY > 400);
});
topo.addEventListener('click', () => scrollTo({ top: 0 }));

// ===== Seções aparecem ao rolar =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== Efeito de digitação (página inicial) =====
const alvo = document.getElementById('typing');
if (alvo) {
  const frases = ['estudante de Informática.', 'curioso por programação.', 'futuro Engenheiro de Software.', 'apaixonado por tecnologia.'];
  let f = 0, c = 0, apagando = false;
  (function digitar() {
    const frase = frases[f];
    alvo.textContent = frase.slice(0, c);
    if (!apagando && c === frase.length) { apagando = true; return setTimeout(digitar, 1500); }
    if (apagando && c === 0) { apagando = false; f = (f + 1) % frases.length; }
    c += apagando ? -1 : 1;
    setTimeout(digitar, apagando ? 40 : 80);
  })();
}

// ===== Cards inclinam seguindo o mouse =====
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(600px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// ===== Copiar e-mail (página de contato) =====
const copiar = document.getElementById('copyEmail');
if (copiar) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = 'E-mail copiado!';
  document.body.append(toast);
  copiar.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('gustavobarretoreb@gmail.com'); } catch (e) {}
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  });
}

// ===== Brilho azul que segue o mouse =====
const brilho = document.createElement('div');
brilho.className = 'glow';
document.body.append(brilho);
addEventListener('mousemove', e => { brilho.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`; });

// ===== Números que contam até o valor final =====
document.querySelectorAll('[data-count]').forEach(el => {
  const contar = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    const fim = +el.dataset.count; let n = 0;
    const t = setInterval(() => { el.textContent = ++n; if (n >= fim) clearInterval(t); }, 250);
    contar.disconnect();
  });
  contar.observe(el);
});

// ===== Rede de pontos animada no destaque =====
const hero = document.querySelector('.hero-section');
if (hero) {
  const cv = document.createElement('canvas');
  cv.className = 'hero-canvas';
  hero.prepend(cv);
  const ctx = cv.getContext('2d');
  let pts = [], mouse = { x: -999, y: -999 };
  const ajusta = () => {
    cv.width = hero.clientWidth; cv.height = hero.clientHeight;
    pts = Array.from({ length: 45 }, () => ({ x: Math.random() * cv.width, y: Math.random() * cv.height, vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5 }));
  };
  ajusta(); addEventListener('resize', ajusta);
  hero.addEventListener('mousemove', e => { const r = hero.getBoundingClientRect(); mouse = { x: e.clientX - r.left, y: e.clientY - r.top }; });
  hero.addEventListener('mouseleave', () => { mouse = { x: -999, y: -999 }; });
  (function anima() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    const cor = getComputedStyle(root).getPropertyValue('--accent').trim();
    ctx.fillStyle = ctx.strokeStyle = cor;
    pts.forEach((p, i) => {
      p.x = (p.x + p.vx + cv.width) % cv.width; p.y = (p.y + p.vy + cv.height) % cv.height;
      ctx.globalAlpha = .7; ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, 7); ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const d = Math.hypot(p.x - pts[j].x, p.y - pts[j].y);
        if (d < 110) { ctx.globalAlpha = (1 - d / 110) * .35; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
      }
      const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (dm < 150) { ctx.globalAlpha = (1 - dm / 150) * .6; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
    });
    requestAnimationFrame(anima);
  })();
}

// ===== Formulário de contato (abre o e-mail com a mensagem pronta) =====
const form = document.getElementById('formContato');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const msg = document.getElementById('msg').value;
    location.href = `mailto:gustavobarretoreb@gmail.com?subject=${encodeURIComponent('Contato pelo portfólio - ' + nome)}&body=${encodeURIComponent(msg)}`;
  });
}
