// ============================================================
//  Optique & Vision — Script principal
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
  { cat:'dioptrique', q:"Qu'est-ce qu'un dioptre sphérique ?", a:"Portion de sphère séparant deux milieux homogènes d'indices de réfraction différents." },
  { cat:'dioptrique', q:"Diamètre de l'œil ?", a:"24 mm (forme sphérique)." },
  { cat:'dioptrique', q:"Puissance de l'œil réduit de Listing ?", a:"D = +60 dioptries (δ)." },
  { cat:'dioptrique', q:"Indice de réfraction de l'œil ?", a:"Entre 1 et 1,337." },
  { cat:'dioptrique', q:"Axe de l'œil réduit ?", a:"Cornée – Fovéa." },
  { cat:'dioptrique', q:"Où se trouve le foyer image dans l'œil emmétrope ?", a:"Sur la rétine." },
  { cat:'dioptrique', q:"Qu'est-ce que le stigmatisme ?", a:"Un objet ponctuel donne une image ponctuelle." },
  { cat:'dioptrique', q:"Qu'est-ce que l'emmétropie ?", a:"Œil bien proportionné : objet à l'infini → image sur la rétine sans accommodation." },
  { cat:'ametropie', q:"Définition des amétropies ?", a:"Anomalies où l'image n'est plus sur la rétine sans accommodation. Le remotum n'est plus à l'infini." },
  { cat:'ametropie', q:"Où est le foyer image dans la myopie ?", a:"En avant de la rétine (œil trop puissant ou trop long)." },
  { cat:'ametropie', q:"Le myope voit bien de… ?", a:"De près (mal de loin)." },
  { cat:'ametropie', q:"3 causes de myopie ?", a:"Axile (œil trop long), de courbure (cornée trop courbée), d'indice (cristallin, rare)." },
  { cat:'ametropie', q:"Où est le foyer image dans l'hypermétropie ?", a:"En arrière de la rétine (œil trop faible ou trop court)." },
  { cat:'ametropie', q:"L'hypermétrope voit bien de… ?", a:"De loin (mal de près). Compensé par accommodation aux faibles degrés." },
  { cat:'ametropie', q:"Qu'est-ce que l'astigmatisme ?", a:"L'image d'un point ne peut être ponctuelle. Image floue et étalée." },
  { cat:'ametropie', q:"Qu'est-ce que la presbytie ?", a:"Diminution de l'amplitude d'accommodation avec l'âge (perte de plasticité du cristallin)." },
  { cat:'ametropie', q:"Dans la presbytie, qu'arrive-t-il au Proximum ?", a:"Il s'éloigne progressivement. Le Remotum reste à l'infini." },
  { cat:'correction', q:"Correction de la myopie ?", a:"Verres divergents (lentilles concaves) ou chirurgie laser." },
  { cat:'correction', q:"Correction de l'hypermétropie ?", a:"Verres convergents (lentilles convexes)." },
  { cat:'correction', q:"Correction de l'astigmatisme ?", a:"Verres plans cylindriques + correction sphérique associée." },
  { cat:'correction', q:"Correction de la presbytie ?", a:"Verres convergents (pour la vision de près)." },
  { cat:'correction', q:"Longueur d'onde de la lumière visible ?", a:"400 à 800 nm." },
  { cat:'correction', q:"Qu'est-ce que le daltonisme ?", a:"Dyschromatopsie : confusion du rouge et du vert (déficit de cônes)." },
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
  { q:"Puissance de l'œil réduit de Listing ?", options:["+40 δ","+60 δ","+80 δ","+100 δ"], correct:1, explanation:"L'œil réduit de Listing a une puissance de +60 dioptries." },
  { q:"Dans la myopie, le foyer image est :", options:["Sur la rétine","En avant de la rétine","En arrière de la rétine","Au niveau du cristallin"], correct:1, explanation:"Dans la myopie, le foyer image est en avant de la rétine." },
  { q:"Le myope voit bien :", options:["De loin","De près","Ni de loin ni de près","Uniquement les couleurs"], correct:1, explanation:"Le myope voit bien de près et mal de loin." },
  { q:"La myopie est corrigée par :", options:["Verres convergents","Verres divergents","Verres cylindriques","Pas de correction possible"], correct:1, explanation:"La myopie est corrigée par des verres divergents (concaves)." },
  { q:"Dans l'hypermétropie, l'image se forme :", options:["En avant de la rétine","Sur la rétine","En arrière de la rétine","Sur le cristallin"], correct:2, explanation:"L'image se forme en arrière de la rétine dans l'hypermétropie." },
  { q:"La presbytie est due à :", options:["Un œil trop long","Une diminution de la plasticité du cristallin","Un excès de puissance","Une atteinte rétinienne"], correct:1, explanation:"La presbytie est due à la diminution de la plasticité du cristallin avec l'âge." },
  { q:"L'astigmatisme se caractérise par :", options:["Image ponctuelle nette","Image floue étalée (non ponctuelle)","Vision parfaite de loin","Absence de réfraction"], correct:1, explanation:"Dans l'astigmatisme, l'image d'un point ne peut être ponctuelle." },
  { q:"Le stigmatisme signifie :", options:["Image floue","Objet ponctuel → image ponctuelle","Absence de vision","Défaut de couleur"], correct:1, explanation:"Le stigmatisme = un objet ponctuel donne une image ponctuelle." },
  { q:"Longueur d'onde de la lumière visible ?", options:["100-200 nm","400-800 nm","800-1200 nm","1-10 μm"], correct:1, explanation:"La lumière visible a une longueur d'onde entre 400 et 800 nm." },
  { q:"Le daltonisme est une confusion entre :", options:["Bleu et jaune","Rouge et vert","Noir et blanc","Toutes les couleurs"], correct:1, explanation:"Le daltonisme s'accompagne d'une confusion du rouge et du vert." },
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
