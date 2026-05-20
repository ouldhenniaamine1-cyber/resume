// Petit effet d'apparition au scroll
const cards = document.querySelectorAll('.course-card, .info-card');
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
cards.forEach(c => observer.observe(c));
