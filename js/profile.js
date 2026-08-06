function profileFormatNumber(value) {
    return Math.max(0, Number(value) || 0).toLocaleString("de-DE");
}

function profileFormatPercent(value) {
    const percent = Math.max(0, Math.min(100, Number(value) || 0));
    return `${Math.round(percent)}%`;
}

const profileRankTiers = [
    [
        "Sprachschüler", "Lernender", "Schreiber", "Wortsammler",
        "Leser", "Wissbegieriger", "Sprachjäger", "Geschichtensammler",
        "Forscher", "Sprachforscher"
    ],
    [
        "Federträger", "Abschreiber", "Chronist", "Wortschmied",
        "Schreiberling", "Schriftgelehrter", "Meisterschreiber",
        "Chronikmeister", "Geschichtenerzähler", "Sprachchronist"
    ],
    [
        "Denker", "Sprachkenner", "Wortmeister", "Wissenshüter",
        "Gelehrter", "Sprachkundige", "Meister des Wortes",
        "Bibliothekar", "Weiser", "Sprachweiser"
    ],
    [
        "Sprachkrieger", "Wortkrieger", "Schriftkämpfer", "Runenkrieger",
        "Satzkämpfer", "Veteran", "Elitekrieger", "Champion",
        "Sprachchampion", "Meisterkämpfer"
    ],
    [
        "Meister", "Sprachmeister", "Lehrmeister", "Wegmeister",
        "Meister der Zeichen", "Meister der Geschichten", "Großmeister",
        "Sprachgroßmeister", "Meister des Flusses", "Meister der Sprache"
    ],
    [
        "Hüter des Wissens", "Flüsterer", "Weiser Wanderer",
        "Sprachwächter", "Hüter der Wörter", "Hüter des Flusses",
        "Tempelwächter", "Weiser Meister", "Ältester", "Sprachältester"
    ],
    [
        "Legende", "Sprachlegende", "Runenhüter", "Hüter der Chroniken",
        "Drachenleser", "Drachenmeister", "Unsterblicher Schreiber",
        "Mythischer Wanderer", "Sprachlegende des Ostens", "Großweise"
    ],
    [
        "Runenmeister", "Chroniklegende", "Wortweiser",
        "Meister der Zeichen", "Hüter der Sprache", "Großgelehrter",
        "Meister der Chronik", "Wächter des Wissens",
        "Erhabener Sprachmeister", "Meister der alten Worte"
    ],
    [
        "Hüter der Welten", "Stimmenweiser", "Geschichtenweber",
        "Erleuchteter Schreiber", "Meister des Lernens", "Herr des Flusses",
        "Der Unbeugsame", "Der Weise des Ostens",
        "Großmeister der Worte", "Vorläufer der Thai-Legende"
    ],
    [
        "Meister der Welten", "Hüter der Stimmen", "Hüter der Geschichten",
        "Der Erleuchtete", "Meister des Lernens", "Meister des Flusses",
        "Der Unbeugsame", "Der Weise des Ostens",
        "Großmeister der Sprache", "Thai-Legende"
    ]
];

const profileRankDescriptions = [
    "Du legst deine ersten sprachlichen Grundlagen und entdeckst die Welt des Thai.",
    "Du findest Freude am regelmäßigen Lernen und sammelst sicher deine ersten Erfolge.",
    "Du bringst deine ersten Wörter aktiv ins Spiel und wagst dich an ganze Ausdrücke.",
    "Du sammelst Wort für Wort einen verlässlichen Grundwortschatz.",
    "Du erkennst immer mehr vertraute Wörter und liest sie mit wachsender Sicherheit.",
    "Deine Neugier treibt dich an, auch unbekannte Begriffe genauer zu erforschen.",
    "Du jagst neuen Wörtern nach und machst jede Lernrunde zu einer kleinen Entdeckung.",
    "Du verbindest einzelne Wörter zu ersten Geschichten und merkst dir ihren Zusammenhang.",
    "Du beobachtest deine Fortschritte aufmerksam und findest eigene Wege zum Lernen.",
    "Du hast die Grundlagen gefestigt und bist bereit für anspruchsvollere Sprachabenteuer.",
    "Du hältst deine Lernfeder sicher und baust deine Übung Schritt für Schritt aus.",
    "Du schreibst konzentriert und entwickelst ein gutes Gefühl für die Schriftzeichen.",
    "Du ordnest dein Wissen wie ein Chronist und kehrst regelmäßig zu wichtigen Wörtern zurück.",
    "Du formst aus bekannten Zeichen immer sicherere Wörter und Wendungen.",
    "Du schreibst ausdauernd weiter und lässt dich von kleinen Fehlern nicht aufhalten.",
    "Du liest deine Antworten aufmerksam und verbesserst deine Genauigkeit mit jeder Runde.",
    "Du arbeitest sorgfältig und beweist, dass Übung deine stärkste Feder ist.",
    "Du bewahrst wichtige Erkenntnisse und findest sie auch später schnell wieder.",
    "Du erzählst mit deinen wachsenden Sprachkenntnissen bereits kleine Geschichten.",
    "Du dokumentierst deinen Lernweg und wirst zu einem verlässlichen Chronisten.",
    "Du denkst über einzelne Wörter hinaus und erkennst erste sprachliche Muster.",
    "Du hörst genauer hin und entdeckst Bedeutungen, die dir zuvor entgangen sind.",
    "Du beherrschst immer mehr Wortfamilien und erschließt dir neue Zusammenhänge.",
    "Du schützt dein Wissen vor dem Vergessen, indem du es regelmäßig wiederholst.",
    "Du lernst aus jeder Quest und machst aus neuen Erkenntnissen dauerhafte Stärke.",
    "Du liest längere Ausdrücke sicherer und erkennst ihre innere Struktur.",
    "Du erklärst dir schwierige Wörter selbst und wächst dadurch über das Auswendiglernen hinaus.",
    "Du verbindest Schrift, Klang und Bedeutung zu einem immer klareren Sprachbild.",
    "Du sammelst Wissen mit der Geduld eines Bibliothekars und gibst es nicht leichtfertig preis.",
    "Du erkennst in vielen Wörtern bereits die Geschichte und den Zusammenhang dahinter.",
    "Du kämpfst dich durch schwierige Quests und bleibst auch bei kniffligen Zeichen ruhig.",
    "Du stellst dich jedem Fehler mutig und verwandelst ihn in eine neue Lernchance.",
    "Du trainierst deine Finger ebenso entschlossen wie deinen Wortschatz.",
    "Du bewahrst auch unter Zeitdruck einen klaren Kopf und eine ruhige Schreibhand.",
    "Du meisterst anspruchsvolle Zeichenfolgen und lässt dich von Rückschlägen nicht besiegen.",
    "Du liest schnell genug, um den Sinn zu erfassen, und sorgfältig genug, um ihn zu bewahren.",
    "Du kennst deine Stärken und setzt sie gezielt gegen schwierige Sprachrätsel ein.",
    "Du führst deine Lernrunden mit der Disziplin eines erfahrenen Kämpfers.",
    "Du erreichst beständig neue Ziele und zeigst, dass Ausdauer dich weit trägt.",
    "Du hast dir einen Platz unter den stärksten Sprachkämpfern erarbeitet.",
    "Du beherrschst die wichtigsten Grundlagen und entwickelst deine eigene Lernstrategie.",
    "Du leitest dich selbst sicher durch neue Kapitel und bewältigst jede Quest mit Übersicht.",
    "Du hilfst deinen eigenen Lernfortschritten auf die Sprünge, indem du klug wiederholst.",
    "Du erkennst die feinen Unterschiede zwischen ähnlichen Zeichen immer zuverlässiger.",
    "Du erzählst komplexere Zusammenhänge und lässt deine Sprachkenntnisse lebendig werden.",
    "Du verbindest Wissen, Tempo und Genauigkeit zu einer beeindruckenden Lernkraft.",
    "Du findest auch in schwierigen Texten den roten Faden und folgst ihm sicher.",
    "Du überblickst viele Sprachmuster und nutzt sie wie ein echter Meister.",
    "Du formst aus einzelnen Erkenntnissen ein umfassendes Bild der thailändischen Sprache.",
    "Du beherrschst deine Lernwerkzeuge und gehst jede neue Herausforderung souverän an.",
    "Du schützt wertvolle Erkenntnisse und teilst sie durch deine eigenen Antworten mit der Welt.",
    "Du hörst auf die leisen Hinweise in Sprache und Aussprache und deutest sie immer besser.",
    "Du wanderst sicher zwischen vertrauten Wörtern und unbekannten Wendungen.",
    "Du bewachst deinen Fortschritt mit ruhiger Aufmerksamkeit und wachsendem Selbstvertrauen.",
    "Du sammelst Wörter nicht nur, sondern erkennst ihren Platz im großen Sprachfluss.",
    "Du hältst auch lange Lernwege durch und bleibst deinem Ziel treu.",
    "Du machst aus jeder Wiederholung eine neue Verbindung und aus jeder Verbindung ein Stück Wissen.",
    "Du führst andere durch schwierige Begriffe, weil du selbst viele Wege zu ihrer Bedeutung kennst.",
    "Du hast dir die Weisheit eines erfahrenen Sprachlernenden erarbeitet.",
    "Du bewahrst die Sprache mit einer Ruhe, die selbst schwierige Aufgaben leichter macht.",
    "Du überschreitest bekannte Grenzen und öffnest dir Wege zu tieferen Bedeutungen.",
    "Du erkennst in vielen Zeichen die Geschichten, die sie miteinander verbinden.",
    "Du liest nicht mehr nur Wörter, sondern auch die Bilder und Gefühle zwischen ihnen.",
    "Du gestaltest deine Antworten mit sicherer Hand und bemerkenswerter Geduld.",
    "Du hast gelernt, auch seltene Wörter in ihren richtigen Zusammenhang einzuordnen.",
    "Du schreibst so beständig, dass selbst lange Übungswege ihren Schrecken verlieren.",
    "Du verbindest die Kraft eines Kriegers mit der Genauigkeit eines Schreibers.",
    "Du erkennst Muster, bevor sie offensichtlich werden, und nutzt sie für deinen Fortschritt.",
    "Du näherst dich den großen Geheimnissen der Sprache mit Respekt und Ausdauer.",
    "Du bewahrst Wissen, Geschichten und Stimmen wie ein Schatz aus vielen Generationen.",
    "Du formst aus deinen Erfahrungen neue Wege und wirst selbst zum Wegweiser.",
    "Du liest zwischen den Zeilen und verstehst immer mehr von der Welt hinter den Wörtern.",
    "Du hast dir eine außergewöhnliche Sprachdisziplin aufgebaut und nutzt sie jeden Tag.",
    "Du verbindest klare Gedanken mit sicherer Sprache und wirkst dadurch immer souveräner.",
    "Du trägst die Erinnerung vieler Lernrunden in dir und lässt sie in neuen Quests weiterleben.",
    "Du bewachst die großen Zusammenhänge und verlierst auch kleine sprachliche Details nicht.",
    "Du erreichst eine Höhe, auf der Wissen und Intuition eng miteinander verbunden sind.",
    "Du wandelst zwischen alten Zeichen und neuen Erkenntnissen mit sicherem Schritt.",
    "Du liest die Chronik deiner Lernreise und schreibst jedes Kapitel bewusst weiter.",
    "Du schmiedest aus Wörtern starke Verbindungen, die auch schwierige Aufgaben tragen.",
    "Du vereinst die Erfahrung vieler Quests und gibst deinem Wissen eine klare Stimme.",
    "Du hast dir einen Platz unter den herausragenden Meistern der Sprache geschaffen.",
    "Du bewahrst die alten Worte und machst sie für deine eigene Lernreise lebendig.",
    "Du überblickst viele Welten des Lernens und findest in jeder neue Zusammenhänge.",
    "Du deutest Stimmen, Zeichen und Geschichten mit der Ruhe eines erfahrenen Weisen.",
    "Du webst aus einzelnen Wörtern lebendige Bilder und verstehst ihre feinen Nuancen.",
    "Du trägst die Klarheit deiner Erkenntnisse in jede neue Lernrunde.",
    "Du vertiefst dein Wissen mit derselben Beharrlichkeit, die große Meister auszeichnet.",
    "Du kennst den Fluss des Lernens und lässt dich auch von schwierigen Stellen nicht bremsen.",
    "Du bleibst standhaft, wenn eine Aufgabe schwierig wird, und findest immer einen nächsten Schritt.",
    "Du führst deine Sprachkenntnisse mit sicherer Hand durch immer anspruchsvollere Texte.",
    "Du hast dir eine seltene Verbindung aus Wissen, Geduld und Genauigkeit geschaffen.",
    "Du stehst kurz davor, die höchsten Gipfel deiner Sprachreise zu erreichen.",
    "Du überschreitest die Grenzen gewöhnlicher Lernziele und öffnest neue Wege für dich.",
    "Du hältst die Stimmen deiner Lernreise wach und gibst ihnen in jeder Antwort Raum.",
    "Du bewahrst Geschichten nicht nur, sondern verstehst auch ihre sprachlichen Feinheiten.",
    "Du leuchtest mit deiner Erfahrung anderen Lernwegen voraus und bleibst selbst neugierig.",
    "Du machst Lernen zu einer bewussten Kunst und verfeinerst sie mit jeder Quest.",
    "Du verbindest Wissen und Ausdauer zu einer Kraft, die dich über jedes Hindernis trägt.",
    "Du lässt dich vom Strom der Sprache führen und kennst doch jederzeit deinen eigenen Weg.",
    "Du bleibst selbst unter größtem Druck klar, aufmerksam und unbeugsam.",
    "Du erkennst die Weisheit hinter vielen Ausdrücken und trägst sie sicher weiter.",
    "Du hast dir eine Meisterschaft aufgebaut, die weit über einzelne Quests hinausreicht.",
    "Du stehst am Gipfel deiner bisherigen Lernreise und schreibst deine eigene Thai-Legende."
];

const profileRanks = profileRankTiers.flatMap((tier, tierIndex) =>
    tier.map((name, rankIndex) => {
        const number = tierIndex * 10 + rankIndex + 1;

        return {
            number,
            tier: tierIndex + 1,
            name,
            description: profileRankDescriptions[number - 1]
        };
    })
);

function getProfileRankDescription(rank) {
    return rank.description;
}

function getProfileRankSummary(level) {
    const rankNumber = Math.max(
        1,
        Math.min(100, Math.floor(Number(level) || 1))
    );
    const rank = profileRanks[rankNumber - 1];

    return {
        ...rank,
        description: getProfileRankDescription(rank),
        next: profileRanks[rankNumber] || null
    };
}

function renderProfileRankOverview(currentRankNumber) {
    return profileRankTiers.map((tier, tierIndex) => {
        const firstRank = tierIndex * 10 + 1;
        const lastRank = firstRank + tier.length - 1;
        const ranks = tier.map((_, rankIndex) => {
            const number = firstRank + rankIndex;
            const isVisible =
                number <= currentRankNumber ||
                number === currentRankNumber + 1;
            const isCurrent = number === currentRankNumber;
            const rank = profileRanks[number - 1];

            return `
                <li class="profile-rank-item${isCurrent ? " is-current" : ""}${isVisible ? "" : " is-hidden"}">
                    <span>${number}</span>
                    <div class="profile-rank-item-copy">
                        <strong>${isVisible ? rank.name : "???"}</strong>
                        <p>${isVisible
                            ? getProfileRankDescription(rank)
                            : "Dieser Rang bleibt noch verborgen."}</p>
                    </div>
                </li>
            `;
        }).join("");

        return `
            <section class="profile-rank-tier">
                <h3>Stufe ${tierIndex + 1} <span>Ränge ${firstRank}–${lastRank}</span></h3>
                <ol>${ranks}</ol>
            </section>
        `;
    }).join("");
}

const profileTypingBadgeCategories = [
    {
        id: "speed",
        title: "Geschwindigkeit",
        icon: "blitz",
        matches: ["cpm"]
    },
    {
        id: "precision",
        title: "Präzision",
        icon: "scharfschütze",
        matches: ["accuracy", "cleanWords"]
    },
    {
        id: "words",
        title: "Wörter",
        icon: "book",
        matches: ["masteredWords", "newWords"]
    },
    {
        id: "perfect",
        title: "Fehlerfreie Quests",
        icon: "krone",
        matches: ["perfectQuest"]
    },
    {
        id: "streak",
        title: "Serien",
        icon: "blitz",
        matches: ["cleanStreak"]
    },
    {
        id: "records",
        title: "Rekorde",
        icon: "krone",
        matches: ["newRecord"]
    },
    {
        id: "audio",
        title: "Audio",
        icon: "book",
        matches: ["audioListens"]
    }
];

function profileIsMobileViewport() {
    return typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(max-width: 900px)").matches;
}

function profileIsDefinitionAvailable(definition) {
    if (definition.mobileOnly) {
        return profileIsMobileViewport();
    }

    if (definition.desktopOnly) {
        return !profileIsMobileViewport();
    }

    return true;
}

function getProfileHeaderMarkup(xp, rank, idPrefix = "") {
    const titleId = idPrefix
        ? `${idPrefix}ProfileTitle`
        : "profileTitle";

    return `
        <div class="profile-identity">
            <div class="profile-avatar" aria-hidden="true">
                <img class="profile-avatar-character" src="../assets/ui/profile-avatar.png" alt="">
                <span class="profile-level-badge">
                    <img src="../assets/ui/quest-badge.png" alt="">
                    <strong>${profileFormatNumber(xp.level)}</strong>
                </span>
            </div>
            <div class="profile-identity-info">
                <h1 id="${titleId}">TH Flipu <span class="profile-name-edit" aria-hidden="true">✎</span></h1>
                <p class="profile-rank">
                    <img class="profile-rank-icon" src="../assets/ui/quest-badge.png" alt="">
                    ${rank.name}
                </p>
                <p class="profile-level-text">Level ${profileFormatNumber(xp.level)}</p>
                <div class="profile-xp-track" role="progressbar"
                     aria-label="Level-Fortschritt"
                     aria-valuenow="${xp.percent}"
                     aria-valuemin="0"
                     aria-valuemax="100">
                     <span style="width:${xp.percent}%"></span>
                </div>
                <p class="profile-xp-numbers">${profileFormatNumber(xp.progressXp)} / ${profileFormatNumber(xp.requiredXp)} XP</p>
            </div>
        </div>
    `;
}

function getProfileQuestBadgeCategories() {
    const categoryDefinitions =
        typeof achievementDefinitions === "object"
            ? achievementDefinitions.filter(
                definition =>
                    definition.questScoped &&
                    profileIsDefinitionAvailable(definition)
            )
            : [];
    const definitionsById = new Map(
        categoryDefinitions.map(definition => [definition.id, definition])
    );
    const categories = profileTypingBadgeCategories.map(category => ({
        ...category,
        count: 0,
        available: 0
    }));
    const categoriesByRunType = new Map(
        categories.flatMap(category =>
            category.matches.map(runType => [runType, category])
        )
    );
    const categoriesById = new Map(
        categories.map(category => [category.id, category])
    );

    categoryDefinitions.forEach(definition => {
        const category = definition.runType === "sentenceChallenge"
            ? categoriesById.get(
                definition.challengeMetric === "accuracy"
                    ? "precision"
                    : "speed"
            )
            : categoriesByRunType.get(definition.runType);

        if (category) {
            category.available++;
        }
    });

    Object.entries(questStats || {}).forEach(([questId, stats]) => {
        const awards = stats?.questAchievements;

        if (!awards || typeof awards !== "object") {
            return;
        }

        const questDefinitions = typeof getTypingAwardDefinitions === "function"
            ? getTypingAwardDefinitions(questId)
            : categoryDefinitions;
        const definitionsByQuestId = new Map(
            questDefinitions.map(definition => [definition.id, definition])
        );

        Object.entries(awards).forEach(([definitionId, award]) => {
            const definition =
                definitionsByQuestId.get(definitionId) ||
                definitionsById.get(definitionId);
            const category = definition?.runType === "sentenceChallenge"
                ? categoriesById.get(
                    definition.challengeMetric === "accuracy"
                        ? "precision"
                        : "speed"
                )
                : categoriesByRunType.get(definition?.runType);

            if (!category || !award?.unlocked) {
                return;
            }

            category.count +=
                1 +
                Math.max(0, Number(award.repeatCount) || 0);
        });
    });

    return {
        categories: categories.filter(category => category.available > 0),
        total: categories.reduce((sum, category) => sum + category.count, 0),
        available: categories.reduce(
            (sum, category) => sum + category.available,
            0
        )
    };
}

function renderProfile() {
    const container = document.getElementById("profileContainer");

    if (!container) {
        return;
    }

    const stats = player?.stats || {};
    const xp = typeof getPlayerXpSummary === "function"
        ? getPlayerXpSummary()
        : {
            level: Number(stats.level) || 1,
            totalXp: Number(stats.xp) || 0,
            progressXp: 0,
            requiredXp: 1,
            percent: 0
        };
    const rank = getProfileRankSummary(xp.level);
    const questBadgeSummary = getProfileQuestBadgeCategories();

    container.innerHTML = `
        <main class="profile-page" aria-labelledby="profileTitle">
            <section class="profile-header-panel">
                ${getProfileHeaderMarkup(xp, rank)}
            </section>

            <section class="profile-rank-panel" aria-labelledby="profileRankTitle">
                <div class="profile-rank-card">
                    <div class="profile-rank-emblem" aria-hidden="true">★</div>
                    <div class="profile-rank-copy">
                        <p class="profile-eyebrow">Aktueller Rang</p>
                        <h2 id="profileRankTitle">${rank.name}</h2>
                        <p>Stufe ${rank.tier} · Rang ${rank.number} von 100</p>
                        <p class="profile-rank-description">${rank.description}</p>
                    </div>
                    <button class="profile-rank-toggle" type="button"
                            aria-expanded="false"
                            aria-controls="profileRankOverview">
                        Rangübersicht <span aria-hidden="true">›</span>
                    </button>
                </div>
                <div id="profileRankOverview" class="profile-rank-overview" hidden>
                    ${renderProfileRankOverview(rank.number)}
                </div>
            </section>

            <section class="profile-panel profile-badges-panel" aria-labelledby="profileBadgesTitle">
                <div class="profile-panel-heading">
                    <span class="profile-panel-icon">🏅</span>
                    <div>
                        <p class="profile-eyebrow">Deine Sammlung</p>
                        <h2 id="profileBadgesTitle">Abzeichen</h2>
                    </div>
                </div>
                <p class="profile-badges-intro">
                    ${profileFormatNumber(questBadgeSummary.total)}
                    Questauszeichnungen gesammelt
                </p>
                <div class="profile-badge-categories">
                    ${questBadgeSummary.categories.map(category => `
                        <article class="profile-badge-category">
                            <img src="../assets/icons/achievements/${category.icon}.png" alt="">
                            <h3>${category.title}</h3>
                            <strong>${profileFormatNumber(category.count)}</strong>
                            <p>gesammelt</p>
                        </article>
                    `).join("")}
                </div>
            </section>

            <aside class="profile-mentor">
                <div class="profile-mentor-art" aria-hidden="true">🧘🏻‍♂️</div>
                <div>
                    <p class="profile-eyebrow">Dein Begleiter</p>
                    <h2>Jede Quest bringt dich weiter.</h2>
                    <p>Übe regelmäßig, sammle Auszeichnungen und werde Schritt für Schritt sicherer im Thai.</p>
                </div>
            </aside>
        </main>
    `;

    const rankToggle = container.querySelector(".profile-rank-toggle");
    const rankOverview = container.querySelector("#profileRankOverview");

    rankToggle?.addEventListener("click", () => {
        const isExpanded = rankToggle.getAttribute("aria-expanded") === "true";
        rankToggle.setAttribute("aria-expanded", String(!isExpanded));
        rankOverview.hidden = isExpanded;
    });
}
