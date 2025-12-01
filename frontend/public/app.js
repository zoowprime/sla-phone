// ---- Sélection des éléments pour l'heure/date ----
const lockTimeTop = document.querySelector(".ls-time-top");
const lockTimeBig = document.querySelector(".ls-time-big");
const lockDateEl = document.querySelector(".ls-date");

const homeTimeTop = document.querySelector(".hs-time-top");

// Fonction mise à jour de l'heure + date
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const timeStr = `${hours}:${minutes}`;

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  const formatted = now.toLocaleDateString("fr-FR", options);
  const dateStr = formatted.charAt(0).toLowerCase() + formatted.slice(1);

  if (lockTimeTop) lockTimeTop.textContent = timeStr;
  if (lockTimeBig) lockTimeBig.textContent = timeStr;
  if (lockDateEl) lockDateEl.textContent = dateStr;

  if (homeTimeTop) homeTimeTop.textContent = timeStr;
}

updateClock();
setInterval(updateClock, 1000);

// ---- Gestion déverrouillage par swipe ----
const lockScreen = document.getElementById("lockScreen");
const homeScreen = document.getElementById("homeScreen");
const homeIndicator = document.getElementById("homeIndicator");

let isSwiping = false;
let swipeStartY = 0;

function startSwipe(y) {
  isSwiping = true;
  swipeStartY = y;
}

function moveSwipe(y) {
  if (!isSwiping || !lockScreen) return;
  const delta = swipeStartY - y; // positif = vers le haut
  const clamped = Math.max(0, Math.min(delta, 120));

  lockScreen.style.transform = `translateY(${-clamped}px)`;
  lockScreen.style.opacity = String(1 - clamped / 140);
}

function endSwipe(y) {
  if (!isSwiping || !lockScreen) return;
  isSwiping = false;

  const delta = swipeStartY - y;
  if (delta > 60) {
    unlockPhone();
  } else {
    lockScreen.style.transition =
      "transform 0.18s ease-out, opacity 0.18s ease-out";
    lockScreen.style.transform = "";
    lockScreen.style.opacity = "";
    setTimeout(() => {
      lockScreen.style.transition = "";
    }, 200);
  }
}

function unlockPhone() {
  if (!lockScreen || !homeScreen) return;

  lockScreen.style.transition =
    "transform 0.22s ease-out, opacity 0.22s ease-out";
  lockScreen.style.transform = "translateY(-140px)";
  lockScreen.style.opacity = "0";

  setTimeout(() => {
    lockScreen.style.display = "none";
    lockScreen.style.transition = "";
    lockScreen.style.transform = "";
    lockScreen.style.opacity = "";
    homeScreen.classList.add("active");
  }, 200);
}

// Pointer events pour souris + tactile
if (homeIndicator) {
  homeIndicator.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    homeIndicator.setPointerCapture(e.pointerId);
    startSwipe(e.clientY);
  });

  homeIndicator.addEventListener("pointermove", (e) => {
    if (!isSwiping) return;
    moveSwipe(e.clientY);
  });

  homeIndicator.addEventListener("pointerup", (e) => {
    endSwipe(e.clientY);
  });

  homeIndicator.addEventListener("pointercancel", () => {
    isSwiping = false;
    if (lockScreen) {
      lockScreen.style.transform = "";
      lockScreen.style.opacity = "";
    }
  });
}

// Double clic sur la partie centrale pour PC (fallback rapide)
lockScreen?.addEventListener("dblclick", () => {
  if (lockScreen.style.display !== "none") {
    unlockPhone();
  }
});

// ---- Gestion des apps (ouverture vue app) ----
const appView = document.getElementById("appView");
const appViewTitle = document.getElementById("appViewTitle");
const appViewBody = document.getElementById("appViewBody");
const backButton = document.getElementById("backButton");

function getDummyContentForApp(appKey) {
  switch (appKey) {
    case "settings":
      return "<h3>Settings</h3><p>Réglages du téléphone (à connecter plus tard).</p>";
    case "apps":
      return "<h3>Apps</h3><p>Gestion des applications et services.</p>";
    case "clock":
      return "<h3>Clock</h3><p>Horloge, alarmes, minuteur...</p>";
    case "mail":
      return "<h3>Mail</h3><p>Boîte mail intégrée.</p>";
    case "weather":
      return "<h3>Weather</h3><p>Météo locale.</p>";
    case "browser":
      return "<h3>Browser</h3><p>Navigateur web.</p>";
    case "wallet":
      return "<h3>Wallet</h3><p>Paiements, cartes, etc.</p>";
    case "garage":
      return "<h3>Garage</h3><p>Gestion des véhicules.</p>";
    case "home":
      return "<h3>Home</h3><p>Maison et domotique.</p>";
    case "maps":
      return "<h3>Maps</h3><p>Cartes et navigation.</p>";
    case "notes":
      return "<h3>Notes</h3><p>Bloc-notes.</p>";
    case "calculator":
      return "<h3>Calculator</h3><p>Calculatrice.</p>";
    case "voice":
      return "<h3>Voice Memos</h3><p>Mémos vocaux.</p>";
    case "services":
      return "<h3>Services</h3><p>Services système.</p>";
    case "music":
      return "<h3>Music</h3><p>Lecteur de musique.</p>";
    case "market":
      return "<h3>Market</h3><p>Boutique / marketplace.</p>";
    case "pages":
      return "<h3>Pages</h3><p>Docs / pages.</p>";
    case "trendy":
      return "<h3>Trendy</h3><p>Réseau social.</p>";
    case "spark":
      return "<h3>Spark</h3><p>Messagerie instantanée.</p>";
    case "instapic":
      return "<h3>InstaPic</h3><p>Photos & posts.</p>";
    case "birdy":
      return "<h3>Birdy</h3><p>Microblogging.</p>";
    case "phone":
      return "<h3>Phone</h3><p>Clavier, appels, journal d’appels.</p>";
    case "messages":
      return "<h3>Messages</h3><p>Messages texte.</p>";
    case "camera":
      return "<h3>Camera</h3><p>Interface appareil photo.</p>";
    case "photos":
      return "<h3>Photos</h3><p>Galerie d’images.</p>";
    default:
      return `<h3>${appKey}</h3><p>Contenu à définir.</p>`;
  }
}

function openApp(appKey, label) {
  if (!homeScreen || !appView || !appViewTitle || !appViewBody) return;

  appViewTitle.textContent = label || "App";
  appViewBody.innerHTML = getDummyContentForApp(appKey);

  appView.classList.add("active");
  homeScreen.classList.remove("active");
}

function closeApp() {
  if (!homeScreen || !appView) return;
  appView.classList.remove("active");
  homeScreen.classList.add("active");
}

backButton?.addEventListener("click", closeApp);

// clic sur les icônes de la grille
document.querySelectorAll(".icon-app").forEach((btn) => {
  btn.addEventListener("click", () => {
    const appKey = btn.getAttribute("data-app") || "App";
    const label =
      btn.querySelector(".icon-app-label")?.textContent.trim() || "App";
    openApp(appKey, label);
  });
});

// clic sur les icônes du dock
document.querySelectorAll(".dock-icon").forEach((btn) => {
  btn.addEventListener("click", () => {
    const appKey = btn.getAttribute("data-app") || "App";
    openApp(appKey, appKey.charAt(0).toUpperCase() + appKey.slice(1));
  });
});
