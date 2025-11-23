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
// main.js - Konami Code -> painel secreto -> valida senha (URL) -> easter egg
(() => {
  // CONFIG
  const SECRET_PASS = "https://www.youtube.com/watch?v=KivZieyf3b0";
  const EGG_IMAGE = "https://media.tenor.com/VlJt2ymlkS8AAAAC/technoblade-technoblade-never-dies.gif";
  const KONAMI = ["arrowup","arrowup","arrowdown","arrowdown","arrowleft","arrowright","arrowleft","arrowright","b","a"];

  // estado
  let buffer = [];
  let unlocked = false;

  // injeta DOM do overlay + egg (apenas uma vez)
  function createSecretDOM(){
    if (document.getElementById("secret-overlay")) return;

    // overlay do painel
    const overlay = document.createElement("div");
    overlay.id = "secret-overlay";
    overlay.innerHTML = `
      <div id="secret-panel" role="dialog" aria-modal="true" aria-label="Área Secreta">
        <h2>Área Restrita — Acesso Secreto</h2>
        <p>Insira a chave para revelar o conteúdo secreto.</p>
        <div id="secret-input">
          <input id="secret-field" type="text" placeholder="Cole a chave aqui (URL)"/>
          <button id="secret-submit">Abrir</button>
        </div>
        <div id="secret-hint">Dica: cole a URL exata como senha.</div>
      </div>
    `;
    document.body.appendChild(overlay);

    // takeover easter egg
    const egg = document.createElement("div");
    egg.id = "egg-takeover";
    egg.innerHTML = `
      <div id="egg-card" role="dialog" aria-modal="true" aria-label="Easter Egg">
        <img id="egg-gif" src="${EGG_IMAGE}" alt="Technoblade Easter Egg">
        <div id="egg-text">
          <div class="glitch" data-text="TECHNOBLADE NEVER DIES">TECHNOBLADE NEVER DIES</div>
          <div id="egg-sub">HERO OF THE ARENA • CROWN THE POTATO</div>
        </div>
        <button id="egg-exit">Sair</button>
      </div>
    `;
    document.body.appendChild(egg);

    // eventos
    const submit = document.getElementById("secret-submit");
    const field = document.getElementById("secret-field");
    submit.addEventListener("click", checkSecret);
    field.addEventListener("keydown", (e) => {
      if (e.key === "Enter") checkSecret();
    });

    // exit
    const exit = document.getElementById("egg-exit");
    exit.addEventListener("click", hideEgg);

    // esc fecha overlay/egg
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        hideOverlay();
        hideEgg();
      }
    });
  }

  // mostra overlay
  function showOverlay(){
    createSecretDOM();
    const ov = document.getElementById("secret-overlay");
    ov.style.display = "flex";
    const panel = document.getElementById("secret-panel");
    if(panel){
      panel.style.transform = "translateY(8px)";
      panel.style.opacity = 0;
      setTimeout(()=>{ panel.style.transition = "0.28s"; panel.style.transform = "translateY(0)"; panel.style.opacity = 1; }, 10);
    }
    const field = document.getElementById("secret-field");
    if(field) field.focus();
  }

  function hideOverlay(){
    const ov = document.getElementById("secret-overlay");
    if(!ov) return;
    const panel = document.getElementById("secret-panel");
    if(panel){
      panel.style.transform = "translateY(10px)";
      panel.style.opacity = 0;
      setTimeout(()=> { ov.style.display = "none"; panel.style.transition = ""; }, 220);
    } else {
      ov.style.display = "none";
    }
  }

  // mostra egg fullscreen
  function showEgg(){
    unlocked = true;
    const eg = document.getElementById("egg-takeover");
    if(!eg) return;
    eg.style.display = "flex";
    document.documentElement.style.overflow = "hidden";
    // força data-text para glitch
    const g = document.querySelector("#egg-text .glitch");
    if(g) g.setAttribute("data-text", g.textContent);
    // animação leve
    eg.animate([{ transform: "scale(0.98)" }, { transform: "scale(1)" }], { duration: 420, easing: "cubic-bezier(.2,.9,.3,1)" });
  }

  function hideEgg(){
    const eg = document.getElementById("egg-takeover");
    if(!eg) return;
    eg.style.display = "none";
    document.documentElement.style.overflow = "";
  }

  // checa senha
  function checkSecret(){
    const field = document.getElementById("secret-field");
    const val = (field && field.value) ? field.value.trim() : "";
    if(val === SECRET_PASS){
      hideOverlay();
      setTimeout(()=> showEgg(), 220);
    } else {
      // shake
      const panel = document.getElementById("secret-panel");
      if(panel){
        panel.animate([
          { transform: "translateX(-8px)" },
          { transform: "translateX(8px)" },
          { transform: "translateX(-6px)" },
          { transform: "translateX(6px)" },
          { transform: "translateX(0)" }
        ], { duration: 420, easing: "ease-in-out" });
      }
      const hint = document.getElementById("secret-hint");
      if(hint){
        hint.textContent = "Senha incorreta — tente novamente.";
        hint.style.color = "#ffb3b3";
        setTimeout(()=> { hint.textContent = "Dica: cole a URL exata como senha."; hint.style.color = ""; }, 1600);
      }
    }
  }

  // detecção do Konami
  function handleKey(e){
    const key = (e.key || "").toLowerCase();
    buffer.push(key);
    if(buffer.length > KONAMI.length) buffer.shift();
    if(buffer.join(",") === KONAMI.join(",")){
      buffer = [];
      if(!unlocked) showOverlay();
    }
  }

  // listeners (inclui clique 5x no #logo como alternativa)
  function attachListeners(){
    window.addEventListener("keydown", handleKey);
    let clickCount = 0;
    const logo = document.getElementById("logo");
    if(logo){
      logo.addEventListener("click", () => {
        clickCount++;
        if(clickCount >= 5 && !unlocked){
          clickCount = 0;
          showOverlay();
        }
        setTimeout(()=> { clickCount = 0; }, 1200);
      });
    }
  }

  // inicializa
  document.addEventListener("DOMContentLoaded", () => {
    createSecretDOM();
    attachListeners();
  });

})();
