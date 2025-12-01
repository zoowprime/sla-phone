// Sélection des éléments de l'heure et de la date
const timeEl = document.querySelector(".widget-clock-time");
const dateEl = document.querySelector(".widget-clock-date");

// Fonction pour mettre à jour l'heure + la date
function updateClock() {
  const now = new Date();

  // Heure HH:MM
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  timeEl.textContent = `${hours}:${minutes}`;

  // Date en français
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  const formattedDate = now.toLocaleDateString("fr-FR", options);

  // Met la première lettre en majuscule
  dateEl.textContent =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

// Appel immédiat + toutes les secondes
updateClock();
setInterval(updateClock, 1000);

// --------- GESTION DES APPS ---------
const homeScreen = document.querySelector(".home-screen");
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
          <li>Seiji Shimazu</li>
          <li>Cilian Fitzgerald</li>
          <li>Banque Belleshore</li>
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
        <p>Solde, historique, transferts... tout connecté à ton bot.</p>
      `;
    case "inventory":
      return `
        <h3>Inventaire</h3>
        <p>Plus tard : affichage des items, poids, actions (utiliser, donner...).</p>
      `;
    case "telegrams":
      return `
        <h3>Télégrammes</h3>
        <p>Envoi et réception de télégrammes en lien avec tes systèmes Discord.</p>
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
        <p>Clavier, journal d'appels, appels RP internes.</p>
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
  homeScreen.style.display = "none";
  appView.classList.add("active");
  appViewTitle.textContent = label || "App";
  appViewBody.innerHTML = getDummyContentForApp(appKey);
}

// Fermer une app (retour à l'accueil)
function closeApp() {
  appView.classList.remove("active");
  homeScreen.style.display = "flex";
}

backButton.addEventListener("click", closeApp);

// Clics sur les icônes d'app
const appIcons = document.querySelectorAll(".app-icon");
appIcons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const appKey = btn.getAttribute("data-app") || "unknown";
    const label =
      btn.querySelector(".app-icon-label")?.textContent.trim() || "App";
    openApp(appKey, label);
  });
});

// Clics sur les boutons du dock
const dockButtons = document.querySelectorAll(".dock-app");
dockButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const text = btn.textContent.trim();
    if (text.toLowerCase().includes("home")) {
      closeApp();
    } else {
      alert(`🔧 Fonction "${text}" à venir.`);
    }
  });
});
