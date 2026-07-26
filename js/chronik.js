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

    <img 
        src="../assets/ui/chronik/chronik-title.png"
        class="chronik-title-image"
        alt="Chronik">

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
}
function renderChronikStats(){

    const container =
    document.getElementById("chronikStats");


    if(!container){
        return;
    }


    container.innerHTML = `


    <div class="main-stat-grid">



        <div class="stat-image-card">

            <img src="../assets/ui/chronik/stat-quests.png">

            <h3>
                Quests
            </h3>

            <div class="stat-overlay-value">

                ${player.stats.completedQuests}

            </div>

        </div>



        <div class="stat-image-card">

            <img src="../assets/ui/chronik/stat-characters.png">

            <h3>
                Getippte Zeichen
            </h3>

            <div class="stat-overlay-value">

                ${player.stats.totalCharacters}

            </div>

        </div>



        <div class="stat-image-card">

            <img src="../assets/ui/chronik/stat-bestcpm.png">

            <h3>
                Bestes Tempo
            </h3>

            <div class="stat-overlay-value">

                ${player.stats.bestCPM} CPM

            </div>

        </div>



        <div class="stat-image-card">

            <img src="../assets/ui/chronik/stat-averagecpm.png">

            <h3>
                Ø  Tempo
            </h3>

            <div class="stat-overlay-value">

                ${player.stats.averageCPM} CPM

            </div>

        </div>



        <div class="stat-image-card">

            <img src="../assets/ui/chronik/stat-accuracy.png">

            <h3>
                Ø   Genauigkeit 
            </h3>

            <div class="stat-overlay-value">

                ${player.stats.averageAccuracy}%

            </div>

        </div>



        <div class="stat-image-card">

            <img src="../assets/ui/chronik/stat-attempts.png">

            <h3>
                Versuche
            </h3>

            <div class="stat-overlay-value">

                ${player.stats.totalAttempts}

            </div>

        </div>



        <div class="stat-image-card">

            <img src="../assets/ui/chronik/stat-time.png">

            <h3>
                Gesamtspielzeit
            </h3>

            <div class="stat-overlay-value">

                ${formatTime(player.stats.totalTime)}

            </div>

        </div>



    </div>


    `;

}
