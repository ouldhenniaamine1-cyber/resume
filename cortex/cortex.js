// ============================================================
//  CORTEX CÉRÉBRAL — script
// ============================================================

// THEME
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

// SIDEBAR
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

// NAV
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

// PROGRESS
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const sh = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (window.scrollY / sh * 100) + '%';
});

// BACK TOP
const backTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => backTop.classList.toggle('visible', window.scrollY > 400));
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// SEARCH
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
  { cat: 'general', q: "Autre nom du cortex cérébral ?", a: "Pallium." },
  { cat: 'general', q: "De quoi est essentiellement formé le cortex cérébral ?", a: "De cellules nerveuses et névrogliques." },
  { cat: 'general', q: "Différence entre archéo-pallium et néo-pallium ?", a: "Archéo-pallium = allocortex, le plus ancien (lobe olfactif, limbique, insula). Néo-pallium = isocortex, 90% du cortex, à 6 couches." },
  { cat: 'general', q: "Quelle proportion représente le néo-pallium ?", a: "90% du cortex cérébral." },
  { cat: 'general', q: "Structure histologique de l'archéo-pallium ?", a: "Simple : 2 couches — couche superficielle de cellules étoilées (réceptrices) + couche profonde de cellules pyramidales (effectrices)." },
  { cat: 'general', q: "Quelles régions appartiennent à l'archéo-pallium ?", a: "Région ventrale (lobe olfactif) + région dorsale (cortex limbique + insula)." },

  { cat: 'cellules', q: "Les 2 familles cellulaires prédominantes du cortex ?", a: "Cellules pyramidales + cellules à grains (granuleuses ou étoilées)." },
  { cat: 'cellules', q: "Forme du corps cellulaire d'une cellule pyramidale ?", a: "Triangulaire en coupe." },
  { cat: 'cellules', q: "D'où émerge l'axone d'une cellule pyramidale ?", a: "De la base du corps cellulaire — il est toujours descendant et perpendiculaire à la matière grise." },
  { cat: 'cellules', q: "Avec quoi s'articule l'axone d'une cellule pyramidale ?", a: "Neurones d'autres régions du cortex, noyaux gris centraux ou moelle épinière." },
  { cat: 'cellules', q: "Que sont les collatérales récurrentes ?", a: "Branches de l'axone d'une cellule pyramidale qui s'articulent avec les dendrites de la même cellule ou d'autres pyramidales." },
  { cat: 'cellules', q: "Quel autre nom donne-t-on aux cellules pyramidales géantes ?", a: "Cellules de Betz." },
  { cat: 'cellules', q: "Où siègent les cellules de Betz ?", a: "Dans la partie profonde du cortex (couche V)." },
  { cat: 'cellules', q: "Caractéristiques de l'axone des cellules granuleuses ?", a: "L'axone NE QUITTE PAS le cortex." },
  { cat: 'cellules', q: "Particularité des cellules à double touffe ?", a: "Péricaryon allongé avec 2 prolongements dendritiques opposés. Axone vers couches superficielles." },
  { cat: 'cellules', q: "Avec quoi s'articulent les cellules araignées ?", a: "Avec de nombreuses cellules étoilées (via leur axone fin)." },
  { cat: 'cellules', q: "Caractéristiques de la cellule de Martinotti ?", a: "Corps pyramidal en couches profondes, dendrites courtes, axone ASCENDANT vers couches superficielles." },
  { cat: 'cellules', q: "Particularité des cellules à corbeille ?", a: "Axone horizontal qui se termine en corbeille (panier) autour des cellules pyramidales." },
  { cat: 'cellules', q: "Où sont situées les cellules horizontales ?", a: "Dans la zone la plus superficielle du cortex (couche I). Prolongements parallèles à la surface." },
  { cat: 'cellules', q: "Caractéristiques des cellules fusiformes ?", a: "Corps étiré dans la couche profonde, dendrite long ascendant, axone vers la substance blanche." },

  { cat: 'couches', q: "Combien de couches a l'isocortex ?", a: "6 couches." },
  { cat: 'couches', q: "Énumère les 6 couches de l'isocortex (surface → profondeur) ?", a: "I. Moléculaire — II. Granuleuse externe — III. Cellules pyramidales — IV. Granuleuse interne — V. Grandes cellules pyramidales — VI. Polymorphe." },
  { cat: 'couches', q: "Autre nom de la couche moléculaire (I) ?", a: "Couche plexiforme." },
  { cat: 'couches', q: "Que contient la couche I (moléculaire) ?", a: "Cellules horizontales (peu nombreuses), expansions dendritiques/axoniques horizontales, fibres afférentes non spécifiques du thalamus = plexus d'Exner." },
  { cat: 'couches', q: "Que contient la couche II (granuleuse externe) ?", a: "Cellules pyramidales de petite taille (axones vers couches profondes), cellules granuleuses, cellules à corbeille." },
  { cat: 'couches', q: "Que contient la couche III ?", a: "Essentiellement des cellules pyramidales plus volumineuses qu'en II. Strie de Kaes-Bechterew (axones afférents cortico-corticaux)." },
  { cat: 'couches', q: "Strie située dans la couche III ?", a: "Strie de Kaes-Bechterew (axones afférents cortico-corticaux)." },
  { cat: 'couches', q: "Que contient la couche IV (granuleuse interne) ?", a: "Surtout des cellules granuleuses étoilées + à corbeille + à double touffe + quelques pyramidales. Strie de Baillarger externe (fibres afférentes du thalamus)." },
  { cat: 'couches', q: "Strie située dans la couche IV ?", a: "Strie de Baillarger externe — fibres afférentes du thalamus." },
  { cat: 'couches', q: "Que contient la couche V ?", a: "Cellules pyramidales moyennes ou géantes (Betz) dont les axones quittent le cortex. Strie de Baillarger interne (fibres d'association homolatérales)." },
  { cat: 'couches', q: "Strie située dans la couche V ?", a: "Strie de Baillarger interne — fibres d'association homolatérales." },
  { cat: 'couches', q: "Que contient la couche VI (polymorphe) ?", a: "Cellules granuleuses + fusiformes + cellules de Martinotti." },
  { cat: 'couches', q: "Autre nom de la couche VI ?", a: "Couche polymorphe ou couche des cellules fusiformes." },

  { cat: 'aires', q: "Les 2 grands types de cortex selon l'organisation des aires ?", a: "Cortex associatif (homotypique) + cortex hétérotypique." },
  { cat: 'aires', q: "Caractéristique du cortex effecteur ?", a: "'Agranulaire' — couches III et V particulièrement importantes (couches granuleuses réduites)." },
  { cat: 'aires', q: "Caractéristique du cortex récepteur ?", a: "Développement important des couches réceptrices à cellules granuleuses (II et IV). Observé dans les aires de réception sensorielle." },
  { cat: 'aires', q: "Qu'est-ce qu'une colonne corticale ?", a: "Organisation verticale des cellules du cortex sur toute son épaisseur — forme une unité fonctionnelle avec ses propres fibres afférentes/efférentes." },
  { cat: 'aires', q: "Qu'est-ce qu'une hypercolonne ?", a: "Ensemble de colonnes adjacentes ayant un fonctionnement synchronisé (circuits transversaux) et concourant à la même fonction." }
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
  if (!currentDeck.length) {
    flashQ.textContent = 'Aucune carte';
    flashA.textContent = '—';
    flashCat.textContent = '';
    flashCurrent.textContent = '0';
    flashTotal.textContent = '0';
    return;
  }
  const c = currentDeck[currentIndex];
  flashQ.textContent = c.q;
  flashA.textContent = c.a;
  flashCat.textContent = c.cat;
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
    q: "Quel pourcentage du cortex cérébral représente le néo-pallium ?",
    options: ["50%", "70%", "90%", "100%"],
    correct: 2,
    explanation: "Le néo-pallium (isocortex) représente 90% du cortex cérébral."
  },
  {
    q: "L'archéo-pallium comprend :",
    options: [
      "Les aires motrices uniquement",
      "Le lobe olfactif + cortex limbique + insula",
      "Toutes les aires sensorielles",
      "Le cervelet"
    ],
    correct: 1,
    explanation: "L'archéo-pallium comprend une région ventrale (lobe olfactif) et une région dorsale (cortex limbique + insula)."
  },
  {
    q: "Combien de couches contient l'isocortex ?",
    options: ["3", "5", "6", "10"],
    correct: 2,
    explanation: "L'isocortex est fait de 6 couches successives."
  },
  {
    q: "Les 2 familles cellulaires prédominantes du cortex sont :",
    options: [
      "Astrocytes + oligodendrocytes",
      "Cellules pyramidales + cellules granuleuses",
      "Cellules de Schwann + neurones",
      "Cellules de Martinotti + à corbeille"
    ],
    correct: 1,
    explanation: "Les cellules pyramidales et les cellules à grains (granuleuses/étoilées) sont les 2 familles prédominantes."
  },
  {
    q: "Les cellules de Betz sont :",
    options: [
      "Des cellules pyramidales géantes situées dans la partie profonde",
      "Des cellules étoilées de la couche I",
      "Des cellules de soutien",
      "Des cellules à corbeille"
    ],
    correct: 0,
    explanation: "Cellules de Betz = pyramidales géantes, situées dans la partie profonde du cortex (couche V)."
  },
  {
    q: "L'axone d'une cellule pyramidale est :",
    options: [
      "Toujours ascendant",
      "Reste dans le cortex",
      "Toujours descendant et perpendiculaire à la matière grise",
      "Horizontal"
    ],
    correct: 2,
    explanation: "L'axone des cellules pyramidales est toujours descendant et perpendiculaire à l'épaisseur de la matière grise."
  },
  {
    q: "Particularité des cellules granuleuses (étoilées) ?",
    options: [
      "Leur axone quitte toujours le cortex",
      "Leur axone ne quitte pas le cortex",
      "Elles n'ont pas d'axone",
      "Leur axone est myélinisé"
    ],
    correct: 1,
    explanation: "L'axone des cellules granuleuses ne quitte pas le cortex — il se dirige vers les régions superficielles ou profondes."
  },
  {
    q: "Quelle est la couche I de l'isocortex ?",
    options: ["Granuleuse externe", "Moléculaire (plexiforme)", "Polymorphe", "Pyramidale"],
    correct: 1,
    explanation: "La couche I est la couche moléculaire (ou plexiforme), à la surface."
  },
  {
    q: "Le plexus d'Exner se trouve dans quelle couche ?",
    options: ["Couche I", "Couche III", "Couche V", "Couche VI"],
    correct: 0,
    explanation: "Le plexus d'Exner est dans la couche I (moléculaire) — formé par les fibres afférentes non spécifiques du thalamus."
  },
  {
    q: "La strie de Kaes-Bechterew se trouve dans :",
    options: [
      "La partie superficielle de la couche III",
      "La couche IV",
      "La partie inférieure de la couche V",
      "La couche VI"
    ],
    correct: 0,
    explanation: "Strie de Kaes-Bechterew = partie superficielle de la couche III, regroupe les axones afférents cortico-corticaux."
  },
  {
    q: "La strie de Baillarger interne se trouve dans :",
    options: [
      "La couche moléculaire",
      "La couche granuleuse externe",
      "La partie inférieure de la couche V",
      "La couche VI"
    ],
    correct: 2,
    explanation: "Strie de Baillarger interne = partie inférieure de la couche V — fibres d'association homolatérales."
  },
  {
    q: "Le cortex effecteur (agranulaire) est caractérisé par :",
    options: [
      "Couches II et IV très développées",
      "Couches III et V particulièrement importantes",
      "Couche I absente",
      "Une organisation à 4 couches seulement"
    ],
    correct: 1,
    explanation: "Le cortex effecteur (hétérotypique agranulaire) montre des couches III et V particulièrement importantes — typique des aires motrices."
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
