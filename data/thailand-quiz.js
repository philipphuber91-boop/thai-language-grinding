(function (root) {
    "use strict";

    const categories = [
        { id: "geography", icon: "🌏", th: "ภูมิศาสตร์", de: "Geografie" },
        { id: "history", icon: "📜", th: "ประวัติศาสตร์", de: "Geschichte" },
        { id: "culture", icon: "🎎", th: "วัฒนธรรม", de: "Kultur" },
        { id: "food", icon: "🍜", th: "อาหาร", de: "Essen" },
        { id: "nature", icon: "🐘", th: "ธรรมชาติ", de: "Natur" },
        { id: "sport", icon: "🥊", th: "กีฬา", de: "Sport" },
        { id: "religion", icon: "🏛️", th: "ศาสนาและวัด", de: "Religion & Tempel" },
        { id: "language_daily", icon: "💬", th: "ภาษาและชีวิตประจำวัน", de: "Alltag & Sprache" }
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
        ),
        makeQuestion(
            "thq-geo-007", "geography", 2, "single_choice",
            "แม่น้ำสายใดไหลผ่านกรุงเทพฯ และลงสู่อ่าวไทย?",
            "Welcher Fluss fließt durch Bangkok und mündet in den Golf von Thailand?",
            "Maenam sai dai lai phan Krung Thep lae long su Ao Thai?",
            [
                ["a", "แม่น้ำโขง", "Mekong", "Maenam Khong"],
                ["b", "แม่น้ำเจ้าพระยา", "Chao Phraya", "Maenam Chao Phraya"],
                ["c", "แม่น้ำปิง", "Ping", "Maenam Ping"],
                ["d", "แม่น้ำน่าน", "Nan", "Maenam Nan"]
            ],
            "b",
            "แม่น้ำเจ้าพระยาไหลผ่านกรุงเทพฯ และมีปากแม่น้ำที่อ่าวไทย",
            "Der Chao Phraya fließt durch Bangkok und mündet in den Golf von Thailand.",
            [{ title: "Encyclopaedia Britannica – Chao Phraya River", url: "https://www.britannica.com/place/Chao-Phraya-River" }]
        ),
        makeQuestion(
            "thq-hist-007", "history", 3, "single_choice",
            "หลังจากกรุงศรีอยุธยาเสียกรุงใน พ.ศ. 2310 เมืองใดเป็นราชธานีก่อนกรุงเทพฯ?",
            "Welche Stadt war nach dem Fall Ayutthayas 1767 vor Bangkok die Hauptstadt Siams?",
            "Lang chak Krung Si Ayutthaya sia krung nai Phutthasakkarat 2310 mueang dai pen ratchathani kon Krung Thep?",
            [
                ["a", "เชียงใหม่", "Chiang Mai", "Chiang Mai"],
                ["b", "ธนบุรี", "Thonburi", "Thon Buri"],
                ["c", "สุโขทัย", "Sukhothai", "Sukhothai"],
                ["d", "นครราชสีมา", "Nakhon Ratchasima", "Nakhon Ratchasima"]
            ],
            "b",
            "หลังกรุงศรีอยุธยาแตกในปี 1767 สมเด็จพระเจ้าตากสินทรงตั้งธนบุรีเป็นราชธานี ก่อนย้ายไปกรุงเทพฯ ในปี 1782",
            "Nach dem Fall Ayutthayas 1767 machte König Taksin Thonburi zur Hauptstadt; 1782 wurde die Hauptstadt nach Bangkok verlegt.",
            [{ title: "Encyclopaedia Britannica – The Thon Buri and Early Bangkok Periods", url: "https://www.britannica.com/place/Thailand/The-Thon-Buri-and-Early-Bangkok-periods" }]
        ),
        makeQuestion(
            "thq-cult-007", "culture", 2, "single_choice",
            "เทศกาลผีตาโขนจัดขึ้นในจังหวัดใด?",
            "In welcher Provinz findet das Phi-Ta-Khon-Fest statt?",
            "Thetsakan Phi Ta Khon chat khuen nai changwat dai?",
            [
                ["a", "เลย", "Loei", "Loei"],
                ["b", "ภูเก็ต", "Phuket", "Phuket"],
                ["c", "สุราษฎร์ธานี", "Surat Thani", "Surat Thani"],
                ["d", "ชลบุรี", "Chonburi", "Chon Buri"]
            ],
            "a",
            "เทศกาลผีตาโขนจัดขึ้นที่อำเภอด่านซ้าย จังหวัดเลย",
            "Das Phi-Ta-Khon-Fest findet im Bezirk Dan Sai in der Provinz Loei statt.",
            [{ title: "Tourism Authority of Thailand – Phi Ta Khon Festival", url: "https://www.tourismthailand.org/Events-and-Festivals/phi-ta-khon-festival-2025-2" }]
        ),
        makeQuestion(
            "thq-food-007", "food", 2, "single_choice",
            "ข้าวซอยเป็นอาหารท้องถิ่นที่มีชื่อเสียงของภูมิภาคใด?",
            "Für welche Region Thailands ist Khao Soi besonders bekannt?",
            "Khao soi pen ahan thongthin thi mi chue siang khong phumiphak dai?",
            [
                ["a", "ภาคเหนือ", "Der Norden", "Phak Nuea"],
                ["b", "ภาคใต้", "Der Süden", "Phak Tai"],
                ["c", "ภาคกลาง", "Die Zentralregion", "Phak Klang"],
                ["d", "ภาคตะวันออกเฉียงเหนือ", "Der Nordosten", "Phak Tawan-ok Chiang Nuea"]
            ],
            "a",
            "ข้าวซอยเป็นอาหารขึ้นชื่อของภาคเหนือ โดยเฉพาะเชียงใหม่",
            "Khao Soi ist ein bekanntes Gericht Nordthailands, besonders aus Chiang Mai.",
            [{ title: "Tourism Authority of Thailand – Yummy Delicacies at Chiang Mai Night Market", url: "https://www.tourismthailand.org/Article/yummy-delicacies-at-chiang-mai-night-market" }]
        ),
        makeQuestion(
            "thq-nature-007", "nature", 3, "single_choice",
            "อ่างเก็บน้ำเชี่ยวหลานอยู่ในอุทยานแห่งชาติใด?",
            "In welchem Nationalpark liegt der Cheow-Lan-Stausee?",
            "Ang kep nam Chiao Lan yu nai utthayan haeng chat dai?",
            [
                ["a", "อุทยานแห่งชาติเขาสก", "Khao-Sok-Nationalpark", "Utthayan haeng chat Khao Sok"],
                ["b", "อุทยานแห่งชาติเขาใหญ่", "Khao-Yai-Nationalpark", "Utthayan haeng chat Khao Yai"],
                ["c", "อุทยานแห่งชาติดอยอินทนนท์", "Doi-Inthanon-Nationalpark", "Utthayan haeng chat Doi Inthanon"],
                ["d", "อุทยานแห่งชาติหมู่เกาะสิมิลัน", "Similan-Inseln-Nationalpark", "Utthayan haeng chat Mu Ko Similan"]
            ],
            "a",
            "อ่างเก็บน้ำเชี่ยวหลานหรือเขื่อนรัชชประภาเป็นจุดเด่นของอุทยานแห่งชาติเขาสก",
            "Der Cheow-Lan-Stausee, auch Ratchaprapha-Stausee genannt, gehört zu den bekanntesten Orten im Khao-Sok-Nationalpark.",
            [{ title: "Tourism Authority of Thailand – Khao Sok National Park", url: "https://www.tourismthailand.org/Attraction/khao-sok-national-park" }]
        ),
        makeQuestion(
            "thq-sport-007", "sport", 2, "single_choice",
            "กีฬาเซปักตะกร้อแบบเรกูมีผู้เล่นในหนึ่งทีมกี่คน?",
            "Wie viele Spieler hat ein Team beim Sepak Takraw im Regu-Format?",
            "Kila sepak takraw baep regu mi phu len nai nueng thim ki khon?",
            [
                ["a", "สองคน", "Zwei", "Song khon"],
                ["b", "สามคน", "Drei", "Sam khon"],
                ["c", "สี่คน", "Vier", "Si khon"],
                ["d", "ห้าคน", "Fünf", "Ha khon"]
            ],
            "b",
            "การแข่งขันแบบเรกูใช้ผู้เล่นทีมละสามคน โดยหนึ่งคนเป็นผู้เสิร์ฟและอีกสองคนอยู่ด้านหน้า",
            "Im Regu-Format besteht jedes Team aus drei Spielern: einem Aufschläger und zwei Spielern vorne am Netz.",
            [{ title: "Sepak Takraw Association of Canada – Regu Rules", url: "https://sepaktakraw.ca/regu-sepak-takraw" }]
        )
,
        makeQuestion(
            "thq-geo-008", "geography", 2, "single_choice",
            "สามเหลี่ยมทองคำในภาคเหนือของไทยเป็นจุดบรรจบของพรมแดนสามประเทศ คือไทย ลาว และประเทศใด?",
            "Das Goldene Dreieck in Nordthailand ist der Grenztreffpunkt dreier Länder: Thailand, Laos und welchem weiteren Land?",
            "Sam liam thong kham nai phak nuea khong Thai pen chut ban chop khong phromdaen sam prathet khue Thai, Lao lae prathet dai?",
            [
                ["a", "พม่า (เมียนมา)", "Myanmar (Birma)", "Phama (Mianma)"],
                ["b", "กัมพูชา", "Kambodscha", "Kampuchia"],
                ["c", "เวียดนาม", "Vietnam", "Wiatnam"],
                ["d", "จีน", "China", "Chin"]
            ],
            "a",
            "สามเหลี่ยมทองคำในจังหวัดเชียงรายเป็นจุดที่แม่น้ำรวกและแม่น้ำโขงมาบรรจบกัน เชื่อมต่อไทย ลาว และพม่า",
            "Das Goldene Dreieck in der Provinz Chiang Rai markiert den Zusammenfluss von Ruak und Mekong an den Grenzen von Thailand, Laos und Myanmar.",
            [{ title: "Tourism Authority of Thailand – Golden Triangle", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-geo-009", "geography", 3, "single_choice",
            "อ่าวมาหยาที่มีชื่อเสียงระดับโลกตั้งอยู่บนเกาะใดในทะเลอันดามัน?",
            "In welcher weltberühmten Bucht liegt Maya Bay in der Andamanensee?",
            "Ao Maya thi mi chue siang radap lok tang yu bon ko dai nai thale Andaman?",
            [
                ["a", "เกาะพีพีดอน", "Koh Phi Phi Don", "Ko Phi Phi Don"],
                ["b", "เกาะพีพีเล", "Koh Phi Phi Leh", "Ko Phi Phi Le"],
                ["c", "เกาะลันตา", "Koh Lanta", "Ko Lanta"],
                ["d", "เกาะเต่า", "Koh Tao", "Ko Tao"]
            ],
            "b",
            "อ่าวมาหยาตั้งอยู่บนเกาะพีพีเล ในจังหวัดกระบี่ มีหาดทรายขาวละเอียดและหน้าผาหินปูนล้อมรอบ",
            "Maya Bay liegt auf der unbewohnten Insel Koh Phi Phi Leh in der Provinz Krabi und ist berühmt für ihre steilen Kalksteinfelsen und türkisblaues Wasser.",
            [{ title: "Department of National Parks Thailand – Hat Noppharat Thara-Mu Ko Phi Phi", url: "https://www.dnp.go.th/" }]
        ),
        makeQuestion(
            "thq-his-008", "history", 2, "single_choice",
            "สมเด็จพระเจ้าตากสินมหาราชทรงสถาปนาราชธานีแห่งใหม่หลังการเสียกรุงศรีอยุธยาขึ้นที่เมืองใด?",
            "Welche Stadt machte König Taksin der Große nach dem Fall Ayutthayas zur neuen Hauptstadt Siams?",
            "Somdet Phra Chao Taksin Maharat song sathapana ratchathani haeng mai lang kan sia Krung Si Ayutthaya khuen thi mueang dai?",
            [
                ["a", "ธนบุรี", "Thonburi", "Thonburi"],
                ["b", "ลพบุรี", "Lopburi", "Lopburi"],
                ["c", "พิษณุโลก", "Phitsanulok", "Phitsanulok"],
                ["d", "นครศรีธรรมราช", "Nakhon Si Thammarat", "Nakhon Si Thammarat"]
            ],
            "a",
            "สมเด็จพระเจ้าตากสินมหาราชทรงกอบกู้เอกราชและสถาปนากรุงธนบุรีเป็นราชธานีริมแม่น้ำเจ้าพระยาในปี พ.ศ. 2310",
            "König Taksin befreite Siam und gründete 1767 die neue Hauptstadt Thonburi am westlichen Ufer des Chao-Phraya-Flusses.",
            [{ title: "Royal Thai Embassy – King Taksin the Great", url: "https://www.thaiembassy.org/" }]
        ),
        makeQuestion(
            "thq-his-009", "history", 3, "single_choice",
            "สะพานข้ามแม่น้ำแควในจังหวัดกาญจนบุรีสร้างขึ้นในช่วงเหตุการณ์ประวัติศาสตร์ใด?",
            "Während welchen historischen Ereignisses wurde die Brücke am Kwai in Kanchanaburi erbaut?",
            "Saphan kham mae nam Khwae nai changwat Kanchanaburi sang khuen nai chuang hetkan prawattisat dai?",
            [
                ["a", "สงครามโลกครั้งที่ 2", "Zweiter Weltkrieg", "Songkhram lok khrang thi 2"],
                ["b", "สงครามโลกครั้งที่ 1", "Erster Weltkrieg", "Songkhram lok khrang thi 1"],
                ["c", "สงครามเวียดนาม", "Vietnamkrieg", "Songkhram Wiatnam"],
                ["d", "สงครามเก้าทัพ", "Neun-Armeen-Krieg", "Songkhram kao thap"]
            ],
            "a",
            "สะพานข้ามแม่น้ำแควและทางรถไฟสายมรณะสร้างขึ้นโดยกองทัพญี่ปุ่นในสมัยสงครามโลกครั้งที่ 2",
            "Die Brücke am Kwai und die sogenannte Todeseisenbahn wurden im Zweiten Weltkrieg unter japanischer Besatzung durch Kriegsgefangene und Zwangsarbeiter errichtet.",
            [{ title: "Tourism Authority of Thailand – Bridge over the River Kwai", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-cul-008", "culture", 2, "single_choice",
            "ชุดแต่งกายประจำชาติไทยแบบดั้งเดิมที่นิยมสวมใส่ในงานพิธีสำคัญเรียกว่าอะไร?",
            "Wie heißt die traditionelle thailändische Nationaltracht, die bei feierlichen Anlässen getragen wird?",
            "Chut taengkai pracham chat Thai baep dangdoem thi niyom suam sai nai ngan phithi samkhan riak wa arai?",
            [
                ["a", "ชุดไทย", "Chut Thai", "Chut Thai"],
                ["b", "ชุดกิโมโน", "Kimono", "Chut kimono"],
                ["c", "ชุดฮันบก", "Hanbok", "Chut hanbok"],
                ["d", "ชุดสารี", "Sari", "Chut sari"]
            ],
            "a",
            "ชุดไทยพระราชนิยมเป็นชุดประจำชาติที่มีความงดงามและมีหลากหลายรูปแบบตามโอกาสสำคัญ",
            "Chut Thai ist die elegante traditionelle Nationalkleidung Thailands, die für Frauen und Männer in verschiedenen formalen Stilen existiert.",
            [{ title: "Ministry of Culture Thailand – Chut Thai Heritage", url: "https://www.m-culture.go.th/" }]
        ),
        makeQuestion(
            "thq-cul-009", "culture", 3, "single_choice",
            "ตามธรรมเนียมไทย ส่วนใดของร่างกายถือว่ามีความสำคัญและมีความศักดิ์สิทธิ์สูงที่สุด ไม่ควรสัมผัสเล่น?",
            "Welcher Körperteil gilt in der thailändischen Tradition als der spirituell heiligste und sollte nicht berührt werden?",
            "Tam thamniam Thai suan dai khong rangkai thue wa mi khwam samkhan lae mi khwam saksit sung thi sut, mai khuan samphat len?",
            [
                ["a", "ศีรษะ (หัว)", "Kopf", "Sisa (hua)"],
                ["b", "ไหล่", "Schulter", "Lai"],
                ["c", "มือ", "Hand", "Mue"],
                ["d", "เท้า", "Fuß", "Thao"]
            ],
            "a",
            "คนไทยถือว่าศีรษะเป็นส่วนสูงสุดและมีความศักดิ์สิทธิ์ จึงไม่ควรสัมผัสศีรษะของผู้อื่นโดยไม่ได้รับอนุญาต",
            "Der Kopf gilt im thailändischen Glauben als der heiligste Teil des Körpers und der Sitz der Seele; ihn bei anderen zu berühren gilt als unhöflich.",
            [{ title: "Tourism Authority of Thailand – Cultural Etiquette in Thailand", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-foo-008", "food", 2, "single_choice",
            "เครื่องดื่มชาเย็นไทยที่มีสีส้มอันเป็นเอกลักษณ์และมีรสชาติหวานมัน มักเติมนมชนิดใด?",
            "Welche Zutat verleiht dem berühmten orangefarbenen Thai-Eistee (Cha Yen) seine cremige Süße?",
            "Khrueang duem cha yen Thai thi mi si som an pen ekkalak lae mi rotchat wan man, mak toem nom chanit dai?",
            [
                ["a", "นมข้นหวานและนมข้นจืด", "Gezuckerte und ungezuckerte Kondensmilch", "Nom khon wan lae nom khon chuet"],
                ["b", "น้ำส้มสายชู", "Essig", "Nam som sai chu"],
                ["c", "น้ำมันพืช", "Pflanzenöl", "Nam man phuet"],
                ["d", "น้ำมะนาวบริสุทธิ์", "Reiner Limettensaft", "Nam manao borisut"]
            ],
            "a",
            "ชาไทยเย็นชงจากชาดำเข้มข้น ผสมนมข้นหวานและราดด้วยนมข้นจืด เสิร์ฟพร้อมน้ำแข็งเย็นชื่นใจ",
            "Klassischer Cha Yen wird aus aromatischem Schwarztee gebrüht, mit gesüßter Kondensmilch verrührt und mit Kondensmilch über Eis serviert.",
            [{ title: "Tourism Authority of Thailand – The Story of Thai Tea", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-foo-009", "food", 2, "single_choice",
            "ผลไม้ชนิดใดได้รับยกย่องให้เป็น 'ราชาแห่งผลไม้' (King of Fruits) ในประเทศไทย?",
            "Welche Frucht wird in Thailand als die 'Königin der Früchte' (King of Fruits) bezeichnet?",
            "Phonlamai chanit dai dairap yokyong hai pen 'racha haeng phonlamai' nai prathet Thai?",
            [
                ["a", "ทุเรียน", "Durian", "Thurian"],
                ["b", "มังคุด", "Mangostane", "Mangkut"],
                ["c", "เงาะ", "Rambutan", "Ngo"],
                ["d", "ลำไย", "Longan", "Lamyai"]
            ],
            "a",
            "ทุเรียนเป็นราชาแห่งผลไม้ด้วยกลิ่นหอมเฉพาะตัวและเนื้อครีมเข้มข้น ส่วนมังคุดได้รับการขนานนามเป็นราชินีแห่งผลไม้",
            "Die Durian gilt wegen ihres unverwechselbaren Geschmacks als 'König der Früchte', während die feine Mangostane als 'Königin' bezeichnet wird.",
            [{ title: "Department of Agriculture Thailand – Thai Tropical Fruits", url: "https://www.doa.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-008", "nature", 2, "single_choice",
            "ป่าชายเลนมีความสำคัญอย่างยิ่งต่อระบบนิเวศริมชายฝั่งเพราะเหตุใด?",
            "Warum sind Mangrovenwälder (Pa Chai Len) an den Küsten Thailands ökologisch so wertvoll?",
            "Pa chai len mi khwam samkhan yang ying to rapop niwet rim chai fang phro het dai?",
            [
                ["a", "ช่วยป้องกันการกัดเซาะชายฝั่งและเป็นแหล่งอนุบาลสัตว์น้ำ", "Schutz vor Küstenerosion und Kinderstube für Meerestiere", "Chuai pongkan kan katso chai fang lae pen laeng anuban sat nam"],
                ["b", "เป็นแหล่งปลูกข้าวสาลีที่ใหญ่ที่สุด", "Größtes Anbaugebiet für Weizen", "Pen laeng pluk khao sali thi yai thi sut"],
                ["c", "ทำให้น้ำทะเลกลายเป็นน้ำจืดทั้งหมด", "Sie verwandeln Meerwasser komplett in Süßwasser", "Tham hai nam thale klaipen nam chuet thang mot"],
                ["d", "ป้องกันไม่ให้มีแสงแดดส่องถึงพื้นดิน", "Sie verhindern jegliches Sonnenlicht am Boden", "Pongkan mai hai mi saeng daet song thueng phuen din"]
            ],
            "a",
            "รากของต้นโกงกางในป่าชายเลนช่วยยึดหน้าดิน ป้องกันคลื่นลม และเป็นที่หลบภัยของสัตว์น้ำวัยอ่อน",
            "Mangrovenwurzeln stabilisieren Küstenlinien gegen Sturmwellen, verhindern Abtragungen und dienen Fischen und Krabben als geschützte Kinderstube.",
            [{ title: "Department of Marine and Coastal Resources – Mangroves in Thailand", url: "https://www.dmcr.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-009", "nature", 3, "single_choice",
            "สัตว์เลี้ยงลูกด้วยนมขนาดเล็กชนิดใดพบได้ในถ้ำหินปูนของไทยและเป็นค้างคาวที่เล็กที่สุดในโลก?",
            "Welches winzige Säugetier lebt in Kalksteinhöhlen Thailands und gilt als die kleinste Fledermaus der Welt?",
            "Sat liang luk duai nom khanat lek chanit dai phop dai nai tham hin pun khong Thai lae pen khangkhao thi lek thi sut nai lok?",
            [
                ["a", "ค้างคาวคุณกิตติ", "Hummelfledermaus (Kitti-Schweinsschnauzenfledermaus)", "Khangkhao khun kitti"],
                ["b", "ค้างคาวแม่ไก่", "Flughund", "Khangkhao mae kai"],
                ["c", "บ่าง", "Gleitflieger", "Bang"],
                ["d", "กระรอกบิน", "Gleithörnchen", "Krarok bin"]
            ],
            "a",
            "ค้างคาวคุณกิตติพบครั้งแรกในจังหวัดกาญจนบุรี มีน้ำหนักเพียงประมาณ 2 กรัมและเป็นสัตว์เลี้ยงลูกด้วยนมที่เล็กที่สุดในโลกชนิดหนึ่ง",
            "Die Hummelfledermaus wurde in Kanchanaburi entdeckt, wiegt nur rund 2 Gramm und ist das kleinste Säugetier unseres Planeten.",
            [{ title: "EDGE of Existence – Kitti's Hog-nosed Bat", url: "https://www.edgeofexistence.org/" }]
        ),
        makeQuestion(
            "thq-sport-008", "sport", 2, "single_choice",
            "กีฬามวยไทยได้รับการขนานนามว่าเป็น 'ศาสตร์แห่งอาวุธทั้ง...' กี่ชนิด?",
            "Als die 'Kunst der ... Waffen' wird Muay Thai wegen des Einsatzes von Fäusten, Ellbogen, Knien und Schienbeinen bezeichnet?",
            "Kila muai Thai dairap kan khanan nam wa pen 'sat haeng awut thang...' ki chanit?",
            [
                ["a", "แปด (8)", "Acht (8) Gliedmaßen", "Paet"],
                ["b", "สี่ (4)", "Vier (4) Gliedmaßen", "Si"],
                ["c", "หก (6)", "Sechs (6) Gliedmaßen", "Hok"],
                ["d", "สิบ (10)", "Zehn (10) Gliedmaßen", "Sip"]
            ],
            "a",
            "มวยไทยเรียกว่าศาสตร์แห่งอาวุธทั้ง 8 (Art of Eight Limbs) เพราะใช้หมัด ศอก เข่า และแข้ง/เท้า ทั้งสองข้างในการต่อสู้",
            "Muay Thai wird 'Art of Eight Limbs' genannt, da Kämpfer Fäuste, Ellbogen, Knie und Schienbeine beidseitig im Kampf einsetzen.",
            [{ title: "World Muaythai Council – History of Muay Thai", url: "https://wmcmuaythai.org/" }]
        ),
        makeQuestion(
            "thq-sport-009", "sport", 3, "single_choice",
            "การแข่งขันว่าวไทยโบราณที่สู้กันบนท้องฟ้าเป็นการประลองระหว่างว่าวชนิดใดกับว่าวชนิดใด?",
            "Welche beiden traditionellen Drachentypen treten im klassischen siamesischen Drachenkampf gegeneinander an?",
            "Kan khaeng khan wao Thai boran thi su kan bon thong fa pen kan pralong rawang wao chanit dai kap wao chanit dai?",
            [
                ["a", "ว่าวจุฬากับว่าวปักเป้า", "Wao Chula gegen Wao Pakpao", "Wao Chula kap wao Pakpao"],
                ["b", "ว่าวงูกับว่าวนก", "Schlangendrachen gegen Vogeldrachen", "Wao ngu kap wao nok"],
                ["c", "ว่าวดวงดาวกับว่าวพระจันทร์", "Sterndrachen gegen Monddrachen", "Wao duang dao kap wao phra chan"],
                ["d", "ว่าวใบไม้กับว่าวสายรุ้ง", "Blattdrachen gegen Regenbogendrachen", "Wao bai mai kap wao sai rung"]
            ],
            "a",
            "การต่อสู้ว่าวไทยเป็นการต่อสู้เชิงกลยุทธ์ระหว่างว่าวจุฬาตัวใหญ่รูปดาวห้าแฉก (ตัวผู้) กับว่าวปักเป้าตัวเล็กรูปสี่เหลี่ยมขนมเปียกปูน (ตัวเมีย)",
            "Der traditionelle thailändische Drachenkampf ist ein faszinierendes Duell zwischen dem großen sternförmigen Chula-Drachen und dem wendigen Pakpao-Drachen.",
            [{ title: "Tourism Authority of Thailand – Traditional Thai Kite Fighting", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-rel-005", "religion", 2, "single_choice",
            "วัดอรุณราชวราราม มีจุดเด่นทางสถาปัตยกรรมที่ตั้งตระหง่านริมแม่น้ำเจ้าพระยา คือสิ่งใด?",
            "Welches architektonische Wahrzeichen zeichnet den Tempel der Morgenröte (Wat Arun) am Chao-Phraya-Ufer aus?",
            "Wat Arun Ratchawararam mi chut den thang sathapattayakam thi tang tranghan rim mae nam Chao Phraya khue sing dai?",
            [
                ["a", "พระปรางค์ประดับกระเบื้องเคลือบสีโบราณ", "Ein hoher Prang (Stupa), verziert mit buntem Porzellan", "Phra prang pradap krabueang khlueap si boran"],
                ["b", "หอระฆังไม้สักทองขนาดใหญ่", "Ein riesiger hölzerner Glockenturm", "Ho rakhang mai sak thong khanat yai"],
                ["c", "สะพานกระจกใสลอยฟ้า", "Eine gläserne Hängebrücke", "Saphan krachok sai loi fa"],
                ["d", "พีระมิดหินทรายแบบอียิปต์", "Eine Sandsteinpyramide", "Phiramit hin sai baep Iyip"]
            ],
            "a",
            "พระปรางค์วัดอรุณมีความสูงกว่า 70 เมตร ประดับด้วยเศษกระเบื้องเคลือบและถ้วยชามเบญจรงค์ลวดลายวิจิตร",
            "Der über 70 Meter hohe Prang von Wat Arun ist mit tausenden bunten Porzellan- und Keramikscherben verziert, die im Sonnenlicht funkeln.",
            [{ title: "Tourism Authority of Thailand – Wat Arun", url: "https://www.tourismthailand.org/Attraction/wat-arun" }]
        ),
        makeQuestion(
            "thq-rel-006", "religion", 2, "single_choice",
            "การตักบาตรพระสงฆ์ในยามเช้าของชาวพุทธไทยมีจุดประสงค์หลักเพื่ออะไร?",
            "Was ist der Hauptzweck der morgendlichen Almosenrunde (Tak Bat) an buddhistische Mönche?",
            "Kan tak bat phra song nai yam chao khong chao phut Thai mi chut prasong lak phuea arai?",
            [
                ["a", "เพื่อทำบุญ อุปถัมภ์พระพุทธศาสนา และลดความตระหนี่ถี่เหนียว", "Verdienst erwerben (Tham Bun), Mönche unterstützen und Großzügigkeit üben", "Phuea tham bun, uppatham phra phutthasatsana lae lot khwam tra-ni thi niao"],
                ["b", "เพื่อเป็นการซื้อสินค้าจากวัด", "Waren vom Tempel abzukaufen", "Phuea pen kan sue sinkha chak wat"],
                ["c", "เพื่อขอตรวจดูอาหารของวัด", "Das Tempelessen zu kontrollieren", "Phuea kho truat du ahan khong wat"],
                ["d", "เพื่อแลกเปลี่ยนของขวัญระหว่างเพื่อนบ้าน", "Geschenke mit Nachbarn zu tauschen", "Phuea laek plian khong khwan rawang phuen ban"]
            ],
            "a",
            "การตักบาตรเป็นการทำบุญสร้างกุศล ช่วยสืบทอดพระศาสนา และฝึกจิตใจให้รู้จักการแบ่งปัน",
            "Tak Bat ermöglicht Laien, Verdienste (Bun) zu sammeln, den Lebensunterhalt der Mönche zu sichern und Selbstlosigkeit im Alltag zu praktizieren.",
            [{ title: "National Office of Buddhism Thailand – Almsgiving Traditions", url: "https://www.onab.go.th/" }]
        ),
        makeQuestion(
            "thq-rel-007", "religion", 3, "single_choice",
            "ประเพณีเวียนเทียนในวันสำคัญทางพุทธศาสนา ผู้ร่วมพิธีต้องเดินเวียนรอบพระอุโบสถกี่รอบ?",
            "Wie oft umrunden Gläubige bei der traditionellen Lichterprozession (Wian Thian) die Tempelhalle im Uhrzeigersinn?",
            "Prapheni wian thian nai wan samkhan thang phutthasatsana phu ruam phithi tong doen wian rop phra ubosot ki rop?",
            [
                ["a", "สาม (3) รอบ เพื่อบูชาพระพุทธ พระธรรม พระสงฆ์", "Drei (3) Mal zu Ehren von Buddha, Dharma und Sangha", "Sam rop phuea bucha phra phut, phra tham, phra song"],
                ["b", "หนึ่ง (1) รอบ", "Ein (1) Mal", "Nueng rop"],
                ["c", "เจ็ด (7) รอบ", "Sieben (7) Mal", "Chet rop"],
                ["d", "เก้า (9) รอบ", "Neun (9) Mal", "Kao rop"]
            ],
            "a",
            "การเวียนเทียนกระทำโดยเดินประทักษิณาวัตร 3 รอบ เพื่อระลึกถึงพระรัตนตรัย ได้แก่ พระพุทธ พระธรรม และพระสงฆ์",
            "Beim Wian Thian schreiten Gläubige mit Kerze, Räucherstäbchen und Lotusblüte dreimal im Uhrzeigersinn um das Heiligtum – je einmal für Buddha, seine Lehre und die Mönchsgemeinschaft.",
            [{ title: "Ministry of Culture Thailand – Buddhist Candlelight Procession", url: "https://www.m-culture.go.th/" }]
        ),
        makeQuestion(
            "thq-rel-008", "religion", 2, "single_choice",
            "สิ่งศักดิ์สิทธิ์ใดมักประดิษฐานอยู่ในบริเวณวัดไทย และนิยมนำแผ่นทองคำเปลวไปปิดเพื่อความเป็นสิริมงคล?",
            "Woran bringen gläubige Thailänder im Tempel gerne feine Blattgoldblättchen (Pit Thong) an, um Segen zu erbitten?",
            "Sing saksit dai mak praditthan yu nai boriwen wat Thai lae niyom nam phaen thongkham pleo pai pit phuea khwam pen sirimongkhon?",
            [
                ["a", "องค์พระพุทธรูป", "Buddha-Statuen", "Ong phra phuttharuap"],
                ["b", "เสาไฟหน้าวัด", "Laternenmasten vor dem Tempel", "Sao fai na wat"],
                ["c", "กำแพงห้องน้ำวัด", "Wänden der Tempel-Waschräume", "Kamphaeng hong nam wat"],
                ["d", "ต้นหญ้าในสนาม", "Grashalmen im Innenhof", "Ton ya nai sanam"]
            ],
            "a",
            "การปิดทองหลังพระหรือปิดทองที่องค์พระพุทธรูปเป็นการแสดงความเคารพบูชาและอธิษฐานจิตเพื่อความเป็นมงคล",
            "Das Anbringen von Blattgold (Pit Thong) an Buddha-Statuen ist ein tief verwurzeltes Ritual der Andacht, des Respekts und der Bitte um Segen.",
            [{ title: "Tourism Authority of Thailand – Merit Making Rituals", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-lan-005", "language_daily", 1, "single_choice",
            "คำว่า 'ไม่เป็นไร' ในภาษาไทยใช้บ่อยที่สุดในสถานการณ์ใด?",
            "Wann wird die allgegenwärtige thailändische Redewendung 'Mai pen rai' (ไม่เป็นไร) am häufigsten verwendet?",
            "Kham wa 'mai pen rai' nai phasa Thai chai boi thi sut nai sathanakan dai?",
            [
                ["a", "ตอบรับคำขอบคุณ คำขอโทษ หรือบอกว่าไม่เป็นปัญหา สบายใจได้", "Als Antwort auf 'Danke', 'Entschuldigung' oder 'Kein Problem / Macht nichts'", "Top rap kham khopkhun, kham kho thot, rue bok wa mai pen panha"],
                ["b", "ใช้สั่งอาหารจานด่วน", "Um ein schnelles Gericht zu bestellen", "Chai sang ahan chan duan"],
                ["c", "ใช้บอกเวลาตอนเที่ยงวัน", "Um die Mittagszeit anzusagen", "Chai bok wela ton thiang wan"],
                ["d", "ใช้เมื่อรู้สึกโกรธจัด", "Wenn man wütend schreien möchte", "Chai muea rusuek krot chat"]
            ],
            "a",
            "'ไม่เป็นไร' สะท้อนทัศนคติของคนไทยที่ใจกว้าง ให้อภัยง่าย และมองโลกในแง่ดี แปลว่า 'kein Problem' หรือ 'gern geschehen'",
            "'Mai pen rai' ist Thailands Lebensphilosophie: Es bedeutet 'Keine Ursache', 'Macht nichts' oder 'Alles gut' und drückt Gelassenheit und Versöhnlichkeit aus.",
            [{ title: "Royal Institute of Thailand – Everyday Thai Expressions", url: "https://www.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-lan-006", "language_daily", 2, "single_choice",
            "หากต้องการกล่าวคำว่า 'ขอบคุณ' อย่างสุภาพ ผู้ชายและผู้หญิงควรพูดยังไง?",
            "Wie bedankt man sich im Alltag auf Thailändisch höflich (Männer bzw. Frauen)?",
            "Hak tongkan klao kham wa 'khopkhun' yang suphap phu chai lae phu ying khuan phut yang ngai?",
            [
                ["a", "ขอบคุณครับ (ชาย) และ ขอบคุณค่ะ (หญิง)", "Khop khun khrap (Männer) & Khop khun kha (Frauen)", "Khopkhun khrap lae khopkhun kha"],
                ["b", "สวัสดีครับ และ สวัสดีค่ะ", "Sawatdee khrap & Sawatdee kha", "Sawatdi khrap lae sawatdi kha"],
                ["c", "ขอโทษครับ และ ขอโทษค่ะ", "Kho thot khrap & Kho thot kha", "Kho thot khrap lae kho thot kha"],
                ["d", "ยินดีครับ และ ยินดีค่ะ", "Yin dee khrap & Yin dee kha", "Yin di khrap lae yin di kha"]
            ],
            "a",
            "คำว่า 'ขอบคุณ' เมื่อตามด้วยคำลงท้าย 'ครับ' หรือ 'ค่ะ' จะทำให้ประโยคมีความสุภาพและจริงใจ",
            "'Khop khun' bedeutet Danke; mit der Höflichkeitspartikel 'khrap' (Männer) bzw. 'kha' (Frauen) wird daraus ein respektvolles 'Vielen Dank'.",
            [{ title: "Royal Society of Thailand – Thai Politeness", url: "https://www.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-lan-007", "language_daily", 2, "single_choice",
            "การไหว้ (Wai) ในวัฒนธรรมไทย เมื่อไหว้ผู้ใหญ่หรือผู้มีพระคุณ ปลายนิ้วหัวแม่มือควรจรดอยู่ที่บริเวณใด?",
            "Wo sollten die Daumenspitzen beim traditionellen Wai-Gruß platziert werden, wenn man Ältere oder Respektspersonen grüßt?",
            "Kan wai nai watthanatham Thai muea wai phu yai rue phu mi phrakhun plai niu hua mae mue khuan charot yu thi boriwen dai?",
            [
                ["a", "ปลายจมูก", "An der Nasenspitze", "Plai chamuk"],
                ["b", "สะดือ", "Am Bauchnabel", "Sadue"],
                ["c", "หว่างคิ้ว (สำหรับพระสงฆ์)", "Zwischen den Augenbrauen (nur für Mönche)", "Wang khiu"],
                ["d", "ปลายคาง (สำหรับคนวัยเดียวกัน)", "Am Kinn (nur für Gleichaltrige)", "Plai khang"]
            ],
            "a",
            "การไหว้ผู้มีพระคุณ เช่น พ่อแม่ ครูอาจารย์ ปลายนิ้วหัวแม่มือจรดที่ปลายจมูก ปลายนิ้วชี้จรดหว่างคิ้ว",
            "Beim Wai gegenüber Respektspersonen und Älteren berühren die Daumenspitzen die Nasenspitze, während die Zeigefinger zwischen den Augenbrauen liegen.",
            [{ title: "Ministry of Culture Thailand – Thai Wai Etiquette", url: "https://www.m-culture.go.th/" }]
        ),
        makeQuestion(
            "thq-lan-008", "language_daily", 3, "single_choice",
            "คำศัพท์ไทยคำว่า 'เกรงใจ' (Kreng Jai) มีความหมายใกล้เคียงกับข้อใดมากที่สุด?",
            "Was beschreibt das typisch thailändische Kultur- und Sprachkonzept 'Kreng Jai' (เกรงใจ) am besten?",
            "Kham sap Thai kham wa 'kreng chai' mi khwam mai klaikhian kap kho dai mak thi sut?",
            [
                ["a", "ความเกรงใจ ไม่ต้องการรบกวนหรือสร้างความลำบากใจให้ผู้อื่น", "Rücksichtnahme; der Wunsch, niemandem zur Last zu fallen oder Unbehagen zu bereiten", "Khwam kreng chai, mai tongkan ropkuan rue sang khwam lambak chai hai phu uen"],
                ["b", "ความหวาดกลัวต่อสัตว์ป่าดุร้าย", "Furcht vor wilden Tieren im Dschungel", "Khwam wat klua to sat pa durai"],
                ["c", "ความหิวกระหายอยากรับประทานอาหาร", "Großer Appetit auf ein Festmahl", "Khwam hiu krahai yak rap prathan ahan"],
                ["d", "ความเบื่อหน่ายในสภาพอากาศร้อน", "Überdruss über heißes Wetter", "Khwam buea nai nai saphap akat ron"]
            ],
            "a",
            "'เกรงใจ' คือความรู้สึกเคารพและระมัดระวังจิตใจของผู้อื่น ไม่อยากทำให้ใครรู้สึกลำบากใจหรือเดือดร้อน",
            "'Kreng Jai' ist ein Pfeiler thailändischen Sozialverhaltens: Es beschreibt feinfühlige Rücksichtnahme, Taktgefühl und das Vermeiden, anderen Umstände zu bereiten.",
            [{ title: "Tourism Authority of Thailand – The Concept of Kreng Jai", url: "https://www.tourismthailand.org/" }]
        )
,
        makeQuestion(
            "thq-geo-010", "geography", 2, "single_choice",
            "แม่น้ำสายใดในภาคอีสานที่ไหลลงสู่แม่น้ำโขง และเป็นแม่น้ำสายยาวที่สุดที่ไหลอยู่ภายในประเทศไทยเพียงประเทศเดียว?",
            "Welcher Fluss im Isan mündet in den Mekong und ist der längste Fluss, der vollständig innerhalb Thailands fließt?",
            "Maenam sai dai nai phak Isan thi lai long su maenam Khong, lae pen maenam sai yao thi sut thi lai yu phainai prathet Thai phiang prathet diao?",
            [
                ["a", "แม่น้ำชี", "Chi-Fluss", "Maenam Chi"],
                ["b", "แม่น้ำมูล", "Mun-Fluss", "Maenam Mun"],
                ["c", "แม่น้ำปิง", "Ping-Fluss", "Maenam Ping"],
                ["d", "แม่น้ำป่าสัก", "Pa-Sak-Fluss", "Maenam Pa Sak"]
            ],
            "a",
            "แม่น้ำชีมีความยาวประมาณ 765 กิโลเมตร เป็นแม่น้ำสายยาวที่สุดที่ไหลอยู่ภายในผืนแผ่นดินไทยทั้งหมด โดยไหลไปบรรจบกับแม่น้ำมูลก่อนลงสู่แม่น้ำโขง",
            "Der Chi-Fluss ist mit rund 765 km der längste Fluss, der ausschließlich auf thailändischem Staatsgebiet verläuft, bevor er in den Mun und schließlich in den Mekong mündet.",
            [{ title: "Department of Water Resources Thailand", url: "https://www.dwr.go.th/" }]
        ),
        makeQuestion(
            "thq-geo-011", "geography", 3, "single_choice",
            "ช่องแคบหรือส่วนที่แคบที่สุดของคาบสมุทรไทยบนแผ่นดินใหญ่มีชื่อเรียกว่าอะไร?",
            "Wie heißt die schmalste Landenge der malaiischen Halbinsel auf thailändischem Staatsgebiet?",
            "Chong khaep rue suan thi khaep thi sut khong khapsamut Thai bon phaendin yai mi chue riak wa arai?",
            [
                ["a", "คอคอดกระ", "Kra-Landenge (Kra-Isthmus)", "Kho Khot Kra"],
                ["b", "แหลมพรหมเทพ", "Promthep-Kap", "Laem Phrommathep"],
                ["c", "อ่าวพังงา", "Phang-Nga-Bucht", "Ao Phang Nga"],
                ["d", "ช่องแคบมะละกา", "Straße von Malakka", "Chong Khaep Malaka"]
            ],
            "a",
            "คอคอดกระในจังหวัดระนองเป็นส่วนที่แคบที่สุดของคาบสมุทรมลายู มีระยะทางจากฝั่งทะเลอันดามันถึงอ่าวไทยเพียงประมาณ 44 กิโลเมตร",
            "Der Isthmus von Kra in der Provinz Ranong ist die schmalste Stelle der malaiischen Halbinsel; die Entfernung zwischen Andamanensee und Golf von Thailand beträgt dort nur etwa 44 km.",
            [{ title: "Tourism Authority of Thailand – Kra Isthmus", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-his-010", "history", 3, "single_choice",
            "พระมหากษัตริย์ไทยพระองค์ใดทรงริเริ่มการเลิกทาสและพัฒนาระบบรถไฟ โทรเลข และการประปาในสยาม?",
            "Welcher thailändische König schaffte die Sklaverei ab und modernisierte Siam mit Eisenbahn, Telegraf und Schulwesen?",
            "Phra maha kasat Thai phra ong dai song ri roem kan loek that lae phatthana rabop rotfai, thoralek lae kan prapa nai Sayam?",
            [
                ["a", "พระบาทสมเด็จพระจุลจอมเกล้าเจ้าอยู่หัว (รัชกาลที่ 5)", "König Chulalongkorn (Rama V.)", "Phra Bat Somdet Phra Chulachomklao Chao Yu Hua (Ratchakan thi 5)"],
                ["b", "พระบาทสมเด็จพระจอมเกล้าเจ้าอยู่หัว (รัชกาลที่ 4)", "König Mongkut (Rama IV.)", "Phra Bat Somdet Phra Chomklao Chao Yu Hua (Ratchakan thi 4)"],
                ["c", "พระบาทสมเด็จพระพุทธยอดฟ้าจุฬาโลกมหาราช (รัชกาลที่ 1)", "König Rama I.", "Phra Bat Somdet Phra Phuttha Yot Fa Chulalok (Ratchakan thi 1)"],
                ["d", "พระบาทสมเด็จพระมงกุฎเกล้าเจ้าอยู่หัว (รัชกาลที่ 6)", "König Vajiravudh (Rama VI.)", "Phra Bat Somdet Phra Mongkutklao Chao Yu Hua (Ratchakan thi 6)"]
            ],
            "a",
            "รัชกาลที่ 5 ทรงปฏิรูปสยามสู่ความทันสมัยอย่างสันติ ทรงเลิกทาสโดยไม่เสียเลือดเนื้อ และทรงก่อตั้งระบบสาธารณูปโภคพื้นฐานของชาติ",
            "König Chulalongkorn (Rama V., reg. 1868–1910) reformierte Siam grundlegend: Er schaffte schrittweise die Sklaverei ab und führte moderne Infrastruktur ein.",
            [{ title: "National Archives of Thailand", url: "https://www.nat.go.th/" }]
        ),
        makeQuestion(
            "thq-his-011", "history", 4, "single_choice",
            "ศิลาจารึกหลักที่ 1 ที่ค้นพบที่สุโขทัย ซึ่งมีข้อความ 'ในน้ำมีปลา ในนามีข้าว' สร้างขึ้นในรัชสมัยของกษัตริย์พระองค์ใด?",
            "Unter welchem König von Sukhothai entstand die berühmte Stele I mit der Inschrift 'Im Wasser gibt es Fische, im Feld steht Reis'?",
            "Sila charuek lak thi nueng thi khon phop thi Sukhothai, thi mi khokhwan 'nai nam mi pla, nai na mi khao' sang khuen nai ratchasamai khong kasat phra ong dai?",
            [
                ["a", "พ่อขุนรามคำแหงมหาราช", "König Ramkhamhaeng der Große", "Pho Khun Ramkhamhaeng Maharat"],
                ["b", "พ่อขุนศรีอินทราทิตย์", "König Sri Indraditya", "Pho Khun Si Inthrathit"],
                ["c", "พระยาลิไทย", "König Maha Thammaracha I. (Li Thai)", "Phraya Li Thai"],
                ["d", "สมเด็จพระบรมไตรโลกนาถ", "König Borommatrailokanat", "Somdet Phra Borommatrailokanat"]
            ],
            "a",
            "พ่อขุนรามคำแหงมหาราชทรงประดิษฐ์อักษรไทยขึ้นในปี พ.ศ. 1826 และจารึกสุโขทัยหลักที่ 1 พรรณนาถึงความอุดมสมบูรณ์และเสรีภาพในการค้าขายของบ้านเมือง",
            "König Ramkhamhaeng schuf 1283 die thailändische Schrift; Stele I beschreibt Sukhothais Wohlstand und freies Marktwesen zur Goldenen Ära.",
            [{ title: "UNESCO Memory of the World – The King Ram Khamhaeng Inscription", url: "https://www.unesco.org/" }]
        ),
        makeQuestion(
            "thq-cul-010", "culture", 2, "single_choice",
            "ในประเพณีรดน้ำดำหัววันสงกรานต์ น้ำอบไทยผสมดอกไม้มักใช้นำมารดที่ส่วนใดของผู้อาวุโสเพื่อขอพร?",
            "Wo gießt man den Älteren während der Songkran-Zeremonie 'Rot Nam Dam Hua' traditionell Duftwasser hin, um Verzeihung und Segen zu erbitten?",
            "Nai prapheni rot nam dam hua wan Songkran, nam op Thai phasom dokmai mak chai nam ma rot thi suan dai khong phu awuso phuea kho phon?",
            [
                ["a", "ฝ่ามือ", "Auf die Handflächen", "Fa mue"],
                ["b", "ศีรษะ", "Auf den Kopf", "Sisa"],
                ["c", "ไหล่", "Auf die Schultern", "Lai"],
                ["d", "เท้า", "Auf die Füße", "Thao"]
            ],
            "a",
            "ลูกหลานจะนำน้ำอบผสมกลีบดอกไม้มารดลงบนฝ่ามือของพ่อแม่และญาติผู้ใหญ่ พร้อมมอบผ้าผืนใหม่และรับคำอวยพร",
            "Beim 'Rot Nam Dam Hua' gießt man sanft parfümiertes Blumenwasser über die Handflächen der Eltern und Älteren als Zeichen von Demut, Dank und Bitte um Segen.",
            [{ title: "Ministry of Culture Thailand – Songkran Festival", url: "https://www.m-culture.go.th/" }]
        ),
        makeQuestion(
            "thq-cul-011", "culture", 3, "single_choice",
            "เครื่องดนตรีไทยประเภทเครื่องดีดที่มีรูปร่างคล้ายเรือและมีสายบรรเลงเพลงไพเราะ มีชื่อเรียกว่าอะไร?",
            "Welches traditionelle thailändische Saiteninstrument (Zupfinstrument) hat einen bootsförmigen Holzkorpus und wird horizontal gezupft?",
            "Khrueang dontri Thai praphet khrueang dit thi mi ruprang khlai ruea lae mi sai banleng phleng phairo, mi chue riak wa arai?",
            [
                ["a", "จะเข้", "Jakhe (Zither in Krokodilform)", "Cha-khe"],
                ["b", "ระนาดเอก", "Ranat Ek (Trogxylophon)", "Ranat ek"],
                ["c", "ซอด้วง", "So Duang (zweisaite Spießgeige)", "So duang"],
                ["d", "ขลุ่ยเพียงออ", "Khlui Phiang O (Bambusflöte)", "Khlui phiang o"]
            ],
            "a",
            "จะเข้เป็นเครื่องดนตรีประเภทเครื่องดีด 3 สาย มีส่วนหัวและลำตัวคล้ายจระเข้ ใช้บรรเลงในวงเครื่องสายและวงมโหรี",
            "Die Jakhe ist eine dreisaitige Zupfzither, deren Korpus historisch einem Krokodil nachempfunden ist. Sie ist das tragende Zupfinstrument der klassischen Thai-Musik.",
            [{ title: "Fine Arts Department Thailand – Traditional Instruments", url: "https://www.finearts.go.th/" }]
        ),
        makeQuestion(
            "thq-foo-010", "food", 2, "single_choice",
            "อาหารอีสานจานเด็ดที่ทำจากเนื้อสับ ปรุงรสด้วยพริก มะนาว น้ำปลา ข้าวคั่ว และสะระแหน่ เรียกว่าอะไร?",
            "Wie heißt das beliebte nordostthailändische Hackfleischgericht, gewürzt mit Chili, Limette, Fischsauce, Minze und geröstetem Reispulver?",
            "Ahan Isan chan det thi tham chak nuea sap, prung rot duai phrik, manao, nampla, khao khua lae saranae, riak wa arai?",
            [
                ["a", "ลาบ", "Laab (Larb)", "Lap"],
                ["b", "พะแนง", "Panaeng-Curry", "Phanaeng"],
                ["c", "แกงเขียวหวาน", "Grünes Curry", "Kaeng khiao wan"],
                ["d", "ทอดมันกุ้ง", "Frittierte Garnelenküchlein", "Thot man kung"]
            ],
            "a",
            "ลาบเป็นอาหารพื้นเมืองอีสานและลาว กลิ่นหอมอันเป็นเอกลักษณ์มาจาก 'ข้าวคั่ว' ปรุงกับเนื้อหมู ไก่ หรือเนื้อวัว",
            "Laab (Larb) ist der Nationalfleischsalat des Isan und Laos. Das Markenzeichen ist frisch gemahlener Röstklebreis (Khao Khua), der für Aroma und Biss sorgt.",
            [{ title: "Tourism Authority of Thailand – Isan Culinary Heritage", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-foo-011", "food", 3, "single_choice",
            "ซุปก๋วยเตี๋ยวที่มีสีชมพูแดงอันเป็นเอกลักษณ์ เกิดจากการใส่ส่วนผสมพิเศษชนิดใด?",
            "Welche Zutat verleiht der thailändischen Nudelsuppe 'Yentafo' ihre typische rosarote Farbe?",
            "Sup kuaitiao thi mi si chomphu daeng an pen ekkalak, koet chak kan sai suan phasom phiset chanit dai?",
            [
                ["a", "เต้าหู้ยี้สีแดง", "Roter fermentierter Tofu", "Taohu yi si daeng"],
                ["b", "น้ำกระเจี๊ยบ", "Rosellenblütensaft", "Nam krachiap"],
                ["c", "พริกแกงเผ็ด", "Rote Currypaste", "Phrik kaeng phet"],
                ["d", "น้ำบีทรูท", "Rote-Bete-Saft", "Nam bitrut"]
            ],
            "a",
            "เย็นตาโฟได้สีชมพูและรสเปรี้ยวหวานกลมกล่อมมาจากซอสเต้าหู้ยี้หมักสีแดง มักเสิร์ฟพร้อมปลาหมึกกรอบ เลือดหมู และผักบุ้ง",
            "Die charakteristische rosa Farbe und das süß-säuerliche Aroma verdankt Yentafo einer Sauce aus rot fermentiertem Tofu (Taohu Yi).",
            [{ title: "Michelin Guide Thailand – Street Food Culture", url: "https://guide.michelin.com/th/en" }]
        ),
        makeQuestion(
            "thq-nat-010", "nature", 3, "single_choice",
            "อุทยานแห่งชาติเขาสกในจังหวัดสุราษฎร์ธานี มีชื่อเสียงจากการเป็นถิ่นกำเนิดของดอกไม้ป่าขนาดใหญ่ที่สุดในโลกที่มีชื่อว่าอะไร?",
            "Für welche Blume, die als die größte Wildblume der Welt gilt, ist der Khao Sok Nationalpark in Surat Thani berühmt?",
            "Utthayan haeng chat Khao Sok nai changwat Surat Thani, mi chuesiang chak kan pen thin kamnoet khong dokmai pa khanat yai thi sut nai lok thi mi chue wa arai?",
            [
                ["a", "บัวผุด (ราฟเฟิลเซีย)", "Bua Phut (Rafflesia kerrii)", "Bua phut (Rafflesia)"],
                ["b", "กล้วยไม้ช้างกระ", "Rhynchostylis gigantea", "Kluaimai chang kra"],
                ["c", "ดอกบัวหลวง", "Heiliger Lotus", "Dok bua luang"],
                ["d", "ดอกราชพฤกษ์", "Ratchaphruek (Goldregen)", "Dok ratchaphruek"]
            ],
            "a",
            "บัวผุดเป็นพืชกาฝากที่ไม่มีใบหรือรากแท้จริง ดอกบานสามารถมีเส้นผ่านศูนย์กลางเกือบ 1 เมตร และพบได้ในป่าดงดิบเขาสก",
            "Bua Phut (Rafflesia kerrii) ist eine blattlose Schmarotzerpflanze im Khao-Sok-Regenwald; ihre riesige Blüte kann einen Durchmesser von bis zu 80-100 cm erreichen.",
            [{ title: "Department of National Parks Thailand – Khao Sok", url: "https://www.dnp.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-011", "nature", 2, "single_choice",
            "ดอกไม้ประจำชาติของประเทศไทย ซึ่งมีสีเหลืองอร่ามและออกดอกสะพรั่งในฤดูร้อน มีชื่อว่าอะไร?",
            "Wie heißt die Nationalblume Thailands, deren leuchtend gelbe Blütentrauben zur Sommerzeit im ganzen Land blühen?",
            "Dokmai pracham chat khong prathet Thai, sueng mi si lueang aram lae ok dok saphrang nai ruedu ron, mi chue wa arai?",
            [
                ["a", "ดอกราชพฤกษ์ (คูน)", "Ratchaphruek / Khun (Kassienbaum)", "Dok ratchaphruek (Khun)"],
                ["b", "ดอกมะลิ", "Mali (Jasmin)", "Dok mali"],
                ["c", "ดอกชบา", "Chaba (Hibiskus)", "Dok chaba"],
                ["d", "ดอกลีลาวดี", "Lilawadi (Frangipani)", "Dok lilawadi"]
            ],
            "a",
            "ดอกราชพฤกษ์ หรือต้นคูน ได้รับการประกาศให้เป็นดอกไม้ประจำชาติไทย สีเหลืองทองเป็นสัญลักษณ์ของพระพุทธศาสนาและวันพระราชสมภพของในหลวงรัชกาลที่ 9",
            "Der Ratchaphruek (Cassia fistula) ist Thailands Nationalbaum/-blüte. Seine gelbe Farbe repräsentiert den Buddhismus und den königlichen Montag.",
            [{ title: "Royal Society of Thailand – National Symbols", url: "https://www.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-sport-010", "sport", 2, "single_choice",
            "ลูกบอลที่ใช้เล่นในกีฬาเซปักตะกร้อแบบดั้งเดิม สานขึ้นมาจากวัสดุธรรมชาติชนิดใด?",
            "Aus welchem Naturmaterial wurde der traditionelle Sepak-Takraw-Ball vor der Einführung von Kunststoff geflochten?",
            "Lukbon thi chai len nai kila sepak takraw baep dangdoem, san khuen ma chak watsadu thammachat chanit dai?",
            [
                ["a", "หวาย", "Rattan", "Wai"],
                ["b", "ไม้ไผ่", "Bambus", "Mai phai"],
                ["c", "ใบลาน", "Palmblätter", "Bai lan"],
                ["d", "เชือกกล้วย", "Bananenfasern", "Chueak kluai"]
            ],
            "a",
            "ตะกร้อดั้งเดิมทำจากเส้นหวายธรรมชาติสานเป็นทรงกลมกลวง มีน้ำหนักเบาและยืดหยุ่น ปัจจุบันใช้พลาสติกสังเคราะห์เพื่อความทนทาน",
            "Der klassische Takraw-Ball besteht aus geflochtenen Streifen von Rattanpalmen (Wai). Er ist leicht, federt elastisch und erzeugt beim Schlagen den typischen Klang.",
            [{ title: "International Sepaktakraw Federation – Ball Specs", url: "https://www.sepaktakraw.org/" }]
        ),
        makeQuestion(
            "thq-sport-011", "sport", 3, "single_choice",
            "สนามมวยไทยมาตรฐานแห่งแรกของประเทศไทยที่เปิดดำเนินการอย่างเป็นทางการในกรุงเทพฯ คือสนามใด?",
            "Welches war das erste offizielle, permanente Muay-Thai-Stadion Thailands, das 1945 in Bangkok eröffnet wurde?",
            "Sanam muai Thai mattrathan haeng raek khong prathet Thai thi poet damnoen kan yang pen thangkan nai Krung Thep khue sanam dai?",
            [
                ["a", "สนามมวยราชดำเนิน", "Rajadamnern-Stadion", "Sanam muai Ratchadamnoen"],
                ["b", "สนามมวยลุมพินี", "Lumpinee-Stadion", "Sanam muai Lumphini"],
                ["c", "สนามมวยช่อง 7", "Kanal-7-Stadion", "Sanam muai Chong Chet"],
                ["d", "สนามมวยอ้อมน้อย", "Omnoi-Stadion", "Sanam muai Om Noi"]
            ],
            "a",
            "เวทีมวยราชดำเนินก่อตั้งขึ้นในปี พ.ศ. 2488 เป็นสนามมวยมาตรฐานแห่งแรกของไทยและเป็นสังเวียนประวัติศาสตร์ระดับโลก",
            "Das Rajadamnern-Stadion (gegründet 1945) ist das älteste und traditionsreichste permanente Muay-Thai-Stadion des Landes.",
            [{ title: "Rajadamnern Stadium Official History", url: "https://rajadamnern.com/" }]
        ),
        makeQuestion(
            "thq-rel-009", "religion", 2, "single_choice",
            "วันสำคัญทางพุทธศาสนาวันใดที่ตรงกับวันเพ็ญเดือน 6 และเป็นวันที่พระพุทธเจ้าประสูติ ตรัสรู้ และปรินิพพาน?",
            "An welchem buddhistischen Vollmondfeiertag im 6. Mondmonat gedenkt man Geburt, Erleuchtung und Verlöschen (Parinirvana) Buddhas?",
            "Wan samkhan thang phutthasatsana wan dai thi trong kap wan phen duean hok lae pen wan thi phra phutthachao prasut, tratsaru lae parinipphan?",
            [
                ["a", "วันวิสาขบูชา", "Visakha-Bucha-Tag (Wesak)", "Wan Wisakhabucha"],
                ["b", "วันมาฆบูชา", "Makha-Bucha-Tag", "Wan Makhabucha"],
                ["c", "วันอาสาฬหบูชา", "Asalha-Bucha-Tag", "Wan Asanhabucha"],
                ["d", "วันเข้าพรรษา", "Khao Phansa (Beginn der Fastenzeit)", "Wan Khao Phansa"]
            ],
            "a",
            "วันวิสาขบูชาถือเป็นวันสำคัญสากลของโลกทางพระพุทธศาสนา โดยมีเหตุการณ์มหัศจรรย์ 3 ประการตรงกันในวันเพ็ญเดือน 6",
            "Visakha Bucha ist der heiligste buddhistische Feiertag; er vereint Geburt, Erleuchtung und Eingang ins Parinirvana an einem einzigen Vollmondtag.",
            [{ title: "Office of National Buddhism Thailand", url: "https://www.onab.go.th/" }]
        ),
        makeQuestion(
            "thq-rel-010", "religion", 3, "single_choice",
            "วัดร่องขุ่นในจังหวัดเชียงราย ที่มีสถาปัตยกรรมอุโบสถสีขาวบริสุทธิ์ประดับกระจกแวววาว สร้างสรรค์โดยศิลปินแห่งชาติท่านใด?",
            "Welcher thailändische Nationalkünstler entwarf und schuf den schneeweißen, glasverzierten Tempel Wat Rong Khun (Weißer Tempel) in Chiang Rai?",
            "Wat Rong Khun nai changwat Chiang Rai thi mi sathapattayakam ubosot si khao borisut pradap krachok waewwaw sangsan doi sinlapin haeng chat than dai?",
            [
                ["a", "อาจารย์เฉลิมชัย โฆษิตพิพัฒน์", "Chalermchai Kositpipat", "Achan Chaloemchai Khositphiphat"],
                ["b", "อาจารย์ถวัลย์ ดัชนี", "Thawan Duchanee (Schwarzes Haus)", "Achan Thawan Datchani"],
                ["c", "อาจารย์ศิลป์ พีระศรี", "Silpa Bhirasri (Corrado Feroci)", "Achan Sin Phirasi"],
                ["d", "อาจารย์จักรพันธุ์ โปษยกฤต", "Chakrabhand Posayakrit", "Achan Chakkraphan Posayakrit"]
            ],
            "a",
            "อาจารย์เฉลิมชัย โฆษิตพิพัฒน์ ได้อุทิศชีวิตสร้างวัดร่องขุ่นด้วยสีขาวสื่อถึงความบริสุทธิ์ของพระพุทธเจ้า และกระจกสะท้อนปัญญาธรรม",
            "Ajahn Chalermchai Kositpipat entwarf den Weißen Tempel als lebenslanges Kunstwerk. Weiß symbolisiert die Reinheit Buddhas, Spiegelplättchen seine Weisheit.",
            [{ title: "Tourism Authority of Thailand – Wat Rong Khun", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-lan-009", "language_daily", 2, "single_choice",
            "คำว่า 'สนุก' (Sanuk) ในวัฒนธรรมไทย สะท้อนแนวคิดสำคัญเรื่องใดในการใช้ชีวิตประจำวัน?",
            "Was drückt das thailändische Lebensprinzip 'Sanuk' im alltäglichen Umgang und bei der Arbeit aus?",
            "Kham wa 'sanuk' nai watthanatham Thai sathon naeokhit samkhan rueang dai nai kan chai chiwit pracham wan?",
            [
                ["a", "ความสุข ความเพลิดเพลิน และการมองชีวิตให้เบิกบาน", "Freude, Leichtigkeit und Spaß an jeder Tätigkeit", "Khwam suk, khwam phloetphloen lae kan mong chiwit hai boekban"],
                ["b", "ความเคร่งครัดและจริงจังในกฎระเบียบ", "Strenge Einhaltung von Dienstvorschriften", "Khwam khrengkhrat lae chingchang nai kot rabiap"],
                ["c", "การแข่งขันเพื่อเอาชนะผู้อื่น", "Wettbewerbsorientiertes Siegen über andere", "Kan khaengkhan phuea ao chana phu uen"],
                ["d", "ความสงบเงียบโดยไม่พูดคุยกับใคร", "Stille Zurückgezogenheit ohne soziale Kontakte", "Khwam sangop ngiap doi mai phutkhui kap khrai"]
            ],
            "a",
            "คนไทยให้คุณค่ากับความ 'สนุก' ไม่ว่าจะทำงานหรือใช้ชีวิต หากสิ่งใดทำแล้วสนุกและสบายใจ ก็จะทำได้ดีและมีความสุขร่วมกัน",
            "'Sanuk' ist der thailändische Grundsatz, Lebensfreude, Humor und Freude auch in alltägliche Pflichten einzubringen, um das Miteinander harmonisch zu halten.",
            [{ title: "Tourism Authority of Thailand – Thai Culture and Values", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-lan-010", "language_daily", 2, "single_choice",
            "เมื่อต้องการเรียกพนักงานเสิร์ฟหรือคนทั่วไปในชีวิตประจำวันอย่างสุภาพและเป็นกันเอง นิยมเรียกด้วยคำว่าอะไร?",
            "Wie spricht man Bedienungen oder Mitmenschen im Alltag freundlich, familiär und respektvoll an?",
            "Muea tongkan riak phanakngan soep rue khon thua pai nai chiwit pracham wan yang suphap lae pen kan eng, niyom riak duai kham wa arai?",
            [
                ["a", "พี่ (คนโตกว่า) หรือ น้อง (คนอายุน้อยกว่า)", "'Phi' (Ältere/r) oder 'Nong' (Jüngere/r)", "Phi rue Nong"],
                ["b", "เฮ้ย", "'Hoei' (Hey du)", "Hōei"],
                ["c", "นาย", "'Nai' (Herr / Boss)", "Nai"],
                ["d", "เจ้า", "'Chao' (Herrscher)", "Chao"]
            ],
            "a",
            "การใช้สรรพนามแบบครอบครัว เช่น 'พี่' สำหรับผู้ที่ดูอายุมากกว่า และ 'น้อง' สำหรับผู้ที่อายุน้อยกว่า แสดงความสุภาพ อบอุ่น และเป็นกันเอง",
            "In Thailand verwendet man familiäre Anreden: 'Phi' (älterer Bruder/Schwester) und 'Nong' (jüngere/r). Das schafft sofort eine höfliche und herzliche Atmosphäre.",
            [{ title: "Royal Society of Thailand – Thai Pronouns and Etiquette", url: "https://www.orst.go.th/" }]
        )
,
        makeQuestion(
            "thq-geo-012", "geography", 2, "single_choice",
            "ทะเลสาบน้ำจืดที่ใหญ่ที่สุดในประเทศไทยตั้งอยู่ในภาคกลาง มีชื่อเรียกว่าอะไร?",
            "Wie heißt der größte Süßwassersee Thailands, der in der Zentralregion liegt?",
            "Thalesap nam chuet thi yai thi sut nai prathet Thai tang yu nai phak klang, mi chue riak wa arai?",
            [
                ["a", "บึงบอระเพ็ด", "Bueng Boraphet", "Bueng Boraphet"],
                ["b", "กว๊านพะเยา", "Kwan Phayao", "Kwan Phayao"],
                ["c", "หนองหาร", "Nong Han", "Nong Han"],
                ["d", "ทะเลสาบสงขลา", "Songkhla-See", "Thalesap Songkhla"]
            ],
            "a",
            "บึงบอระเพ็ดในจังหวัดนครสวรรค์เป็นบึงและทะเลสาบน้ำจืดขนาดใหญ่ที่สุดของไทย มีพื้นที่กว่า 130,000 ไร่ และเป็นแหล่งชมนกน้ำนานาชนิด",
            "Bueng Boraphet in der Provinz Nakhon Sawan ist mit über 200 km² der größte natürliche Süßwassersee Thailands und ein bedeutendes Vogelschutzgebiet.",
            [{ title: "Department of Fisheries Thailand – Bueng Boraphet", url: "https://www.fisheries.go.th/" }]
        ),
        makeQuestion(
            "thq-geo-013", "geography", 3, "single_choice",
            "อำเภอเบตง ซึ่งเป็นจุดใต้สุดของประเทศไทยบนผืนแผ่นดินใหญ่ ตั้งอยู่ในจังหวัดใด?",
            "In welcher Provinz liegt der Bezirk Betong, der den südlichsten Festlandspunkt Thailands markiert?",
            "Amphoe Betong sueng pen chut tai thi sut khong prathet Thai bon phuen phaendin yai, tang yu nai changwat dai?",
            [
                ["a", "ยะลา", "Yala", "Yala"],
                ["b", "นราธิวาส", "Narathiwat", "Narathiwat"],
                ["c", "ปัตตานี", "Pattani", "Pattani"],
                ["d", "สงขลา", "Songkhla", "Songkhla"]
            ],
            "a",
            "อำเภอเบตงอยู่ในจังหวัดยะลา ล้อมรอบด้วยภูเขาและสายหมอก เป็นจุดใต้สุดของสยาม มีป้าย 'ใต้สุดสยาม เมืองงามชายแดน'",
            "Betong liegt in der südlichsten Binnenprovinz Yala an der Grenze zu Malaysia und ist bekannt für kühles Bergklima und das Denkmal 'Südlichster Punkt Siams'.",
            [{ title: "Tourism Authority of Thailand – Betong Yala", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-his-012", "history", 2, "single_choice",
            "ประเทศไทยเปลี่ยนชื่อประเทศอย่างเป็นทางการจาก 'สยาม' มาเป็น 'ไทย' ในปี พ.ศ. 2482 ในยุคของนายกรัฐมนตรีท่านใด?",
            "Unter welchem Premierminister wurde der offizielle Landesname 1939 von 'Siam' in 'Thailand' geändert?",
            "Prathet Thai plian chue prathet yang pen thangkan chak 'Sayam' ma pen 'Thai' nai pi Pho So 2482 nai yuk khong nayok ratthamontri than dai?",
            [
                ["a", "จอมพล แปลก พิบูลสงคราม", "Feldmarschall Plaek Phibunsongkhram", "Chomphon Plaek Phibunsongkhram"],
                ["b", "นายปรีดี พนมยงค์", "Pridi Banomyong", "Nai Pridi Phanomyong"],
                ["c", "พระยาพหลพลพยุหเสนา", "Phraya Phahonphonphayuhasena", "Phraya Phahonphonphayuhasena"],
                ["d", "จอมพล สฤษดิ์ ธนะรัชต์", "Feldmarschall Sarit Thanarat", "Chomphon Sarit Thanarat"]
            ],
            "a",
            "จอมพล ป. พิบูลสงคราม ได้ประกาศเปลี่ยนชื่อประเทศจาก 'สยาม' เป็น 'ไทย' (Thailand) เพื่อเน้นย้ำถึงความเป็นชาติและดินแดนของคนไทที่มีอิสรภาพ",
            "Feldmarschall Plaek Phibunsongkhram führte 1939 die Namensänderung von Siam zu Thailand ('Land der Freien') im Rahmen seiner Modernisierungsdekrete ein.",
            [{ title: "Royal Gazette Thailand – Renaming of Siam 1939", url: "https://ratchakitcha.soc.go.th/" }]
        ),
        makeQuestion(
            "thq-his-013", "history", 4, "single_choice",
            "สนธิสัญญาเบาว์ริง (Bowring Treaty) ที่สยามทำกับสหราชอาณาจักรในปี พ.ศ. 2398 เกิดขึ้นในรัชสมัยใด?",
            "Unter welchem Monarchen schloss Siam 1855 den wegweisenden Bowring-Vertrag über Freihandel mit Großbritannien ab?",
            "Sonthisanya Baoring thi Sayam tham kap Saharat-anachak nai pi Pho So 2398 koet khuen nai ratchasamai dai?",
            [
                ["a", "พระบาทสมเด็จพระจอมเกล้าเจ้าอยู่หัว (รัชกาลที่ 4)", "König Mongkut (Rama IV.)", "Phra Bat Somdet Phra Chomklao Chao Yu Hua (Ratchakan thi 4)"],
                ["b", "พระบาทสมเด็จพระนั่งเกล้าเจ้าอยู่หัว (รัชกาลที่ 3)", "König Rama III.", "Phra Bat Somdet Phra Nangklao Chao Yu Hua (Ratchakan thi 3)"],
                ["c", "พระบาทสมเด็จพระจุลจอมเกล้าเจ้าอยู่หัว (รัชกาลที่ 5)", "König Chulalongkorn (Rama V.)", "Phra Bat Somdet Phra Chulachomklao Chao Yu Hua (Ratchakan thi 5)"],
                ["d", "พระบาทสมเด็จพระพุทธเลิศหล้านภาลัย (รัชกาลที่ 2)", "König Rama II.", "Phra Bat Somdet Phra Phuttha Loet La Naphalai (Ratchakan thi 2)"]
            ],
            "a",
            "รัชกาลที่ 4 ทรงลงนามในสนธิสัญญาเบาว์ริงกับเซอร์จอห์น เบาว์ริง เปิดประตูการค้าเสรีของสยามสู่ตลาดโลกและยกเลิกการผูกขาดของพระคลังสินค้า",
            "König Mongkut (Rama IV.) öffnete Siam durch den Bowring-Vertrag für den internationalen Freihandel und verhinderte so eine gewaltsame Kolonisierung.",
            [{ title: "Ministry of Foreign Affairs Thailand – Historical Treaties", url: "https://www.mfa.go.th/" }]
        ),
        makeQuestion(
            "thq-cul-012", "culture", 2, "single_choice",
            "ประเพณีบุญบั้งไฟ ซึ่งจัดขึ้นเพื่อบูชาพญาแถนและขอฝนให้ตกต้องตามฤดูกาล เป็นประเพณีเลื่องชื่อของภาคใด?",
            "Welche Region ist berühmt für das bunte Raketenfestival 'Bun Bang Fai', bei dem selbstgebaute Bambusraketen zur Erbitte von Regen gezündet werden?",
            "Prapheni Bun Bang Fai sueng chat khuen phuea bucha Phya Thaen lae kho fon hai tok tong tam ruedukan, pen prapheni lueang chue khong phak dai?",
            [
                ["a", "ภาคอีสาน (ตะวันออกเฉียงเหนือ)", "Nordostthailand (Isan)", "Phak Isan (Tawan-ok Chiang Nuea)"],
                ["b", "ภาคใต้", "Südthailand", "Phak Tai"],
                ["c", "ภาคกลาง", "Zentralregion", "Phak Klang"],
                ["d", "ภาคตะวันออก", "Ostregion", "Phak Tawan-ok"]
            ],
            "a",
            "ประเพณีบุญบั้งไฟเป็นงานบุญใหญ่ของชาวอีสาน โดยเฉพาะในจังหวัดยโสธร ก่อนเริ่มฤดูทำนา เพื่อขอฝนจากพญาแถนตามความเชื่อโบราณ",
            "Bun Bang Fai ist ein zentrales Fest im Isan (besonders in Yasothon) im Mai/Juni. Riesige Raketen werden in den Himmel geschossen, um Regengott Phaya Thaen zu besänftigen.",
            [{ title: "Tourism Authority of Thailand – Yasothon Rocket Festival", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-cul-013", "culture", 3, "single_choice",
            "เครื่องปั้นดินเผาเคลือบสีเขียวไข่กาอันเป็นเอกลักษณ์ทางประวัติศาสตร์ของภาคเหนือ มีชื่อเรียกว่าอะไร?",
            "Wie heißt die weltbekannte grünglasierte Seladon-Keramik mit Craquelé-Muster aus Nordthailand?",
            "Khrueang pan din phao khlueap si khiao khai ka an pen ekkalak thang prawattisat khong phak nuea, mi chue riak wa arai?",
            [
                ["a", "ศิลาดล", "Celadon (Siladon)", "Siladon"],
                ["b", "เครื่องเบญจรงค์", "Benjarong-Porzellan", "Khrueang Bencharong"],
                ["c", "ดินเผาด่านเกวียน", "Dan-Kwian-Tonware", "Din phao Dan Kwian"],
                ["d", "โอ่งมังกร", "Drachenkrüge von Ratchaburi", "Ong mangkon"]
            ],
            "a",
            "ศิลาดลหรือเซลาดอน (Celadon) เป็นเครื่องปั้นดินเผาเคลือบขี้เถ้าไม้สีเขียวมรกตหรือเขียวหยก ซึ่งสืบทอดเทคนิคโบราณมาตั้งแต่สมัยล้านนาและสุโขทัย",
            "Siam-Seladon (Siladon) ist für seine feine jadegrüne Ascheglasur mit Rissmuster bekannt und wird bis heute nach antiken Sukhothai- und Lanna-Traditionen in Chiang Mai gefertigt.",
            [{ title: "Fine Arts Department – Ancient Thai Ceramics", url: "https://www.finearts.go.th/" }]
        ),
        makeQuestion(
            "thq-foo-012", "food", 2, "single_choice",
            "ของหวานไทยยอดนิยมที่ทำจากฝอยไข่แดงสีทอง หยอดลงในน้ำเชื่อมเดือด มีต้นกำเนิดดัดแปลงมาจากขนมโปรตุเกส มีชื่อว่าอะไร?",
            "Welche beliebte thailändische Süßspeise aus feinen goldenen Eigelbfäden im Zuckersirup geht historisch auf portugiesische Einflüsse zurück?",
            "Khong wan Thai yotniyom thi tham chak foi khai daeng si thong, yot long nai nam chueam dueat, mi ton kamnoet datplaeng ma chak khanom Protuket, mi chue wa arai?",
            [
                ["a", "ฝอยทอง", "Foi Thong (Goldfäden / Fios de Ovos)", "Foi Thong"],
                ["b", "บัวลอย", "Bua Loi", "Bua Loi"],
                ["c", "ตะโก้", "Tako", "Tako"],
                ["d", "ลูกชุบ", "Luk Chup", "Luk Chup"]
            ],
            "a",
            "ฝอยทอง ทองหยิบ และทองหยอด ได้รับอิทธิพลจากขนมโปรตุเกส นำเข้ามาเผยแพร่ในราชสำนักอยุธยาโดยท้าวทองกีบม้า (มารี กีมาร์)",
            "Foi Thong (portugiesisch: Fios de Ovos) wurde im 17. Jahrhundert von Maria Guyomar de Pinha am Hofe Ayutthayas eingeführt und symbolisiert langes Leben und Wohlstand.",
            [{ title: "Tourism Authority of Thailand – Ayutthaya Royal Desserts", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-foo-013", "food", 3, "single_choice",
            "แกงไตปลา อาหารรสชาติจัดจ้านเผ็ดร้อนอันเลื่องชื่อของภาคใต้ มีส่วนผสมหลักที่เป็นเอกลักษณ์คืออะไร?",
            "Was ist die namensgebende, fermentierte Hauptzutat des feurig-scharfen südthailändischen Currys 'Kaeng Tai Pla'?",
            "Kaeng Tai Pla ahan rotchat chatchan phet ron an lueang chue khong phak tai, mi suan phasom lak thi pen ekkalak khue arai?",
            [
                ["a", "พุงปลาหมักดอง", "Fermentierte Fischinnereien (Fischmagen)", "Phung pla mak dong"],
                ["b", "น้ำนมข้นหวาน", "Gezuckerte Kondensmilch", "Nam nom khon wan"],
                ["c", "น้ำกะทิสด", "Frische Kokosmilch", "Nam kathi sot"],
                ["d", "ซีอิ๊วดำหวาน", "Süße dunkle Sojasauce", "Siiu dam wan"]
            ],
            "a",
            "แกงไตปลาใช้ 'ไตปลา' หรือพุงปลาหมักเกลือมาต้มกับพริกแกงใต้ใส่ขมิ้น หน่อไม้ และเนื้อปลาย่าง โดยไม่ใส่กะทิ จึงมีรสเผ็ดเค็มร้อนแรง",
            "Kaeng Tai Pla ist ein klares, kokosfreies Curry der Südthailänder, dessen tiefes Umami-Aroma von salzfermentierten Fischmägen (Tai Pla) und frischer Kurkuma stammt.",
            [{ title: "Michelin Guide – Southern Thai Culinary Treasures", url: "https://guide.michelin.com/th/en" }]
        ),
        makeQuestion(
            "thq-nat-012", "nature", 3, "single_choice",
            "สัตว์เลี้ยงลูกด้วยนมทางทะเลที่กินหญ้าทะเลเป็นอาหารหลัก และได้รับการคุ้มครองอย่างเข้มงวดในทะเลตรัง คือสัตว์ชนิดใด?",
            "Welches pflanzenfressende Meeressäugetier weidet auf den Seegraswiesen vor Trang und steht unter strengem Artenschutz?",
            "Sat liang luk duai nom thang thale thi kin ya thale pen ahan lak, lae dairap kan khumkhrong yang khemnguat nai thale Trang khue sat chanit dai?",
            [
                ["a", "พะยูน", "Dugong (Seekuh)", "Phayun"],
                ["b", "โลมาสีชมพู", "Rosa Flussdelfin", "Loma si chomphu"],
                ["c", "วาฬบรูด้า", "Brydewal", "Wan Bruda"],
                ["d", "แมวน้ำ", "Seehund", "Maeo nam"]
            ],
            "a",
            "พะยูนอาศัยอยู่ตามแนวหญ้าทะเลในจังหวัดตรังและกระบี่ เป็นสัตว์ป่าสงวนใกล้สูญพันธุ์ที่ชาวไทยร่วมกันอนุรักษ์อย่างจริงจัง",
            "Der Dugong (Seekuh) ernährt sich ausschließlich von Seegras. Die Gewässer rund um Koh Libong in der Provinz Trang beherbergen die größte verbliebene Population Thailands.",
            [{ title: "Department of Marine and Coastal Resources Thailand – Dugong Conservation", url: "https://www.dmcr.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-013", "nature", 2, "single_choice",
            "ปลากัดไทย ซึ่งมีสีสันสวยงามและมีความผูกพันกับวัฒนธรรมไทยมายาวนาน ได้รับการประกาศให้เป็นอะไรในปี พ.ศ. 2562?",
            "Zu welchem nationalen Symbol wurde der farbenprächtige Siamesische Kampffisch (Betta splendens) im Jahr 2019 offiziell ernannt?",
            "Pla kat Thai sueng mi sisan suai-ngam lae mi khwam phukphan kap watthanatham Thai ma yaonan, dairap kan prakat hai pen arai nai pi Pho So 2562?",
            [
                ["a", "สัตว์น้ำประจำชาติ", "Nationales Wassertier Thailands", "Sat nam pracham chat"],
                ["b", "สัตว์ป่าสงวน", "Reservat-Wildtier", "Sat pa sanguan"],
                ["c", "สัญลักษณ์งานกีฬาแห่งชาติ", "Nationales Sportmaskottchen", "Sanyalak ngan kila haeng chat"],
                ["d", "ปลาที่ห้ามเลี้ยงในบ้าน", "Verbotene Haustierart", "Pla thi ham liang nai ban"]
            ],
            "a",
            "คณะรัฐมนตรีมีมติประกาศให้ 'ปลากัดไทย' (Siamese Fighting Fish) เป็นสัตว์น้ำประจำชาติไทย เนื่องจากสะท้อนประวัติศาสตร์ วัฒนธรรม และการเพาะพันธุ์อันโดดเด่น",
            "Der Siamesische Kampffisch wurde 2019 offiziell zum Nationalen Wassertier Thailands erklärt, um seine kulturhistorische Bedeutung und thailändische Zuchterfolge zu würdigen.",
            [{ title: "Royal Society of Thailand – National Aquatic Animal", url: "https://www.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-sport-012", "sport", 2, "single_choice",
            "มงคล (Mongkhon) ที่นักมวยไทยสวมใส่บนศีรษะขณะร่ายรำไหว้ครู มีความหมายหลักในแง่ใด?",
            "Welche primäre Bedeutung hat der 'Mongkhon'-Kopfring, den Muay-Thai-Kämpfer während des Wai-Khru-Tanzes auf dem Kopf tragen?",
            "Mongkhon thi nak muai Thai suam sai bon sisa khana rai ram wai khru, mi khwammai lak nai ngae dai?",
            [
                ["a", "เครื่องรางมงคลและสัญลักษณ์แห่งความเคารพต่อครูมวย", "Glücksbringer und Zeichen des Respekts vor dem Meister", "Khrueang rang mongkhon lae sanyalak haeng khwam khao rop to khru muai"],
                ["b", "หมวกกันน็อกป้องกันการบาดเจ็บ", "Schutzhelm gegen Kopfschläge", "Muoak kan nok pongkan kan bat chep"],
                ["c", "เครื่องบอกระดับเข็มขัดหรือสายชั้น", "Rangabzeichen wie ein Gürtel", "Khrueang bok radap khemkhat"],
                ["d", "ของรางวัลสำหรับผู้ชนะการแข่งขัน", "Siegerpreis nach dem Kampf", "Khong rangwan samrap phu chana"]
            ],
            "a",
            "มงคลเป็นของสูงที่ครูมวยประสิทธิ์ประสาทให้เพื่อคุ้มครองศิษย์ โดยจะถอดออกจากศีรษะก่อนการชกเริ่มขึ้นจริง",
            "Der Mongkhon ist ein geweihter Talisman aus Kordeln und Stoff, den der Trainer seinem Schüler verleiht. Vor dem Kampfbeginn nimmt der Trainer ihn feierlich vom Kopf ab.",
            [{ title: "World Muaythai Council – Traditions of Muay Thai", url: "https://wmcmuaythai.org/" }]
        ),
        makeQuestion(
            "thq-sport-013", "sport", 3, "single_choice",
            "การแข่งเรือยาวประเพณี ซึ่งจัดขึ้นในฤดูน้ำหลากช่วงเทศกาลออกพรรษา นิยมใช้ฝีพายพายเรือที่ขุดมาจากไม้ชนิดใดเป็นส่วนใหญ่?",
            "Aus welchen edlen Baumstämmen wurden die traditionellen Langboote (Ruea Yao) für die herbstlichen Flussregatten ursprünglich gehauen?",
            "Kan khaeng ruea yao prapheni sueng chat khuen nai ruedu nam lak chuang thetsakan ok phansa, niyom chai fiphai phai ruea thi khut ma chak mai chanit dai pen suan yai?",
            [
                ["a", "ไม้ตะเคียน", "Takian-Holz (Hopea odorata)", "Mai takhian"],
                ["b", "ไม้สน", "Kiefernholz", "Mai son"],
                ["c", "ไม้ยางพารา", "Kautschukholz", "Mai yang phara"],
                ["d", "ไม้ไผ่รวก", "Bambusstangen", "Mai phai ruak"]
            ],
            "a",
            "เรือยาวดั้งเดิมนิยมขุดจากซุงไม้ตะเคียนทองทั้งต้น เพราะเนื้อไม้เหนียว ทนน้ำ และมีความเชื่อเรื่องแม่ย่านางสถิตเพื่อคุ้มครองเรือ",
            "Traditionelle Rennlangboote wurden meisterhaft aus einem einzigen Takian-Stamm gefertigt. Takian-Holz gilt als elastisch, wasserfest und von Bootsgeistern behütet.",
            [{ title: "Tourism Authority of Thailand – Traditional Long Boat Racing", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-rel-011", "religion", 2, "single_choice",
            "พระพุทธรูปปางสมาธิองค์ใหญ่บนยอดเขานาคเกิด ในจังหวัดภูเก็ต ที่ประดับด้วยหินอ่อนหยกขาวสุริยกานต์ มีชื่อเรียกว่าอะไร?",
            "Wie heißt die berühmte, 45 Meter hohe weiße Buddha-Statue aus burmesischem Marmor auf dem Hügel Nakkerd auf Phuket?",
            "Phra phuttharup pang samathi ong yai bon yot khao Nakkoet nai changwat Phuket thi pradap duai hin-on yok khao Suriyakan, mi chue riak wa arai?",
            [
                ["a", "พระใหญ่ภูเก็ต (พระพุทธมิ่งมงคลเอกนาคคีรี)", "Big Buddha Phuket (Phra Phutta Ming Mongkol)", "Phra Yai Phuket"],
                ["b", "หลวงพ่อโต", "Luang Pho To", "Luang Pho To"],
                ["c", "พระรอดลำพูน", "Phra Rot Lamphun", "Phra Rot Lamphun"],
                ["d", "พระพุทธชินราช", "Phra Phuttha Chinnarat", "Phra Phuttha Chinnarat"]
            ],
            "a",
            "พระใหญ่ภูเก็ตมีความสูงถึง 45 เมตร ประดิษฐานตระหง่านอยู่บนยอดเขานาคเกิด เป็นจุดชมวิวแบบ 360 องศา และศูนย์รวมศรัทธาสำคัญ",
            "Der 'Big Buddha Phuket' thront 45 Meter hoch auf den Nakkerd Hills und ist mit weißem Marmor verkleidet; von dort überblickt man Chalong Bay und Kata.",
            [{ title: "Tourism Authority of Thailand – Big Buddha Phuket", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-rel-012", "religion", 3, "single_choice",
            "ผ้าจีวรของพระภิกษุสงฆ์ในพระพุทธศาสนาแบบเถรวาทในประเทศไทย ประกอบด้วยผ้ากี่ผืนตามหลักพระวินัย (ไตรจีวร)?",
            "Aus wie vielen traditionellen Gewandstücken besteht das vorgeschriebene Dreiteiler-Gewand eines Theravada-Mönchs (Traijiwon)?",
            "Pha chiwon khong phra phiksu song nai phraphutthasatsana baep Therawat nai prathet Thai prakop duai pha ki phuen tam lak phra winai (trai chiwon)?",
            [
                ["a", "3 ผืน (สบง จีวร สังฆาฏิ)", "3 Teile (Untergewand, Hauptgewand, Übergewand)", "Sam phuen (Sabong, Chiwon, Sangkhati)"],
                ["b", "1 ผืน", "1 Teil", "Nueng phuen"],
                ["c", "5 ผืน", "5 Teile", "Ha phuen"],
                ["d", "7 ผืน", "7 Teile", "Chet phuen"]
            ],
            "a",
            "ไตรจีวรประกอบด้วย 3 ผืน ได้แก่ สบง (ผ้านุ่ง), จีวร (ผ้าห่มคลุม), และสังฆาฏิ (ผ้าพาดบ่าซ้อนทับ)",
            "Das buddhistische Mönchsgewand 'Traijiwon' umfasst genau drei vorgeschriebene Stofftücher: Sabong (Untergewand), Chiwon (Hauptrobe) und Sangkhati (Schulter-/Doppelgewand).",
            [{ title: "National Buddhism Office – Monastic Discipline", url: "https://www.onab.go.th/" }]
        ),
        makeQuestion(
            "thq-lan-011", "language_daily", 2, "single_choice",
            "สำนวนภาษาไทยคำว่า 'ใจดี' (Chai Di) มีความหมายตรงกับข้อใด?",
            "Was bedeutet die häufige thailändische Charaktereigenschaft 'Jai Di' (ใจดี) wörtlich und sinngemäß?",
            "Samnuan phasa Thai kham wa 'chai di' mi khwammai trong kap kho dai?",
            [
                ["a", "มีเมตตา กรุณา เอื้อเฟื้อเผื่อแผ่", "Gutherzig, freundlich und hilfsbereit", "Mi metta, karuna, uea-fue phuea-phae"],
                ["b", "ขี้โมโห ฉุนเฉียวง่าย", "Leicht reizbar und aufbrausend", "Khi moho, chun chiao ngai"],
                ["c", "ขี้เหนียว ไม่ยอมแบ่งปัน", "Geizig und unnachgiebig", "Khi niao, mai yom baengpan"],
                ["d", "ขี้เกียจ ไม่ยอมทำงาน", "Faul und arbeitsscheu", "Khi kiat, mai yom tham ngan"]
            ],
            "a",
            "'ใจดี' หมายถึงบุคคลที่มีจิตใจโอบอ้อมอารี พร้อมช่วยเหลือและมอบสิ่งดีๆ ให้ผู้อื่น เป็นคุณลักษณะที่ผู้คนชื่นชม",
            "'Jai Di' bedeutet wörtlich 'gutes Herz' und beschreibt eine großzügige, wohlwollende und warmherzige Persönlichkeit.",
            [{ title: "Royal Society of Thailand – Thai Heart Idioms", url: "https://www.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-lan-012", "language_daily", 2, "single_choice",
            "คำว่า 'สู้ๆ' (Su Su) ที่คนไทยนิยมพูดให้กำลังใจกัน มีความหมายเทียบเคียงได้กับคำใดในภาษาเยอรมัน?",
            "Welchem deutschen Ausdruck entspricht der allgegenwärtige thailändische Ansporn 'Su Su!' (สู้ๆ)?",
            "Kham wa 'su su' thi khon Thai niyom phut hai kamlangchai kan, mi khwammai thiapkhian dai kap kham dai nai phasa Yoeraman?",
            [
                ["a", "Gib nicht auf! / Halt durch! / Viel Erfolg!", "Gib nicht auf! / Halt durch! / Du schaffst das!", "Su to pai / Otthon wai"],
                ["b", "Gute Nacht!", "Gute Nacht!", "Ratri sawat"],
                ["c", "Guten Appetit!", "Guten Appetit!", "Thantawan aroy"],
                ["d", "Auf Wiedersehen!", "Auf Wiedersehen!", "La kon"]
            ],
            "a",
            "'สู้ๆ' มาจากการซ้ำคำว่า 'สู้' ใช้ปลอบโยนและเสริมกำลังใจในยามพบอุปสรรค คล้ายกับ 'Fighting!' หรือ 'Gib nicht auf!'",
            "'Su Su!' (wörtlich: Kämpfe!) ist der beliebteste Motivationsruf unter Freunden, Kollegen und Sportlern, um Kraft und Durchhaltevermögen zuzusprechen.",
            [{ title: "Tourism Authority of Thailand – Everyday Thai Motivation", url: "https://www.tourismthailand.org/" }]
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
