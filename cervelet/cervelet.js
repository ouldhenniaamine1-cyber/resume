// ============================================================
//  CERVELET — script
// ============================================================

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

const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const sh = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (window.scrollY / sh * 100) + '%';
});

const backTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => backTop.classList.toggle('visible', window.scrollY > 400));
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

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
  { cat: 'general', q: "Qu'est-ce que le cervelet ?", a: "Une partie de l'encéphale, impaire et médiane, située dans l'étage inférieur du crâne, au-dessous des hémisphères cérébraux. C'est l'organe de l'équilibration." },
  { cat: 'general', q: "Composition d'une lamelle cérébelleuse ?", a: "Région superficielle = SG (cortex cérébelleux, cellules nerveuses + fibres amyéliniques). Axe profond = SB (fibres myélinisées + 4 noyaux gris)." },

  { cat: 'couches', q: "Combien de couches dans la SG du cortex cérébelleux et quelle épaisseur ?", a: "3 couches, épaisseur 1 mm : couche moléculaire (superficielle), couche des cellules de Purkinje (intermédiaire), couche des grains (profonde)." },
  { cat: 'couches', q: "Que contient la couche moléculaire ?", a: "Des cellules étoilées de 2 types : étoilées superficielles (1/3 externe) et étoilées profondes (en panier, 1/3 interne)." },
  { cat: 'couches', q: "Caractéristiques des cellules en panier ?", a: "Étoilées profondes (8-18 µm), 1/3 interne de la couche moléculaire, axone long amyélinique horizontal qui forme une corbeille autour du péricaryon des Purkinje." },
  { cat: 'couches', q: "Avec combien de cellules de Purkinje est en rapport une cellule en panier ?", a: "Une dizaine (10) de cellules de Purkinje." },
  { cat: 'couches', q: "Que comprend la couche des grains ?", a: "2 catégories de neurones : cellules à grains et cellules de Golgi type II." },
  { cat: 'couches', q: "Caractéristiques des cellules à grains ?", a: "Petites (7-10 µm), nombreuses (2.5 millions/mm³), sphériques. 4-5 dendrites en croix se terminant en griffe dans les glomérules de Held. Axone bifurque en T pour former les fibres parallèles (1-1.5 mm)." },

  { cat: 'purkinje', q: "Diamètre et forme de la cellule de Purkinje ?", a: "30-40 µm, aspect piriforme : base vers les grains, apex vers la zone moléculaire." },
  { cat: 'purkinje', q: "Caractéristiques des dendrites de Purkinje ?", a: "Naissent à l'apex, s'arborisent dans toute la zone moléculaire dans un plan PERPENDICULAIRE à l'axe de la lamelle. Reçoivent + de 200 000 contacts neuronaux." },
  { cat: 'purkinje', q: "Trajet de l'axone d'une Purkinje ?", a: "Naît à la base, traverse la couche des grains et gagne les noyaux gris profonds. C'est l'efférence unique du cervelet." },
  { cat: 'purkinje', q: "Pourquoi la cellule de Purkinje est-elle 'le véritable cervelet histophysiologique' ?", a: "Elle est le centre de convergence de toutes les informations aboutissant au cervelet et le point de départ de tous les influx efférents." },

  { cat: 'fibres', q: "Les 2 fibres afférentes de la SB cérébelleuse ?", a: "Les fibres moussues et les fibres grimpantes." },
  { cat: 'fibres', q: "D'où viennent les fibres moussues ?", a: "Des cellules de la colonne de Clarke (faisceau spino-cérébelleux direct) ou des cellules ponto-bulbaires." },
  { cat: 'fibres', q: "Comment se terminent les fibres moussues ?", a: "Elles perdent leur myéline et se terminent par des rosettes de boutons qui s'engrènent avec les dendrites des grains et l'axone des Golgi II au sein des glomérules de Held." },
  { cat: 'fibres', q: "D'où viennent les fibres grimpantes ?", a: "Des neurones de l'olive bulbaire CONTROLATÉRALE." },
  { cat: 'fibres', q: "Particularité de la fibre grimpante ?", a: "Chaque fibre rentre en contact direct avec les dendrites d'UNE SEULE cellule de Purkinje (rapport 1↔1). Activation directe sans interneurone." },
  { cat: 'fibres', q: "Quels sont les 4 noyaux gris profonds du cervelet ?", a: "Noyau du toit (faîte), Globulus, Embolus (emboliforme) et Noyau dentelé." },
  { cat: 'fibres', q: "Que reçoit le noyau du toit ?", a: "Situé dans le vermis, proche de la ligne médiane, il reçoit les axones de la région médiane." },
  { cat: 'fibres', q: "Que reçoit le noyau dentelé ?", a: "Les efférences des 2/3 latéraux des hémisphères cérébelleux." },
  { cat: 'fibres', q: "Que sont les noyaux interposés ?", a: "Le globulus et l'embolus (emboliformes) — disposés latéralement de dedans en dehors, reçoivent les axones des hémisphères." },

  { cat: 'fonction', q: "Qu'est-ce que le glomérule de Held ?", a: "Une structure synaptique complexe (≈20 µm) située dans la couche granuleuse, isolée par des cellules névrogliques. C'est un véritable îlot synaptique." },
  { cat: 'fonction', q: "Que synapsent dans un glomérule de Held ?", a: "1) Terminaisons des fibres moussues, 2) Dendrites des cellules à grains, 3) Dendrites des cellules de Golgi II, 4) Terminaisons axoniques des cellules de Golgi II." },
  { cat: 'fonction', q: "Comment les fibres grimpantes activent-elles les Purkinje ?", a: "Activation DIRECTE des dendrites des Purkinje, sans interposition de neurone connecteur." },
  { cat: 'fonction', q: "Comment les fibres moussues activent-elles les Purkinje ?", a: "Indirectement : via le glomérule de Held → cellules à grains → fibres parallèles → cellules de Purkinje." },
  { cat: 'fonction', q: "Quelles sont les seules cellules excitatrices du cortex cérébelleux ?", a: "Les cellules à grains. Tous les autres interneurones (Golgi, étoilées, en panier) sont inhibiteurs." },
  { cat: 'fonction', q: "Effet des cellules de Golgi, étoilées et en panier sur les Purkinje ?", a: "Effet INHIBITEUR, peu de temps après l'arrivée de l'influx excitateur des grains." },
  { cat: 'fonction', q: "Les 4 rôles du cervelet ?", a: "Équilibre, statique, motricité, contrôle des réflexes/mouvements volontaires." },
  { cat: 'fonction', q: "Les 3 sources artérielles du cervelet ?", a: "Artère cérébelleuse inférieure (branche de l'artère vertébrale), artère cérébelleuse moyenne (inféro-ant, tronc basilaire), artère cérébelleuse supérieure (tronc basilaire)." },
  { cat: 'fonction', q: "Triade clinique du syndrome cérébelleux ?", a: "Troubles de l'équilibre + trouble du tonus musculaire postural avec hypotonie + trouble de l'exécution du mouvement global." },
  { cat: 'fonction', q: "Caractéristique de la parole dans un syndrome cérébelleux ?", a: "Parole irrégulière, lente et accélérée, souvent EXPLOSIVE." },
  { cat: 'fonction', q: "Que sont les fibres de Bergmann ?", a: "Fibres névrogliques spécifiques au cervelet, associées aux cellules épithéliales de Golgi." },
  { cat: 'fonction', q: "Que sont les cellules de Fañanas ?", a: "Petites astrocytes spécifiques au cervelet." }
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
    q: "Le cortex cérébelleux est constitué de :",
    options: ["2 couches", "3 couches", "4 couches", "6 couches"],
    correct: 1,
    explanation: "Le cortex cérébelleux a 3 couches : moléculaire, des Purkinje, des grains."
  },
  {
    q: "Quelle est l'épaisseur de la SG du cortex cérébelleux ?",
    options: ["0.5 mm", "1 mm", "3 mm", "5 mm"],
    correct: 1,
    explanation: "La SG du cortex cérébelleux a une épaisseur d'environ 1 mm."
  },
  {
    q: "Diamètre des cellules de Purkinje ?",
    options: ["10-15 µm", "30-40 µm", "70 µm", "100-150 µm"],
    correct: 1,
    explanation: "Les cellules de Purkinje mesurent 30-40 µm de diamètre."
  },
  {
    q: "Forme caractéristique de la cellule de Purkinje :",
    options: ["Pyramidale", "Étoilée", "Piriforme (poire)", "Sphérique"],
    correct: 2,
    explanation: "La cellule de Purkinje a un aspect piriforme : base vers les grains, apex vers la zone moléculaire."
  },
  {
    q: "Une cellule de Purkinje peut entrer en contact avec :",
    options: ["100 neurones", "10 000 neurones", "+ de 200 000 neurones", "1 million de neurones"],
    correct: 2,
    explanation: "Une cellule de Purkinje peut être en contact avec plus de 200 000 neurones."
  },
  {
    q: "Les fibres grimpantes proviennent :",
    options: [
      "De la colonne de Clarke",
      "De l'olive bulbaire controlatérale",
      "Du thalamus",
      "Des hémisphères cérébraux"
    ],
    correct: 1,
    explanation: "Les fibres grimpantes proviennent des neurones de l'olive bulbaire controlatérale."
  },
  {
    q: "Les fibres moussues proviennent :",
    options: [
      "De l'olive bulbaire",
      "Des cellules de la colonne de Clarke ou ponto-bulbaire",
      "Du cortex cérébral seulement",
      "Des cellules de Purkinje"
    ],
    correct: 1,
    explanation: "Les fibres moussues, myélinisées et épaisses, viennent de la colonne de Clarke (faisceau spino-cérébelleux direct) ou ponto-bulbaire."
  },
  {
    q: "Combien de cellules de Purkinje active une fibre grimpante ?",
    options: ["1 seule", "10", "100", "Toutes celles d'une lamelle"],
    correct: 0,
    explanation: "Chaque fibre grimpante entre en contact avec UNE SEULE cellule de Purkinje (1↔1) — activation directe sans interneurone."
  },
  {
    q: "Le glomérule de Held est :",
    options: [
      "Une cellule géante",
      "Un îlot synaptique dans la couche granuleuse",
      "Un noyau de la SB",
      "Une fibre nerveuse"
    ],
    correct: 1,
    explanation: "Le glomérule de Held est un îlot synaptique complexe (~20 µm) situé dans la couche granuleuse, isolé par des cellules névrogliques."
  },
  {
    q: "Que contient le glomérule de Held ?",
    options: [
      "Seulement des fibres moussues",
      "Fibres moussues + dendrites des grains + dendrites et axones des Golgi II",
      "Fibres grimpantes uniquement",
      "Axones des Purkinje"
    ],
    correct: 1,
    explanation: "Le glomérule contient : terminaisons des fibres moussues, dendrites des cellules à grains, dendrites et axones des cellules de Golgi II."
  },
  {
    q: "Combien de noyaux gris profonds compte le cervelet ?",
    options: ["2", "3", "4", "6"],
    correct: 2,
    explanation: "4 noyaux gris profonds : noyau du toit, globulus, embolus, noyau dentelé."
  },
  {
    q: "Le noyau dentelé reçoit :",
    options: [
      "Les axones du vermis",
      "Les efférences des 2/3 latéraux des hémisphères",
      "Les fibres moussues",
      "Les axones de la moelle"
    ],
    correct: 1,
    explanation: "Le noyau dentelé reçoit les efférences des 2/3 latéraux des hémisphères cérébelleux."
  },
  {
    q: "Quelle est l'efférence unique du cortex cérébelleux ?",
    options: [
      "L'axone des cellules à grains",
      "L'axone des cellules de Golgi II",
      "L'axone des cellules de Purkinje",
      "Les fibres grimpantes"
    ],
    correct: 2,
    explanation: "L'axone des cellules de Purkinje constitue l'efférence unique — elles transmettent toutes les informations vers les noyaux gris profonds."
  },
  {
    q: "Quelles cellules sont les seules excitatrices dans le cortex cérébelleux ?",
    options: [
      "Cellules de Purkinje",
      "Cellules de Golgi II",
      "Cellules à grains",
      "Cellules en panier"
    ],
    correct: 2,
    explanation: "Les cellules à grains sont les seules cellules excitatrices ; les Golgi, étoilées et en panier sont inhibitrices."
  },
  {
    q: "Un syndrome cérébelleux se caractérise par :",
    options: [
      "Hypertonie + paralysie",
      "Tremblements de repos uniquement",
      "Troubles de l'équilibre + hypotonie + trouble du mouvement",
      "Aphasie"
    ],
    correct: 2,
    explanation: "Le syndrome cérébelleux : troubles de l'équilibre, hypotonie posturale, trouble de l'exécution du mouvement (parole explosive, écriture irrégulière)."
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
