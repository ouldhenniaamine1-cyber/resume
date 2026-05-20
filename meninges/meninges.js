// ============================================================
//  MÉNINGES & PLEXUS CHOROÏDES — script
// ============================================================

// ---------- 1. THEME ----------
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
});

// ---------- 2. SIDEBAR ----------
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
document.addEventListener('click', e => {
  if (window.innerWidth <= 1024 &&
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      e.target !== menuToggle) {
    sidebar.classList.remove('open');
  }
});

// ---------- 3. SMOOTH NAV ----------
document.querySelectorAll('.sidebar a').forEach(a => {
  a.addEventListener('click', e => {
    if (a.getAttribute('href').startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (window.innerWidth <= 1024) sidebar.classList.remove('open');
      }
    }
  });
});

const sections = document.querySelectorAll('[data-section]');
const navLinks = document.querySelectorAll('.sidebar a');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });
sections.forEach(s => observer.observe(s));

// ---------- 4. PROGRESS ----------
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const sh = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (window.scrollY / sh * 100) + '%';
});

// ---------- 5. BACK TO TOP ----------
const backTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => backTop.classList.toggle('visible', window.scrollY > 400));
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- 6. EYE / SVG INTERACTIVE ----------
const eyeInfoPanel = document.getElementById('eyeInfoPanel');
document.querySelectorAll('.meninges-svg [data-label]').forEach(el => {
  const showInfo = () => {
    eyeInfoPanel.innerHTML = `<h4>${el.getAttribute('data-label')}</h4><p>${el.getAttribute('data-info') || ''}</p>`;
  };
  el.addEventListener('mouseenter', showInfo);
  el.addEventListener('click', showInfo);
});

// ---------- 7. SEARCH ----------
const searchInput = document.getElementById('searchInput');
let searchTimeout;
searchInput.addEventListener('input', e => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => doSearch(e.target.value.trim().toLowerCase()), 200);
});

function doSearch(q) {
  document.querySelectorAll('.search-highlight').forEach(el => {
    const parent = el.parentNode;
    parent.replaceChild(document.createTextNode(el.textContent), el);
    parent.normalize();
  });
  document.querySelectorAll('[data-section]').forEach(sec => sec.classList.remove('section-hidden'));
  if (!q) return;
  document.querySelectorAll('[data-section]').forEach(sec => {
    if (!sec.textContent.toLowerCase().includes(q)) sec.classList.add('section-hidden');
    else highlightInNode(sec, q);
  });
}
function highlightInNode(node, q) {
  if (node.nodeType === 3) {
    const idx = node.nodeValue.toLowerCase().indexOf(q);
    if (idx >= 0) {
      const before = document.createTextNode(node.nodeValue.slice(0, idx));
      const match = document.createElement('span');
      match.className = 'search-highlight';
      match.textContent = node.nodeValue.slice(idx, idx + q.length);
      const after = document.createTextNode(node.nodeValue.slice(idx + q.length));
      const parent = node.parentNode;
      parent.insertBefore(before, node);
      parent.insertBefore(match, node);
      parent.insertBefore(after, node);
      parent.removeChild(node);
    }
  } else if (node.nodeType === 1 && !['SCRIPT','STYLE','SVG'].includes(node.tagName) && !node.closest('svg')) {
    Array.from(node.childNodes).forEach(c => highlightInNode(c, q));
  }
}

document.getElementById('printBtn').addEventListener('click', () => window.print());

// ============================================================
//  FLASHCARDS
// ============================================================
const flashcards = [
  { cat: 'general', q: "Origine embryologique des méninges ?", a: "Crêtes neurales + composante mésenchymateuse." },
  { cat: 'general', q: "Quelles sont les 3 méninges (extérieur → intérieur) ?", a: "Dure-mère (pachyméninge) → Arachnoïde → Pie-mère (leptoméninges)." },
  { cat: 'general', q: "Quelle méninge correspond à la pachyméninge ?", a: "La dure-mère (méninge dense)." },
  { cat: 'general', q: "Quelles méninges forment les leptoméninges ?", a: "Arachnoïde + Pie-mère (méninges molles)." },
  { cat: 'general', q: "Que contient l'espace conjonctif délimité par les méninges ?", a: "Le LCR (liquide céphalo-rachidien), qui communique avec les ventricules cérébraux." },

  { cat: 'dure', q: "Origine embryologique de la dure-mère ?", a: "Le mésoblaste." },
  { cat: 'dure', q: "Quelles sont les 2 couches de la dure-mère ?", a: "Externe (périostée) + Interne (méningée)." },
  { cat: 'dure', q: "Caractéristiques de la couche périostée ?", a: "Adhère à la face interne des os, richement vascularisée et innervée." },
  { cat: 'dure', q: "Caractéristiques de la couche méningée ?", a: "Cellules mésothéliales, fournit les expansions qui compartimentent la boîte crânienne." },
  { cat: 'dure', q: "Comment se forment les sinus veineux ?", a: "Par dissociation des couches méningée et périostée de la dure-mère." },
  { cat: 'dure', q: "Qu'est-ce que l'espace péridural ?", a: "Espace entre la dure-mère et le canal rachidien — TC lâche riche en adipocytes." },
  { cat: 'dure', q: "Composition de la dure-mère ?", a: "Volumineux trousseaux de fibres de collagène + quelques fibroblastes." },

  { cat: 'lepto', q: "Origine embryologique des leptoméninges ?", a: "Ectoblastique." },
  { cat: 'lepto', q: "L'arachnoïde est-elle vascularisée ?", a: "Non — elle est avasculaire." },
  { cat: 'lepto', q: "Composition de l'arachnoïde ?", a: "Système de trabécules (fines fibres de collagène + quelques fibres élastiques)." },
  { cat: 'lepto', q: "Rôle de l'arachnoïde ?", a: "Synthèse et résorption du LCR." },
  { cat: 'lepto', q: "Que sont les trabécules arachnoïdiennes ?", a: "Petites travées conjonctives reliant l'arachnoïde à la pie-mère." },
  { cat: 'lepto', q: "Que sont les villosités arachnoïdiennes ?", a: "Structures fournies par l'arachnoïde, permettant la résorption du LCR vers les sinus veineux." },
  { cat: 'lepto', q: "Caractéristiques structurelles de la pie-mère ?", a: "Couche uni-cellulaire adhérant au SNC, faite de fibres conjonctives + élastiques." },
  { cat: 'lepto', q: "Pourquoi la pie-mère a un rôle nourricier ?", a: "Elle est très vascularisée." },
  { cat: 'lepto', q: "Qu'est-ce que la barrière cerveau-LCR ?", a: "Barrière formée par les pieds des astrocytes, séparant la pie-mère du parenchyme nerveux." },

  { cat: 'plexus', q: "Où se trouvent les plexus choroïdes ?", a: "Appendus au toit des ventricules cérébraux." },
  { cat: 'plexus', q: "Rôle principal des plexus choroïdes ?", a: "Sécrétion du LCR." },
  { cat: 'plexus', q: "Quelle barrière constituent les plexus choroïdes ?", a: "La barrière sang-LCR (hémato-liquidienne)." },
  { cat: 'plexus', q: "Les 2 composants des plexus choroïdes ?", a: "Épithélium épendymaire modifié + Stroma." },
  { cat: 'plexus', q: "Type de cellules de l'épithélium des plexus ?", a: "Cellules cubiques avec microvillosités apicales et invaginations basales riches en mitochondries." },
  { cat: 'plexus', q: "Quel type de jonctions unit les cellules épithéliales des plexus ?", a: "Jonctions serrées (≠ adhaerens dans l'épithélium épendymaire normal)." },
  { cat: 'plexus', q: "Composition du stroma des plexus ?", a: "Cellules leptoméningées dispersées entre de très nombreux capillaires sanguins." },
  { cat: 'plexus', q: "Pourquoi les invaginations basales sont riches en mitochondries ?", a: "Pour soutenir énergétiquement la sécrétion active du LCR." }
];

let currentDeck = [...flashcards];
let currentIndex = 0;

const flashcardEl = document.getElementById('flashcard');
const flashQ = flashcardEl.querySelector('.flash-question');
const flashA = flashcardEl.querySelector('.flash-answer');
const flashCat = flashcardEl.querySelector('.flash-cat');
const flashCurrent = document.getElementById('flashCurrent');
const flashTotal = document.getElementById('flashTotal');

function renderCard() {
  if (currentDeck.length === 0) {
    flashQ.textContent = 'Aucune carte';
    flashA.textContent = '—';
    flashCat.textContent = '';
    flashCurrent.textContent = '0';
    flashTotal.textContent = '0';
    return;
  }
  const card = currentDeck[currentIndex];
  flashQ.textContent = card.q;
  flashA.textContent = card.a;
  flashCat.textContent = card.cat;
  flashCurrent.textContent = currentIndex + 1;
  flashTotal.textContent = currentDeck.length;
  flashcardEl.classList.remove('flipped');
}

flashcardEl.addEventListener('click', () => flashcardEl.classList.toggle('flipped'));
document.getElementById('nextCard').addEventListener('click', () => {
  if (!currentDeck.length) return;
  currentIndex = (currentIndex + 1) % currentDeck.length;
  renderCard();
});
document.getElementById('prevCard').addEventListener('click', () => {
  if (!currentDeck.length) return;
  currentIndex = (currentIndex - 1 + currentDeck.length) % currentDeck.length;
  renderCard();
});
document.getElementById('flashCategory').addEventListener('change', e => {
  const v = e.target.value;
  currentDeck = v === 'all' ? [...flashcards] : flashcards.filter(c => c.cat === v);
  currentIndex = 0;
  renderCard();
});
document.getElementById('shuffleBtn').addEventListener('click', () => {
  for (let i = currentDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [currentDeck[i], currentDeck[j]] = [currentDeck[j], currentDeck[i]];
  }
  currentIndex = 0;
  renderCard();
});
renderCard();

document.addEventListener('keydown', e => {
  if (document.activeElement === searchInput) return;
  const r = flashcardEl.getBoundingClientRect();
  if (r.top > window.innerHeight || r.bottom < 0) return;
  if (e.key === 'ArrowRight') document.getElementById('nextCard').click();
  if (e.key === 'ArrowLeft') document.getElementById('prevCard').click();
  if (e.key === ' ') { e.preventDefault(); flashcardEl.classList.toggle('flipped'); }
});

// ============================================================
//  QUIZ
// ============================================================
const quizQuestions = [
  {
    q: "Quelle est l'origine embryologique des méninges ?",
    options: ["Endoblaste seul", "Crêtes neurales + mésenchyme", "Neuroectoblaste seul", "Ectoblaste superficiel"],
    correct: 1,
    explanation: "Les méninges proviennent des crêtes neurales et d'une composante mésenchymateuse."
  },
  {
    q: "Laquelle correspond à la pachyméninge ?",
    options: ["Pie-mère", "Arachnoïde", "Dure-mère", "Membrane de Bruch"],
    correct: 2,
    explanation: "La dure-mère = pachyméninge (méninge dense). L'arachnoïde et la pie-mère = leptoméninges."
  },
  {
    q: "L'origine embryologique de la dure-mère est :",
    options: ["Mésoblaste", "Ectoblaste", "Crêtes neurales", "Endoblaste"],
    correct: 0,
    explanation: "La dure-mère provient du mésoblaste (≠ leptoméninges qui sont d'origine ectoblastique)."
  },
  {
    q: "Comment se forment les sinus veineux ?",
    options: [
      "Par invagination de la pie-mère",
      "Par dissociation des couches méningée et périostée de la dure-mère",
      "Au sein des plexus choroïdes",
      "À partir des villosités arachnoïdiennes"
    ],
    correct: 1,
    explanation: "Les sinus veineux résultent de la dissociation des deux couches de la dure-mère."
  },
  {
    q: "L'arachnoïde est :",
    options: ["Très vascularisée", "Avasculaire", "Riche en adipocytes", "Constituée d'un épithélium pavimenteux"],
    correct: 1,
    explanation: "L'arachnoïde est avasculaire — c'est un système de trabécules."
  },
  {
    q: "Rôle des villosités arachnoïdiennes ?",
    options: [
      "Sécréter le LCR",
      "Résorber le LCR vers les sinus veineux",
      "Vascularisation du cerveau",
      "Production de mélanine"
    ],
    correct: 1,
    explanation: "Les villosités arachnoïdiennes permettent la résorption du LCR vers les sinus veineux."
  },
  {
    q: "Qu'est-ce qui constitue la barrière cerveau-LCR ?",
    options: [
      "Les jonctions serrées des plexus choroïdes",
      "Les pieds des astrocytes sous la pie-mère",
      "L'arachnoïde",
      "La membrane de Bruch"
    ],
    correct: 1,
    explanation: "La barrière cerveau-LCR est faite des pieds des astrocytes qui séparent la pie-mère du parenchyme."
  },
  {
    q: "Où sont situés les plexus choroïdes ?",
    options: [
      "Dans l'espace péridural",
      "Au toit des ventricules cérébraux",
      "Sur la face externe de la dure-mère",
      "Dans les sinus veineux"
    ],
    correct: 1,
    explanation: "Les plexus choroïdes sont des structures villositaires appendues au toit des ventricules."
  },
  {
    q: "Quel type de jonction unit les cellules épithéliales des plexus choroïdes ?",
    options: ["Adhaerens", "Desmosomes seulement", "Jonctions serrées", "Jonctions gap uniquement"],
    correct: 2,
    explanation: "Les cellules sont unies par des jonctions serrées — base de la barrière sang-LCR (≠ adhaerens dans l'épithélium épendymaire normal)."
  },
  {
    q: "Le stroma des plexus choroïdes est composé de :",
    options: [
      "Cellules nerveuses + axones",
      "Cellules leptoméningées + capillaires sanguins",
      "Adipocytes + collagène dense",
      "Cellules mésothéliales pures"
    ],
    correct: 1,
    explanation: "Le stroma contient des cellules leptoméningées dispersées entre de nombreux capillaires sanguins."
  }
];

const quizContainer = document.getElementById('quizContainer');
const userAnswers = {};

function renderQuiz() {
  quizContainer.innerHTML = '';
  Object.keys(userAnswers).forEach(k => delete userAnswers[k]);
  quizQuestions.forEach((q, qi) => {
    const div = document.createElement('div');
    div.className = 'quiz-question';
    div.dataset.qi = qi;
    div.innerHTML = `
      <h4>Q${qi + 1}. ${q.q}</h4>
      <div class="quiz-options">
        ${q.options.map((opt, oi) => `
          <label class="quiz-option" data-oi="${oi}">
            <input type="radio" name="q${qi}" value="${oi}">
            <span>${String.fromCharCode(65 + oi)}. ${opt}</span>
          </label>
        `).join('')}
      </div>
      <div class="quiz-feedback"></div>
    `;
    quizContainer.appendChild(div);
    div.querySelectorAll('.quiz-option').forEach(opt => {
      opt.addEventListener('click', () => {
        div.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        userAnswers[qi] = parseInt(opt.dataset.oi);
      });
    });
  });
}

function gradeQuiz() {
  let score = 0;
  quizQuestions.forEach((q, qi) => {
    const div = quizContainer.querySelector(`[data-qi="${qi}"]`);
    const fb = div.querySelector('.quiz-feedback');
    const userA = userAnswers[qi];
    div.querySelectorAll('.quiz-option').forEach((opt, oi) => {
      opt.classList.remove('correct-answer','wrong-answer');
      if (oi === q.correct) opt.classList.add('correct-answer');
      if (userA === oi && oi !== q.correct) opt.classList.add('wrong-answer');
    });
    if (userA === q.correct) { score++; div.classList.remove('incorrect'); div.classList.add('correct'); }
    else { div.classList.remove('correct'); div.classList.add('incorrect'); }
    fb.classList.add('show');
    fb.innerHTML = `<strong>${userA === q.correct ? '✅ Correct' : '❌ Incorrect'}</strong> — ${q.explanation}`;
  });

  const result = document.getElementById('quizResult');
  result.classList.remove('hidden');
  const pct = Math.round((score / quizQuestions.length) * 100);
  let comment = '';
  if (pct === 100) comment = '🏆 Parfait !';
  else if (pct >= 80) comment = '🎉 Excellent !';
  else if (pct >= 60) comment = '👍 Bien — quelques révisions et c\'est dans la poche.';
  else if (pct >= 40) comment = '📚 À retravailler.';
  else comment = '💪 Courage — relis les sections puis recommence.';
  result.innerHTML = `<h3>${comment}</h3><div class="quiz-score">${score} / ${quizQuestions.length}</div><p>Score : <strong>${pct}%</strong></p>`;
  result.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

document.getElementById('submitQuiz').addEventListener('click', () => {
  if (Object.keys(userAnswers).length < quizQuestions.length) {
    if (!confirm(`Tu n'as répondu qu'à ${Object.keys(userAnswers).length}/${quizQuestions.length}. Soumettre ?`)) return;
  }
  gradeQuiz();
});
document.getElementById('resetQuiz').addEventListener('click', () => {
  document.getElementById('quizResult').classList.add('hidden');
  renderQuiz();
});
renderQuiz();
