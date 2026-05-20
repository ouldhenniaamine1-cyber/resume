// ============================================================
//  L'œil — Cours interactif (script principal)
// ============================================================

// ---------- 1. THEME (dark / light) ----------
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

// ---------- 2. SIDEBAR (mobile) ----------
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

// ---------- 3. SMOOTH NAV + ACTIVE LINK ----------
document.querySelectorAll('.sidebar a').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (window.innerWidth <= 1024) sidebar.classList.remove('open');
    }
  });
});

// Highlight active section
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

// ---------- 4. PROGRESS BAR ----------
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = (window.scrollY / scrollHeight) * 100;
  progressBar.style.width = pct + '%';
});

// ---------- 5. BACK TO TOP ----------
const backTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backTop.classList.toggle('visible', window.scrollY > 400);
});
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- 6. EYE SVG INTERACTIVE ----------
const eyeInfoPanel = document.getElementById('eyeInfoPanel');
document.querySelectorAll('.eye-svg [data-label]').forEach(el => {
  const showInfo = () => {
    eyeInfoPanel.innerHTML = `
      <h4>${el.getAttribute('data-label')}</h4>
      <p>${el.getAttribute('data-info') || ''}</p>
    `;
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
  // Remove previous highlights
  document.querySelectorAll('.search-highlight').forEach(el => {
    const parent = el.parentNode;
    parent.replaceChild(document.createTextNode(el.textContent), el);
    parent.normalize();
  });

  document.querySelectorAll('[data-section]').forEach(sec => sec.classList.remove('section-hidden'));

  if (!q) return;

  document.querySelectorAll('[data-section]').forEach(sec => {
    const text = sec.textContent.toLowerCase();
    if (!text.includes(q)) {
      sec.classList.add('section-hidden');
    } else {
      // highlight
      highlightInNode(sec, q);
    }
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
      return;
    }
  } else if (node.nodeType === 1 && !['SCRIPT','STYLE','SVG'].includes(node.tagName) && !node.closest('svg')) {
    Array.from(node.childNodes).forEach(c => highlightInNode(c, q));
  }
}

// ---------- 8. PRINT ----------
document.getElementById('printBtn').addEventListener('click', () => window.print());

// ============================================================
//  FLASHCARDS
// ============================================================
const flashcards = [
  // Embryologie
  { cat: 'embryo', q: "Origines tissulaires de l'œil ?", a: "Ectoblaste + neuroectoblaste + mésenchyme avoisinant." },
  { cat: 'embryo', q: "Quand apparaît la fossette optique ?", a: "Au 18ᵉ jour (J18)." },
  { cat: 'embryo', q: "Stade de la cupule optique ?", a: "29ᵉ jour (vésicule optique secondaire)." },
  { cat: 'embryo', q: "Que devient le feuillet externe de la cupule ?", a: "L'épithélium pigmentaire de la rétine." },
  { cat: 'embryo', q: "Que devient le feuillet interne (2/3 postérieurs) ?", a: "La rétine visuelle (épithélium sensoriel)." },
  { cat: 'embryo', q: "Origine du cristallin ?", a: "Ectoblaste — placode cristallinienne." },

  // Anatomie
  { cat: 'anatomie', q: "Combien de tuniques a l'œil ?", a: "3 : externe fibreuse, moyenne (uvée), interne nerveuse (rétine)." },
  { cat: 'anatomie', q: "Combien de couches a la cornée ?", a: "5 : épithélium pavimenteux stratifié, Bowman, stroma, Descemet, endothélium." },
  { cat: 'anatomie', q: "Combien de couches a la sclérotique ?", a: "3 : tissu épiscléral, stroma, supra-choroïde." },
  { cat: 'anatomie', q: "3 parties de l'uvée ?", a: "Choroïde + corps ciliaire + iris." },
  { cat: 'anatomie', q: "Combien de couches a la choroïde ?", a: "4 : supra-choroïde, vaisseaux, choriocapillaire, membrane de Bruch." },
  { cat: 'anatomie', q: "Quelle membrane de la cornée est PAS+ ?", a: "La membrane de Descemet." },
  { cat: 'anatomie', q: "Combien de lamelles dans le stroma cornéen ?", a: "60 lamelles de fibres de collagène." },
  { cat: 'anatomie', q: "Que sécrètent les procès ciliaires ?", a: "L'humeur aqueuse." },
  { cat: 'anatomie', q: "Composition du corps vitré ?", a: "~90% eau + glycosaminoglycanes + fines fibrilles de collagène." },

  // Rétine
  { cat: 'retine', q: "Combien de couches a la rétine visuelle ?", a: "10 couches." },
  { cat: 'retine', q: "Quelle est la couche n°1 (la plus externe) ?", a: "Épithélium pigmentaire (adhérent à la choroïde)." },
  { cat: 'retine', q: "Que contient la couche granulaire externe ?", a: "Les corps cellulaires des photorécepteurs (cônes & bâtonnets)." },
  { cat: 'retine', q: "Couches plexiformes : que contiennent-elles ?", a: "Externe : synapses photorécepteurs ↔ bipolaires/horizontales. Interne : synapses bipolaires ↔ ganglionnaires." },
  { cat: 'retine', q: "Quelle est la dernière couche (la plus interne) ?", a: "Membrane limitante interne (extrémités des cellules de Müller)." },
  { cat: 'retine', q: "Cellules de la couche granulaire interne ?", a: "Müller, amacrines, bipolaires, horizontales." },

  // Cellules
  { cat: 'cellules', q: "Pigment des bâtonnets ?", a: "Rhodopsine (1 seul pigment)." },
  { cat: 'cellules', q: "Pigments des cônes ?", a: "3 iodopsines (sensibles au vert, rouge, bleu)." },
  { cat: 'cellules', q: "Combien de bâtonnets ?", a: "120 millions." },
  { cat: 'cellules', q: "Combien de cônes ?", a: "6-7 millions." },
  { cat: 'cellules', q: "Terminaison synaptique d'un cône ?", a: "Pédicule (plus large)." },
  { cat: 'cellules', q: "Terminaison synaptique d'un bâtonnet ?", a: "Sphérule." },
  { cat: 'cellules', q: "Lieu de synthèse du pigment visuel ?", a: "Article interne (Golgi et mitochondries)." },
  { cat: 'cellules', q: "Rôle des cellules de Müller ?", a: "Soutien — remplissent les espaces entre cellules nerveuses." },
  { cat: 'cellules', q: "Cellules les plus nombreuses dans la rétine ?", a: "Les cellules bipolaires." },

  // Régions / Physio
  { cat: 'physio', q: "Diamètre de la fovéa centralis ?", a: "0,5 mm." },
  { cat: 'physio', q: "Cellules présentes à la fovéa ?", a: "Cônes uniquement (80 000 - 100 000)." },
  { cat: 'physio', q: "Connexion à la fovéa ?", a: "1 cône → 1 bipolaire → 1 ganglionnaire (1:1:1)." },
  { cat: 'physio', q: "Qu'est-ce que la papille ?", a: "Le point aveugle — convergence des fibres du nerf optique, pas de cellules visuelles." },
  { cat: 'physio', q: "3 fonctions de l'épithélium pigmentaire ?", a: "Soutien/protection, élaboration du pourpre rétinien, nutrition (1/3 ext. de la rétine)." },
  { cat: 'physio', q: "Vision nocturne — quel récepteur ?", a: "Les bâtonnets (rhodopsine)." },
  { cat: 'physio', q: "Vision diurne — quel récepteur ?", a: "Les cônes (vision des couleurs)." },
  { cat: 'physio', q: "Limite antérieure de la rétine visuelle ?", a: "L'ora serrata." },

  // Pathologies
  { cat: 'patho', q: "Cause du glaucome ?", a: "Élévation de la pression intra-oculaire (obstruction de la résorption de l'humeur aqueuse)." },
  { cat: 'patho', q: "Risque du glaucome non traité ?", a: "Lésion du nerf optique → cécité." },
  { cat: 'patho', q: "Cause fréquente d'un décollement de la rétine ?", a: "Un traumatisme." },
  { cat: 'patho', q: "Conséquence histologique du décollement ?", a: "Dissociation rétine neurosensorielle / épithélium pigmentaire → ischémie." }
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

flashcardEl.addEventListener('click', () => {
  flashcardEl.classList.toggle('flipped');
});

document.getElementById('nextCard').addEventListener('click', () => {
  if (currentDeck.length === 0) return;
  currentIndex = (currentIndex + 1) % currentDeck.length;
  renderCard();
});

document.getElementById('prevCard').addEventListener('click', () => {
  if (currentDeck.length === 0) return;
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

// Keyboard nav for flashcards
document.addEventListener('keydown', e => {
  if (document.activeElement === searchInput) return;
  const fcRect = flashcardEl.getBoundingClientRect();
  const visible = fcRect.top < window.innerHeight && fcRect.bottom > 0;
  if (!visible) return;
  if (e.key === 'ArrowRight') document.getElementById('nextCard').click();
  if (e.key === 'ArrowLeft') document.getElementById('prevCard').click();
  if (e.key === ' ') { e.preventDefault(); flashcardEl.classList.toggle('flipped'); }
});

// ============================================================
//  QUIZ
// ============================================================
const quizQuestions = [
  {
    q: "À quel jour apparaît la cupule optique ?",
    options: ["18 jours", "22 jours", "27 jours", "29 jours"],
    correct: 3,
    explanation: "La cupule optique (vésicule optique secondaire) se forme au 29ᵉ jour."
  },
  {
    q: "Quelle structure dérive du feuillet externe de la cupule optique ?",
    options: ["La rétine visuelle", "L'épithélium pigmentaire", "Le cristallin", "Le corps vitré"],
    correct: 1,
    explanation: "Le feuillet externe donne l'épithélium pigmentaire de la rétine."
  },
  {
    q: "Combien de couches contient la cornée ?",
    options: ["3", "4", "5", "6"],
    correct: 2,
    explanation: "5 couches : épithélium pavimenteux stratifié non kératinisé, Bowman, stroma, Descemet, endothélium."
  },
  {
    q: "Quelle membrane de la cornée est PAS+ ?",
    options: ["Bowman", "Descemet", "Bruch", "Limitante interne"],
    correct: 1,
    explanation: "La membrane de Descemet est une lame basale épaisse, PAS+."
  },
  {
    q: "Quelle couche de la choroïde assure la nutrition de la rétine ?",
    options: ["Supra-choroïde", "Couche des vaisseaux", "Couche choriocapillaire", "Membrane de Bruch"],
    correct: 2,
    explanation: "La couche choriocapillaire assure la nutrition du tiers externe de la rétine."
  },
  {
    q: "Quel pigment se trouve dans les bâtonnets ?",
    options: ["Iodopsine", "Mélanine", "Rhodopsine", "Lipofuscine"],
    correct: 2,
    explanation: "Les bâtonnets contiennent UN seul pigment : la rhodopsine."
  },
  {
    q: "Combien de couches a la rétine visuelle ?",
    options: ["7", "8", "10", "12"],
    correct: 2,
    explanation: "10 couches, alternant granulaire et plexiforme."
  },
  {
    q: "Que contient la couche granulaire externe ?",
    options: [
      "Les corps des photorécepteurs",
      "Les corps des bipolaires",
      "Les corps des ganglionnaires",
      "Les axones du nerf optique"
    ],
    correct: 0,
    explanation: "La couche granulaire externe (couche n°4) contient les corps cellulaires des photorécepteurs."
  },
  {
    q: "Quelle cellule sert au soutien dans la rétine ?",
    options: ["Cellules amacrines", "Cellules de Müller", "Cellules horizontales", "Cellules ganglionnaires"],
    correct: 1,
    explanation: "Les cellules de Müller sont les cellules de soutien — elles remplissent tous les espaces entre les cellules nerveuses."
  },
  {
    q: "Quel est le diamètre de la fovéa centralis ?",
    options: ["0,1 mm", "0,5 mm", "1 mm", "2 mm"],
    correct: 1,
    explanation: "La fovéa centralis fait 0,5 mm de diamètre, au centre de la macula."
  },
  {
    q: "Quelles cellules sont présentes à la fovéa centralis ?",
    options: ["Bâtonnets uniquement", "Cônes uniquement", "Cônes et bâtonnets en quantité égale", "Aucune cellule visuelle"],
    correct: 1,
    explanation: "À la fovéa, seuls les cônes sont présents (80 000 à 100 000)."
  },
  {
    q: "Qu'est-ce que la papille du nerf optique ?",
    options: [
      "La zone de plus grande acuité",
      "Le point aveugle de la rétine",
      "L'origine de l'humeur aqueuse",
      "La limite antérieure de la rétine"
    ],
    correct: 1,
    explanation: "La papille = point aveugle, dépourvue de cellules visuelles. C'est où le nerf optique sort."
  },
  {
    q: "Que sécrètent les procès ciliaires ?",
    options: ["Le corps vitré", "Les larmes", "L'humeur aqueuse", "La rhodopsine"],
    correct: 2,
    explanation: "Les procès ciliaires sécrètent l'humeur aqueuse."
  },
  {
    q: "Cause principale du glaucome ?",
    options: [
      "Décollement rétinien",
      "Élévation de la pression intra-oculaire",
      "Atrophie cristallinienne",
      "Infection de la conjonctive"
    ],
    correct: 1,
    explanation: "Le glaucome résulte d'une élévation de la pression intra-oculaire, par obstruction de la résorption de l'humeur aqueuse."
  },
  {
    q: "À la fovéa, le rapport synaptique est de :",
    options: ["1:10:100", "1:1:1", "10:1:1", "100:10:1"],
    correct: 1,
    explanation: "À la fovéa : 1 cône → 1 bipolaire → 1 ganglionnaire (acuité maximale)."
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

    if (userA === q.correct) {
      score++;
      div.classList.remove('incorrect');
      div.classList.add('correct');
    } else {
      div.classList.remove('correct');
      div.classList.add('incorrect');
    }

    fb.classList.add('show');
    fb.innerHTML = `<strong>${userA === q.correct ? '✅ Correct' : '❌ Incorrect'}</strong> — ${q.explanation}`;
  });

  const result = document.getElementById('quizResult');
  result.classList.remove('hidden');
  const pct = Math.round((score / quizQuestions.length) * 100);
  let comment = '';
  if (pct === 100) comment = '🏆 Parfait ! Tu maîtrises ton cours.';
  else if (pct >= 80) comment = '🎉 Excellent !';
  else if (pct >= 60) comment = '👍 Bien — quelques révisions et c\'est dans la poche.';
  else if (pct >= 40) comment = '📚 À retravailler.';
  else comment = '💪 Courage — relis les sections puis recommence.';

  result.innerHTML = `
    <h3>${comment}</h3>
    <div class="quiz-score">${score} / ${quizQuestions.length}</div>
    <p>Score : <strong>${pct}%</strong></p>
  `;
  result.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

document.getElementById('submitQuiz').addEventListener('click', () => {
  if (Object.keys(userAnswers).length < quizQuestions.length) {
    if (!confirm(`Tu n'as répondu qu'à ${Object.keys(userAnswers).length} questions sur ${quizQuestions.length}. Soumettre quand même ?`)) return;
  }
  gradeQuiz();
});

document.getElementById('resetQuiz').addEventListener('click', () => {
  document.getElementById('quizResult').classList.add('hidden');
  renderQuiz();
});

renderQuiz();
