// Éléments communs heure/date
const timeHomeEl = document.querySelector(".widget-clock-time");
const dateHomeEl = document.querySelector(".widget-clock-date");

const lsTimeSmallEl = document.querySelector(".ls-time-small");
const lsTimeBigEl = document.querySelector(".ls-time-big");
const lsDateEl = document.querySelector(".ls-date");

// Fonction pour mettre à jour l'heure + la date sur tous les écrans
function updateClock() {
  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const timeStr = `${hours}:${minutes}`;

  // Date en français
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  const formattedDate = now.toLocaleDateString("fr-FR", options);
  const formattedDateCapitalized =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  // Home widget
  if (timeHomeEl) timeHomeEl.textContent = timeStr;
  if (dateHomeEl) dateHomeEl.textContent = formattedDateCapitalized;

  // Lock screen
  if (lsTimeSmallEl) lsTimeSmallEl.textContent = timeStr;
  if (lsTimeBigEl) lsTimeBigEl.textContent = timeStr;
  if (lsDateEl) lsDateEl.textContent = formattedDateCapitalized;
}

// Appel immédiat + toutes les secondes
updateClock();
setInterval(updateClock, 1000);

// --------- LOCK SCREEN / DÉVERROUILLAGE ---------
const lockScreen = document.getElementById("lockScreen");
const homeScreen = document.getElementById("homeScreen");
const homeIndicator = document.getElementById("homeIndicator");

let isSwiping = false;
let swipeStartY = 0;

function beginSwipe(y) {
  isSwiping = true;
  swipeStartY = y;
}

function moveSwipe(y) {
  if (!isSwiping) return;
  const delta = swipeStartY - y; // vers le haut = positif
  const clamped = Math.max(0, Math.min(delta, 100)); // limité
  lockScreen.style.transform = `translateY(${-clamped}px)`;
  lockScreen.style.opacity = String(1 - clamped / 120);
}

function endSwipe(y) {
  if (!isSwiping) return;
  isSwiping = false;
  const delta = swipeStartY - y;

  if (delta > 50) {
    // déverrouille
    unlockPhone();
  } else {
    // revient à la position initiale
    lockScreen.style.transform = "";
    lockScreen.style.opacity = "";
  }
}

function unlockPhone() {
  lockScreen.style.transition = "transform 0.25s ease-out, opacity 0.25s ease-out";
  lockScreen.style.transform = "translateY(-120px)";
  lockScreen.style.opacity = "0";

  setTimeout(() => {
    lockScreen.style.display = "none";
    lockScreen.style.transition = "";
    lockScreen.style.transform = "";
    lockScreen.style.opacity = "";
    homeScreen.classList.add("active");
  }, 220);
}

// Utilisation des Pointer Events pour gérer souris + tactile
if (homeIndicator) {
  homeIndicator.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    homeIndicator.setPointerCapture(e.pointerId);
    beginSwipe(e.clientY);
  });

  homeIndicator.addEventListener("pointermove", (e) => {
    if (!isSwiping) return;
    moveSwipe(e.clientY);
  });

  homeIndicator.addEventListener("pointerup", (e) => {
    endSwipe(e.clientY);
  });

  homeIndicator.addEventListener("pointercancel", (e) => {
    if (!isSwiping) return;
    isSwiping = false;
    lockScreen.style.transform = "";
    lockScreen.style.opacity = "";
  });
}

// Clique simple sur le centre de l'écran pour les PC (fallback rapide)
lockScreen?.addEventListener("dblclick", () => {
  if (lockScreen.style.display !== "none") {
    unlockPhone();
  }
});

// --------- GESTION DES APPS ---------
const appView = document.getElementById("appView");
const appViewTitle = document.getElementById("appViewTitle");
const appViewBody = document.getElementById("appViewBody");
const backButton = document.getElementById("backButton");

// Contenu temporaire par app (placeholder)
function getDummyContentForApp(appKey) {
  switch (appKey) {
    case "messages":
      return `
        <h3>Messages</h3>
        <p>Plus tard ici : liste des conversations, messages RP, etc.</p>
        <ul>
          <li>Contact 1</li>
          <li>Contact 2</li>
          <li>Service système</li>
        </ul>
      `;
    case "contacts":
      return `
        <h3>Contacts</h3>
        <p>Plus tard : contacts stockés par joueur (via la DB).</p>
      `;
    case "bank":
      return `
        <h3>Banque</h3>
        <p>Solde, historique, transferts...</p>
      `;
    case "inventory":
      return `
        <h3>Inventaire</h3>
        <p>Plus tard : affichage des items, poids, actions (utiliser, donner...).</p>
      `;
    case "telegrams":
      return `
        <h3>Télégrammes</h3>
        <p>Envoi et réception de télégrammes.</p>
      `;
    case "notes":
      return `
        <h3>Notes</h3>
        <p>Bloc-notes RP pour les joueurs.</p>
      `;
    case "settings":
      return `
        <h3>Paramètres</h3>
        <p>Thèmes, sonneries, options de compte.</p>
      `;
    case "telephone":
      return `
        <h3>Téléphone</h3>
        <p>Clavier, journal d'appels, appels internes.</p>
      `;
    default:
      return `
        <h3>${appKey}</h3>
        <p>Contenu à définir.</p>
      `;
  }
}

// Ouvrir une app
function openApp(appKey, label) {
  appViewTitle.textContent = label || "App";
  appViewBody.innerHTML = getDummyContentForApp(appKey);

  appView.classList.add("active");
  homeScreen.classList.remove("active");
}

// Fermer une app (retour à l'accueil)
function closeApp() {
  appView.classList.remove("active");
  homeScreen.classList.add("active");
}

backButton?.addEventListener("click", closeApp);

// Clics sur les icônes d'app
const appIcons = document.querySelectorAll(".app-icon");
appIcons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const appKey = btn.getAttribute("data-app") || "inconnue";
    const label =
      btn.querySelector(".app-icon-label")?.textContent.trim() || "App";
    openApp(appKey, label);
  });
});

// Clics sur les boutons du dock
const dockButtons = document.querySelectorAll(".dock-app");
dockButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const text = btn.textContent.trim().toLowerCase();
    if (text.includes("home")) {
      closeApp();
    } else {
      alert(`Fonction "${text}" à venir.`);
    }
  });
});
