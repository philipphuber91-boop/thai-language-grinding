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

const chronikWeekdayLabels = [

    "Mo",

    "Di",

    "Mi",

    "Do",

    "Fr",

    "Sa",

    "So"

];

const chronikRelativeLabels = [

    "-7",

    "-6",

    "-5",

    "-4",

    "-3",

    "-2",

    "-1",

    "Heute"

];

function getChronikHistoryEntries() {

    const historyEntries = Array.isArray(player.stats.history?.daily)

        ? player.stats.history.daily

        : [];


        return historyEntries.map(entry => ({

            date: entry.date || "",

                    totalMinutes: Number(
            entry.totalMinutes ??
                        Math.ceil((entry.playTime ?? 0) / 60)
        ),

                    averageCPM: Number(
            entry.averageCPM ?? entry.averageCpm ?? 0
        ),

 
accuracy: Number(
            entry.accuracy ?? entry.averageAccuracy ?? 0
        )
    }));
}

function toIsoDate(date) {

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}

function getMonday(date) {

    const copy = new Date(date.getTime());

    const weekday = copy.getDay();

    const diff = weekday === 0 ? -6 : 1 - weekday;

    copy.setDate(copy.getDate() + diff);

    return copy;

}

function getChronikEntryByDate(entries, dateString) {

    return entries.find(entry => entry.date === dateString) || null;

}

function getChronikWeeklySeries(entries) {

    const monday = getMonday(new Date());

    return chronikWeekdayLabels.map((label, index) => {

        const date = addDays(toIsoDate(monday), index);

        const entry = getChronikEntryByDate(entries, date);

        return {

            label,

            value: entry ? entry.totalMinutes : 0

        };

    });

}

function getChronikRelativeSeries(entries) {

    const today = getToday();

    return chronikRelativeLabels.map((label, index) => {

        const offset = index - (chronikRelativeLabels.length - 1);

        const date = addDays(today, offset);

        const entry = getChronikEntryByDate(entries, date);

        return {

            label,

            value: entry ? entry.averageCPM : 0,

            accuracy: entry ? entry.accuracy : 0

        };

    });

}

function renderBarChart(values, xLabels, yAxisLabel) {

    const width = 320;

    const height = 200;

    const padding = { top: 18, right: 18, bottom: 36, left: 30 };

    const maxValue = Math.max(...values, 10);

    const chartHeight = height - padding.top - padding.bottom;

    const chartWidth = width - padding.left - padding.right;

    const barWidth = Math.max(18, (chartWidth / values.length) * 0.56);

    const gap = values.length > 1

        ? (chartWidth - values.length * barWidth) / (values.length - 1)

        : 0;

    const bars = values.map((value, index) => {

        const barHeight = Math.round((value / maxValue) * chartHeight);

        const x = padding.left + index * (barWidth + gap);

        const y = height - padding.bottom - barHeight;

        return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${barHeight.toFixed(1)}" rx="6" class="chart-bar" />`;

    }).join("");

    const gridLines = [0, 0.5, 1].map(fraction => {

        const value = Math.round(maxValue * fraction);

        const y = padding.top + chartHeight * (1 - fraction);

        return `
            <line x1="${padding.left}" y1="${y.toFixed(1)}" x2="${width - padding.right}" y2="${y.toFixed(1)}" class="chart-grid-line" />
            <text x="${padding.left - 8}" y="${y + 4}" text-anchor="end" class="chart-axis-text">${value}</text>
        `;

    }).join("");

    const labels = values.map((_, index) => {

        const x = padding.left + index * (barWidth + gap) + barWidth / 2;

        return `<text x="${x.toFixed(1)}" y="${height - 12}" text-anchor="middle" class="chart-label">${xLabels[index]}</text>`;

    }).join("");

    return `

        <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" class="chart-svg">

            <path d="M ${padding.left} ${padding.top} L ${padding.left} ${height - padding.bottom} L ${width - padding.right} ${height - padding.bottom}" class="chart-axis-path" />

            ${gridLines}

            ${bars}

            ${labels}

            <text x="${padding.left - 24}" y="${padding.top + chartHeight / 2}" transform="rotate(-90 ${padding.left - 24} ${padding.top + chartHeight / 2})" class="chart-axis-label">${yAxisLabel}</text>

        </svg>

    `;

}

function renderLineChart(values, xLabels, yAxisLabel) {

    const width = 320;

    const height = 200;

    const padding = { top: 18, right: 18, bottom: 36, left: 30 };

    const maxValue = Math.max(...values, 10);

    const chartHeight = height - padding.top - padding.bottom;

    const chartWidth = width - padding.left - padding.right;

    const stepX = values.length > 1 ? chartWidth / (values.length - 1) : chartWidth;

    const points = values.map((value, index) => {

        const x = padding.left + index * stepX;

        const y = height - padding.bottom - (value / maxValue) * chartHeight;

        return { x, y, value };

    });

    const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");

    const gridLines = [0, 0.5, 1].map(fraction => {

        const value = Math.round(maxValue * fraction);

        const y = padding.top + chartHeight * (1 - fraction);

        return `
            <line x1="${padding.left}" y1="${y.toFixed(1)}" x2="${width - padding.right}" y2="${y.toFixed(1)}" class="chart-grid-line" />
            <text x="${padding.left - 8}" y="${y + 4}" text-anchor="end" class="chart-axis-text">${value}</text>
        `;

    }).join("");

    const labels = points.map((point, index) => `
        <text x="${point.x.toFixed(1)}" y="${height - 12}" text-anchor="middle" class="chart-label">${xLabels[index]}</text>
    `).join("");

    const dots = points.map(point => `
        <circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="4" class="chart-dot" />
    `).join("");

    return `

        <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" class="chart-svg">

            <path d="M ${padding.left} ${padding.top} L ${padding.left} ${height - padding.bottom} L ${width - padding.right} ${height - padding.bottom}" class="chart-axis-path" />

            ${gridLines}

            <path d="${path}" class="chart-line" />

            ${dots}

            ${labels}

            <text x="${padding.left - 24}" y="${padding.top + chartHeight / 2}" transform="rotate(-90 ${padding.left - 24} ${padding.top + chartHeight / 2})" class="chart-axis-label">${yAxisLabel}</text>

        </svg>

    `;

}

function renderChronikHistoryCard(title, icon, bigValue, chartSvg){

    return `
        <div class="chronik-history-card">

            <div class="chronik-history-card-header">

                <div>
                    <h3>${title}</h3>
                </div>

                <img
                    class="chronik-history-icon"
                    src="${icon}"
                    alt="${title}">

            </div>

            <div class="chronik-history-big-number">
                ${bigValue}
            </div>

            <div class="chronik-chart-wrapper">
                ${chartSvg}
            </div>

        </div>
    `;
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

    const historyEntries = getChronikHistoryEntries();

    const weeklySeries = getChronikWeeklySeries(historyEntries);

    const relativeSeries = getChronikRelativeSeries(historyEntries);

    const totalTimeValues = weeklySeries.map(item => item.value);

    const tempoValues = relativeSeries.map(item => item.value);

    const accuracyValues = relativeSeries.map(item => item.accuracy);

    container.innerHTML = `
    
    <section class="chronik-history-panel">

            

            <div class="chronik-history-grid">

                ${renderChronikHistoryCard(
                    "Spielzeit",
                    "../assets/icons/achievements/sanduhr.png",
                    `${formatTime(player.stats.totalTime)}`,
                    renderBarChart(totalTimeValues, chronikWeekdayLabels, "Minuten")
                )}

                ${renderChronikHistoryCard(
                    "Tempo Verlauf",
                    "../assets/icons/achievements/blitz.png",
                    `${player.stats.averageCPM} CPM`,
                    renderLineChart(tempoValues, chronikRelativeLabels, "CPM")
                )}

                ${renderChronikHistoryCard(
                    "Genauigkeit Verlauf",
                    "../assets/icons/achievements/scharfschütze.png",
                    `${player.stats.averageAccuracy}%`,
                    renderLineChart(accuracyValues, chronikRelativeLabels, "%")
                )}

            </div>

        </section>

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

            <img src="../assets/ui/chronik/stat-time.png">

            <h3>
                Gesamtspielzeit
            </h3>

            <div class="stat-overlay-value">

                ${formatTime(player.stats.totalTime)}

            </div>

        </div>

        <div class="stat-image-card">

            <img src="../assets/ui/chronik/stat-characters.png">

            <h3>
                Getippte Wörter
            </h3>

            <div class="stat-overlay-value">

                ${player.stats.totalThaiWords}

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

            <img src="../assets/ui/chronik/stat-quests.png">

            <h3>
                Quests
            </h3>

            <div class="stat-overlay-value">

                ${player.stats.completedQuests}

            </div>

        </div>
        <div class="stat-image-card">

            <img src="../assets/icons/achievements/book.png">

            <h3>
                Einzigartige Wörter
            </h3>

            <div class="stat-overlay-value">

                ${Array.isArray(player.stats.uniqueThaiWords)
                    ? player.stats.uniqueThaiWords.length
                    : 0}

            </div>

        </div>



 



    </div>


    `;

}
