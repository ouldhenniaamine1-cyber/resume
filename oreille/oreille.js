// ============================================================
//  Oreille — Audition & Équilibration — Script principal
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
  { cat:'externe', q:"Quelles sont les 3 parties de l'oreille ?", a:"Oreille externe (pavillon, conduit, tympan), oreille moyenne (caisse du tympan, osselets), oreille interne (labyrinthe osseux et membraneux)." },
  { cat:'externe', q:"Quel nerf est responsable de l'audition ?", a:"Le nerf cochléaire (branche du VIIIème nerf crânien)." },
  { cat:'externe', q:"Quel nerf est responsable de l'équilibration ?", a:"Le nerf vestibulaire (branche du VIIIème nerf crânien)." },
  { cat:'externe', q:"Quelle est la structure histologique du pavillon ?", a:"Lame cartilagineuse + peau fine, lisse, presque dépourvue de poils." },
  { cat:'externe', q:"Quelle est la longueur du conduit auditif externe ?", a:"Environ 2,5 cm." },
  { cat:'externe', q:"Quel type d'épithélium revêt le conduit auditif externe ?", a:"Épithélium malpighien kératinisé avec glandes sébacées et glandes cérumineuses." },
  { cat:'externe', q:"Qu'est-ce que le cérumen ?", a:"Enduit pigmenté formé par le mélange de la sécrétion des glandes cérumineuses (grasse, cireuse) et du sébum." },
  { cat:'externe', q:"Quelles sont les 3 couches du tympan (dehors en dedans) ?", a:"1) Épithélium malpighien kératinisé (sans annexes), 2) Partie conjonctive (fibres circulaires internes + radiaires externes), 3) Épithélium pavimenteux simple (tympanique)." },
  { cat:'moyenne', q:"Que contient l'oreille moyenne ?", a:"La caisse du tympan et le système tympano-ossiculaire." },
  { cat:'moyenne', q:"Quel est le rôle de la trompe d'Eustache ?", a:"Faire communiquer la caisse du tympan avec le pharynx → égaliser les pressions sur les deux faces du tympan." },
  { cat:'moyenne', q:"Quels sont les 3 osselets de l'oreille moyenne ?", a:"Le marteau, l'enclume et l'étrier (de dehors en dedans)." },
  { cat:'moyenne', q:"Quels muscles maintiennent la chaîne ossiculaire ?", a:"Le tensor tympani et le stapédius." },
  { cat:'moyenne', q:"Qu'est-ce que la fenêtre ovale ?", a:"Orifice obturé par la platine de l'étrier, mettant l'oreille moyenne en contact avec l'oreille interne." },
  { cat:'moyenne', q:"Qu'est-ce que la fenêtre ronde ?", a:"Orifice fermé par une membrane souple, permettant l'amortissement des vibrations." },
  { cat:'interne', q:"Quelle est la composition de l'endolymphe ?", a:"Riche en potassium (K⁺) et pauvre en sodium (Na⁺)." },
  { cat:'interne', q:"Quelle est la composition de la périlymphe ?", a:"Identique au LCR : riche en sodium (Na⁺) et pauvre en potassium (K⁺)." },
  { cat:'interne', q:"Qui sécrète l'endolymphe ?", a:"La strie vasculaire de la cochlée." },
  { cat:'interne', q:"Qu'est-ce que l'hélicotrème ?", a:"Petit orifice au sommet de la cochlée faisant communiquer la rampe tympanique et la rampe vestibulaire." },
  { cat:'interne', q:"Quelle est la forme du canal cochléaire en coupe ?", a:"Triangulaire." },
  { cat:'interne', q:"Qu'est-ce que la membrane de Reissner ?", a:"Membrane séparant le canal cochléaire de la rampe vestibulaire (en haut)." },
  { cat:'corti', q:"Qu'est-ce que la membrana tectoria ?", a:"Structure fibreuse géliforme, acellulaire, riche en protéoglycanes, reposant sur le pôle apical des cellules de Corti. Seuls les stéréocils les plus longs des CCE y sont liés." },
  { cat:'corti', q:"Que contiennent les piliers de Corti ?", a:"Un volumineux trousseau de microfilaments d'actine F (cellules de soutien)." },
  { cat:'corti', q:"Quel est le rôle des cellules de Deiters ?", a:"Soutenir les cellules sensorielles. Leur prolongement (phalange) forme la membrane réticulaire qui maintient le pôle apical des cellules sensorielles." },
  { cat:'corti', q:"Combien de CCI et CCE ?", a:"≈ 3 500 CCI (piriformes) et ≈ 12 000 CCE (cylindriques)." },
  { cat:'corti', q:"Disposition des stéréocils des CCI vs CCE ?", a:"CCI : 2 rangées en courbe ouverte à concavité interne. CCE : 3-4 rangées en W ouvert à pointe externe." },
  { cat:'corti', q:"Quel % des fibres afférentes va aux CCI ?", a:"95% des 30 000 fibres afférentes sont destinées aux CCI, seulement 5% aux CCE." },
  { cat:'corti', q:"Quels sont les relais des voies auditives ?", a:"Bulbe → thalamus (corps genouillé interne) → cortex temporal." },
  { cat:'equilibre', q:"Où se trouvent les macules vestibulaires ?", a:"Dans l'utricule et le saccule." },
  { cat:'equilibre', q:"Que contient la membrane otolithique ?", a:"Substance gélatineuse avec fines fibrilles et cristaux de carbonate de calcium (otolithes/statoconies) en surface." },
  { cat:'equilibre', q:"Quelle est la forme des cellules vestibulaires de type I ?", a:"En forme de vase, avec base arrondie et zone apicale étranglée puis dilatée." },
  { cat:'equilibre', q:"Comment sont innervées les cellules de type I ?", a:"Par un calice nerveux (terminaison dendritique englobante du ganglion de Scarpa)." },
  { cat:'equilibre', q:"Comment sont innervées les cellules de type II ?", a:"Par des boutons synaptiques dispersés (fibres afférentes + efférentes) au pôle basal." },
  { cat:'equilibre', q:"Qu'est-ce que la cupule ?", a:"Analogue de la membrane otolithique dans les crêtes ampullaires, mais SANS otolithes. Masse géliforme riche en GAG." },
  { cat:'equilibre', q:"Que détecte la macule utriculaire ?", a:"Les accélérations linéaires dans un plan horizontal (tête verticale)." },
  { cat:'equilibre', q:"Que détecte la macule sacculaire ?", a:"Les accélérations linéaires verticales, y compris la pesanteur." },
  { cat:'equilibre', q:"Que détectent les crêtes ampullaires ?", a:"Les accélérations angulaires (rotations de la tête)." },
  { cat:'equilibre', q:"Quand l'activité des cellules vestibulaires augmente-t-elle ?", a:"Lorsque les stéréocils sont inclinés en direction du kinétocil (cil vibratile)." },
  { cat:'equilibre', q:"Où se fait le premier relais des voies vestibulaires ?", a:"Dans les noyaux vestibulaires bulbaires." },
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
  { q:"L'oreille est logée dans quel os ?", options:["Os frontal","Rocher du temporal","Os pariétal","Os sphénoïde"], correct:1, explanation:"L'oreille est logée à l'intérieur du rocher du temporal." },
  { q:"Quel type d'épithélium revêt le conduit auditif externe ?", options:["Pavimenteux simple","Cylindrique cilié","Malpighien kératinisé","Pseudostratifié"], correct:2, explanation:"Le conduit auditif externe est revêtu d'un épithélium malpighien kératinisé." },
  { q:"La trompe d'Eustache fait communiquer la caisse du tympan avec :", options:["L'oreille interne","Le pharynx","La fosse nasale","Le larynx"], correct:1, explanation:"La trompe d'Eustache fait communiquer la caisse du tympan avec le pharynx." },
  { q:"L'endolymphe est riche en :", options:["Sodium","Calcium","Potassium","Chlore"], correct:2, explanation:"L'endolymphe a une teneur élevée en potassium et faible en sodium." },
  { q:"Qui sécrète l'endolymphe ?", options:["La membrane de Reissner","Le ligament spiral","La strie vasculaire","L'organe de Corti"], correct:2, explanation:"L'endolymphe est sécrétée par la strie vasculaire de la cochlée." },
  { q:"L'hélicotrème fait communiquer :", options:["Le canal cochléaire et la rampe vestibulaire","La rampe tympanique et la rampe vestibulaire","L'utricule et le saccule","L'oreille moyenne et interne"], correct:1, explanation:"L'hélicotrème est un orifice au sommet de la cochlée faisant communiquer les deux rampes périlymphatiques." },
  { q:"Combien de cellules ciliées externes (CCE) environ ?", options:["3 500","12 000","30 000","1 000"], correct:1, explanation:"Il y a environ 12 000 CCE et 3 500 CCI." },
  { q:"Les stéréocils des CCE sont disposés en :", options:["2 rangées en courbe","3-4 rangées en W","1 seule rangée","5 rangées parallèles"], correct:1, explanation:"Les CCE ont 3 ou 4 rangées de stéréocils formant un W ouvert à pointe externe." },
  { q:"Quel pourcentage des fibres afférentes est destiné aux CCI ?", options:["5%","50%","75%","95%"], correct:3, explanation:"95% des 30 000 fibres afférentes sont destinées aux CCI." },
  { q:"Les voies auditives se projettent sur :", options:["Le cortex frontal","Le cortex temporal","Le cortex occipital","Le cervelet"], correct:1, explanation:"Les voies auditives font relais dans le bulbe, le thalamus puis se projettent sur le cortex temporal." },
  { q:"Les cellules vestibulaires de type I sont innervées par :", options:["Des boutons synaptiques dispersés","Un calice nerveux","Des fibres efférentes uniquement","Des synapses en ruban"], correct:1, explanation:"Les cellules de type I sont enchâssées dans un calice nerveux (terminaison dendritique du ganglion de Scarpa)." },
  { q:"La membrane otolithique contient des cristaux de :", options:["Phosphate de calcium","Carbonate de calcium","Oxalate de calcium","Sulfate de calcium"], correct:1, explanation:"La membrane otolithique contient des cristaux de carbonate de calcium (otolithes/statoconies)." },
  { q:"La macule utriculaire détecte les accélérations :", options:["Angulaires","Linéaires verticales","Linéaires horizontales","Gravitationnelles uniquement"], correct:2, explanation:"La macule utriculaire réagit aux accélérations dirigées dans un plan horizontal." },
  { q:"Les crêtes ampullaires sont stimulées par :", options:["Les accélérations linéaires","La pesanteur","Les accélérations angulaires","Les vibrations sonores"], correct:2, explanation:"Les crêtes ampullaires sont stimulées par les accélérations angulaires (rotations)." },
  { q:"La cupule des crêtes ampullaires diffère de la membrane otolithique car elle :", options:["Contient plus d'otolithes","Ne contient pas d'otolithes","Est plus épaisse","Contient des cellules"], correct:1, explanation:"La cupule est semblable à la membrane otolithique mais ne contient pas d'otolithes." },
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