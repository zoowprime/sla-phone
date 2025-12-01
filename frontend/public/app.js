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

// Gestion des clics sur les apps
const appIcons = document.querySelectorAll(".app-icon");

appIcons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const label = btn.querySelector(".app-icon-label")?.textContent || "App";
    alert(`📱 L'app "${label}" sera bientôt disponible !`);
  });
});

// Gestion des boutons du dock
const dockButtons = document.querySelectorAll(".dock-app");

dockButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const text = btn.textContent.trim();
    alert(`🔧 Fonction "${text}" à venir.`);
  });
});
