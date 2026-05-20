// ============================================================
//  ORGANES DES SENS (Olfaction & Gustation) — script
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
  { cat: 'general', q: "Qu'est-ce qu'un organe des sens ?", a: "Un récepteur sensoriel formé de cellules capables de capter une information et de la transmettre aux centres nerveux sous forme d'influx nerveux." },
  { cat: 'general', q: "Les 5 types de récepteurs sensoriels ?", a: "Mécanorécepteurs (pression/traction), thermorécepteurs (température), photorécepteurs (lumière), chémorécepteurs (saveur, odeurs), nocirécepteurs (douleur)." },
  { cat: 'general', q: "Les 3 sortes d'éléments d'un organe des sens ?", a: "1) Cellules sensorielles principales (nerveuses), 2) cellules sensorielles accessoires (pseudo-sensorielles, épithéliales), 3) cellules de soutien (épithéliales)." },
  { cat: 'general', q: "Où peuvent être situées les cellules sensorielles principales ?", a: "Soit superficiellement (cellules neurosensorielles, siège épithélial), soit profondément dans un ganglion nerveux." },
  { cat: 'general', q: "Qu'est-ce qu'un organe primaire ?", a: "Un organe où le neurone sensoriel est récepteur, placé au sein d'un épithélium. Exemple : épithélium olfactif." },
  { cat: 'general', q: "Qu'est-ce qu'un organe secondaire ?", a: "Articulation de 2 neurones. Corps des neurones sensoriels dans un ganglion cérébro-spinal, dendrites en contact avec une cellule sensorielle accessoire. Exemples : bourgeons du goût, audition, équilibration, peau." },
  { cat: 'general', q: "Qu'est-ce qu'un organe tertiaire ?", a: "Articulation de 3 neurones, en continuité avec une structure encéphalique. Exemple : la rétine visuelle (¢ à cônes/bâtonnets → bipolaires → multipolaires)." },

  { cat: 'olf', q: "Quel est le seul organe des sens primaire ?", a: "L'organe de l'olfaction (muqueuse olfactive)." },
  { cat: 'olf', q: "Où est localisée la muqueuse olfactive ?", a: "Sur la lame criblée de l'ethmoïde (face inférieure), région supérieure de la cloison nasale, partie moyenne du cornet supérieur. Elle réalise la 'tâche jaune'." },
  { cat: 'olf', q: "Quelle est l'épaisseur de l'épithélium olfactif ?", a: "60 µm." },
  { cat: 'olf', q: "Les 3 types cellulaires de l'épithélium olfactif ?", a: "Cellules nerveuses olfactives, cellules de soutien, cellules basales." },
  { cat: 'olf', q: "Caractéristiques des cellules nerveuses olfactives ?", a: "Neurones bipolaires : bâtonnet olfactif apical → vésicule olfactive avec 6-8 cils ; corps cellulaire ovoïde 7-9 µm ; axone = filet olfactif (0.5 µm). Durée de vie : 30-60 jours." },
  { cat: 'olf', q: "Combien de cils porte la vésicule olfactive ?", a: "6 à 8 cils olfactifs." },
  { cat: 'olf', q: "Rôle des cellules de soutien dans la muqueuse olfactive ?", a: "Synthèse d'un pigment jaunâtre (rétinal + carotène — d'où la couleur jaune brun de la muqueuse) et phagocytose des cellules sensorielles vieillies." },
  { cat: 'olf', q: "Pourquoi les cellules basales sont-elles particulières ?", a: "Elles sont neurogènes : elles permettent le renouvellement des neurones olfactifs. Les neurones olfactifs sont les SEULS neurones capables de régénération !" },
  { cat: 'olf', q: "Que sécrètent les glandes de Bowman ?", a: "OBP (Odorant Binding Protein) qui fixe les substances odorantes, lysozyme (défense), IgA (par les plasmocytes du chorion)." },
  { cat: 'olf', q: "Trajet des axones des cellules olfactives ?", a: "Filets olfactifs → franchissent la lame criblée de l'ethmoïde → bulbe olfactif → synapse avec ¢ à panache et mitrales → 5e circonvolution temporale." },
  { cat: 'olf', q: "Mécanisme de la transduction olfactive ?", a: "Substances odorantes transportées par OBP → cils olfactifs → dissolution dans sécrétions des Bowman → ouverture des canaux ioniques → dépolarisation → influx nerveux." },

  { cat: 'gus', q: "Quel est l'organe de la gustation ?", a: "Les bourgeons du goût (≈ 3000 chez l'Homme)." },
  { cat: 'gus', q: "Où siègent principalement les bourgeons du goût ?", a: "Au niveau des papilles caliciformes du V lingual et des papilles fongiformes. Aussi isolés dans la muqueuse bucco-pharyngée (palais, pharynx, épiglotte)." },
  { cat: 'gus', q: "Dimensions et structure d'un bourgeon du goût ?", a: "Formation intra-épithéliale ovoïde, 80 µm de haut sur 40 µm de large, faite d'environ 50 cellules associées en lamelles d'un bulbe d'oignon. Pore gustatif et canal gustatif (4 µm) à l'apex." },
  { cat: 'gus', q: "Les 2 types cellulaires d'un bourgeon (en MO) ?", a: "Cellules de soutien (volumineuses, noyau vésiculeux) et cellules gustatives (fusiformes, bâtonnet/cil gustatif)." },
  { cat: 'gus', q: "Durée de vie des cellules gustatives ?", a: "10 à 14 jours." },
  { cat: 'gus', q: "Innervation des bourgeons du goût ?", a: "Nerf facial (VII) pour la partie antérieure de la langue, nerf glosso-pharyngien (IX) pour la partie postérieure. Fibres amyéliniques en synapse avec les cellules gustatives." },
  { cat: 'gus', q: "La différenciation des cellules gustatives est ?", a: "Neurogène — section du nerf glosso-pharyngien provoque la dégénérescence des bourgeons, qui réapparaissent après régénération nerveuse." },
  { cat: 'gus', q: "Les 4 saveurs et leur localisation préférentielle ?", a: "Sucré : pointe de la langue · Acide : bords · Amer : partie postérieure · Salé : toute la surface." },
  { cat: 'gus', q: "Que sécrètent les glandes de Von Ebner ?", a: "L'ébnerine (protéine de 1290 acides aminés) qui capte les molécules et les transporte aux bourgeons du goût." },

  { cat: 'patho', q: "Qu'est-ce que l'anosmie ?", a: "Une perte de l'odorat. Causes : traumatismes, infections (rhinite), génétique, congénitale, ou Covid-19." },
  { cat: 'patho', q: "Comment le SARS-CoV-2 cause-t-il l'anosmie ?", a: "Il provoque un gonflement de la muqueuse empêchant les molécules d'arriver aux récepteurs, et peut attaquer directement les cils des cellules sensorielles." },
  { cat: 'patho', q: "Qu'est-ce que l'agueusie ?", a: "Impossibilité de percevoir le goût d'une substance déposée sur la langue. Peut être partielle (1-2 saveurs) ou totale." },
  { cat: 'patho', q: "Causes possibles de l'agueusie ?", a: "Lésion du nerf glosso-pharyngien, paralysie faciale, vieillissement, infections respiratoires hautes, stomatites, tabagisme, cancers, médicaments." }
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
    q: "Quel est le seul organe des sens primaire ?",
    options: ["La rétine visuelle", "L'oreille interne", "La muqueuse olfactive", "Les bourgeons du goût"],
    correct: 2,
    explanation: "La muqueuse olfactive est le seul organe primaire — son neurone est directement récepteur dans l'épithélium."
  },
  {
    q: "Combien de neurones articulés dans un organe tertiaire ?",
    options: ["1", "2", "3", "4"],
    correct: 2,
    explanation: "Un organe tertiaire articule 3 neurones — exemple : la rétine (¢ à cônes/bâtonnets → bipolaires → multipolaires)."
  },
  {
    q: "Le bourgeon du goût est :",
    options: [
      "Un organe primaire",
      "Un organe secondaire",
      "Un organe tertiaire",
      "Aucune des deux"
    ],
    correct: 1,
    explanation: "Le bourgeon du goût est un organe secondaire (2 neurones articulés)."
  },
  {
    q: "Combien de cils possède la vésicule olfactive ?",
    options: ["2 à 4", "6 à 8", "10 à 12", "20 à 30"],
    correct: 1,
    explanation: "La vésicule olfactive est munie de 6 à 8 cils olfactifs."
  },
  {
    q: "Durée de vie des cellules nerveuses olfactives :",
    options: ["7 jours", "10-14 jours", "30-60 jours", "Toute la vie"],
    correct: 2,
    explanation: "Les cellules nerveuses olfactives ont une durée de vie de 30 à 60 jours."
  },
  {
    q: "Particularité unique des cellules basales olfactives :",
    options: [
      "Elles sont musculaires",
      "Elles sécrètent du mucus",
      "Elles permettent la régénération des neurones olfactifs",
      "Elles produisent des hormones"
    ],
    correct: 2,
    explanation: "Les cellules basales sont neurogènes — les neurones olfactifs sont les SEULS neurones capables de régénération."
  },
  {
    q: "Que signifie OBP (sécrété par les glandes de Bowman) ?",
    options: [
      "Olfactif Binding Pigment",
      "Odorant Binding Protein",
      "Olfaction Basal Peptide",
      "Organic Binding Protein"
    ],
    correct: 1,
    explanation: "OBP = Odorant Binding Protein — protéine qui fixe les substances odorantes."
  },
  {
    q: "Combien y a-t-il de bourgeons du goût chez l'Homme ?",
    options: ["~ 100", "~ 1000", "~ 3000", "~ 10 000"],
    correct: 2,
    explanation: "Il y a environ 3000 bourgeons du goût chez l'Homme."
  },
  {
    q: "Dimensions d'un bourgeon du goût :",
    options: [
      "10 × 5 µm",
      "80 × 40 µm",
      "200 × 100 µm",
      "1 mm × 0.5 mm"
    ],
    correct: 1,
    explanation: "Un bourgeon du goût mesure 80 µm de haut sur 40 µm de large."
  },
  {
    q: "Quel nerf innerve la partie postérieure de la langue ?",
    options: [
      "Nerf facial (VII)",
      "Nerf trijumeau (V)",
      "Nerf glosso-pharyngien (IX)",
      "Nerf vague (X)"
    ],
    correct: 2,
    explanation: "Le nerf glosso-pharyngien (IX) innerve la partie postérieure ; le facial (VII) innerve l'antérieur."
  },
  {
    q: "Durée de vie des cellules gustatives :",
    options: ["3-4 jours", "10-14 jours", "30 jours", "1 an"],
    correct: 1,
    explanation: "Les cellules réceptrices du goût ont une durée de vie de 10 à 14 jours."
  },
  {
    q: "Où se perçoit majoritairement la saveur amer ?",
    options: [
      "À la pointe de la langue",
      "Sur les bords",
      "À la partie postérieure",
      "Sur tout l'épithélium"
    ],
    correct: 2,
    explanation: "L'amer est perçu principalement à la partie postérieure de la langue."
  },
  {
    q: "Quelle protéine est sécrétée par les glandes de Von Ebner ?",
    options: [
      "L'OBP",
      "Le lysozyme",
      "L'ébnerine",
      "Les IgA"
    ],
    correct: 2,
    explanation: "Les glandes de Von Ebner sécrètent l'ébnerine (1290 acides aminés) qui capte les molécules et les transporte aux bourgeons du goût."
  },
  {
    q: "L'anosmie en Covid-19 est due à :",
    options: [
      "Une mutation génétique",
      "Un gonflement de la muqueuse + attaque des cils",
      "Une déshydratation",
      "Une carence en vitamine A"
    ],
    correct: 1,
    explanation: "Le SARS-CoV-2 provoque un gonflement empêchant les molécules d'atteindre les récepteurs et peut attaquer directement les cils."
  },
  {
    q: "L'agueusie peut être causée par :",
    options: [
      "Une lésion du nerf glosso-pharyngien",
      "Une paralysie faciale",
      "Le tabagisme et certains médicaments",
      "Toutes ces réponses"
    ],
    correct: 3,
    explanation: "Toutes ces causes sont possibles : lésion IX, paralysie faciale, vieillissement, tabagisme, cancers, médicaments."
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
