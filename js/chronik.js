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

function renderChronik(){

    loadPlayer();

    const content = document.getElementById("chronikContainer");

    if(!content){
        return;
    }


content.innerHTML = `

<div id="chronikPage">


    <div id="chronikHeader">

        <h1>
            📜 Chronik
        </h1>

        <p>
            Deine Reise als Sprachschüler
        </p>

    </div>

    



    <div id="chronikProfile"></div>



    <div id="chronikStats"></div>



    <div id="chronikRecords"></div>


</div>

`;


    renderChronikProfile();

    renderChronikStats();

    renderChronikRecords();
}

function renderChronikRecords(){

    const container =
    document.getElementById("chronikRecords");


    if(!container){
        return;
    }


    container.innerHTML = `



    <div class="chronikGrid">


    </div>


    `;


}

function renderChronikProfile(){

    const container =
    document.getElementById("chronikProfile");


    if(!container){
        return;
    }


    const hours = Math.floor(
        player.stats.totalTime / 3600
    );


    const minutes = Math.floor(
        (player.stats.totalTime % 3600) / 60
    );


container.innerHTML = `

<div class="chronik-profile-card">


    <div class="profile-avatar">

        🇹🇭

    </div>



    <div class="profile-info">


        <h2>
            ${player.name || "Flipu"}
        </h2>


        <p>
            Level ${player.stats.level}
        </p>


        <p>
            XP ${player.stats.xp}
        </p>


        <p>
            ⏳ ${hours} Std. ${minutes} Min.
        </p>


    </div>



    <div class="profile-mini-stat">


        <div class="stat-icon">

            ⚔

        </div>


        <h3>

            Quests

        </h3>


        <strong>

            ${player.stats.completedQuests}

        </strong>


    </div>



</div>

`;

}

function renderChronikStats(){

    const container =
    document.getElementById("chronikStats");


    if(!container){
        return;
    }


    container.innerHTML = `


    <h2 class="chronik-section-title">

        📖 Deine Reise

    </h2>


<div class="chronikGrid">


<div class="chronik-panel stat-box">

<div class="stat-icon">
⚡
</div>

<h3>
Bestes Tempo
</h3>

<strong>
${player.stats.bestCPM} CPM
</strong>

</div>

        <div class="chronik-panel stat-box">

            <div class="stat-icon">
                ⚔
            </div>

            <h3>
                Quests gemeistert
            </h3>

            <strong>
                ${player.stats.completedQuests}
            </strong>

        </div>


<div class="chronik-panel stat-box">

<div class="stat-icon">
🎯
</div>

<h3>
Beste Genauigkeit
</h3>

<strong>
${player.stats.bestAccuracy}%
</strong>

</div>


<div class="chronik-panel stat-box">

<div class="stat-icon">
📈
</div>

<h3>
Durchschnitt Tempo
</h3>

<strong>
${player.stats.averageCPM || 0} CPM
</strong>

</div>


<div class="chronik-panel stat-box">

<div class="stat-icon">
🎯
</div>

<h3>
Durchschnitt Genauigkeit
</h3>

<strong>
${player.stats.averageAccuracy || 0}%
</strong>

</div>



        <div class="chronik-panel stat-box">

            <div class="stat-icon">
                🔄
            </div>

            <h3>
                Versuche
            </h3>

            <strong>
                ${player.stats.totalAttempts}
            </strong>

        </div>


    </div>


    `;

}
