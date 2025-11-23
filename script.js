// Marca automaticamente a página atual no menu
const links = document.querySelectorAll("nav a");
links.forEach(link => {
  if (link.href === window.location.href) {
    link.classList.add("active");
  }
});

// Animação suave nos cards ao aparecer
const cards = document.querySelectorAll(".card");
cards.forEach((card, i) => {
  card.style.opacity = 0;
  card.style.transform = "translateY(20px)";
  setTimeout(() => {
    card.style.transition = "0.5s";
    card.style.opacity = 1;
    card.style.transform = "translateY(0)";
  }, 150 * i);
});
