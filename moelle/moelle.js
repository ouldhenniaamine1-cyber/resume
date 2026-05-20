// ============================================================
//  MOELLE ÉPINIÈRE — script
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
const obs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });
sections.forEach(s => obs.observe(s));

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
  { cat: 'general', q: "Qu'est-ce que la moelle épinière ?", a: "Une portion du SNC logée dans le canal rachidien, dont elle est séparée par les méninges." },
  { cat: 'general', q: "Quelles sont les 2 grandes fonctions de la moelle ?", a: "Conduction de l'influx nerveux (périphérie → régions médullaires supérieures) + siège de nombreux réflexes." },
  { cat: 'general', q: "Forme de la moelle en coupe transversale ?", a: "Ovoïde, formée de 2 substances : grise (centrale, en H) et blanche (périphérique)." },
  { cat: 'general', q: "À quels niveaux se trouve la corne latérale ?", a: "Entre C8 et L2, sur le versant externe des cornes antérieures." },

  { cat: 'sg', q: "Forme de la substance grise sur une coupe ?", a: "En H ou en papillon, autour du canal épendymaire." },
  { cat: 'sg', q: "Les 2 types de substance grise ?", a: "Substance grise gélatineuse (Stilling autour du canal + Rolando en arrière de la corne post.) et substance grise spongieuse (le reste)." },
  { cat: 'sg', q: "Où se trouve la substance gélatineuse de Stilling ?", a: "Autour du canal épendymaire." },
  { cat: 'sg', q: "Où se trouve la substance gélatineuse de Rolando ?", a: "En arrière de la tête de la corne postérieure." },

  { cat: 'neurones', q: "Combien de catégories fondamentales de neurones existe-t-il dans la moelle ?", a: "5 catégories : motoneurones, neurones végétatifs, cellules funiculaires, cellules de la substance gélatineuse et cellules interneuronales." },
  { cat: 'neurones', q: "Critères de classification des neurones médullaires ?", a: "La morphologie du cytone et surtout la destinée de l'axone." },
  { cat: 'neurones', q: "Caractéristiques des motoneurones de la corne antérieure ?", a: "Cellules multipolaires volumineuses (100-150 µm), dendrites avec épines de Cajal, axone myélinisé qui pénètre la racine antérieure." },
  { cat: 'neurones', q: "Combien de cellules motrices au total dans la moelle ?", a: "Environ 400 000 cellules motrices." },
  { cat: 'neurones', q: "Différence entre motoneurones α et γ ?", a: "α : grande taille, axone se termine sur la plaque motrice du muscle strié. γ : petite taille, axone se termine sur le fuseau neuromusculaire." },
  { cat: 'neurones', q: "Que sont les cellules radiculaires ?", a: "Les motoneurones et les neurones végétatifs préganglionnaires (leur axone quitte la moelle par la racine antérieure)." },
  { cat: 'neurones', q: "Où sont situés les neurones végétatifs préganglionnaires ?", a: "Dans la moelle thoracique, dans la colonne latérale de la substance grise." },
  { cat: 'neurones', q: "Que sont les cellules funiculaires ?", a: "Cellules cordonales dont l'axone reste dans le SNC. Regroupées dans la colonne de Clarke et le noyau propre de la corne postérieure." },
  { cat: 'neurones', q: "Quel faisceau forment les cellules de la colonne de Clarke ?", a: "Le faisceau cérébelleux direct (axones épais)." },
  { cat: 'neurones', q: "Quel faisceau forment les cellules du noyau propre de la corne postérieure ?", a: "Le faisceau cérébelleux croisé (axones minces)." },
  { cat: 'neurones', q: "Caractéristiques des cellules de Golgi type II médullaires ?", a: "Petites cellules étoilées à la pointe des cornes postérieures, axone amyélinique, ne quittent pas la SG." },
  { cat: 'neurones', q: "Rôle des cellules de Renshaw ?", a: "Interneurones jouant un rôle fondamental dans les phénomènes d'excitation/inhibition neuronale, en synapse avec les motoneurones." },

  { cat: 'rexed', q: "Combien de couches dans la lamination de Rexed ?", a: "10 couches (I à IX) + zone X autour du canal épendymaire." },
  { cat: 'rexed', q: "Que contient la couche I de Rexed ?", a: "Couche zonale de Waldeyer — la plus postérieure, contient des cellules de Golgi II et funiculaires." },
  { cat: 'rexed', q: "À quoi correspond la couche II de Rexed ?", a: "À la substance gélatineuse de Rolando, peuplée essentiellement de cellules de Golgi type II." },
  { cat: 'rexed', q: "Que forment les couches IV et V ?", a: "Le noyau propre de la corne postérieure." },
  { cat: 'rexed', q: "Quelles couches sont représentées seulement en cervical et lombaire ?", a: "La couche VI." },
  { cat: 'rexed', q: "Que contient la couche VII ?", a: "2 colonnes : Colonne de Clarke (D1-L4) qui envoie au cervelet, et colonne intermédio-latérale (C8-L4) avec des neurones pré-ganglionnaires." },
  { cat: 'rexed', q: "Que contient la couche VIII ?", a: "Le noyau commissural, dont l'axone gagne le côté opposé de la moelle." },
  { cat: 'rexed', q: "Que contient la couche IX ?", a: "Les motoneurones de la corne antérieure groupés en colonnes." },
  { cat: 'rexed', q: "Quelles sont les aires fonctionnelles de la moelle ?", a: "Partie antérieure = aire motrice (somato + viscéro-motrice). Partie postérieure = aire sensitive (viscéro-sensible intéro + somato-sensible extéro)." },

  { cat: 'sb', q: "Composition de la substance blanche ?", a: "Fibres nerveuses + éléments névrogliques. Organisée en 3 cordons (antérieur, latéral, postérieur)." },
  { cat: 'sb', q: "Que contient le cordon antérieur ?", a: "Voies descendantes motrices." },
  { cat: 'sb', q: "Que contient le cordon latéral ?", a: "Voies ascendantes d'association." },
  { cat: 'sb', q: "Que contient le cordon postérieur ?", a: "Voies ascendantes sensitives." },
  { cat: 'sb', q: "D'où viennent les fibres descendantes motrices ?", a: "Des cellules pyramidales du cortex cérébral." },
  { cat: 'sb', q: "D'où viennent les fibres ascendantes sensitives ?", a: "Des protoneurones ganglionnaires, qui conduisent l'influx vers les cellules funiculaires puis vers le cervelet et le thalamus." },
  { cat: 'sb', q: "Qu'est-ce que le fulcrum névroglique tangentiel ?", a: "Fibres névrogliques disposées tangentiellement à la surface médullaire." },
  { cat: 'sb', q: "Qu'est-ce que le raphé médian postérieur ?", a: "Système dense de fibres du fulcrum radiaire entre le bord postérieur du canal épendymaire et le sillon postérieur." },
  { cat: 'sb', q: "Où prédominent les astrocytes fibreux ?", a: "Dans la substance blanche." },
  { cat: 'sb', q: "Où prédominent les astrocytes protoplasmiques ?", a: "Dans la substance grise." }
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
    q: "La forme de la substance grise en coupe est :",
    options: ["En T", "En H ou papillon", "En étoile", "Circulaire"],
    correct: 1,
    explanation: "La substance grise est en forme de H (ou papillon), centrale, autour du canal épendymaire."
  },
  {
    q: "Entre quels niveaux existe la corne latérale ?",
    options: ["C1-C8", "C8-L2", "T12-S5", "S1-S5"],
    correct: 1,
    explanation: "La corne latérale existe entre C8 et L2, sur le versant externe des cornes antérieures."
  },
  {
    q: "La substance gélatineuse de Stilling est située :",
    options: [
      "Autour du canal épendymaire",
      "En arrière de la corne postérieure",
      "Dans la corne antérieure",
      "Dans la substance blanche"
    ],
    correct: 0,
    explanation: "La substance gélatineuse de Stilling se situe autour du canal épendymaire."
  },
  {
    q: "Combien de catégories fondamentales de neurones existe-t-il dans la moelle ?",
    options: ["3", "4", "5", "6"],
    correct: 2,
    explanation: "Il existe 5 catégories fondamentales : motoneurones, neurones végétatifs, cellules funiculaires, cellules de Golgi II / substance gélatineuse, cellules de Renshaw."
  },
  {
    q: "Le diamètre des motoneurones de la corne antérieure est :",
    options: ["10-20 µm", "25-45 µm", "70 µm", "100-150 µm"],
    correct: 3,
    explanation: "Les motoneurones sont des cellules volumineuses de 100 à 150 µm de diamètre."
  },
  {
    q: "Le motoneurone alpha (α) se termine au niveau :",
    options: [
      "Du fuseau neuromusculaire",
      "De la plaque motrice du muscle strié",
      "Des ganglions végétatifs",
      "Du cervelet"
    ],
    correct: 1,
    explanation: "Le motoneurone α (grande taille) se termine sur la plaque motrice du muscle strié."
  },
  {
    q: "Quel faisceau forment les cellules de la colonne de Clarke ?",
    options: [
      "Faisceau pyramidal",
      "Faisceau cérébelleux direct",
      "Faisceau cérébelleux croisé",
      "Faisceau spino-thalamique"
    ],
    correct: 1,
    explanation: "Les cellules de la colonne de Clarke ont des axones épais qui forment le faisceau cérébelleux direct."
  },
  {
    q: "Les cellules de Renshaw sont :",
    options: [
      "Des motoneurones α",
      "Des cellules de soutien",
      "Des interneurones excitateurs/inhibiteurs synaptiquement liés aux motoneurones",
      "Des cellules ganglionnaires"
    ],
    correct: 2,
    explanation: "Les cellules de Renshaw sont des interneurones jouant un rôle fondamental dans l'excitation/inhibition, en synapse avec les motoneurones."
  },
  {
    q: "La couche zonale de Waldeyer correspond à :",
    options: ["Couche I de Rexed", "Couche IV de Rexed", "Couche VII", "Couche IX"],
    correct: 0,
    explanation: "La couche I de Rexed = couche zonale de Waldeyer, la plus postérieure."
  },
  {
    q: "La couche IX de Rexed contient :",
    options: [
      "La substance gélatineuse de Rolando",
      "Le noyau propre de la corne postérieure",
      "Les motoneurones groupés en colonnes",
      "Le noyau commissural"
    ],
    correct: 2,
    explanation: "La couche IX, dans la corne antérieure, contient les motoneurones groupés en colonnes."
  },
  {
    q: "La colonne intermédio-latérale (couche VII) :",
    options: [
      "Contient des neurones cérébelleux",
      "Contient des neurones pré-ganglionnaires entre C8-L4",
      "Forme le faisceau pyramidal",
      "Est dans la corne postérieure"
    ],
    correct: 1,
    explanation: "La colonne intermédio-latérale occupe les cornes latérales entre C8-L4 et contient des neurones synaptiques pré-ganglionnaires."
  },
  {
    q: "Le cordon antérieur de la substance blanche contient :",
    options: [
      "Voies ascendantes sensitives",
      "Voies descendantes motrices",
      "Voies d'association",
      "Le canal épendymaire"
    ],
    correct: 1,
    explanation: "Le cordon antérieur contient les voies descendantes motrices."
  },
  {
    q: "Les fibres descendantes motrices proviennent :",
    options: [
      "Des protoneurones ganglionnaires",
      "Des cellules de Renshaw",
      "Des cellules pyramidales du cortex cérébral",
      "Du cervelet"
    ],
    correct: 2,
    explanation: "Les fibres descendantes motrices sont issues des cellules pyramidales du cortex cérébral."
  },
  {
    q: "Quel type d'astrocyte prédomine dans la substance blanche ?",
    options: ["Protoplasmique", "Fibreux", "Velates", "Aucune des deux"],
    correct: 1,
    explanation: "Les astrocytes fibreux prédominent dans la substance blanche, alors que les protoplasmiques prédominent dans la substance grise."
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
