// ============================================================
//  RECEPTEURS DE LA PEAU — script
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
  { cat: 'general', q: "À quel type d'organe des sens appartient la peau ?", a: "À un organe des sens secondaire." },
  { cat: 'general', q: "Où sont situés les corps cellulaires des neurones sensoriels cutanés ?", a: "Dans les ganglions rachidiens (ce sont des cellules en T de Ranvier)." },
  { cat: 'general', q: "Trajet des axones des neurones sensoriels cutanés ?", a: "Vers les cornes postérieures de la moelle épinière, ou vers les noyaux de Goll et Burdach du bulbe rachidien." },
  { cat: 'general', q: "Où se trouvent les cellules sensorielles accessoires de la peau ?", a: "Dans la massue centrale des corpuscules tactiles. Certaines cellules épidermiques (Merkel) sont aussi accessoires." },

  { cat: 'libres', q: "Caractéristiques des terminaisons nerveuses libres ?", a: "Fibres nerveuses nues (amyéliniques) localisées dans le corps muqueux de Malpighi. Se terminent dans la couche papillaire, parfois dans l'épiderme ou au contact des cellules de Merkel." },
  { cat: 'libres', q: "Que sont les thermorécepteurs ?", a: "Fibres amyéliniques (ou faiblement myélinisées) qui détectent le chaud et le froid. Densité plus faible que les mécanorécepteurs." },
  { cat: 'libres', q: "Que sont les nocirécepteurs ?", a: "Récepteurs de la douleur, sensibles au pincement, à la piqûre et aux températures extrêmes. Fibres amyéliniques ou faiblement myélinisées." },

  { cat: 'rapide', q: "Quels sont les 3 mécanorécepteurs à adaptation rapide ?", a: "Corpuscule de Vater-Pacini, corpuscule de Wagner-Meissner et corpuscule de Dogiel." },
  { cat: 'rapide', q: "Caractéristiques du corpuscule de Vater-Pacini ?", a: "Lamellaire, volumineux (1-2 mm), dans l'hypoderme et le derme profond. Aspect en bulbe d'oignon (lamelles concentriques de cellules de Schwann). Capsule conjonctive périphérique." },
  { cat: 'rapide', q: "Fonction du corpuscule de Pacini ?", a: "Sensible à la pression et aux vibrations." },
  { cat: 'rapide', q: "Caractéristiques du corpuscule de Wagner-Meissner ?", a: "Cellulaire, ovalaire, 60-180 µm × 30-90 µm, perpendiculaire à la surface, dans les papilles dermiques. Cellules Schwanniennes superposées en pile d'assiettes, fibre nerveuse en parcours hélicoïdal." },
  { cat: 'rapide', q: "Fonction du corpuscule de Wagner-Meissner ?", a: "Sensible au tact et à la pression." },
  { cat: 'rapide', q: "Caractéristiques du corpuscule de Dogiel ?", a: "Cellulaire, identique au Wagner-Meissner mais ses fibres traversent le pôle de la capsule pour se terminer librement dans le tissu conjonctif sus-jacent. Siège dans l'épiderme des organes génitaux." },
  { cat: 'rapide', q: "Fonction du corpuscule de Dogiel ?", a: "Contact et pression (organes génitaux)." },

  { cat: 'lente', q: "Quels sont les mécanorécepteurs à adaptation lente ?", a: "Corpuscule de Ruffini, corpuscule de Golgi-Mazzoni et bulbe terminal de Krause." },
  { cat: 'lente', q: "Caractéristiques du corpuscule de Ruffini ?", a: "Lamellaire, fusiforme et feuilleté, 1 mm × 0.1 mm, dans le derme profond. Fibres collagènes en continuité avec les fibres environnantes. Capsule mince + espace sous-capsulaire bien marqué." },
  { cat: 'lente', q: "Fonction du corpuscule de Ruffini ?", a: "Sensible aux tractions sur les fibres collagènes : étirement, pression, et également le chaud." },
  { cat: 'lente', q: "Caractéristiques du corpuscule de Golgi-Mazzoni ?", a: "Lamellaire, dans le derme (organes génitaux). Même structure que Pacini mais moins volumineux, coque de lamelles plus mince." },
  { cat: 'lente', q: "Fonction du corpuscule de Golgi-Mazzoni ?", a: "Pression et vibration." },
  { cat: 'lente', q: "Que captent les bulbes terminaux de Krause ?", a: "Les variations de température, surtout le froid. Présents sur le gland du pénis et le clitoris (rôle dans le plaisir)." },

  { cat: 'merkel', q: "Où sont visibles les cellules de Merkel ?", a: "Dans la peau épaisse de la face plantaire des pieds et de la face palmaire des mains et des doigts. Mobilisées dans la lecture de l'écriture Braille." },
  { cat: 'merkel', q: "Où siègent les cellules de Merkel dans l'épiderme ?", a: "Dans la couche basale de l'épiderme." },
  { cat: 'merkel', q: "Particularité cytoplasmique des cellules de Merkel ?", a: "Petites vésicules à cœur dense (= récepteurs). Terminaisons nerveuses amyéliniques en forme de disque entrent en contact avec leur base." },
  { cat: 'merkel', q: "Quel est le double rôle des cellules de Merkel ?", a: "Rôle sensoriel (récepteur tactile) + rôle endocrinien (système APUD : Amine Precursor Uptake and Decarboxylation)." },
  { cat: 'merkel', q: "Qu'est-ce que l'analgésie congénitale ?", a: "Maladie rare très dangereuse qui empêche de ressentir la douleur physique." },
  { cat: 'merkel', q: "Quelles sont les 2 causes principales de l'analgésie congénitale ?", a: "1) Production excessive d'endorphine dans le cerveau (effet antidouleur). 2) Mutation génétique du gène SCN11A surexprimé qui bloque les canaux ioniques des neurones de la douleur." }
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
    q: "La peau est un organe des sens :",
    options: ["Primaire", "Secondaire", "Tertiaire", "Aucun de ces"],
    correct: 1,
    explanation: "La peau est un organe des sens secondaire (cellules sensorielles accessoires épidermiques + cellules principales dans le ganglion rachidien)."
  },
  {
    q: "Les corps cellulaires des neurones sensoriels cutanés sont :",
    options: [
      "Dans l'épiderme",
      "Dans le derme profond",
      "Dans les ganglions rachidiens (¢ en T de Ranvier)",
      "Dans la moelle épinière"
    ],
    correct: 2,
    explanation: "Les ¢ principales sont les cellules en T de Ranvier des ganglions rachidiens."
  },
  {
    q: "Vers où se dirigent les axones des neurones sensoriels cutanés ?",
    options: [
      "Vers le cervelet",
      "Vers les cornes antérieures de la moelle",
      "Vers les cornes postérieures de la moelle ou les noyaux Goll/Burdach",
      "Vers les ganglions végétatifs"
    ],
    correct: 2,
    explanation: "Les axones se rendent aux cornes postérieures de la moelle ou aux noyaux de Goll et Burdach du bulbe rachidien."
  },
  {
    q: "Le corpuscule de Vater-Pacini est :",
    options: [
      "Cellulaire",
      "Lamellaire en bulbe d'oignon",
      "Une terminaison libre",
      "Endocrine"
    ],
    correct: 1,
    explanation: "Le corpuscule de Pacini est lamellaire, avec des lamelles concentriques de ¢ de Schwann (aspect en bulbe d'oignon)."
  },
  {
    q: "Diamètre du corpuscule de Pacini :",
    options: ["10-50 µm", "60-180 µm", "1-2 mm", "5-10 mm"],
    correct: 2,
    explanation: "Le corpuscule de Pacini est volumineux : 1 à 2 mm de diamètre."
  },
  {
    q: "Le corpuscule de Pacini est sensible :",
    options: [
      "Au chaud",
      "À la pression et aux vibrations",
      "À la douleur",
      "Au froid"
    ],
    correct: 1,
    explanation: "Le corpuscule de Pacini détecte la pression et les vibrations (mécanorécepteur à adaptation rapide)."
  },
  {
    q: "Localisation du corpuscule de Wagner-Meissner :",
    options: [
      "Hypoderme",
      "Papilles dermiques",
      "Couche basale de l'épiderme",
      "Tissu sous-cutané profond"
    ],
    correct: 1,
    explanation: "Le corpuscule de Wagner-Meissner est dans les papilles dermiques, perpendiculaire à la surface cutanée."
  },
  {
    q: "Le corpuscule de Ruffini est :",
    options: [
      "Un mécanorécepteur à adaptation rapide",
      "Un mécanorécepteur à adaptation lente",
      "Un nocirécepteur",
      "Un thermorécepteur uniquement"
    ],
    correct: 1,
    explanation: "Le corpuscule de Ruffini est un mécanorécepteur à adaptation lente — sensible aux tractions, étirement, pression et chaud."
  },
  {
    q: "Le bulbe terminal de Krause est principalement :",
    options: [
      "Un récepteur du chaud",
      "Un récepteur du froid",
      "Un nocirécepteur",
      "Un mécanorécepteur de pression"
    ],
    correct: 1,
    explanation: "Le bulbe de Krause détecte les variations de température, surtout le froid (et joue un rôle dans le plaisir : gland, clitoris)."
  },
  {
    q: "Où siègent les cellules de Merkel ?",
    options: [
      "Couche cornée de l'épiderme",
      "Couche basale de l'épiderme",
      "Hypoderme",
      "Capsule du corpuscule de Pacini"
    ],
    correct: 1,
    explanation: "Les cellules de Merkel siègent dans la couche basale de l'épiderme."
  },
  {
    q: "Les cellules de Merkel sont impliquées dans :",
    options: [
      "La sécrétion de sueur",
      "La détection du froid uniquement",
      "La lecture de l'écriture Braille",
      "La photoréception"
    ],
    correct: 2,
    explanation: "Les cellules de Merkel sont nombreuses dans la peau épaisse des mains et doigts, mobilisées dans la lecture du Braille."
  },
  {
    q: "Quel est le double rôle des cellules de Merkel ?",
    options: [
      "Sensoriel + immunologique",
      "Sensoriel + endocrinien (APUD)",
      "Mécanique + thermique",
      "Sécrétoire + de soutien"
    ],
    correct: 1,
    explanation: "Cellules de Merkel : rôle sensoriel (récepteur) + rôle endocrinien (appartiennent au système APUD)."
  },
  {
    q: "Le corpuscule de Dogiel se trouve dans :",
    options: [
      "La face plantaire des pieds",
      "L'épiderme des organes génitaux",
      "Les muscles squelettiques",
      "Le cuir chevelu"
    ],
    correct: 1,
    explanation: "Le corpuscule de Dogiel siège dans l'épiderme des organes génitaux. Sa fibre nerveuse traverse la capsule du Wagner-Meissner pour se terminer librement."
  },
  {
    q: "L'analgésie congénitale peut être causée par :",
    options: [
      "Une mutation du gène SCN11A bloquant les canaux ioniques",
      "Une production excessive d'endorphine",
      "Les deux",
      "Aucune de ces"
    ],
    correct: 2,
    explanation: "Les 2 causes possibles : excès d'endorphine cérébrale OU mutation du gène SCN11A bloquant la transmission de la douleur."
  },
  {
    q: "Les terminaisons nerveuses libres sont :",
    options: [
      "Fortement myélinisées",
      "Nues (amyéliniques) ou faiblement myélinisées",
      "Toujours encapsulées",
      "Cellulaires"
    ],
    correct: 1,
    explanation: "Les terminaisons libres sont des fibres nues (amyéliniques) ou faiblement myélinisées, situées dans le corps muqueux de Malpighi."
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
