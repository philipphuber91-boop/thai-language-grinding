(function (root) {
    "use strict";

    const categories = [
        { id: "geography", icon: "🌏", th: "ภูมิศาสตร์", de: "Geografie" },
        { id: "history", icon: "📜", th: "ประวัติศาสตร์", de: "Geschichte" },
        { id: "culture", icon: "🎎", th: "วัฒนธรรม", de: "Kultur" },
        { id: "food", icon: "🍜", th: "อาหาร", de: "Essen" },
        { id: "nature", icon: "🐘", th: "ธรรมชาติ", de: "Natur" },
        { id: "sport", icon: "🥊", th: "กีฬา", de: "Sport" }
    ];

    function makeQuestion(
        id,
        categoryId,
        difficulty,
        type,
        questionTh,
        questionDe,
        questionTransliteration,
        options,
        correctAnswers,
        explanationTh,
        explanationDe,
        sources
    ) {
        return {
            id,
            categoryId,
            difficulty,
            type,
            question: { th: questionTh, de: questionDe },
            transliteration: { question: questionTransliteration },
            options: options.map(([optionId, th, de, transliteration]) => ({
                id: optionId,
                th,
                de,
                transliteration
            })),
            correctAnswers: Array.isArray(correctAnswers)
                ? correctAnswers
                : [correctAnswers],
            explanation: { th: explanationTh, de: explanationDe },
            sources
        };
    }

    const questions = [
        makeQuestion(
            "thq-geo-001", "geography", 1, "single_choice",
            "เมืองหลวงของประเทศไทยคือเมืองใด?",
            "Welche Stadt ist die Hauptstadt Thailands?",
            "Mueang luang khong prathet Thai khue mueang dai?",
            [
                ["a", "กรุงเทพมหานคร", "Bangkok", "Krung Thep Maha Nakhon"],
                ["b", "เชียงใหม่", "Chiang Mai", "Chiang Mai"],
                ["c", "ภูเก็ต", "Phuket", "Phuket"],
                ["d", "พัทยา", "Pattaya", "Phatthaya"]
            ],
            "a",
            "กรุงเทพมหานครเป็นเมืองหลวงและศูนย์กลางการปกครองของประเทศไทย",
            "Bangkok ist die Hauptstadt und das politische Zentrum Thailands.",
            [{ title: "Thailand.go.th – Geography", url: "https://thailand.go.th/issue-focus-detail/009_141" }]
        ),
        makeQuestion(
            "thq-geo-002", "geography", 2, "single_choice",
            "เกาะใดมีขนาดใหญ่ที่สุดในประเทศไทย?",
            "Welche Insel ist die größte Thailands?",
            "Ko dai mi khanat yai thi sut nai prathet Thai?",
            [
                ["a", "เกาะสมุย", "Koh Samui", "Ko Samui"],
                ["b", "เกาะช้าง", "Koh Chang", "Ko Chang"],
                ["c", "เกาะภูเก็ต", "Phuket", "Ko Phuket"],
                ["d", "เกาะพะงัน", "Koh Phangan", "Ko Pha-ngan"]
            ],
            "c",
            "ภูเก็ตเป็นเกาะที่ใหญ่ที่สุดของประเทศไทย",
            "Phuket ist die größte Insel Thailands.",
            [{ title: "Tourism Authority of Thailand – Phuket", url: "https://www.tourismthailand.org/Destinations/Provinces/Phuket/350" }]
        ),
        makeQuestion(
            "thq-geo-003", "geography", 3, "single_choice",
            "ดอยอินทนนท์อยู่ในจังหวัดใด?",
            "In welcher Provinz liegt der Doi Inthanon?",
            "Doi Inthanon yu nai changwat dai?",
            [
                ["a", "เชียงราย", "Chiang Rai", "Chiang Rai"],
                ["b", "เชียงใหม่", "Chiang Mai", "Chiang Mai"],
                ["c", "แม่ฮ่องสอน", "Mae Hong Son", "Mae Hong Son"],
                ["d", "น่าน", "Nan", "Nan"]
            ],
            "b",
            "ดอยอินทนนท์อยู่ในจังหวัดเชียงใหม่และเป็นยอดเขาที่สูงที่สุดของประเทศไทย",
            "Der Doi Inthanon liegt in der Provinz Chiang Mai und ist Thailands höchster Berg.",
            [{ title: "Tourism Authority of Thailand – Doi Inthanon", url: "https://www.tourismthailand.org/Attraction/doi-inthanon-national-park" }]
        ),
        makeQuestion(
            "thq-geo-004", "geography", 3, "single_choice",
            "จังหวัดใดมีพื้นที่มากที่สุดในประเทศไทย?",
            "Welche Provinz ist flächenmäßig die größte Thailands?",
            "Changwat dai mi phuen thi mak thi sut nai prathet Thai?",
            [
                ["a", "เชียงใหม่", "Chiang Mai", "Chiang Mai"],
                ["b", "กาญจนบุรี", "Kanchanaburi", "Kanchanaburi"],
                ["c", "นครราชสีมา", "Nakhon Ratchasima", "Nakhon Ratchasima"],
                ["d", "สุราษฎร์ธานี", "Surat Thani", "Surat Thani"]
            ],
            "c",
            "นครราชสีมา หรือโคราช เป็นจังหวัดที่มีพื้นที่มากที่สุดของประเทศไทย",
            "Nakhon Ratchasima, auch Korat genannt, ist flächenmäßig Thailands größte Provinz.",
            [{ title: "Thailand.go.th – Geography", url: "https://thailand.go.th/issue-focus-detail/009_141" }]
        ),
        makeQuestion(
            "thq-geo-005", "geography", 4, "multiple_choice",
            "ประเทศไทยมีพรมแดนทางบกติดกับประเทศใดบ้าง? เลือกทุกข้อที่ถูกต้อง",
            "An welche Länder grenzt Thailand an Land? Wähle alle richtigen Antworten.",
            "Prathet Thai mi phromdaen thang bok tit kap prathet dai bang? Lueak thuk kho thi thuk tong.",
            [
                ["a", "เวียดนาม", "Vietnam", "Vietnam"],
                ["b", "มาเลเซีย", "Malaysia", "Malaysia"],
                ["c", "กัมพูชา", "Kambodscha", "Kamphucha"],
                ["d", "ลาว", "Laos", "Lao"],
                ["e", "เมียนมา", "Myanmar", "Mianma"]
            ],
            ["b", "c", "d", "e"],
            "ประเทศไทยมีพรมแดนทางบกติดกับเมียนมา ลาว กัมพูชา และมาเลเซีย",
            "Thailand hat Landgrenzen mit Myanmar, Laos, Kambodscha und Malaysia.",
            [{ title: "Thailand.go.th – Geography", url: "https://thailand.go.th/issue-focus-detail/009_141" }]
        ),
        makeQuestion(
            "thq-geo-006", "geography", 5, "single_choice",
            "จุดที่สูงที่สุดของดอยอินทนนท์สูงจากระดับน้ำทะเลประมาณเท่าใด?",
            "Wie hoch liegt der höchste Punkt des Doi Inthanon ungefähr über dem Meeresspiegel?",
            "Chut thi sung thi sut khong Doi Inthanon sung chak radap nam thale praman thao dai?",
            [
                ["a", "1,565 เมตร", "1.565 Meter", "Nueng phan ha roi hok sip ha met"],
                ["b", "2,565 เมตร", "2.565 Meter", "Song phan ha roi hok sip ha met"],
                ["c", "3,565 เมตร", "3.565 Meter", "Sam phan ha roi hok sip ha met"],
                ["d", "4,565 เมตร", "4.565 Meter", "Si phan ha roi hok sip ha met"]
            ],
            "b",
            "ยอดดอยอินทนนท์สูงประมาณ 2,565 เมตรเหนือระดับน้ำทะเล",
            "Der höchste Punkt des Doi Inthanon liegt etwa 2.565 Meter über dem Meeresspiegel.",
            [{ title: "Tourism Authority of Thailand – Doi Inthanon", url: "https://www.tourismthailand.org/Attraction/doi-inthanon-national-park" }]
        ),
        makeQuestion(
            "thq-hist-001", "history", 1, "true_false",
            "อยุธยาเคยเป็นเมืองหลวงของสยาม",
            "Ayutthaya war früher eine Hauptstadt von Siam.",
            "Ayutthaya khoei pen mueang luang khong Sayam.",
            [
                ["true", "จริง", "Wahr", "Ching"],
                ["false", "ไม่จริง", "Falsch", "Mai ching"]
            ],
            "true",
            "อยุธยาเป็นราชธานีของสยามอยู่หลายศตวรรษ",
            "Ayutthaya war mehrere Jahrhunderte lang die Hauptstadt des siamesischen Königreichs.",
            [{ title: "UNESCO – Historic City of Ayutthaya", url: "https://whc.unesco.org/en/list/576/" }]
        ),
        makeQuestion(
            "thq-hist-002", "history", 2, "single_choice",
            "สุโขทัยมีความสำคัญอย่างไรในประวัติศาสตร์ไทย?",
            "Welche Bedeutung hatte Sukhothai in der thailändischen Geschichte?",
            "Sukhothai mi khwam samkhan yangrai nai prawattisat Thai?",
            [
                ["a", "เป็นเมืองหลวงของอาณาจักรสยามยุคแรก", "Es war die Hauptstadt des frühen Königreichs Siam", "Pen mueang luang khong anachak Sayam yuk raek"],
                ["b", "เป็นท่าเรือแห่งแรกของประเทศ", "Es war der erste Hafen des Landes", "Pen tha ruea haeng raek khong prathet"],
                ["c", "เป็นเมืองหลวงปัจจุบัน", "Es ist die heutige Hauptstadt", "Pen mueang luang patchuban"],
                ["d", "เป็นเมืองหลวงของล้านนา", "Es war die Hauptstadt Lan Nas", "Pen mueang luang khong Lanna"]
            ],
            "a",
            "สุโขทัยเป็นเมืองหลวงทางการเมืองและการปกครองของอาณาจักรสยามยุคแรก",
            "Sukhothai war im 13. und 14. Jahrhundert das politische und administrative Zentrum des frühen Königreichs Siam.",
            [{ title: "UNESCO – Historic Town of Sukhothai", url: "https://whc.unesco.org/en/list/574/" }]
        ),
        makeQuestion(
            "thq-hist-003", "history", 3, "single_choice",
            "กรุงศรีอยุธยาก่อตั้งขึ้นใน พ.ศ. ใด?",
            "In welchem Jahr wurde Ayutthaya gegründet?",
            "Krung Si Ayutthaya kot tang khuen nai pi dai?",
            [
                ["a", "พ.ศ. 1893", "1350", "Phutthasakkarat 1893"],
                ["b", "พ.ศ. 1993", "1450", "Phutthasakkarat 1993"],
                ["c", "พ.ศ. 2091", "1548", "Phutthasakkarat 2091"],
                ["d", "พ.ศ. 2310", "1767", "Phutthasakkarat 2310"]
            ],
            "a",
            "องค์การยูเนสโกระบุว่ากรุงศรีอยุธยาก่อตั้งขึ้นในปี ค.ศ. 1350",
            "UNESCO datiert die Gründung Ayutthayas auf das Jahr 1350.",
            [{ title: "UNESCO – Historic City of Ayutthaya", url: "https://whc.unesco.org/en/list/576/" }]
        ),
        makeQuestion(
            "thq-hist-004", "history", 4, "single_choice",
            "กรุงศรีอยุธยาถูกทำลายในปีใด?",
            "In welchem Jahr wurde Ayutthaya zerstört?",
            "Krung Si Ayutthaya thuk tham lai nai pi dai?",
            [
                ["a", "พ.ศ. 2112", "1569", "Phutthasakkarat 2112"],
                ["b", "พ.ศ. 2231", "1688", "Phutthasakkarat 2231"],
                ["c", "พ.ศ. 2310", "1767", "Phutthasakkarat 2310"],
                ["d", "พ.ศ. 2325", "1782", "Phutthasakkarat 2325"]
            ],
            "c",
            "กองทัพพม่าโจมตีและทำลายกรุงศรีอยุธยาในปี ค.ศ. 1767",
            "Die birmanische Armee griff Ayutthaya an und zerstörte die Stadt 1767.",
            [{ title: "UNESCO – Historic City of Ayutthaya", url: "https://whc.unesco.org/en/list/576/" }]
        ),
        makeQuestion(
            "thq-hist-005", "history", 4, "single_choice",
            "แหล่งโบราณคดีบ้านเชียงอยู่ในจังหวัดใด?",
            "In welcher Provinz liegt die archäologische Fundstätte Ban Chiang?",
            "Laeng borannakhadi Ban Chiang yu nai changwat dai?",
            [
                ["a", "อุดรธานี", "Udon Thani", "Udon Thani"],
                ["b", "ขอนแก่น", "Khon Kaen", "Khon Kaen"],
                ["c", "บุรีรัมย์", "Buri Ram", "Buri Ram"],
                ["d", "นครสวรรค์", "Nakhon Sawan", "Nakhon Sawan"]
            ],
            "a",
            "แหล่งโบราณคดีบ้านเชียงตั้งอยู่ในจังหวัดอุดรธานี",
            "Die archäologische Fundstätte Ban Chiang liegt in der Provinz Udon Thani.",
            [{ title: "UNESCO – Ban Chiang Archaeological Site", url: "https://whc.unesco.org/en/list/575/" }]
        ),
        makeQuestion(
            "thq-hist-006", "history", 5, "single_choice",
            "การเปลี่ยนแปลงการปกครองของสยามในปี พ.ศ. 2475 นำไปสู่การปกครองแบบใด?",
            "Zu welcher Staatsform führte der politische Umbruch in Siam 1932?",
            "Kan plianplaeng kan pokkhrong khong Sayam nai pi Phutthasakkarat 2475 nam pai su kan pokkhrong baep dai?",
            [
                ["a", "สาธารณรัฐ", "Republik", "Satharanarat"],
                ["b", "สมบูรณาญาสิทธิราชย์", "Absolute Monarchie", "Sombunyanasitthirat"],
                ["c", "ราชาธิปไตยภายใต้รัฐธรรมนูญ", "Konstitutionelle Monarchie", "Rachathippatai phaitai ratthathammanun"],
                ["d", "สหพันธรัฐ", "Föderation", "Sahaphan rat"]
            ],
            "c",
            "การเปลี่ยนแปลงในปี พ.ศ. 2475 ยุติสมบูรณาญาสิทธิราชย์และนำไปสู่ราชาธิปไตยภายใต้รัฐธรรมนูญ",
            "Der Umbruch von 1932 beendete die absolute Monarchie und führte zur konstitutionellen Monarchie.",
            [{ title: "Thailand PRD – History of the Thai Constitution", url: "https://thailand.prd.go.th/history_of_thai_constitution.php" }]
        ),
        makeQuestion(
            "thq-cult-001", "culture", 1, "single_choice",
            "การไหว้เป็นการทักทายแบบไทยที่ใช้ท่าทางใด?",
            "Welche Geste gehört zum thailändischen Gruß Wai?",
            "Kan wai pen kan thakthai baep Thai thi chai thathang dai?",
            [
                ["a", "ประนมมือและก้มศีรษะเล็กน้อย", "Die Handflächen zusammenlegen und leicht den Kopf neigen", "Pranom mue lae kom sisar lek noi"],
                ["b", "ยกมือโบกเหนือศีรษะ", "Die Hand über dem Kopf schwenken", "Yok mue bok nuea sisar"],
                ["c", "แตะไหล่ทั้งสองข้าง", "Beide Schultern berühren", "Tae lai thang song khang"],
                ["d", "คำนับโดยไม่ใช้มือ", "Sich ohne die Hände zu verbeugen", "Khamnap doi mai chai mue"]
            ],
            "a",
            "การไหว้ใช้การประนมมือและมักก้มศีรษะเล็กน้อยเพื่อทักทายหรือแสดงความเคารพ",
            "Beim Wai werden die Handflächen zusammengelegt und der Kopf meist leicht geneigt, um zu grüßen oder Respekt zu zeigen.",
            [{ title: "Tourism Authority of Thailand – Thai Culture", url: "https://www.tourismthailand.org/Articles/thai-culture" }]
        ),
        makeQuestion(
            "thq-cult-002", "culture", 2, "single_choice",
            "เทศกาลสงกรานต์เป็นการฉลองอะไร?",
            "Was wird beim Songkran-Fest gefeiert?",
            "Thetsakan Songkran pen kan chalong arai?",
            [
                ["a", "ปีใหม่ไทยดั้งเดิม", "Das traditionelle thailändische Neujahr", "Pi mai Thai dangdoem"],
                ["b", "วันเริ่มฤดูหนาว", "Der Beginn des Winters", "Wan roem rue du nao"],
                ["c", "วันเก็บเกี่ยวข้าว", "Die Reisernte", "Wan kep kiao khao"],
                ["d", "วันก่อตั้งกรุงเทพฯ", "Die Gründung Bangkoks", "Wan kot tang Krung Thep"]
            ],
            "a",
            "สงกรานต์เป็นเทศกาลปีใหม่ไทยดั้งเดิม จัดขึ้นในช่วงกลางเดือนเมษายน",
            "Songkran ist das traditionelle thailändische Neujahrsfest und findet Mitte April statt.",
            [{ title: "UNESCO – Songkran in Thailand", url: "https://ich.unesco.org/en/RL/songkran-in-thailand-traditional-thai-new-year-festival-01719" }]
        ),
        makeQuestion(
            "thq-cult-003", "culture", 3, "true_false",
            "ธงชาติไทยมีแถบสีน้ำเงินอยู่ตรงกลาง",
            "Die thailändische Flagge hat einen blauen Streifen in der Mitte.",
            "Thong chat Thai mi thaep si nam ngoen yu trong klang.",
            [
                ["true", "จริง", "Wahr", "Ching"],
                ["false", "ไม่จริง", "Falsch", "Mai ching"]
            ],
            "true",
            "ธงชาติไทยมีแถบสีน้ำเงินกว้างอยู่ตรงกลาง ระหว่างแถบสีขาวและสีแดง",
            "Die thailändische Flagge hat einen breiten blauen Mittelstreifen zwischen weißen und roten Streifen.",
            [{ title: "Encyclopaedia Britannica – Flag of Thailand", url: "https://www.britannica.com/topic/flag-of-Thailand" }]
        ),
        makeQuestion(
            "thq-cult-004", "culture", 4, "single_choice",
            "โขนเป็นศิลปะการแสดงแบบใด?",
            "Welche Art von darstellender Kunst ist Khon?",
            "Khon pen sinlapa kan sadaeng baep dai?",
            [
                ["a", "ละครรำสวมหน้ากาก", "Maskiertes Tanzdrama", "Lakhon ram suam na kak"],
                ["b", "การแสดงหุ่นเงา", "Schattenspiel", "Kan sadaeng hun ngao"],
                ["c", "การร้องเพลงประสานเสียง", "Chorgesang", "Kan rong phleng prasan siang"],
                ["d", "การเชิดหุ่นกระบอก", "Marionettentheater", "Kan choet hun krabok"]
            ],
            "a",
            "โขนเป็นศิลปะการแสดงนาฏศิลป์ที่มีเอกลักษณ์และใช้หน้ากาก",
            "Khon ist ein traditionelles thailändisches Tanzdrama, bei dem die Darsteller Masken tragen.",
            [{ title: "UNESCO – Khon, masked dance drama in Thailand", url: "https://ich.unesco.org/en/RL/khon-masked-dance-drama-in-thailand-01385" }]
        ),
        makeQuestion(
            "thq-cult-005", "culture", 4, "single_choice",
            "ในประเพณีลอยกระทง ผู้คนมักทำอะไร?",
            "Was machen viele Menschen beim Loy-Krathong-Fest?",
            "Nai prapheni Loi Krathong phu khon mak tham arai?",
            [
                ["a", "ลอยกระทงที่ประดับตกแต่งลงในน้ำ", "Sie lassen dekorierte Krathongs auf dem Wasser treiben", "Loi krathong thi pradap toktaeng long nai nam"],
                ["b", "ปล่อยว่าวขึ้นฟ้า", "Sie lassen Drachen steigen", "Poi wao khuen fa"],
                ["c", "จุดโคมไฟบนภูเขา", "Sie entzünden Laternen auf Bergen", "Chut khom fai bon phukhao"],
                ["d", "แข่งเรือในแม่น้ำ", "Sie veranstalten Flussbootrennen", "Khaeng ruea nai maenam"]
            ],
            "a",
            "ผู้คนลอยกระทงขนาดเล็กที่ตกแต่งแล้วลงในแม่น้ำหรือแหล่งน้ำ",
            "Beim Loy-Krathong-Fest lassen Menschen kleine, geschmückte Krathongs auf Flüssen und anderen Gewässern treiben.",
            [{ title: "Tourism Authority of Thailand – Loy Krathong", url: "https://www.tourismthailand.org/Articles/loy-krathong-festival" }]
        ),
        makeQuestion(
            "thq-cult-006", "culture", 5, "multiple_choice",
            "เมืองใดบ้างเป็นส่วนหนึ่งของแหล่งมรดกโลกสุโขทัย? เลือกทุกข้อที่ถูกต้อง",
            "Welche Orte gehören gemeinsam zur UNESCO-Welterbestätte Sukhothai? Wähle alle richtigen Antworten.",
            "Mueang dai bang pen suan nueng khong laeng moradok lok Sukhothai? Lueak thuk kho thi thuk tong.",
            [
                ["a", "สุโขทัย", "Sukhothai", "Sukhothai"],
                ["b", "ศรีสัชนาลัย", "Si Satchanalai", "Si Satchanalai"],
                ["c", "กำแพงเพชร", "Kamphaeng Phet", "Kamphaeng Phet"],
                ["d", "ลพบุรี", "Lopburi", "Lop Buri"],
                ["e", "เชียงใหม่", "Chiang Mai", "Chiang Mai"]
            ],
            ["a", "b", "c"],
            "แหล่งมรดกโลกนี้ประกอบด้วยเมืองสุโขทัย ศรีสัชนาลัย และกำแพงเพชร",
            "Die UNESCO-Welterbestätte besteht aus Sukhothai, Si Satchanalai und Kamphaeng Phet.",
            [{ title: "UNESCO – Historic Town of Sukhothai", url: "https://whc.unesco.org/en/list/574/" }]
        ),
        makeQuestion(
            "thq-food-001", "food", 1, "single_choice",
            "ส้มตำทำจากวัตถุดิบหลักชนิดใด?",
            "Welche Hauptzutat wird für Som Tam verwendet?",
            "Som tam tham chak watthudip lak chanit dai?",
            [
                ["a", "มะละกอดิบ", "Grüne Papaya", "Malako dip"],
                ["b", "ฟักทอง", "Kürbis", "Fak thong"],
                ["c", "กะหล่ำปลี", "Weißkohl", "Kalam pli"],
                ["d", "แตงโม", "Wassermelone", "Taeng mo"]
            ],
            "a",
            "ส้มตำเป็นสลัดรสจัดที่ใช้มะละกอดิบเป็นวัตถุดิบหลัก",
            "Som Tam ist ein würziger Salat, dessen Hauptzutat grüne Papaya ist.",
            [{ title: "Tourism Authority of Thailand – Thai Taste", url: "https://www.tourismthailand.org/Articles/explore-thai-taste-thai-foodie-map-2-0-en" }]
        ),
        makeQuestion(
            "thq-food-002", "food", 1, "single_choice",
            "ผัดไทยมักใช้เส้นชนิดใด?",
            "Welche Nudeln werden üblicherweise für Pad Thai verwendet?",
            "Phat Thai mak chai sen chanit dai?",
            [
                ["a", "เส้นข้าว", "Reisnudeln", "Sen khao"],
                ["b", "เส้นบะหมี่ไข่", "Eiernudeln", "Sen bami khai"],
                ["c", "เส้นอุด้ง", "Udon-Nudeln", "Sen udon"],
                ["d", "เส้นโซบะ", "Soba-Nudeln", "Sen soba"]
            ],
            "a",
            "ผัดไทยเป็นเมนูผัดที่ใช้เส้นก๋วยเตี๋ยวจากข้าว",
            "Pad Thai ist ein gebratenes Nudelgericht mit Reisnudeln.",
            [{ title: "Tourism Authority of Thailand – Thai Taste", url: "https://www.tourismthailand.org/Articles/explore-thai-taste-thai-foodie-map-2-0-en" }]
        ),
        makeQuestion(
            "thq-food-003", "food", 2, "single_choice",
            "ต้มยำมักมีรสชาติเด่นแบบใด?",
            "Welches Geschmacksprofil ist typisch für Tom Yam?",
            "Tom yam mak mi rot chat den baep dai?",
            [
                ["a", "เปรี้ยวและเผ็ด", "Sauer und scharf", "Priao lae phet"],
                ["b", "หวานและขม", "Süß und bitter", "Wan lae khom"],
                ["c", "เค็มอย่างเดียว", "Nur salzig", "Khem yang diao"],
                ["d", "จืดและมัน", "Mild und cremig", "Chuet lae man"]
            ],
            "a",
            "ต้มยำเป็นซุปไทยรสเปรี้ยวและเผ็ด มักปรุงด้วยสมุนไพรหอม",
            "Tom Yam ist eine säuerlich-scharfe thailändische Suppe, oft mit aromatischen Kräutern.",
            [{ title: "Tourism Authority of Thailand – Thai Taste", url: "https://www.tourismthailand.org/Articles/explore-thai-taste-thai-foodie-map-2-0-en" }]
        ),
        makeQuestion(
            "thq-food-004", "food", 2, "true_false",
            "ข้าวเหนียวเป็นอาหารที่พบได้บ่อยในภาคอีสาน",
            "Klebreis ist ein häufiges Grundnahrungsmittel im Nordosten Thailands.",
            "Khao niao pen ahan thi phop dai boi nai Phak Isan.",
            [
                ["true", "จริง", "Wahr", "Ching"],
                ["false", "ไม่จริง", "Falsch", "Mai ching"]
            ],
            "true",
            "ข้าวเหนียวเป็นอาหารหลักที่นิยมมากในภาคอีสาน",
            "Klebreis ist ein wichtiges und weit verbreitetes Grundnahrungsmittel im Isan.",
            [{ title: "Encyclopaedia Britannica – Isan", url: "https://www.britannica.com/place/Isan" }]
        ),
        makeQuestion(
            "thq-food-005", "food", 3, "single_choice",
            "ข้าวเหนียวมะม่วงประกอบด้วยอะไรเป็นหลัก?",
            "Aus welchen Hauptzutaten besteht Khao Niao Mamuang?",
            "Khao niao mamuang prakop duai arai pen lak?",
            [
                ["a", "ข้าวเหนียวและมะม่วง", "Klebreis und Mango", "Khao niao lae mamuang"],
                ["b", "ข้าวเจ้าและกล้วย", "Jasminreis und Banane", "Khao chao lae kluai"],
                ["c", "เส้นข้าวและมะพร้าว", "Reisnudeln und Kokosnuss", "Sen khao lae maphrao"],
                ["d", "แป้งข้าวเจ้าและสับปะรด", "Reismehl und Ananas", "Paeng khao chao lae sapparot"]
            ],
            "a",
            "ข้าวเหนียวมะม่วงเป็นของหวานที่เสิร์ฟข้าวเหนียวกับมะม่วงสุก มักมีน้ำกะทิด้วย",
            "Khao Niao Mamuang ist ein Dessert aus Klebreis und reifer Mango, oft mit Kokosmilch.",
            [{ title: "Tourism Authority of Thailand – Thai Taste", url: "https://www.tourismthailand.org/Articles/explore-thai-taste-thai-foodie-map-2-0-en" }]
        ),
        makeQuestion(
            "thq-food-006", "food", 4, "single_choice",
            "แกงมัสมั่นมักใส่วัตถุดิบใดร่วมกับกะทิและเครื่องแกง?",
            "Welche Zutat kommt häufig zusammen mit Kokosmilch und Currypaste in Massaman-Curry?",
            "Kaeng matsaman mak sai watthudip dai ruam kap kathi lae khrueang kaeng?",
            [
                ["a", "มันฝรั่งและถั่วลิสง", "Kartoffeln und Erdnüsse", "Man farang lae thua lisong"],
                ["b", "แตงโมและงาดำ", "Wassermelone und schwarzer Sesam", "Taeng mo lae nga dam"],
                ["c", "กะหล่ำปลีและข้าวโพด", "Kohl und Mais", "Kalam pli lae khao phot"],
                ["d", "สับปะรดและถั่วเขียว", "Ananas und Mungbohnen", "Sapparot lae thua khiao"]
            ],
            "a",
            "แกงมัสมั่นหลายสูตรใช้มันฝรั่งและถั่วลิสงร่วมกับกะทิและเครื่องเทศ",
            "Viele Massaman-Rezepte enthalten Kartoffeln und Erdnüsse neben Kokosmilch und Gewürzen.",
            [{ title: "Tourism Authority of Thailand – Thai Taste", url: "https://www.tourismthailand.org/Articles/explore-thai-taste-thai-foodie-map-2-0-en" }]
        ),
        makeQuestion(
            "thq-nature-001", "nature", 1, "true_false",
            "ช้างเอเชียเป็นสัตว์ที่อาศัยอยู่ตามธรรมชาติในประเทศไทย",
            "Der Asiatische Elefant kommt in Thailand natürlich vor.",
            "Chang Asia pen sat thi asai yu tam thammachat nai prathet Thai.",
            [
                ["true", "จริง", "Wahr", "Ching"],
                ["false", "ไม่จริง", "Falsch", "Mai ching"]
            ],
            "true",
            "ช้างเอเชียมีถิ่นอาศัยในเอเชียใต้และเอเชียตะวันออกเฉียงใต้ รวมถึงประเทศไทย",
            "Der Asiatische Elefant ist in Süd- und Südostasien heimisch, auch in Thailand.",
            [{ title: "IUCN Red List – Asian Elephant", url: "https://www.iucnredlist.org/species/7140/45818198" }]
        ),
        makeQuestion(
            "thq-nature-002", "nature", 2, "single_choice",
            "หมู่เกาะสิมิลันอยู่ในทะเลใด?",
            "In welchem Meer liegen die Similan-Inseln?",
            "Mu ko Similan yu nai thale dai?",
            [
                ["a", "ทะเลอันดามัน", "Andamanensee", "Thale Andaman"],
                ["b", "อ่าวไทย", "Golf von Thailand", "Ao Thai"],
                ["c", "ทะเลจีนใต้", "Südchinesisches Meer", "Thale Chin Tai"],
                ["d", "ทะเลอันดามันตะวันออก", "Ost-Andamanensee", "Thale Andaman Tawan-ok"]
            ],
            "a",
            "หมู่เกาะสิมิลันตั้งอยู่ในทะเลอันดามัน นอกชายฝั่งจังหวัดพังงา",
            "Die Similan-Inseln liegen in der Andamanensee vor der Küste der Provinz Phang Nga.",
            [{ title: "Department of National Parks – Similan Islands", url: "https://www.dnp.go.th/parkreserve/asp/style1/default.asp?npid=212&lg=2" }]
        ),
        makeQuestion(
            "thq-nature-003", "nature", 3, "single_choice",
            "อุทยานแห่งชาติเขาใหญ่มีความสำคัญอย่างไรในประวัติศาสตร์การอนุรักษ์ของไทย?",
            "Welche Bedeutung hat der Khao-Yai-Nationalpark für den Naturschutz in Thailand?",
            "Utthayan haeng chat Khao Yai mi khwam samkhan yangrai nai prawattisat kan anurak khong Thai?",
            [
                ["a", "เป็นอุทยานแห่งชาติแห่งแรกของไทย", "Er war Thailands erster Nationalpark", "Pen utthayan haeng chat haeng raek khong Thai"],
                ["b", "เป็นอุทยานแห่งชาติแห่งเดียวบนเกาะ", "Er ist der einzige Nationalpark auf einer Insel", "Pen utthayan haeng chat haeng diao bon ko"],
                ["c", "เป็นเขตอนุรักษ์ทางทะเลแห่งแรก", "Er war das erste Meeresschutzgebiet", "Pen khet anurak thang thale haeng raek"],
                ["d", "เป็นอุทยานที่เล็กที่สุด", "Er ist der kleinste Nationalpark", "Pen utthayan thi lek thi sut"]
            ],
            "a",
            "เขาใหญ่เป็นอุทยานแห่งชาติแห่งแรกของประเทศไทย",
            "Khao Yai war der erste Nationalpark Thailands.",
            [{ title: "Khao Yai National Park – About", url: "https://www.khaoyainationalpark.com/en/about" }]
        ),
        makeQuestion(
            "thq-nature-004", "nature", 4, "true_false",
            "ป่าชายเลนเติบโตได้ในบริเวณชายฝั่งที่ได้รับอิทธิพลจากน้ำขึ้นน้ำลง",
            "Mangroven wachsen an Küsten, die von den Gezeiten beeinflusst werden.",
            "Pa chai len toepto dai nai boriwen chai fang thi dai ittiphon chak nam khuen nam long.",
            [
                ["true", "จริง", "Wahr", "Ching"],
                ["false", "ไม่จริง", "Falsch", "Mai ching"]
            ],
            "true",
            "ป่าชายเลนเป็นระบบนิเวศชายฝั่งที่ปรับตัวให้เข้ากับน้ำเค็มหรือน้ำกร่อยและน้ำขึ้นน้ำลง",
            "Mangroven sind Küstenökosysteme, die an salziges oder brackiges Wasser und Gezeiten angepasst sind.",
            [{ title: "UNEP – Mangroves", url: "https://www.unep.org/topics/ocean-seas-and-coasts/coastal-ecosystems/mangroves" }]
        ),
        makeQuestion(
            "thq-nature-005", "nature", 5, "single_choice",
            "ผืนป่าดงพญาเย็น-เขาใหญ่ได้รับการขึ้นทะเบียนเป็นมรดกโลกด้านใด?",
            "Als welche Art von Welterbestätte wurde der Dong-Phayayen-Khao-Yai-Waldkomplex eingetragen?",
            "Phuen pa Dong Phaya Yen-Khao Yai dai rap kan khuen thabian pen moradok lok dan dai?",
            [
                ["a", "มรดกโลกทางธรรมชาติ", "Naturerbestätte", "Moradok lok thang thammachat"],
                ["b", "มรดกโลกทางวัฒนธรรม", "Kulturerbestätte", "Moradok lok thang watthanatham"],
                ["c", "เมืองประวัติศาสตร์", "Historische Stadt", "Mueang prawattisat"],
                ["d", "แหล่งโบราณคดีใต้น้ำ", "Unterwasser-Fundstätte", "Laeng borannakhadi tai nam"]
            ],
            "a",
            "ยูเนสโกขึ้นทะเบียนผืนป่าดงพญาเย็น-เขาใหญ่เป็นแหล่งมรดกโลกทางธรรมชาติ",
            "UNESCO führt den Dong-Phayayen-Khao-Yai-Waldkomplex als Naturerbestätte.",
            [{ title: "UNESCO – Dong Phayayen-Khao Yai Forest Complex", url: "https://whc.unesco.org/en/list/590/" }]
        ),
        makeQuestion(
            "thq-nature-006", "nature", 5, "single_choice",
            "เขตรักษาพันธุ์สัตว์ป่าทุ่งใหญ่-ห้วยขาแข้งได้รับการขึ้นทะเบียนเป็นมรดกโลกประเภทใด?",
            "Als welche Art von Welterbestätte sind die Wildschutzgebiete Thungyai-Huai Kha Khaeng eingetragen?",
            "Khet raksa phan sat pa Thung Yai-Huai Kha Khaeng dai rap kan khuen thabian pen moradok lok praphet dai?",
            [
                ["a", "มรดกโลกทางธรรมชาติ", "Naturerbestätte", "Moradok lok thang thammachat"],
                ["b", "มรดกโลกทางวัฒนธรรม", "Kulturerbestätte", "Moradok lok thang watthanatham"],
                ["c", "เมืองประวัติศาสตร์", "Historische Stadt", "Mueang prawattisat"],
                ["d", "ภูมิทัศน์วัฒนธรรม", "Kulturlandschaft", "Phum that watthanatham"]
            ],
            "a",
            "ทุ่งใหญ่-ห้วยขาแข้งได้รับการขึ้นทะเบียนเป็นมรดกโลกทางธรรมชาติ",
            "Thungyai-Huai Kha Khaeng ist als Naturerbestätte eingetragen.",
            [{ title: "UNESCO – Thungyai-Huai Kha Khaeng Wildlife Sanctuaries", url: "https://whc.unesco.org/en/list/591/" }]
        ),
        makeQuestion(
            "thq-sport-001", "sport", 1, "single_choice",
            "มวยไทยเป็นกีฬาต่อสู้ที่มีต้นกำเนิดจากประเทศใด?",
            "Aus welchem Land stammt Muay Thai?",
            "Muay Thai pen kila tosu thi mi ton kamnoet chak prathet dai?",
            [
                ["a", "ประเทศไทย", "Thailand", "Prathet Thai"],
                ["b", "ญี่ปุ่น", "Japan", "Yipun"],
                ["c", "เกาหลีใต้", "Südkorea", "Kao-li Tai"],
                ["d", "อินเดีย", "Indien", "India"]
            ],
            "a",
            "มวยไทยเป็นศิลปะการต่อสู้ที่พัฒนาขึ้นในประเทศไทย",
            "Muay Thai ist eine Kampfkunst, die sich in Thailand entwickelt hat.",
            [{ title: "Encyclopaedia Britannica – Muay Thai", url: "https://www.britannica.com/sports/Muay-Thai" }]
        ),
        makeQuestion(
            "thq-sport-002", "sport", 2, "single_choice",
            "กีฬาเซปักตะกร้อใช้ลูกบอลชนิดใด?",
            "Mit welcher Art von Ball wird Sepak Takraw traditionell gespielt?",
            "Kila sepak takraw chai lukbon chanit dai?",
            [
                ["a", "ลูกบอลสานจากหวาย", "Ein geflochtener Rattanball", "Lukbon san chak wai"],
                ["b", "ลูกบอลหนังขนาดใหญ่", "Ein großer Lederball", "Lukbon nang khanat yai"],
                ["c", "ลูกบอลยางตัน", "Ein massiver Gummiball", "Lukbon yang tan"],
                ["d", "ลูกขนไก่", "Ein Federball", "Luk khon kai"]
            ],
            "a",
            "ลูกตะกร้อแบบดั้งเดิมสานจากหวาย ส่วนลูกแข่งขันสมัยใหม่มักทำจากวัสดุสังเคราะห์",
            "Traditionelle Takraw-Bälle werden aus Rattan geflochten; moderne Wettkampfbälle bestehen oft aus synthetischem Material.",
            [{ title: "International Sepaktakraw Federation – Rules", url: "https://www.sepaktakraw.org/" }]
        ),
        makeQuestion(
            "thq-sport-003", "sport", 3, "single_choice",
            "นักมวยไทยใช้ส่วนใดของร่างกายในการต่อสู้ตามแนวคิด “ศิลปะแปดแขนขา”?",
            "Welche Körperteile nutzt Muay Thai nach dem Prinzip der „Kunst der acht Gliedmaßen“?",
            "Nak muai Thai chai suan dai khong rang kai nai kan tosu tam naeo khit sinlapa paet khaen kha?",
            [
                ["a", "หมัด ศอก เข่า และแข้ง", "Fäuste, Ellbogen, Knie und Schienbeine", "Mat, sok, khao, lae khaeng"],
                ["b", "มือและเท้าเท่านั้น", "Nur Hände und Füße", "Mue lae thao thaonan"],
                ["c", "ศอกและเข่าเท่านั้น", "Nur Ellbogen und Knie", "Sok lae khao thaonan"],
                ["d", "หัวไหล่และศีรษะ", "Schultern und Kopf", "Hualai lae sisar"]
            ],
            "a",
            "แนวคิดศิลปะแปดแขนขาหมายถึงการใช้หมัดสองข้าง ศอกสองข้าง เข่าสองข้าง และแข้งหรือเท้าสองข้าง",
            "Die acht Gliedmaßen stehen für zwei Fäuste, zwei Ellbogen, zwei Knie und zwei Schienbeine beziehungsweise Füße.",
            [{ title: "Encyclopaedia Britannica – Muay Thai", url: "https://www.britannica.com/sports/Muay-Thai" }]
        ),
        makeQuestion(
            "thq-sport-004", "sport", 4, "single_choice",
            "พิธีไหว้ครูรำมวยจัดขึ้นเมื่อใดในการแข่งขันมวยไทย?",
            "Wann wird das Wai-Khru-Ram-Muay-Ritual bei einem Muay-Thai-Kampf ausgeführt?",
            "Phithi wai khru ram muai chat khuen muea dai nai kan khaeng khan Muay Thai?",
            [
                ["a", "ก่อนเริ่มการต่อสู้", "Vor Beginn des Kampfes", "Kon roem kan tosu"],
                ["b", "หลังจบยกสุดท้ายเท่านั้น", "Nur nach der letzten Runde", "Lang chop yok sutthai thaonan"],
                ["c", "ระหว่างพักครึ่ง", "Während der Halbzeitpause", "Rawang phak khrueng"],
                ["d", "หลังประกาศผลเท่านั้น", "Nur nach der Ergebnisverkündung", "Lang prakat phon thaonan"]
            ],
            "a",
            "นักมวยแสดงรำมวยก่อนการแข่งขันเพื่อแสดงความเคารพต่อครูและประเพณี",
            "Der Wai Khru Ram Muay findet vor dem Kampf statt und erweist Lehrern und Tradition Respekt.",
            [{ title: "Encyclopaedia Britannica – Muay Thai", url: "https://www.britannica.com/sports/Muay-Thai" }]
        ),
        makeQuestion(
            "thq-sport-005", "sport", 4, "true_false",
            "ในการแข่งขันเซปักตะกร้อ ผู้เล่นสามารถใช้มือสัมผัสลูกบอลได้",
            "Beim Sepak Takraw dürfen Spieler den Ball mit den Händen berühren.",
            "Nai kan khaeng khan sepak takraw phu len samat chai mue samphat lukbon dai.",
            [
                ["true", "จริง", "Wahr", "Ching"],
                ["false", "ไม่จริง", "Falsch", "Mai ching"]
            ],
            "false",
            "ผู้เล่นเซปักตะกร้อใช้เท้า ศีรษะ และส่วนอื่นของร่างกายได้ แต่ห้ามใช้มือหรือแขน",
            "Beim Sepak Takraw darf der Ball mit Füßen, Kopf und anderen Körperteilen gespielt werden, nicht aber mit Händen oder Armen.",
            [{ title: "International Sepaktakraw Federation – Rules", url: "https://www.sepaktakraw.org/" }]
        ),
        makeQuestion(
            "thq-sport-006", "sport", 5, "single_choice",
            "ผ้าคาดแขนที่นักมวยไทยบางคนสวมเรียกว่าอะไร?",
            "Wie heißt das Stoffband, das manche Muay-Thai-Kämpfer am Oberarm tragen?",
            "Pha khat khaen thi nak muai Thai bang khon suam riak wa arai?",
            [
                ["a", "ประเจียด", "Pra Jiad", "Pra chiat"],
                ["b", "ผ้าขาวม้า", "Pha Khao Ma", "Pha khao ma"],
                ["c", "สไบ", "Sabai", "Sabai"],
                ["d", "โจงกระเบน", "Chong Kraben", "Chong kraben"]
            ],
            "a",
            "ประเจียดเป็นผ้าคาดแขนที่นักมวยไทยบางคนสวมตามธรรมเนียม",
            "Pra Jiad ist ein traditionelles Stoffband, das manche Muay-Thai-Kämpfer am Oberarm tragen.",
            [{ title: "Encyclopaedia Britannica – Muay Thai", url: "https://www.britannica.com/sports/Muay-Thai" }]
        )
    ];

    const data = { categories, questions };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = data;
    }

    if (root) {
        root.THAILAND_QUIZ_DATA = data;
    }
})(typeof window !== "undefined" ? window : null);
