function formatTime(seconds) {

    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor((seconds % 3600) / 60);

    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {

        return `${hours} Std. ${minutes} Min.`;

    }

    if (minutes > 0) {

        return `${minutes} Min. ${remainingSeconds} Sek.`;

    }

    return `${remainingSeconds} Sek.`;

}

loadPlayer();

const stats = document.getElementById("stats");

stats.innerHTML = `
<div class="stat-card">
    <h3>⏳ Spielzeit</h3>
    <p>${formatTime(player.stats.totalTime)}</p>
</div>

<div class="stat-card">
    <h3>⚔ Abgeschlossene Quests</h3>
    <p>${player.stats.completedQuests}</p>
</div>

<div class="stat-card">
    <h3>⌨ Getippte Zeichen</h3>
    <p>${player.stats.totalCharacters}</p>
</div>

<div class="stat-card">
    <h3>⚡ Bestes Tempo</h3>
    <p>${player.stats.bestCPM} CPM</p>
</div>

<div class="stat-card">
    <h3>🎯 Beste Genauigkeit</h3>
    <p>${player.stats.bestAccuracy}%</p>
</div>

<div class="stat-card">
    <h3>🎮 Versuche</h3>
    <p>${player.stats.totalAttempts}</p>
</div>

<div class="stat-card">
    <h3>⌛ Durchschnittliche Questdauer</h3>
    <p>${formatTime(player.stats.averageTime)}</p>
</div>

<div class="stat-card">
    <h3>⚡ Durchschnittliches Tempo</h3>
    <p>${player.stats.averageCPM} CPM</p>
</div>

<div class="stat-card">
    <h3>🎯 Durchschnittliche Genauigkeit</h3>
    <p>${player.stats.averageAccuracy}%</p>
</div>
`;

function resetStats() {

    localStorage.removeItem("player");
    localStorage.removeItem("questStats");

    location.reload();

}function backToWorld() {

    window.location.href = "index.html";

}