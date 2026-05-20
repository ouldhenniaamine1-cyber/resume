// ============================================================
//  Le Son & l'Audition — Script principal
// ============================================================

// ---------- THEME ----------
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

// ---------- SIDEBAR ----------
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
document.addEventListener('click', e => {
  if (window.innerWidth <= 1024 && sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== menuToggle) sidebar.classList.remove('open');
});

// ---------- NAV ----------
document.querySelectorAll('.sidebar a').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); if (window.innerWidth <= 1024) sidebar.classList.remove('open'); }
  });
});
const sections = document.querySelectorAll('[data-section]');
const navLinks = document.querySelectorAll('.sidebar a');
const obs = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { const id = entry.target.id; navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === '#' + id)); } });
}, { rootMargin: '-30% 0px -60% 0px' });
sections.forEach(s => obs.observe(s));

// ---------- PROGRESS ----------
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => { const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100; progressBar.style.width = pct + '%'; });

// ---------- BACK TO TOP ----------
const backTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => backTop.classList.toggle('visible', window.scrollY > 400));
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- SEARCH ----------
const searchInput = document.getElementById('searchInput');
let searchTimeout;
searchInput.addEventListener('input', e => { clearTimeout(searchTimeout); searchTimeout = setTimeout(() => doSearch(e.target.value.trim().toLowerCase()), 200); });
function doSearch(q) {
  document.querySelectorAll('.search-highlight').forEach(el => { const p = el.parentNode; p.replaceChild(document.createTextNode(el.textContent), el); p.normalize(); });
  document.querySelectorAll('[data-section]').forEach(sec => sec.classList.remove('section-hidden'));
  if (!q) return;
  document.querySelectorAll('[data-section]').forEach(sec => { if (!sec.textContent.toLowerCase().includes(q)) sec.classList.add('section-hidden'); });
}

// ============================================================
//  FLASHCARDS
// ============================================================
const flashcards = [
  { cat:'son', q:"Qu'est-ce que le son en acoustique ?", a:"Mouvement périodique des atomes/molécules se propageant dans un milieu matériel (pas dans le vide)." },
  { cat:'son', q:"Domaine des sons audibles ?", a:"Entre 20 Hz et 20 000 Hz (20 kHz)." },
  { cat:'son', q:"L'onde sonore transporte-t-elle de la matière ?", a:"Non, elle transporte uniquement de l'énergie." },
  { cat:'son', q:"Célérité du son dans l'air ?", a:"340 m/s." },
  { cat:'son', q:"Célérité du son dans l'os ?", a:"3 300 m/s." },
  { cat:'son', q:"Célérité du son dans les tissus mous ?", a:"1 540 m/s." },
  { cat:'caract', q:"Définition de la fréquence ν ?", a:"Nombre de répétitions d'un même état vibratoire par unité de temps. ν = 1/T. Unité : Hz." },
  { cat:'caract', q:"Définition de la longueur d'onde λ ?", a:"Plus petite distance séparant deux points ayant le même état vibratoire. λ = c/ν." },
  { cat:'caract', q:"Qu'est-ce que l'amplitude ?", a:"Élongation maximale d'un point à partir de sa position d'équilibre." },
  { cat:'caract', q:"La fréquence change-t-elle d'un milieu à l'autre ?", a:"Non, la fréquence reste constante. Seules la célérité et λ changent." },
  { cat:'caract', q:"Qu'est-ce qu'un son pur ?", a:"Son sinusoïdal et périodique à une seule fréquence. Ex : diapason." },
  { cat:'caract', q:"Différence entre son musical et bruit ?", a:"Son musical : périodique, harmoniques multiples entiers. Bruit : non périodique, pas de fréquence caractéristique." },
  { cat:'caract', q:"Formule de l'intensité sonore en dB ?", a:"I (dB) = 10 × log₁₀(W/W₀) avec W₀ = 10⁻¹² W·m⁻²." },
  { cat:'caract', q:"Gamme des sons audibles en dB ?", a:"0 à 140 dB." },
  { cat:'subjectif', q:"Qu'est-ce que la tonie ?", a:"Qualité permettant de dire qu'un son est grave ou aigu. Dépend de la fréquence." },
  { cat:'subjectif', q:"Qu'est-ce que la sonie ?", a:"Qualité permettant de dire que le son est fort ou faible. Dépend de la puissance surfacique." },
  { cat:'subjectif', q:"Qu'est-ce que le timbre ?", a:"Qualité permettant de reconnaître deux sons de même tonie et sonie émis par des sources différentes. Lié aux harmoniques." },
  { cat:'subjectif', q:"Seuil absolu bas ?", a:"Plus petite puissance acoustique produisant une sensation sonore perceptible." },
  { cat:'subjectif', q:"Seuil douloureux ?", a:"Seuil au-dessus duquel tous les sons donnent la même sensation douloureuse (limite de l'audition)." },
  { cat:'subjectif', q:"Comment fonctionne l'audition binaurale ?", a:"Différence d'intensité (ombre de la tête) + différence de phase → localisation spatiale du son." },
  { cat:'exploration', q:"Épreuve de Weber : surdité de transmission ?", a:"Le son est latéralisé du côté malade." },
  { cat:'exploration', q:"Épreuve de Weber : surdité de perception ?", a:"Le son est latéralisé du côté sain." },
  { cat:'exploration', q:"Rinne négatif signifie ?", a:"CO > CA → surdité de transmission." },
  { cat:'exploration', q:"Rinne positif pathologique signifie ?", a:"CA > CO mais les deux sont diminués → surdité de perception." },
  { cat:'exploration', q:"Qu'est-ce que le PEA ?", a:"Potentiel Évoqué Auditif : étude des réponses cérébrales électriques synchronisées avec des stimulations sonores." },
  { cat:'exploration', q:"Que mesure l'impédancemétrie ?", a:"La compliance du tympan (tympanogramme). Énergie absorbée = incidente − réfléchie." },
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
  if (!currentDeck.length) { flashQ.textContent = 'Aucune carte'; flashA.textContent = '—'; flashCat.textContent = ''; flashCurrent.textContent = '0'; flashTotal.textContent = '0'; return; }
  const card = currentDeck[currentIndex];
  flashQ.textContent = card.q; flashA.textContent = card.a; flashCat.textContent = card.cat;
  flashCurrent.textContent = currentIndex + 1; flashTotal.textContent = currentDeck.length;
  flashcardEl.classList.remove('flipped');
}
flashcardEl.addEventListener('click', () => flashcardEl.classList.toggle('flipped'));
document.getElementById('nextCard').addEventListener('click', () => { if (!currentDeck.length) return; currentIndex = (currentIndex + 1) % currentDeck.length; renderCard(); });
document.getElementById('prevCard').addEventListener('click', () => { if (!currentDeck.length) return; currentIndex = (currentIndex - 1 + currentDeck.length) % currentDeck.length; renderCard(); });
document.getElementById('flashCategory').addEventListener('change', e => { const v = e.target.value; currentDeck = v === 'all' ? [...flashcards] : flashcards.filter(c => c.cat === v); currentIndex = 0; renderCard(); });
document.getElementById('shuffleBtn').addEventListener('click', () => { for (let i = currentDeck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [currentDeck[i], currentDeck[j]] = [currentDeck[j], currentDeck[i]]; } currentIndex = 0; renderCard(); });
renderCard();

// ============================================================
//  QUIZ
// ============================================================
const quizQuestions = [
  { q:"Quelle est la célérité du son dans l'air ?", options:["1540 m/s","340 m/s","3300 m/s","1450 m/s"], correct:1, explanation:"Le son se propage à 340 m/s dans l'air." },
  { q:"L'onde sonore ne se propage pas dans :", options:["L'eau","L'air","Le vide","L'os"], correct:2, explanation:"L'onde sonore nécessite un milieu matériel, elle ne se propage pas dans le vide." },
  { q:"Unité de la fréquence ?", options:["Décibel","Mètre","Hertz","Pascal"], correct:2, explanation:"La fréquence s'exprime en Hertz (Hz)." },
  { q:"Un son pur est caractérisé par :", options:["Plusieurs fréquences","Une seule fréquence","Pas de fréquence","Des harmoniques"], correct:1, explanation:"Un son pur possède une seule fréquence (sinusoïde unique). Ex : diapason." },
  { q:"La formule λ = c/ν donne :", options:["La période","L'amplitude","La longueur d'onde","L'intensité"], correct:2, explanation:"λ (longueur d'onde) = célérité / fréquence." },
  { q:"Le seuil douloureux se situe à environ :", options:["60 dB","100 dB","140 dB","200 dB"], correct:2, explanation:"La gamme audible va de 0 à 140 dB, le seuil douloureux est à ~140 dB." },
  { q:"La tonie dépend principalement de :", options:["L'amplitude","La fréquence","Le timbre","La phase"], correct:1, explanation:"La tonie (grave/aigu) dépend essentiellement de la fréquence." },
  { q:"Le timbre permet de distinguer :", options:["Un son fort d'un son faible","Un son grave d'un son aigu","Deux sources émettant le même son","Un son pur d'un bruit"], correct:2, explanation:"Le timbre permet de reconnaître deux sons de même tonie et sonie émis par des sources différentes." },
  { q:"Weber latéralisé du côté malade indique :", options:["Surdité de perception","Surdité centrale","Surdité de transmission","Audition normale"], correct:2, explanation:"Dans la surdité de transmission unilatérale, le Weber est latéralisé du côté malade." },
  { q:"Rinne négatif (CO > CA) signifie :", options:["Audition normale","Surdité de perception","Surdité de transmission","Surdité centrale"], correct:2, explanation:"Rinne négatif = CO > CA = surdité de transmission." },
  { q:"Le PEA est une méthode :", options:["Subjective","Objective","Clinique simple","D'imagerie"], correct:1, explanation:"Le PEA (Potentiel Évoqué Auditif) est une méthode objective indépendante de la coopération du patient." },
  { q:"L'impédancemétrie examine :", options:["Le nerf auditif","La compliance du tympan","Le cortex auditif","La cochlée"], correct:1, explanation:"L'impédancemétrie (tympanogramme) examine la compliance du tympan." },
];

const quizContainer = document.getElementById('quizContainer');
const userAnswers = {};

function renderQuiz() {
  quizContainer.innerHTML = '';
  Object.keys(userAnswers).forEach(k => delete userAnswers[k]);
  quizQuestions.forEach((q, qi) => {
    const div = document.createElement('div');
    div.className = 'quiz-question'; div.dataset.qi = qi;
    div.innerHTML = `<h4>Q${qi+1}. ${q.q}</h4><div class="quiz-options">${q.options.map((opt, oi) => `<label class="quiz-option" data-oi="${oi}"><input type="radio" name="q${qi}" value="${oi}"><span>${String.fromCharCode(65+oi)}. ${opt}</span></label>`).join('')}</div><div class="quiz-feedback"></div>`;
    quizContainer.appendChild(div);
    div.querySelectorAll('.quiz-option').forEach(opt => { opt.addEventListener('click', () => { div.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected')); opt.classList.add('selected'); userAnswers[qi] = parseInt(opt.dataset.oi); }); });
  });
}

function gradeQuiz() {
  let score = 0;
  quizQuestions.forEach((q, qi) => {
    const div = quizContainer.querySelector(`[data-qi="${qi}"]`);
    const fb = div.querySelector('.quiz-feedback');
    const userA = userAnswers[qi];
    div.querySelectorAll('.quiz-option').forEach((opt, oi) => { opt.classList.remove('correct-answer','wrong-answer'); if (oi === q.correct) opt.classList.add('correct-answer'); if (userA === oi && oi !== q.correct) opt.classList.add('wrong-answer'); });
    if (userA === q.correct) { score++; div.classList.remove('incorrect'); div.classList.add('correct'); } else { div.classList.remove('correct'); div.classList.add('incorrect'); }
    fb.classList.add('show');
    fb.innerHTML = `<strong>${userA === q.correct ? '✅ Correct' : '❌ Incorrect'}</strong> — ${q.explanation}`;
  });
  const result = document.getElementById('quizResult');
  result.classList.remove('hidden');
  const pct = Math.round((score / quizQuestions.length) * 100);
  let comment = pct === 100 ? '🏆 Parfait !' : pct >= 80 ? '🎉 Excellent !' : pct >= 60 ? '👍 Bien !' : pct >= 40 ? '📚 À retravailler.' : '💪 Courage !';
  result.innerHTML = `<h3>${comment}</h3><div class="quiz-score">${score} / ${quizQuestions.length}</div><p>Score : <strong>${pct}%</strong></p>`;
  result.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

document.getElementById('submitQuiz').addEventListener('click', () => { if (Object.keys(userAnswers).length < quizQuestions.length) { if (!confirm(`Tu n'as répondu qu'à ${Object.keys(userAnswers).length} questions sur ${quizQuestions.length}. Soumettre ?`)) return; } gradeQuiz(); });
document.getElementById('resetQuiz').addEventListener('click', () => { document.getElementById('quizResult').classList.add('hidden'); renderQuiz(); });
renderQuiz();
