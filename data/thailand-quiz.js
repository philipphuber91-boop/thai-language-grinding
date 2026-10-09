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
        { id: "language_daily", icon: "💬", th: "ภาษาและชีวิตประจำวัน", de: "Alltag & Sprache" },
        { id: "beginner_animals", icon: "🐾", th: "สัตว์", de: "Tiere" },
        { id: "beginner_colors_numbers", icon: "🎨", th: "สีและตัวเลข", de: "Farben & Zahlen" },
        { id: "beginner_food_drink", icon: "🍌", th: "อาหารและเครื่องดื่ม", de: "Essen & Trinken" },
        { id: "beginner_family_body", icon: "👪", th: "ครอบครัวและร่างกาย", de: "Familie & Körper" },
        { id: "beginner_daily_life", icon: "🏠", th: "ชีวิตประจำวัน", de: "Alltag" },
        { id: "beginner_greetings", icon: "💬", th: "คำทักทาย", de: "Begrüßungen" },
        { id: "beginner_nature_weather", icon: "🌦️", th: "ธรรมชาติและอากาศ", de: "Natur & Wetter" },
        { id: "beginner_thailand_places", icon: "🗺️", th: "สถานที่ในประเทศไทย", de: "Orte in Thailand" },
        { id: "beginner_transport", icon: "🚲", th: "การเดินทาง", de: "Verkehr" },
        { id: "beginner_thai_culture", icon: "🎉", th: "วัฒนธรรมไทย", de: "Thai-Kultur" },
        { id: "beginner_school", icon: "🎒", th: "โรงเรียน", de: "Schule" },
        { id: "beginner_time", icon: "⏰", th: "เวลาและปฏิทิน", de: "Zeit & Kalender" },
        { id: "beginner_shopping", icon: "🛍️", th: "การซื้อของ", de: "Einkaufen" },
        { id: "beginner_health", icon: "🩺", th: "สุขภาพ", de: "Gesundheit" },
        { id: "beginner_clothing", icon: "👕", th: "เสื้อผ้า", de: "Kleidung" },
        { id: "beginner_jobs", icon: "🧰", th: "อาชีพ", de: "Berufe" },
        { id: "beginner_technology", icon: "📱", th: "เทคโนโลยี", de: "Technik" },
        { id: "beginner_home", icon: "🏠", th: "ห้องต่างๆ ในบ้าน", de: "Räume zu Hause" },
        { id: "beginner_music_art", icon: "🎨", th: "ดนตรีและศิลปะ", de: "Musik & Kunst" },
        { id: "beginner_hobbies", icon: "⚽", th: "งานอดิเรกและเวลาว่าง", de: "Hobbys & Freizeit" }
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

    const beginnerSources = {
        animals: {
            title: "Department of National Parks, Wildlife and Plant Conservation",
            url: "https://www.dnp.go.th/"
        },
        colors_numbers: {
            title: "Royal Society of Thailand – Dictionary",
            url: "https://dictionary.orst.go.th/"
        },
        food_drink: {
            title: "Tourism Authority of Thailand – Thai Food",
            url: "https://www.tourismthailand.org/"
        },
        family_body: {
            title: "Royal Society of Thailand – Dictionary",
            url: "https://dictionary.orst.go.th/"
        },
        daily_life: {
            title: "Royal Society of Thailand – Dictionary",
            url: "https://dictionary.orst.go.th/"
        },
        greetings: {
            title: "Tourism Authority of Thailand – Thai Language",
            url: "https://www.tourismthailand.org/"
        },
        nature_weather: {
            title: "Department of National Parks, Wildlife and Plant Conservation",
            url: "https://www.dnp.go.th/"
        },
        thailand_places: {
            title: "Tourism Authority of Thailand",
            url: "https://www.tourismthailand.org/"
        },
        transport: {
            title: "Bangkok Mass Transit System",
            url: "https://www.bts.co.th/"
        },
        thai_culture: {
            title: "UNESCO Intangible Cultural Heritage",
            url: "https://ich.unesco.org/"
        },
        school: {
            title: "UNESCO – Education",
            url: "https://www.unesco.org/en/education"
        },
        time: {
            title: "Royal Society of Thailand – Dictionary",
            url: "https://dictionary.orst.go.th/"
        },
        shopping: {
            title: "Tourism Authority of Thailand",
            url: "https://www.tourismthailand.org/"
        },
        health: {
            title: "Ministry of Public Health Thailand",
            url: "https://www.moph.go.th/"
        },
        clothing: {
            title: "Royal Society of Thailand – Dictionary",
            url: "https://dictionary.orst.go.th/"
        },
        jobs: {
            title: "Ministry of Labour Thailand",
            url: "https://www.mol.go.th/"
        },
        technology: {
            title: "National Science and Technology Development Agency",
            url: "https://www.nstda.or.th/"
        },
        home: {
            title: "Royal Society of Thailand – Dictionary",
            url: "https://dictionary.orst.go.th/"
        },
        music_art: {
            title: "UNESCO – Culture",
            url: "https://www.unesco.org/en/culture"
        },
        hobbies: {
            title: "Sports Authority of Thailand",
            url: "https://www.sat.or.th/"
        }
    };

    const beginnerOptionSets = {
        animals: [
            ["แมว", "Katze", "maeo"],
            ["หมา", "Hund", "ma"],
            ["ปลา", "Fisch", "pla"],
            ["ช้าง", "Elefant", "chang"]
        ],
        colors: [
            ["แดง", "Rot", "daeng"],
            ["เหลือง", "Gelb", "lueang"],
            ["เขียว", "Grün", "khiao"],
            ["ฟ้า", "Hellblau", "fa"]
        ],
        numbers: [
            ["หนึ่ง", "Eins", "nueng"],
            ["สอง", "Zwei", "song"],
            ["สาม", "Drei", "sam"],
            ["ห้า", "Fünf", "ha"]
        ],
        food: [
            ["ข้าว", "Reis", "khao"],
            ["น้ำ", "Wasser", "nam"],
            ["ไข่", "Ei", "khai"],
            ["กล้วย", "Banane", "kluai"]
        ],
        family: [
            ["แม่", "Mutter", "mae"],
            ["พ่อ", "Vater", "pho"],
            ["พี่ชาย", "älterer Bruder", "phi chai"],
            ["ยาย", "Großmutter (mütterlicherseits)", "yai"]
        ],
        grandparents: [
            ["ปู่", "Großvater (väterlicherseits)", "pu"],
            ["ตา", "Großvater (mütterlicherseits)", "ta"],
            ["ย่า", "Großmutter (väterlicherseits)", "ya"],
            ["ยาย", "Großmutter (mütterlicherseits)", "yai"]
        ],
        body: [
            ["ตา", "Auge", "ta"],
            ["หู", "Ohr", "hu"],
            ["จมูก", "Nase", "chamuk"],
            ["มือ", "Hand", "mue"]
        ],
        daily_life: [
            ["ปากกา", "Stift", "pakka"],
            ["เก้าอี้", "Stuhl", "kao-i"],
            ["หนังสือ", "Buch", "nang-sue"],
            ["ร่ม", "Regenschirm", "rom"]
        ],
        household: [
            ["เตียง", "Bett", "tiang"],
            ["โต๊ะ", "Tisch", "to"],
            ["ประตู", "Tür", "pratu"],
            ["เก้าอี้", "Stuhl", "kao-i"]
        ],
        utensils: [
            ["ช้อน", "Löffel", "chon"],
            ["ส้อม", "Gabel", "som"],
            ["จาน", "Teller", "chan"],
            ["แก้ว", "Glas", "kaeo"]
        ],
        greetings: [
            ["สวัสดี", "Hallo", "sawatdi"],
            ["ขอบคุณ", "Danke", "khop khun"],
            ["ขอโทษ", "Entschuldigung", "kho thot"],
            ["ลาก่อน", "Auf Wiedersehen", "la kon"]
        ],
        greeting_response: [
            ["ไม่เป็นไร", "Gern geschehen / macht nichts", "mai pen rai"],
            ["ขอบคุณ", "Danke", "khop khun"],
            ["ขอโทษ", "Entschuldigung", "kho thot"],
            ["ลาก่อน", "Auf Wiedersehen", "la kon"]
        ],
        nature: [
            ["พระอาทิตย์", "Sonne", "phra athit"],
            ["ฝน", "Regen", "fon"],
            ["เมฆ", "Wolke", "mek"],
            ["ดาว", "Stern", "dao"]
        ],
        places: [
            ["กรุงเทพฯ", "Bangkok", "Krung Thep"],
            ["เชียงใหม่", "Chiang Mai", "Chiang Mai"],
            ["ภูเก็ต", "Phuket", "Phuket"],
            ["พัทยา", "Pattaya", "Phatthaya"]
        ],
        southern_places: [
            ["ภูเก็ต", "Phuket", "Phuket"],
            ["เชียงใหม่", "Chiang Mai", "Chiang Mai"],
            ["กรุงเทพฯ", "Bangkok", "Krung Thep"],
            ["พัทยา", "Pattaya", "Phatthaya"]
        ],
        transport: [
            ["รถยนต์", "Auto", "rot yon"],
            ["เรือ", "Boot", "ruea"],
            ["เครื่องบิน", "Flugzeug", "khrueang bin"],
            ["จักรยาน", "Fahrrad", "chakkrayan"]
        ],
        rail: [
            ["รถไฟ", "Zug", "rot fai"],
            ["รถยนต์", "Auto", "rot yon"],
            ["เรือ", "Boot", "ruea"],
            ["จักรยาน", "Fahrrad", "chakkrayan"]
        ],
        slow_animals: [
            ["เต่า", "Schildkröte", "tao"],
            ["แมว", "Katze", "maeo"],
            ["หมา", "Hund", "ma"],
            ["ช้าง", "Elefant", "chang"]
        ],
        thai_culture: [
            ["สงกรานต์", "Songkran", "songkran"],
            ["ลอยกระทง", "Loi Krathong", "loi krathong"],
            ["การไหว้", "Wai-Geste", "kan wai"],
            ["มวยไทย", "Muay Thai", "muai Thai"]
        ],
        animals_small: [
            ["กระต่าย", "Kaninchen", "kratai"],
            ["เต่า", "Schildkröte", "tao"],
            ["งู", "Schlange", "ngu"],
            ["กบ", "Frosch", "kop"]
        ],
        animals_night: [
            ["ค้างคาว", "Fledermaus", "khangkhao"],
            ["ปลา", "Fisch", "pla"],
            ["ช้าง", "Elefant", "chang"],
            ["ไก่", "Huhn", "kai"]
        ],
        colors_basic: [
            ["ฟ้า", "Hellblau", "fa"],
            ["แดง", "Rot", "daeng"],
            ["เหลือง", "Gelb", "lueang"],
            ["เขียว", "Grün", "khiao"]
        ],
        colors_pumpkin: [
            ["ส้ม", "Orange", "som"],
            ["ดำ", "Schwarz", "dam"],
            ["ขาว", "Weiß", "khao"],
            ["เขียว", "Grün", "khiao"]
        ],
        colors_coal: [
            ["ขาว", "Weiß", "khao"],
            ["ดำ", "Schwarz", "dam"],
            ["แดง", "Rot", "daeng"],
            ["เหลือง", "Gelb", "lueang"]
        ],
        numbers_four: [
            ["สอง", "Zwei", "song"],
            ["สาม", "Drei", "sam"],
            ["สี่", "Vier", "si"],
            ["ห้า", "Fünf", "ha"]
        ],
        fruit_spiky: [
            ["สับปะรด", "Ananas", "sapparot"],
            ["แตงโม", "Wassermelone", "taengmo"],
            ["มะม่วง", "Mango", "mamuang"],
            ["ส้ม", "Orange", "som"]
        ],
        fruit_colors: [
            ["แตงโม", "Wassermelone", "taengmo"],
            ["มะม่วง", "Mango", "mamuang"],
            ["ส้ม", "Orange", "som"],
            ["กล้วย", "Banane", "kluai"]
        ],
        orange_drink: [
            ["น้ำส้ม", "Orangensaft", "nam som"],
            ["น้ำมะพร้าว", "Kokoswasser", "nam maphrao"],
            ["นม", "Milch", "nom"],
            ["กาแฟ", "Kaffee", "ka-fae"]
        ],
        baked_food: [
            ["ขนมปัง", "Brot", "khanom pang"],
            ["ไข่", "Ei", "khai"],
            ["ข้าว", "Reis", "khao"],
            ["ปลา", "Fisch", "pla"]
        ],
        fruit_seed: [
            ["มะม่วง", "Mango", "mamuang"],
            ["ส้ม", "Orange", "som"],
            ["สับปะรด", "Ananas", "sapparot"],
            ["แตงโม", "Wassermelone", "taengmo"]
        ],
        body_actions: [
            ["ฟัน", "Zähne", "fan"],
            ["ปาก", "Mund", "pak"],
            ["ผม", "Haare", "phom"],
            ["แขน", "Arm", "khaen"],
            ["เท้า", "Fuß", "thao"]
        ],
        home_use: [
            ["ประตู", "Tür", "pratu"],
            ["มือ", "Hand", "mue"],
            ["ผ้าขนหนู", "Handtuch", "pha khon nu"],
            ["ตู้เสื้อผ้า", "Kleiderschrank", "tu suea pha"],
            ["จาน", "Teller", "chan"]
        ],
        chat_name: [
            ["คุณชื่ออะไร?", "Wie heißt du?", "khun chue arai?"],
            ["ราคาเท่าไร?", "Wie viel kostet es?", "rakha thao rai?"],
            ["ไม่เข้าใจ", "Ich verstehe nicht", "mai khao chai"],
            ["ฉันชอบแมว", "Ich mag Katzen", "chan chop maeo"]
        ],
        chat_understand: [
            ["ฉันไม่เข้าใจ", "Ich verstehe nicht", "chan mai khao chai"],
            ["ฉันหิว", "Ich bin hungrig", "chan hiu"],
            ["ฉันง่วง", "Ich bin müde", "chan nguang"],
            ["ฉันชอบ", "Ich mag es", "chan chop"]
        ],
        chat_price: [
            ["ราคาเท่าไร?", "Wie viel kostet es?", "rakha thao rai?"],
            ["คุณชื่ออะไร?", "Wie heißt du?", "khun chue arai?"],
            ["ไปไหน?", "Wohin gehst du?", "pai nai?"],
            ["สบายดีไหม?", "Geht es dir gut?", "sabai di mai?"]
        ],
        chat_slow: [
            ["พูดช้าๆ ได้ไหม?", "Kannst du langsam sprechen?", "phut cha-cha dai mai?"],
            ["ลาก่อน", "Auf Wiedersehen", "la kon"],
            ["ขอบคุณ", "Danke", "khop khun"],
            ["ไม่เป็นไร", "Macht nichts", "mai pen rai"]
        ],
        chat_like: [
            ["ฉันชอบแมว", "Ich mag Katzen", "chan chop maeo"],
            ["ฉันไม่เข้าใจ", "Ich verstehe nicht", "chan mai khao chai"],
            ["ฉันหิว", "Ich bin hungrig", "chan hiu"],
            ["ฉันง่วง", "Ich bin müde", "chan nguang"]
        ],
        seasons: [
            ["ฤดูร้อน", "Sommer", "rue du ron"],
            ["ฤดูฝน", "Regenzeit", "rue du fon"],
            ["ฤดูหนาว", "Winter", "rue du nao"],
            ["ฤดูใบไม้ผลิ", "Frühling", "rue du bai mai phli"]
        ],
        flower_insects: [
            ["ผึ้ง", "Biene", "phueng"],
            ["มด", "Ameise", "mot"],
            ["ยุง", "Mücke", "yung"],
            ["แมลงวัน", "Fliege", "malaeng wan"]
        ],
        wind_items: [
            ["ใบไม้", "Blatt", "bai mai"],
            ["ก้อนหิน", "Stein", "kon hin"],
            ["ช้อน", "Löffel", "chon"],
            ["แก้ว", "Glas", "kaeo"]
        ],
        places_new: [
            ["ประจวบคีรีขันธ์", "Prachuap Khiri Khan", "prachuap khiri khan"],
            ["สตูล", "Satun", "satun"],
            ["กาญจนบุรี", "Kanchanaburi", "kanchanaburi"],
            ["แม่ฮ่องสอน", "Mae Hong Son", "mae hong son"],
            ["เชียงใหม่", "Chiang Mai", "chiang mai"]
        ],
        vehicles_city: [
            ["รถเมล์", "Bus", "rot me"],
            ["รถจักรยานยนต์", "Motorrad", "rot chakkrayan yon"],
            ["รถบรรทุก", "Lkw", "rot banthuk"],
            ["รถแท็กซี่", "Taxi", "rot taeksi"]
        ],
        vehicles_emergency: [
            ["รถพยาบาล", "Krankenwagen", "rot phayaban"],
            ["รถเมล์", "Bus", "rot me"],
            ["รถแท็กซี่", "Taxi", "rot taeksi"],
            ["รถจักรยาน", "Fahrrad", "rot chakkrayan"]
        ],
        money: [
            ["เยน", "Yen", "yen"],
            ["บาท", "Baht", "bat"],
            ["ยูโร", "Euro", "yuro"],
            ["ดอลลาร์", "Dollar", "donla"]
        ],
        polite_men: [
            ["ครับ", "Höflichkeitspartikel, typisch bei Männern", "khrap"],
            ["ค่ะ", "Höflichkeitspartikel, typisch bei Frauen", "kha"],
            ["ลาก่อน", "Auf Wiedersehen", "la kon"],
            ["ขอโทษ", "Entschuldigung", "kho thot"]
        ],
        polite_women: [
            ["ขอบคุณ", "Danke", "khop khun"],
            ["ค่ะ", "Höflichkeitspartikel, typisch bei Frauen", "kha"],
            ["ครับ", "Höflichkeitspartikel, typisch bei Männern", "khrap"],
            ["ไม่ใช่", "Nein", "mai chai"]
        ],
        noodle_tools: [
            ["ตะเกียบ", "Essstäbchen", "takhiap"],
            ["รองเท้า", "Schuhe", "rongthao"],
            ["ปากกา", "Stift", "pakka"],
            ["หมวก", "Hut", "muak"]
        ],
        pha_khao_ma: [
            ["ผ้าลายตาราง", "kariertes Tuch", "pha lai tarang"],
            ["กระดาษ", "Papier", "kradat"],
            ["โลหะ", "Metall", "loha"],
            ["แก้ว", "Glas", "kaeo"]
        ],
        school_places: [
            ["โรงเรียน", "Schule", "rongrian"],
            ["ตลาด", "Markt", "talat"],
            ["โรงพยาบาล", "Krankenhaus", "rongphayaban"],
            ["สนามบิน", "Flughafen", "sanam bin"]
        ],
        school_roles: [
            ["ครู", "Lehrer", "khru"],
            ["ช่าง", "Handwerker", "chang"],
            ["คนขับรถ", "Fahrer", "khon khap rot"],
            ["พ่อครัว", "Koch", "pho khrua"]
        ],
        school_board: [
            ["กระดาน", "Tafel", "kradan"],
            ["หมอน", "Kissen", "mon"],
            ["จาน", "Teller", "chan"],
            ["รองเท้า", "Schuhe", "rongthao"]
        ],
        school_paper: [
            ["กระดาษ", "Papier", "kradat"],
            ["แก้ว", "Glas", "kaeo"],
            ["เสื้อ", "Hemd", "suea"],
            ["ลูกบอล", "Ball", "luk bon"]
        ],
        school_bag: [
            ["กระเป๋า", "Tasche", "krapao"],
            ["หม้อ", "Topf", "mo"],
            ["ตู้เย็น", "Kühlschrank", "tu yen"],
            ["รองเท้า", "Schuhe", "rongthao"]
        ],
        school_subject: [
            ["คณิตศาสตร์", "Mathematik", "khanittasat"],
            ["ดนตรี", "Musik", "dontri"],
            ["ศิลปะ", "Kunst", "sinlapa"],
            ["กีฬา", "Sport", "kila"]
        ],
        school_library: [
            ["ห้องสมุด", "Bibliothek", "hong samut"],
            ["ห้องน้ำ", "Toilette", "hong nam"],
            ["สนามกีฬา", "Sportplatz", "sanam kila"],
            ["โรงอาหาร", "Kantine", "rong ahan"]
        ],
        day_hours: [
            ["24 ชั่วโมง", "24 Stunden", "yi sip si chuamong"],
            ["12 ชั่วโมง", "12 Stunden", "sip song chuamong"],
            ["60 นาที", "60 Minuten", "hok sip nathi"],
            ["100 ชั่วโมง", "100 Stunden", "nueng roi chuamong"]
        ],
        minute_seconds: [
            ["60 วินาที", "60 Sekunden", "hok sip winathi"],
            ["30 วินาที", "30 Sekunden", "sam sip winathi"],
            ["100 วินาที", "100 Sekunden", "nueng roi winathi"],
            ["24 วินาที", "24 Sekunden", "yi sip si winathi"]
        ],
        weekday_order: [
            ["วันจันทร์", "Montag", "wan chan"],
            ["วันอังคาร", "Dienstag", "wan angkhan"],
            ["วันพุธ", "Mittwoch", "wan phut"],
            ["วันศุกร์", "Freitag", "wan suk"]
        ],
        noon_time: [
            ["สิบโมง", 10, "sip mong"],
            ["สิบเอ็ดโมง", 11, "sip et mong"],
            ["สิบสองโมง", 12, "sip song mong"],
            ["หนึ่งโมง", 1, "nueng mong"]
        ],
        calendar_info: [
            ["วันที่", "Datum", "wan thi"],
            ["รสชาติ", "Geschmack", "rot chat"],
            ["น้ำหนัก", "Gewicht", "nam nak"],
            ["เสียง", "Geräusch", "siang"]
        ],
        shopping_market: [
            ["ตลาด", "Markt", "talat"],
            ["โรงเรียน", "Schule", "rongrian"],
            ["โรงหนัง", "Kino", "rong nang"],
            ["สนามบิน", "Flughafen", "sanam bin"]
        ],
        cashier: [
            ["พนักงานเก็บเงิน", "Kassierer", "phanakngan kep ngoen"],
            ["นักเรียน", "Schüler", "nakrian"],
            ["ช่างตัดผม", "Friseur", "chang tat phom"],
            ["คนสวน", "Gärtner", "khon suan"]
        ],
        shopping_bag: [
            ["ถุง", "Tüte", "thung"],
            ["หมอน", "Kissen", "mon"],
            ["รองเท้า", "Schuhe", "rongthao"],
            ["ช้อน", "Löffel", "chon"]
        ],
        pharmacy_goods: [
            ["ยา", "Medizin", "ya"],
            ["หนังสือเรียน", "Schulbuch", "nangsue rian"],
            ["ลูกบอล", "Ball", "luk bon"],
            ["เสื้อผ้า", "Kleidung", "suea pha"]
        ],
        change_amount: [
            ["10 บาท", "10 Baht", "sip baht"],
            ["20 บาท", "20 Baht", "yi sip baht"],
            ["30 บาท", "30 Baht", "sam sip baht"],
            ["40 บาท", "40 Baht", "si sip baht"]
        ],
        receipt: [
            ["ใบเสร็จ", "Quittung", "bai set"],
            ["หมวก", "Hut", "muak"],
            ["รองเท้า", "Schuhe", "rongthao"],
            ["ช้อน", "Löffel", "chon"]
        ],
        fever: [
            ["ตัวร้อน", "heißer Körper", "tua ron"],
            ["หนาว", "kalt", "nao"],
            ["หิว", "hungrig", "hiu"],
            ["ง่วง", "müde", "nguang"]
        ],
        wound: [
            ["แผล", "Wunde", "phlae"],
            ["ผม", "Haare", "phom"],
            ["รองเท้า", "Schuhe", "rongthao"],
            ["หนังสือ", "Buch", "nangsue"]
        ],
        clothes_socks: [
            ["ถุงเท้า", "Socken", "thung thao"],
            ["ถุงมือ", "Handschuhe", "thung mue"],
            ["หมวก", "Hut", "muak"],
            ["ผ้าพันคอ", "Schal", "pha phan kho"]
        ],
        clothes_sun: [
            ["หมวก", "Hut", "muak"],
            ["ถุงเท้า", "Socken", "thung thao"],
            ["เข็มขัด", "Gürtel", "khemkhat"],
            ["ถุงมือ", "Handschuhe", "thung mue"]
        ],
        washing_machine: [
            ["เครื่องซักผ้า", "Waschmaschine", "khrueang sak pha"],
            ["พัดลม", "Ventilator", "phat lom"],
            ["โทรทัศน์", "Fernseher", "thorasap"],
            ["เตาอบ", "Backofen", "ta op"]
        ],
        cold_clothes: [
            ["เสื้อกันหนาว", "Pullover", "suea kan nao"],
            ["ชุดว่ายน้ำ", "Badeanzug", "chut wai nam"],
            ["รองเท้าแตะ", "Sandalen", "rongthao tae"],
            ["แว่นตา", "Brille", "waen ta"]
        ],
        hanger: [
            ["ไม้แขวนเสื้อ", "Kleiderbügel", "mai khwaen suea"],
            ["ช้อน", "Löffel", "chon"],
            ["จาน", "Teller", "chan"],
            ["หมอน", "Kissen", "mon"]
        ],
        wet_cloth: [
            ["ตากให้แห้ง", "zum Trocknen aufhängen", "tak hai haeng"],
            ["กิน", "essen", "kin"],
            ["อ่าน", "lesen", "an"],
            ["ใส่ตู้เย็น", "in den Kühlschrank legen", "sai tu yen"]
        ],
        sewing: [
            ["ผ้า", "Stoff", "pha"],
            ["กระดาษ", "Papier", "kradat"],
            ["น้ำ", "Wasser", "nam"],
            ["แก้ว", "Glas", "kaeo"]
        ],
        camera: [
            ["กล้อง", "Kamera", "klong"],
            ["ช้อน", "Löffel", "chon"],
            ["หมอน", "Kissen", "mon"],
            ["ถุงเท้า", "Socken", "thung thao"]
        ],
        remote: [
            ["รีโมต", "Fernbedienung", "rimo"],
            ["กุญแจ", "Schlüssel", "kunchae"],
            ["แปรงสีฟัน", "Zahnbürste", "praeng si fan"],
            ["กระเป๋า", "Tasche", "krapao"]
        ],
        charger: [
            ["ที่ชาร์จ", "Ladegerät", "thi chat"],
            ["จาน", "Teller", "chan"],
            ["หมวก", "Hut", "muak"],
            ["หนังสือ", "Buch", "nangsue"]
        ],
        keyboard: [
            ["แป้นพิมพ์", "Tastatur", "paen phim"],
            ["แก้วน้ำ", "Trinkglas", "kaeo nam"],
            ["รองเท้า", "Schuhe", "rongthao"],
            ["หมอน", "Kissen", "mon"]
        ],
        headphones: [
            ["หูฟัง", "Kopfhörer", "hu fang"],
            ["ถุงมือ", "Handschuhe", "thung mue"],
            ["เข็มขัด", "Gürtel", "khemkhat"],
            ["ผ้ากันเปื้อน", "Schürze", "pha kan puen"]
        ],
        jobs_hair: [
            ["ช่างตัดผม", "Friseur", "chang tat phom"],
            ["คนสวน", "Gärtner", "khon suan"],
            ["นักบิน", "Pilot", "nak bin"],
            ["ชาวนา", "Bauer", "chao na"]
        ],
        jobs_fishing: [
            ["ชาวประมง", "Fischer", "chao pramong"],
            ["ทันตแพทย์", "Zahnarzt", "thantaphaet"],
            ["ครู", "Lehrer", "khru"],
            ["นักบิน", "Pilot", "nak bin"]
        ],
        computer_mouse: [
            ["คลิกบนหน้าจอ", "auf dem Bildschirm klicken", "khlik bon na cho"],
            ["เขียนบนกระดาษ", "auf Papier schreiben", "khian bon kradat"],
            ["ล้างจาน", "Geschirr spülen", "lang chan"],
            ["ใส่รองเท้า", "Schuhe anziehen", "sai rongthao"]
        ],
        printer_use: [
            ["พิมพ์เอกสาร", "Dokumente drucken", "phim ekkasan"],
            ["หุงข้าว", "Reis kochen", "hung khao"],
            ["ตัดผม", "Haare schneiden", "tat phom"],
            ["ล้างมือ", "Hände waschen", "lang mue"]
        ],
        room_wall: [
            ["ผนัง", "Wand", "phanang"],
            ["พื้น", "Boden", "phuen"],
            ["หลังคา", "Dach", "langkha"],
            ["รองเท้า", "Schuhe", "rongthao"]
        ],
        door_key: [
            ["กุญแจ", "Schlüssel", "kunchae"],
            ["หมอน", "Kissen", "mon"],
            ["ช้อน", "Löffel", "chon"],
            ["แก้ว", "Glas", "kaeo"]
        ],
        music_piano: [
            ["เปียโน", "Klavier", "piano"],
            ["กลอง", "Trommel", "klong"],
            ["ขลุ่ย", "Flöte", "khlui"],
            ["ฉิ่ง", "Zimbeln", "ching"]
        ],
        music_strings: [
            ["กีตาร์", "Gitarre", "kita"],
            ["กลอง", "Trommel", "klong"],
            ["ฉิ่ง", "Zimbeln", "ching"],
            ["ระฆัง", "Glocke", "rakhang"]
        ],
        drum_sticks: [
            ["ไม้กลอง", "Trommelstöcke", "mai klong"],
            ["ช้อน", "Löffel", "chon"],
            ["รองเท้า", "Schuhe", "rongthao"],
            ["หมวก", "Hut", "muak"]
        ],
        painting_tool: [
            ["วาดรูป", "Bilder malen", "wat rup"],
            ["ล้างจาน", "Geschirr spülen", "lang chan"],
            ["ตัดผม", "Haare schneiden", "tat phom"],
            ["เปิดประตู", "eine Tür öffnen", "poet pratu"]
        ],
        music_flute: [
            ["ขลุ่ย", "Flöte", "khlui"],
            ["กีตาร์", "Gitarre", "kita"],
            ["กลอง", "Trommel", "klong"],
            ["เปียโน", "Klavier", "piano"]
        ],
        music_struck: [
            ["ฉิ่ง", "Zimbeln", "ching"],
            ["ขลุ่ย", "Flöte", "khlui"],
            ["กีตาร์", "Gitarre", "kita"],
            ["เปียโน", "Klavier", "piano"]
        ],
        hobby_racket: [
            ["ไม้แบดมินตัน", "Badmintonschläger", "mai baetmin ton"],
            ["ช้อน", "Löffel", "chon"],
            ["หมวก", "Hut", "muak"],
            ["หนังสือ", "Buch", "nangsue"]
        ],
        hobby_ball: [
            ["ลูกบอล", "Ball", "luk bon"],
            ["กีตาร์", "Gitarre", "kita"],
            ["แปรง", "Pinsel", "praeng"],
            ["จาน", "Teller", "chan"]
        ],
        flower_soil: [
            ["ดิน", "Erde", "din"],
            ["แก้ว", "Glas", "kaeo"],
            ["รองเท้า", "Schuhe", "rongthao"],
            ["หนังสือ", "Buch", "nangsue"]
        ],
        fishing_rod: [
            ["ตกปลา", "angeln", "tok pla"],
            ["ตัดผม", "Haare schneiden", "tat phom"],
            ["วาดรูป", "Bilder malen", "wat rup"],
            ["ทำอาหาร", "kochen", "tham ahan"]
        ],
        horseback: [
            ["ม้า", "Pferd", "ma"],
            ["ปลา", "Fisch", "pla"],
            ["จักรยาน", "Fahrrad", "chakkrayan"],
            ["รถเมล์", "Bus", "rot me"]
        ],
        swimming_places: [
            ["สระว่ายน้ำ", "Schwimmbad", "sa wai nam"],
            ["ตลาด", "Markt", "talat"],
            ["ห้องครัว", "Küche", "hong khrua"],
            ["สถานีรถไฟ", "Bahnhof", "sathani rotfai"]
        ],
        chess_pieces: [
            ["ตัวหมาก", "Spielfiguren", "tua mak"],
            ["ลูกบอล", "Ball", "luk bon"],
            ["ไพ่", "Spielkarten", "phai"],
            ["ไม้แบดมินตัน", "Badmintonschläger", "mai baetmin ton"]
        ],
        health_care: [
            ["หมอ", "Arzt", "mo"],
            ["ช่างไม้", "Tischler", "chang mai"],
            ["นักร้อง", "Sänger", "nak rong"],
            ["คนขับรถ", "Fahrer", "khon khap rot"]
        ],
        thermometer: [
            ["เทอร์โมมิเตอร์", "Thermometer", "thoe-mo-mi-toe"],
            ["ช้อน", "Löffel", "chon"],
            ["กุญแจ", "Schlüssel", "kunchae"],
            ["แปรง", "Bürste", "praeng"]
        ],
        health_mask: [
            ["หน้ากาก", "Maske", "na kak"],
            ["ถุงเท้า", "Socken", "thung thao"],
            ["แว่นกันแดด", "Sonnenbrille", "waen kan daet"],
            ["หมวก", "Hut", "muak"]
        ],
        jobs_farmer: [
            ["ชาวนา", "Bauer", "chao na"],
            ["หมอ", "Arzt", "mo"],
            ["นักบิน", "Pilot", "nak bin"],
            ["นักร้อง", "Sänger", "nak rong"]
        ],
        jobs_pilot: [
            ["นักบิน", "Pilot", "nak bin"],
            ["คนสวน", "Gärtner", "khon suan"],
            ["ช่างตัดผม", "Friseur", "chang tat phom"],
            ["คนขายของ", "Verkäufer", "khon khai khong"]
        ],
        jobs_firefighter: [
            ["นักดับเพลิง", "Feuerwehrmann", "nak dap phloeng"],
            ["พ่อครัว", "Koch", "pho khrua"],
            ["ครู", "Lehrer", "khru"],
            ["ชาวนา", "Bauer", "chao na"]
        ],
        jobs_mechanic: [
            ["ช่างยนต์", "Mechaniker", "chang yon"],
            ["นักเรียน", "Schüler", "nakrian"],
            ["พยาบาล", "Krankenpfleger", "phayaban"],
            ["นักดนตรี", "Musiker", "nak dontri"]
        ],
        jobs_dentist: [
            ["ทันตแพทย์", "Zahnarzt", "thantaphaet"],
            ["นักบิน", "Pilot", "nak bin"],
            ["พ่อครัว", "Koch", "pho khrua"],
            ["ช่างไม้", "Tischler", "chang mai"]
        ],
        jobs_hair: [
            ["ช่างตัดผม", "Friseur", "chang tat phom"],
            ["คนสวน", "Gärtner", "khon suan"],
            ["นักบิน", "Pilot", "nak bin"],
            ["ชาวนา", "Bauer", "chao na"]
        ],
        jobs_fishing: [
            ["ชาวประมง", "Fischer", "chao pramong"],
            ["ทันตแพทย์", "Zahnarzt", "thantaphaet"],
            ["ครู", "Lehrer", "khru"],
            ["นักบิน", "Pilot", "nak bin"]
        ],
        jobs_singer: [
            ["นักร้อง", "Sänger", "nak rong"],
            ["ช่างยนต์", "Mechaniker", "chang yon"],
            ["ชาวนา", "Bauer", "chao na"],
            ["นักบิน", "Pilot", "nak bin"]
        ],
        home_kitchen: [
            ["ห้องครัว", "Küche", "hong khrua"],
            ["ห้องนอน", "Schlafzimmer", "hong non"],
            ["ห้องน้ำ", "Badezimmer", "hong nam"],
            ["โรงรถ", "Garage", "rong rot"]
        ],
        home_bedroom: [
            ["ห้องนอน", "Schlafzimmer", "hong non"],
            ["ห้องครัว", "Küche", "hong khrua"],
            ["ห้องน้ำ", "Badezimmer", "hong nam"],
            ["ระเบียง", "Balkon", "rabian"]
        ],
        home_dining: [
            ["ห้องอาหาร", "Esszimmer", "hong ahan"],
            ["ห้องน้ำ", "Badezimmer", "hong nam"],
            ["โรงรถ", "Garage", "rong rot"],
            ["ห้องซักผ้า", "Waschküche", "hong sak pha"]
        ],
        home_living: [
            ["ห้องนั่งเล่น", "Wohnzimmer", "hong nang len"],
            ["ห้องครัว", "Küche", "hong khrua"],
            ["ห้องน้ำ", "Badezimmer", "hong nam"],
            ["โรงรถ", "Garage", "rong rot"]
        ],
        home_garage: [
            ["โรงรถ", "Garage", "rong rot"],
            ["ห้องนอน", "Schlafzimmer", "hong non"],
            ["ห้องน้ำ", "Badezimmer", "hong nam"],
            ["ห้องอาหาร", "Esszimmer", "hong ahan"]
        ],
        true_false: [
            ["จริง", "Wahr", "ching"],
            ["ไม่จริง", "Nicht wahr", "mai ching"]
        ],
        yes_no: [
            ["ใช่", "Ja", "chai"],
            ["ไม่ใช่", "Nein", "mai chai"]
        ],
        health_carer: [
            ["ครู", "Lehrer", "khru"],
            ["ช่าง", "Handwerker", "chang"],
            ["หมอ", "Arzt", "mo"],
            ["พ่อครัว", "Koch", "pho khrua"]
        ],
        pharmacy_place: [
            ["ร้านขายยา", "Apotheke", "ran khai ya"],
            ["ร้านหนังสือ", "Buchhandlung", "ran nangsue"],
            ["ร้านเสื้อผ้า", "Bekleidungsgeschäft", "ran suea pha"],
            ["ตลาดสด", "Frischmarkt", "talat sot"]
        ],
        body_cover: [
            ["ปาก", "Mund", "pak"],
            ["ตา", "Auge", "ta"],
            ["หู", "Ohr", "hu"],
            ["เท้า", "Fuß", "thao"]
        ],
        hour_minutes: [
            ["60 นาที", "60 Minuten", "hok sip nathi"],
            ["30 นาที", "30 Minuten", "sam sip nathi"],
            ["100 นาที", "100 Minuten", "nueng roi nathi"],
            ["24 นาที", "24 Minuten", "yi sip si nathi"]
        ],
        umbrella_use: [
            ["ปากกา", "Stift", "pakka"],
            ["เก้าอี้", "Stuhl", "kao-i"],
            ["หนังสือ", "Buch", "nang-sue"],
            ["กันฝน", "Schutz vor Regen", "kan fon"]
        ],
        home_use_food: [
            ["ประตู", "Tür", "pratu"],
            ["มือ", "Hand", "mue"],
            ["ผ้าขนหนู", "Handtuch", "pha khon nu"],
            ["ตู้เสื้อผ้า", "Kleiderschrank", "tu suea pha"],
            ["อาหาร", "Essen", "ahan"]
        ]
    };

    const beginnerQuestionCounts = Object.create(null);

    function makeBeginnerQuestion([
        categoryKey,
        difficulty,
        questionTh,
        questionDe,
        questionRead,
        optionSet,
        correctId,
        type = "single_choice"
    ]) {
        beginnerQuestionCounts[categoryKey] = (beginnerQuestionCounts[categoryKey] || 0) + 1;
        const optionSetValues = beginnerOptionSets[optionSet];
        const options = optionSetValues.map(([th, de, reading], optionIndex) => [
            String.fromCharCode(97 + optionIndex),
            th,
            de,
            reading
        ]);
        const correctOption = optionSetValues[correctId.charCodeAt(0) - 97];
        const source = beginnerSources[categoryKey];

        return makeQuestion(
            `thq-beginner-${categoryKey}-${String(beginnerQuestionCounts[categoryKey]).padStart(3, "0")}`,
            `beginner_${categoryKey}`,
            difficulty,
            type,
            questionTh,
            questionDe,
            questionRead,
            options,
            correctId,
            `คำตอบคือ ${correctOption[0]}`,
            `Die richtige Antwort ist: ${correctOption[1]}.`,
            [source]
        );
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
            "Welche Frucht wird in Thailand als der 'König der Früchte' (King of Fruits) bezeichnet?",
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
            "Die Hummelfledermaus wurde in Kanchanaburi entdeckt, wiegt nur rund 2 Gramm und ist eines der kleinsten Säugetiere der Welt.",
            [{ title: "EDGE of Existence – Kitti's Hog-nosed Bat", url: "https://www.edgeofexistence.org/" }]
        ),
        makeQuestion(
            "thq-sport-008", "sport", 2, "single_choice",
            "กีฬามวยไทยได้รับการขนานนามว่าเป็น 'ศาสตร์แห่งอาวุธทั้ง...' กี่ชนิด?",
            "Muay Thai wird als 'Kunst der ... Waffen' bezeichnet. Wie viele Waffen sind damit gemeint?",
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
            "Welcher thailändische König schaffte die Sklaverei ab und modernisierte Siam mit Eisenbahn, Telegraf und Wasserversorgung?",
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
            "Welches war das erste offizielle, permanente Muay-Thai-Stadion Thailands in Bangkok?",
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
            "Aus welchem Holz werden die traditionellen Langboote (Ruea Yao) bei den herbstlichen Flussregatten hauptsächlich gefertigt?",
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
        ),
        makeQuestion(
            "thq-geo-014", "geography", 2, "single_choice",
            "ตลาดร่มหุบ ซึ่งเป็นตลาดสดที่มีรถไฟวิ่งผ่านผ่ากลางตลาด ตั้งอยู่ในจังหวัดใด?",
            "In welcher Provinz befindet sich der berühmte Maeklong-Eisenbahnmarkt (Talad Rom Hub), bei dem Züge mitten durch die Marktstände fahren?",
            "Talat Rom Hup sueng pen talat sot thi mi rotfai wing phan pha klang talat, tang yu nai changwat dai?",
            [
                ["a", "สมุทรสงคราม", "Samut Songkhram", "Samut Songkhram"],
                ["b", "สมุทรสาคร", "Samut Sakhon", "Samut Sakhon"],
                ["c", "สมุทรปราการ", "Samut Prakan", "Samut Prakan"],
                ["d", "ราชบุรี", "Ratchaburi", "Ratchaburi"]
            ],
            "a",
            "ตลาดร่มหุบตั้งอยู่ที่สถานีรถไฟแม่กลอง จังหวัดสมุทรสงคราม พ่อค้าแม่ค้าจะหุบร่มและเก็บแผงอย่างรวดเร็วทุกครั้งที่รถไฟแล่นผ่าน",
            "Der Maeklong Railway Market liegt am Bahnhof Maeklong in Samut Songkhram. Bei jeder Zugdurchfahrt klappen die Händler blitzschnell ihre Markisen und Stände ein.",
            [{ title: "Tourism Authority of Thailand – Maeklong Railway Market", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-geo-015", "geography", 2, "single_choice",
            "แม่น้ำสายสำคัญที่สุดของไทยคือแม่น้ำเจ้าพระยา ซึ่งเกิดจากการรวมตัวกันของแม่น้ำสายใดที่ปากน้ำโพ จังหวัดนครสวรรค์?",
            "Aus dem Zusammenfluss welcher Flüsse entsteht Thailands Lebensader, der Chao Phraya, bei Pak Nam Pho in Nakhon Sawan?",
            "Maenam sai samkhan thi sut khong Thai khue Maenam Chao Phraya, sueng koet chak kan ruam tua kan khong maenam sai dai thi Pak Nam Pho changwat Nakhon Sawan?",
            [
                ["a", "แม่น้ำปิงและแม่น้ำน่าน", "Ping und Nan", "Maenam Ping lae Maenam Nan"],
                ["b", "แม่น้ำโขงและแม่น้ำมูล", "Mekong und Mun", "Maenam Khong lae Maenam Mun"],
                ["c", "แม่น้ำตาปีและแม่น้ำคีรีรัฐ", "Tapi und Khirirat", "Maenam Tapi lae Maenam Khirirat"],
                ["d", "แม่น้ำป่าสักและแม่น้ำลพบุรี", "Pa Sak und Lopburi", "Maenam Pa Sak lae Maenam Lop Buri"]
            ],
            "a",
            "แม่น้ำเจ้าพระยาเกิดจากแม่น้ำปิง (ซึ่งรวมกับวัง) และแม่น้ำน่าน (ซึ่งรวมกับยม) ไหลมาบรรจบกันที่ตำบลปากน้ำโพ จังหวัดนครสวรรค์",
            "Der Chao Phraya entsteht am Zusammenfluss des Ping (nach Aufnahme des Wang) und des Nan (nach Aufnahme des Yom) in Pak Nam Pho, Nakhon Sawan.",
            [{ title: "Royal Irrigation Department Thailand – Chao Phraya Basin", url: "https://www.rid.go.th/" }]
        ),
        makeQuestion(
            "thq-geo-016", "geography", 2, "single_choice",
            "อุทยานแห่งชาติแห่งแรกของประเทศไทยที่ได้รับการจัดตั้งขึ้นอย่างเป็นทางการในปี พ.ศ. 2505 คืออุทยานแห่งชาติใด?",
            "Welcher Nationalpark wurde 1962 als allererster Nationalpark Thailands offiziell gegründet?",
            "Utthayan haeng chat haeng raek khong prathet Thai thi dairap kan chat tang khuen yang pen thangkan nai pi Pho So 2505 khue utthayan haeng chat dai?",
            [
                ["a", "อุทยานแห่งชาติเขาใหญ่", "Khao Yai Nationalpark", "Utthayan haeng chat Khao Yai"],
                ["b", "อุทยานแห่งชาติดอยอินทนนท์", "Doi Inthanon Nationalpark", "Utthayan haeng chat Doi Inthanon"],
                ["c", "อุทยานแห่งชาติแก่งกระจาน", "Kaeng Krachan Nationalpark", "Utthayan haeng chat Kaeng Krachan"],
                ["d", "อุทยานแห่งชาติเอราวัณ", "Erawan Nationalpark", "Utthayan haeng chat Erawan"]
            ],
            "a",
            "อุทยานแห่งชาติเขาใหญ่ได้รับการจัดตั้งขึ้นเป็นอุทยานแห่งชาติแห่งแรกของไทยในปี พ.ศ. 2505 และเป็นส่วนหนึ่งของผืนป่าดงพญาเย็น-เขาใหญ่ที่ได้ขึ้นทะเบียนมรดกโลก",
            "Der Khao Yai Nationalpark wurde 1962 gegründet und bildet zusammen mit dem Dong-Phayayen-Gebirge ein UNESCO-Weltnaturerbe.",
            [{ title: "Department of National Parks Thailand – Khao Yai", url: "https://www.dnp.go.th/" }]
        ),
        makeQuestion(
            "thq-geo-017", "geography", 3, "single_choice",
            "ยอดเขาภูชี้ฟ้า ซึ่งเป็นจุดชมวิวทะเลหมอกและพระอาทิตย์ขึ้นที่มีชื่อเสียง ตั้งอยู่ตามแนวชายแดนระหว่างไทยกับประเทศใด?",
            "An der Grenze zu welchem Nachbarland liegt der Berg Phu Chi Fa in Chiang Rai, berühmt für sein atemberaubendes Nebelmeer bei Sonnenaufgang?",
            "Yot khao Phu Chi Fa sueng pen chut chom wio thale mok lae phra-athit khuen thi mi chuesiang, tang yu tam naeo chaidaen rawang Thai kap prathet dai?",
            [
                ["a", "ประเทศลาว", "Laos", "Prathet Lao"],
                ["b", "ประเทศพม่า", "Myanmar", "Prathet Phama"],
                ["c", "ประเทศกัมพูชา", "Kambodscha", "Prathet Kampuchia"],
                ["d", "ประเทศมาเลเซีย", "Malaysia", "Prathet Malesia"]
            ],
            "a",
            "ภูชี้ฟ้าตั้งอยู่ในจังหวัดเชียงราย บนเทือกเขาดอยผาหม่น ซึ่งเป็นพรมแดนธรรมชาติระหว่างประเทศไทยและสาธารณรัฐประชาธิปไตยประชาชนลาว",
            "Phu Chi Fa liegt im Doi-Pha-Mon-Gebirge in der Provinz Chiang Rai direkt an der Landesgrenze zwischen Thailand und Laos.",
            [{ title: "Tourism Authority of Thailand – Phu Chi Fa", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-geo-018", "geography", 3, "single_choice",
            "หมู่เกาะสิมิลัน ซึ่งมีชื่อเสียงระดับโลกในฐานะสวรรค์ของนักดำน้ำ ตั้งอยู่ในทะเลอันดามันของจังหวัดใด?",
            "In welcher Provinz liegt der weltberühmte Similan-Archipel in der Andamanensee, der als eines der schönsten Tauchgebiete der Erde gilt?",
            "Mu ko Similan sueng mi chuesiang radap lok nai thana sawan khong nak damnam, tang yu nai thale Andaman khong changwat dai?",
            [
                ["a", "พังงา", "Phang Nga", "Phangnga"],
                ["b", "ภูเก็ต", "Phuket", "Phuket"],
                ["c", "กระบี่", "Krabi", "Krabi"],
                ["d", "ระนอง", "Ranong", "Ranong"]
            ],
            "a",
            "อุทยานแห่งชาติหมู่เกาะสิมิลันอยู่ในจังหวัดพังงา คำว่า 'สิมิลัน' มาจากภาษายาวีแปลว่า 'เก้า' สื่อถึงเก้าเกาะดั้งเดิม",
            "Der Mu Ko Similan Nationalpark liegt in Phang Nga. Das Wort 'Similan' stammt aus dem Yawi (Malaiisch) und bedeutet 'neun', nach den ursprünglichen neun Inseln.",
            [{ title: "Department of National Parks Thailand – Mu Ko Similan", url: "https://www.dnp.go.th/" }]
        ),
        makeQuestion(
            "thq-his-014", "history", 2, "single_choice",
            "หลังจากกรุงศรีอยุธยาเสียแก่พม่าในปี พ.ศ. 2310 พระมหากษัตริย์พระองค์ใดทรงกอบกู้เอกราชและสถาปนากรุงธนบุรีเป็นราชธานี?",
            "Welcher König befreite Siam nach dem Fall Ayutthayas 1767 von der birmanischen Besatzung und gründete Thonburi als neue Hauptstadt?",
            "Langchak Krung Si Ayutthaya sia kae Phama nai pi Pho So 2310, phra mahakasat phra-ong dai song kopku ekkarat lae sathapana Krung Thonburi pen ratchathani?",
            [
                ["a", "สมเด็จพระเจ้าตากสินมหาราช", "König Taksin der Große", "Somdet Phra Chao Taksin Maharat"],
                ["b", "พระบาทสมเด็จพระพุทธยอดฟ้าจุฬาโลกมหาราช (รัชกาลที่ 1)", "König Rama I.", "Phra Bat Somdet Phra Phuttha Yot Fa Chulalok Maharat"],
                ["c", "สมเด็จพระนเรศวรมหาราช", "König Naresuan der Große", "Somdet Phra Naresuan Maharat"],
                ["d", "สมเด็จพระนารายณ์มหาราช", "König Narai der Große", "Somdet Phra Narai Maharat"]
            ],
            "a",
            "สมเด็จพระเจ้าตากสินมหาราชทรงรวบรวมกำลังพลกอบกู้เอกราชคืนได้ภายในเวลาเพียง 7 เดือน และทรงสถาปนากรุงธนบุรีเป็นเมืองหลวงใหม่",
            "König Taksin der Große sammelte Truppen, befreite Siam innerhalb von nur sieben Monaten von den Besatzern und machte Thonburi zur neuen Hauptstadt.",
            [{ title: "National Museum Bangkok – Thonburi Period", url: "https://www.finearts.go.th/" }]
        ),
        makeQuestion(
            "thq-his-015", "history", 3, "single_choice",
            "วัฒนธรรมบ้านเชียงในจังหวัดอุดรธานี ซึ่งได้รับการยกย่องเป็นมรดกโลก มีความโดดเด่นทางประวัติศาสตร์โบราณคดีในยุคใด?",
            "Für welche prähistorische Epoche ist die Fundstätte Ban Chiang in Udon Thani weltberühmt, da dort früheste Metallurgie nachgewiesen wurde?",
            "Watthanatham Ban Chiang nai changwat Udon Thani sueng dairap kan yokyong pen moradok lok, mi khwam dotden thang prawattisat borannakhadi nai yuk dai?",
            [
                ["a", "ยุคสำริดและยุคเหล็กก่อนประวัติศาสตร์", "Prähistorische Bronze- und Eisenzeit", "Yuk samrit lae yuk lek kon prawattisat"],
                ["b", "ยุคหินเก่าตอนต้น", "Frühes Paläolithikum (Altsteinzeit)", "Yuk hin kao ton ton"],
                ["c", "ยุคกลางของยุโรป", "Europäisches Mittelalter", "Yuk klang khong Yurop"],
                ["d", "ยุคทวารวดีตอนปลาย", "Späte Dvaravati-Periode", "Yuk Thawarawadi ton plai"]
            ],
            "a",
            "บ้านเชียงเป็นหลักฐานสำคัญของการพัฒนาทางวัฒนธรรมและโลหกรรมยุคสำริดและยุคเหล็กในเอเชียตะวันออกเฉียงใต้ มีชื่อเสียงจากหม้อดินเผาลายเขียนสีแดง",
            "Ban Chiang belegt frühe Bronzeguss- und Eisenverarbeitung in Südostasien sowie Ackerbau und ist berühmt für charakteristische rot bemalte Keramik.",
            [{ title: "UNESCO – Ban Chiang Archaeological Site", url: "https://whc.unesco.org/en/list/575/" }]
        ),
        makeQuestion(
            "thq-his-016", "history", 2, "single_choice",
            "พระบาทสมเด็จพระจุลจอมเกล้าเจ้าอยู่หัว (รัชกาลที่ 5) ทรงได้รับการถวายพระราชสมัญญาว่า 'พระปิยมหาราช' จากพระราชกรณียกิจสำคัญยิ่งด้านใดในปี พ.ศ. 2448?",
            "Welche historische Reform von König Chulalongkorn (Rama V.), die 1905 vollendet wurde, brachte ihm den Ehrentitel 'Phra Piya Maharaj' (Geliebter Großer König) ein?",
            "Phra Bat Somdet Phra Chulachomklao Chao Yu Hua (Ratchakan thi 5) song dairap kan thawai phraratchasammanya wa 'Phra Piya Maharat' chak phraratchakoraniyakit samkhan ying dan dai nai pi Pho So 2448?",
            [
                ["a", "การเลิกทาสและการเลิกไพร่โดยสันติวิธี", "Die friedliche und schrittweise Abschaffung der Sklaverei", "Kan loek that lae kan loek phrai doi santiwithi"],
                ["b", "การสร้างกำแพงพระนครแห่งใหม่", "Der Bau neuer Festungsmauern", "Kan sang kamphaeng phranakhon haeng mai"],
                ["c", "การย้ายเมืองหลวงไปยังเชียงใหม่", "Die Verlegung der Hauptstadt nach Chiang Mai", "Kan yai mueang luang pai yang Chiang Mai"],
                ["d", "การประกาศสงครามกับฝรั่งเศส", "Die Kriegserklärung an Frankreich", "Kan prakat songkhram kap Farangset"]
            ],
            "a",
            "รัชกาลที่ 5 ทรงออกพระราชบัญญัติเลิกทาส ร.ศ. 124 (พ.ศ. 2448) ทำให้ลูกทาสและทาสทุกคนเป็นไทโดยไม่มีการนองเลือด ถือเป็นก้าวย่างสำคัญสู่ความทันสมัย",
            "König Chulalongkorn schaffte die Sklaverei und Leibeigenschaft in Siam schrittweise und ohne Blutvergießen ab, sodass alle Siamesen freie Bürger wurden.",
            [{ title: "National Archives of Thailand – King Rama V Abolition of Slavery", url: "https://www.nat.go.th/" }]
        ),
        makeQuestion(
            "thq-his-017", "history", 3, "single_choice",
            "สะพานข้ามแม่น้ำแควในจังหวัดกาญจนบุรี สร้างขึ้นโดยแรงงานเชลยศึกฝ่ายสัมพันธมิตรและกรรมกรชาวเอเชียในสงครามใด?",
            "Während welches Krieges bauten alliierte Kriegsgefangene und asiatische Zwangsarbeiter unter der japanischen Armee die berühmte Brücke am Kwai in Kanchanaburi?",
            "Saphan kham Maenam Khwae nai changwat Kanchanaburi, sang khuen doi raengngan chaloeisuek fai samphanthamit lae kammakon chao Echia nai songkhram dai?",
            [
                ["a", "สงครามโลกครั้งที่ 2", "Zweiter Weltkrieg", "Songkhram Lok khrang thi 2"],
                ["b", "สงครามโลกครั้งที่ 1", "Erster Weltkrieg", "Songkhram Lok khrang thi 1"],
                ["c", "สงครามเวียดนาม", "Vietnamkrieg", "Songkhram Wiatnam"],
                ["d", "สงครามเกาหลี", "Koreakrieg", "Songkhram Kaoli"]
            ],
            "a",
            "กองทัพญี่ปุ่นได้เกณฑ์เชลยศึกสัมพันธมิตรและกรรมกรเอเชียสร้างทางรถไฟสายมรณะและสะพานข้ามแม่น้ำแควในปี พ.ศ. 2485-2486 ระหว่างสงครามโลกครั้งที่สอง",
            "Die Brücke über den Kwai war Teil der 'Thailand-Burma-Eisenbahn' (Todeseisenbahn), die das japanische Militär im Zweiten Weltkrieg unter extremen Opfern errichten ließ.",
            [{ title: "Commonwealth War Graves Commission – Kanchanaburi", url: "https://www.cwgc.org/" }]
        ),
        makeQuestion(
            "thq-his-018", "history", 3, "single_choice",
            "ศิลาจารึกหลักที่ 1 ระบุว่า พระมหากษัตริย์พระองค์ใดแห่งอาณาจักรสุโขทัยทรงประดิษฐ์อักษรไทยขึ้นในปี พ.ศ. 1826?",
            "Welcher König des Reiches Sukhothai schuf laut Inschrift 1 im Jahr 1283 die thailändische Schrift (Lai Sue Thai)?",
            "Silacharuek lak thi nueng rabu wa phra mahakasat phra-ong dai haeng anachak Sukhothai song pradit akson Thai khuen nai pi Pho So 1826?",
            [
                ["a", "พ่อขุนรามคำแหงมหาราช", "König Ramkhamhaeng der Große", "Pho Khun Ramkhamhaeng Maharat"],
                ["b", "พ่อขุนศรีอินทราทิตย์", "König Sri Indraditya", "Pho Khun Si Inthrathit"],
                ["c", "พระมหาธรรมราชาที่ 1 (ลิไทย)", "König Li Thai", "Phra Maha Thammaracha thi 1 (Li Thai)"],
                ["d", "พ่อขุนผาเมือง", "Pho Khun Pha Mueang", "Pho Khun Pha Mueang"]
            ],
            "a",
            "พ่อขุนรามคำแหงมหาราชทรงประดิษฐ์ 'ลายสือไทย' ขึ้นในปี พ.ศ. 1826 โดยดัดแปลงจากอักษรขอมและมอญโบราณ กลายมาเป็นต้นแบบของอักษรไทยในปัจจุบัน",
            "König Ramkhamhaeng erfand 1283 das 'Lai Sue Thai', abgeleitet von alten Mon- und Khmer-Schriften, welches das Fundament der heutigen Thai-Schrift bildet.",
            [{ title: "UNESCO – The King Ram Khamhaeng Inscription", url: "https://en.unesco.org/memoryoftheworld/registry/2003/inscription" }]
        ),
        makeQuestion(
            "thq-cul-014", "culture", 2, "single_choice",
            "ประเพณีผีตาโขน ซึ่งผู้เข้าร่วมจะสวมหน้ากากทำจากหวดนึ่งข้าวเหนียวและโคนก้านมะพร้าว เป็นประเพณีเอกลักษณ์ของอำเภอด่านซ้าย ในจังหวัดใด?",
            "In welcher Provinz findet das berühmte Geistermaskenfest 'Phi Ta Khon' im Bezirk Dan Sai statt, bei dem farbenprächtige Masken aus gedämpften Reiskörben getragen werden?",
            "Prapheni Phi Ta Khon sueng phu khao ruam cha suam nakak tham chak huat nueng khao niao lae khon kan maphrao, pen prapheni ekkalak khong amphoe Dan Sai nai changwat dai?",
            [
                ["a", "เลย", "Loei", "Loei"],
                ["b", "เชียงใหม่", "Chiang Mai", "Chiang Mai"],
                ["c", "น่าน", "Nan", "Nan"],
                ["d", "นครพนม", "Nakhon Phanom", "Nakhon Phanom"]
            ],
            "a",
            "ประเพณีผีตาโขนเป็นส่วนหนึ่งของงานบุญหลวงที่อำเภอด่านซ้าย จังหวัดเลย หน้ากากอันโดดเด่นทำจากหวดนึ่งข้าวเหนียวเย็บต่อกับโคนก้านมะพร้าวและระบายสีสันสดใส",
            "Das Phi Ta Khon Fest ist Teil des traditionellen Bun Luang im Bezirk Dan Sai, Provinz Loei. Die kunstvollen Masken symbolisieren Geister, die Prinz Vessantara begleiten.",
            [{ title: "Tourism Authority of Thailand – Phi Ta Khon Festival", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-cul-015", "culture", 2, "single_choice",
            "ในพิธีไหว้ครูของไทย ดอกไม้ชนิดใดนิยมนำมาจัดพานเพื่อเป็นสัญลักษณ์แทน 'ความเฉียบแหลมและปัญญาไว'?",
            "Welche Blume wird bei der traditionellen thailändischen Lehrerehrung (Wai Kru) als Symbol für geistige Schärfe und scharfsinnigen Verstand überreicht?",
            "Nai phithi wai khru khong Thai, dokmai chanit dai niyom nam ma chat phan phuea pen sanyalak thaen 'khwam chiaplaem lae panya wai'?",
            [
                ["a", "ดอกเข็ม", "Dok Khem (Ixora / Nadelblüte)", "Dok Khem"],
                ["b", "ดอกมะลิ", "Dok Mali (Jasmin)", "Dok Mali"],
                ["c", "ดอกบัว", "Dok Bua (Lotus)", "Dok Bua"],
                ["d", "ดอกดาวเรือง", "Dok Dao Rueang (Tagetes)", "Dok Dao Rueang"]
            ],
            "a",
            "ดอกเข็มมีปลายแหลมเหมือนเข็ม จึงใช้เป็นสัญลักษณ์แทนสติปัญญาที่เฉียบแหลม โดยพานไหว้ครูยังมีดอกมะเขือ (ความอ่อนน้อม) หญ้าแพรก (ความอดทน) และข้าวตอก (วินัย)",
            "Die nadelspitze Ixora-Blüte ('Dok Khem') symbolisiert Scharfsinn. Zusammen mit Auberginenblüte (Demut), Wiesen-Bermudagras (Geduld) und Puffreis bildet sie die Gabe.",
            [{ title: "Ministry of Culture Thailand – Wai Kru Tradition", url: "https://www.m-culture.go.th/" }]
        ),
        makeQuestion(
            "thq-cul-016", "culture", 3, "single_choice",
            "'หนังตะลุง' ศิลปะการแสดงหุ่นเงาพื้นบ้านยอดนิยมของภาคใต้ ทำมาจากวัสดุชนิดใด?",
            "Aus welchem Naturmaterial werden die kunstvoll verzierten Figuren des traditionellen südthailändischen Schattentheaters 'Nang Talung' gefertigt?",
            "'Nang Talung' sinlapa kan sadaeng hun ngao phuenban yotniyom khong phak tai, tham ma chak watsadu chanit dai?",
            [
                ["a", "แผ่นหนังวัวหรือหนังควายฉลุลาย", "Gegerbtes und ausgestanztes Rinds- oder Büffelleder", "Phaen nang wua rue nang khwai chalu lai"],
                ["b", "ไม้สักแกะสลัก", "Geschnitztes Teakholz", "Mai sak kaesalak"],
                ["c", "กระดาษสาชุบน้ำมัน", "Geöltes Maulbeerbaumpapier (Sa-Papier)", "Kradat sa chup namman"],
                ["d", "ผ้าไหมปักเลื่อม", "Bestickte Seide", "Pha mai pak lueam"]
            ],
            "a",
            "ตัวหนังตะลุงทำจากหนังวัวหรือหนังควายที่ฟอกจนแห้งโปร่งแสง แล้วนำมาฉลุลวดลายตัวละครอย่างละเอียดอ่อน นิยมเชิดอยู่หลังจอผ้าขาวสะท้อนแสงไฟ",
            "Nang-Talung-Puppen werden aus sorgfältig getrocknetem Rinds- oder Wasserbüffelleder gestanzt, bemalt und an Stöcken hinter einem beleuchteten weißen Schirm bewegt.",
            [{ title: "Department of Cultural Promotion Thailand – Shadow Puppetry", url: "https://www.culture.go.th/" }]
        ),
        makeQuestion(
            "thq-cul-017", "culture", 3, "single_choice",
            "การแสดง 'โขน' ซึ่งเป็นศิลปะการแสดงชั้นสูงของไทยและได้รับการขึ้นทะเบียนมรดกทางวัฒนธรรมที่จับต้องไม่ได้จากยูเนสโก มีเนื้อเรื่องหลักมาจากวรรณคดีเรื่องใด?",
            "Aus welchem thailändischen Nationalepos stammen die Geschichten des klassischen königlichen Maskentanzdramas 'Khon' (UNESCO-Kulturerbe)?",
            "Kan sadaeng 'Khon' sueng pen sinlapa kan sadaeng chan sung khong Thai lae dairap kan khuen thabian moradok thang watthanatham thi chap tong mai dai chak UNESCO, mi nuea rueang lak ma chak wannakhadi rueang dai?",
            [
                ["a", "รามเกียรติ์", "Ramakien (thailändische Ramayana-Adaption)", "Ramakian"],
                ["b", "ขุนช้างขุนแผน", "Khun Chang Khun Phaen", "Khun Chang Khun Phaen"],
                ["c", "อิเหนา", "Inao", "Inao"],
                ["d", "พระอภัยมณี", "Phra Aphai Mani", "Phra Aphai Mani"]
            ],
            "a",
            "โขนใช้เรื่อง 'รามเกียรติ์' ในการแสดง โดยตัวละครที่เป็นยักษ์และลิงจะสวม 'หัวโขน' ส่วนพระและนางจะแต่งกายงดงามและเคลื่อนไหวตามบทพากย์และบทเจรจา",
            "Das Khon-Drama erzählt Episoden des Ramakien. Dämonen (Yak) und Affenkrieger tragen reich verzierte Ganzkopfmasken, begleitet von traditioneller Piphat-Musik.",
            [{ title: "UNESCO Intangible Cultural Heritage – Khon masked dance drama", url: "https://ich.unesco.org/en/RL/khon-masked-dance-drama-in-thailand-01385" }]
        ),
        makeQuestion(
            "thq-cul-018", "culture", 2, "single_choice",
            "เทคนิคการทอผ้าไหมไทยโบราณที่มัดย้อมเส้นไหมก่อนนำไปทอให้เกิดลวดลายสวยงามอ่อนช้อย มีชื่อเรียกว่าอะไร?",
            "Wie heißt die traditionelle thailändische Webtechnik, bei der Seidenstränge vor dem Weben nach Mustern abgebunden und gefärbt werden (Ikat-Verfahren)?",
            "Theknik kan tho pha mai Thai boran thi mat yom sen mai kon nam pai tho hai koet luat lai suai ngam on choi, mi chue riak wa arai?",
            [
                ["a", "ผ้ามัดหมี่", "Pha Matmi (Mudmee / Ikat-Seide)", "Pha Matmi"],
                ["b", "ผ้าบาติก", "Batik", "Pha Batik"],
                ["c", "ผ้าลูกไม้", "Spitze", "Pha Lukmai"],
                ["d", "ผ้ายีนส์", "Jeansstoff / Denim", "Pha Yin"]
            ],
            "a",
            "ผ้ามัดหมี่เป็นภูมิปัญญาการทอผ้าพื้นบ้าน โดยมัดเส้นไหมเป็นเปลาะๆ ตามลายที่กำหนดแล้วย้อมสีก่อนทอ นิยมมากในภาคอีสาน เช่น จังหวัดขอนแก่นและสุรินทร์",
            "Matmi (Mudmee) ist das thailändische Ikat-Verfahren, bei dem Kett- oder Schussfäden vor dem Webstuhl mustergenau reserviert gefärbt werden. Zentrum ist der Nordosten (Isan).",
            [{ title: "The SUPPORT Foundation of Queen Sirikit – Thai Silk", url: "https://www.support.or.th/" }]
        ),
        makeQuestion(
            "thq-foo-014", "food", 1, "single_choice",
            "วัตถุดิบหลักที่เป็นหัวใจของอาหารอีสานยอดนิยมอย่าง 'ส้มตำไทย' คือผลไม้อะไรที่นำมาสับเป็นเส้น?",
            "Welche Frucht wird im unreifen, grünen Zustand in feine Streifen geraspelt und bildet die Hauptzutat des beliebten 'Som Tum' (Papayasalat)?",
            "Watthudip lak thi pen huachai khong ahan Isan yotniyom yang 'Som Tam Thai' khue phonlamai arai thi nam ma sap pen sen?",
            [
                ["a", "มะละกอดิบ", "Grüne unreife Papaya", "Malako dip"],
                ["b", "มะม่วงสุก", "Reife Mango", "Mamuang suk"],
                ["c", "สับปะรด", "Ananas", "Sappharot"],
                ["d", "แตงโม", "Wassermelone", "Taengmo"]
            ],
            "a",
            "ส้มตำไทยใช้เส้นมะละกอดิบที่กรอบ คลุกเคล้ากับกระเทียม พริก ถั่วลิสงคั่ว ถั่วฝักยาว มะเขือเทศ กุ้งแห้ง ปรุงรสด้วยน้ำปลา มะนาว และน้ำตาลปี๊บในครก",
            "Som Tum Thai basiert auf knackig gestifteter grüner Papaya, die im Mörser mit Chili, Knoblauch, Limettensaft, Palmzucker, Tomaten und Erdnüssen gestampft wird.",
            [{ title: "Michelin Guide Thailand – The Art of Som Tum", url: "https://guide.michelin.com/th/en" }]
        ),
        makeQuestion(
            "thq-foo-015", "food", 2, "single_choice",
            "อาหารพื้นเมืองขึ้นชื่อของภาคเหนือที่มีบะหมี่ไข่ในน้ำแกงกะหรี่กะทิเข้มข้น โรยหน้าด้วยหมี่กรอบ มะนาว และผักกาดดอง คือเมนูใด?",
            "Welches nordthailändische Kultgericht besteht aus Eiernudeln in milder Kokos-Currysuppe, getoppt mit knusprig frittierten Nudeln und serviert mit eingelegtem Senfkohl?",
            "Ahan phuenmueang khuen chue khong phak nuea thi mi bami khai nai nam kaeng kari kathi khemkhon, roi na duai mi krop, manao lae phak kat dong khue menu dai?",
            [
                ["a", "ข้าวซอย", "Khao Soi", "Khao Soi"],
                ["b", "ขนมจีนน้ำเงี้ยว", "Khanom Jeen Nam Ngiao", "Khanom Chin Nam Ngiao"],
                ["c", "แกงฮังเล", "Kaeng Hang Le", "Kaeng Hang Le"],
                ["d", "ไส้อั่ว", "Sai Ua (Nordthailändische Kräuterwurst)", "Sai Ua"]
            ],
            "a",
            "ข้าวซอยเป็นอาหารเอกลักษณ์ของเชียงใหม่และภาคเหนือ เสิร์ฟพร้อมไก่หรือเนื้อในน้ำแกงหอมเครื่องเทศกะทิ และรับประทานคู่กับหอมแดง ผักกาดดอง และมะนาว",
            "Khao Soi ist die berühmte nordthailändische Currynudelsuppe. Die Kombination aus weichen Eiernudeln, cremiger Brühe und krossen Nudelfäden ist legendär.",
            [{ title: "Tourism Authority of Thailand – Northern Culinary Heritage Khao Soi", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-foo-016", "food", 1, "single_choice",
            "ใบสมุนไพรที่มีกลิ่นหอมเผ็ดร้อนอันเป็นหัวใจสำคัญของเมนูตามสั่งยอดฮิต 'ผัดกะเพรา' คือใบอะไร?",
            "Welches Kraut verleiht dem thailändischen National-Streetfood 'Pad Kra Pao' seinen unverwechselbaren pfeffrig-würzigen Geschmack?",
            "Bai samunphrai thi mi klin hom phet ron an pen huachai samkhan khong menu tam sang yothit 'Phat Kaphrao' khue bai arai?",
            [
                ["a", "ใบกะเพรา (Holy Basil)", "Indisches / Heiliges Basilikum (Kaphrao)", "Bai Kaphrao"],
                ["b", "ใบโหระพา (Thai Sweet Basil)", "Süßes Thai-Basilikum (Horapha)", "Bai Horapha"],
                ["c", "ใบสะระแหน่ (Pfefferminze)", "Minze (Saranae)", "Bai Saranae"],
                ["d", "ใบมะกรูด (Kaffirlimettenblätter)", "Kaffirlimettenblätter (Makrut)", "Bai Makrut"]
            ],
            "a",
            "ผัดกะเพราแท้ต้องใช้ 'ใบกะเพรา' ซึ่งมีรสเผ็ดซ่าและกลิ่นหอมเฉพาะตัว ต่างจากใบโหระพาที่นิยมใส่ในแกงเขียวหวานหรือใบแมงลัก",
            "Echtes Pad Kaphrao verlangt zwingend heiliges Basilikum (Ocimum tenuiflorum / Kra Pao), das im Gegensatz zum süßen Horapha eine pikante Schärfe hat.",
            [{ title: "Department of Agriculture Thailand – Holy Basil Culinary Traits", url: "https://www.doa.go.th/" }]
        ),
        makeQuestion(
            "thq-foo-017", "food", 2, "single_choice",
            "แกงสมุนไพรโบราณ 'ต้มข่าไก่' มีเครื่องปรุงสมุนไพรหลักชนิดใดที่ให้กลิ่นหอมสดชื่นอันเป็นที่มาของชื่อเมนูนี้?",
            "Welche aromatische Wurzelknolle ist neben Kokosmilch und Hühnerfleisch der namensgebende Hauptbestandteil der Suppe 'Tom Kha Gai'?",
            "Kaeng samunphrai boran 'Tom Kha Kai' mi khrueangprung samunphrai lak chanit dai thi hai klin hom sotchuen an pen thima khong chue menu ni?",
            [
                ["a", "ข่า", "Galgant (Kha)", "Kha"],
                ["b", "ขิง", "Ingwer (Khing)", "Khing"],
                ["c", "กระชาย", "Fingerwurz (Krachai)", "Krachai"],
                ["d", "ขมิ้น", "Kurkuma (Khamin)", "Khamin"]
            ],
            "a",
            "'ข่า' เป็นสมุนไพรที่มีกลิ่นหอมละมุนและเผ็ดอุ่น เมื่อต้มกับกะทิ ตะไคร้ ใบมะกรูด และเนื้อไก่ จะทำให้น้ำซุปมีรสกลมกล่อมเปรี้ยวเค็มมันพอดี",
            "'Kha' steht für Galgantwurzel. In Scheiben geschnitten sorgt sie zusammen mit Kokosmilch, Zitronengras und Limettenblättern für die cremige, zitronig-würzige Note.",
            [{ title: "Royal Society of Thailand – Thai Food Glossary", url: "https://www.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-foo-018", "food", 1, "single_choice",
            "ขนมหวานยอดนิยมระดับโลก 'ข้าวเหนียวมะม่วง' นิยมเลือกใช้มะม่วงสุกพันธุ์ใดที่มีเนื้อเนียนหวานฉ่ำและกลิ่นหอม?",
            "Welche thailändische Mangosorte wird wegen ihres faserfreien, saftig-süßen Fruchtfleischs am liebsten für 'Khao Niao Mamuang' (Mango Sticky Rice) gewählt?",
            "Khanom wan yotniyom radap lok 'Khao Niao Mamuang' niyom lueak chai mamuang suk phan dai thi mi nuea nian wan cham lae klin hom?",
            [
                ["a", "มะม่วงน้ำดอกไม้", "Nam Dok Mai (Blütenwasser-Mango)", "Mamuang Nam Dok Mai"],
                ["b", "มะม่วงเขียวเสวย", "Khiao Sawoei", "Mamuang Khiao Sawoei"],
                ["c", "มะม่วงแรด", "Mamuang Raet", "Mamuang Raet"],
                ["d", "มะม่วงฟ้าลั่น", "Mamuang Fa Lan", "Mamuang Fa Lan"]
            ],
            "a",
            "มะม่วงน้ำดอกไม้สุกมีรสหวานละมุน เนื้อนุ่มเนียนไม่มีเสี้ยน กลิ่นหอมชื่นใจ เมื่อทานคู่กับข้าวเหนียวมูนกะทิรสเค็มมันและราดน้ำกะทิสดถือเป็นความลงตัวที่สุด",
            "Die Sorte 'Nam Dok Mai' gilt als Königin unter den Desserts-Mangos: goldgelb, samtig weich, faserfrei und wunderbar süß in Harmonie mit gesalzenem Kokos-Klebreis.",
            [{ title: "Tourism Authority of Thailand – Thai Mango Sticky Rice", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-nat-014", "nature", 2, "single_choice",
            "สัตว์เลี้ยงลูกด้วยนมในป่าดงดิบของไทยชนิดใด ที่ไม่มีหางและมีแขนยาวคล่องแคล่วในการโหนต้นไม้ พร้อมส่งเสียงร้องก้องกังวานยามเช้า?",
            "Welcher schwanzlose Primat schwingt mit langen Armen meisterhaft durch die Kronen thailändischer Urwälder und verzaubert den Dschungel mit morgendlichen Rufen?",
            "Sat liang luk duai nom nai pa dongdip khong Thai chanit dai, thi mai mi hang lae mi khaen yao khlongkhlaeo nai kan hon tonmai phrom song siang rong kong kangwan yam chao?",
            [
                ["a", "ชะนีมือขาว", "Weißhandgibbon (Lar-Gibbon)", "Chani mue khao"],
                ["b", "ลิงแสม", "Javaneraffe (Krabbenfressender Makak)", "Ling samae"],
                ["c", "ค่างแว่นถิ่นใต้", "Dunkler Brillenlangur", "Khang waen thin tai"],
                ["d", "นางอาย (ลิงลม)", "Plumplori", "Nang-ai (Ling lom)"]
            ],
            "a",
            "ชะนีมือขาวเป็นสัตว์ในกลุ่มเอป (ไม่มีหาง) อาศัยอยู่บนเรือนยอดไม้สูง มีความสำคัญในการช่วยกระจายเมล็ดพันธุ์ไม้ป่าและมีเสียงร้องประสานคู่ที่เป็นเอกลักษณ์",
            "Weißhandgibbons (Hylobates lar) besitzen keinen Schwanz und bewegen sich durch Hangeln (Brachiation) fort. Ihre melodiösen Duette hallen kilometerweit durch den Urwald.",
            [{ title: "Department of National Parks Thailand – White-handed Gibbon", url: "https://www.dnp.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-015", "nature", 2, "single_choice",
            "ปลาที่มีขนาดใหญ่ที่สุดในโลก ซึ่งมักพบแหวกว่ายหากินแพลงก์ตอนในน่านน้ำไทย เช่น บริเวณกองหินริเชลิวและเกาะเต่า คือปลาชนิดใด?",
            "Welcher sanfte Riese gilt als der größte Fisch der Erde und wird von Tauchern vor allem am Richelieu Rock und um Koh Tao beobachtet?",
            "Pla thi mi khanat yai thi sut nai lok sueng mak phop waek wai hakin phlaengkhton nai nannam Thai chen boriwen konghin Richelieu lae Ko Tao khue pla chanit dai?",
            [
                ["a", "ฉลามวาฬ", "Walhai (Rhincodon typus)", "Chalam wan"],
                ["b", "กระเบนราหู (แมนตา)", "Manta-Rochen", "Kraben rahu (Manta)"],
                ["c", "ปลาวาฬสีน้ำเงิน", "Blauwal (Meeressäuger)", "Pla wan si namngoen"],
                ["d", "ปลาช่อนอเมซอน", "Arapaima", "Pla chon Amezon"]
            ],
            "a",
            "ฉลามวาฬเป็นปลากระดูกอ่อนขนาดใหญ่ที่สุดในโลก สามารถยาวได้กว่า 12 เมตร กินแพลงก์ตอนและสัตว์น้ำขนาดเล็กเป็นอาหาร และเป็นสัตว์ป่าสงวนของไทย",
            "Der Walhai ist mit bis zu 12 Metern Länge der größte lebende Fisch. Als friedlicher Filtrierer ernährt er sich von Plankton und steht in Thailand unter strengem Schutz.",
            [{ title: "Department of Marine and Coastal Resources Thailand – Whale Shark Conservation", url: "https://www.dmcr.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-016", "nature", 2, "single_choice",
            "ระบบนิเวศป่าไม้บริเวณชายฝั่งทะเลน้ำกร่อยที่มีรากค้ำยันแข็งแรง ช่วยป้องกันการกัดเซาะชายฝั่งและเป็นแหล่งอนุบาลสัตว์น้ำ เรียกว่าอะไร?",
            "Wie heißen die küstenschützenden Gezeitenwälder mit charakteristischen Stelzenwurzeln im Brackwasserbereich, die als Kinderstube für Fische und Krebse dienen?",
            "Rapop niwet pamai boriwen chaifang thale namkroi thi mi rak khamyan khaengkraeng, chuai pongkan kan katso chaifang lae pen laeng anuban sat nam riak wa arai?",
            [
                ["a", "ป่าชายเลน", "Mangrovenwald (Pa Chai Len)", "Pa Chai Len"],
                ["b", "ป่าเต็งรัง", "Trockener Laubmischwald (Dipterocarp-Wald)", "Pa Teng Rang"],
                ["c", "ป่าเบญจพรรณ", "Mischwald (Pa Benjaphan)", "Pa Benjaphan"],
                ["d", "ป่าสนเขา", "Kiefern-Bergwald", "Pa Son Khao"]
            ],
            "a",
            "ป่าชายเลนมีต้นโกงกางที่มีระบบรากค้ำจุนพิเศษ สามารถเติบโตในดินเลนน้ำกร่อย เป็นแนวกันคลื่นลมพายุ และเป็นแหล่งเพาะพันธุ์ปู ปลา และนกน้ำ",
            "Mangrovenwälder (Pa Chai Len) schützen Thailands Küsten vor Erosion und Tsunamis. Ihre dichten Wurzelsysteme bieten Lebensraum für Schlammspringer und Garnelen.",
            [{ title: "Department of Marine and Coastal Resources Thailand – Mangrove Forest", url: "https://www.dmcr.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-017", "nature", 1, "single_choice",
            "สัตว์ประจำชาติของประเทศไทย ซึ่งมีบทบาทสำคัญในประวัติศาสตร์และวัฒนธรรมไทยมาอย่างยาวนาน คือสัตว์ชนิดใด?",
            "Welches Tier ist das offizielle Nationaltier Thailands und genießt seit Jahrhunderten höchste historische und kulturelle Verehrung?",
            "Sat pracham chat khong prathet Thai, sueng mi botbat samkhan nai prawattisat lae watthanatham Thai ma yang yaonan khue sat chanit dai?",
            [
                ["a", "ช้างไทย", "Thailändischer Elefant (Asiatischer Elefant)", "Chang Thai"],
                ["b", "เสือโคร่ง", "Indochinesischer Tiger", "Suea khrong"],
                ["c", "กระทิง", "Gaur (Wildrind)", "Krathing"],
                ["d", "ควายไทย", "Wasserbüffel", "Khwai Thai"]
            ],
            "a",
            "ช้างไทยได้รับการประกาศเป็นสัตว์ประจำชาติอย่างเป็นทางการ โดยเฉพาะ 'ช้างเผือก' ซึ่งเป็นสัญลักษณ์มงคลคู่พระบารมีของพระมหากษัตริย์ไทย",
            "Der Elefant (Chang Thai) ist das Nationaltier Thailands. Früher schmückte ein weißer Elefant sogar die Nationalflagge Siams; er gilt als Symbol für Würde und Kraft.",
            [{ title: "Royal Society of Thailand – National Animal", url: "https://www.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-018", "nature", 3, "single_choice",
            "สัตว์เลี้ยงลูกด้วยนมที่มีขนาดเล็กที่สุดในโลก ซึ่งถูกค้นพบในถ้ำหินปูนริมแม่น้ำแควน้อย จังหวัดกาญจนบุรี คือสัตว์ชนิดใด?",
            "Welches winzige Wesen, das in Kalksteinhöhlen am Khwae-Noi-Fluss in Kanchanaburi entdeckt wurde, gilt als das kleinste Säugetier der Welt nach Körpergröße?",
            "Sat liang luk duai nom thi mi khanat lek thi sut nai lok, sueng thuk khonphop nai tham hinpun rim Maenam Khwae Noi changwat Kanchanaburi khue sat chanit dai?",
            [
                ["a", "ค้างคาวคุณกิตติ", "Kitti-Schweinsnasenfledermaus / Hummelfledermaus", "Khangkhao Khun Kitti"],
                ["b", "หนูผีจิ๋ว", "Etruskerspitzmaus", "Nu phi chio"],
                ["c", "กระรอกบินจิ๋ว", "Zwerggleithörnchen", "Krarok bin chio"],
                ["d", "บ่างชวา", "Gleitflieger (Kaguan)", "Bang Chawa"]
            ],
            "a",
            "ค้างคาวคุณกิตติมีความยาวลำตัวเพียงประมาณ 3 เซนติเมตร และมีน้ำหนักตัวเพียง 2 กรัม ค้นพบครั้งแรกโดยคุณกิตติ ทองลองยา ในปี พ.ศ. 2516",
            "Die Kitti-Schweinsnasenfledermaus wiegt kaum 2 Gramm bei einer Körperlänge von 3 cm. Sie lebt endemisch in den Karsthöhlen von Kanchanaburi und Teilen Myanmars.",
            [{ title: "Department of National Parks Thailand – Kitti's Hog-nosed Bat", url: "https://www.dnp.go.th/" }]
        ),
        makeQuestion(
            "thq-sport-014", "sport", 2, "single_choice",
            "พิธีกรรมร่ายรำอันศักดิ์สิทธิ์ที่นักมวยไทยทุกคนต้องปฏิบัติบนเวทีก่อนเริ่มการชก เพื่อแสดงความกตัญญูต่อบิดามารดาและครูบาอาจารย์ เรียกว่าอะไร?",
            "Wie heißt das rituelle Zeremoniell und der traditionelle Tanz, den jeder Muay-Thai-Kämpfer vor dem Gong zur Ehrung von Meistern und Eltern im Ring vollzieht?",
            "Phithikam rai ram an saksit thi nak muai Thai thuk khon tong patibat bon wethi kon roem kan chok phuea sadaeng khwam katanyu to bida manda lae khru ba achan riak wa arai?",
            [
                ["a", "การไหว้ครูรำมวย", "Wai Kru Ram Muay", "Kan wai khru ram muai"],
                ["b", "การลงนวม", "Sparring / Handschuhtraining", "Kan long nuam"],
                ["c", "การเต้นฟุตเวิร์ก", "Footwork / Beinarbeit", "Kan ten futwoek"],
                ["d", "การชั่งน้ำหนัก", "Offizielles Wiegen", "Kan chang namnak"]
            ],
            "a",
            "การไหว้ครูรำมวยเป็นการทำจิตใจให้สงบ มีสมาธิ พร้อมทั้งอบอุ่นร่างกาย ยืดกล้ามเนื้อ และสำรวจพื้นเวทีก่อนขึ้นชกอย่างมีสติตามประเพณีโบราณ",
            "Wai Kru Ram Muay verbindet Ehrerbietung mit mentaler Fokussierung, spirituellem Schutz und Dehnübungen zum Prüfen der Ringseile und Beschaffenheit des Ringbodens.",
            [{ title: "World Muaythai Council – Wai Kru Rituals", url: "https://www.wmcmuaythai.org/" }]
        ),
        makeQuestion(
            "thq-sport-015", "sport", 2, "single_choice",
            "มงคลสวมศีรษะที่ครูมวยสวมให้นักมวยไทยก่อนก้าวขึ้นสู่สังเวียนและถอดออกก่อนเริ่มยกแรก มีความหมายสำคัญอย่างไร?",
            "Welche Bedeutung hat der 'Mongkhon' (มงคล), der geflochtene Stirnkranz, den der Meister dem Boxer vor dem Betreten des Rings aufsetzt?",
            "Mongkhon suam sisa thi khru muai suam hai nak muai Thai kon kao khuen su sangwian lae thot ok kon roem yok raek mi khwammai samkhan yangrai?",
            [
                ["a", "เป็นเครื่องรางของขลังเพื่อคุ้มครองและเป็นสิริมงคล", "Geweihtes Schutzamulett für Segen und Unversehrtheit", "Pen khrueangrang khongkhlang phuea khumkhrong lae pen sirimongkhon"],
                ["b", "เพื่อซับเหงื่อที่หน้าผาก", "Ein einfaches Schweißband", "Phuea sap nguea thi naphak"],
                ["c", "เพื่อป้องกันการกระทบกระเทือนที่ศีรษะ", "Ein stoßdämpfender Kopfschutz", "Phuea pongkan kan krathop krathuean thi sisa"],
                ["d", "เพื่อระบุสังกัดค่ายมวยเท่านั้น", "Ein reines Erkennungsband des Boxstalls", "Phuea rabu sangkat khai muai thaonan"]
            ],
            "a",
            "มงคลถือเป็นวัตถุมงคลสูงสุดที่ผ่านพิธีประสิทธิ์ประสาทพรจากครูบาอาจารย์ นักมวยต้องกราบขอพรและให้ครูเป็นผู้ถอดออกจากศีรษะก่อนเริ่มการชก",
            "Der Mongkhon ist ein heiliger, geweihter Gegenstand. Nur der Trainer darf ihn nach Gebet und Rezitation im Ring vom Kopf des Athleten abnehmen.",
            [{ title: "Sports Authority of Thailand – Muay Thai Traditions", url: "https://www.sat.or.th/" }]
        ),
        makeQuestion(
            "thq-sport-016", "sport", 3, "single_choice",
            "ศิลปะการต่อสู้ป้องกันตัวแบบดั้งเดิมของไทยที่ใช้อาวุธโบราณ เช่น ดาบเดี่ยว ดาบสองมือ หอก และพลอง ฝึกซ้อมและประลอง เรียกว่าอะไร?",
            "Wie heißt die traditionelle thailändische Kampfkunst mit Blankwaffen wie Schwertern, Stöcken, Lanzen und Schild, die siamesischen Kriegern als Nahkampfausbildung diente?",
            "Sinlapa kan tosu pongkan tua baep dangdoem khong Thai thi chai awut boran chen dap diao, dap song mue, hok lae phlong fuekson lae pralong riak wa arai?",
            [
                ["a", "กระบี่กระบอง", "Krabi Krabong", "Krabi Krabong"],
                ["b", "เทควันโด", "Taekwondo", "Thekhwando"],
                ["c", "ฟันดาบสากล", "Olympisches Fechten", "Fan dap sakon"],
                ["d", "ยูโด", "Judo", "Yudo"]
            ],
            "a",
            "กระบี่กระบองเป็นศาสตร์การต่อสู้อาวุธสั้นและยาวในระยะประชิดของนักรบไทยในอดีต มักแสดงคู่กับการบรรเลงดนตรีปี่พาทย์เพื่อกำหนดจังหวะรุกรับ",
            "Krabi Krabong (wörtlich: Degen und Stock) umfasst Kampftechniken mit Doppelschwertern, Lanzen und Schilden und bildete die historische Waffenausbildung Siams.",
            [{ title: "Department of Physical Education Thailand – Krabi Krabong Heritage", url: "https://www.dpe.go.th/" }]
        ),
        makeQuestion(
            "thq-sport-017", "sport", 3, "single_choice",
            "การแข่งขันเรือใบระดับนานาชาติที่ใหญ่และมีชื่อเสียงที่สุดในทวีปเอเชีย ซึ่งจัดขึ้นเป็นประจำทุกปีที่เกาะภูเก็ต มีชื่อว่าอะไร?",
            "Welche traditionsreiche internationale Segelregatta vor der Küste Phukets gilt als die größte und prestigeträchtigste Yacht-Regatta in ganz Asien?",
            "Kan khaengkhan ruea bai radap nanachat thi yai lae mi chuesiang thi sut nai thawip Echia sueng chat khuen pen pracham thuk pi thi Ko Phuket mi chue wa arai?",
            [
                ["a", "ภูเก็ตคิงส์คัพรีกัตตา", "Phuket King's Cup Regatta", "Phuket King's Cup Regatta"],
                ["b", "อะเมริกาส์คัพ", "America's Cup", "Americas Cup"],
                ["c", "บางกอกโบ๊ตเรซ", "Bangkok Boat Race", "Bangkok Boat Race"],
                ["d", "อันดามันแคนูคัพ", "Andaman Canoe Cup", "Andaman Canoe Cup"]
            ],
            "a",
            "ภูเก็ตคิงส์คัพรีกัตตาก่อตั้งขึ้นในปี พ.ศ. 2530 เพื่อเฉลิมพระเกียรติในหลวงรัชกาลที่ 9 ในวโรกาสเฉลิมพระชนมพรรษาครบ 5 รอบ โดยมีเรือใบจากทั่วโลกเข้าร่วมชิงชัย",
            "Die Phuket King's Cup Regatta wurde 1987 zu Ehren des 60. Geburtstages von König Bhumibol ins Leben gerufen und zieht alljährlich Segler aus der ganzen Welt an.",
            [{ title: "Phuket King's Cup Regatta Official", url: "https://www.kingscup.com/" }]
        ),
        makeQuestion(
            "thq-sport-018", "sport", 2, "single_choice",
            "นักกีฬาไทยคนแรกในประวัติศาสตร์ที่สามารถคว้าเหรียญทองในการแข่งขันกีฬาโอลิมปิกเกมส์ คือใคร และจากกีฬาชนิดใด?",
            "Wer war der allererste thailändische Sportler, der bei Olympischen Spielen eine Goldmedaille gewann (Atlanta 1996), und in welcher Sportart?",
            "Nak kila Thai khon raek nai prawattisat thi samat khwa rianthong nai kan khaengkhan kila Olimpik Kem khue khrai lae chak kila chanit dai?",
            [
                ["a", "สมรักษ์ คำสิงห์ (กีฬามวยสากลสมัครเล่น)", "Somluck Kamsing (Boxen)", "Somrak Khamsing (Kila muai sakon samaklen)"],
                ["b", "มนัส บุญจำนงค์ (กีฬามวยสากล)", "Manus Boonjumnong (Boxen)", "Manat Bunchamnong"],
                ["c", "ปวีณา ทองสุก (กีฬายกน้ำหนัก)", "Pawina Thongsuk (Gewichtheben)", "Pawina Thongsuk"],
                ["d", "พาณิภัค วงศ์พัฒนกิจ (กีฬาเทควันโด)", "Panipak Wongpattanakit (Taekwondo)", "Phaniphak Wongphattanakit"]
            ],
            "a",
            "สมรักษ์ คำสิงห์ คว้าเหรียญทองแรกในประวัติศาสตร์ให้แก่ประเทศไทยในกีฬาชกมวยสากลสมัครเล่น รุ่นเฟเธอร์เวต ในโอลิมปิกปี ค.ศ. 1996 ณ เมืองแอตแลนตา สหรัฐอเมริกา",
            "Somluck Kamsing schrieb Sportgeschichte, als er bei den Olympischen Sommerspielen 1996 in Atlanta im Federgewichtsboxen die erste olympische Goldmedaille für Thailand holte.",
            [{ title: "Olympic Committee of Thailand – Historic Gold Medals", url: "https://www.olympicthai.org/" }]
        ),
        makeQuestion(
            "thq-rel-013", "religion", 1, "single_choice",
            "วัดสำคัญคู่บ้านคู่เมืองที่ประดิษฐานพระพุทธมหามณีรัตนปฏิมากร (พระแก้วมรกต) ภายในพระบรมมหาราชวัง คือวัดใด?",
            "Welcher heiligste Tempel Thailands liegt auf dem Areal des Großen Palastes in Bangkok und beherbergt den verehrten Smaragd-Buddha?",
            "Wat samkhan khu ban khu mueang thi praditsathan Phra Phutthamahamani Rattanapatimakon (Phra Kaeo Morakot) phainai Phra Borom Maha Ratchawang khue wat dai?",
            [
                ["a", "วัดพระศรีรัตนศาสดาราม (วัดพระแก้ว)", "Wat Phra Si Rattana Satsadaram (Wat Phra Kaew)", "Wat Phra Si Rattana Satsadaram (Wat Phra Kaeo)"],
                ["b", "วัดโพธิ์ (วัดพระเชตุพน)", "Wat Pho (Tempel des liegenden Buddha)", "Wat Pho"],
                ["c", "วัดสุทัศนเทพวราราม", "Wat Suthat", "Wat Suthat Thepwararam"],
                ["d", "วัดสระเกศ (ภูเขาทอง)", "Wat Saket (Golden Mount)", "Wat Saket"]
            ],
            "a",
            "วัดพระแก้วสร้างขึ้นพร้อมกับการสถาปนากรุงรัตนโกสินทร์ในปี พ.ศ. 2325 เป็นวัดประจำพระบรมมหาราชวังที่ไม่มีพระสงฆ์จำพรรษาอยู่ภายในวัด",
            "Wat Phra Kaew wurde 1782 bei der Gründung Bangkoks errichtet. Als königlicher Tempel auf dem Palastgelände besitzt er keine Wohnquartiere für Mönche.",
            [{ title: "Bureau of the Royal Household – Temple of the Emerald Buddha", url: "https://www.royaloffice.th/" }]
        ),
        makeQuestion(
            "thq-rel-014", "religion", 1, "single_choice",
            "วัดอรุณราชวราราม มีจุดเด่นคือพระปรางค์ริมแม่น้ำเจ้าพระยาที่ประดับตกแต่งด้วยวัสดุชนิดใดจนเปล่งประกายงดงามยามต้องแสง?",
            "Womit sind die kunstvoll geschmückten Fassaden des berühmten Prang am Ufer des Chao Phraya im Wat Arun (Tempel der Morgenröte) verkleidet?",
            "Wat Arun Ratchawararam mi chutden khue phra prang rim Maenam Chao Phraya thi pradap toktaeng duai watsadu chanit dai chon pleng prakaai ngotngam yam tong saeng?",
            [
                ["a", "กระเบื้องเคลือบและเศษเครื่องถ้วยชามเบญจรงค์ลายคราม", "Glasiertes Porzellan und bemalte Keramikscherben", "Krabueang khlueap lae chet khrueang thuai cham bencharong lai khram"],
                ["b", "ทองคำเปลวบริสุทธิ์ทั้งองค์", "Reines Blattgold von oben bis unten", "Thongkham pleo borisut thang ong"],
                ["c", "ไม้สักแกะสลักสีทอง", "Vergoldetes geschnitztes Teakholz", "Mai sak kaesalak si thong"],
                ["d", "หินแกรนิตสีดำสนิท", "Schwarzer Granit", "Hin kraenit si dam sanit"]
            ],
            "a",
            "พระปรางค์วัดอรุณประดับด้วยชิ้นกระเบื้องเคลือบสีและเศษถ้วยชามจีนโบราณที่นำเข้ามาทางเรือสำเภาในสมัยรัตนโกสินทร์ตอนต้น สะท้อนแสงระยิบระยับงดงาม",
            "Der Prang von Wat Arun ist mit Hunderttausenden von bunten Porzellanscherben und chinesischen Keramikfliesen besetzt, die als Ballast auf Handelsschiffen dienten.",
            [{ title: "Tourism Authority of Thailand – Wat Arun", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-rel-015", "religion", 2, "single_choice",
            "การที่พระภิกษุสงฆ์เดินรับอาหารจากชาวบ้านในยามเช้าตรู่ด้วยความสงบสำรวม เรียกว่ากิจวัตรใด?",
            "Wie bezeichnet man den morgendlichen Almosengang buddhistischer Mönche in aller Frühe, bei dem Gläubige Speisen in die Almosenschale geben?",
            "Kan thi phra phiksusong doen rap ahan chak chaoban nai yam chao tru duai khwam sangop samruam riak wa kitwat dai?",
            [
                ["a", "การบิณฑบาต", "Bindabat (Almosengang)", "Kan binthabat"],
                ["b", "การเวียนเทียน", "Wian Tian (Kerzenprozession)", "Kan wian thian"],
                ["c", "การนั่งสมาธิ", "Meditation (Samadhi)", "Kan nang samathi"],
                ["d", "การเทศนา", "Predigt (Thesana)", "Kan thetsana"]
            ],
            "a",
            "การออกบิณฑบาตเป็นพุทธบัญญัติเพื่อให้พระสงฆ์ได้โปรดสัตว์และเปิดโอกาสให้พุทธศาสนิกชนได้ทำบุญตักบาตร สละความตระหนี่ และเริ่มต้นวันด้วยจิตใจที่ผ่องใส",
            "Bindabat (Pali: Pindapata) ist der morgendliche Gang der Mönche. Laien praktizieren dabei 'Tam Bun' (Gutes tun) durch das Spenden von frischer Nahrung.",
            [{ title: "Office of National Buddhism Thailand – Monastic Disciplines", url: "https://www.onab.go.th/" }]
        ),
        makeQuestion(
            "thq-rel-016", "religion", 2, "single_choice",
            "วันสำคัญทางพุทธศาสนาที่พระสงฆ์ต้องอยู่จำพรรษา ณ วัดใดวัดหนึ่งตลอดระยะเวลา 3 เดือนในฤดูฝน เรียกว่าวันอะไร?",
            "Welcher Feiertag leitet die dreimonatige buddhistische Regenzeitklausur (Rains Retreat) ein, während der Mönche in ihrem Heimatkloster bleiben?",
            "Wan samkhan thang phutthasatsana thi phra song tong yu cham phansa na wat dai wat nueng talot raya wela sam duean nai ruedu fon riak wa wan arai?",
            [
                ["a", "วันเข้าพรรษา", "Wan Khao Phansa (Beginn der Fasten- und Regenzeit)", "Wan Khao Phansa"],
                ["b", "วันออกพรรษา", "Wan Ok Phansa (Ende der Regenzeit)", "Wan Ok Phansa"],
                ["c", "วันมาฆบูชา", "Wan Makha Bucha", "Wan Makha Bucha"],
                ["d", "วันสารทไทย", "Wan Sat Thai", "Wan Sat Thai"]
            ],
            "a",
            "วันเข้าพรรษาตรงกับวันแรม 1 ค่ำ เดือน 8 กำหนดขึ้นตั้งแต่สมัยพุทธกาลเพื่อป้องกันไม่ให้พระสงฆ์เหยียบย่ำพืชผลและต้นกล้าของชาวบ้านที่เพาะปลูกในฤดูฝน",
            "Khao Phansa beginnt am Tag nach Vollmond im 8. Mondmonat. Buddha verfügte die Klausur, damit wandernde Mönche nicht die zarten Reissetzlinge auf den Feldern zertraten.",
            [{ title: "Office of National Buddhism Thailand – Khao Phansa Day", url: "https://www.onab.go.th/" }]
        ),
        makeQuestion(
            "thq-rel-017", "religion", 2, "single_choice",
            "ต้นไม้ศักดิ์สิทธิ์ที่มักปลูกอยู่ในบริเวณวัดไทย เพื่อรำลึกถึงสถานที่ที่พระสัมมาสัมพุทธเจ้าทรงตรัสรู้ คือต้นไม้ชนิดใด?",
            "Welcher heilige Baum wird auf vielen Tempelanlagen Thailands verehrt, da der historische Buddha unter ihm die vollkommene Erleuchtung erlangte?",
            "Tonmai saksit thi mak pluk yu nai boriwen wat Thai phuea ramluek thueng sathanthi thi phra samma samphutthachao song tratsaru khue tonmai chanit dai?",
            [
                ["a", "ต้นพระศรีมหาโพธิ์ (ต้นโพธิ์)", "Bodhi-Baum / Pipal-Pappel-Feige (Ton Pho)", "Ton Phra Si Maha Pho (Ton Pho)"],
                ["b", "ต้นไทร", "Banyan-Feigenbaum (Ton Sai)", "Ton Sai"],
                ["c", "ต้นสัก", "Teakbaum (Ton Sak)", "Ton Sak"],
                ["d", "ต้นกล้วยไม้", "Orchideenbaum", "Ton Kluaimai"]
            ],
            "a",
            "ต้นโพธิ์ (Ficus religiosa) เป็นสัญลักษณ์แห่งการตรัสรู้ธรรม ใบโพธิ์มีปลายเรียวแหลมเป็นเอกลักษณ์ วัดไทยมักปลูกและดูแลรักษาต้นโพธิ์ไว้อย่างเคารพสักการะ",
            "Der Bodhi-Baum (Ficus religiosa) symbolisiert Erleuchtung und Erwachen. Seine herzförmigen Blätter mit langer Spitze sind in der buddhistischen Ikonografie allgegenwärtig.",
            [{ title: "Royal Society of Thailand – Sacred Trees in Buddhism", url: "https://www.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-lan-013", "language_daily", 2, "single_choice",
            "คำว่า 'เกรงใจ' (Kreng Jai) ในวัฒนธรรมไทย สะท้อนถึงมารยาทและการอยู่ร่วมกันในสังคมในความหมายใด?",
            "Welche grundlegende thailändische Verhaltensnorm und Höflichkeit drückt der Begriff 'Kreng Jai' (เกรงใจ) im täglichen Miteinander aus?",
            "Kham wa 'krengchai' nai watthanatham Thai sathon thueng marayat lae kan yu ruam kan nai sangkhom nai khwammai dai?",
            [
                ["a", "ความเกรงกลัวและระมัดระวังที่จะไม่ทำให้ผู้อื่นเดือดร้อน รำคาญ หรือเสียน้ำใจ", "Feinfühligkeit, Rücksichtnahme und Scheu davor, anderen Umstände zu bereiten", "Khwam krengklua lae ramatrawang thi cha mai tham hai phu uen dueatron, ramkhan rue sia namchai"],
                ["b", "ความไม่สนใจในความรู้สึกของผู้อื่น", "Gleichgültigkeit gegenüber den Gefühlen anderer", "Khwam mai sonchai nai khwamsuek khong phu uen"],
                ["c", "การสั่งการอย่างเข้มงวด", "Strenge Befehlsausgabe", "Kan sang kan yang khemnguat"],
                ["d", "ความหยิ่งทะนงในศักดิ์ศรี", "Stolze Überheblichkeit", "Khwam yingthanong nai saksri"]
            ],
            "a",
            "'เกรงใจ' คือความรู้สึกเคารพและถนอมน้ำใจผู้อื่น ไม่อยากรบกวนหรือสร้างภาระให้ใคร เป็นหนึ่งในค่านิยมสูงสุดที่ทำให้สังคมไทยอยู่ร่วมกันอย่างสันติ",
            "'Kreng Jai' beschreibt die feinfühlige Rücksichtnahme, anderen keine Unannehmlichkeiten, Verlegenheit oder Mühe zu verursachen – eine zentrale Tugend thailändischer Etikette.",
            [{ title: "Ministry of Culture Thailand – Thai Values and Etiquette", url: "https://www.m-culture.go.th/" }]
        ),
        makeQuestion(
            "thq-lan-014", "language_daily", 1, "single_choice",
            "ประโยคคำถามทักทายยอดนิยมในชีวิตประจำวันของคนไทยอย่าง 'กินข้าวหรือยัง?' ใช้เพื่อจุดประสงค์หลักใด?",
            "Mit welchem Hintergedanken fragen Thailänder im Alltag häufig 'Kin Khao Rue Yang?' (กินข้าวหรือยัง? – Hast du schon gegessen?)?",
            "Prayok khamtham thakthai yotniyom nai chiwit pracham wan khong khon Thai yang 'Kin khao rue yang?' chai phuea chutprasong lak dai?",
            [
                ["a", "เป็นการทักทายแสดงความห่วงใย ถามสารทุกข์สุกดิบ คล้าย 'เป็นอย่างไรบ้าง?'", "Als herzliche Begrüßung und Ausdruck fürsorglicher Anteilnahme", "Pen kan thakthai sadaeng khwam huangyai, tham sarathuk-sukdip khlai 'pen yangrai bang?'"],
                ["b", "เพื่อตรวจสอบบัญชีค่าอาหาร", "Zur Überprüfung der Restaurantrechnung", "Phuea truat sop banchi kha ahan"],
                ["c", "เพื่อตักเตือนเรื่องมารยาทบนโต๊ะอาหาร", "Als Mahnung zu Tischmanieren", "Phuea taktuean rueang marayat bon to ahan"],
                ["d", "เพื่อบังคับให้ผู้อื่นทำอาหารให้", "Um jemanden zum Kochen aufzufordern", "Phuea bangkhap hai phu uen tham ahan hai"]
            ],
            "a",
            "คำว่า 'กินข้าวหรือยัง' แสดงถึงความอบอุ่นและห่วงใยในวิถีชีวิตคนไทย โดยอาหารคือสิ่งสำคัญในการดูแลกัน หากยังไม่ทานก็มักจะชวนมาร่วมรับประทานด้วยกัน",
            "'Kin Khao Rue Yang?' ist im thailändischen Alltag ein herzlicher Gruß wie 'Wie geht es dir?'. Essen steht für Fürsorge und Gemeinschaft; oft folgt eine Einladung zum Mitessen.",
            [{ title: "Tourism Authority of Thailand – Everyday Thai Greetings", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-lan-015", "language_daily", 1, "single_choice",
            "คำสแลงและสำนวนติดปากคนไทยว่า 'สบายๆ' (Sabai Sabai) สื่อถึงทัศนคติและการดำเนินชีวิตแบบใด?",
            "Welche Lebensphilosophie und Geisteshaltung verkörpert der weltberühmte thailändische Ausdruck 'Sabai Sabai' (สบายๆ)?",
            "Kham slaeng lae samnuan tit pak khon Thai wa 'sabai sabai' sue thueng thatsanakhati lae kan damnoen chiwit baep dai?",
            [
                ["a", "ความผ่อนคลาย สบายใจ ไม่เครียด และดำเนินชีวิตอย่างราบรื่น", "Gelassenheit, Entspannung und stressfreies Wohlbefinden", "Khwam phonkhlai, sabai chai, mai khriat lae damnoen chiwit yang rapruen"],
                ["b", "ความเร่งรีบและตึงเครียดตลอดเวลา", "Permanente Hetze und Anspannung", "Khwam rengrip lae tuengkriat talot wela"],
                ["c", "ความโศกเศร้าเสียใจ", "Tiefe Trauer und Niedergeschlagenheit", "Khwam soksao sia chai"],
                ["d", "ความเข้มงวดและเจ้าระเบียบ", "Strenge Pedanterie", "Khwam khemnguat lae chao rabiap"]
            ],
            "a",
            "'สบายๆ' หมายถึงบรรยากาศหรืออารมณ์ที่ไร้ความกดดัน ผ่อนคลายทั้งกายและใจ เป็นคำที่สะท้อนเสน่ห์แห่งความยิ้มแย้มและมองโลกในแง่ดีของคนไทย",
            "'Sabai Sabai' ist die thailändische Kunst der Entspanntheit: unaufgeregt, behaglich und im Einklang mit dem Moment, ohne sich von Hektik aus der Ruhe bringen zu lassen.",
            [{ title: "Tourism Authority of Thailand – The Thai Concept of Sabai", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-lan-016", "language_daily", 1, "single_choice",
            "การแสดงความเคารพ ทักทาย และขอบคุณตามประเพณีไทยด้วยการพนมมือทั้งสองข้างเข้าด้วยกันที่ระดับอกหรือใบหน้า เรียกว่าอะไร?",
            "Wie heißt die traditionelle thailändische Begrüßungs- und Respektsgeste mit aneinandergelegten Handflächen und leichter Verbeugung?",
            "Kan sadaeng khwam khaorop, thakthai lae khopkhun tam prapheni Thai duai kan phanom mue thang song khang khao duai kan thi radap ok rue bai na riak wa arai?",
            [
                ["a", "การไหว้", "Wai (การไหว้)", "Kan wai"],
                ["b", "การจับมือ", "Händeschütteln", "Kan chap mue"],
                ["c", "การโอบกอด", "Umarmung", "Kan op kot"],
                ["d", "การโบกมือ", "Winken", "Kan bok mue"]
            ],
            "a",
            "การไหว้เป็นวัฒนธรรมการทักทายที่งดงามของไทย มีหลายระดับความสูงของมือตามสถานะและอาวุโส เช่น ไหว้พระสงฆ์ ไหว้บิดามารดาผู้มีพระคุณ หรือไหว้บุคคลทั่วไป",
            "Der 'Wai' ist die fundamentale thailändische Höflichkeitsgeste. Je nach sozialer Beziehung und Alter reicht die Daumenposition von der Brust über die Nase bis zur Stirn.",
            [{ title: "Ministry of Culture Thailand – The Etiquette of Wai", url: "https://www.m-culture.go.th/" }]
        ),
        makeQuestion(
            "thq-lan-017", "language_daily", 1, "single_choice",
            "เมื่อรับประทานอาหารไทยแล้วรู้สึกถูกปากและประทับใจในรสชาติ คำชมภาษาไทยที่นิยมพูดกับแม่ครัวหรือเจ้าของร้านคือคำใด?",
            "Mit welchem unverzichtbaren thailändischen Lob drückt man Köchen oder Gastgebern seine Begeisterung über ein köstliches Essen aus?",
            "Muea rapประทาน ahan Thai laeo rusuek thuk pak lae prathapjai nai rotchat, kham chom phasa Thai thi niyom phut kap maekhrua rue chaokhong ran khue kham dai?",
            [
                ["a", "อร่อยมาก!", "Aroi Mak! (Sehr lecker / köstlich!)", "Aroi mak!"],
                ["b", "เผ็ดเกินไป!", "Zu scharf!", "Phet koen pai!"],
                ["c", "เค็มจัง!", "So salzig!", "Khem chang!"],
                ["d", "ไม่อร่อยเลย!", "Gar nicht lecker!", "Mai aroi loei!"]
            ],
            "a",
            "'อร่อยมาก' (Aroi Mak) ประกอบด้วยคำว่า 'อร่อย' (schmackhaft) และ 'มาก' (sehr) เป็นคำชมที่สร้างรอยยิ้มและความภาคภูมิใจให้แก่ผู้ปรุงอาหารเสมอ",
            "'Aroi Mak' (sehr lecker) zaubert jedem thailändischen Koch ein strahlendes Lächeln ins Gesicht und ist der herzlichste Dank nach einem guten Mahl.",
            [{ title: "Tourism Authority of Thailand – Basic Thai for Food Lovers", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-lan-018", "language_daily", 3, "single_choice",
            "เมื่อเราตื่นนอนในตอนเช้า สิ่งแรกที่เรามักทำในห้องน้ำคืออะไร?",
            "Wenn wir morgens aufwachen, was machen wir meistens zuerst im Badezimmer?",
            "Muea rao tuen non nai ton chao, sing raek thi rao mak tham nai hong nam khue arai?",
            [
                ["a", "แปรงฟัน", "Zähne putzen", "Praeng fan"],
                ["b", "ทำอาหาร", "Kochen", "Tham ahan"],
                ["c", "ขับรถ", "Auto fahren", "Khap rot"],
                ["d", "ซื้อของ", "Einkaufen", "Sue khong"]
            ],
            "a",
            "เมื่อตื่นนอนในตอนเช้า คนส่วนใหญ่มักเข้าห้องน้ำเพื่อล้างหน้าและแปรงฟันให้สะอาดสดชื่น",
            "Nach dem Aufwachen geht man morgens meist ins Bad, um sich das Gesicht zu waschen und die Zähne zu putzen.",
            [{ title: "Department of Health Thailand – Oral Hygiene", url: "https://anamai.moph.go.th/" }]
        ),
        makeQuestion(
            "thq-lan-019", "language_daily", 3, "single_choice",
            "ถ้าฝนตกหนักและเราต้องเดินออกไปข้างนอก เราควรพกอะไรไปด้วย?",
            "Wenn es stark regnet und wir nach draußen gehen müssen, was sollten wir mitnehmen?",
            "Tha fon tok nak lae rao tong doen ok pai khang nok, rao khuan phok arai pai duai?",
            [
                ["a", "แว่นกันแดด", "Sonnenbrille", "Waen kan daet"],
                ["b", "ร่ม", "Regenschirm", "Rom"],
                ["c", "พัดลม", "Ventilator", "Phat lom"],
                ["d", "ช้อนส้อม", "Besteck", "Chon som"]
            ],
            "b",
            "เวลามีฝนตก เราควรพกร่มหรือเสื้อกันฝนเพื่อไม่ให้ร่างกายเปียกน้ำและเป็นหวัด",
            "Bei Regen nimmt man einen Regenschirm oder eine Regenjacke mit, um trocken zu bleiben und sich nicht zu erkälten.",
            [{ title: "Thai Meteorological Department", url: "https://www.tmd.go.th/" }]
        ),
        makeQuestion(
            "thq-lan-020", "language_daily", 3, "single_choice",
            "เมื่อต้องการส่งจดหมายหรือพัสดุ เราต้องไปที่ไหน?",
            "Wohin müssen wir gehen, wenn wir einen Brief oder ein Paket verschicken wollen?",
            "Muea tongkan song chotmai rue phatsadu, rao tong pai thi nai?",
            [
                ["a", "ที่ทำการไปรษณีย์", "Postamt", "Thiทำการ praisani"],
                ["b", "โรงภาพยนตร์", "Kino", "Rong phapphayon"],
                ["c", "สวนสัตว์", "Zoo", "Suan sat"],
                ["d", "ร้านตัดผม", "Friseursalon", "Ran tat phom"]
            ],
            "a",
            "ที่ทำการไปรษณีย์เป็นสถานที่ให้บริการรับฝากและจัดส่งจดหมายและพัสดุ",
            "Das Postamt ist die Anlaufstelle für die Annahme und den Versand von Briefen und Paketen.",
            [{ title: "Thailand Post", url: "https://www.thailandpost.co.th/" }]
        ),
        makeQuestion(
            "thq-lan-021", "language_daily", 3, "single_choice",
            "เวลาเราอ่านหนังสือไม่ออกเพราะมืดเกินไป เราควรทำอย่างไร?",
            "Was sollten wir tun, wenn wir ein Buch nicht lesen können, weil es zu dunkel ist?",
            "Wela rao an nangsue mai ok phro muet koen pai, rao khuan tham yangrai?",
            [
                ["a", "ปิดไฟ", "Licht ausschalten", "Pit fai"],
                ["b", "เปิดไฟ", "Licht einschalten", "Poet fai"],
                ["c", "ปิดประตู", "Tür schließen", "Pit pratu"],
                ["d", "ล้างมือ", "Hände waschen", "Lang mue"]
            ],
            "b",
            "เมื่อบริเวณนั้นมืดเกินไป การเปิดไฟช่วยเพิ่มแสงสว่างทำให้มองเห็นตัวหนังสือได้ชัดเจน",
            "Wenn es zu dunkel ist, schaltet man das Licht ein, um genug Helligkeit zum Lesen zu haben.",
            [{ title: "Department of Health Thailand", url: "https://anamai.moph.go.th/" }]
        ),
        makeQuestion(
            "thq-lan-022", "language_daily", 3, "single_choice",
            "สิ่งของใดใช้สำหรับดูเวลาในชีวิตประจำวัน?",
            "Welcher Gegenstand wird im Alltag verwendet, um die Zeit abzulesen?",
            "Singkhong dai chai samrap du wela nai chiwit pracham wan?",
            [
                ["a", "นาฬิกา", "Uhr", "Nalika"],
                ["b", "กระจก", "Spiegel", "Krachok"],
                ["c", "ปฏิทิน", "Kalender", "Patithin"],
                ["d", "ตู้เย็น", "Kühlschrank", "Tu yen"]
            ],
            "a",
            "นาฬิกาเป็นอุปกรณ์ที่บอกเวลาเป็นชั่วโมง นาที และวินาที",
            "Eine Uhr zeigt Stunden, Minuten und Sekunden an und dient der zeitlichen Orientierung.",
            [{ title: "Royal Society of Thailand – Dictionary", url: "https://dictionary.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-lan-023", "language_daily", 3, "single_choice",
            "ก่อนเข้านอนในเวลากลางคืน เรามักพูดกับคนในครอบครัวว่าอย่างไร?",
            "Was sagt man abends zu Familienmitgliedern, bevor man schlafen geht?",
            "Kon khao non nai wela klangkhuen, rao mak phut kap khon nai khropkhrua wa yangrai?",
            [
                ["a", "ราตรีสวัสดิ์", "Gute Nacht", "Ratri sawat"],
                ["b", "ยินดีต้อนรับ", "Herzlich willkommen", "Yindi tonrap"],
                ["c", "ขอโทษครับ", "Entschuldigung", "Kho thot khrap"],
                ["d", "ไม่เป็นไร", "Kein Problem", "Mai pen rai"]
            ],
            "a",
            "'ราตรีสวัสดิ์' หรือ 'ฝันดีนะ' ใช้กล่าวอวยพรก่อนเข้านอนในตอนกลางคืน",
            "'Ratri sawat' (oder umgangssprachlich 'Fan di') bedeutet Gute Nacht und wird vor dem Schlafen gewünscht.",
            [{ title: "Royal Society of Thailand", url: "https://www.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-lan-024", "language_daily", 3, "single_choice",
            "เมื่อโทรศัพท์มือถือแบตเตอรี่หมด เราต้องทำอะไร?",
            "Was müssen wir tun, wenn der Handy-Akku leer ist?",
            "Muea thorasap mue thue baettoeri mot, rao tong tham arai?",
            [
                ["a", "ชาร์จแบตเตอรี่", "Aufladen", "Chat baettoeri"],
                ["b", "ซักผ้า", "Wäsche waschen", "Sak pha"],
                ["c", "กวาดบ้าน", "Das Haus fegen", "Kwat ban"],
                ["d", "ตัดกระดาษ", "Papier schneiden", "Tat kradat"]
            ],
            "a",
            "เมื่อแบตเตอรี่หมด เราต้องเสียบสายชาร์จเข้ากับแหล่งจ่ายไฟเพื่อเติมพลังงาน",
            "Ist der Akku leer, muss das Smartphone an ein Ladekabel angeschlossen werden.",
            [{ title: "Royal Society of Thailand – Dictionary", url: "https://dictionary.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-lan-025", "language_daily", 3, "single_choice",
            "สิ่งใดใช้สำหรับทำความสะอาดจานชามหลังรับประทานอาหาร?",
            "Was benutzt man, um Geschirr nach dem Essen zu reinigen?",
            "Sing dai chai samrap tham khwam saat chan cham lang rap prathan ahan?",
            [
                ["a", "สบู่เหลวล้างจาน", "Geschirrspülmittel", "Sabu leo lang chan"],
                ["b", "แชมพูสระผม", "Haarshampoo", "Chaemphu sa phom"],
                ["c", "ยาสีฟัน", "Zahnpasta", "Ya si fan"],
                ["d", "น้ำหอม", "Parfüm", "Nam hom"]
            ],
            "a",
            "น้ำยาล้างจานช่วยขจัดคราบไขมันและสิ่งสกปรกออกจากจานชามให้สะอาด",
            "Spülmittel löst Fett und Speisereste gründlich vom Geschirr.",
            [{ title: "Department of Health Thailand", url: "https://anamai.moph.go.th/" }]
        ),
        makeQuestion(
            "thq-lan-026", "language_daily", 3, "single_choice",
            "ถ้าเราต้องการยืมหนังสือไปอ่านที่บ้าน เราควรไปที่ใด?",
            "Wohin sollten wir gehen, wenn wir Bücher ausleihen und zu Hause lesen möchten?",
            "Tha rao tongkan yuem nangsue pai an thi ban, rao khuan pai thi dai?",
            [
                ["a", "ห้องสมุด", "Bibliothek", "Hong samut"],
                ["b", "สถานีตำรวจ", "Polizeistation", "Sathani tamruat"],
                ["c", "โรงพยาบาล", "Krankenhaus", "Rongphayaban"],
                ["d", "ธนาคาร", "Bank", "Thanakhan"]
            ],
            "a",
            "ห้องสมุดเป็นแหล่งรวบรวมหนังสือหลากหลายประเภทที่เปิดให้ประชาชนยืมอ่านได้",
            "In einer Bibliothek kann man Bücher und Medien ausleihen und lesen.",
            [{ title: "National Library of Thailand", url: "https://www.nlt.go.th/" }]
        ),
        makeQuestion(
            "thq-lan-027", "language_daily", 3, "single_choice",
            "เมื่อมีคนเคาะประตูบ้าน เราควรทำอย่างไรเป็นอันดับแรก?",
            "Was sollten wir zuerst tun, wenn jemand an die Haustür klopft?",
            "Muea mi khon kho pratu ban, rao khuan tham yangrai pen andap raek?",
            [
                ["a", "เปิดประตูดูว่าใครมา", "Tür öffnen und nachsehen, wer kommt", "Poet pratu du wa khrai ma"],
                ["b", "เข้านอนทันที", "Sofort schlafen gehen", "Khao non thanthi"],
                ["c", "วิ่งหนีออกทางหน้าต่าง", "Aus dem Fenster flüchten", "Wing ni ok thang na tang"],
                ["d", "ปิดโทรทัศน์", "Den Fernseher ausschalten", "Pit thorathat"]
            ],
            "a",
            "เมื่อมีเสียงเคาะประตู เจ้าของบ้านควรตรวจสอบและเปิดประตูต้อนรับแขกที่มาเยือน",
            "Wenn jemand anklopft, öffnet man die Tür, um nachzuschauen, wer zu Besuch kommt.",
            [{ title: "Royal Society of Thailand", url: "https://www.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-foo-019", "food", 3, "single_choice",
            "เมื่อเราเข้าไปในร้านอาหารและต้องการสั่งอาหาร เรามักขอดูสิ่งใดจากพนักงาน?",
            "Was bitten wir die Bedienung im Restaurant zuerst zu sehen, wenn wir bestellen wollen?",
            "Muea rao khao pai nai ran ahan lae tongkan sang ahan, rao mak kho du sing dai chak phanakngan?",
            [
                ["a", "เมนูอาหาร", "Speisekarte", "Menu ahan"],
                ["b", "ใบขับขี่", "Führerschein", "Bai khap khi"],
                ["c", "สมุดบัญชี", "Bankbuch", "Samut banchi"],
                ["d", "ตั๋วรถไฟ", "Zugticket", "Tua rotfai"]
            ],
            "a",
            "เมนูอาหารมีรายการอาหารและราคาเพื่อให้ลูกค้าเลือกสั่งตามความต้องการ",
            "Die Speisekarte listet Gerichte und Preise auf, damit der Gast seine Auswahl treffen kann.",
            [{ title: "Tourism Authority of Thailand – Dining Guide", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-foo-020", "food", 3, "single_choice",
            "ถ้าเรารับประทานอาหารเผ็ดไม่ได้ เมื่อสั่งส้มตำควรบอกแม่ค้าว่าอย่างไร?",
            "Was sollten wir sagen, wenn wir nicht scharf essen können und Som Tam bestellen?",
            "Tha rao rap prathan ahan phet mai dai, muea sang somtam khuan bok maekha wa yangrai?",
            [
                ["a", "ไม่ใส่พริก", "Ohne Chili", "Mai sai phrik"],
                ["b", "ใส่พริกเยอะๆ", "Mit viel Chili", "Sai phrik yoe yoe"],
                ["c", "ไม่ใส่น้ำตาล", "Ohne Zucker", "Mai sai namtan"],
                ["d", "เพิ่มข้าวเหนียว", "Mehr Klebreis dazu", "Phoem khao niao"]
            ],
            "a",
            "การบอกว่า 'ไม่ใส่พริก' หรือ 'เผ็ดน้อย' ช่วยให้แม่ค้าปรุงส้มตำโดยไม่เผ็ดเกินไป",
            "Mit 'Mai sai phrik' (ohne Chili) oder 'Phet noi' (wenig scharf) bestellt man milde Gerichte.",
            [{ title: "Tourism Authority of Thailand – Street Food Culture", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-foo-021", "food", 3, "single_choice",
            "ต้มข่าไก่มีรสชาติกลมกล่อมและมีสีขาวนวลเพราะใส่ส่วนผสมใดเป็นหลัก?",
            "Welche Hauptzutat verleiht Tom Kha Gai seinen cremigen Geschmack und weiße Farbe?",
            "Tom kha kai mi rotchat klomklom lae mi si khao nuan phro sai suanphasom dai pen lak?",
            [
                ["a", "กะทิ", "Kokosmilch", "Kathi"],
                ["b", "น้ำส้มสายชู", "Essig", "Nam som sai chu"],
                ["c", "นมถั่วเหลือง", "Sojamilch", "Nom thua lueang"],
                ["d", "ซีอิ๊วดำ", "Dunkle Sojasauce", "Si-io dam"]
            ],
            "a",
            "ต้มข่าไก่ใช้กะทิสดเคี่ยวกับข่า ตะไคร้ และใบมะกรูด ให้รสชาติมันกลมกล่อมและมีสีขาวนวล",
            "Kokosmilch verleiht der Suppe Tom Kha Gai ihre samtige Textur und milde Cremigkeit.",
            [{ title: "Tourism Authority of Thailand – Thai Food", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-foo-022", "food", 3, "single_choice",
            "คนไทยนิยมใช้ช้อนและส้อมในการรับประทานอาหาร โดยถือช้อนด้วยมือข้างใดเป็นหลัก?",
            "In welcher Hand halten Thailänder üblicherweise den Löffel beim Essen?",
            "Khon Thai niyom chai chon lae som nai kan rap prathan ahan doi thue chon duai mue khang dai pen lak?",
            [
                ["a", "มือขวา", "Rechte Hand", "Mue khwa"],
                ["b", "มือซ้าย", "Linke Hand", "Mue sai"],
                ["c", "ถือสองมือพร้อมกัน", "Beide Hände gleichzeitig", "Thue song mue phrom kan"],
                ["d", "ไม่ใช้ช้อน ใช้แต่มือเปล่า", "Nur mit bloßen Händen", "Mai chai chon, chai tae mue plao"]
            ],
            "a",
            "บนโต๊ะอาหารไทย ช้อนจะถือด้วยมือขวาเพื่อตักอาหารเข้าปาก และใช้ส้อมในมือซ้ายช่วยดันอาหาร",
            "In Thailand hält man den Löffel in der rechten Hand zum Essen und die Gabel links als Schieber.",
            [{ title: "Ministry of Culture Thailand – Dining Etiquette", url: "https://www.m-culture.go.th/" }]
        ),
        makeQuestion(
            "thq-foo-023", "food", 3, "single_choice",
            "อาหารจานใดของไทยที่ทำจากเส้นก๋วยเตี๋ยวผัดกับไข่ เต้าหู้ กุ้งแห้ง และถั่วงอก?",
            "Welches Gericht besteht aus gebratenen Nudeln mit Ei, Tofu, getrockneten Garnelen und Sojasprossen?",
            "Ahan chan dai khong Thai thi tham chak sen kuaitiao phat kap khai, taohu, kung haeng lae thua ngok?",
            [
                ["a", "ผัดไทย", "Pad Thai", "Phat Thai"],
                ["b", "ข้าวผัด", "Gebratener Reis", "Khao phat"],
                ["c", "แกงส้ม", "Kaeng Som", "Kaeng som"],
                ["d", "ข้าวต้ม", "Reissuppe", "Khao tom"]
            ],
            "a",
            "ผัดไทยเป็นอาหารเส้นผัดที่มีเอกลักษณ์ระดับโลก เสิร์ฟพร้อมมะนาวสดและถั่วลิสงคั่วบด",
            "Pad Thai ist Thailands berühmtestes gebratenes Reisnudelgericht mit Tamarindensauce und Erdnüssen.",
            [{ title: "Tourism Authority of Thailand – Pad Thai Heritage", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-foo-024", "food", 3, "single_choice",
            "เมื่อรับประทานอาหารเสร็จแล้วและต้องการจ่ายเงิน เราควรพูดกับพนักงานว่าอย่างไร?",
            "Was sagt man zur Bedienung, wenn man fertig gegessen hat und bezahlen möchte?",
            "Muea rap prathan ahan set laeo lae tongkan chai ngoen, rao khuan phut kap phanakngan wa yangrai?",
            [
                ["a", "เช็คบิลด้วยครับ / เก็บเงินด้วยครับ", "Rechnung bitte / Zahlen bitte", "Chek bin duai khrap / Kep ngoen duai khrap"],
                ["b", "ขอเมนูหน่อยครับ", "Die Speisekarte bitte", "Kho menu noi khrap"],
                ["c", "ยินดีที่ได้รู้จัก", "Schön, dich kennenzulernen", "Yindi thi dai ruchak"],
                ["d", "หิวข้าวมากครับ", "Ich habe großen Hunger", "Hiu khao mak khrap"]
            ],
            "a",
            "คำว่า 'เช็คบิลด้วยครับ' หรือ 'เก็บเงินด้วยครับ' เป็นประโยคสุภาพที่ใช้แจ้งพนักงานเพื่อชำระค่าอาหาร",
            "'Chek bin khrap' oder 'Kep ngoen khrap' verwendet man höflich, um die Rechnung zu verlangen.",
            [{ title: "Tourism Authority of Thailand – Everyday Thai", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-foo-025", "food", 3, "single_choice",
            "ผลไม้ไทยชนิดใดที่มีเปลือกสีเขียว มีหนามแหลมคม และเนื้อข้างในสีเหลืองรสหวานมัน?",
            "Welche thailändische Frucht hat eine grüne, stachelige Schale und gelbes, cremig-süßes Fruchtfleisch?",
            "Phonlamai Thai chanit dai thi mi plueak si khiao, mi nam laem khom, lae nuea khang nai si lueang rot wan man?",
            [
                ["a", "ทุเรียน", "Durian", "Thurian"],
                ["b", "แตงโม", "Wassermelone", "Taeng mo"],
                ["c", "ส้มโอ", "Pomelo", "Som-o"],
                ["d", "มังคุด", "Mangostan", "Mangkhut"]
            ],
            "a",
            "ทุเรียนได้รับสมญานามว่า 'ราชาแห่งผลไม้' มีเปลือกหนามแหลมคมและเนื้อรสชาติเข้มข้นหวานมัน",
            "Die Durian gilt als 'König der Früchte', bekannt für ihre stachelige Schale und markantes Aroma.",
            [{ title: "Department of Agriculture Thailand – Durian", url: "https://www.doa.go.th/" }]
        ),
        makeQuestion(
            "thq-foo-026", "food", 3, "single_choice",
            "เครื่องปรุงรสของไทยที่มีรสเค็มและกลิ่นหอมเฉพาะตัว นิยมใช้แทนเกลือคืออะไร?",
            "Welches typische salzige Würzmittel wird in Thailand häufig anstelle von Salz verwendet?",
            "Khrueang prung rot khong Thai thi mi rot khem lae klin hom chapho tua, niyom chai thaen kluea khue arai?",
            [
                ["a", "น้ำปลา", "Fischsauce", "Nampla"],
                ["b", "น้ำผึ้ง", "Honig", "Nam phueng"],
                ["c", "น้ำเชื่อม", "Zuckersirup", "Nam chueam"],
                ["d", "กะทิ", "Kokosmilch", "Kathi"]
            ],
            "a",
            "น้ำปลาหมักจากปลากับเกลือ เป็นเครื่องปรุงหลักที่ให้รสเค็มกลมกล่อมในอาหารไทยเกือบทุกจาน",
            "Fischsauce (Nampla) ist die wichtigste salzige Würze der Thai-Küche und ersetzt oft reines Salz.",
            [{ title: "Royal Society of Thailand – Dictionary", url: "https://dictionary.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-foo-027", "food", 3, "single_choice",
            "ถ้าอาหารมีรสเปรี้ยวเกินไป เราสามารถเติมเครื่องปรุงใดเพื่อช่วยลดรสเปรี้ยวได้?",
            "Was kann man hinzufügen, wenn das Essen zu sauer ist, um die Säure abzumildern?",
            "Tha ahan mi rot priao koen pai, rao samat toem khrueang prung dai phuea chuai lot rot priao dai?",
            [
                ["a", "น้ำตาล", "Zucker", "Namtan"],
                ["b", "มะนาว", "Limette", "Manao"],
                ["c", "น้ำส้มสายชู", "Essig", "Nam som sai chu"],
                ["d", "พริกป่น", "Chilipulver", "Phrik pon"]
            ],
            "a",
            "ความหวานของน้ำตาลช่วยตัดและปรับสมดุลรสเปรี้ยวของอาหารให้อร่อยกลมกล่อมขึ้น",
            "Zucker mildert übermäßige Säure ab und balanciert das Geschmacksprofil thailändischer Gerichte.",
            [{ title: "Department of Health Thailand", url: "https://anamai.moph.go.th/" }]
        ),
        makeQuestion(
            "thq-foo-028", "food", 3, "single_choice",
            "ของหวานไทยที่ทำจากข้าวเหนียวมูล มะม่วงสุก และราดด้วยน้ำกะทิคือเมนูใด?",
            "Welches Dessert besteht aus süßem Klebreis, reifer Mango und Kokossauce?",
            "Khong wan Thai thi tham chak khao niao mun, mamuang suk, lae rat duai nam kathi khue menu dai?",
            [
                ["a", "ข้าวเหนียวมะม่วง", "Mango Sticky Rice", "Khao niao mamuang"],
                ["b", "กล้วยบวชชี", "Bananen in Kokosmilch", "Kluai buat chi"],
                ["c", "บัวลอย", "Bua Loi", "Bua loi"],
                ["d", "ข้าวต้มมัด", "Khao Tom Mat", "Khao tom mat"]
            ],
            "a",
            "ข้าวเหนียวมะม่วงเป็นขนมหวานยอดนิยมของไทย ทำจากข้าวเหนียวมูนกะทิ เสิร์ฟคู่กับมะม่วงน้ำดอกไม้สุก",
            "Khao Niao Mamuang kombiniert süß-cremigen Kokos-Klebreis mit fruchtig-aromatischer reifer Mango.",
            [{ title: "Tourism Authority of Thailand – Thai Desserts", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-geo-019", "geography", 3, "single_choice",
            "หากเราต้องการขึ้นเครื่องบินเพื่อเดินทางไปต่างประเทศ เราต้องไปที่ไหน?",
            "Wohin müssen wir gehen, wenn wir ein Flugzeug ins Ausland nehmen wollen?",
            "Hak rao tongkan khuen khrueangbin phuea doen thang pai tang prathet, rao tong pai thi nai?",
            [
                ["a", "สนามบิน", "Flughafen", "Sanam bin"],
                ["b", "ท่าเรือ", "Hafen", "Tha ruea"],
                ["c", "ท่ารถตู้", "Minivan-Station", "Tha rot tu"],
                ["d", "ป้ายรถเมล์", "Bushaltestelle", "Pai rot me"]
            ],
            "a",
            "สนามบินหรือท่าอากาศยานเป็นสถานที่สำหรับเครื่องบินขึ้นและลงจอดเพื่อรับส่งผู้โดยสาร",
            "Ein Flughafen (Sanam Bin) ist das Drehkreuz für nationale und internationale Flüge.",
            [{ title: "Airports of Thailand", url: "https://www.mot.go.th/" }]
        ),
        makeQuestion(
            "thq-geo-020", "geography", 3, "single_choice",
            "รถไฟฟ้าลอยฟ้าที่วิ่งให้บริการในกรุงเทพมหานครมีชื่อย่อภาษาอังกฤษว่าอะไร?",
            "Wie lautet die englische Abkürzung für den Skytrain in Bangkok?",
            "Rotfaifa loi fa thi wing hai borikan nai Krung Thep Maha Nakhon mi chue yo phasa Angkrit wa arai?",
            [
                ["a", "BTS", "BTS Skytrain", "Bi-thi-et"],
                ["b", "MRT", "MRT U-Bahn", "Em-ar-thi"],
                ["c", "VIP", "VIP", "Vi-ai-phi"],
                ["d", "GPS", "GPS Navigationssystem", "Chi-phi-et"]
            ],
            "a",
            "BTS คือรถไฟฟ้าสายสีเขียวและสายสีลมที่วิ่งยกระดับเหนือพื้นถนนในกรุงเทพมหานคร",
            "BTS steht für Bangkok Mass Transit System, den bekannten Hochbahnzug (Skytrain).",
            [{ title: "Bangkok Mass Transit System", url: "https://www.bts.co.th/" }]
        ),
        makeQuestion(
            "thq-geo-021", "geography", 3, "single_choice",
            "ถ้าเราหลงทางในเมืองและต้องการถามทาง เราควรเริ่มต้นพูดด้วยคำสุภาพคำใด?",
            "Mit welchem höflichen Wort sollte man beginnen, wenn man nach dem Weg fragen möchte?",
            "Tha rao long thang nai mueang lae tongkan tham thang, rao khuan roemton phut duai kham suphap kham dai?",
            [
                ["a", "ขอโทษครับ / ขอโทษค่ะ", "Entschuldigung", "Kho thot khrap / Kho thot kha"],
                ["b", "ไม่เอาครับ / ไม่เอาค่ะ", "Ich will nicht", "Mai ao khrap / Mai ao kha"],
                ["c", "ขอบคุณครับ / ขอบคุณค่ะ", "Danke", "Khop khun khrap / Khop khun kha"],
                ["d", "ลาก่อนครับ / ลาก่อนค่ะ", "Auf Wiedersehen", "La kon khrap / La kon kha"]
            ],
            "a",
            "คำว่า 'ขอโทษครับ/ค่ะ' ใช้เปิดบทสนทนาอย่างสุภาพเมื่อต้องการขอความช่วยเหลือหรือถามทาง",
            "'Kho thot khrap/kha' bedeutet Entschuldigung und leitet eine höfliche Frage nach dem Weg ein.",
            [{ title: "Royal Society of Thailand", url: "https://www.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-geo-022", "geography", 3, "single_choice",
            "สถานที่ใดในเมืองที่คนมักไปพักผ่อน ออกกำลังกาย หรือเดินเล่นใต้ร่มเงาต้นไม้?",
            "An welchen Ort gehen Menschen in der Stadt zum Entspannen, Trainieren oder Spazierengehen im Schatten von Bäumen?",
            "Sathanthi dai nai mueang thi khon mak pai phakphon, ok kamlang kai, rue doen len tai romngao tonmai?",
            [
                ["a", "สวนสาธารณะ", "Öffentlicher Park", "Suan satharana"],
                ["b", "โรงงาน", "Fabrik", "Rongngan"],
                ["c", "ธนาคาร", "Bank", "Thanakhan"],
                ["d", "ทางด่วน", "Autobahn", "Thang duan"]
            ],
            "a",
            "สวนสาธารณะ เช่น สวนลุมพินี เป็นพื้นที่สีเขียวใจกลางเมืองสำหรับวิ่งออกกำลังกายและพักผ่อน",
            "Öffentliche Parks wie der Lumpini-Park bieten Grünflächen zur Erholung und sportlichen Betätigung.",
            [{ title: "Bangkok Metropolitan Administration", url: "https://www.bangkok.go.th/" }]
        ),
        makeQuestion(
            "thq-geo-023", "geography", 3, "single_choice",
            "วัดสำคัญที่มีพระพุทธไสยาสน์ (พระนอน) องค์ใหญ่ตั้งอยู่ใกล้พระบรมมหาราชวังคือวัดใด?",
            "Welcher berühmte Tempel mit einem riesigen liegenden Buddha liegt nahe dem Großen Palast?",
            "Wat samkhan thi mi phra phuttha saiyat (phra non) ong yai tang yu klai Phra Borom Maha Ratchawang khue wat dai?",
            [
                ["a", "วัดโพธิ์", "Wat Pho", "Wat Pho"],
                ["b", "วัดอรุณ", "Wat Arun", "Wat Arun"],
                ["c", "วัดสระเกศ", "Wat Saket", "Wat Saket"],
                ["d", "วัดพระแก้ว", "Wat Phra Kaew", "Wat Phra Kaeo"]
            ],
            "a",
            "วัดโพธิ์ (วัดพระเชตุพน) มีพระนอนองค์ใหญ่สีทองอร่ามและยังเป็นศูนย์กลางการนวดแผนไทยโบราณ",
            "Wat Pho beherbergt den 46 Meter langen liegenden Buddha und gilt als Wiege der Thai-Massage.",
            [{ title: "Tourism Authority of Thailand – Wat Pho", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-geo-024", "geography", 3, "single_choice",
            "คำว่า 'ตรงไป' ในการบอกทิศทางภาษาไทยมีความหมายว่าอย่างไร?",
            "Was bedeutet die Richtungsangabe 'Trong pai' auf Deutsch?",
            "Kham wa 'trong pai' nai kan bok thitthang phasa Thai mi khwammai wa yangrai?",
            [
                ["a", "Geradeaus gehen", "Geradeaus gehen", "Trong pai"],
                ["b", "Nach links abbiegen", "Nach links abbiegen", "Liao sai"],
                ["c", "Nach rechts abbiegen", "Nach rechts abbiegen", "Liao khwa"],
                ["d", "Umkehren", "Umkehren", "Klap lang han"]
            ],
            "a",
            "'ตรงไป' หมายถึงการมุ่งหน้าต่อไปข้างหน้าตามเส้นทางโดยไม่เลี้ยวซ้ายหรือขวา",
            "'Trong pai' bedeutet geradeaus weiterzugehen oder weiterzufahren.",
            [{ title: "Royal Society of Thailand – Dictionary", url: "https://dictionary.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-geo-025", "geography", 3, "single_choice",
            "ถ้าคนบอกทางพูดว่า 'เลี้ยวซ้ายตรงสี่แยก' เราต้องทำอย่างไร?",
            "Was müssen wir tun, wenn jemand sagt: 'Liao sai trong si yaek'?",
            "Tha khon bok thang phut wa 'liao sai trong si yaek' rao tong tham yangrai?",
            [
                ["a", "An der Kreuzung nach links abbiegen", "An der Kreuzung nach links abbiegen", "Liao sai thi si yaek"],
                ["b", "An der Kreuzung nach rechts abbiegen", "An der Kreuzung nach rechts abbiegen", "Liao khwa thi si yaek"],
                ["c", "Vor der Kreuzung anhalten", "Vor der Kreuzung anhalten", "Yut rot kon thueng yaek"],
                ["d", "An der Kreuzung geradeaus fahren", "An der Kreuzung geradeaus fahren", "Kham yaek trong pai"]
            ],
            "a",
            "'เลี้ยวซ้าย' คือการเปลี่ยนทิศไปทางซ้ายมือ และ 'สี่แยก' คือจุดตัดของถนนสี่สาย",
            "'Liao sai trong si yaek' bedeutet, an der kommenden Viererkreuzung nach links abzubiegen.",
            [{ title: "Royal Society of Thailand", url: "https://www.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-geo-026", "geography", 3, "single_choice",
            "ยานพาหนะสามล้อที่มีเอกลักษณ์และมีชื่อเสียงมากของประเทศไทยเรียกว่าอะไร?",
            "Wie heißt das dreirädrige Fahrzeug, das ein berühmtes Wahrzeichen Thailands ist?",
            "Yan phahana sam lo thi mi ekkalak lae mi chuesiang mak khong prathet Thai riak wa arai?",
            [
                ["a", "รถตุ๊กตุ๊ก", "Tuk-Tuk", "Rot tuk tuk"],
                ["b", "รถแท็กซี่", "Taxi", "Rot thaeksi"],
                ["c", "รถเมล์", "Linienbus", "Rot me"],
                ["d", "รถกระบะ", "Pickup-Truck", "Rot kraba"]
            ],
            "a",
            "รถตุ๊กตุ๊กเป็นรถสามล้อเครื่องที่มีเสียงเครื่องยนต์เป็นเอกลักษณ์ เป็นสัญลักษณ์ท่องเที่ยวของไทย",
            "Das Tuk-Tuk ist das ikonische motorisierte Dreirad und ein beliebtes Transportmittel in thailändischen Städten.",
            [{ title: "Tourism Authority of Thailand – Tuk-Tuks", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-geo-027", "geography", 3, "single_choice",
            "จังหวัดเชียงใหม่ตั้งอยู่ในภูมิภาคใดของประเทศไทย?",
            "In welcher Region Thailands liegt die Provinz Chiang Mai?",
            "Changwat Chiang Mai tang yu nai phumiphak dai khong prathet Thai?",
            [
                ["a", "ภาคเหนือ", "Nordregion", "Phak nuea"],
                ["b", "ภาคใต้", "Südregion", "Phak tai"],
                ["c", "ภาคตะวันออก", "Ostregion", "Phak tawan-ok"],
                ["d", "ภาคกลาง", "Zentralregion", "Phak klang"]
            ],
            "a",
            "เชียงใหม่เป็นศูนย์กลางทางวัฒนธรรมและเศรษฐกิจที่ใหญ่ที่สุดในภาคเหนือของไทย",
            "Chiang Mai ist die bedeutendste Metropole und Kulturstadt im gebirgigen Norden Thailands.",
            [{ title: "Tourism Authority of Thailand – Chiang Mai", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-geo-028", "geography", 3, "single_choice",
            "หากเราต้องการข้ามแม่น้ำเจ้าพระยาโดยไม่ต้องใช้สะพาน เราสามารถใช้บริการอะไรได้?",
            "Was können wir nutzen, um den Fluss Chao Phraya ohne Brücke zu überqueren?",
            "Hak rao tongkan kham Maenam Chao Phraya doi mai tong chai saphan, rao samat chai borikan arai dai?",
            [
                ["a", "เรือข้ามฟาก", "Fähre", "Ruea kham fak"],
                ["b", "รถไฟใต้ดิน", "U-Bahn ohne Tunnel", "Rotfai tai din"],
                ["c", "มอเตอร์ไซค์รับจ้าง", "Motorradtaxi übers Wasser", "Motosai rapchang"],
                ["d", "รถสามล้อถีบ", "Fahrrad-Rikscha", "Rot sam lo thip"]
            ],
            "a",
            "เรือข้ามฟากมีให้บริการตามท่าเรือริมแม่น้ำเจ้าพระยาหลายแห่ง เพื่อรับส่งคนข้ามสองฝั่งน้ำ",
            "Fährboote ('Ruea Kham Fak') pendeln günstig und schnell zwischen den beiden Ufern des Chao Phraya.",
            [{ title: "Chao Phraya Express Boat", url: "https://www.chaophrayaexpressboat.com/" }]
        ),
        makeQuestion(
            "thq-cul-019", "culture", 3, "single_choice",
            "เมื่อเราสนใจสินค้าชิ้นหนึ่งในตลาดและอยากทราบราคา เราควรพูดถามว่าอย่างไร?",
            "Was fragen wir auf dem Markt, wenn uns eine Ware interessiert und wir den Preis wissen möchten?",
            "Muea rao sonchai sinkha chin nueng nai talat lae yak sap rakha, rao khuan phut tham wa yangrai?",
            [
                ["a", "อันนี้ราคาเท่าไรครับ?", "Wie viel kostet das?", "An ni rakha thao rai khrap?"],
                ["b", "อันนี้กินได้ไหมครับ?", "Kann man das essen?", "An ni kin dai mai khrap?"],
                ["c", "ร้านนี้ปิดกี่โมงครับ?", "Wann schließt der Laden?", "Ran ni pit ki mong khrap?"],
                ["d", "บ้านคุณอยู่ที่ไหนครับ?", "Wo wohnst du?", "Ban khun yu thi nai khrap?"]
            ],
            "a",
            "'อันนี้ราคาเท่าไรครับ/ค่ะ' หรือ 'กี่บาทครับ/ค่ะ' เป็นคำถามมาตรฐานสำหรับถามราคาสินค้า",
            "'An ni rakha thao rai khrap?' ist die alltägliche Frage zur Erkundigung nach dem Preis einer Ware.",
            [{ title: "Tourism Authority of Thailand – Shopping in Thailand", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-cul-020", "culture", 3, "single_choice",
            "ถ้าแม่ค้าบอกราคาของแพงเกินไป เราสามารถขอต่อรองราคาอย่างสุภาพได้อย่างไร?",
            "Wie können wir höflich nach einem Preisnachlass fragen, wenn der Preis etwas zu hoch ist?",
            "Tha maekha bok rakha khong phaeng koen pai, rao samat kho to-rong rakha yang suphap dai yangrai?",
            [
                ["a", "ลดหน่อยได้ไหมครับ?", "Geht es etwas günstiger?", "Lot noi dai mai khrap?"],
                ["b", "ไม่ซื้อแล้วครับ", "Ich kaufe nichts mehr", "Mai sue laeo khrap"],
                ["c", "ขอฟรีได้ไหมครับ?", "Kann ich es umsonst haben?", "Kho fri dai mai khrap?"],
                ["d", "คืนเงินเดี๋ยวนี้", "Geben Sie mir sofort das Geld zurück", "Khuen ngoen diao ni"]
            ],
            "a",
            "'ลดหน่อยได้ไหมครับ/ค่ะ' หรือ 'ลดได้ไหม' เป็นวิธีต่อรองราคาสินค้าตามตลาดสดอย่างนุ่มนวล",
            "'Lot noi dai mai khrap/kha?' fragt mit einem freundlichen Lächeln nach einem kleinen Rabatt.",
            [{ title: "Tourism Authority of Thailand – Shopping Etiquette", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-cul-021", "culture", 3, "single_choice",
            "ธนบัตรไทยใบละ 20 บาทมีสีอะไรเป็นเอกลักษณ์?",
            "Welche charakteristische Farbe hat der thailändische 20-Baht-Geldschein?",
            "Thanabat Thai bai la yi sip baht mi si arai pen ekkalak?",
            [
                ["a", "สีเขียว", "Grün", "Si khiao"],
                ["b", "สีแดง", "Rot", "Si daeng"],
                ["c", "สีน้ำเงิน", "Blau", "Si namngoen"],
                ["d", "สีม่วง", "Lila", "Si muang"]
            ],
            "a",
            "ธนบัตรไทย 20 บาทมีโทนสีเขียวเป็นเอกลักษณ์ ส่วน 100 บาทเป็นสีแดง และ 500 บาทเป็นสีม่วง",
            "Der 20-Baht-Schein ist grün, der 100-Baht-Schein rot und der 500-Baht-Schein lila.",
            [{ title: "Bank of Thailand – Banknotes in Circulation", url: "https://www.bot.or.th/" }]
        ),
        makeQuestion(
            "thq-cul-022", "culture", 3, "single_choice",
            "ธนบัตรไทยที่มีมูลค่าสูงสุดในการใช้งานทั่วไปคือธนบัตรใบละกี่บาท?",
            "Welcher thailändische Geldschein hat den höchsten Nennwert im alltäglichen Umlauf?",
            "Thanabat Thai thi mi munkha sung sut nai kan chai ngan thua pai khue thanabat bai la ki baht?",
            [
                ["a", "1,000 บาท", "1.000 Baht", "Nueng phan baht"],
                ["b", "500 บาท", "500 Baht", "Ha roi baht"],
                ["c", "100 บาท", "100 Baht", "Nueng roi baht"],
                ["d", "50 บาท", "50 Baht", "Ha sip baht"]
            ],
            "a",
            "ธนบัตร 1,000 บาท (โทนสีน้ำตาลเทา) มีมูลค่าสูงที่สุดในการใช้จ่ายทั่วไปในชีวิตประจำวันของไทย",
            "Die 1.000-Baht-Note ist die Banknote mit dem höchsten Wert im thailändischen Zahlungsverkehr.",
            [{ title: "Bank of Thailand – Banknotes", url: "https://www.bot.or.th/" }]
        ),
        makeQuestion(
            "thq-cul-023", "culture", 3, "single_choice",
            "คำว่า 'เงินทอน' ในภาษาไทยหมายถึงอะไร?",
            "Was bedeutet das Wort 'Ngoen thon' (เงินทอน) auf Deutsch?",
            "Kham wa 'ngoen thon' nai phasa Thai maithueng arai?",
            [
                ["a", "Wechselgeld (Rückgeld)", "Wechselgeld (Rückgeld)", "Ngoen thon"],
                ["b", "Trinkgeld", "Trinkgeld", "Thip"],
                ["c", "Schulden", "Schulden", "Ni sin"],
                ["d", "Eintrittspreis", "Eintrittspreis", "Kha khao"]
            ],
            "a",
            "'เงินทอน' คือเงินที่ผู้ขายคืนให้แก่ผู้ซื้อเมื่อผู้ซื้อจ่ายเงินเกินจำนวนราคาสินค้า",
            "'Ngoen thon' ist das Wechselgeld, das man vom Händler nach Barzahlung zurückerhält.",
            [{ title: "Royal Society of Thailand – Dictionary", url: "https://dictionary.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-cul-024", "culture", 3, "single_choice",
            "ตลาดนัดจตุจักรในกรุงเทพฯ มีชื่อเสียงโด่งดังจากการเปิดขายสินค้าเต็มรูปแบบในวันใด?",
            "An welchen Tagen ist der berühmte Chatuchak-Markt in Bangkok voll geöffnet?",
            "Talat nat Chatuchak nai Krung Thep mi chuesiang dongdang chak kan poet khai sinkha tem rupbaep nai wan dai?",
            [
                ["a", "วันเสาร์และวันอาทิตย์", "Samstag und Sonntag", "Wan sao lae wan athit"],
                ["b", "วันจันทร์และวันอังคาร", "Montag und Dienstag", "Wan chan lae wan angkhan"],
                ["c", "วันพุธเท่านั้น", "Nur Mittwoch", "Wan phut thaonan"],
                ["d", "เปิดเฉพาะตอนกลางคืนทุกวัน", "Täglich nur nachts", "Poet chapho ton klangkhuen thuk wan"]
            ],
            "a",
            "ตลาดนัดสวนจตุจักร (Chatuchak Weekend Market) เปิดขายสินค้าครบทุกโซนในวันเสาร์และอาทิตย์",
            "Der Chatuchak-Wochenendmarkt ist samstags und sonntags voll geöffnet und einer der größten Märkte weltweit.",
            [{ title: "Tourism Authority of Thailand – Chatuchak", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-cul-025", "culture", 3, "single_choice",
            "เมื่อซื้อเสื้อผ้าในห้างสรรพสินค้าและไม่แน่ใจว่าใส่ได้พอดีหรือไม่ เราควรทำอย่างไรก่อน?",
            "Was sollten wir tun, wenn wir nicht sicher sind, ob ein Kleidungsstück passt?",
            "Muea sue suea pha nai hang sapphasinkha lae mai naechai wa sai dai phodi rue mai, rao khuan tham yangrai kon?",
            [
                ["a", "ขอลองใส่ในห้องลอง", "In der Umkleidekabine anprobieren", "Kho long sai nai hong long"],
                ["b", "จ่ายเงินแล้วทิ้งทันที", "Bezahlen und sofort wegwerfen", "Chai ngoen laeo thing thanthi"],
                ["c", "ตัดขากางเกงก่อน", "Zuerst die Hosenbeine kürzen", "Tat kha kangkeng kon"],
                ["d", "ซักเสื้อผ้าในร้าน", "Die Kleidung im Laden waschen", "Sak suea pha nai ran"]
            ],
            "a",
            "ห้องลองเสื้อผ้าช่วยให้ลูกค้าตรวจสอบขนาดและความพอดีก่อนตัดสินใจซื้อ",
            "In der Umkleidekabine ('Hong long') probiert man Kleidung an, um die richtige Größe zu wählen.",
            [{ title: "Royal Society of Thailand", url: "https://www.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-cul-026", "culture", 3, "single_choice",
            "ถ้าต้องการซื้อผลไม้เป็นกิโลกรัม คำว่า 'กิโลกรัม' คนไทยนิยมพูดย่อๆ ว่าอย่างไร?",
            "Wie kürzen Thailänder das Wort 'Kilogramm' in der Umgangssprache meistens ab?",
            "Tha tongkan sue phonlamai pen kilokram, kham wa 'kilokram' khon Thai niyom phut yo yo wa yangrai?",
            [
                ["a", "โล", "Lo", "Lo"],
                ["b", "กรัม", "Kram", "Kram"],
                ["c", "ขีด", "Khit", "Khit"],
                ["d", "ลิตร", "Lit", "Lit"]
            ],
            "a",
            "คนไทยมักพูดคำว่า 'โล' สั้นๆ แทน 'กิโลกรัม' เช่น ส้มกิโลละเท่าไร หรือซื้อมังคุดสองโล",
            "Im Marktalltag kürzen Thailänder Kilogramm fast immer auf 'Lo' ab (z. B. 'song lo' = 2 Kilo).",
            [{ title: "Royal Society of Thailand – Dictionary", url: "https://dictionary.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-cul-027", "culture", 3, "single_choice",
            "ร้านสะดวกซื้อที่เปิดบริการตลอด 24 ชั่วโมงและพบเห็นได้เกือบทุกซอยในไทยคือร้านใด?",
            "Welcher 24-Stunden-Convenience-Store ist an fast jeder Straßenecke in Thailand zu finden?",
            "Ran saduak sue thi poet borikan talot yisip-si chuamong lae phop hen dai kueap thuk soi nai Thai khue ran dai?",
            [
                ["a", "เซเว่น อีเลฟเว่น", "7-Eleven", "Se-wen I-leo-wen"],
                ["b", "ไปรษณีย์ไทย", "Thailand Post", "Praisani Thai"],
                ["c", "ธนาคารออมสิน", "GSB Bank", "Thanakhan Omsin"],
                ["d", "ร้านขายยาชุมชน", "Gemeinde-Apotheke", "Ran khai ya chumchon"]
            ],
            "a",
            "เซเว่น อีเลฟเว่น มีสาขามากกว่าหมื่นแห่งทั่วประเทศไทย เปิดให้บริการตลอด 24 ชั่วโมง",
            "7-Eleven ist Thailands allgegenwärtiger 24-Stunden-Nahversorger für Snacks, Getränke und Alltagsdinge.",
            [{ title: "Tourism Authority of Thailand – Convenience in Thailand", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-cul-028", "culture", 3, "single_choice",
            "เมื่อเราซื้อของเสร็จและพนักงานยื่นถุงสินค้าให้ เราควรตอบว่าอย่างไรตามมารยาท?",
            "Was sagen wir aus Höflichkeit, wenn das Verkaufspersonal die Einkaufstasche überreicht?",
            "Muea rao sue khong set lae phanakngan yuen thung sinkha hai, rao khuan top wa yangrai tam marayat?",
            [
                ["a", "ขอบคุณครับ / ขอบคุณค่ะ", "Vielen Dank", "Khop khun khrap / Khop khun kha"],
                ["b", "ไม่เป็นไร", "Macht nichts", "Mai pen rai"],
                ["c", "ขอโทษครับ", "Entschuldigung", "Kho thot khrap"],
                ["d", "พบกันใหม่", "Bis bald", "Phop kan mai"]
            ],
            "a",
            "การกล่าว 'ขอบคุณครับ/ค่ะ' แสดงถึงความมีน้ำใจ มารยาทอันดี และความเคารพซึ่งกันและกัน",
            "'Khop khun khrap/kha' ist die herzliche und höfliche Erwiderung nach jedem Einkauf.",
            [{ title: "Ministry of Culture Thailand", url: "https://www.m-culture.go.th/" }]
        ),
        makeQuestion(
            "thq-geo-029", "geography", 3, "single_choice",
            "เมื่อเราขึ้นรถแท็กซี่ในกรุงเทพฯ เราควรบอกคนขับให้ทำอะไรกับค่าโดยสาร?",
            "Worum sollten wir den Taxifahrer in Bangkok bitten bezüglich des Fahrpreises?",
            "Muea rao khuen rot thaeksi nai Krung Thep, rao khuan bok khon khap hai tham arai kap kha doisan?",
            [
                ["a", "เปิดมิเตอร์", "Das Taxameter einzuschalten", "Poet mi-toe"],
                ["b", "ขับฟรี", "Umsonst zu fahren", "Khap fri"],
                ["c", "จ่ายเงินก่อนออกรถ", "Vor der Abfahrt zu bezahlen", "Chai ngoen kon ok rot"],
                ["d", "ไม่ต้องใช้ไฟเลี้ยว", "Keine Blinker zu benutzen", "Mai tong chai fai liao"]
            ],
            "a",
            "แท็กซี่ในกรุงเทพฯ เป็นแท็กซี่มิเตอร์ ผู้โดยสารควรให้คนขับเปิดมิเตอร์คำนวณราคาตามระยะทาง",
            "In Bangkok sollte man stets darauf achten, dass der Taxifahrer das Taxameter ('Poet meter') einschaltet.",
            [{ title: "Department of Land Transport Thailand", url: "https://www.dlt.go.th/" }]
        ),
        makeQuestion(
            "thq-geo-030", "geography", 3, "single_choice",
            "ถ้าเราต้องการหยุดรถสองแถวเมื่อถึงที่หมาย เราต้องทำอย่างไร?",
            "Wie signalisieren wir im Songthaew, dass wir anhalten und aussteigen möchten?",
            "Tha rao tongkan yut rot songthaeo muea thueng thi mai, rao tong tham yangrai?",
            [
                ["a", "กดกริ่งบนเพดานรถ", "Die Klingel an der Decke drücken", "Kot kring bon phedan rot"],
                ["b", "ตะโกนเสียงดัง", "Laut schreien", "Takon siang dang"],
                ["c", "กระโดดลงจากรถ", "Sofort herausspringen", "Kradot long chak rot"],
                ["d", "ดับเครื่องยนต์", "Den Motor ausschalten", "Dap khrueang yon"]
            ],
            "a",
            "บนเพดานของรถสองแถวจะมีปุ่มกริ่งให้ผู้โดยสารกดส่งสัญญาณเสียงเตือนให้คนขับจอดรถ",
            "Im Songthaew drückt man einfach auf den Summer an der Wagendecke, damit der Fahrer anhält.",
            [{ title: "Department of Land Transport Thailand", url: "https://www.dlt.go.th/" }]
        ),
        makeQuestion(
            "thq-geo-031", "geography", 3, "single_choice",
            "การขี่รถมอเตอร์ไซค์ในประเทศไทย ผู้ขับขี่และผู้ซ้อนท้ายต้องสวมสิ่งใดตามกฎหมาย?",
            "Was müssen Fahrer und Beifahrer auf einem Motorrad in Thailand gesetzlich tragen?",
            "Kan khi rot motosai nai prathet Thai, phu khapkhi lae phu son thai tong suam sing dai tam kotmai?",
            [
                ["a", "หมวกกันน็อก", "Schutzhelm", "Muak kan nok"],
                ["b", "แว่นตาดำ", "Sonnenbrille", "Waen ta dam"],
                ["c", "ถุงมือผ้า", "Stoffhandschuhe", "Thung mue pha"],
                ["d", "เสื้อกันฝน", "Regenjacke", "Suea kan fon"]
            ],
            "a",
            "กฎหมายจราจรของไทยกำหนดให้ผู้ขับขี่และผู้โดยสารรถจักรยานยนต์ทุกคนต้องสวมหมวกนิรภัยเพื่อความปลอดภัย",
            "In Thailand besteht auf Motorrädern Helmpflicht ('Muak kan nok') für Fahrer und Beifahrer.",
            [{ title: "Royal Thai Police – Traffic Safety", url: "https://www.royalthaipolice.go.th/" }]
        ),
        makeQuestion(
            "thq-geo-032", "geography", 3, "single_choice",
            "สัญญาณไฟจราจรสีแดงมีความหมายว่าอย่างไรสำหรับผู้ใช้ถนน?",
            "Was bedeutet eine rote Verkehrsampel für Verkehrsteilnehmer?",
            "Sanyanka fai charachon si daeng mi khwammai wa yangrai samrap phu chai thanon?",
            [
                ["a", "ให้หยุดรถ", "Anhalten", "Hai yut rot"],
                ["b", "ให้ขับเร็วขึ้น", "Schneller fahren", "Hai khap reo khuen"],
                ["c", "ให้เลี้ยวซ้ายได้ทันที", "Sofort links abbiegen", "Hai liao sai dai thanthi"],
                ["d", "ให้จอดรถนอนพัก", "Parken und schlafen", "Hai chot rot non phak"]
            ],
            "a",
            "สัญญาณไฟแดงหมายถึงให้หยุดรถหลังเส้นหยุด สัญญาณไฟเขียวหมายถึงให้ขับผ่านไปได้",
            "Rot bedeutet Halt vor der Haltelinie, Grün gibt die Fahrt frei.",
            [{ title: "Department of Land Transport Thailand", url: "https://www.dlt.go.th/" }]
        ),
        makeQuestion(
            "thq-geo-033", "geography", 3, "single_choice",
            "ตั๋วรถไฟหรือตั๋วเครื่องบินในภาษาไทยเรียกว่าอะไร?",
            "Wie heißt ein Fahrschein oder Flugticket auf Thailändisch?",
            "Tua rotfai rue tua khrueangbin nai phasa Thai riak wa arai?",
            [
                ["a", "ตั๋วโดยสาร", "Fahrkarte / Ticket", "Tua doisan"],
                ["b", "บัตรประชาชน", "Personalausweis", "Bat prachachon"],
                ["c", "ใบเสร็จรับเงิน", "Quittung", "Bai set rap ngoen"],
                ["d", "สมุดจดการบ้าน", "Hausaufgabenheft", "Samut chot kanban"]
            ],
            "a",
            "'ตั๋วโดยสาร' หรือ 'ตั๋วเดินทาง' เป็นเอกสารหรือบัตรที่ใช้แสดงสิทธิ์ในการใช้บริการขนส่ง",
            "'Tua doisan' bezeichnet allgemein Fahrkarten und Tickets für Bahn, Bus oder Flugzeuge.",
            [{ title: "State Railway of Thailand", url: "https://www.railway.co.th/" }]
        ),
        makeQuestion(
            "thq-geo-034", "geography", 3, "single_choice",
            "เมื่อเดินข้ามถนนตรงจุดที่ปลอดภัย คนเดินถนนควรข้ามตรงบริเวณใด?",
            "Wo sollten Fußgänger eine Straße sicher überqueren?",
            "Muea doen kham thanon trong chut thi plotphai, khon doen thanon khuan kham trong boriwen dai?",
            [
                ["a", "ทางม้าลาย", "Zebrastreifen", "Thang ma lai"],
                ["b", "กลางทางด่วน", "Mitten auf der Autobahn", "Klang thang duan"],
                ["c", "ใต้ท้องรถบรรทุก", "Unter einem Lastwagen", "Tai thong rot banthuk"],
                ["d", "บนรางรถไฟ", "Auf den Bahngleisen", "Bon rang rotfai"]
            ],
            "a",
            "ทางม้าลายและสะพานลอยเป็นจุดข้ามถนนที่ออกแบบไว้เพื่อความปลอดภัยของคนเดินเท้า",
            "Zebrastreifen ('Thang ma lai') und Fußgängerbrücken dienen der sicheren Straßenüberquerung.",
            [{ title: "Department of Land Transport Thailand", url: "https://www.dlt.go.th/" }]
        ),
        makeQuestion(
            "thq-geo-035", "geography", 3, "single_choice",
            "คำว่า 'ป้ายรถเมล์' หมายถึงสถานที่สำหรับทำสิ่งใด?",
            "Was für ein Ort ist ein 'Pai rot me'?",
            "Kham wa 'pai rot me' maithueng sathanthi samrap tham sing dai?",
            [
                ["a", "ที่สำหรับรอขึ้นรถประจำทาง", "Bushaltestelle", "Thi samrap ro khuen rot pracham thang"],
                ["b", "ที่สำหรับจอดซ่อมรถยนต์", "Autowerkstatt", "Thi samrap chot som rotyon"],
                ["c", "ที่สำหรับล้างรถ", "Autowaschanlage", "Thi samrap lang rot"],
                ["d", "ที่สำหรับซื้อตั๋วเครื่องบิน", "Flugticket-Schalter", "Thi samrap sue tua khrueangbin"]
            ],
            "a",
            "ป้ายรถเมล์เป็นจุดจอดรับส่งผู้โดยสารของรถประจำทางตามเส้นทางที่กำหนด",
            "'Pai rot me' ist die Haltestelle für öffentliche Linienbusse.",
            [{ title: "Bangkok Mass Transit Authority", url: "https://www.bmta.co.th/" }]
        ),
        makeQuestion(
            "thq-geo-036", "geography", 3, "single_choice",
            "หากเราเดินทางไกลจากกรุงเทพฯ ไปเชียงใหม่ด้วยรถไฟตู้นอน เรามักเดินทางในเวลาใด?",
            "Zu welcher Tageszeit reist man meistens, wenn man den Nachtzug von Bangkok nach Chiang Mai nimmt?",
            "Hak rao doen thang klai chak Krung Thep pai Chiang Mai duai rotfai tu non, rao mak doen thang nai wela dai?",
            [
                ["a", "กลางคืน", "Nachts", "Klangkhuen"],
                ["b", "เที่ยงวัน", "Mittags", "Thiang wan"],
                ["c", "ตอนเช้าตรู่เท่านั้น", "Nur am frühen Morgen", "Ton chao tru thaonan"],
                ["d", "บ่ายสองโมง", "Um 14:00 Uhr", "Bai song mong"]
            ],
            "a",
            "รถไฟตู้นอนเป็นที่นิยมมากในการเดินทางข้ามคืน โดยผู้โดยสารสามารถนอนพักผ่อนและถึงเชียงใหม่ในเช้าวันรุ่งขึ้น",
            "Der Schlafwagenzug fährt abends in Bangkok ab und erreicht Chiang Mai nach einer Nachtfahrt am Morgen.",
            [{ title: "State Railway of Thailand", url: "https://www.railway.co.th/" }]
        ),
        makeQuestion(
            "thq-geo-037", "geography", 3, "single_choice",
            "ก่อนขึ้นเครื่องบิน ผู้โดยสารต้องนำสัมภาระไปทำสิ่งใดที่เคาน์เตอร์สายการบิน?",
            "Was müssen Passagiere vor dem Flug mit ihrem Hauptgepäck am Check-in-Schalter tun?",
            "Kon khuen khrueangbin, phu doisan tong nam samphara pai tham sing dai thi khaontoe saikanbin?",
            [
                ["a", "เช็คอินและโหลดกระเป๋า", "Einchecken und aufgeben", "Chek-in lae lot krapao"],
                ["b", "นำไปทิ้งในถังขยะ", "In den Müll werfen", "Nam pai thing nai thang khaya"],
                ["c", "เปิดแจกสิ่งของให้ผู้อื่น", "An andere Passagiere verschenken", "Poet chaek singkhong hai phu uen"],
                ["d", "ซักทำความสะอาด", "Waschen", "Sak tham khwam saat"]
            ],
            "a",
            "ผู้โดยสารต้องเช็คอินบัตรที่นั่งและชั่งน้ำหนักสัมภาระเพื่อส่งลงใต้ท้องเครื่องบิน",
            "Am Check-in-Schalter werden Bordkarten ausgestellt und Koffer für den Frachtraum aufgegeben.",
            [{ title: "Airports of Thailand", url: "https://www.mot.go.th/" }]
        ),
        makeQuestion(
            "thq-geo-038", "geography", 3, "single_choice",
            "ในประเทศไทย ยานพาหนะต้องขับชิดช่องทางด้านใดของถนน?",
            "Auf welcher Straßenseite fahren Fahrzeuge in Thailand (Links- oder Rechtsverkehr)?",
            "Nai prathet Thai, yan phahana tong khap chit chongthang dan dai khong thanon?",
            [
                ["a", "ชิดซ้าย", "Linksverkehr", "Chit sai"],
                ["b", "ชิดขวา", "Rechtsverkehr", "Chit khwa"],
                ["c", "ขับตรงกลางถนน", "In der Straßenmitte", "Khap trong klang thanon"],
                ["d", "ขับด้านใดก็ได้ตามใจชอบ", "Freie Wahl je nach Lust", "Khap dan dai kodai tamchai chop"]
            ],
            "a",
            "ประเทศไทยใช้ระบบการจราจรทางซ้ายมือ พวงมาลัยของรถยนต์จึงติดตั้งอยู่ทางด้านขวา",
            "Thailand hat Linksverkehr; das Lenkrad der Fahrzeuge befindet sich auf der rechten Seite.",
            [{ title: "Department of Land Transport Thailand", url: "https://www.dlt.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-019", "nature", 3, "single_choice",
            "ถ้าเรารู้สึกปวดหัวและมีไข้สูง เราควรรับประทานสิ่งใดเพื่อบรรเทาอาการ?",
            "Was nehmen wir zur Linderung, wenn wir Kopfschmerzen und hohes Fieber haben?",
            "Tha rao rusuek puat hua lae mi khai sung, rao khuan rap prathan sing dai phuea banthao akan?",
            [
                ["a", "ยาลดไข้", "Fiebersenkende Medizin", "Ya lot khai"],
                ["b", "น้ำแข็งใส", "Kratzeis mit Sirup", "Namkhaeng sai"],
                ["c", "ขนมหวาน", "Süßigkeiten", "Khanom wan"],
                ["d", "น้ำอัดลม", "Kohlensäurehaltige Limonade", "Nam at lom"]
            ],
            "a",
            "ยาลดไข้ เช่น ยาพาราเซตามอล ช่วยบรรเทาอาการปวดศีรษะและลดอุณหภูมิร่างกาย",
            "Fiebersenkende Schmerzmittel wie Paracetamol helfen gegen Kopfweh und senken die Temperatur.",
            [{ title: "Ministry of Public Health Thailand", url: "https://www.moph.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-020", "nature", 3, "single_choice",
            "เมื่อเราไม่สบายหนักและต้องการให้แพทย์ตรวจรักษา เราต้องไปที่ไหน?",
            "Wohin gehen wir, wenn wir ernsthaft krank sind und ärztliche Untersuchung brauchen?",
            "Muea rao mai sabai nak lae tongkan hai phaet truat raksa, rao tong pai thi nai?",
            [
                ["a", "โรงพยาบาล", "Krankenhaus", "Rongphayaban"],
                ["b", "โรงแรม", "Hotel", "Rongraem"],
                ["c", "พิพิธภัณฑ์", "Museum", "Phiphitthaphan"],
                ["d", "สนามมวย", "Boxstadion", "Sanam muai"]
            ],
            "a",
            "โรงพยาบาลหรือคลินิกมีแพทย์และเครื่องมือทางการแพทย์สำหรับตรวจวินิจฉัยและรักษาผู้ป่วย",
            "Ein Krankenhaus (Rongphayaban) bietet ärztliche Versorgung und Notfallbehandlung.",
            [{ title: "Ministry of Public Health Thailand", url: "https://www.moph.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-021", "nature", 3, "single_choice",
            "อวัยวะใดของร่างกายที่ใช้สำหรับมองเห็นสิ่งต่างๆ รอบตัว?",
            "Welches Sinnesorgan benutzen wir, um Dinge um uns herum zu sehen?",
            "Awaiyawa dai khong rangkai thi chai samrap mong hen sing tang tang rop tua?",
            [
                ["a", "ตา", "Auge", "Ta"],
                ["b", "หู", "Ohr", "Hu"],
                ["c", "จมูก", "Nase", "Chamuk"],
                ["d", "ลิ้น", "Zunge", "Lin"]
            ],
            "a",
            "ดวงตาเป็นอวัยวะรับภาพ หูใช้ฟังเสียง จมูกใช้ดมกลิ่น และลิ้นใช้รับรส",
            "Die Augen dienen dem Sehen, die Ohren dem Hören und die Zunge dem Schmecken.",
            [{ title: "Royal Society of Thailand – Anatomy", url: "https://dictionary.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-022", "nature", 3, "single_choice",
            "ถ้าเราเดินสะดุดหกล้มจนหัวเข่ามีแผลถลอก เราควรใช้อะไรทำความสะอาดแผล?",
            "Was benutzt man, um eine Schürfwunde am Knie zu desinfizieren und zu reinigen?",
            "Tha rao doen sadut hoklom chon hua khao mi phlae thalok, rao khuan chai arai tham khwam saat phlae?",
            [
                ["a", "น้ำยาฆ่าเชื้อหรือแอลกอฮอล์ล้างแผล", "Wunddesinfektionsmittel / Alkohol", "Namya kha chuea"],
                ["b", "น้ำปลา", "Fischsauce", "Nampla"],
                ["c", "น้ำมันพืช", "Pflanzenöl", "Namman phuet"],
                ["d", "น้ำตาลทราย", "Kristallzucker", "Namtan sai"]
            ],
            "a",
            "น้ำเกลือล้างแผลและน้ำยาฆ่าเชื้อช่วยทำความสะอาดแผลและป้องกันการติดเชื้อแบคทีเรีย",
            "Wundspüllösung und Desinfektionsmittel reinigen die Wunde und schützen vor Infektionen.",
            [{ title: "Department of Health Thailand", url: "https://anamai.moph.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-023", "nature", 3, "single_choice",
            "ประโยคที่ว่า 'ฉันปวดท้อง' มีความหมายตรงกับอาการใด?",
            "Was bedeutet der thailändische Satz 'Chan puat thong'?",
            "Prayok thi wa 'chan puat thong' mi khwammai trong kap akan dai?",
            [
                ["a", "Ich habe Bauchschmerzen", "Ich habe Bauchschmerzen", "Chan puat thong"],
                ["b", "Ich habe Halsschmerzen", "Ich habe Halsschmerzen", "Chan chep kho"],
                ["c", "Ich habe Zahnschmerzen", "Ich habe Zahnschmerzen", "Chan puat fan"],
                ["d", "Mein Bein tut weh", "Mein Bein tut weh", "Chan chep kha"]
            ],
            "a",
            "'ปวดท้อง' หมายถึงความรู้สึกเจ็บปวดบริเวณช่องท้อง ซึ่งอาจเกิดจากโรคกระเพาะหรืออาหารไม่ย่อย",
            "'Chan puat thong' bedeutet wörtlich 'Ich schmerze Bauch' = Ich habe Bauchschmerzen.",
            [{ title: "Royal Society of Thailand", url: "https://www.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-024", "nature", 3, "single_choice",
            "สิ่งใดที่เราควรทำทุกวันเพื่อรักษาสุขภาพฟันให้แข็งแรงและไม่มีกลิ่นปาก?",
            "Was sollten wir täglich tun, um gesunde Zähne und frischen Atem zu behalten?",
            "Sing dai thi rao khuan tham thuk wan phuea raksa sukkhaphap fan hai khaengraeng lae mai mi klin pak?",
            [
                ["a", "แปรงฟันอย่างน้อยวันละสองครั้ง", "Zweimal täglich Zähne putzen", "Praeng fan yang noi wan la song khrang"],
                ["b", "กินลูกอมรสหวานก่อนนอน", "Süße Bonbons vor dem Schlafen essen", "Kin luk-om rot wan kon non"],
                ["c", "ดื่มน้ำอัดลมมากๆ", "Viel Limonade trinken", "Duem nam at lom mak mak"],
                ["d", "เคี้ยวน้ำแข็งก้อนใหญ่", "Große Eiswürfel kauen", "Khiao namkhaeng kon yai"]
            ],
            "a",
            "การแปรงฟันตอนเช้าและก่อนนอนช่วยขจัดคราบจุลินทรีย์และป้องกันฟันผุได้อย่างมีประสิทธิภาพ",
            "Zweimal tägliches Zähneputzen entfernt Plaque und schützt vor Karies und Mundgeruch.",
            [{ title: "Department of Health Thailand – Dental Health", url: "https://anamai.moph.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-025", "nature", 3, "single_choice",
            "เมื่อรู้สึกกระหายน้ำในวันที่อากาศร้อนจัด ร่างกายของเราต้องการสิ่งใดมากที่สุด?",
            "Was braucht der Körper an heißen Tagen am dringendsten, wenn man Durst hat?",
            "Muea rusuek krahai nam nai wan thi akat ron chat, rangkai khong rao tongkan sing dai mak thi sut?",
            [
                ["a", "น้ำดื่มสะอาด", "Sauberes Trinkwasser", "Nam duem saat"],
                ["b", "กาแฟร้อนจัด", "Kochend heißen Kaffee", "Kafae ron chat"],
                ["c", "ขนมเค้ก", "Torte", "Khanom khek"],
                ["d", "อาหารรสเค็มจัด", "Sehr salziges Essen", "Ahan rot khem chat"]
            ],
            "a",
            "น้ำดื่มสะอาดช่วยชดเชยเหงื่อที่สูญเสียไปและช่วยรักษาอุณหภูมิร่างกายให้เป็นปกติ",
            "Trinkwasser gleicht den Flüssigkeitsverlust aus und verhindert Überhitzung an heißen Tagen.",
            [{ title: "Ministry of Public Health Thailand", url: "https://www.moph.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-026", "nature", 3, "single_choice",
            "บุคคลที่มีหน้าที่ตรวจฟันและอุดฟันให้คนไข้เรียกว่าอะไร?",
            "Wie heißt die medizinische Fachkraft, die Zähne untersucht und behandelt?",
            "Bukhon thi mi nathi truat fan lae ut fan hai khonkhai riak wa arai?",
            [
                ["a", "ทันตแพทย์ / หมอฟัน", "Zahnarzt", "Thantaphaet / Mo fan"],
                ["b", "สัตวแพทย์", "Tierarzt", "Sattawaphaet"],
                ["c", "เภสัชกร", "Apotheker", "Phesatchakon"],
                ["d", "พยาบาลแผนกเด็ก", "Kinderkrankenschwester", "Phayaban phanaek dek"]
            ],
            "a",
            "ทันตแพทย์เป็นแพทย์ผู้เชี่ยวชาญด้านการดูแลรักษาโรคในช่องปากและฟัน",
            "Der Zahnarzt ('Mo fan') behandelt Karies, Zahnfleischprobleme und Zahnschmerzen.",
            [{ title: "Royal Society of Thailand – Dictionary", url: "https://dictionary.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-027", "nature", 3, "single_choice",
            "คำว่า 'แข็งแรง' ในภาษาไทยใช้บรรยายลักษณะของสิ่งใด?",
            "Was beschreibt das Wort 'Khaeng-raeng' (แข็งแรง) in der Regel?",
            "Kham wa 'khaengraeng' nai phasa Thai chai banyai laksana khong sing dai?",
            [
                ["a", "สุขภาพร่างกายที่ดีและมีกำลัง", "Körperliche Gesundheit und Kraft", "Sukkhaphap rangkai thi di"],
                ["b", "ความเศร้าโศกเสียใจ", "Traurigkeit", "Khwam sao sok sia chai"],
                ["c", "ความง่วงนอน", "Müdigkeit", "Khwam nguang non"],
                ["d", "รสชาติของอาหาร", "Geschmack von Speisen", "Rotchat khong ahan"]
            ],
            "a",
            "'แข็งแรง' หมายถึงมีสุขภาพดี ไม่อ่อนแอ มีกำลังวังชาในการทำกิจกรรมต่างๆ",
            "'Khaeng-raeng' bedeutet fit, kräftig, gesund und widerstandsfähig.",
            [{ title: "Royal Society of Thailand – Dictionary", url: "https://dictionary.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-028", "nature", 3, "single_choice",
            "เพื่อป้องกันการแพร่กระจายของเชื้อโรคเวลาไอหรือจาม เราควรทำอย่างไร?",
            "Was sollten wir beim Husten oder Niesen tun, um andere vor Krankheitserregern zu schützen?",
            "Phuea pongkan kan phraekrachai khong chuea rok wela ai rue cham, rao khuan tham yangrai?",
            [
                ["a", "ใช้ทิชชูหรือข้อศอกปิดปากและจมูก", "Mund und Nase mit Taschentuch oder Ellbeuge bedecken", "Chai thitchu rue kho sok pit pak"],
                ["b", "ไอใส่หน้าผู้อื่น", "Anderen ins Gesicht husten", "Ai sai na phu uen"],
                ["c", "อ้าปากให้กว้างที่สุด", "Den Mund weit aufreißen", "A pak hai kwang thi sut"],
                ["d", "หลับตาทันที", "Sofort die Augen schließen", "Lap ta thanthi"]
            ],
            "a",
            "การใช้กระดาษทิชชูหรือข้อศอกด้านในปิดปากขณะไอหรือจามช่วยลดการแพร่กระจายของละอองฝอยเชื้อโรค",
            "Husten in ein Tuch oder die Ellenbeuge verhindert die Ausbreitung von Tröpfcheninfektionen.",
            [{ title: "Department of Disease Control Thailand", url: "https://ddc.moph.go.th/" }]
        ),
        makeQuestion(
            "thq-cul-029", "culture", 3, "single_choice",
            "เทศกาลสงกรานต์ตรงกับเดือนใดของทุกปี?",
            "In welchen Monat fällt das Songkran-Fest jedes Jahr?",
            "Thetsakan Songkran trong kap duean dai khong thuk pi?",
            [
                ["a", "เดือนเมษายน", "April", "Duean mesayon"],
                ["b", "เดือนมกราคม", "Januar", "Duean mokkarakhom"],
                ["c", "เดือนสิงหาคม", "August", "Duean singhakhom"],
                ["d", "เดือนธันวาคม", "Dezember", "Duean thanwakhom"]
            ],
            "a",
            "เทศกาลสงกรานต์หรือปีใหม่ไทยจัดขึ้นระหว่างวันที่ 13-15 เมษายนของทุกปี",
            "Songkran, das traditionelle Neujahrsfest, findet alljährlich vom 13. bis 15. April statt.",
            [{ title: "Tourism Authority of Thailand – Songkran", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-cul-030", "culture", 3, "single_choice",
            "สิ่งใดเป็นสัญลักษณ์สำคัญที่ผู้คนนิยมทำในวันลอยกระทง?",
            "Was ist das zentrale Ritual am Loy-Krathong-Fest?",
            "Sing dai pen sanyalak samkhan thi phu khon niyom tham nai wan Loi Krathong?",
            [
                ["a", "ลอยกระทงใบตองลงในแม่น้ำ", "Bananenblatt-Schiffchen aufs Wasser setzen", "Loi krathong bai tong long nai maenam"],
                ["b", "สาดน้ำใส่กันบนถนน", "Wasserschlachten auf den Straßen", "Sat nam sai kan bon thanon"],
                ["c", "แห่นางแมวรอบหมู่บ้าน", "Katzen-Prozession durchs Dorf", "Hae nang maeo rop muban"],
                ["d", "ปิดไฟทั้งเมือง", "Die ganze Stadt verdunkeln", "Pit fai thang mueang"]
            ],
            "a",
            "ในคืนวันเพ็ญเดือน 12 ผู้คนจะนำกระทงดอกไม้จุดธูปเทียนไปลอยในแม่น้ำเพื่อขอขมาพระแม่คงคา",
            "Beim Loy-Krathong-Fest werden geschmückte Schiffchen auf Flüssen und Teichen treiben gelassen.",
            [{ title: "Tourism Authority of Thailand – Loy Krathong", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-cul-031", "culture", 3, "single_choice",
            "เมื่อคนไทยพบเจอกันหรือกล่าวลา ท่าทางทักทายที่สุภาพเรียกว่าอะไร?",
            "Wie heißt die traditionelle thailändische Begrüßungs- und Verabschiedungsgeste?",
            "Muea khon Thai phop choe kan rue klao la, thathang thakthai thi suphap riak wa arai?",
            [
                ["a", "การไหว้", "Der Wai", "Kan wai"],
                ["b", "การจับมือแบบตะวันตก", "Händeschütteln", "Kan chap mue"],
                ["c", "การโค้งคำนับแบบญี่ปุ่น", "Japanische Verbeugung", "Kan khong khamnap"],
                ["d", "การกอดทักทาย", "Umarmung", "Kan kot thakthai"]
            ],
            "a",
            "การไหว้เป็นการพนมมือระดับอกหรือใบหน้า เป็นเอกลักษณ์แสดงความเคารพและการทักทายของไทย",
            "Der Wai ist die universelle thailändische Geste der Begrüßung, des Danks und des Respekts.",
            [{ title: "Ministry of Culture Thailand – Thai Wai", url: "https://www.m-culture.go.th/" }]
        ),
        makeQuestion(
            "thq-cul-032", "culture", 3, "single_choice",
            "พระสงฆ์ในประเทศไทยสวมใส่เครื่องนุ่งห่มที่มีสีอะไรเป็นหลัก?",
            "Welche Farbe hat die Mönchsrobe (Chi-won) in Thailand traditionell?",
            "Phra song nai prathet Thai suam sai khrueang nunghom thi mi si arai pen lak?",
            [
                ["a", "สีส้มหรือสีเหลืองทอง", "Orange oder Safrangelb", "Si som rue si lueang thong"],
                ["b", "สีขาวบริสุทธิ์", "Reinweiß", "Si khao borisut"],
                ["c", "สีดำสนิท", "Tiefschwarz", "Si dam sanit"],
                ["d", "สีเขียวมรกต", "Smaragdgrün", "Si khiao morakot"]
            ],
            "a",
            "จีวรของพระสงฆ์นิกายเถรวาทในไทยย้อมด้วยสีเหลืองส้ม กรัก หรือเหลืองทองตามพระวินัย",
            "Buddhistische Mönche in Thailand tragen Gewänder in warmen Safran-, Ocker- und Orangetönen.",
            [{ title: "National Office of Buddhism Thailand", url: "https://www.onab.go.th/" }]
        ),
        makeQuestion(
            "thq-cul-033", "culture", 3, "single_choice",
            "ก่อนก้าวเท้าเข้าไปในอุโบสถวัดหรือในบ้านของคนไทย สิ่งสำคัญที่ต้องทำคืออะไร?",
            "Was muss man unbedingt tun, bevor man einen Tempelinnenraum oder ein Thai-Wohnhaus betritt?",
            "Kon kao thao khao pai nai ubosot wat rue nai ban khong khon Thai, sing samkhan thi tong tham khue arai?",
            [
                ["a", "ถอดรองเท้า", "Schuhe ausziehen", "Thot rongthao"],
                ["b", "สวมหมวก", "Einen Hut aufsetzen", "Suam muak"],
                ["c", "ปรบมือเสียงดัง", "Laut klatschen", "Prop mue siang dang"],
                ["d", "ดื่มน้ำหนึ่งแก้ว", "Ein Glas Wasser trinken", "Duem nam nueng kaeo"]
            ],
            "a",
            "การถอดรองเท้าก่อนเข้าบ้านหรือศาสนสถานแสดงถึงความเคารพและรักษาความสะอาดของสถานที่",
            "Das Ausziehen der Straßenschuhe vor Wohnungen und Tempelräumen ist ein Gebot der Höflichkeit.",
            [{ title: "Ministry of Culture Thailand – Cultural Etiquette", url: "https://www.m-culture.go.th/" }]
        ),
        makeQuestion(
            "thq-cul-034", "culture", 3, "single_choice",
            "การตักบาตรในตอนเช้าเป็นการทำบุญโดยถวายสิ่งใดแก่พระสงฆ์?",
            "Was spendet man buddhistischen Mönchen morgens beim traditionellen Tak Bat?",
            "Kan tak bat nai ton chao pen kan tham bun doi thawai sing dai kae phra song?",
            [
                ["a", "ข้าวและอาหารปรุงสุก", "Gekochten Reis und Speisen", "Khao lae ahan prung suk"],
                ["b", "เสื้อผ้าแฟชั่น", "Modische Kleidung", "Suea pha faechan"],
                ["c", "เงินสดใส่ในบาตร", "Bargeld direkt in die Almosenschale", "Ngoen sot sai nai bat"],
                ["d", "ของเล่นเด็ก", "Kinderspielzeug", "Khong len dek"]
            ],
            "a",
            "ชาวพุทธนิยมตักบาตรด้วยข้าวสุก กับข้าว ผลไม้ และน้ำดื่ม เพื่อค้ำจุนพระภิกษุสงฆ์",
            "Beim morgendlichen Tak Bat spendet man Reis und frisch zubereitete Mahlzeiten an die Mönche.",
            [{ title: "National Office of Buddhism Thailand", url: "https://www.onab.go.th/" }]
        ),
        makeQuestion(
            "thq-cul-035", "culture", 3, "single_choice",
            "สัตว์ประจำชาติที่เป็นสัญลักษณ์คู่บ้านคู่เมืองของประเทศไทยมายาวนานคือสัตว์ชนิดใด?",
            "Welches Tier ist das historische Wappentier und Nationalsymbol Thailands?",
            "Sat pracham chat thi pen sanyalak khu ban khu mueang khong prathet Thai ma yaonan khue sat chanit dai?",
            [
                ["a", "ช้างไทย", "Thailändischer Elefant", "Chang Thai"],
                ["b", "เสือโคร่ง", "Tiger", "Suea khrong"],
                ["c", "ม้าลาย", "Zebra", "Ma lai"],
                ["d", "นกเพนกวิน", "Pinguin", "Nok phengwin"]
            ],
            "a",
            "ช้างไทยเป็นสัตว์ประจำชาติที่มีความสำคัญทางประวัติศาสตร์ ทั้งการศึกสงครามและวิถีชีวิต",
            "Der asiatische Elefant (Chang Thai) ist das offizielle und verehrte Nationaltier Thailands.",
            [{ title: "Royal Society of Thailand", url: "https://www.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-cul-036", "culture", 3, "single_choice",
            "ดอกไม้ที่มีความผูกพันลึกซึ้งกับพุทธศาสนาและนิยมนำมาไหว้พระคือดอกอะไร?",
            "Welche Blume ist tief mit dem Buddhismus verwurzelt und wird oft am Altar dargebracht?",
            "Dokmai thi mi khwam phukphan lueksueng kap phuttha satsana lae niyom nam ma wai phra khue dok arai?",
            [
                ["a", "ดอกบัว", "Lotusblüte", "Dok bua"],
                ["b", "ดอกกุหลาบ", "Rose", "Dok kulap"],
                ["c", "ดอกทานตะวัน", "Sonnenblume", "Dok than tawan"],
                ["d", "ดอกทิวลิป", "Tulpe", "Dok thiu-lip"]
            ],
            "a",
            "ดอกบัวเป็นสัญลักษณ์ของความบริสุทธิ์และการตื่นรู้ นิยมพับกลีบอย่างประณีตเพื่อนำไปบูชาพระพุทธรูป",
            "Die Lotusblüte symbolisiert spirituelle Reinheit und Erleuchtung im Buddhismus.",
            [{ title: "Tourism Authority of Thailand – Temple Culture", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-cul-037", "culture", 3, "single_choice",
            "ขนมหวานมงคลของไทยที่ทำจากไข่แดงและน้ำตาล เช่น ทองหยิบ ทองหยอด มีสีอะไร?",
            "Welche Farbe haben traditionelle glückbringende Süßigkeiten wie Thong Yip und Thong Yot?",
            "Khanom wan mongkhon khong Thai thi tham chak khai daeng lae namtan chen thong yip thong yot mi si arai?",
            [
                ["a", "สีเหลืองทอง", "Goldgelb", "Si lueang thong"],
                ["b", "สีเขียวเข้ม", "Dunkelgrün", "Si khiao khem"],
                ["c", "สีฟ้าสดใส", "Hellblau", "Si fa sotsai"],
                ["d", "สีม่วง", "Lila", "Si muang"]
            ],
            "a",
            "ขนมตระกูลทองทำจากไข่เป็ด มีสีเหลืองทองอร่าม สื่อถึงความร่ำรวยและสิริมงคลในงานพิธี",
            "Die traditionellen Desserts Thong Yip und Thong Yot leuchten goldgelb und symbolisieren Wohlstand.",
            [{ title: "Tourism Authority of Thailand – Auspicious Desserts", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-cul-038", "culture", 3, "single_choice",
            "วันแม่แห่งชาติของประเทศไทยตรงกับวันที่เท่าไรในเดือนสิงหาคม?",
            "An welchem Tag im August wird in Thailand der nationale Muttertag gefeiert?",
            "Wan mae haeng chat khong prathet Thai trong kap wan thi thao rai nai duean singhakhom?",
            [
                ["a", "วันที่ 12 สิงหาคม", "12. August", "Wan thi sip song singhakhom"],
                ["b", "วันที่ 1 สิงหาคม", "1. August", "Wan thi nueng singhakhom"],
                ["c", "วันที่ 25 สิงหาคม", "25. August", "Wan thi yi sip ha singhakhom"],
                ["d", "วันที่ 31 สิงหาคม", "31. August", "Wan thi sam sip et singhakhom"]
            ],
            "a",
            "วันที่ 12 สิงหาคมเป็นวันเฉลิมพระชนมพรรษาสมเด็จพระบรมราชชนนีพันปีหลวง และกำหนดให้เป็นวันแม่แห่งชาติ",
            "Am 12. August feiert Thailand den Nationalen Muttertag zu Ehren von Königinmutter Sirikit.",
            [{ title: "Royal Society of Thailand", url: "https://www.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-029", "nature", 3, "single_choice",
            "ประเทศไทยมีทั้งหมดกี่ฤดูกาลตามสภาพภูมิอากาศทั่วไป?",
            "Wie viele Jahreszeiten unterscheidet man in Thailand üblicherweise?",
            "Prathet Thai mi thangmot ki rudukan tam saphap phumi-akat thua pai?",
            [
                ["a", "3 ฤดู", "3 Jahreszeiten (Heiß, Regen, Kühl)", "Sam rudu"],
                ["b", "4 ฤดู", "4 Jahreszeiten", "Si rudu"],
                ["c", "2 ฤดู", "2 Jahreszeiten", "Song rudu"],
                ["d", "ฤดูเดียวตลอดปี", "1 Jahreszeit", "Rudu diao talot pi"]
            ],
            "a",
            "ประเทศไทยโดยทั่วไปมี 3 ฤดู คือ ฤดูร้อน (มี.ค.-พ.ค.) ฤดูฝน (มิ.ย.-ต.ค.) และฤดูหนาว (พ.ย.-ก.พ.)",
            "In Thailand gibt es 3 Jahreszeiten: die heiße Zeit, die Regenzeit und die kühlere Trockenzeit.",
            [{ title: "Thai Meteorological Department – Climate of Thailand", url: "https://www.tmd.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-030", "nature", 3, "single_choice",
            "ช่วงเดือนที่มีอากาศร้อนจัดที่สุดในประเทศไทยมักตรงกับช่วงเดือนใด?",
            "Welcher Monat ist im Jahresverlauf typischerweise der heißeste in Thailand?",
            "Chuang duean thi mi akat ron chat thi sut nai prathet Thai mak trong kap chuang duean dai?",
            [
                ["a", "เดือนเมษายน", "April", "Duean mesayon"],
                ["b", "เดือนธันวาคม", "Dezember", "Duean thanwakhom"],
                ["c", "เดือนกรกฎาคม", "Juli", "Duean karakkadakhom"],
                ["d", "เดือนมกราคม", "Januar", "Duean mokkarakhom"]
            ],
            "a",
            "เดือนเมษายนเป็นช่วงที่ดวงอาทิตย์ตั้งฉากกับประเทศไทย ทำให้อุณหภูมิสูงที่สุดในรอบปี",
            "Der April ist vor Beginn der Regenzeit der heißeste Monat mit oft über 38-40 Grad Celsius.",
            [{ title: "Thai Meteorological Department", url: "https://www.tmd.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-031", "nature", 3, "single_choice",
            "คำว่า 'ฝนตกหนัก' หมายถึงสภาพอากาศแบบใด?",
            "Was bedeutet die Wetterbeschreibung 'Fon tok nak'?",
            "Kham wa 'fon tok nak' maithueng saphap akat baep dai?",
            [
                ["a", "Starker Regen (Es regnet heftig)", "Starker Regen (Es regnet heftig)", "Fon tok nak"],
                ["b", "Starker Schneefall", "Starker Schneefall", "Hima tok nak"],
                ["c", "Strahlender Sonnenschein", "Strahlender Sonnenschein", "Daet ok chat"],
                ["d", "Völlige Windstille", "Völlige Windstille", "Lom sangop"]
            ],
            "a",
            "'ฝนตกหนัก' หมายถึงมีปริมาณน้ำฝนตกลงมาอย่างหนาแน่นและรวดเร็ว",
            "'Fon tok nak' beschreibt heftige Regenschauer, wie sie im Monsun häufig auftreten.",
            [{ title: "Thai Meteorological Department", url: "https://www.tmd.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-032", "nature", 3, "single_choice",
            "สถานที่ท่องเที่ยวทางธรรมชาติที่น้ำตกลงมาจากหน้าผาสูงเรียกว่าอะไร?",
            "Wie heißt ein Naturort, an dem Wasser von einer hohen Felswand herabstürzt?",
            "Sathanthi thongthiao thang thammachat thi nam tok long ma chak na pha sung riak wa arai?",
            [
                ["a", "น้ำตก", "Wasserfall", "Namtok"],
                ["b", "ภูเขาไฟ", "Vulkan", "Phukhao fai"],
                ["c", "ทะเลทราย", "Wüste", "Thale sai"],
                ["d", "ทุ่งนา", "Reisfeld", "Thung na"]
            ],
            "a",
            "น้ำตก เช่น น้ำตกเอราวัณ เป็นแหล่งท่องเที่ยวทางธรรมชาติที่มีสายน้ำไหลตกลงมาจากที่สูง",
            "Ein Wasserfall ('Namtok') stürzt über Felsstufen herab und ist ein beliebtes Ausflugsziel.",
            [{ title: "Department of National Parks Thailand", url: "https://www.dnp.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-033", "nature", 3, "single_choice",
            "ทะเลทางภาคใต้ของไทยที่มีชื่อเสียง เช่น ภูเก็ต และกระบี่ อยู่ติดกับทะเลฝั่งใด?",
            "An welchem Meer liegen beliebte Urlaubsziele wie Phuket und Krabi?",
            "Thale thang phak tai khong Thai thi mi chuesiang chen Phuket lae Krabi yu tit kap thale fang dai?",
            [
                ["a", "ทะเลอันดามัน", "Andamanensee", "Thale Andaman"],
                ["b", "ทะเลเมดิเตอร์เรเนียน", "Mittelmeer", "Thale Meditœrenian"],
                ["c", "ทะเลบอลติก", "Ostsee", "Thale Boltik"],
                ["d", "ทะเลแดง", "Rotes Meer", "Thale Daeng"]
            ],
            "a",
            "ภูเก็ต พังงา และกระบี่ ตั้งอยู่เลียบชายฝั่งทะเลอันดามันทางฝั่งตะวันตกของภาคใต้",
            "Phuket und Krabi liegen an der Andamanensee, einem Nebenmeer des Indischen Ozeans.",
            [{ title: "Tourism Authority of Thailand – Andaman Sea", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-nat-034", "nature", 3, "single_choice",
            "สัตว์เลื้อยคลานขนาดใหญ่ที่มีลำตัวยาว ไม่มีขา และบางชนิดมีพิษร้ายแรงคืออะไร?",
            "Welches Reptil hat einen langen Körper, keine Beine und ist manchmal giftig?",
            "Sat lueakhlan khanat yai thi mi lamtua yao, mai mi kha, lae bang chanit mi phit rairaeng khue arai?",
            [
                ["a", "งู", "Schlange", "Ngu"],
                ["b", "จระเข้", "Krokodil", "Chorakhe"],
                ["c", "เต่า", "Schildkröte", "Tao"],
                ["d", "กิ้งก่า", "Eidechse", "Kingka"]
            ],
            "a",
            "งูเป็นสัตว์เลื้อยคลานไม่มีขา มีทั้งชนิดมีพิษ เช่น งูเห่า และไม่มีพิษ เช่น งูเหลือม",
            "Die Schlange ('Ngu') ist ein beinloser Kriecher, von dem manche Arten wie die Kobra giftig sind.",
            [{ title: "Department of National Parks Thailand – Reptiles", url: "https://www.dnp.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-035", "nature", 3, "single_choice",
            "ต้นไม้ชนิดใดที่นิยมปลูกริมชายหาดในไทยและมีลูกผลให้น้ำดื่มรสหวานหอม?",
            "Welcher typische Strandbaum trägt Früchte mit erfrischendem, süßem Wasser?",
            "Tonmai chanit dai thi niyom pluk rim chaihat nai Thai lae mi lukphon hai nam duem rot wan hom?",
            [
                ["a", "ต้นมะพร้าว", "Kokospalme", "Ton maphrao"],
                ["b", "ต้นแอปเปิ้ล", "Apfelbaum", "Ton aep-poen"],
                ["c", "ต้นสน", "Kiefer", "Ton son"],
                ["d", "ต้นไผ่", "Bambus", "Ton phai"]
            ],
            "a",
            "ต้นมะพร้าวเติบโตได้ดีริมทะเล ผลมะพร้าวน้ำหอมมีน้ำหวานสดชื่นดื่มดับกระหายได้ดี",
            "Kokospalmen säumen thailändische Strände; ihr Kokoswasser ist ein erfrischender Durstlöscher.",
            [{ title: "Department of Agriculture Thailand", url: "https://www.doa.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-036", "nature", 3, "single_choice",
            "คำว่า 'ลมพัดแรง' หมายถึงปรากฏการณ์ทางธรรมชาติใด?",
            "Was bedeutet die Formulierung 'Lom phat raeng'?",
            "Kham wa 'lom phat raeng' maithueng prakottakan thang thammachat dai?",
            [
                ["a", "Starker Wind / Es weht kräftig", "Starker Wind / Es weht kräftig", "Lom phat raeng"],
                ["b", "Es schneit sanft", "Es schneit sanft", "Hima tok bao"],
                ["c", "Die Sonne brennt heiß", "Die Sonne brennt heiß", "Daet chao"],
                ["d", "Das Wasser gefriert", "Das Wasser gefriert", "Nam klaipen namkhaeng"]
            ],
            "a",
            "'ลมพัดแรง' หมายถึงกระแสอากาศที่เคลื่อนที่ด้วยความเร็วสูง ทำให้ต้นไม้ไหวเอนหรือมีคลื่นลม",
            "'Lom phat raeng' beschreibt kräftige Windböen oder stürmischen Wind.",
            [{ title: "Thai Meteorological Department", url: "https://www.tmd.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-037", "nature", 3, "single_choice",
            "เวลาแดดร้อนจัดในเวลากลางวัน เราควรทาสิ่งใดเพื่อปกป้องผิวหนัง?",
            "Was trägt man auf die Haut auf, um sich vor intensiver Mittagssonne zu schützen?",
            "Wela daet ron chat nai wela klangwan, rao khuan tha sing dai phuea pokpong phiu nang?",
            [
                ["a", "ครีมกันแดด", "Sonnencreme", "Khrim kan daet"],
                ["b", "สบู่ก้อน", "Seife", "Sabu kon"],
                ["c", "ยาสีฟัน", "Zahnpasta", "Ya si fan"],
                ["d", "น้ำผึ้ง", "Honig", "Nam phueng"]
            ],
            "a",
            "ครีมกันแดดช่วยป้องกันรังสียูวีจากแสงแดด ไม่ให้ผิวหนังไหม้เกรียมหรือเกิดริ้วรอย",
            "Sonnencreme ('Khrim kan daet') schützt die Haut vor schädlicher UV-Strahlung und Sonnenbrand.",
            [{ title: "Department of Health Thailand", url: "https://anamai.moph.go.th/" }]
        ),
        makeQuestion(
            "thq-nat-038", "nature", 3, "single_choice",
            "สัตว์น้ำชนิดใดที่เลี้ยงลูกด้วยนม ฉลาด และชอบกระโดดเหนือน้ำในทะเล?",
            "Welches Meeressäugetier gilt als sehr intelligent und springt gern über die Wellen?",
            "Sat nam chanit dai thi liang luk duai nom, chalat, lae chop kradot nuea nam nai thale?",
            [
                ["a", "โลมา", "Delfin", "Loma"],
                ["b", "ฉลาม", "Hai", "Chalam"],
                ["c", "หมึกยักษ์", "Krake", "Muek yak"],
                ["d", "ปูม้า", "Schwimmkrabbe", "Pu ma"]
            ],
            "a",
            "โลมาเป็นสัตว์เลี้ยงลูกด้วยนมที่อาศัยอยู่ในน้ำ มีความฉลาดและมักพบว่ายน้ำเล่นตามชายฝั่งทะเลไทย",
            "Der Delfin ('Loma') ist ein intelligentes Meeressäugetier, das oft in Thailands Küstengewässern gesichtet wird.",
            [{ title: "Department of Marine and Coastal Resources Thailand", url: "https://www.dmcr.go.th/" }]
        ),
        makeQuestion(
            "thq-sport-019", "sport", 3, "single_choice",
            "คนที่ทำหน้าที่ขับเครื่องบินพาผู้โดยสารเดินทางข้ามประเทศเรียกว่าอะไร?",
            "Wie nennt man die Person, die Flugzeuge fliegt und Passagiere befördert?",
            "Khon thi tham nathi khap khrueangbin pha phu doisan doen thang kham prathet riak wa arai?",
            [
                ["a", "นักบิน", "Pilot", "Nak bin"],
                ["b", "คนขับเรือ", "Kapitän", "Khon khap ruea"],
                ["c", "ช่างซ่อมรถ", "Automechaniker", "Chang som rot"],
                ["d", "ครูสอนหนังสือ", "Lehrer", "Khru son nangsue"]
            ],
            "a",
            "นักบินมีหน้าที่ควบคุมอากาศยานให้ทำการบินได้อย่างปลอดภัยตามกฎการบิน",
            "Ein Pilot ('Nak bin') steuert das Flugzeug und bringt Passagiere sicher ans Ziel.",
            [{ title: "Civil Aviation Authority of Thailand", url: "https://www.caat.or.th/" }]
        ),
        makeQuestion(
            "thq-sport-020", "sport", 3, "single_choice",
            "บุคคลที่คอยดูแลความปลอดภัย รักษาความสงบ และจับกุมคนร้ายคือใคร?",
            "Wer sorgt für öffentliche Sicherheit, Ordnung und nimmt Kriminelle fest?",
            "Bukhon thi khoi dulae khwam plotphai, raksa khwam sangop, lae chapkum khon rai khue khrai?",
            [
                ["a", "ตำรวจ", "Polizist", "Tamruat"],
                ["b", "นักร้อง", "Sänger", "Nak rong"],
                ["c", "พ่อครัว", "Koch", "Pho khrua"],
                ["d", "คนขายผลไม้", "Obstverkäufer", "Khon khai phonlamai"]
            ],
            "a",
            "ตำรวจมีหน้าที่รักษากฎหมาย ป้องกันอาชญากรรม และให้ความช่วยเหลือแก่ประชาชน",
            "Die Polizei ('Tamruat') sorgt für öffentliche Sicherheit und Gesetzeseinhaltung.",
            [{ title: "Royal Thai Police", url: "https://www.royalthaipolice.go.th/" }]
        ),
        makeQuestion(
            "thq-sport-021", "sport", 3, "single_choice",
            "คนที่ปลูกข้าวในทุ่งนาซึ่งเป็นกระดูกสันหลังของชาติไทยเรียกว่าอะไร?",
            "Wie heißen die Reisbauern, die traditionell als das Rückgrat Thailands gelten?",
            "Khon thi pluk khao nai thung na sueng pen kraduk san lang khong chat Thai riak wa arai?",
            [
                ["a", "ชาวนา", "Reisbauer / Landwirt", "Chao na"],
                ["b", "ชาวประมง", "Fischer", "Chao pramong"],
                ["c", "ช่างตัดเสื้อ", "Schneider", "Chang tat suea"],
                ["d", "นักแสดง", "Schauspieler", "Nak sadaeng"]
            ],
            "a",
            "ชาวนาเป็นผู้ปลูกข้าวเลี้ยงดูประชากรทั้งประเทศ จึงได้รับการยกย่องเป็นกระดูกสันหลังของชาติ",
            "Reisbauern ('Chao na') pflanzen und ernten Reis und gelten symbolisch als Thailands Rückgrat.",
            [{ title: "Department of Rice Thailand", url: "https://www.ricethailand.go.th/" }]
        ),
        makeQuestion(
            "thq-sport-022", "sport", 3, "single_choice",
            "ผู้เชี่ยวชาญด้านการปรุงอาหารอร่อยในภัตตาคารหรือร้านอาหารเรียกว่าอะไร?",
            "Wie nennt man eine Fachperson, die Speisen in Restaurants meisterhaft zubereitet?",
            "Phu chiaochan dan kan prung ahan aroi nai phattakhan rue ran ahan riak wa arai?",
            [
                ["a", "พ่อครัวหรือเชฟ", "Koch / Chefkoch", "Pho khrua / Chef"],
                ["b", "ช่างไม้", "Tischler", "Chang mai"],
                ["c", "นักดับเพลิง", "Feuerwehrmann", "Nak dap phloeng"],
                ["d", "สัตวแพทย์", "Tierarzt", "Sattawaphaet"]
            ],
            "a",
            "พ่อครัว แม่ครัว หรือเชฟ มีทักษะในการเลือกสรรวัตถุดิบและปรุงอาหารให้อร่อยถูกสุขลักษณะ",
            "Ein Koch ('Pho khrua') kreiert Speisen und leitet die Küchenabläufe im Restaurant.",
            [{ title: "Department of Skill Development Thailand", url: "https://www.dsd.go.th/" }]
        ),
        makeQuestion(
            "thq-sport-023", "sport", 3, "single_choice",
            "คนที่ทำหน้าที่สอนหนังสือและให้ความรู้แก่นักเรียนในโรงเรียนคือใคร?",
            "Wer unterrichtet Schüler und vermittelt Wissen an Schulen?",
            "Khon thi tham nathi son nangsue lae hai khwamru kae nakrian nai rongrian khue khrai?",
            [
                ["a", "คุณครู", "Lehrer", "Khun khru"],
                ["b", "ทนายความ", "Rechtsanwalt", "Thanayakhwam"],
                ["c", "สถาปนิก", "Architekt", "Sathapanik"],
                ["d", "ช่างตัดผม", "Friseur", "Chang tat phom"]
            ],
            "a",
            "ครูอาจารย์เป็นผู้ถ่ายทอดวิชาความรู้ ปลูกฝังคุณธรรม และอบรมสั่งสอนเด็กๆ",
            "Lehrer ('Khru') unterrichten an Schulen und begleiten Schüler auf ihrem Bildungsweg.",
            [{ title: "Ministry of Education Thailand", url: "https://www.moe.go.th/" }]
        ),
        makeQuestion(
            "thq-sport-024", "sport", 3, "single_choice",
            "เมื่อต้องการตัดผมเปลี่ยนทรงผมใหม่ เราต้องไปพบใคร?",
            "Wen suchen wir auf, wenn wir uns die Haare schneiden lassen möchten?",
            "Muea tongkan tat phom plian song phom mai, rao tong pai phop khrai?",
            [
                ["a", "ช่างตัดผม", "Friseur", "Chang tat phom"],
                ["b", "ช่างไฟฟ้า", "Elektriker", "Chang faifa"],
                ["c", "บุรุษไปรษณีย์", "Briefträger", "Burut praisani"],
                ["d", "หมอฟัน", "Zahnarzt", "Mo fan"]
            ],
            "a",
            "ช่างตัดผมให้บริการตัด สระ ซอย และจัดแต่งทรงผมให้ดูเรียบร้อยสวยงาม",
            "Ein Friseur ('Chang tat phom') schneidet und stylt Haare im Salon.",
            [{ title: "Royal Society of Thailand", url: "https://www.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-sport-025", "sport", 3, "single_choice",
            "คนที่ออกไปจับปลาในทะเลเพื่อนำมาขายที่ตลาดสดเรียกว่าอะไร?",
            "Wie nennt man Personen, die aufs Meer fahren, um Fische für den Markt zu fangen?",
            "Khon thi ok pai chap pla nai thale phuea nam ma khai thi talat sot riak wa arai?",
            [
                ["a", "ชาวประมง", "Fischer", "Chao pramong"],
                ["b", "คนสวน", "Gärtner", "Khon suan"],
                ["c", "นักบิน", "Pilot", "Nak bin"],
                ["d", "หมอนวด", "Masseur", "Mo nuat"]
            ],
            "a",
            "ชาวประมงออกเรือหาปลา หมึก กุ้ง และสัตว์ทะเลนานาชนิดเพื่อส่งขายตามตลาด",
            "Fischer ('Chao pramong') fahren mit Booten hinaus aufs Meer, um Speisefisch zu fangen.",
            [{ title: "Department of Fisheries Thailand", url: "https://www.fisheries.go.th/" }]
        ),
        makeQuestion(
            "thq-sport-026", "sport", 3, "single_choice",
            "บุคคลที่คอยช่วยแพทย์ดูแลคนไข้และฉีดยาในโรงพยาบาลคือใคร?",
            "Wer unterstützt Ärzte, pflegt Patienten und verabreicht Medikamente im Krankenhaus?",
            "Bukhon thi khoi chuai phaet dulae khonkhai lae chit ya nai rongphayaban khue khrai?",
            [
                ["a", "พยาบาล", "Krankenpfleger / Krankenschwester", "Phayaban"],
                ["b", "แม่บ้าน", "Haushälterin", "Mae ban"],
                ["c", "นักบัญชี", "Buchhalter", "Nak banchi"],
                ["d", "ช่างกล้อง", "Kameramann", "Chang klong"]
            ],
            "a",
            "พยาบาลทำงานเคียงข้างแพทย์เพื่อดูแลและฟื้นฟูสุขภาพของผู้ป่วยตลอด 24 ชั่วโมง",
            "Pflegekräfte ('Phayaban') betreuen Kranke und verabreichen ärztlich verordnete Behandlungen.",
            [{ title: "Ministry of Public Health Thailand", url: "https://www.moph.go.th/" }]
        ),
        makeQuestion(
            "thq-sport-027", "sport", 3, "single_choice",
            "กิจกรรมที่ผู้คนนำเมล็ดพืชลงปลูกในดิน รดน้ำ และดูแลต้นไม้เรียกว่าอะไร?",
            "Wie nennt man die Freizeitbeschäftigung, Pflanzen zu säen, zu gießen und zu pflegen?",
            "Kitkakam thi phu khon nam malet phuet long pluk nai din, rot nam, lae dulae tonmai riak wa arai?",
            [
                ["a", "การทำสวน", "Gartenarbeit", "Kan tham suan"],
                ["b", "การเล่นฟุตบอล", "Fußballspielen", "Kan len futbon"],
                ["c", "การร้องเพลงคาราโอเกะ", "Karaoke singen", "Kan rong phleng kha-ra-o-ke"],
                ["d", "การซ่อมรถ", "Autoreparatur", "Kan som rot"]
            ],
            "a",
            "การทำสวนและปลูกต้นไม้เป็นงานอดิเรกที่สร้างความเพลิดเพลินและเพิ่มพื้นที่สีเขียว",
            "Gartenarbeit ('Kan tham suan') entspannt und bringt Blumen, Gemüse und Früchte hervor.",
            [{ title: "Department of Agricultural Extension Thailand", url: "https://www.doae.go.th/" }]
        ),
        makeQuestion(
            "thq-sport-028", "sport", 3, "single_choice",
            "ศิลปะการนวดแผนโบราณของไทยที่ได้รับการขึ้นทะเบียนเป็นมรดกโลกคืออะไร?",
            "Welche traditionelle thailändische Heilkunst wurde von der UNESCO als Weltkulturerbe anerkannt?",
            "Sinlapa kan nuat phaen boran khong Thai thi dairap kan khuen thabian pen moradok lok khue arai?",
            [
                ["a", "นวดแผนไทย", "Traditionelle Thai-Massage", "Nuat phaen Thai"],
                ["b", "มวยสากล", "Westliches Boxen", "Muai sakon"],
                ["c", "การเต้นรำบอลรูม", "Standardtanz", "Kan tenram bonrum"],
                ["d", "การเล่นโยคะร้อน", "Bikram-Yoga", "Kan len yo-kha ron"]
            ],
            "a",
            "'นวดไทย' ได้รับการขึ้นทะเบียนเป็นมรดกภูมิปัญญาทางวัฒนธรรมที่จับต้องไม่ได้ของยูเนสโกในปี 2019",
            "Nuad Thai (traditionelle Thai-Massage) ist seit 2019 immaterielles UNESCO-Weltkulturerbe.",
            [{ title: "UNESCO – Nuad Thai, traditional Thai massage", url: "https://ich.unesco.org/en/RL/nuad-thai-traditional-thai-massage-01384" }]
        ),
        makeQuestion(
            "thq-lan-028", "language_daily", 3, "single_choice",
            "สำนวนไทยคำว่า 'ใจดี' มีความหมายตรงกับลักษณะนิสัยแบบใด?",
            "Welche Charaktereigenschaft beschreibt das Wort 'Jai di' (ใจดี)?",
            "Samnuan Thai kham wa 'chai di' mi khwammai trong kap laksana nisai baep dai?",
            [
                ["a", "มีความเมตตาและชอบช่วยเหลือผู้อื่น", "Gutherzig, freundlich und hilfsbereit", "Mi khwam metta lae chop chuailuea phu uen"],
                ["b", "ขี้โมโหและโกรธง่าย", "Leicht reizbar und jähzornig", "Khi moho lae krot ngai"],
                ["c", "ขี้เหนียวไม่ยอมแบ่งปัน", "Geizig und unnachgiebig", "Khi niao mai yom baengpan"],
                ["d", "ขี้เกียจไม่อยากทำงาน", "Faul und träge", "Khi kiat mai yak tham ngan"]
            ],
            "a",
            "'ใจดี' คือคนที่มีจิตใจโอบอ้อมอารี มีเมตตากรุณาและเอื้อเฟื้อเผื่อแผ่ต่อผู้อื่น",
            "'Jai di' (wörtlich: gutes Herz) beschreibt eine freundliche, wohlwollende Persönlichkeit.",
            [{ title: "Royal Society of Thailand – Thai Idioms", url: "https://www.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-lan-029", "language_daily", 3, "single_choice",
            "คำให้กำลังใจยอดนิยมที่คนไทยใช้พูดว่า 'สู้ๆ นะ' มีความหมายว่าอย่างไร?",
            "Was bedeutet der weitverbreitete thailändische Zuspruch 'Su su na'?",
            "Kham hai kamlangchai yotniyom thi khon Thai chai phut wa 'su su na' mi khwammai wa yangrai?",
            [
                ["a", "Gib nicht auf! / Du schaffst das! / Halt durch!", "Gib nicht auf! / Du schaffst das! / Halt durch!", "Su to pai / Otthon wai"],
                ["b", "Gute Nacht und träum schön!", "Gute Nacht und träum schön!", "Ratri sawat"],
                ["c", "Guten Appetit beim Essen!", "Guten Appetit beim Essen!", "Thantawan aroy"],
                ["d", "Auf Wiedersehen bis morgen!", "Auf Wiedersehen bis morgen!", "La kon phop kan mai"]
            ],
            "a",
            "'สู้ๆ นะ' เป็นคำพูดปลุกใจและแสดงความห่วงใย เพื่อให้เพื่อนมีพลังต่อสู้กับปัญหา",
            "'Su su na!' (Kämpfe!) bedeutet 'Gib nicht auf!', 'Halt durch!' oder 'Du schaffst das!'.",
            [{ title: "Tourism Authority of Thailand – Everyday Thai Motivation", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-lan-030", "language_daily", 3, "single_choice",
            "คำว่า 'เกรงใจ' ในสังคมไทยสะท้อนถึงพฤติกรรมแบบใดมากที่สุด?",
            "Welches soziale Verhalten spiegelt das Konzept 'Kreng jai' (เกรงใจ) wider?",
            "Kham wa 'kreng chai' nai sangkhom Thai sathon thueng phruttikam baep dai mak thi sut?",
            [
                ["a", "ความเกรงใจ ไม่อยากทำให้ผู้อื่นลำบากใจ", "Rücksichtnahme, um anderen keine Umstände zu machen", "Khwam kreng chai, mai yak tham hai phu uen lambak chai"],
                ["b", "ความกลัวความมืดในเวลากลางคืน", "Angst vor der Dunkelheit", "Khwam klua khwam muet"],
                ["c", "ความหิวข้าวตอนดึก", "Nächtlicher Heißhunger", "Khwam hiu khao ton duek"],
                ["d", "ความชอบโอ้อวดสิ่งของ", "Prahlerei mit Besitztümern", "Khwam chop o-uat singkhong"]
            ],
            "a",
            "'เกรงใจ' คือความระมัดระวังที่จะไม่รบกวนหรือสร้างความเดือดร้อนรำคาญใจให้แก่คนอื่น",
            "'Kreng jai' ist feinfühliges Taktgefühl und Rücksichtnahme, um Mitmenschen nicht zu belasten.",
            [{ title: "Tourism Authority of Thailand – Kreng Jai Concept", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-lan-031", "language_daily", 3, "single_choice",
            "เวลาคนไทยทักทายคนรู้จักด้วยคำว่า 'กินข้าวหรือยัง?' จุดประสงค์ที่แท้จริงคืออะไร?",
            "Was ist der eigentliche Zweck, wenn Thailänder Bekannte mit 'Kin khao rue yang?' begrüßen?",
            "Wela khon Thai thakthai khon ruchak duai kham wa 'kin khao rue yang?' chutprasong thi thae ching khue arai?",
            [
                ["a", "เป็นการทักทายแสดงความห่วงใยตามมารยาท", "Höfliche Begrüßung und Anteilnahme", "Pen kan thakthai sadaeng khwam huangyai tam marayat"],
                ["b", "ต้องการขอเงินไปซื้อข้าว", "Um Geld für Essen zu erbetteln", "Tongkan kho ngoen pai sue khao"],
                ["c", "ตรวจสอบว่ากินยาหรือยัง", "Um zu prüfen, ob Medizin genommen wurde", "Truatsop wa kin ya rue yang"],
                ["d", "บังคับให้ไปกินข้าวทันที", "Eine Aufforderung, sofort zu essen", "Bangkhap hai pai kin khao thanthi"]
            ],
            "a",
            "'กินข้าวหรือยัง' เป็นคำทักทายแสดงความผูกพันและห่วงใยคล้ายกับคำว่า 'สบายดีไหม'",
            "'Kin khao rue yang?' (Hast du schon gegessen?) drückt herzliche Fürsorge und Verbundenheit aus.",
            [{ title: "Tourism Authority of Thailand – Thai Greetings", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-lan-032", "language_daily", 3, "single_choice",
            "เมื่อมีคนให้ของขวัญหรือช่วยเหลือเรา คำตอบที่ถูกต้องและสุภาพที่สุดคืออะไร?",
            "Was ist die passendste und höflichste Antwort, wenn uns jemand hilft oder beschenkt?",
            "Muea mi khon hai khongkhwan rue chuailuea rao, khamtop thi thuktong lae suphap thi sut khue arai?",
            [
                ["a", "ขอบคุณมากครับ / ค่ะ", "Vielen herzlichen Dank", "Khop khun mak khrap / kha"],
                ["b", "ขอโทษครับ / ค่ะ", "Entschuldigung", "Kho thot khrap / kha"],
                ["c", "ไม่เอาครับ / ค่ะ", "Will ich nicht", "Mai ao khrap / kha"],
                ["d", "ลาก่อนครับ / ค่ะ", "Auf Wiedersehen", "La kon khrap / kha"]
            ],
            "a",
            "'ขอบคุณมากครับ/ค่ะ' ใช้กล่าวแสดงความซาบซึ้งใจเมื่อได้รับไมตรีจิตหรือของขวัญจากผู้อื่น",
            "'Khop khun mak khrap/kha' bedankt sich aufrichtig für Geschenke und freundliche Unterstützung.",
            [{ title: "Ministry of Culture Thailand", url: "https://www.m-culture.go.th/" }]
        ),
        makeQuestion(
            "thq-lan-033", "language_daily", 3, "single_choice",
            "คำว่า 'อร่อยมาก' มักใช้พูดในสถานการณ์ใด?",
            "In welcher Situation verwendet man typischerweise 'Aroi mak'?",
            "Kham wa 'aroi mak' mak chai phut nai sathanakan dai?",
            [
                ["a", "เมื่อรับประทานอาหารที่ถูกปากและรสชาติดี", "Wenn das Essen hervorragend schmeckt", "Muea rap prathan ahan thi thuk pak lae rotchat di"],
                ["b", "เมื่อฟังเพลงที่ไพเราะ", "Wenn man schöne Musik hört", "Muea fang phleng thi phairo"],
                ["c", "เมื่อเห็นวิวภูเขาที่สวยงาม", "Wenn man ein schönes Bergpanorama sieht", "Muea hen wio phukhao thi suai-ngam"],
                ["d", "เมื่อซื้อเสื้อผ้าตัวใหม่", "Wenn man neue Kleidung kauft", "Muea sue suea pha tua mai"]
            ],
            "a",
            "'อร่อยมาก' เป็นคำชมรสชาติอาหารที่สร้างความประทับใจให้แก่แม่ครัวและเจ้าของร้านเสมอ",
            "'Aroi mak!' ist das höchste Lob für Speisen und zeigt, dass das Essen köstlich mundet.",
            [{ title: "Tourism Authority of Thailand – Culinary Thai", url: "https://www.tourismthailand.org/" }]
        ),
        makeQuestion(
            "thq-lan-034", "language_daily", 3, "single_choice",
            "ถ้าเพื่อนพูดว่า 'ไปเที่ยวกันเถอะ' ประโยคนี้มีความหมายว่าอย่างไร?",
            "Was bedeutet die Einladung eines Freundes: 'Pai thiao kan thoe'?",
            "Tha phuean phut wa 'pai thiao kan thoe' prayok ni mi khwammai wa yangrai?",
            [
                ["a", "Lass uns zusammen ausgehen / einen Ausflug machen!", "Lass uns zusammen ausgehen / einen Ausflug machen!", "Pai thiao kan thoe"],
                ["b", "Lass uns zusammen schlafen gehen!", "Lass uns zusammen schlafen gehen!", "Pai non kan thoe"],
                ["c", "Lass uns die Hausaufgaben machen!", "Lass uns die Hausaufgaben machen!", "Pai tham kanban kan thoe"],
                ["d", "Lass uns nach Hause rennen!", "Lass uns nach Hause rennen!", "Pai wing khao ban kan thoe"]
            ],
            "a",
            "'ไปเที่ยว' หมายถึงการเดินทางไปพักผ่อนหย่อนใจ ท่องเที่ยว หรือออกไปสนุกสนานข้างนอก",
            "'Pai thiao kan thoe' ist eine fröhliche Einladung, gemeinsam etwas Schönes zu unternehmen.",
            [{ title: "Royal Society of Thailand", url: "https://www.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-lan-035", "language_daily", 3, "single_choice",
            "เมื่อต้องการบอกลาเพื่อนและคาดว่าจะพบกันใหม่ในวันพรุ่งนี้ เรามักพูดว่าอะไร?",
            "Wie verabschiedet man sich von Freunden mit 'Bis morgen!'?",
            "Muea tongkan bok la phuean lae khat wa cha phop kan mai nai wan phrung ni, rao mak phut wa arai?",
            [
                ["a", "เจอกันพรุ่งนี้นะ", "Bis morgen!", "Choe kan phrung ni na"],
                ["b", "ยินดีต้อนรับครับ", "Herzlich willkommen!", "Yindi tonrap khrap"],
                ["c", "ขอบคุณมากครับ", "Vielen Dank!", "Khop khun mak khrap"],
                ["d", "สบายดีไหมครับ", "Wie geht es dir?", "Sabai di mai khrap"]
            ],
            "a",
            "'เจอกันพรุ่งนี้นะ' เป็นการกล่าวลาที่สื่อว่าจะได้พบกันอีกในวันถัดไปอย่างสนิทสนม",
            "'Choe kan phrung ni na' bedeutet 'Bis morgen!' unter Freunden und Kollegen.",
            [{ title: "Royal Society of Thailand", url: "https://www.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-lan-036", "language_daily", 3, "single_choice",
            "คำลงท้ายประโยคอย่างสุภาพสำหรับผู้ชายและผู้หญิงในภาษาไทยคือคำว่าอะไร?",
            "Welche Höflichkeitspartikeln verwenden Männer bzw. Frauen am Satzende?",
            "Kham longthai prayok yang suphap samrap phu chai lae phu ying nai phasa Thai khue kham wa arai?",
            [
                ["a", "ครับ (ชาย) และ ค่ะ (หญิง)", "Khrap für Männer, Kha für Frauen", "Khrap lae kha"],
                ["b", "จ้ะ (ชาย) และ จ๋า (หญิง)", "Cha für Männer, Cha für Frauen", "Cha lae cha"],
                ["c", "นะ (ชาย) และ หนอ (หญิง)", "Na für Männer, No für Frauen", "Na lae no"],
                ["d", "ฮะ (ชาย) และ จ้ะ (หญิง)", "Ha für Männer, Cha für Frauen", "Ha lae cha"]
            ],
            "a",
            "คำว่า 'ครับ' (สำหรับผู้ชาย) และ 'ค่ะ/คะ' (สำหรับผู้หญิง) เป็นหัวใจสำคัญของความสุภาพในภาษาไทย",
            "'Khrap' (Männer) und 'Kha' (Frauen) verleihen Aussagen im Thai Respekt und Höflichkeit.",
            [{ title: "Royal Society of Thailand – Thai Politeness", url: "https://www.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-lan-037", "language_daily", 3, "single_choice",
            "คำว่า 'ยินดีที่ได้รู้จัก' นิยมใช้พูดเมื่อใด?",
            "Wann sagt man auf Thailändisch 'Yin di thi dai ruchak'?",
            "Kham wa 'yindi thi dai ruchak' niyom chai phut muea dai?",
            [
                ["a", "เมื่อได้พบและทำความรู้จักกับใครเป็นครั้งแรก", "Beim ersten Kennenlernen einer Person", "Muea dai phop lae tham khwam ruchak kap khrai pen khrang raek"],
                ["b", "เมื่อต้องการสั่งอาหารในร้าน", "Beim Bestellen im Restaurant", "Muea tongkan sang ahan nai ran"],
                ["c", "เมื่อกำลังจะขึ้นนอน", "Vor dem Einschlafen", "Muea kamlang cha khuen non"],
                ["d", "เมื่อจ่ายเงินซื้อของ", "Beim Bezahlen an der Kasse", "Muea chai ngoen sue khong"]
            ],
            "a",
            "'ยินดีที่ได้รู้จัก' แปลตรงกับ 'Schön, Sie kennenzulernen' หรือ 'Nice to meet you'",
            "'Yin di thi dai ruchak' drückt Freude über ein erstes Kennenlernen aus.",
            [{ title: "Royal Society of Thailand – Thai Greetings", url: "https://www.orst.go.th/" }]
        ),
        makeQuestion(
            "thq-beg-001", "beginner_animals", 1, "single_choice",
            "สัตว์ตัวใดชอบกินกล้วยและปีนต้นไม้เก่ง?",
            "Welches Tier isst gerne Bananen und klettert geschickt auf Bäume?",
            "Sat tua dai chop kin kluai lae pin tonmai keng?",
            [
                ["a", "ลิง", "Affe", "Ling"],
                ["b", "ปลา", "Fisch", "Pla"],
                ["c", "เต่า", "Schildkröte", "Tao"],
                ["d", "เป็ด", "Ente", "Pet"]
            ],
            "a",
            "ลิง (Affe) ชอบกินผลไม้และปีนป่ายต้นไม้ได้อย่างคล่องแคล่ว",
            "Der Affe ('Ling') liebt Früchte wie Bananen und ist ein geschickter Kletterer.",
            [{"title":"Department of National Parks Thailand","url":"https://www.dnp.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-002", "beginner_animals", 1, "single_choice",
            "สัตว์ชนิดใดว่ายน้ำอยู่ในน้ำและมีครีบ?",
            "Welches Tier schwimmt im Wasser und hat Flossen?",
            "Sat chanit dai wai nam yu nai nam lae mi khrip?",
            [
                ["a", "ม้า", "Pferd", "Ma"],
                ["b", "ปลา", "Fisch", "Pla"],
                ["c", "หมู", "Schwein", "Mu"],
                ["d", "เสือ", "Tiger", "Suea"]
            ],
            "b",
            "ปลา (Fisch) หายใจด้วยเหงือกและว่ายน้ำอยู่ในแหล่งน้ำ",
            "Der Fisch ('Plaa') lebt und schwimmt im Wasser.",
            [{"title":"Department of Fisheries Thailand","url":"https://www.fisheries.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-003", "beginner_animals", 1, "single_choice",
            "สัตว์ชนิดใดร้อง 'เหมียวๆ' และชอบจับหนู?",
            "Welches Tier maunzt 'Miao' und jagt gerne Mäuse?",
            "Sat chanit dai rong 'miao miao' lae chop chap nu?",
            [
                ["a", "แมว", "Katze", "Maeo"],
                ["b", "วัว", "Kuh", "Wua"],
                ["c", "ไก่", "Huhn", "Kai"],
                ["d", "กบ", "Frosch", "Kop"]
            ],
            "a",
            "แมว (Katze) เป็นสัตว์เลี้ยงแสนน่ารักที่ร้องเสียงเหมียว",
            "Die Katze ('Maeo') ist ein beliebtes Haustier mit typischem Maunzen.",
            [{"title":"Royal Society of Thailand – Animals","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-004", "beginner_animals", 1, "single_choice",
            "สัตว์ชนิดใดมีงวงยาวและเป็นสัญลักษณ์ของประเทศไทย?",
            "Welches Tier hat einen langen Rüssel und ist das Nationalsymbol Thailands?",
            "Sat chanit dai mi nguang yao lae pen sanyalak khong prathet Thai?",
            [
                ["a", "หมา", "Hund", "Ma"],
                ["b", "นก", "Vogel", "Nok"],
                ["c", "ช้าง", "Elefant", "Chang"],
                ["d", "แพะ", "Ziege", "Phae"]
            ],
            "c",
            "ช้างไทย (Elefant) มีงวงและงา และมีความผูกพันกับประวัติศาสตร์ไทย",
            "Der Elefant ('Chang') ist das berühmte Nationaltier Thailands.",
            [{"title":"Tourism Authority of Thailand – Chang Thai","url":"https://www.tourismthailand.org/"}]
        ),
        makeQuestion(
            "thq-beg-005", "beginner_animals", 1, "single_choice",
            "สัตว์ชนิดใดขันเสียงดังในตอนเช้าตรู่?",
            "Welches Tier kräht frühmorgens laut bei Sonnenaufgang?",
            "Sat chanit dai khan siang dang nai ton chao tru?",
            [
                ["a", "ไก่", "Huhn / Hahn", "Kai"],
                ["b", "เป็ด", "Ente", "Pet"],
                ["c", "งู", "Schlange", "Ngu"],
                ["d", "สิงโต", "Löwe", "Singto"]
            ],
            "a",
            "ไก่ตัวผู้จะขันบอกเวลาเช้าเมื่อแสงอาทิตย์เริ่มส่อง",
            "Der Hahn ('Kai') weckt die Menschen morgens mit seinem Krähen.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-006", "beginner_animals", 1, "single_choice",
            "สัตว์ชนิดใดเห่า 'โฮ่งๆ' และช่วยเฝ้าบ้าน?",
            "Welches Tier bellt 'Wuff' und bewacht das Haus?",
            "Sat chanit dai hao 'hong hong' lae chuai fao ban?",
            [
                ["a", "หมา", "Hund", "Ma"],
                ["b", "แมว", "Katze", "Maeo"],
                ["c", "ม้า", "Pferd", "Ma"],
                ["d", "กระต่าย", "Hase", "Kratai"]
            ],
            "a",
            "หมาหรือสุนัขเป็นสัตว์เลี้ยงที่ซื่อสัตย์คอยดูแลบ้าน",
            "Der Hund ('Ma') bewacht treu Haus und Hof.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-007", "beginner_animals", 1, "single_choice",
            "สัตว์ชนิดใดมีหูยาว กระโดดได้ และชอบกินผัก?",
            "Welches Tier hat lange Ohren, hüpft und isst gern Gemüse?",
            "Sat chanit dai mi hu yao, kradot dai lae chop kin phak?",
            [
                ["a", "กระต่าย", "Hase / Kaninchen", "Kratai"],
                ["b", "เต่า", "Schildkröte", "Tao"],
                ["c", "ปลา", "Fisch", "Pla"],
                ["d", "หมู", "Schwein", "Mu"]
            ],
            "a",
            "กระต่าย (Kaninchen) มีขนปุย หูยาว และกระโดดไปมา",
            "Das Kaninchen ('Kratai') hat lange Ohren und hüpft geschwind.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-008", "beginner_animals", 1, "single_choice",
            "สัตว์ชนิดใดเดินช้าและมีกระดองแข็งหุ้มตัว?",
            "Welches Tier bewegt sich langsam und hat einen harten Panzer?",
            "Sat chanit dai doen cha lae mi kradong khaeng hum tua?",
            [
                ["a", "เสือ", "Tiger", "Suea"],
                ["b", "เต่า", "Schildkröte", "Tao"],
                ["c", "ลิง", "Affe", "Ling"],
                ["d", "นก", "Vogel", "Nok"]
            ],
            "b",
            "เต่า (Schildkröte) เคลื่อนไหวอย่างช้าๆ และหลบภัยในกระดอง",
            "Die Schildkröte ('Tao') schützt sich mit ihrem festen Panzer.",
            [{"title":"Department of Marine and Coastal Resources","url":"https://www.dmcr.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-009", "beginner_animals", 1, "single_choice",
            "สัตว์ชนิดใดมีปีกและบินได้บนท้องฟ้า?",
            "Welches Tier besitzt Flügel und fliegt durch die Luft?",
            "Sat chanit dai mi pik lae bin dai bon thongfa?",
            [
                ["a", "นก", "Vogel", "Nok"],
                ["b", "ปลา", "Fisch", "Pla"],
                ["c", "หมู", "Schwein", "Mu"],
                ["d", "หมา", "Hund", "Ma"]
            ],
            "a",
            "นก (Vogel) มีขนและปีกช่วยพยุงตัวบินในอากาศ",
            "Vögel ('Nok') gleiten mit ihren Flügeln durch die Lüfte.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-010", "beginner_animals", 1, "single_choice",
            "สัตว์เลี้ยงชนิดใดให้นมสดแก่เรา?",
            "Welches Haustier liefert uns frische Trinkmilch?",
            "Sat liang chanit dai hai nom sot kae rao?",
            [
                ["a", "วัว", "Kuh", "Wua"],
                ["b", "ม้า", "Pferd", "Ma"],
                ["c", "ช้าง", "Elefant", "Chang"],
                ["d", "เป็ด", "Ente", "Pet"]
            ],
            "a",
            "วัวนมให้น้ำนมที่มีสารอาหารและแคลเซียมสูง",
            "Die Kuh ('Wua') liefert die klassische Kuhmilch.",
            [{"title":"Department of Livestock Development","url":"https://dld.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-011", "beginner_colors_numbers", 1, "single_choice",
            "ใบไม้สดส่วนใหญ่มีสีอะไรตามธรรมชาติ?",
            "Welche Farbe haben frische Blätter in der Natur meistens?",
            "Baimai sot suanyai mi si arai tam thammachat?",
            [
                ["a", "เขียว", "Grün", "Khiao"],
                ["b", "แดง", "Rot", "Daeng"],
                ["c", "ดำ", "Schwarz", "Dam"],
                ["d", "ขาว", "Weiß", "Khao"]
            ],
            "a",
            "สีเขียว (Grün) เป็นสีธรรมชาติของใบไม้ที่มีคลอโรฟิลล์",
            "Grün ('Khiao') ist die typische Farbe von Laub und Pflanzen.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-012", "beginner_colors_numbers", 1, "single_choice",
            "กล้วยที่สุกแล้วมีเปลือกเป็นสีอะไร?",
            "Welche Farbe hat die Schale einer reifen Banane?",
            "Kluai thi suk laeo mi plueak pen si arai?",
            [
                ["a", "เหลือง", "Gelb", "Lueang"],
                ["b", "ฟ้า", "Hellblau", "Fa"],
                ["c", "ม่วง", "Lila", "Muang"],
                ["d", "ส้ม", "Orange", "Som"]
            ],
            "a",
            "สีเหลือง (Gelb) เป็นสีสดใสของเปลือกกล้วยที่สุกแล้ว",
            "Gelb ('Lueang') ist die Leuchtfarbe reifer Bananen.",
            [{"title":"Department of Agriculture Thailand","url":"https://www.doa.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-013", "beginner_colors_numbers", 1, "single_choice",
            "เลือดของมนุษย์มีสีอะไร?",
            "Welche Farbe hat menschliches Blut?",
            "Lueat khong manut mi si arai?",
            [
                ["a", "แดง", "Rot", "Daeng"],
                ["b", "ขาว", "Weiß", "Khao"],
                ["c", "เขียว", "Grün", "Khiao"],
                ["d", "ดำ", "Schwarz", "Dam"]
            ],
            "a",
            "สีแดง (Rot) เป็นสีของเม็ดเลือดแดงในร่างกาย",
            "Rot ('Daeng') ist die Signalfarbe des Blutes.",
            [{"title":"Ministry of Public Health Thailand","url":"https://www.moph.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-014", "beginner_colors_numbers", 1, "single_choice",
            "ท้องฟ้าแจ่มใสในเวลากลางวันมักมีสีอะไร?",
            "Welche Farbe hat ein wolkenloser Himmel am Tag?",
            "Thongfa chaemsai nai wela klangwan mak mi si arai?",
            [
                ["a", "ฟ้า", "Hellblau", "Fa"],
                ["b", "ดำ", "Schwarz", "Dam"],
                ["c", "แดง", "Rot", "Daeng"],
                ["d", "ชมพู", "Rosa", "Chomphu"]
            ],
            "a",
            "สีฟ้า (Hellblau) คือสีของท้องฟ้าในวันที่อากาศปลอดโปร่ง",
            "Hellblau ('Fa') ist die Farbe des heiteren Himmels.",
            [{"title":"Thai Meteorological Department","url":"https://www.tmd.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-015", "beginner_colors_numbers", 1, "single_choice",
            "หิมะบริสุทธิ์และน้ำตาลทรายมีสีอะไร?",
            "Welche Farbe haben reiner Schnee und weißer Zucker?",
            "Hima borisut lae namtan sai mi si arai?",
            [
                ["a", "ขาว", "Weiß", "Khao"],
                ["b", "ดำ", "Schwarz", "Dam"],
                ["c", "เขียว", "Grün", "Khiao"],
                ["d", "ส้ม", "Orange", "Som"]
            ],
            "a",
            "สีขาว (Weiß) สื่อถึงความสะอาดและบริสุทธิ์",
            "Weiß ('Khao') steht für Helligkeit und Reinheit.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-016", "beginner_colors_numbers", 1, "single_choice",
            "ท้องฟ้ายามค่ำคืนที่มืดสนิทมีสีอะไร?",
            "Welche Farbe hat die finstere Nacht?",
            "Thongfa yam khamkhuen thi muet sanit mi si arai?",
            [
                ["a", "ดำ", "Schwarz", "Dam"],
                ["b", "ขาว", "Weiß", "Khao"],
                ["c", "เหลือง", "Gelb", "Lueang"],
                ["d", "แดง", "Rot", "Daeng"]
            ],
            "a",
            "สีดำ (Schwarz) คือสีของความมืดมิดยามราตรี",
            "Schwarz ('Dam') ist die Farbe der dunklen Nacht.",
            [{"title":"National Astronomical Research Institute of Thailand","url":"https://www.narit.or.th/"}]
        ),
        makeQuestion(
            "thq-beg-017", "beginner_colors_numbers", 1, "single_choice",
            "เลข 'สาม' บวกกับเลข 'สอง' ได้ผลลัพธ์เท่าไร?",
            "Was ergibt drei plus zwei?",
            "Lek 'sam' buak kap lek 'song' dai phonlap thao dai?",
            [
                ["a", "ห้า", "Fünf (5)", "Ha"],
                ["b", "สี่", "Vier (4)", "Si"],
                ["c", "หก", "Sechs (6)", "Hok"],
                ["d", "เจ็ด", "Sieben (7)", "Chet"]
            ],
            "a",
            "3 + 2 = 5 ในภาษาไทยเรียกว่า 'ห้า'",
            "Drei plus zwei ergibt fünf ('Ha').",
            [{"title":"Ministry of Education Thailand","url":"https://www.moe.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-018", "beginner_colors_numbers", 1, "single_choice",
            "มนุษย์ทั่วไปมีมือปกติกี่ข้าง?",
            "Wie viele Hände hat ein Mensch normalerweise?",
            "Manut thua pai mi mue pokkati ki khang?",
            [
                ["a", "สอง", "Zwei (2)", "Song"],
                ["b", "หนึ่ง", "Eins (1)", "Nueng"],
                ["c", "สาม", "Drei (3)", "Sam"],
                ["d", "สี่", "Vier (4)", "Si"]
            ],
            "a",
            "คนเรามีมือสองข้าง คือมือซ้ายและมือขวา",
            "Der Mensch besitzt zwei Hände ('Song').",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-019", "beginner_colors_numbers", 1, "single_choice",
            "ตัวเลขเริ่มต้นนับจำนวนคือเลขใด?",
            "Mit welcher Ziffer beginnt das Zählen gewöhnlich?",
            "Tualek roemton nap chamnuan khue lek dai?",
            [
                ["a", "หนึ่ง", "Eins (1)", "Nueng"],
                ["b", "สิบ", "Zehn (10)", "Sip"],
                ["c", "แปด", "Acht (8)", "Paet"],
                ["d", "ศูนย์", "Null (0)", "Sun"]
            ],
            "a",
            "เลขหนึ่ง (1) คือจำนวนนับแรกสุด",
            "Die Zählung beginnt mit der Zahl eins ('Nueng').",
            [{"title":"Ministry of Education Thailand","url":"https://www.moe.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-020", "beginner_colors_numbers", 1, "single_choice",
            "นิ้วมือของคนเราในหนึ่งข้างมีทั้งหมดกี่นิ้ว?",
            "Wie viele Finger hat eine menschliche Hand?",
            "Nio mue khong khon rao nai nueng khang mi thang mot ki nio?",
            [
                ["a", "ห้า", "Fünf (5)", "Ha"],
                ["b", "สี่", "Vier (4)", "Si"],
                ["c", "หก", "Sechs (6)", "Hok"],
                ["d", "สาม", "Drei (3)", "Sam"]
            ],
            "a",
            "มือหนึ่งข้างมี 5 นิ้ว ได้แก่ นิ้วโป้ง ชี้ กลาง นาง และก้อย",
            "Jede Hand besitzt fünf Finger ('Ha').",
            [{"title":"Ministry of Public Health Thailand","url":"https://www.moph.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-021", "beginner_food_drink", 1, "single_choice",
            "อาหารหลักที่คนไทยรับประทานแทบทุกมื้อคืออะไร?",
            "Was ist das Hauptnahrungsmittel, das Thailänder zu fast jeder Mahlzeit essen?",
            "Ahan lak thi khon thai rapprathan thaep thuk mue khue arai?",
            [
                ["a", "ข้าว", "Reis", "Khao"],
                ["b", "ขนมปัง", "Brot", "Khanompang"],
                ["c", "พิซซ่า", "Pizza", "Phitsa"],
                ["d", "มันฝรั่ง", "Kartoffeln", "Manfarang"]
            ],
            "a",
            "ข้าว (Khao) เป็นอาหารจานหลักของคนไทยและวัฒนธรรมเอเชีย",
            "Reis ('Khao') ist das Grundnahrungsmittel in Thailand.",
            [{"title":"Rice Department Thailand","url":"https://www.ricethailand.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-022", "beginner_food_drink", 1, "single_choice",
            "เครื่องดื่มใส ไม่มีสี ไม่มีกลิ่น จำเป็นต่อชีวิตคืออะไร?",
            "Welches klare, farblose Getränk ist lebensnotwendig?",
            "Khrueangduem sai mai mi si mai mi klin champen to chiwit khue arai?",
            [
                ["a", "น้ำเปล่า", "Trinkwasser", "Nam plao"],
                ["b", "กาแฟ", "Kaffee", "Kafae"],
                ["c", "น้ำส้ม", "Orangensaft", "Nam som"],
                ["d", "น้ำอัดลม", "Limonade", "Nam atlom"]
            ],
            "a",
            "น้ำเปล่าบริสุทธิ์ช่วยให้ร่างกายทำงานได้อย่างสมบูรณ์",
            "Sauberes Trinkwasser ('Nam plao') ist essenziell für die Gesundheit.",
            [{"title":"Department of Health Thailand","url":"https://anamai.moph.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-023", "beginner_food_drink", 1, "single_choice",
            "ผลไม้ไทยชนิดใดมีรสเปรี้ยว ใช้ปรุงรสต้มยำและส้มตำ?",
            "Welche thailändische Frucht ist sauer und würzt Tom Yam und Som Tam?",
            "Phonlamai thai chanit dai mi rot priao chai phrung rot tom yam lae som tam?",
            [
                ["a", "มะนาว", "Limette", "Manao"],
                ["b", "มะละกอสุก", "Reife Papaya", "Malako suk"],
                ["c", "กล้วย", "Banane", "Kluai"],
                ["d", "แตงโม", "Wassermelone", "Taengmo"]
            ],
            "a",
            "มะนาว (Manao) ให้รสเปรี้ยวหอมสดชื่นในอาหารไทย",
            "Die Limette ('Manao') verleiht Gerichten ihre frische Säure.",
            [{"title":"Tourism Authority of Thailand – Food","url":"https://www.tourismthailand.org/"}]
        ),
        makeQuestion(
            "thq-beg-024", "beginner_food_drink", 1, "single_choice",
            "สิ่งใดได้จากแม่ไก่ นิยมนำไปทอดเป็นไข่ดาวหรือต้ม?",
            "Was legt das Huhn und wird gern als Spiegelei gebraten?",
            "Sing dai dai chak mae kai niyom nam ma thot pen khai dao rue tom?",
            [
                ["a", "ไข่", "Ei", "Khai"],
                ["b", "ข้าว", "Reis", "Khao"],
                ["c", "ผัก", "Gemüse", "Phak"],
                ["d", "ขนม", "Süßigkeit", "Khanom"]
            ],
            "a",
            "ไข่ไก่ (Khai) นำมาปรุงเป็นไข่ดาว ไข่เจียว และไข่ต้ม",
            "Eier ('Khai') sind ein vielseitiges Grundnahrungsmittel.",
            [{"title":"Department of Livestock Development","url":"https://dld.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-025", "beginner_food_drink", 1, "single_choice",
            "เครื่องดื่มสีดำ มีกลิ่นหอม รสขม นิยมดื่มตอนเช้าคืออะไร?",
            "Welches dunkle, aromatische Heißgetränk trinken viele morgens?",
            "Khrueangduem si dam mi klin hom rot khom niyom duem ton chao khue arai?",
            [
                ["a", "กาแฟ", "Kaffee", "Kafae"],
                ["b", "น้ำส้ม", "Orangensaft", "Nam som"],
                ["c", "นมสด", "Milch", "Nom sot"],
                ["d", "น้ำผลไม้", "Fruchtsaft", "Nam phonlamai"]
            ],
            "a",
            "กาแฟ (Kafae) เป็นเครื่องดื่มยอดนิยมที่ช่วยให้ตื่นตัวยามเช้า",
            "Kaffee ('Kafae') weckt die Lebensgeister am Morgen.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-026", "beginner_food_drink", 1, "single_choice",
            "ผลไม้ลูกใหญ่ เนื้อสีแดง รสหวาน ฉ่ำน้ำในหน้าร้อนคืออะไร?",
            "Welche große Frucht hat rotes, saftig-süßes Fruchtfleisch?",
            "Phonlamai luk yai nuea si daeng rot wan cham nam nai na ron khue arai?",
            [
                ["a", "แตงโม", "Wassermelone", "Taengmo"],
                ["b", "มะพร้าว", "Kokosnuss", "Maphrao"],
                ["c", "ส้ม", "Orange", "Som"],
                ["d", "กล้วย", "Banane", "Kluai"]
            ],
            "a",
            "แตงโม (Taengmo) มีน้ำมาก ช่วยดับกระหายคลายร้อนได้ดี",
            "Wassermelone ('Taengmo') erfrischt an heißen Tagen.",
            [{"title":"Department of Agriculture Thailand","url":"https://www.doa.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-027", "beginner_food_drink", 1, "single_choice",
            "ผลไม้ทรงกลม เปลือกสีเขียว มีน้ำหวานหอมและเนื้อมะพร้าวคืออะไร?",
            "Welche runde Palmfrucht hat süßes Trinkwasser und weißes Fruchtfleisch?",
            "Phonlamai song klom plueak si khiao mi nam wan hom lae nuea maphrao khue arai?",
            [
                ["a", "มะพร้าว", "Kokosnuss", "Maphrao"],
                ["b", "มะละกอ", "Papaya", "Malako"],
                ["c", "ทุเรียน", "Durian", "Thurian"],
                ["d", "มะม่วง", "Mango", "Mamuang"]
            ],
            "a",
            "มะพร้าว (Maphrao) ให้น้ำหวานสดชื่นและเนื้อมะพร้าวแสนอร่อย",
            "Die Kokosnuss ('Maphrao') ist reich an erfrischendem Wasser.",
            [{"title":"Tourism Authority of Thailand – Food","url":"https://www.tourismthailand.org/"}]
        ),
        makeQuestion(
            "thq-beg-028", "beginner_food_drink", 1, "single_choice",
            "เครื่องปรุงสีขาว รสเค็ม ใช้ปรุงอาหารทุกชนิดคืออะไร?",
            "Welches weiße Gewürz schmeckt salzig?",
            "Khrueangphrung si khao rot khem chai phrung ahan thuk chanit khue arai?",
            [
                ["a", "เกลือ", "Salz", "Kluea"],
                ["b", "น้ำตาล", "Zucker", "Namtan"],
                ["c", "พริก", "Chili", "Phrik"],
                ["d", "น้ำปลา", "Fischsauce", "Nampla"]
            ],
            "a",
            "เกลือ (Kluea) ให้รสเค็มเป็นพื้นฐานของการปรุงอาหาร",
            "Salz ('Kluea') verleiht Speisen herzhafte Würze.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-029", "beginner_food_drink", 1, "single_choice",
            "เครื่องปรุงรสหวาน ทำจากอ้อย นิยมใส่ในขนมและกาแฟคืออะไร?",
            "Welches süße Würzmittel aus Zuckerrohr kommt in Desserts und Kaffee?",
            "Khrueangphrung rot wan tham chak oi niyom sai nai khanom lae kafae khue arai?",
            [
                ["a", "น้ำตาล", "Zucker", "Namtan"],
                ["b", "เกลือ", "Salz", "Kluea"],
                ["c", "มะนาว", "Limette", "Manao"],
                ["d", "พริกไทย", "Pfeffer", "Phrikthai"]
            ],
            "a",
            "น้ำตาล (Namtan) ให้รสหวานชื่นใจในขนมและเครื่องดื่ม",
            "Zucker ('Namtan') sorgt für die süße Geschmacksnote.",
            [{"title":"Office of the Cane and Sugar Board","url":"https://www.ocsb.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-030", "beginner_food_drink", 1, "single_choice",
            "อาหารเส้นในน้ำซุปร้อนๆ มีลูกชิ้นและผักเรียกว่าอะไร?",
            "Wie heißt das Nudelgericht in heißer Suppe mit Fleischbällchen?",
            "Ahan sen nai nam sup ron ron mi lukchin lae phak riak wa arai?",
            [
                ["a", "ก๋วยเตี๋ยว", "Nudelsuppe", "Kuaitiao"],
                ["b", "ข้าวผัด", "Gebratener Reis", "Khao phat"],
                ["c", "ขนมจีน", "Khanom Chin", "Khanom chin"],
                ["d", "ส้มตำ", "Papayasalat", "Som tam"]
            ],
            "a",
            "ก๋วยเตี๋ยว (Kuaitiao) เป็นอาหารจานด่วนยอดนิยมทั่วประเทศไทย",
            "Nudelsuppe ('Kuaitiao') ist ein thailändischer Streetfood-Klassiker.",
            [{"title":"Tourism Authority of Thailand – Streetfood","url":"https://www.tourismthailand.org/"}]
        ),
        makeQuestion(
            "thq-beg-031", "beginner_family_body", 1, "single_choice",
            "อวัยวะส่วนใดของร่างกายใช้สำหรับมองเห็นสิ่งต่างๆ?",
            "Mit welchem Organ können wir sehen?",
            "Awaiyawa suan dai khong rangkai chai samrap mong hen sing tang tang?",
            [
                ["a", "ตา", "Auge", "Ta"],
                ["b", "หู", "Ohr", "Hu"],
                ["c", "จมูก", "Nase", "Chamuk"],
                ["d", "ปาก", "Mund", "Pak"]
            ],
            "a",
            "ดวงตา (Ta) เป็นอวัยวะรับภาพและการมองเห็นของร่างกาย",
            "Das Auge ('Ta') ermöglicht das Sehen.",
            [{"title":"Ministry of Public Health Thailand","url":"https://www.moph.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-032", "beginner_family_body", 1, "single_choice",
            "อวัยวะส่วนใดใช้สำหรับฟังเสียงและดนตรี?",
            "Mit welchem Organ hören wir Geräusche und Musik?",
            "Awaiyawa suan dai chai samrap fang siang lae dontri?",
            [
                ["a", "หู", "Ohr", "Hu"],
                ["b", "ปาก", "Mund", "Pak"],
                ["c", "ตา", "Auge", "Ta"],
                ["d", "มือ", "Hand", "Mue"]
            ],
            "a",
            "หู (Hu) รับคลื่นเสียงทำให้เราได้ยินเสียงรอบข้าง",
            "Das Ohr ('Hu') nimmt Töne und Sprache wahr.",
            [{"title":"Ministry of Public Health Thailand","url":"https://www.moph.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-033", "beginner_family_body", 1, "single_choice",
            "อวัยวะส่วนใดใช้สำหรับดมกลิ่นและหายใจ?",
            "Womit riechen und atmen wir?",
            "Awaiyawa suan dai chai samrap dom klin lae haichai?",
            [
                ["a", "จมูก", "Nase", "Chamuk"],
                ["b", "คาง", "Kinn", "Khang"],
                ["c", "แก้ม", "Wange", "Kaem"],
                ["d", "หน้าผาก", "Stirn", "Naphak"]
            ],
            "a",
            "จมูก (Chamuk) เป็นทางผ่านของลมหายใจและประสาทรับกลิ่น",
            "Die Nase ('Chamuk') dient der Atmung und dem Riechen.",
            [{"title":"Ministry of Public Health Thailand","url":"https://www.moph.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-034", "beginner_family_body", 1, "single_choice",
            "อวัยวะส่วนใดใช้สำหรับเคี้ยวอาหารและพูดคุย?",
            "Womit kauen wir Speisen und sprechen?",
            "Awaiyawa suan dai chai samrap khiao ahan lae phut khui?",
            [
                ["a", "ปาก", "Mund", "Pak"],
                ["b", "ตา", "Auge", "Ta"],
                ["c", "หู", "Ohr", "Hu"],
                ["d", "แขน", "Arm", "Khaen"]
            ],
            "a",
            "ปากและฟัน (Pak) ทำหน้าที่บดเคี้ยวอาหารและเปล่งเสียงพูด",
            "Der Mund ('Pak') dient dem Sprechen und Essen.",
            [{"title":"Ministry of Public Health Thailand","url":"https://www.moph.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-035", "beginner_family_body", 1, "single_choice",
            "ส่วนใดของร่างกายที่อยู่ปลายแขน ใช้หยิบจับสิ่งของ?",
            "Was befindet sich am Ende des Arms und greift Gegenstände?",
            "Suan dai khong rangkai thi yu plai khaen chai yip chap singkhong?",
            [
                ["a", "มือ", "Hand", "Mue"],
                ["b", "ขา", "Bein", "Kha"],
                ["c", "เท้า", "Fuß", "Thao"],
                ["d", "คอ", "Hals", "Kho"]
            ],
            "a",
            "มือ (Mue) มีนิ้วห้านิ้วช่วยในการหยิบจับสิ่งของอย่างละเอียด",
            "Die Hand ('Mue') greift Gegenstände und führt Tätigkeiten aus.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-036", "beginner_family_body", 1, "single_choice",
            "ส่วนของร่างกายที่ใช้สำหรับยืน เดิน และวิ่งคืออะไร?",
            "Womit stehen, gehen und laufen wir?",
            "Suan khong rangkai thi chai samrap yuen doen lae wing khue arai?",
            [
                ["a", "ขาและเท้า", "Beine & Füße", "Kha lae thao"],
                ["b", "แขนและมือ", "Arme & Hände", "Khaen lae mue"],
                ["c", "ไหล่", "Schultern", "Lai"],
                ["d", "ท้อง", "Bauch", "Thong"]
            ],
            "a",
            "ขาและเท้า (Kha lae thao) ค้ำจุนร่างกายและช่วยในการเคลื่อนที่",
            "Beine und Füße ('Kha lae thao') tragen das Körpergewicht beim Gehen.",
            [{"title":"Department of Physical Education","url":"https://www.dpe.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-037", "beginner_family_body", 1, "single_choice",
            "ผู้ชายที่ให้กำเนิดเราและเป็นคู่สมรสของแม่เรียกว่าใคร?",
            "Wie nennt man den Mann, der unser Vater ist?",
            "Phuchai thi hai kamnoet rao lae pen khusomrot khong mae riak wa khrai?",
            [
                ["a", "พ่อ", "Vater", "Pho"],
                ["b", "พี่ชาย", "Älterer Bruder", "Phi chai"],
                ["c", "ลุง", "Onkel", "Lung"],
                ["d", "ปู่", "Großvater", "Pu"]
            ],
            "a",
            "พ่อ (Pho) คือบิดาผู้ให้กำเนิดและดูแลเรา",
            "Der Vater ('Pho') ist das männliche Elternteil.",
            [{"title":"Ministry of Social Development and Human Security","url":"https://www.m-society.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-038", "beginner_family_body", 1, "single_choice",
            "ผู้หญิงที่อุ้มท้องคลอดเรามาเรียกว่าใคร?",
            "Wie nennt man die Frau, die uns zur Welt gebracht hat?",
            "Phuying thi um thong khlot rao ma riak wa khrai?",
            [
                ["a", "แม่", "Mutter", "Mae"],
                ["b", "ป้า", "Tante", "Pa"],
                ["c", "ย่า", "Großmutter", "Ya"],
                ["d", "พี่สาว", "Ältere Schwester", "Phi sao"]
            ],
            "a",
            "แม่ (Mae) คือมารดาผู้ให้กำเนิดและเลี้ยงดูเรา",
            "Die Mutter ('Mae') ist das weibliche Elternteil.",
            [{"title":"Ministry of Social Development and Human Security","url":"https://www.m-society.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-039", "beginner_family_body", 1, "single_choice",
            "พี่ผู้ชายที่มีสายเลือดเดียวกับเราเรียกว่าอะไร?",
            "Wie nennt man seinen älteren Bruder auf Thai?",
            "Phi phuchai thi mi sailueat diao kap rao riak wa arai?",
            [
                ["a", "พี่ชาย", "Älterer Bruder", "Phi chai"],
                ["b", "น้องสาว", "Jüngere Schwester", "Nong sao"],
                ["c", "พ่อ", "Vater", "Pho"],
                ["d", "น้า", "Tante/Onkel", "Na"]
            ],
            "a",
            "พี่ชาย (Phi chai) หมายถึงพี่แท้ๆ ที่เป็นผู้ชาย",
            "Der ältere Bruder wird als 'Phi chai' bezeichnet.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-040", "beginner_family_body", 1, "single_choice",
            "น้องผู้หญิงที่มีอายุน้อยกว่าเราในครอบครัวเรียกว่าอะไร?",
            "Wie nennt man die jüngere Schwester?",
            "Nong phuying thi mi ayu noi kwa rao nai khropkhrua riak wa arai?",
            [
                ["a", "น้องสาว", "Jüngere Schwester", "Nong sao"],
                ["b", "พี่ชาย", "Älterer Bruder", "Phi chai"],
                ["c", "ป้า", "Tante", "Pa"],
                ["d", "แม่", "Mutter", "Mae"]
            ],
            "a",
            "น้องสาว (Nong sao) หมายถึงน้องผู้หญิงในครอบครัว",
            "Die jüngere Schwester heißt 'Nong sao'.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-041", "beginner_clothing", 1, "single_choice",
            "สิ่งใดใช้สวมใส่ท่อนบนของร่างกาย?",
            "Welches Kleidungsstück trägt man am Oberkörper?",
            "Sing dai chai suamsai thon bon khong rangkai?",
            [
                ["a", "เสื้อ", "Hemd / T-Shirt", "Suea"],
                ["b", "กางเกง", "Hose", "Kangkeng"],
                ["c", "รองเท้า", "Schuhe", "Rongthao"],
                ["d", "หมวก", "Hut", "Muak"]
            ],
            "a",
            "เสื้อ (Suea) เป็นเครื่องนุ่งห่มส่วนบนของร่างกาย",
            "Das Oberteil bzw. T-Shirt heißt 'Suea'.",
            [{"title":"Royal Society of Thailand – Clothing","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-042", "beginner_clothing", 1, "single_choice",
            "สิ่งใดใช้สวมใส่ท่อนล่างของร่างกาย มีขาสองข้าง?",
            "Was trägt man an den Beinen?",
            "Sing dai chai suamsai thon lang khong rangkai mi kha song khang?",
            [
                ["a", "กางเกง", "Hose", "Kangkeng"],
                ["b", "เสื้อ", "Hemd", "Suea"],
                ["c", "ถุงมือ", "Handschuhe", "Thungmue"],
                ["d", "แว่นตา", "Brille", "Waenta"]
            ],
            "a",
            "กางเกง (Kangkeng) เป็นเครื่องแต่งกายท่อนล่าง",
            "Die Hose heißt 'Kangkeng'.",
            [{"title":"Royal Society of Thailand – Clothing","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-043", "beginner_clothing", 1, "single_choice",
            "สิ่งใดใช้สวมใส่ที่เท้าก่อนสวมรองเท้า?",
            "Was zieht man an die Füße, bevor man in die Schuhe schlüpft?",
            "Sing dai chai suamsai thi thao kon suam rongthao?",
            [
                ["a", "ถุงเท้า", "Socken", "Thungthao"],
                ["b", "ถุงมือ", "Handschuhe", "Thungmue"],
                ["c", "ผ้าพันคอ", "Schal", "Phaphankho"],
                ["d", "หมวก", "Mütze", "Muak"]
            ],
            "a",
            "ถุงเท้า (Thungthao) ช่วยปกป้องเท้าและลดการเสียดสีกับรองเท้า",
            "Socken heißen 'Thungthao'.",
            [{"title":"Royal Society of Thailand – Clothing","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-044", "beginner_clothing", 1, "single_choice",
            "สิ่งใดใช้สวมบนศีรษะเพื่อบังแดดหรือกันร้อน?",
            "Was setzt man auf den Kopf, um sich vor Sonne zu schützen?",
            "Sing dai chai suam bon sisa phuea bang daet rue kan ron?",
            [
                ["a", "หมวก", "Hut / Kappe", "Muak"],
                ["b", "เสื้อ", "Hemd", "Suea"],
                ["c", "รองเท้า", "Schuhe", "Rongthao"],
                ["d", "เข็มขัด", "Gürtel", "Khemkhat"]
            ],
            "a",
            "หมวก (Muak) ช่วยป้องกันแสงแดดกระทบศีรษะโดยตรง",
            "Die Kopfbedeckung ('Muak') schützt vor starker Sonneneinstrahlung.",
            [{"title":"Royal Society of Thailand – Clothing","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-045", "beginner_home", 1, "single_choice",
            "สิ่งใดใช้นอนหนุนศีรษะตอนนอนหลับบนเตียง?",
            "Worauf bettet man den Kopf beim Schlafen im Bett?",
            "Sing dai chai non nun sisa ton nonlap bon tiang?",
            [
                ["a", "หมอน", "Kissen", "Mon"],
                ["b", "ผ้าห่ม", "Bettdecke", "Phahom"],
                ["c", "โต๊ะ", "Tisch", "To"],
                ["d", "เก้าอี้", "Stuhl", "Kao-i"]
            ],
            "a",
            "หมอน (Mon) ช่วยรองรับศีรษะและลำคอให้หลับสบาย",
            "Das Kopfkissen heißt 'Mon'.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-046", "beginner_home", 1, "single_choice",
            "สิ่งใดใช้คลุมร่างกายเพื่อสร้างความอบอุ่นเวลานอน?",
            "Womit deckt man sich beim Schlafen zu, um warm zu bleiben?",
            "Sing dai chai khlum rangkai phuea sang khwam op-un wela non?",
            [
                ["a", "ผ้าห่ม", "Bettdecke", "Phahom"],
                ["b", "เสื่อ", "Matte", "Suea"],
                ["c", "พัดลม", "Ventilator", "Phatlom"],
                ["d", "เตียง", "Bett", "Tiang"]
            ],
            "a",
            "ผ้าห่ม (Phahom) ช่วยรักษาอุณหภูมิร่างกายขณะนอนหลับ",
            "Die Decke ('Phahom') hält nachts warm.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-047", "beginner_home", 1, "single_choice",
            "สิ่งของใดมีสี่ขาและมีหน้าโต๊ะเรียบสำหรับวางสิ่งของหรือเขียนหนังสือ?",
            "Was hat vier Beine und eine flache Platte zum Abstellen oder Schreiben?",
            "Singkhong dai mi si kha lae mi na to riap samrap wang singkhong rue khian nangsue?",
            [
                ["a", "โต๊ะ", "Tisch", "To"],
                ["b", "เก้าอี้", "Stuhl", "Kao-i"],
                ["c", "ตู้", "Schrank", "Tu"],
                ["d", "เตียง", "Bett", "Tiang"]
            ],
            "a",
            "โต๊ะ (To) ใช้สำหรับรับประทานอาหาร ทำงาน และวางสิ่งของ",
            "Der Tisch heißt 'To'.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-048", "beginner_home", 1, "single_choice",
            "สิ่งของใดมีพนักพิง ใช้สำหรับนั่งพักผ่อนหรือนั่งทำงาน?",
            "Worauf setzt man sich zum Ausruhen oder Arbeiten?",
            "Singkhong dai mi phnak phing chai samrap nang phakphon rue nang thamngan?",
            [
                ["a", "เก้าอี้", "Stuhl", "Kao-i"],
                ["b", "โต๊ะ", "Tisch", "To"],
                ["c", "หน้าต่าง", "Fenster", "Natang"],
                ["d", "ประตู", "Tür", "Pratu"]
            ],
            "a",
            "เก้าอี้ (Kao-i) ใช้สำหรับรองรับการนั่งของมนุษย์",
            "Der Stuhl heißt 'Kao-i'.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-049", "beginner_home", 1, "single_choice",
            "ช่องเปิดบนฝาผนังบ้านที่ใช้เปิดรับลมและแสงสว่างคืออะไร?",
            "Was ist die Wandöffnung, um Licht und frische Luft hereinzulassen?",
            "Chong poet bon phanang ban thi chai poet rap lom lae saeng sawang khue arai?",
            [
                ["a", "หน้าต่าง", "Fenster", "Natang"],
                ["b", "ประตู", "Tür", "Pratu"],
                ["c", "หลังคา", "Dach", "Langka"],
                ["d", "พื้น", "Boden", "Phuen"]
            ],
            "a",
            "หน้าต่าง (Natang) ช่วยให้อากาศและแสงสว่างถ่ายเทเข้าสู่ตัวบ้าน",
            "Das Fenster heißt 'Natang'.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-050", "beginner_home", 1, "single_choice",
            "อุปกรณ์ทำความเย็นในบ้านที่ใบพัดหมุนเป่าลมเย็นคืออะไร?",
            "Welches Gerät im Haus erzeugt mit drehenden Flügeln einen kühlen Luftzug?",
            "Uppakon tham khwam yen nai ban thi baiphat mun pao lom yen khue arai?",
            [
                ["a", "พัดลม", "Ventilator", "Phatlom"],
                ["b", "ตู้เย็น", "Kühlschrank", "Tuyen"],
                ["c", "ทีวี", "Fernseher", "Thiwi"],
                ["d", "เตาอบ", "Ofen", "Tao-op"]
            ],
            "a",
            "พัดลม (Phatlom) หมุนเวียนอากาศสร้างความเย็นสบายในบ้าน",
            "Der Ventilator heißt 'Phatlom'.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-051", "beginner_greetings", 2, "single_choice",
            "เมื่อคนไทยพบเจอกัน คำทักทายมาตรฐานที่สุภาพที่สุดคือคำใด?",
            "Was ist der universelle thailändische Höflichkeitsgruß bei einer Begegnung?",
            "Muea khon thai phop choe kan kham thakthai mattrathan thi suphap thi sut khue kham dai?",
            [
                ["a", "สวัสดี", "Sawatdi (Hallo / Guten Tag)", "Sawatdi"],
                ["b", "ขอบคุณ", "Khop khun (Danke)", "Khop khun"],
                ["c", "ขอโทษ", "Kho thot (Entschuldigung)", "Kho thot"],
                ["d", "ลาก่อน", "La kon (Auf Wiedersehen)", "La kon"]
            ],
            "a",
            "'สวัสดี' (Sawatdi) เป็นคำทักทายมาตรฐานที่ใช้ได้ทุกเวลา",
            "'Sawatdi' ist der allgegenwärtige Gruß zu jeder Tageszeit.",
            [{"title":"Royal Society of Thailand – Sawatdi","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-052", "beginner_greetings", 2, "single_choice",
            "เมื่อมีคนให้ความช่วยเหลือหรือมอบของขวัญให้ เราควรกล่าวคำใด?",
            "Was sagt man höflich, wenn jemand hilft oder etwas schenkt?",
            "Muea mi khon hai khwam chuailuea rue mop khongkhwan hai rao khuan klao kham dai?",
            [
                ["a", "ขอบคุณ", "Danke", "Khop khun"],
                ["b", "สวัสดี", "Hallo", "Sawatdi"],
                ["c", "ไม่เป็นไร", "Kein Problem", "Mai pen rai"],
                ["d", "ขอโทษ", "Entschuldigung", "Kho thot"]
            ],
            "a",
            "'ขอบคุณ' (Khop khun) ใช้แสดงความซาบซึ้งใจในน้ำใจของผู้อื่น",
            "'Khop khun' drückt Dankbarkeit und Wertschätzung aus.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-053", "beginner_greetings", 2, "single_choice",
            "ถ้าเราเผลอเดินชนผู้อื่น เราควรกล่าวคำสุภาพคำใดทันที?",
            "Was sagt man sofort, wenn man versehentlich jemanden anrempelt?",
            "Tha rao phloe doen chon phu uen rao khuan klao kham suphap kham dai thanthi?",
            [
                ["a", "ขอโทษ", "Entschuldigung", "Kho thot"],
                ["b", "ขอบคุณ", "Danke", "Khop khun"],
                ["c", "ยินดี", "Gern geschehen", "Yindi"],
                ["d", "สวัสดี", "Hallo", "Sawatdi"]
            ],
            "a",
            "'ขอโทษ' (Kho thot) ใช้ขออภัยเมื่อทำผิดพลาดหรือไม่สะดวกแก่ผู้อื่น",
            "'Kho thot' bedeutet Entschuldigung oder Verzeihung.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-054", "beginner_greetings", 2, "single_choice",
            "เมื่อมีคนกล่าวขอโทษหรือขอบคุณ เรามักตอบรับอย่างสุภาพด้วยคำใด?",
            "Was antwortet man freundlich auf ein Dankeschön oder eine Entschuldigung?",
            "Muea mi khon klao kho thot rue khop khun rao mak top rap yang suphap duai kham dai?",
            [
                ["a", "ไม่เป็นไร", "Gern geschehen / Kein Problem", "Mai pen rai"],
                ["b", "ลาก่อน", "Auf Wiedersehen", "La kon"],
                ["c", "ช่วยด้วย", "Hilfe", "Chuai duai"],
                ["d", "ใช่แล้ว", "Genau", "Chai laeo"]
            ],
            "a",
            "'ไม่เป็นไร' (Mai pen rai) สื่อถึงความใจกว้างและความสบายใจ",
            "'Mai pen rai' ist Thailands berühmte Redewendung für 'Kein Problem / Gern geschehen'.",
            [{"title":"Tourism Authority of Thailand – Culture","url":"https://www.tourismthailand.org/"}]
        ),
        makeQuestion(
            "thq-beg-055", "beginner_greetings", 2, "single_choice",
            "ผู้ชายไทยใช้คำลงท้ายประโยคเพื่อความสุภาพด้วยคำใด?",
            "Welche Höflichkeitspartikel nutzen thailändische Männer am Satzende?",
            "Phuchai thai chai kham longthai prayok phuea khwam suphap duai kham dai?",
            [
                ["a", "ครับ", "Khrap", "Khrap"],
                ["b", "ค่ะ", "Kha", "Kha"],
                ["c", "จ้ะ", "Cha", "Cha"],
                ["d", "นะ", "Na", "Na"]
            ],
            "a",
            "'ครับ' (Khrap) เป็นคำลงท้ายสุภาพของผู้ชาย",
            "Männer beenden Höflichkeitssätze typischerweise mit 'Khrap'.",
            [{"title":"Royal Society of Thailand – Grammar","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-056", "beginner_greetings", 2, "single_choice",
            "ผู้หญิงไทยใช้คำลงท้ายประโยคบอกเล่าอย่างสุภาพด้วยคำใด?",
            "Welche Höflichkeitspartikel nutzen Frauen am Satzende einer Aussage?",
            "Phuying thai chai kham longthai prayok boklao yang suphap duai kham dai?",
            [
                ["a", "ค่ะ", "Kha", "Kha"],
                ["b", "ครับ", "Khrap", "Khrap"],
                ["c", "ฮะ", "Ha", "Ha"],
                ["d", "วะ", "Wa", "Wa"]
            ],
            "a",
            "'ค่ะ' (Kha) เป็นคำลงท้ายสุภาพในประโยคบอกเล่าของผู้หญิง",
            "Frauen beenden Aussagen im Thailändischen mit 'Kha'.",
            [{"title":"Royal Society of Thailand – Grammar","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-057", "beginner_greetings", 2, "single_choice",
            "การไหว้ (Wai) ของคนไทยทำโดยการพนมมือไว้ที่ตำแหน่งใดเป็นหลัก?",
            "Wo werden beim thailändischen Wai die Hände zusammengelegt?",
            "Kan wai khong khon thai tham doi kan phanom mue wai thi tamnaeng dai pen lak?",
            [
                ["a", "พนมมือระดับอกหรือใบหน้า", "Vor Brust oder Gesicht", "Phanom mue radap ok rue bai na"],
                ["b", "ยกมือข้ามศีรษะ", "Über den Kopf", "Yok mue kham sisa"],
                ["c", "กางแขนออกสองข้าง", "Arme ausbreiten", "Kang khaen ok song khang"],
                ["d", "วางมือบนเข่า", "Hände auf die Knie", "Wang mue bon khao"]
            ],
            "a",
            "การไหว้เป็นการพนมมือสองข้างเข้าหากันที่ระดับอกหรือใบหน้าพร้อมก้มศีรษะ",
            "Der Wai wird ausgeführt, indem die Handflächen vor Brust oder Gesicht aneinandergelegt werden.",
            [{"title":"Ministry of Culture Thailand","url":"https://www.m-culture.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-058", "beginner_greetings", 2, "single_choice",
            "ก่อนจะเข้านอนในเวลากลางคืน เรานิยมอวยพรด้วยคำว่าอะไร?",
            "Was wünscht man sich abends vor dem Einschlafen?",
            "Kon cha khao non nai wela klangkhuen rao niyom uai phon duai kham wa arai?",
            [
                ["a", "ราตรีสวัสดิ์", "Gute Nacht", "Ratri sawat"],
                ["b", "อรุณสวัสดิ์", "Guten Morgen", "Arun sawat"],
                ["c", "โชคดี", "Viel Glück", "Chok di"],
                ["d", "ยินดีด้วย", "Herzlichen Glückwunsch", "Yindi duai"]
            ],
            "a",
            "'ราตรีสวัสดิ์' (Ratri sawat) หมายถึงขอให้มีความสุขสงบในคืนนี้",
            "'Ratri sawat' bedeutet wörtlich 'Gute Nacht'.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-059", "beginner_greetings", 2, "single_choice",
            "ในยามเช้าตรู่ คำทักทายที่เป็นทางการแปลว่า 'Guten Morgen' คือคำใด?",
            "Welcher Gruß bedeutet formell 'Guten Morgen'?",
            "Nai yam chao tru kham thakthai thi pen thangkan plae wa 'Guten Morgen' khue kham dai?",
            [
                ["a", "อรุณสวัสดิ์", "Guten Morgen", "Arun sawat"],
                ["b", "ราตรีสวัสดิ์", "Gute Nacht", "Ratri sawat"],
                ["c", "สายัณห์สวัสดิ์", "Guten Abend", "Sayan sawat"],
                ["d", "ลาก่อน", "Auf Wiedersehen", "La kon"]
            ],
            "a",
            "'อรุณสวัสดิ์' (Arun sawat) ใช้ทักทายอย่างเป็นทางการยามเช้า",
            "'Arun sawat' ist der thailändische Gruß für den frühen Morgen.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-060", "beginner_greetings", 2, "single_choice",
            "เมื่อต้องแยกย้ายจากเพื่อนและหวังว่าจะได้พบกันอีก เราควรพูดว่าอะไร?",
            "Was sagt man beim Verabschieden zu Freunden?",
            "Muea tong yaekyai chak phuean lae wang wa cha dai phop kan ik rao khuan phut wa arai?",
            [
                ["a", "แล้วเจอกันใหม่นะ", "Bis zum nächsten Mal / Bis bald", "Laeo choe kan mai na"],
                ["b", "ขอโทษนะ", "Entschuldige", "Kho thot na"],
                ["c", "หิวข้าวแล้ว", "Ich habe Hunger", "Hiu khao laeo"],
                ["d", "อร่อยมาก", "Sehr lecker", "Aroi mak"]
            ],
            "a",
            "'แล้วเจอกันใหม่' เป็นคำลาที่เป็นกันเองระหว่างเพื่อนฝูง",
            "'Laeo choe kan mai na' verabschiedet Freunde herzlich.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-061", "beginner_shopping", 2, "single_choice",
            "ถ้าต้องการถามราคาสินค้าในตลาดภาษาไทย ควรถามอย่างไร?",
            "Wie fragt man auf dem Markt auf Thai nach dem Preis?",
            "Tha tongkan tham rakha sinkha nai talat phasa thai khuan tham yangrai?",
            [
                ["a", "อันนี้ราคาเท่าไรครับ/ค่ะ?", "Wie viel kostet das?", "An ni rakha thao rai khrap/kha?"],
                ["b", "อันนี้ชื่ออะไร?", "Wie heißt das?", "An ni chue arai?"],
                ["c", "อยู่ที่ไหน?", "Wo ist das?", "Yu thi nai?"],
                ["d", "กินได้ไหม?", "Kann man das essen?", "Kin dai mai?"]
            ],
            "a",
            "'ราคาเท่าไร' เป็นคำถามมาตรฐานในการสอบถามราคาสินค้า",
            "'Rakha thao rai?' fragt direkt nach dem Preis einer Ware.",
            [{"title":"Ministry of Commerce Thailand","url":"https://www.moc.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-062", "beginner_shopping", 2, "single_choice",
            "คำว่า 'ลดราคาได้ไหม?' ใช้ในสถานการณ์ใดเมื่อซื้อของ?",
            "In welcher Situation sagt man 'Lot rakha dai mai?'?",
            "Kham wa 'lot rakha dai mai?' chai nai sathanakan dai muea sue khong?",
            [
                ["a", "ขอต่อรองราคาให้ถูกลง", "Nach einem Rabatt fragen", "Kho to rong rakha hai thuk long"],
                ["b", "ขอซื้อเพิ่มอีกชิ้น", "Mehr kaufen", "Kho sue phoem ik chin"],
                ["c", "ขอคืนสินค้าที่เสีย", "Ware zurückgeben", "Kho khuen sinkha thi sia"],
                ["d", "ถามหาห้องน้ำ", "Nach der Toilette fragen", "Tham ha hongnam"]
            ],
            "a",
            "'ลดได้ไหม' เป็นสำนวนขอส่วนลดในการซื้อขายตามตลาดสด",
            "'Lot dai mai?' ist die gängige Frage nach einem Preisnachlass.",
            [{"title":"Tourism Authority of Thailand – Shopping","url":"https://www.tourismthailand.org/"}]
        ),
        makeQuestion(
            "thq-beg-063", "beginner_shopping", 2, "single_choice",
            "สกุลเงินประจำชาติของประเทศไทยเรียกว่าอะไร?",
            "Wie heißt die Währungseinheit Thailands?",
            "Sakun ngoen pracham chat khong prathet Thai riak wa arai?",
            [
                ["a", "บาท", "Baht", "Baht"],
                ["b", "ดอลลาร์", "Dollar", "Donla"],
                ["c", "กีบ", "Kip", "Kip"],
                ["d", "ยูโร", "Euro", "Yuro"]
            ],
            "a",
            "เงินบาท (Baht) เป็นเงินตราทางการของประเทศไทย",
            "Die Währung Thailands ist der Baht (THB).",
            [{"title":"Bank of Thailand","url":"https://www.bot.or.th/"}]
        ),
        makeQuestion(
            "thq-beg-064", "beginner_shopping", 2, "single_choice",
            "ธนบัตรใบละ 20 บาทของไทยมีสีอะไรเป็นเอกลักษณ์?",
            "Welche Farbe hat der thailändische 20-Baht-Schein?",
            "Thanabat bai la 20 baht khong thai mi si arai pen ekkalak?",
            [
                ["a", "สีเขียว", "Grün", "Si khiao"],
                ["b", "สีแดง", "Rot", "Si daeng"],
                ["c", "สีน้ำเงิน", "Blau", "Si namngoen"],
                ["d", "สีม่วง", "Lila", "Si muang"]
            ],
            "a",
            "ธนบัตร 20 บาทของไทยพิมพ์ด้วยหมึกโทนสีเขียว",
            "Der 20-Baht-Schein in Thailand ist grün gestaltet.",
            [{"title":"Bank of Thailand – Banknotes","url":"https://www.bot.or.th/"}]
        ),
        makeQuestion(
            "thq-beg-065", "beginner_shopping", 2, "single_choice",
            "ธนบัตรใบละ 100 บาทของไทยมีสีอะไร?",
            "Welche Farbe hat der 100-Baht-Schein?",
            "Thanabat bai la 100 baht khong thai mi si arai?",
            [
                ["a", "สีแดง", "Rot", "Si daeng"],
                ["b", "สีเขียว", "Grün", "Si khiao"],
                ["c", "สีเทา", "Grau", "Si thao"],
                ["d", "สีเหลือง", "Gelb", "Si lueang"]
            ],
            "a",
            "ธนบัตร 100 บาทของไทยมีสีแดงสดใสจดจำง่าย",
            "Der thailändische 100-Baht-Schein ist rot gehalten.",
            [{"title":"Bank of Thailand – Banknotes","url":"https://www.bot.or.th/"}]
        ),
        makeQuestion(
            "thq-beg-066", "beginner_shopping", 2, "single_choice",
            "ธนบัตรที่มีมูลค่าสูงที่สุดในปัจจุบันของไทยคือใบละเท่าไร?",
            "Was ist der höchste thailändische Geldschein?",
            "Thanabat thi mi munkha sung thi sut nai patchuban khong thai khue bai la thao rai?",
            [
                ["a", "1,000 บาท", "1.000 Baht", "Nueng phan baht"],
                ["b", "500 บาท", "500 Baht", "Ha roi baht"],
                ["c", "100 บาท", "100 Baht", "Nueng roi baht"],
                ["d", "5,000 บาท", "5.000 Baht", "Ha phan baht"]
            ],
            "a",
            "ธนบัตรชนิดราคา 1,000 บาท มีมูลค่าสูงสุดในการหมุนเวียน",
            "Der 1.000-Baht-Schein ist die Banknote mit dem höchsten Wert.",
            [{"title":"Bank of Thailand – Banknotes","url":"https://www.bot.or.th/"}]
        ),
        makeQuestion(
            "thq-beg-067", "beginner_shopping", 2, "single_choice",
            "ถ้าของชิ้นหนึ่งราคา 'แพงมาก' หมายความว่าอย่างไร?",
            "Was bedeutet es, wenn eine Ware 'Phaeng mak' ist?",
            "Tha khong chin nueng rakha 'phaeng mak' maikhwam wa yangrai?",
            [
                ["a", "ราคาสูงมาก ไม่ถูก", "Sehr teuer", "Rakha sung mak mai thuk"],
                ["b", "ราคาถูกมาก", "Sehr billig", "Rakha thuk mak"],
                ["c", "ขนาดใหญ่มาก", "Riesig groß", "Khanat yai mak"],
                ["d", "สวยงามมาก", "Sehr schön", "Suai-ngam mak"]
            ],
            "a",
            "'แพง' (Phaeng) หมายถึงสิ่งของที่มีราคาสูงเกินไป",
            "'Phaeng mak' beschreibt einen sehr hohen Preis.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-068", "beginner_shopping", 2, "single_choice",
            "คำตรงข้ามกับคำว่า 'แพง' ในภาษาไทยคือคำใด?",
            "Was ist das Gegenteil von 'teuer' (แพง)?",
            "Kham trongkham kap kham wa 'phaeng' nai phasa thai khue kham dai?",
            [
                ["a", "ถูก", "Günstig / Billig", "Thuk"],
                ["b", "ดี", "Gut", "Di"],
                ["c", "สวย", "Schön", "Suai"],
                ["d", "ร้อน", "Heiß", "Ron"]
            ],
            "a",
            "'ถูก' (Thuk) เป็นคำตรงข้ามกับคำว่าแพง แปลว่าราคาเยา",
            "'Thuk' bedeutet preiswert, günstig oder billig.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-069", "beginner_shopping", 2, "single_choice",
            "เมื่อซื้อของเสร็จและจ่ายเงินแล้ว คนขายจะทอนสิ่งใดกลับมาหากเราจ่ายเกิน?",
            "Was gibt der Verkäufer zurück, wenn man mit einem größeren Schein zahlt?",
            "Muea sue khong set lae chai ngoen laeo khon khai cha thon sing dai klap ma hak rao chai koen?",
            [
                ["a", "เงินทอน", "Wechselgeld", "Ngoen thon"],
                ["b", "ใบสั่ง", "Strafzettel", "Bai sang"],
                ["c", "ถุงขยะ", "Mülltüte", "Thung khaya"],
                ["d", "อาหารแถม", "Gratisessen", "Ahan thaem"]
            ],
            "a",
            "'เงินทอน' คือเงินส่วนที่จ่ายเกินราคาแล้วผู้ขายคืนให้",
            "'Ngoen thon' ist das Wechselgeld beim Einkaufen.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-070", "beginner_shopping", 2, "single_choice",
            "เอกสารใบเล็กๆ ที่พิมพ์รายการสินค้าและราคาเพื่อเป็นหลักฐานการซื้อเรียกว่าอะไร?",
            "Wie heißt der gedruckte Kassenbeleg als Kaufnachweis?",
            "Ekkasan bai lek lek thi phim raikan sinkha lae rakha phuea pen lakthan kan sue riak wa arai?",
            [
                ["a", "ใบเสร็จ", "Quittung / Kassenbon", "Bai set"],
                ["b", "ปฏิทิน", "Kalender", "Patithin"],
                ["c", "แผนที่", "Landkarte", "Phaenthi"],
                ["d", "การ์ด", "Karte", "Kat"]
            ],
            "a",
            "'ใบเสร็จรับเงิน' หรือใบเสร็จเป็นหลักฐานการชำระเงิน",
            "'Bai set' ist die Quittung bzw. der Kassenbon.",
            [{"title":"Revenue Department Thailand","url":"https://www.rd.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-071", "beginner_time", 2, "single_choice",
            "หนึ่งสัปดาห์มีทั้งหมดกี่วัน?",
            "Wie viele Tage hat eine Woche?",
            "Nueng sapda mi thang mot ki wan?",
            [
                ["a", "เจ็ดวัน", "7 Tage", "Chet wan"],
                ["b", "ห้าวัน", "5 Tage", "Ha wan"],
                ["c", "สิบวัน", "10 Tage", "Sip wan"],
                ["d", "หกวัน", "6 Tage", "Hok wan"]
            ],
            "a",
            "1 สัปดาห์หรือ 1 อาทิตย์ ประกอบด้วย 7 วัน",
            "Eine Woche umfasst 7 Tage ('Chet wan').",
            [{"title":"Royal Society of Thailand – Calendar","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-072", "beginner_time", 2, "single_choice",
            "วันแรกของการทำงานในสัปดาห์คือวันใด?",
            "Welcher Tag ist der erste Arbeitstag der Woche?",
            "Wan raek khong kan thamngan nai sapda khue wan dai?",
            [
                ["a", "วันจันทร์", "Montag", "Wan chan"],
                ["b", "วันเสาร์", "Samstag", "Wan sao"],
                ["c", "วันอาทิตย์", "Sonntag", "Wan athit"],
                ["d", "วันพุธ", "Mittwoch", "Wan phut"]
            ],
            "a",
            "วันจันทร์ (Wan chan) เป็นวันเริ่มต้นสัปดาห์ของการทำงาน",
            "Der Montag ('Wan chan') eröffnet die Arbeitswoche.",
            [{"title":"Royal Society of Thailand – Calendar","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-073", "beginner_time", 2, "single_choice",
            "วันหยุดสุดสัปดาห์ของคนส่วนใหญ่ประกอบด้วยวันใดบ้าง?",
            "Aus welchen beiden Tagen besteht das Wochenende gewöhnlich?",
            "Wan yut sut sapda khong khon suanyai prakop duai wan dai bang?",
            [
                ["a", "วันเสาร์และวันอาทิตย์", "Samstag & Sonntag", "Wan sao lae wan athit"],
                ["b", "วันจันทร์และวันอังคาร", "Montag & Dienstag", "Wan chan lae wan angkhan"],
                ["c", "วันพุธและวันพฤหัสบดี", "Mittwoch & Donnerstag", "Wan phut lae wan phruehatsabodi"],
                ["d", "วันพฤหัสบดีและวันศุกร์", "Donnerstag & Freitag", "Wan phruehatsabodi lae wan suk"]
            ],
            "a",
            "วันเสาร์และวันอาทิตย์เป็นวันหยุดสุดสัปดาห์สากล",
            "Das Wochenende umfasst Samstag ('Wan sao') und Sonntag ('Wan athit').",
            [{"title":"Ministry of Labour Thailand","url":"https://www.mol.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-074", "beginner_time", 2, "single_choice",
            "เวลาเที่ยงตรงที่ดวงอาทิตย์อยู่ตรงศีรษะคือเวลากี่นาฬิกา?",
            "Wie viel Uhr ist es genau am Mittag?",
            "Wela thiang trong thi duang athit yu trong sisa khue wela ki nalika?",
            [
                ["a", "12:00 น.", "12:00 Uhr (Mittag)", "Sip song nalika"],
                ["b", "06:00 น.", "06:00 Uhr", "Hok nalika"],
                ["c", "18:00 น.", "18:00 Uhr", "Sip hok nalika"],
                ["d", "24:00 น.", "24:00 Uhr", "Yi sip si nalika"]
            ],
            "a",
            "เวลา 12:00 น. เรียกว่าเวลาเที่ยงวัน",
            "12:00 Uhr ist der genaue Mittag ('Thiang wan').",
            [{"title":"National Institute of Metrology Thailand","url":"https://www.nimt.or.th/"}]
        ),
        makeQuestion(
            "thq-beg-075", "beginner_time", 2, "single_choice",
            "หนึ่งชั่วโมงมีทั้งหมดกี่นาที?",
            "Wie viele Minuten hat eine Stunde?",
            "Nueng chuamong mi thang mot ki nathi?",
            [
                ["a", "60 นาที", "60 Minuten", "Hok sip nathi"],
                ["b", "100 นาที", "100 Minuten", "Nueng roi nathi"],
                ["c", "30 นาที", "30 Minuten", "Sam sip nathi"],
                ["d", "24 นาที", "24 Minuten", "Yi sip si nathi"]
            ],
            "a",
            "1 ชั่วโมง แบ่งออกเป็น 60 นาที",
            "Eine Stunde besteht aus 60 Minuten ('Hok sip nathi').",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-076", "beginner_time", 2, "single_choice",
            "หนึ่งวันเต็มมีทั้งหมดกี่ชั่วโมง?",
            "Wie viele Stunden hat ein ganzer Tag?",
            "Nueng wan tem mi thang mot ki chuamong?",
            [
                ["a", "24 ชั่วโมง", "24 Stunden", "Yi sip si chuamong"],
                ["b", "12 ชั่วโมง", "12 Stunden", "Sip song chuamong"],
                ["c", "60 ชั่วโมง", "60 Stunden", "Hok sip chuamong"],
                ["d", "48 ชั่วโมง", "48 Stunden", "Si sip paet chuamong"]
            ],
            "a",
            "โลกหมุนรอบตัวเองหนึ่งรอบใช้เวลาประมาณ 24 ชั่วโมง หรือ 1 วัน",
            "Ein Tag hat 24 Stunden ('Yi sip si chuamong').",
            [{"title":"National Astronomical Research Institute of Thailand","url":"https://www.narit.or.th/"}]
        ),
        makeQuestion(
            "thq-beg-077", "beginner_time", 2, "single_choice",
            "สิ่งใดที่เราใช้แขวนผนังหรือดูเพื่อตรวจสอบวันที่และเดือน?",
            "Was hängt an der Wand, um Datum und Monat abzulesen?",
            "Sing dai thi rao chai khwaen phanang rue du phuea truat sop wan thi lae duean?",
            [
                ["a", "ปฏิทิน", "Kalender", "Patithin"],
                ["b", "นาฬิกาปลุก", "Wecker", "Nalika pluk"],
                ["c", "กระจก", "Spiegel", "Krachok"],
                ["d", "รูปถ่าย", "Foto", "Rup thai"]
            ],
            "a",
            "ปฏิทิน (Patithin) แสดงวัน สัปดาห์ และเดือนของแต่ละปี",
            "Der Kalender ('Patithin') zeigt Tage, Wochen und Monate.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-078", "beginner_time", 2, "single_choice",
            "คำว่า 'พรุ่งนี้' หมายถึงเวลาช่วงใด?",
            "Welcher Tag ist mit 'Phrung ni' gemeint?",
            "Kham wa 'phrung ni' maikhwam wa wela chuang dai?",
            [
                ["a", "วันถัดไปจากวันนี้", "Morgen", "Wan that pai chak wan ni"],
                ["b", "วันก่อนหน้านี้", "Gestern", "Wan kon na ni"],
                ["c", "วันนี้", "Heute", "Wan ni"],
                ["d", "ปีหน้า", "Nächstes Jahr", "Pi na"]
            ],
            "a",
            "'พรุ่งนี้' หมายถึงวันรุ่งขึ้นหลังจากวันนี้",
            "'Phrung ni' bedeutet 'Morgen' (der nächste Tag).",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-079", "beginner_time", 2, "single_choice",
            "คำว่า 'เมื่อวาน' หมายถึงเวลาช่วงใด?",
            "Welcher Tag ist mit 'Muea wan' gemeint?",
            "Kham wa 'muea wan' maikhwam wa wela chuang dai?",
            [
                ["a", "วันที่ผ่านมาแล้วก่อนวันนี้", "Gestern", "Wan thi phan ma laeo kon wan ni"],
                ["b", "วันพรุ่งนี้", "Morgen", "Wan phrung ni"],
                ["c", "วันนี้", "Heute", "Wan ni"],
                ["d", "สัปดาห์หน้า", "Nächste Woche", "Sapda na"]
            ],
            "a",
            "'เมื่อวาน' หรือเมื่อวานนี้ คือวันที่เพิ่งผ่านพ้นไปก่อนวันนี้",
            "'Muea wan' bedeutet 'Gestern'.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-080", "beginner_time", 2, "single_choice",
            "หนึ่งปีตามปฏิทินสุริยคติสากลมีทั้งหมดกี่เดือน?",
            "Wie viele Monate hat ein Kalenderjahr?",
            "Nueng pi tam patithin suriyakhati sakon mi thang mot ki duean?",
            [
                ["a", "12 เดือน", "12 Monate", "Sip song duean"],
                ["b", "10 เดือน", "10 Monate", "Sip duean"],
                ["c", "7 เดือน", "7 Monate", "Chet duean"],
                ["d", "24 เดือน", "24 Monate", "Yi sip si duean"]
            ],
            "a",
            "1 ปี มี 12 เดือน เริ่มตั้งแต่มกราคมถึงธันวาคม",
            "Ein Kalenderjahr umfasst 12 Monate ('Sip song duean').",
            [{"title":"Royal Society of Thailand – Calendar","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-081", "beginner_transport", 2, "single_choice",
            "ถ้าต้องการบอกให้คนขับรถเลี้ยวไปทางซ้ายมือ ควรพูดคำว่าอะไร?",
            "Was sagt man dem Fahrer, wenn er nach links abbiegen soll?",
            "Tha tongkan bok hai khon khap rot liao pai thang sai mue khuan phut kham wa arai?",
            [
                ["a", "เลี้ยวซ้าย", "Nach links abbiegen", "Liao sai"],
                ["b", "เลี้ยวขวา", "Nach rechts abbiegen", "Liao khwa"],
                ["c", "ตรงไป", "Geradeaus fahren", "Trong pai"],
                ["d", "หยุดรถ", "Anhalten", "Yut rot"]
            ],
            "a",
            "'เลี้ยวซ้าย' (Liao sai) สั่งให้เลี้ยวไปทิศทางด้านซ้าย",
            "'Liao sai' bedeutet 'Links abbiegen'.",
            [{"title":"Department of Land Transport Thailand","url":"https://www.dlt.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-082", "beginner_transport", 2, "single_choice",
            "ถ้าต้องการบอกให้คนขับรถขับตรงไปข้างหน้า ไม่เลี้ยว ควรพูดว่าอะไร?",
            "Was sagt man, um geradeaus weiterzufahren?",
            "Tha tongkan bok hai khon khap rot khap trong pai khang na mai liao khuan phut wa arai?",
            [
                ["a", "ตรงไป", "Geradeaus", "Trong pai"],
                ["b", "เลี้ยวซ้าย", "Links", "Liao sai"],
                ["c", "กลับรถ", "Wenden", "Klap rot"],
                ["d", "ถอยหลัง", "Rückwärts", "Thoi lang"]
            ],
            "a",
            "'ตรงไป' (Trong pai) สื่อถึงการมุ่งหน้าต่อไปตามแนวถนน",
            "'Trong pai' bedeutet 'Geradeaus'.",
            [{"title":"Department of Land Transport Thailand","url":"https://www.dlt.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-083", "beginner_transport", 2, "single_choice",
            "สัญญาณไฟจราจรสีแดงมีความหมายว่าอย่างไรสำหรับผู้ขับขี่?",
            "Was bedeutet die rote Ampel im Straßenverkehr?",
            "Sanyan fai charachon si daeng mi khwammai wa yangrai samrap phu khapkhi?",
            [
                ["a", "ให้หยุดรถ", "Anhalten", "Hai yut rot"],
                ["b", "ให้ขับต่อไปได้", "Weiterfahren", "Hai khap toi pai dai"],
                ["c", "ให้เลี้ยวซ้าย", "Links abbiegen", "Hai liao sai"],
                ["d", "ให้เร่งความเร็ว", "Beschleunigen", "Hai reng khwamreo"]
            ],
            "a",
            "ไฟสีแดงหมายถึงสัญญาณบังคับให้รถทุกคันหยุดหลังเส้นจราจร",
            "Rot bedeutet im Verkehr ausnahmslos 'Stopp' bzw. 'Anhalten'.",
            [{"title":"Royal Thai Police – Traffic","url":"https://www.royalthaipolice.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-084", "beginner_transport", 2, "single_choice",
            "สัญญาณไฟจราจรสีเขียวมีความหมายว่าอย่างไร?",
            "Was signalisiert die grüne Ampel?",
            "Sanyan fai charachon si khiao mi khwammai wa yangrai?",
            [
                ["a", "ให้ขับผ่านไปได้", "Freie Fahrt", "Hai khap phan pai dai"],
                ["b", "ให้หยุดทันที", "Sofort stoppen", "Hai yut thanthi"],
                ["c", "ให้จอดพัก", "Parken", "Hai chot phak"],
                ["d", "ให้ระวังอันตราย", "Gefahr", "Hai rawang antarai"]
            ],
            "a",
            "ไฟเขียวอนุญาตให้ยานพาหนะเคลื่อนผ่านทางแยกได้อย่างปลอดภัย",
            "Grün signalisiert freie Fahrt.",
            [{"title":"Royal Thai Police – Traffic","url":"https://www.royalthaipolice.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-085", "beginner_transport", 2, "single_choice",
            "ยานพาหนะสองล้อที่ขับเคลื่อนด้วยการปั่นลูกถีบคืออะไร?",
            "Welches zweirädrige Gefährt bewegt man mit Pedalen fort?",
            "Yanphahana song lo thi khapkhluean duai kan pan lukthip khue arai?",
            [
                ["a", "จักรยาน", "Fahrrad", "Chakkrayan"],
                ["b", "มอเตอร์ไซค์", "Motorrad", "Mōtœesai"],
                ["c", "รถยนต์", "Auto", "Rotyon"],
                ["d", "รถเมล์", "Bus", "Rot me"]
            ],
            "a",
            "จักรยาน (Chakkrayan) เป็นยานพาหนะสองล้อไร้เครื่องยนต์",
            "Das Fahrrad ('Chakkrayan') wird mit Pedalkraft angetrieben.",
            [{"title":"Department of Physical Education","url":"https://www.dpe.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-086", "beginner_transport", 2, "single_choice",
            "รถโดยสารประจำทางคันใหญ่ที่รับส่งผู้โดยสารตามป้ายรถเมล์เรียกว่าอะไร?",
            "Wie heißt der große Linienbus im Nahverkehr?",
            "Rot doisan pracham thang khan yai thi rap song phudoisan tam pai rot me riak wa arai?",
            [
                ["a", "รถเมล์ / รถบัส", "Linienbus", "Rot me / Rot bat"],
                ["b", "รถไฟเหาะ", "Achterbahn", "Rot fai ho"],
                ["c", "รถแท็กซี่", "Taxi", "Rot thaeksi"],
                ["d", "เรือพาย", "Ruderboot", "Ruea phai"]
            ],
            "a",
            "รถเมล์เป็นระบบขนส่งมวลชนบนท้องถนนที่ให้บริการประชาชน",
            "Der Linienbus wird in Thailand als 'Rot me' bezeichnet.",
            [{"title":"Bangkok Mass Transit Authority","url":"https://www.bmta.co.th/"}]
        ),
        makeQuestion(
            "thq-beg-087", "beginner_transport", 2, "single_choice",
            "ทางข้ามถนนที่มีแถบสีขาวดำทาบนพื้นถนนเพื่อให้คนเดินข้ามเรียกว่าอะไร?",
            "Wie heißt der Zebrastreifen zum sicheren Überqueren der Straße?",
            "Thang kham thanon thi mi thaep si khao dam tha bon phuen thanon phuea hai khon doen kham riak wa arai?",
            [
                ["a", "ทางม้าลาย", "Zebrastreifen", "Thang ma lai"],
                ["b", "ทางด่วน", "Autobahn", "Thang duan"],
                ["c", "สะพานแขวน", "Hängebrücke", "Saphan khwaen"],
                ["d", "อุโมงค์", "Tunnel", "Umong"]
            ],
            "a",
            "ทางม้าลาย (Thang ma lai) ออกแบบไว้เพื่อความปลอดภัยของคนเดินเท้า",
            "Der Zebrastreifen heißt auf Thai wörtlich 'Zebrastreifen' ('Thang ma lai').",
            [{"title":"Department of Highways Thailand","url":"https://www.doh.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-088", "beginner_transport", 2, "single_choice",
            "สะพานคนเดินข้ามที่สร้างยกระดับข้ามถนนใหญ่เพื่อความปลอดภัยเรียกว่าอะไร?",
            "Wie heißt die Fußgängerüberführung über breite Straßen?",
            "Saphan khon doen kham thi sang yok radap kham thanon yai phuea khwam plotphai riak wa arai?",
            [
                ["a", "สะพานลอย", "Fußgängerbrücke", "Saphan loi"],
                ["b", "บันไดเลื่อน", "Rolltreppe", "Bandai luean"],
                ["c", "ลิฟต์", "Aufzug", "Lip"],
                ["d", "ทางม้าลาย", "Zebrastreifen", "Thang ma lai"]
            ],
            "a",
            "สะพานลอย (Saphan loi) ช่วยให้คนเดินข้ามถนนใหญ่ได้โดยไม่ต้องตัดกระแสรถ",
            "Die Fußgängerbrücke heißt 'Saphan loi'.",
            [{"title":"Department of Highways Thailand","url":"https://www.doh.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-089", "beginner_transport", 2, "single_choice",
            "สถานที่สำหรับจอดรอขึ้นเครื่องบินเพื่อเดินทางไกลคือที่ใด?",
            "Wo steigt man in Flugzeuge ein?",
            "Sathanthi samrap chot ro khuen khrueangbin phuea doen thang klai khue thi dai?",
            [
                ["a", "สนามบิน", "Flughafen", "Sanam bin"],
                ["b", "ท่าเรือ", "Hafen", "Tha ruea"],
                ["c", "สถานีรถไฟ", "Bahnhof", "Sathani rotfai"],
                ["d", "อู่ซ่อมรถ", "Werkstatt", "U som rot"]
            ],
            "a",
            "สนามบินหรือท่าอากาศยานเป็นจุดขึ้นลงของเครื่องบินพาณิชย์",
            "Der Flughafen heißt auf Thai 'Sanam bin'.",
            [{"title":"Airports of Thailand","url":"https://www.mot.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-090", "beginner_transport", 2, "single_choice",
            "ยานพาหนะที่แล่นอยู่บนรางเหล็กยาวเชื่อมต่อระหว่างจังหวัดคืออะไร?",
            "Welches Verkehrsmittel fährt auf Schienen zwischen Städten?",
            "Yanphahana thi laen yu bon rang lek yao chueamtɔ rawang changwat khue arai?",
            [
                ["a", "รถไฟ", "Zug / Eisenbahn", "Rotfai"],
                ["b", "รถตู้", "Minivan", "Rot tu"],
                ["c", "เครื่องบิน", "Flugzeug", "Khrueangbin"],
                ["d", "เรือยนต์", "Motorboot", "Ruea yon"]
            ],
            "a",
            "รถไฟ (Rotfai) วิ่งบนรางเหล็กเพื่อขนส่งผู้โดยสารและสินค้า",
            "Der Zug ('Rotfai') verbindet Provinzen auf dem Schienennetz.",
            [{"title":"State Railway of Thailand","url":"https://www.railway.co.th/"}]
        ),
        makeQuestion(
            "thq-beg-091", "beginner_health", 2, "single_choice",
            "เมื่อรู้สึกไม่สบาย ปวดหัว หรือมีไข้ เราควรไปพบใคร?",
            "Wen sucht man auf, wenn man krank ist oder Fieber hat?",
            "Muea rusuek mai sabai puat hua rue mi khai rao khuan pai phop khrai?",
            [
                ["a", "หมอ / แพทย์", "Arzt", "Mo / Phaet"],
                ["b", "ตำรวจ", "Polizist", "Tamruat"],
                ["c", "ครู", "Lehrer", "Khru"],
                ["d", "ช่างไฟ", "Elektriker", "Chang fai"]
            ],
            "a",
            "แพทย์หรือหมอเป็นผู้ตรวจวินิจฉัยและรักษาอาการเจ็บป่วย",
            "Der Arzt ('Mo' / 'Phaet') behandelt Erkrankungen.",
            [{"title":"Ministry of Public Health Thailand","url":"https://www.moph.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-092", "beginner_health", 2, "single_choice",
            "สถานที่ที่มีแพทย์ พยาบาล และเตียงรักษาคนป่วยเรียกว่าอะไร?",
            "Wo arbeiten Ärzte und Pflegekräfte, um Kranke zu behandeln?",
            "Sathanthi thi mi phaet phayaban lae tiang raksa khon puai riak wa arai?",
            [
                ["a", "โรงพยาบาล", "Krankenhaus", "Rongphayaban"],
                ["b", "โรงเรียน", "Schule", "Rongrian"],
                ["c", "โรงแรม", "Hotel", "Rongraem"],
                ["d", "ตลาดสด", "Markt", "Talat sot"]
            ],
            "a",
            "โรงพยาบาล (Rongphayaban) เป็นสถานพยาบาลที่ให้การดูแลรักษาผู้ป่วย",
            "Das Krankenhaus heißt 'Rongphayaban'.",
            [{"title":"Ministry of Public Health Thailand","url":"https://www.moph.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-093", "beginner_health", 2, "single_choice",
            "ร้านที่จำหน่ายยาและมีเภสัชกรคอยให้คำแนะนำเรียกว่าอะไร?",
            "Wo kauft man Medikamente bei einer Fachberatung?",
            "Ran thi chamnai ya lae mi phesatchakon khoi hai khamnaenam riak wa arai?",
            [
                ["a", "ร้านขายยา", "Apotheke", "Ran khai ya"],
                ["b", "ร้านหนังสือ", "Buchhandlung", "Ran nangsue"],
                ["c", "ร้านตัดผม", "Friseursalon", "Ran tat phom"],
                ["d", "ร้านกาแฟ", "Café", "Ran kafae"]
            ],
            "a",
            "ร้านขายยา (Ran khai ya) จำหน่ายยารักษาโรคและอุปกรณ์การแพทย์",
            "Die Apotheke heißt 'Ran khai ya'.",
            [{"title":"Food and Drug Administration Thailand","url":"https://www.fda.moph.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-094", "beginner_health", 2, "single_choice",
            "เมื่อมีอาการกระหายน้ำในวันที่อากาศร้อน เราควรดื่มสิ่งใดมากที่สุด?",
            "Was sollte man an heißen Tagen bei Durst am meisten trinken?",
            "Muea mi akan krahai nam nai wan thi akat ron rao khuan duem sing dai mak thi sut?",
            [
                ["a", "น้ำเปล่าสะอาด", "Sauberes Trinkwasser", "Nam plao saat"],
                ["b", "กาแฟเข้ม", "Starker Kaffee", "Kafae khem"],
                ["c", "น้ำหวานจัด", "Zuckergetränke", "Nam wan chat"],
                ["d", "น้ำแข็งเปล่า", "Nur Eiswürfel", "Namkhaeng plao"]
            ],
            "a",
            "น้ำเปล่าช่วยทดแทนเหงื่อและป้องกันภาวะขาดน้ำในร่างกาย",
            "Trinkwasser beugt Dehydrierung bei Hitze vor.",
            [{"title":"Department of Health Thailand","url":"https://anamai.moph.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-095", "beginner_health", 2, "single_choice",
            "อุปกรณ์ที่เราใช้แปรงฟันร่วมกับยาสีฟันทุกเช้าเย็นคืออะไร?",
            "Was benutzt man zusammen mit Zahnpasta zum Zähneputzen?",
            "Uppakon thi rao chai praeng fan ruam kap yasifan thuk chao yen khue arai?",
            [
                ["a", "แปรงสีฟัน", "Zahnbürste", "Praengsifan"],
                ["b", "หวี", "Kamm", "Wii"],
                ["c", "ช้อน", "Löffel", "Chon"],
                ["d", "กรรไกร", "Schere", "Kankrai"]
            ],
            "a",
            "แปรงสีฟัน (Praengsifan) ช่วยทำความสะอาดผิวฟันและซอกฟัน",
            "Die Zahnbürste heißt 'Praengsifan'.",
            [{"title":"Dental Association of Thailand","url":"https://www.thaidental.or.th/"}]
        ),
        makeQuestion(
            "thq-beg-096", "beginner_health", 2, "single_choice",
            "สิ่งที่ใช้ถูตัวเวลาอาบน้ำเพื่อชำระล้างคราบไคลและแบคทีเรียคืออะไร?",
            "Womit wäscht man sich beim Duschen, um sauber zu werden?",
            "Sing thi chai thu tua wela apnam phuea chamra lang khrap khai lae baekthiria khue arai?",
            [
                ["a", "สบู่", "Seife", "Sabu"],
                ["b", "ยาสีฟัน", "Zahnpasta", "Yasifan"],
                ["c", "น้ำยาทาเล็บ", "Nagellack", "Namyathalep"],
                ["d", "น้ำมันพืช", "Pflanzenöl", "Nammanphuet"]
            ],
            "a",
            "สบู่ (Sabu) ช่วยขจัดสิ่งสกปรกและไขมันออกจากผิวหนัง",
            "Seife ('Sabu') reinigt die Haut beim Duschen.",
            [{"title":"Ministry of Public Health Thailand","url":"https://www.moph.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-097", "beginner_health", 2, "single_choice",
            "อุปกรณ์ที่มีซี่ถี่ๆ ใช้สำหรับจัดแต่งทรงผมให้เรียบร้อยคืออะไร?",
            "Welches Utensil mit Zinken nutzt man, um Haare zu kämmen?",
            "Uppakon thi mi si thi thi chai samrap chat taeng song phom hai riaproi khue arai?",
            [
                ["a", "หวี", "Kamm", "Wii"],
                ["b", "มีด", "Messer", "Mit"],
                ["c", "ส้อม", "Gabel", "Som"],
                ["d", "แปรงทาสี", "Pinsel", "Praengthasi"]
            ],
            "a",
            "หวี (Wii) ช่วยสางเส้นผมไม่ให้พันกันและจัดทรงผมให้สวยงาม",
            "Der Kamm heißt 'Wii'.",
            [{"title":"Royal Society of Thailand – Dictionary","url":"https://dictionary.orst.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-098", "beginner_health", 2, "single_choice",
            "เมื่อรู้สึกเหนื่อยล้าจากการทำงานมาทั้งวัน ร่างกายต้องการสิ่งใดมากที่สุด?",
            "Was braucht der Körper nach einem anstrengenden Tag am meisten?",
            "Muea rusuek nueailai chak kan thamngan ma thang wan rangkai tongkan sing dai mak thi sut?",
            [
                ["a", "การพักผ่อนนอนหลับ", "Schlaf und Erholung", "Kan phakphon nonlap"],
                ["b", "วิ่งออกกำลังกายหนัก", "Schweren Sport", "Wing okkamlangkai nak"],
                ["c", "เล่นเกมดึก", "Langes Zocken", "Len kem duek"],
                ["d", "เดินตากแดด", "In der Sonne spazieren", "Doen tak daet"]
            ],
            "a",
            "การนอนหลับพักผ่อนอย่างเพียงพอช่วยซ่อมแซมส่วนที่สึกหรอของร่างกาย",
            "Ausreichender Schlaf regeneriert Körper und Geist.",
            [{"title":"Department of Mental Health Thailand","url":"https://dmh.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-099", "beginner_health", 2, "single_choice",
            "สิ่งใดเป็นผลไม้ยอดนิยมที่มีวิตามินซีสูง รสเปรี้ยวอมหวาน ปอกเปลือกง่าย?",
            "Welche beliebte Zitrusfrucht hat viel Vitamin C und lässt sich leicht schälen?",
            "Sing dai pen phonlamai yotniyom thi mi witamin si sung rot priao om wan pok plueak ngai?",
            [
                ["a", "ส้ม", "Orange / Mandarine", "Som"],
                ["b", "มะพร้าว", "Kokosnuss", "Maphrao"],
                ["c", "ทุเรียน", "Durian", "Thurian"],
                ["d", "ขนุน", "Jackfrucht", "Khanun"]
            ],
            "a",
            "ส้ม (Som) อุดมด้วยวิตามินซี ช่วยเสริมภูมิต้านทานโรค",
            "Orangen und Mandarinen ('Som') liefern wertvolles Vitamin C.",
            [{"title":"Department of Health Thailand","url":"https://anamai.moph.go.th/"}]
        ),
        makeQuestion(
            "thq-beg-100", "beginner_health", 2, "single_choice",
            "สิ่งใดที่เราควรทำทุกครั้งก่อนรับประทานอาหารเพื่อป้องกันเชื้อโรค?",
            "Was sollten wir vor jeder Mahlzeit tun, um Krankheitskeime zu vermeiden?",
            "Sing dai thi rao khuan tham thuk khrang kon rapprathan ahan phuea pongkan chuearok?",
            [
                ["a", "ล้างมือให้สะอาด", "Gründlich Hände waschen", "Lang mue hai saat"],
                ["b", "วิ่งรอบบ้าน", "Ums Haus rennen", "Wing rop ban"],
                ["c", "สระผม", "Haare waschen", "Sra phom"],
                ["d", "นอนหลับ", "Schlafen", "Nonlap"]
            ],
            "a",
            "การล้างมือด้วยสบู่และน้ำสะอาดช่วยลดการติดเชื้อทางเดินอาหาร",
            "Gründliches Händewaschen schützt vor Keimen und Infektionen.",
            [{"title":"Department of Disease Control Thailand","url":"https://ddc.moph.go.th/"}]
        ),
        ...[
            ["animals", 1, "สัตว์อะไรมีงวง?", "Welches Tier hat einen Rüssel?", "Sat arai mi nguang?", "animals", "d"],
            ["animals", 1, "สัตว์อะไรร้องว่า 'เหมียว'?", "Welches Tier miaut?", "Sat arai rong wa 'miao'?", "animals", "a"],
            ["animals", 1, "สัตว์อะไรอยู่ในน้ำ?", "Welches Tier lebt im Wasser?", "Sat arai yu nai nam?", "animals", "c"],
            ["animals", 1, "สัตว์อะไรเห่า?", "Welches Tier bellt?", "Sat arai hao?", "animals", "b"],
            ["animals", 1, "สัตว์อะไรเดินช้า?", "Welches Tier geht langsam?", "Sat arai doen cha?", "slow_animals", "a"],
            ["animals", 2, "แมวเป็นปลาไหม?", "Ist eine Katze ein Fisch?", "Maeo pen pla mai?", "yes_no", "b"],
            ["animals", 2, "หมามีสี่ขาไหม?", "Hat ein Hund vier Beine?", "Ma mi si kha mai?", "yes_no", "a"],
            ["animals", 2, "ปลาอยู่ในน้ำไหม?", "Lebt ein Fisch im Wasser?", "Pla yu nai nam mai?", "yes_no", "a"],
            ["animals", 2, "นกมีปีกไหม?", "Hat ein Vogel Flügel?", "Nok mi pik mai?", "yes_no", "a"],
            ["animals", 2, "ช้างตัวเล็กกว่ามดไหม?", "Ist ein Elefant kleiner als eine Ameise?", "Chang tua lek kwa mot mai?", "yes_no", "b"],

            ["colors_numbers", 1, "ใบไม้ส่วนใหญ่สีอะไร?", "Welche Farbe haben die meisten Blätter?", "Bai mai suan yai si arai?", "colors", "c"],
            ["colors_numbers", 1, "กล้วยสุกสีอะไร?", "Welche Farbe hat eine reife Banane?", "Kluai suk si arai?", "colors", "b"],
            ["colors_numbers", 1, "มะเขือเทศสุกสีอะไร?", "Welche Farbe hat eine reife Tomate?", "Makhuea thet suk si arai?", "colors", "a"],
            ["colors_numbers", 1, "ท้องฟ้าสีอะไร?", "Welche Farbe hat der Himmel?", "Thong fa si arai?", "colors", "d"],
            ["colors_numbers", 1, "หนึ่งบวกหนึ่งได้เท่าไร?", "Was ist eins plus eins?", "Nueng buat nueng dai thao rai?", "numbers", "b"],
            ["colors_numbers", 2, "หนึ่ง สอง แล้วอะไร?", "Eins, zwei – was kommt dann?", "Nueng, song, laeo arai?", "numbers", "c"],
            ["colors_numbers", 2, "สามบวกสองได้เท่าไร?", "Was ist drei plus zwei?", "Sam buat song dai thao rai?", "numbers", "d"],
            ["colors_numbers", 2, "มือหนึ่งมีห้านิ้วไหม?", "Hat eine Hand fünf Finger?", "Mue nueng mi ha niu mai?", "yes_no", "a"],
            ["colors_numbers", 2, "เลขสิบมากกว่าเลขห้าไหม?", "Ist zehn größer als fünf?", "Lek sip mak kwa lek ha mai?", "yes_no", "a"],
            ["colors_numbers", 2, "กล้วยสุกมักมีสีเหลืองไหม?", "Sind reife Bananen meistens gelb?", "Kluai suk mak mi si lueang mai?", "yes_no", "a"],

            ["food_drink", 1, "เวลาหิวน้ำ เราดื่มอะไร?", "Was trinken wir, wenn wir durstig sind?", "Wela hiu nam, rao duem arai?", "food", "b"],
            ["food_drink", 1, "ไข่เจียวทำจากอะไร?", "Woraus macht man ein Omelett?", "Khai chiaw tham chak arai?", "food", "c"],
            ["food_drink", 1, "ผลไม้อะไรยาวและมีเปลือกสีเหลือง?", "Welche Frucht ist lang und hat eine gelbe Schale?", "Phonlamai arai yao lae mi plueak si lueang?", "food", "d"],
            ["food_drink", 1, "กินแกงกับอะไร?", "Wozu isst man Curry?", "Kin kaeng kap arai?", "food", "a"],
            ["food_drink", 1, "เรากินซุปด้วยอะไร?", "Womit essen wir Suppe?", "Rao kin sup duai arai?", "utensils", "a"],
            ["food_drink", 2, "ข้าวเป็นอาหารไหม?", "Ist Reis ein Nahrungsmittel?", "Khao pen ahan mai?", "yes_no", "a"],
            ["food_drink", 2, "กล้วยเป็นผักไหม?", "Ist eine Banane ein Gemüse?", "Kluai pen phak mai?", "yes_no", "b"],
            ["food_drink", 2, "มะนาวมีรสเปรี้ยวไหม?", "Schmeckt Limette sauer?", "Manao mi rot priao mai?", "yes_no", "a"],
            ["food_drink", 2, "เราดื่มน้ำเวลาเราหิวน้ำไหม?", "Trinken wir Wasser, wenn wir durstig sind?", "Rao duem nam wela rao hiu nam mai?", "yes_no", "a"],
            ["food_drink", 2, "ไข่เป็นเครื่องดื่มไหม?", "Ist ein Ei ein Getränk?", "Khai pen khrueang duem mai?", "yes_no", "b"],

            ["family_body", 1, "พ่อของพ่อเรียกว่าอะไร?", "Wie nennt man den Vater des eigenen Vaters?", "Pho khong pho riak wa arai?", "grandparents", "a"],
            ["family_body", 1, "พ่อของแม่เรียกว่าอะไร?", "Wie nennt man den Vater der eigenen Mutter?", "Pho khong mae riak wa arai?", "grandparents", "b"],
            ["family_body", 1, "แม่ของแม่เรียกว่าอะไร?", "Wie nennt man die Mutter der eigenen Mutter?", "Mae khong mae riak wa arai?", "family", "d"],
            ["family_body", 1, "เรามองด้วยอะไร?", "Womit sehen wir?", "Rao mong duai arai?", "body", "a"],
            ["family_body", 1, "เราใช้ส่วนไหนฟัง?", "Welchen Körperteil benutzen wir zum Hören?", "Rao chai suan nai fang?", "body", "b"],
            ["family_body", 2, "เรามองด้วยตาไหม?", "Sehen wir mit den Augen?", "Rao mong duai ta mai?", "yes_no", "a"],
            ["family_body", 2, "เราฟังด้วยหูไหม?", "Hören wir mit den Ohren?", "Rao fang duai hu mai?", "yes_no", "a"],
            ["family_body", 2, "เราดมกลิ่นด้วยจมูกไหม?", "Riechen wir mit der Nase?", "Rao dom klin duai chamuk mai?", "yes_no", "a"],
            ["family_body", 2, "เรามีมือสองข้างไหม?", "Haben wir zwei Hände?", "Rao mi mue song khang mai?", "yes_no", "a"],
            ["family_body", 2, "เท้าอยู่บนหัวไหม?", "Sind die Füße auf dem Kopf?", "Thao yu bon hua mai?", "yes_no", "b"],

            ["daily_life", 1, "เราเขียนด้วยอะไร?", "Womit schreiben wir?", "Rao khian duai arai?", "daily_life", "a"],
            ["daily_life", 1, "เรานั่งบนอะไร?", "Worauf sitzen wir?", "Rao nang bon arai?", "daily_life", "b"],
            ["daily_life", 1, "เราอ่านอะไร?", "Was lesen wir?", "Rao an arai?", "daily_life", "c"],
            ["daily_life", 1, "เราใช้ร่มทำอะไร?", "Wofür benutzen wir einen Regenschirm?", "Rao chai rom tham arai?", "umbrella_use", "d"],
            ["daily_life", 1, "เรานอนบนอะไร?", "Worauf schlafen wir?", "Rao non bon arai?", "household", "a"],
            ["daily_life", 2, "เราเขียนด้วยปากกาไหม?", "Schreiben wir mit einem Stift?", "Rao khian duai pakka mai?", "yes_no", "a"],
            ["daily_life", 2, "เรานั่งบนเก้าอี้ไหม?", "Sitzen wir auf einem Stuhl?", "Rao nang bon kao-i mai?", "yes_no", "a"],
            ["daily_life", 2, "เราอ่านหนังสือไหม?", "Lesen wir Bücher?", "Rao an nangsue mai?", "yes_no", "a"],
            ["daily_life", 2, "ใช้ร่มกันฝนได้ไหม?", "Kann man mit einem Schirm Regen abhalten?", "Chai rom kan fon dai mai?", "yes_no", "a"],
            ["daily_life", 2, "เราใส่รองเท้าที่มือไหม?", "Tragen wir Schuhe an den Händen?", "Rao sai rongthao thi mue mai?", "yes_no", "b"],

            ["greetings", 1, "เมื่อเจอคน เราพูดว่าอะไร?", "Was sagen wir, wenn wir jemanden treffen?", "Muea choe khon, rao phut wa arai?", "greetings", "a"],
            ["greetings", 1, "เมื่อมีคนช่วย เราพูดว่าอะไร?", "Was sagen wir, wenn uns jemand hilft?", "Muea mi khon chuai, rao phut wa arai?", "greetings", "b"],
            ["greetings", 1, "เมื่อเราทำผิด เราพูดว่าอะไร?", "Was sagen wir, wenn wir einen Fehler machen?", "Muea rao tham phit, rao phut wa arai?", "greetings", "c"],
            ["greetings", 1, "เมื่อจะกลับ เราพูดว่าอะไร?", "Was sagen wir, wenn wir gehen wollen?", "Muea cha klap, rao phut wa arai?", "greetings", "d"],
            ["greetings", 1, "เมื่อมีคนพูดว่า 'ขอบคุณ' เราตอบว่าอะไร?", "Was antworten wir, wenn jemand Danke sagt?", "Muea mi khon phut wa 'khop khun', rao top wa arai?", "greeting_response", "a"],
            ["greetings", 2, "เราพูด 'สวัสดี' เมื่อเจอคนไหม?", "Sagen wir Hallo, wenn wir jemanden treffen?", "Rao phut 'sawatdi' muea choe khon mai?", "yes_no", "a"],
            ["greetings", 2, "ขอบคุณแปลว่า 'ลาก่อน' ไหม?", "Bedeutet ขอบคุณ „Auf Wiedersehen“?", "Khop khun plae wa 'la kon' mai?", "yes_no", "b"],
            ["greetings", 2, "เราพูด 'ขอโทษ' เมื่อทำผิดไหม?", "Sagen wir ขอโทษ, wenn wir einen Fehler machen?", "Rao phut 'kho thot' muea tham phit mai?", "yes_no", "a"],
            ["greetings", 2, "เราพูด 'ลาก่อน' เมื่อกลับไหม?", "Sagen wir „Auf Wiedersehen“, wenn wir gehen?", "Rao phut 'la kon' muea klap mai?", "yes_no", "a"],
            ["greetings", 2, "คำว่า 'ไม่' แปลว่า 'ใช่' ไหม?", "Bedeutet ไม่ „Ja“?", "Kham wa 'mai' plae wa 'chai' mai?", "yes_no", "b"],

            ["nature_weather", 1, "อะไรให้แสงสว่างตอนกลางวัน?", "Was spendet tagsüber Licht?", "Arai hai saeng sawang ton klangwan?", "nature", "a"],
            ["nature_weather", 1, "ฝนมาจากไหน?", "Woher kommt der Regen?", "Fon ma chak nai?", "nature", "c"],
            ["nature_weather", 1, "อะไรอยู่บนฟ้าและมีสีขาว?", "Was ist am Himmel und weiß?", "Arai yu bon fa lae mi si khao?", "nature", "c"],
            ["nature_weather", 1, "อะไรส่องแสงบนฟ้าตอนกลางคืน?", "Was leuchtet nachts am Himmel?", "Arai song saeng bon fa ton klang khuen?", "nature", "d"],
            ["nature_weather", 1, "เราใช้อะไรกันฝน?", "Womit schützen wir uns vor Regen?", "Rao chai arai kan fon?", "daily_life", "d"],
            ["nature_weather", 2, "ฝนตกลงมาจากฟ้าไหม?", "Fällt Regen vom Himmel?", "Fon tok long ma chak fa mai?", "yes_no", "a"],
            ["nature_weather", 2, "ดวงอาทิตย์ขึ้นตอนเช้าไหม?", "Geht die Sonne morgens auf?", "Duang athit khuen ton chao mai?", "yes_no", "a"],
            ["nature_weather", 2, "น้ำแข็งเย็นไหม?", "Ist Eis kalt?", "Namkhaeng yen mai?", "yes_no", "a"],
            ["nature_weather", 2, "เมฆอยู่บนฟ้าไหม?", "Sind Wolken am Himmel?", "Mek yu bon fa mai?", "yes_no", "a"],
            ["nature_weather", 2, "ต้นไม้มีใบไหม?", "Hat ein Baum Blätter?", "Tonmai mi bai mai?", "yes_no", "a"],

            ["thailand_places", 1, "สถานที่ไหนอยู่ทางใต้ของไทย?", "Welcher Ort liegt im Süden Thailands?", "Sathanthi nai yu thang tai khong Thai?", "southern_places", "a"],
            ["thailand_places", 1, "เมืองไหนอยู่ทางเหนือของไทย?", "Welche Stadt liegt im Norden Thailands?", "Mueang nai yu thang nuea khong Thai?", "places", "b"],
            ["thailand_places", 1, "สถานที่ใดเป็นเกาะในประเทศไทย?", "Welcher Ort ist eine Insel in Thailand?", "Sathanthi dai pen ko nai prathet Thai?", "places", "c"],
            ["thailand_places", 1, "เมืองไหนอยู่ริมทะเล?", "Welche Stadt liegt am Meer?", "Mueang nai yu rim thale?", "places", "d"],
            ["thailand_places", 1, "เมืองหลวงของไทยชื่ออะไร?", "Wie heißt die Hauptstadt Thailands?", "Mueang luang khong Thai chue arai?", "places", "a"],
            ["thailand_places", 2, "ประเทศไทยมีทะเลไหม?", "Hat Thailand eine Küste am Meer?", "Prathet Thai mi thale mai?", "yes_no", "a"],
            ["thailand_places", 2, "กรุงเทพฯ เป็นเมืองหลวงของไทยไหม?", "Ist Bangkok die Hauptstadt Thailands?", "Krung Thep pen mueang luang khong Thai mai?", "yes_no", "a"],
            ["thailand_places", 2, "เชียงใหม่อยู่ทางเหนือของไทยไหม?", "Liegt Chiang Mai im Norden Thailands?", "Chiang Mai yu thang nuea khong Thai mai?", "yes_no", "a"],
            ["thailand_places", 2, "ภูเก็ตเป็นจังหวัดของไทยไหม?", "Ist Phuket eine Provinz Thailands?", "Phuket pen changwat khong Thai mai?", "yes_no", "a"],
            ["thailand_places", 2, "กรุงเทพฯ เป็นเกาะไหม?", "Ist Bangkok eine Insel?", "Krung Thep pen ko mai?", "yes_no", "b"],

            ["transport", 1, "อะไรวิ่งบนราง?", "Was fährt auf Schienen?", "Arai wing bon rang?", "rail", "a"],
            ["transport", 1, "อะไรแล่นในน้ำ?", "Was fährt auf dem Wasser?", "Arai laen nai nam?", "transport", "b"],
            ["transport", 1, "อะไรบินบนฟ้า?", "Was fliegt am Himmel?", "Arai bin bon fa?", "transport", "c"],
            ["transport", 1, "อะไรมีสองล้อและใช้ปั่น?", "Was hat zwei Räder und wird durch Treten bewegt?", "Arai mi song lo lae chai pan?", "transport", "d"],
            ["transport", 1, "อะไรมีสี่ล้อและวิ่งบนถนน?", "Was hat vier Räder und fährt auf der Straße?", "Arai mi si lo lae wing bon thanon?", "transport", "a"],
            ["transport", 2, "รถไฟวิ่งบนรางไหม?", "Fährt ein Zug auf Schienen?", "Rotfai wing bon rang mai?", "yes_no", "a"],
            ["transport", 2, "เรือแล่นบนถนนไหม?", "Fährt ein Boot auf der Straße?", "Ruea laen bon thanon mai?", "yes_no", "b"],
            ["transport", 2, "เครื่องบินบินบนฟ้าไหม?", "Fliegt ein Flugzeug am Himmel?", "Khrueang bin bin bon fa mai?", "yes_no", "a"],
            ["transport", 2, "จักรยานมีสองล้อไหม?", "Hat ein Fahrrad zwei Räder?", "Chakkrayan mi song lo mai?", "yes_no", "a"],
            ["transport", 2, "รถยนต์วิ่งในทะเลไหม?", "Fährt ein Auto im Meer?", "Rot yon wing nai thale mai?", "yes_no", "b"],

            ["thai_culture", 1, "เทศกาลไหนมีการเล่นน้ำ?", "Bei welchem Fest spielt man mit Wasser?", "Thetsakan nai mi kan len nam?", "thai_culture", "a"],
            ["thai_culture", 1, "เทศกาลไหนมีการลอยกระทง?", "Bei welchem Fest lässt man Krathongs treiben?", "Thetsakan nai mi kan loi krathong?", "thai_culture", "b"],
            ["thai_culture", 1, "ท่าทางไหนใช้ทักทายแบบไทย?", "Welche Geste benutzt man zur thailändischen Begrüßung?", "Tha thang nai chai thakthai baep Thai?", "thai_culture", "c"],
            ["thai_culture", 1, "กีฬาไหนเป็นการชกมวย?", "Welche Sportart ist Boxen?", "Kila nai pen kan chok muai?", "thai_culture", "d"],
            ["thai_culture", 1, "เทศกาลไหนเป็นปีใหม่ไทย?", "Welches Fest ist das thailändische Neujahr?", "Thetsakan nai pen pi mai Thai?", "thai_culture", "a"],
            ["thai_culture", 2, "สงกรานต์เป็นเทศกาลของไทยไหม?", "Ist Songkran ein thailändisches Fest?", "Songkran pen thetsakan khong Thai mai?", "yes_no", "a"],
            ["thai_culture", 2, "ในวันลอยกระทง เราลอยกระทงลงน้ำไหม?", "Lässt man am Loy-Krathong-Fest Krathongs ins Wasser?", "Nai wan Loi Krathong, rao loi krathong long nam mai?", "yes_no", "a"],
            ["thai_culture", 2, "การไหว้ใช้มือไหม?", "Benutzt man für den Wai die Hände?", "Kan wai chai mue mai?", "yes_no", "a"],
            ["thai_culture", 2, "มวยไทยใช้หมัดไหม?", "Benutzt Muay Thai die Fäuste?", "Muai Thai chai mat mai?", "yes_no", "a"],
            ["thai_culture", 2, "ดอกบัวเป็นดอกไม้ไหม?", "Ist der Lotus eine Blume?", "Dok bua pen dokmai mai?", "yes_no", "a"],
            ["animals", 1, "สัตว์อะไรมีหูยาว?", "Welches Tier hat lange Ohren?", "Sat arai mi hu yao?", "animals_small", "a"],
            ["animals", 1, "สัตว์อะไรมีเปลือกแข็ง?", "Welches Tier hat einen harten Panzer?", "Sat arai mi plueak khaeng?", "animals_small", "b"],
            ["animals", 1, "สัตว์อะไรไม่มีขา?", "Welches Tier hat keine Beine?", "Sat arai mai mi kha?", "animals_small", "c"],
            ["animals", 1, "สัตว์อะไรบินตอนกลางคืน?", "Welches Tier fliegt nachts?", "Sat arai bin ton klang khuen?", "animals_night", "a"],
            ["animals", 1, "สัตว์อะไรอยู่ได้ทั้งในน้ำและบนบก?", "Welches Tier lebt im Wasser und an Land?", "Sat arai yu dai thang nai nam lae bon bok?", "animals_small", "d"],
            ["animals", 2, "ผึ้งมีปีกไหม?", "Hat eine Biene Flügel?", "Phueng mi pik mai?", "yes_no", "a"],
            ["animals", 2, "ค้างคาวเป็นนกไหม?", "Ist eine Fledermaus ein Vogel?", "Khangkhao pen nok mai?", "yes_no", "b"],
            ["animals", 2, "กบมีขาไหม?", "Hat ein Frosch Beine?", "Kop mi kha mai?", "yes_no", "a"],
            ["animals", 2, "ผึ้งทำน้ำผึ้งไหม?", "Machen Bienen Honig?", "Phueng tham nam phueng mai?", "yes_no", "a"],
            ["animals", 2, "ปลาเดินบนบกได้ไหม?", "Kann ein Fisch an Land gehen?", "Pla doen bon bok dai mai?", "yes_no", "b"],

            ["colors_numbers", 1, "ทะเลมักมีสีอะไร?", "Welche Farbe hat das Meer meistens?", "Thale mak mi si arai?", "colors_basic", "a"],
            ["colors_numbers", 1, "เลือดมีสีอะไร?", "Welche Farbe hat Blut?", "Lueat mi si arai?", "colors_basic", "b"],
            ["colors_numbers", 1, "ฟักทองมักมีสีอะไร?", "Welche Farbe hat ein Kürbis meistens?", "Fak thong mak mi si arai?", "colors_pumpkin", "a"],
            ["colors_numbers", 1, "ถ่านมีสีอะไร?", "Welche Farbe hat Kohle?", "Than mi si arai?", "colors_coal", "b"],
            ["colors_numbers", 1, "สองบวกสองได้เท่าไร?", "Was ist zwei plus zwei?", "Song buat song dai thao rai?", "numbers_four", "c"],
            ["colors_numbers", 2, "หนึ่งสัปดาห์มีเจ็ดวันไหม?", "Hat eine Woche sieben Tage?", "Nueng sapda mi chet wan mai?", "yes_no", "a"],
            ["colors_numbers", 2, "หนึ่งปีมีสิบสองเดือนไหม?", "Hat ein Jahr zwölf Monate?", "Nueng pi mi sip song duean mai?", "yes_no", "a"],
            ["colors_numbers", 2, "เลขสี่มากกว่าห้าไหม?", "Ist vier größer als fünf?", "Lek si mak kwa ha mai?", "yes_no", "b"],
            ["colors_numbers", 2, "ห้าลบหนึ่งได้สี่ไหม?", "Ist fünf minus eins vier?", "Ha lop nueng dai si mai?", "yes_no", "a"],
            ["colors_numbers", 2, "หญ้ามีสีเขียวไหม?", "Ist Gras grün?", "Ya mi si khiao mai?", "yes_no", "a"],

            ["food_drink", 1, "ผลไม้อะไรมีเปลือกเป็นหนาม?", "Welche Frucht hat eine stachelige Schale?", "Phonlamai arai mi plueak pen nam?", "fruit_spiky", "a"],
            ["food_drink", 1, "ผลไม้อะไรมีเปลือกสีเขียวและเนื้อสีแดง?", "Welche Frucht hat eine grüne Schale und rotes Fruchtfleisch?", "Phonlamai arai mi plueak si khiao lae nuea si daeng?", "fruit_colors", "a"],
            ["food_drink", 1, "น้ำอะไรทำจากส้ม?", "Welcher Saft wird aus Orangen gemacht?", "Nam arai tham chak som?", "orange_drink", "a"],
            ["food_drink", 1, "อาหารอะไรทำจากแป้งและอบ?", "Welches Essen wird aus Mehl gemacht und gebacken?", "Ahan arai tham chak paeng lae op?", "baked_food", "a"],
            ["food_drink", 1, "ผลไม้อะไรมีเมล็ดใหญ่แบน?", "Welche Frucht hat einen großen, flachen Kern?", "Phonlamai arai mi malet yai baen?", "fruit_seed", "a"],
            ["food_drink", 2, "น้ำผึ้งมีรสหวานไหม?", "Schmeckt Honig süß?", "Nam phueng mi rot wan mai?", "yes_no", "a"],
            ["food_drink", 2, "กาแฟเป็นเครื่องดื่มไหม?", "Ist Kaffee ein Getränk?", "Kafae pen khrueang duem mai?", "yes_no", "a"],
            ["food_drink", 2, "เราควรล้างผลไม้ก่อนกินไหม?", "Soll man Obst vor dem Essen waschen?", "Rao khuan lang phonlamai kon kin mai?", "yes_no", "a"],
            ["food_drink", 2, "น้ำตาลมีรสเค็มไหม?", "Schmeckt Zucker salzig?", "Nam tan mi rot khem mai?", "yes_no", "b"],
            ["food_drink", 2, "น้ำแข็งร้อนไหม?", "Ist Eis heiß?", "Namkhaeng ron mai?", "yes_no", "b"],

            ["family_body", 1, "เราเคี้ยวอาหารด้วยอะไร?", "Womit kauen wir?", "Rao khiao ahan duai arai?", "body_actions", "a"],
            ["family_body", 1, "เราพูดด้วยอะไร?", "Womit sprechen wir?", "Rao phut duai arai?", "body_actions", "b"],
            ["family_body", 1, "เราใช้หวีหวีอะไร?", "Was kämmen wir mit einem Kamm?", "Rao chai wi wi arai?", "body_actions", "c"],
            ["family_body", 1, "ส่วนไหนอยู่ระหว่างไหล่กับมือ?", "Welcher Körperteil liegt zwischen Schulter und Hand?", "Suan nai yu rawang lai kap mue?", "body_actions", "d"],
            ["family_body", 1, "เราใช้ส่วนไหนเตะบอล?", "Welchen Körperteil benutzen wir, um einen Ball zu treten?", "Rao chai suan nai te bon?", "body_actions", "e"],
            ["family_body", 2, "ผมอยู่บนศีรษะไหม?", "Ist das Haar auf dem Kopf?", "Phom yu bon sisa mai?", "yes_no", "a"],
            ["family_body", 2, "คนเรามีหัวใจไหม?", "Haben Menschen ein Herz?", "Khon rao mi huachai mai?", "yes_no", "a"],
            ["family_body", 2, "เราใช้มือปรบมือไหม?", "Klatschen wir mit den Händen?", "Rao chai mue prop mue mai?", "yes_no", "a"],
            ["family_body", 2, "เท้าอยู่ปลายขาไหม?", "Befinden sich die Füße am Ende der Beine?", "Thao yu plai kha mai?", "yes_no", "a"],
            ["family_body", 2, "หัวเข่าอยู่ที่ขาไหม?", "Liegt das Knie am Bein?", "Hua khao yu thi kha mai?", "yes_no", "a"],

            ["daily_life", 1, "เราใช้กุญแจเปิดอะไร?", "Was öffnen wir mit einem Schlüssel?", "Rao chai kunchae poet arai?", "home_use", "a"],
            ["daily_life", 1, "เราเช็ดตัวด้วยอะไร?", "Womit trocknen wir uns ab?", "Rao chet tua duai arai?", "home_use", "c"],
            ["daily_life", 1, "เราเก็บเสื้อผ้าไว้ที่ไหน?", "Wo bewahren wir Kleidung auf?", "Rao kep suea pha wai thi nai?", "home_use", "d"],
            ["daily_life", 1, "เราใช้จานใส่อะไร?", "Wofür benutzen wir einen Teller?", "Rao chai chan sai arai?", "home_use_food", "e"],
            ["daily_life", 1, "เราใช้สบู่ล้างอะไร?", "Was waschen wir mit Seife?", "Rao chai sabu lang arai?", "home_use", "b"],
            ["daily_life", 2, "ตอนเช้าเราแปรงฟันไหม?", "Putzen wir morgens die Zähne?", "Ton chao rao praeng fan mai?", "yes_no", "a"],
            ["daily_life", 2, "ก่อนกินข้าวเราล้างมือไหม?", "Waschen wir uns vor dem Essen die Hände?", "Kon kin khao rao lang mue mai?", "yes_no", "a"],
            ["daily_life", 2, "ตอนกลางคืนเราเปิดไฟไหม?", "Schalten wir nachts das Licht an?", "Ton klang khuen rao poet fai mai?", "yes_no", "a"],
            ["daily_life", 2, "เราพับผ้าห่มหลังตื่นนอนได้ไหม?", "Können wir nach dem Aufwachen die Decke zusammenlegen?", "Rao phap pha hom lang tuen non dai mai?", "yes_no", "a"],
            ["daily_life", 2, "เราล้างมือหลังเข้าห้องน้ำไหม?", "Waschen wir uns nach dem Toilettengang die Hände?", "Rao lang mue lang khao hongnam mai?", "yes_no", "a"],

            ["greetings", 1, "ถ้าอยากรู้ชื่อเพื่อน เราถามว่าอะไร?", "Wie fragen wir nach dem Namen eines Freundes?", "Tha yak ru chue phuean rao tham wa arai?", "chat_name", "a"],
            ["greetings", 1, "ถ้าฟังไม่เข้าใจ เราพูดว่าอะไร?", "Was sagen wir, wenn wir etwas nicht verstehen?", "Tha fang mai khao chai rao phut wa arai?", "chat_understand", "a"],
            ["greetings", 1, "ถ้าอยากรู้ราคา เราถามว่าอะไร?", "Wie fragen wir nach dem Preis?", "Tha yak ru rakha rao tham wa arai?", "chat_price", "a"],
            ["greetings", 1, "ถ้าอยากให้คนพูดช้าๆ เราถามว่าอะไร?", "Wie bitten wir jemanden, langsam zu sprechen?", "Tha yak hai khon phut cha-cha rao tham wa arai?", "chat_slow", "a"],
            ["greetings", 1, "ถ้าอยากบอกว่าชอบแมว เราพูดว่าอะไร?", "Wie sagen wir, dass wir Katzen mögen?", "Tha yak bok wa chop maeo rao phut wa arai?", "chat_like", "a"],
            ["greetings", 2, "วันนี้หมายถึงวันปัจจุบันไหม?", "Bedeutet วันนี้ „der heutige Tag“?", "Wan ni mai thueng wan patchuban mai?", "yes_no", "a"],
            ["greetings", 2, "พรุ่งนี้เป็นวันก่อนวันนี้ไหม?", "Ist morgen der Tag vor heute?", "Phrungni pen wan kon wan ni mai?", "yes_no", "b"],
            ["greetings", 2, "เมื่อวานเป็นวันก่อนวันนี้ไหม?", "Ist gestern der Tag vor heute?", "Muea wan pen wan kon wan ni mai?", "yes_no", "a"],
            ["greetings", 2, "คำว่า 'ไม่' ใช้ปฏิเสธไหม?", "Benutzt man ไม่ zum Verneinen?", "Kham wa 'mai' chai patiset mai?", "yes_no", "a"],
            ["greetings", 2, "'ไม่เข้าใจ' หมายถึงว่าเราเข้าใจไหม?", "Bedeutet ไม่เข้าใจ, dass wir etwas verstehen?", "'Mai khao chai' mai thueng wa rao khao chai mai?", "yes_no", "b"],

            ["nature_weather", 1, "ฤดูไหนมีฝนตกบ่อย?", "In welcher Jahreszeit regnet es oft?", "Rue du nai mi fon tok boi?", "seasons", "b"],
            ["nature_weather", 1, "ฤดูไหนอากาศเย็น?", "In welcher Jahreszeit ist es kühl?", "Rue du nai akat yen?", "seasons", "c"],
            ["nature_weather", 1, "ฤดูไหนอากาศร้อน?", "In welcher Jahreszeit ist es heiß?", "Rue du nai akat ron?", "seasons", "a"],
            ["nature_weather", 1, "แมลงอะไรดูดน้ำหวานจากดอกไม้?", "Welches Insekt trinkt den Nektar aus Blumen?", "Malaeng arai dut nam wan chak dokmai?", "flower_insects", "a"],
            ["nature_weather", 1, "อะไรปลิวตามลมได้?", "Was kann im Wind davonfliegen?", "Arai plio tam lom dai?", "wind_items", "a"],
            ["nature_weather", 2, "ผึ้งบินได้ไหม?", "Können Bienen fliegen?", "Phueng bin dai mai?", "yes_no", "a"],
            ["nature_weather", 2, "ต้นไม้ต้องการน้ำไหม?", "Brauchen Bäume Wasser?", "Tonmai tongkan nam mai?", "yes_no", "a"],
            ["nature_weather", 2, "น้ำทะเลมีรสเค็มไหม?", "Schmeckt Meerwasser salzig?", "Nam thale mi rot khem mai?", "yes_no", "a"],
            ["nature_weather", 2, "ดอกไม้ต้องการแสงแดดไหม?", "Brauchen Blumen Sonnenlicht?", "Dokmai tongkan saeng daet mai?", "yes_no", "a"],
            ["nature_weather", 2, "ฤดูหนาวเย็นกว่าฤดูร้อนไหม?", "Ist der Winter kühler als der Sommer?", "Rue du nao yen kwa rue du ron mai?", "yes_no", "a"],

            ["thailand_places", 1, "หัวหินอยู่จังหวัดอะไร?", "In welcher Provinz liegt Hua Hin?", "Hua Hin yu changwat arai?", "places_new", "a"],
            ["thailand_places", 1, "เกาะหลีเป๊ะอยู่จังหวัดอะไร?", "In welcher Provinz liegt Koh Lipe?", "Ko Lipe yu changwat arai?", "places_new", "b"],
            ["thailand_places", 1, "อุทยานแห่งชาติเอราวัณอยู่จังหวัดอะไร?", "In welcher Provinz liegt der Erawan-Nationalpark?", "Utthayan haeng chat Erawan yu changwat arai?", "places_new", "c"],
            ["thailand_places", 1, "หมู่บ้านรักไทยอยู่จังหวัดอะไร?", "In welcher Provinz liegt das Dorf Rak Thai?", "Mu ban Rak Thai yu changwat arai?", "places_new", "d"],
            ["thailand_places", 1, "วัดพระธาตุดอยสุเทพอยู่จังหวัดอะไร?", "In welcher Provinz liegt Wat Phra That Doi Suthep?", "Wat Phra That Doi Suthep yu changwat arai?", "places_new", "e"],
            ["thailand_places", 2, "ประเทศไทยอยู่ในเอเชียตะวันออกเฉียงใต้ไหม?", "Liegt Thailand in Südostasien?", "Prathet Thai yu nai Echia Tawan-ok Chiang Tai mai?", "yes_no", "a"],
            ["thailand_places", 2, "เกาะหลีเป๊ะอยู่ในประเทศไทยไหม?", "Liegt Koh Lipe in Thailand?", "Ko Lipe yu nai prathet Thai mai?", "yes_no", "a"],
            ["thailand_places", 2, "สตูลอยู่ทางใต้ของประเทศไทยไหม?", "Liegt Satun im Süden Thailands?", "Satun yu thang tai khong prathet Thai mai?", "yes_no", "a"],
            ["thailand_places", 2, "หัวหินอยู่ติดทะเลไหม?", "Liegt Hua Hin am Meer?", "Hua Hin yu tit thale mai?", "yes_no", "a"],
            ["thailand_places", 2, "ประเทศไทยมีหลายจังหวัดไหม?", "Hat Thailand viele Provinzen?", "Prathet Thai mi lai changwat mai?", "yes_no", "a"],

            ["transport", 1, "รถอะไรมีสองล้อและมีเครื่องยนต์?", "Welches Fahrzeug hat zwei Räder und einen Motor?", "Rot arai mi song lo lae mi khrueang yon?", "vehicles_city", "b"],
            ["transport", 1, "รถอะไรรับคนหลายคนในเมือง?", "Welches Fahrzeug befördert viele Menschen in der Stadt?", "Rot arai rap khon lai khon nai mueang?", "vehicles_city", "a"],
            ["transport", 1, "รถอะไรเรียกให้มารับเราได้?", "Welches Fahrzeug können wir rufen, damit es uns abholt?", "Rot arai riak hai ma rap rao dai?", "vehicles_city", "d"],
            ["transport", 1, "รถอะไรขนของหนัก?", "Welches Fahrzeug transportiert schwere Dinge?", "Rot arai khon khong nak?", "vehicles_city", "c"],
            ["transport", 1, "คนป่วยฉุกเฉินไปโรงพยาบาลด้วยรถอะไร?", "Mit welchem Fahrzeug fährt man bei einem medizinischen Notfall ins Krankenhaus?", "Khon puai chukchoen pai rongphayaban duai rot arai?", "vehicles_emergency", "a"],
            ["transport", 2, "คนขี่มอเตอร์ไซค์ควรใส่หมวกกันน็อกไหม?", "Sollten Motorradfahrer einen Helm tragen?", "Khon khi motosai khuan sai muak kan nok mai?", "yes_no", "a"],
            ["transport", 2, "ในรถเราคาดเข็มขัดนิรภัยไหม?", "Schnallen wir uns im Auto an?", "Nai rot rao khat khemkhat niraphai mai?", "yes_no", "a"],
            ["transport", 2, "คนขับควรมองถนนไหม?", "Soll der Fahrer auf die Straße schauen?", "Khon khap khuan mong thanon mai?", "yes_no", "a"],
            ["transport", 2, "คนขับใช้โทรศัพท์ตอนขับรถได้ไหม?", "Darf der Fahrer während der Fahrt telefonieren?", "Khon khap chai thorasap ton khap rot dai mai?", "yes_no", "b"],
            ["transport", 2, "เราควรข้ามถนนตรงทางม้าลายไหม?", "Sollten wir die Straße am Zebrastreifen überqueren?", "Rao khuan kham thanon trong thang ma lai mai?", "yes_no", "a"],

            ["thai_culture", 1, "เงินไทยเรียกว่าอะไร?", "Wie heißt die thailändische Währung?", "Ngoen Thai riak wa arai?", "money", "b"],
            ["thai_culture", 1, "ผู้ชายมักพูดคำไหนเพื่อความสุภาพ?", "Welches Wort benutzen Männer oft als Höflichkeitspartikel?", "Phu chai mak phut kham nai phuea khwam suphap?", "polite_men", "a"],
            ["thai_culture", 1, "ผู้หญิงมักพูดคำไหนเพื่อความสุภาพ?", "Welches Wort benutzen Frauen oft als Höflichkeitspartikel?", "Phu ying mak phut kham nai phuea khwam suphap?", "polite_women", "b"],
            ["thai_culture", 1, "คนไทยกินก๋วยเตี๋ยวด้วยอะไร?", "Womit isst man in Thailand Nudelsuppe?", "Khon Thai kin kuaitiao duai arai?", "noodle_tools", "a"],
            ["thai_culture", 1, "ผ้าขาวม้าเป็นผ้าแบบไหน?", "Was für ein Tuch ist ein Pha Khao Ma?", "Pha khao ma pen pha baep nai?", "pha_khao_ma", "a"],
            ["thai_culture", 2, "ก่อนเข้าบ้าน คนไทยมักถอดรองเท้าไหม?", "Ziehen Thailänder vor dem Betreten eines Hauses oft die Schuhe aus?", "Kon khao ban khon Thai mak thot rongthao mai?", "yes_no", "a"],
            ["thai_culture", 2, "คนไทยมักสั่งอาหารหลายอย่างมากินด้วยกันไหม?", "Bestellen Thailänder oft mehrere Gerichte zum gemeinsamen Essen?", "Khon Thai mak sang ahan lai yang ma kin duai kan mai?", "yes_no", "a"],
            ["thai_culture", 2, "เราควรเคารพผู้ใหญ่ไหม?", "Sollten wir Älteren Respekt zeigen?", "Rao khuan khaorop phu yai mai?", "yes_no", "a"],
            ["thai_culture", 2, "คนไทยมีวันแม่ไหม?", "Gibt es in Thailand einen Muttertag?", "Khon Thai mi wan mae mai?", "yes_no", "a"],
            ["thai_culture", 2, "คนไทยใช้ช้อนกินข้าวไหม?", "Benutzen Thailänder einen Löffel zum Essen von Reis?", "Khon Thai chai chon kin khao mai?", "yes_no", "a"],

            ["school", 1, "นักเรียนเรียนที่ไหน?", "Wo lernen Schüler?", "Nakrian rian thi nai?", "school_places", "a"],
            ["school", 1, "ใครสอนนักเรียน?", "Wer unterrichtet Schüler?", "Khrai son nakrian?", "school_roles", "a"],
            ["school", 1, "ครูเขียนบนอะไร?", "Worauf schreibt ein Lehrer?", "Khru khian bon arai?", "school_board", "a"],
            ["school", 1, "เราเขียนคำตอบลงบนอะไร?", "Worauf schreiben wir Antworten?", "Rao khian khamtop long bon arai?", "school_paper", "a"],
            ["school", 1, "นักเรียนใส่หนังสือในอะไร?", "Worin verstauen Schüler Bücher?", "Nakrian sai nangsue nai arai?", "school_bag", "a"],
            ["school", 2, "วิชาอะไรเรียนเกี่ยวกับตัวเลข?", "In welchem Fach geht es um Zahlen?", "Wicha arai rian kiao kap tua lek?", "school_subject", "a"],
            ["school", 2, "นักเรียนยืมหนังสือที่ไหน?", "Wo leihen Schüler Bücher aus?", "Nakrian yuem nangsue thi nai?", "school_library", "a"],
            ["school", 2, "ในห้องสมุดมีหนังสือ", "In einer Bibliothek gibt es Bücher.", "Nai hong samut mi nangsue.", "true_false", "a", "true_false"],
            ["school", 2, "นักเรียนใส่กระเป๋าไว้ใต้โต๊ะได้ไหม?", "Können Schüler ihre Tasche unter den Tisch stellen?", "Nakrian sai krapao wai tai to dai mai?", "yes_no", "a"],
            ["school", 2, "โรงเรียนมีห้องเรียนไหม?", "Hat eine Schule Klassenzimmer?", "Rongrian mi hong rian mai?", "yes_no", "a"],

            ["time", 1, "หนึ่งชั่วโมงมีกี่นาที?", "Wie viele Minuten hat eine Stunde?", "Nueng chuamong mi ki nathi?", "hour_minutes", "a"],
            ["time", 1, "ครึ่งชั่วโมงมีกี่นาที?", "Wie viele Minuten hat eine halbe Stunde?", "Khrueng chuamong mi ki nathi?", "hour_minutes", "b"],
            ["time", 1, "วันไหนอยู่หลังวันอังคาร?", "Welcher Tag kommt nach Dienstag?", "Wan nai yu lang wan angkhan?", "weekday_order", "c"],
            ["time", 1, "เที่ยงตรงคือกี่โมง?", "Wie spät ist es genau um zwölf Uhr mittags?", "Thiang trong khue ki mong?", "noon_time", "c"],
            ["time", 1, "เราใช้ปฏิทินดูอะไร?", "Was schauen wir im Kalender nach?", "Rao chai pathithin du arai?", "calendar_info", "a"],
            ["time", 2, "หนึ่งวันมีกี่ชั่วโมง?", "Wie viele Stunden hat ein Tag?", "Nueng wan mi ki chuamong?", "day_hours", "a"],
            ["time", 2, "หนึ่งนาทีมีกี่วินาที?", "Wie viele Sekunden hat eine Minute?", "Nueng nathi mi ki winathi?", "minute_seconds", "a"],
            ["time", 2, "วันจันทร์มาก่อนวันอังคาร", "Montag kommt vor Dienstag.", "Wan chan ma kon wan angkhan.", "true_false", "a", "true_false"],
            ["time", 2, "เดือนมกราคมมาก่อนเดือนกุมภาพันธ์ไหม?", "Kommt Januar vor Februar?", "Duean mokkarakhom ma kon duean kumphaphan mai?", "yes_no", "a"],
            ["time", 2, "เที่ยงคืนเป็นเวลากลางคืนไหม?", "Ist Mitternacht nachts?", "Thiang khuen pen wela klang khuen mai?", "yes_no", "a"],

            ["shopping", 1, "เราซื้อผักสดได้ที่ไหน?", "Wo können wir frisches Gemüse kaufen?", "Rao sue phak sot dai thi nai?", "shopping_market", "a"],
            ["shopping", 1, "ใครรับเงินตอนเราซื้อของ?", "Wer nimmt beim Einkaufen unser Geld entgegen?", "Khrai rap ngoen ton rao sue khong?", "cashier", "a"],
            ["shopping", 1, "เราใส่ของที่ซื้อในอะไร?", "Worin tragen wir unsere Einkäufe?", "Rao sai khong thi sue nai arai?", "shopping_bag", "a"],
            ["shopping", 1, "ร้านขายยาขายอะไร?", "Was verkauft eine Apotheke?", "Ran khai ya khai arai?", "pharmacy_goods", "a"],
            ["shopping", 1, "สิบบาทสองเหรียญรวมเป็นกี่บาท?", "Wie viel sind zwei Zehn-Baht-Münzen zusammen?", "Sip baht song rian ruam pen ki baht?", "change_amount", "b"],
            ["shopping", 2, "ของราคา 30 บาท จ่าย 50 บาท ได้เงินทอนกี่บาท?", "Ein Einkauf kostet 30 Baht; wie viel Rückgeld gibt es bei 50 Baht?", "Khong rakha sam sip baht chai ha sip baht dai ngoen thon ki baht?", "change_amount", "b"],
            ["shopping", 2, "หลังจ่ายเงิน เราขออะไรจากร้าน?", "Was bitten wir nach dem Bezahlen im Geschäft?", "Lang chai ngoen rao kho arai chak ran?", "receipt", "a"],
            ["shopping", 2, "ลูกค้าจ่ายเงินเพื่อซื้อของ", "Kunden bezahlen Geld, um Dinge zu kaufen.", "Lukkha chai ngoen phuea sue khong.", "true_false", "a", "true_false"],
            ["shopping", 2, "ร้านลดราคาทำให้ของถูกลงไหม?", "Macht ein Rabatt Waren günstiger?", "Ran lot rakha tham hai khong thuk long mai?", "yes_no", "a"],
            ["shopping", 2, "เราควรตรวจเงินทอนหลังซื้อของไหม?", "Sollten wir nach dem Einkauf das Rückgeld prüfen?", "Rao khuan truat ngoen thon lang sue khong mai?", "yes_no", "a"],

            ["health", 1, "ใครดูแลคนป่วย?", "Wer kümmert sich um kranke Menschen?", "Khrai dulae khon puai?", "health_carer", "c"],
            ["health", 1, "เราใช้อะไรวัดอุณหภูมิ?", "Womit messen wir die Temperatur?", "Rao chai arai wat unhaphum?", "thermometer", "a"],
            ["health", 1, "เราซื้อยาได้ที่ไหน?", "Wo kaufen wir Medizin?", "Rao sue ya dai thi nai?", "pharmacy_place", "a"],
            ["health", 1, "เวลาไม่สบาย เราใส่อะไรปิดปากและจมูก?", "Was tragen wir bei Krankheit vor Mund und Nase?", "Wela mai sabai rao sai arai pit pak lae chamuk?", "health_mask", "a"],
            ["health", 1, "เวลาไอ เราควรปิดอะไร?", "Was sollten wir beim Husten bedecken?", "Wela ai rao khuan pit arai?", "body_cover", "a"],
            ["health", 2, "ถ้ามีไข้ ตัวเรามักเป็นอย่างไร?", "Wie fühlt sich der Körper bei Fieber oft an?", "Tha mi khai tua rao mak pen yangrai?", "fever", "a"],
            ["health", 2, "ถ้ามีแผล เราใช้พลาสเตอร์ปิดอะไร?", "Was bedecken wir mit einem Pflaster?", "Tha mi phlae rao chai phlaster pit arai?", "wound", "a"],
            ["health", 2, "เราควรกินยาตามคำแนะนำ", "Wir sollten Medizin nach Anweisung einnehmen.", "Rao khuan kin ya tam kham nae nam.", "true_false", "a", "true_false"],
            ["health", 2, "ยาเป็นขนมไหม?", "Ist Medizin eine Süßigkeit?", "Ya pen khanom mai?", "yes_no", "b"],
            ["health", 2, "ถ้าปวดฟัน เราไปหาหมอฟันไหม?", "Gehen wir bei Zahnschmerzen zum Zahnarzt?", "Tha puat fan rao pai ha mo fan mai?", "yes_no", "a"],

            ["clothing", 1, "เราใส่อะไรที่เท้าก่อนใส่รองเท้า?", "Was ziehen wir vor den Schuhen an die Füße?", "Rao sai arai thi thao kon sai rongthao?", "clothes_socks", "a"],
            ["clothing", 1, "อะไรช่วยบังแดดให้หัว?", "Was schützt den Kopf vor der Sonne?", "Arai chuai bang daet hai hua?", "clothes_sun", "a"],
            ["clothing", 1, "เราซักผ้าด้วยเครื่องอะไร?", "Mit welcher Maschine waschen wir Kleidung?", "Rao sak pha duai khrueang arai?", "washing_machine", "a"],
            ["clothing", 1, "อากาศหนาว เราใส่อะไร?", "Was ziehen wir bei kaltem Wetter an?", "Akat nao rao sai arai?", "cold_clothes", "a"],
            ["clothing", 1, "เราแขวนเสื้อไว้กับอะไร?", "Woran hängen wir ein Hemd?", "Rao khwaen suea wai kap arai?", "hanger", "a"],
            ["clothing", 2, "ผ้าเปียกควรทำอะไร?", "Was sollte man mit nassem Stoff machen?", "Pha piak khuan tham arai?", "wet_cloth", "a"],
            ["clothing", 2, "เราใช้เข็มเย็บอะไร?", "Was nähen wir mit einer Nadel?", "Rao chai khem yep arai?", "sewing", "a"],
            ["clothing", 2, "ถุงมือใส่ที่มือ", "Handschuhe trägt man an den Händen.", "Thung mue sai thi mue.", "true_false", "a", "true_false"],
            ["clothing", 2, "เสื้อกันฝนใส่ตอนฝนตกไหม?", "Zieht man einen Regenmantel an, wenn es regnet?", "Suea kan fon sai ton fon tok mai?", "yes_no", "a"],
            ["clothing", 2, "เสื้อกันหนาวใส่ตอนอากาศร้อนไหม?", "Trägt man einen Pullover bei heißem Wetter?", "Suea kan nao sai ton akat ron mai?", "yes_no", "b"],

            ["jobs", 1, "ใครปลูกข้าว?", "Wer baut Reis an?", "Khrai pluk khao?", "jobs_farmer", "a"],
            ["jobs", 1, "ใครขับเครื่องบิน?", "Wer steuert ein Flugzeug?", "Khrai khap khrueang bin?", "jobs_pilot", "a"],
            ["jobs", 1, "ใครดับไฟ?", "Wer löscht Feuer?", "Khrai dap fai?", "jobs_firefighter", "a"],
            ["jobs", 1, "ใครซ่อมรถ?", "Wer repariert Autos?", "Khrai som rot?", "jobs_mechanic", "a"],
            ["jobs", 1, "ใครดูแลฟัน?", "Wer kümmert sich um die Zähne?", "Khrai dulae fan?", "jobs_dentist", "a"],
            ["jobs", 2, "ใครตัดผมให้ลูกค้า?", "Wer schneidet Kunden die Haare?", "Khrai tat phom hai lukkha?", "jobs_hair", "a"],
            ["jobs", 2, "ใครจับปลาเป็นอาชีพ?", "Wer fängt beruflich Fische?", "Khrai chap pla pen achip?", "jobs_fishing", "a"],
            ["jobs", 2, "นักข่าวเขียนข่าว", "Journalisten schreiben Nachrichten.", "Nakkhao khian khao.", "true_false", "a", "true_false"],
            ["jobs", 2, "พ่อครัวใช้เตาทำอาหารไหม?", "Benutzt ein Koch einen Herd zum Kochen?", "Pho khrua chai tao tham ahan mai?", "yes_no", "a"],
            ["jobs", 2, "ตำรวจใส่เครื่องแบบไหม?", "Trägt die Polizei eine Uniform?", "Tamruat sai khrueang baep mai?", "yes_no", "a"],

            ["technology", 1, "เราใช้อะไรถ่ายรูป?", "Womit machen wir Fotos?", "Rao chai arai thai rup?", "camera", "a"],
            ["technology", 1, "เราใช้อะไรเปลี่ยนช่องโทรทัศน์?", "Womit wechseln wir den Fernsehkanal?", "Rao chai arai plian chong thorasap?", "remote", "a"],
            ["technology", 1, "เราใช้อะไรชาร์จโทรศัพท์?", "Womit laden wir ein Telefon auf?", "Rao chai arai chat thorasap?", "charger", "a"],
            ["technology", 1, "เราพิมพ์ตัวอักษรด้วยอะไร?", "Womit tippen wir Buchstaben?", "Rao phim tua akson duai arai?", "keyboard", "a"],
            ["technology", 1, "เราใส่อะไรที่หูเพื่อฟังเพลง?", "Was setzen wir auf die Ohren, um Musik zu hören?", "Rao sai arai thi hu phuea fang phleng?", "headphones", "a"],
            ["technology", 2, "เมาส์ใช้ทำอะไร?", "Wofür benutzt man eine Computermaus?", "Mao chai tham arai?", "computer_mouse", "a"],
            ["technology", 2, "เครื่องพิมพ์ใช้ทำอะไร?", "Wofür benutzt man einen Drucker?", "Khrueang phim chai tham arai?", "printer_use", "a"],
            ["technology", 2, "คอมพิวเตอร์ต้องใช้ไฟฟ้า", "Ein Computer braucht Strom.", "Khomphiutoe tong chai faifa.", "true_false", "a", "true_false"],
            ["technology", 2, "เราใช้โทรศัพท์ดูแผนที่ได้ไหม?", "Können wir mit einem Telefon eine Karte ansehen?", "Rao chai thorasap du phaenthi dai mai?", "yes_no", "a"],
            ["technology", 2, "เราควรบอกรหัสผ่านให้คนแปลกหน้าไหม?", "Sollten wir Fremden unser Passwort verraten?", "Rao khuan bok rahat phan hai khon plaek na mai?", "yes_no", "b"],

            ["home", 1, "เราทำอาหารในห้องไหน?", "In welchem Raum kochen wir?", "Rao tham ahan nai hong nai?", "home_kitchen", "a"],
            ["home", 1, "เรานอนในห้องไหน?", "In welchem Raum schlafen wir?", "Rao non nai hong nai?", "home_bedroom", "a"],
            ["home", 1, "เรากินข้าวเย็นในห้องไหน?", "In welchem Raum essen wir zu Abend?", "Rao kin khao yen nai hong nai?", "home_dining", "a"],
            ["home", 1, "โซฟามักอยู่ในห้องไหน?", "In welchem Raum steht meistens ein Sofa?", "Sofa mak yu nai hong nai?", "home_living", "a"],
            ["home", 1, "เราจอดรถไว้ที่ไหน?", "Wo parken wir ein Auto?", "Rao chot rot wai thi nai?", "home_garage", "a"],
            ["home", 2, "หน้าต่างอยู่ส่วนไหนของห้อง?", "Wo im Zimmer befindet sich ein Fenster?", "Na tang yu suan nai khong hong?", "room_wall", "a"],
            ["home", 2, "เราใช้กุญแจเปิดประตูที่ล็อกไหม?", "Öffnen wir eine verschlossene Tür mit einem Schlüssel?", "Rao chai kunchae poet pratu thi lok mai?", "door_key", "a"],
            ["home", 2, "ห้องนอนใช้ทำอาหาร", "Im Schlafzimmer kocht man.", "Hong non chai tham ahan.", "true_false", "b", "true_false"],
            ["home", 2, "ห้องน้ำมีฝักบัวไหม?", "Hat ein Badezimmer eine Dusche?", "Hongnam mi fakbua mai?", "yes_no", "a"],
            ["home", 2, "บ้านมีหลังคาไหม?", "Hat ein Haus ein Dach?", "Ban mi langkha mai?", "yes_no", "a"],

            ["music_art", 1, "เครื่องดนตรีอะไรมีแป้นสีขาวกับสีดำ?", "Welches Instrument hat weiße und schwarze Tasten?", "Khrueang dontri arai mi paen si khao kap si dam?", "music_piano", "a"],
            ["music_art", 1, "เครื่องดนตรีอะไรมีสาย?", "Welches Instrument hat Saiten?", "Khrueang dontri arai mi sai?", "music_strings", "a"],
            ["music_art", 1, "เราตีกลองด้วยอะไร?", "Womit schlagen wir eine Trommel?", "Rao ti klong duai arai?", "drum_sticks", "a"],
            ["music_art", 1, "เราใช้พู่กันทำอะไร?", "Wofür benutzen wir einen Pinsel?", "Rao chai phu kan tham arai?", "painting_tool", "a"],
            ["music_art", 1, "ใครร้องเพลง?", "Wer singt Lieder?", "Khrai rong phleng?", "jobs_singer", "a"],
            ["music_art", 2, "ขลุ่ยเล่นด้วยการเป่า", "Eine Flöte spielt man durch Hineinblasen.", "Khlui len duai kan pao.", "true_false", "a", "true_false"],
            ["music_art", 2, "เครื่องดนตรีอะไรใช้เป่า?", "Welches Instrument spielt man durch Hineinblasen?", "Khrueang dontri arai chai pao?", "music_flute", "a"],
            ["music_art", 2, "เครื่องดนตรีอะไรใช้ตีสองชิ้นกระทบกัน?", "Welches Instrument wird gespielt, indem man zwei Teile gegeneinanderschlägt?", "Khrueang dontri arai chai ti song chin kratop kan?", "music_struck", "a"],
            ["music_art", 2, "คนเต้นตามเพลงได้ไหม?", "Kann man zu Musik tanzen?", "Khon ten tam phleng dai mai?", "yes_no", "a"],
            ["music_art", 2, "วิทยุเปิดเพลงได้ไหม?", "Kann ein Radio Musik abspielen?", "Withayu poet phleng dai mai?", "yes_no", "a"],

            ["hobbies", 1, "เราใช้อะไรเล่นแบดมินตัน?", "Womit spielen wir Badminton?", "Rao chai arai len baetmin ton?", "hobby_racket", "a"],
            ["hobbies", 1, "เราใช้อะไรเล่นฟุตบอล?", "Womit spielen wir Fußball?", "Rao chai arai len futbon?", "hobby_ball", "a"],
            ["hobbies", 1, "เราปลูกดอกไม้ในอะไร?", "Worin pflanzen wir Blumen?", "Rao pluk dokmai nai arai?", "flower_soil", "a"],
            ["hobbies", 1, "เราใช้เบ็ดทำอะไร?", "Wofür benutzen wir eine Angel?", "Rao chai bet tham arai?", "fishing_rod", "a"],
            ["hobbies", 1, "เราขี่อะไรเวลาไปขี่ม้า?", "Worauf reiten wir beim Reiten?", "Rao khi arai wela pai khi ma?", "horseback", "a"],
            ["hobbies", 2, "ว่ายน้ำเล่นที่ไหน?", "Wo kann man schwimmen?", "Wai nam len thi nai?", "swimming_places", "a"],
            ["hobbies", 2, "คนเล่นหมากรุกขยับอะไร?", "Was bewegen Schachspieler?", "Khon len mak ruk khayap arai?", "chess_pieces", "a"],
            ["hobbies", 2, "การวิ่งเป็นการออกกำลังกาย", "Laufen ist Bewegung / Sport.", "Kan wing pen kan ok kamlangkai.", "true_false", "a", "true_false"],
            ["hobbies", 2, "คนทำสวนใช้พลั่วได้ไหม?", "Kann ein Gärtner eine Schaufel benutzen?", "Khon tham suan chai phlua dai mai?", "yes_no", "a"],
            ["hobbies", 2, "คนเล่นหมากรุกใช้กระดานไหม?", "Benutzt man beim Schach ein Brett?", "Khon len mak ruk chai kradan mai?", "yes_no", "a"]
        ].map(makeBeginnerQuestion)
    ];

    const legacyDifficultyReview = {
        "thq-geo-001": 2, "thq-geo-002": 3, "thq-geo-003": 2,
        "thq-geo-004": 3, "thq-geo-005": 4, "thq-geo-006": 5,
        "thq-geo-007": 3, "thq-geo-008": 4, "thq-geo-009": 4,
        "thq-geo-010": 4, "thq-geo-011": 5, "thq-geo-012": 3,
        "thq-geo-013": 4, "thq-geo-014": 3, "thq-geo-015": 4,
        "thq-geo-016": 3, "thq-geo-017": 4, "thq-geo-018": 4,
        "thq-hist-001": 2, "thq-hist-002": 3, "thq-hist-003": 3,
        "thq-hist-004": 3, "thq-hist-005": 4, "thq-hist-006": 5,
        "thq-hist-007": 3, "thq-his-008": 4, "thq-his-009": 3,
        "thq-his-010": 5, "thq-his-011": 5, "thq-his-012": 4,
        "thq-his-013": 5, "thq-his-014": 5, "thq-his-015": 5,
        "thq-his-016": 5, "thq-his-017": 4, "thq-his-018": 5,
        "thq-cult-001": 2, "thq-cult-002": 2, "thq-cult-003": 2,
        "thq-cult-004": 3, "thq-cult-005": 3, "thq-cult-006": 4,
        "thq-cult-007": 2, "thq-cul-008": 3, "thq-cul-009": 4,
        "thq-cul-010": 5, "thq-cul-011": 4, "thq-cul-012": 5,
        "thq-cul-013": 4, "thq-cul-014": 5, "thq-cul-015": 5,
        "thq-cul-016": 5, "thq-cul-017": 5, "thq-cul-018": 5,
        "thq-food-001": 3, "thq-food-002": 2, "thq-food-003": 2,
        "thq-food-004": 2, "thq-food-005": 2, "thq-food-006": 3,
        "thq-food-007": 2, "thq-foo-008": 3, "thq-foo-009": 3,
        "thq-foo-010": 4, "thq-foo-011": 4, "thq-foo-012": 4,
        "thq-foo-013": 5, "thq-foo-014": 4, "thq-foo-015": 4,
        "thq-foo-016": 4, "thq-foo-017": 4, "thq-foo-018": 4,
        "thq-nature-001": 2, "thq-nature-002": 2, "thq-nature-003": 3,
        "thq-nature-004": 4, "thq-nature-005": 4, "thq-nature-006": 4,
        "thq-nature-007": 3, "thq-nat-008": 4, "thq-nat-009": 4,
        "thq-nat-010": 5, "thq-nat-011": 4, "thq-nat-012": 5,
        "thq-nat-013": 5, "thq-nat-014": 5, "thq-nat-015": 5,
        "thq-nat-016": 4, "thq-nat-017": 4, "thq-nat-018": 5,
        "thq-sport-001": 2, "thq-sport-002": 3, "thq-sport-003": 4,
        "thq-sport-004": 3, "thq-sport-005": 3, "thq-sport-006": 5,
        "thq-sport-007": 4, "thq-sport-008": 4, "thq-sport-009": 5,
        "thq-sport-010": 3, "thq-sport-011": 4, "thq-sport-012": 4,
        "thq-sport-013": 5, "thq-sport-014": 5, "thq-sport-015": 5,
        "thq-sport-016": 5, "thq-sport-017": 5, "thq-sport-018": 5,
        "thq-rel-005": 4, "thq-rel-006": 4, "thq-rel-007": 5,
        "thq-rel-008": 3, "thq-rel-009": 5, "thq-rel-010": 5,
        "thq-rel-011": 5, "thq-rel-012": 5, "thq-rel-013": 5,
        "thq-rel-014": 4, "thq-rel-015": 4, "thq-rel-016": 4,
        "thq-rel-017": 4,
        "thq-lan-005": 3, "thq-lan-006": 3, "thq-lan-007": 3,
        "thq-lan-008": 4, "thq-lan-009": 4, "thq-lan-010": 4,
        "thq-lan-011": 3, "thq-lan-012": 4, "thq-lan-013": 5,
        "thq-lan-014": 3, "thq-lan-015": 4, "thq-lan-016": 4,
        "thq-lan-017": 3,
        "thq-lan-018": 3,
        "thq-lan-019": 3,
        "thq-lan-020": 3,
        "thq-lan-021": 3,
        "thq-lan-022": 3,
        "thq-lan-023": 3,
        "thq-lan-024": 3,
        "thq-lan-025": 3,
        "thq-lan-026": 3,
        "thq-lan-027": 3,
        "thq-foo-019": 3,
        "thq-foo-020": 3,
        "thq-foo-021": 3,
        "thq-foo-022": 3,
        "thq-foo-023": 3,
        "thq-foo-024": 3,
        "thq-foo-025": 3,
        "thq-foo-026": 3,
        "thq-foo-027": 3,
        "thq-foo-028": 3,
        "thq-geo-019": 3,
        "thq-geo-020": 3,
        "thq-geo-021": 3,
        "thq-geo-022": 3,
        "thq-geo-023": 3,
        "thq-geo-024": 3,
        "thq-geo-025": 3,
        "thq-geo-026": 3,
        "thq-geo-027": 3,
        "thq-geo-028": 3,
        "thq-cul-019": 3,
        "thq-cul-020": 3,
        "thq-cul-021": 3,
        "thq-cul-022": 3,
        "thq-cul-023": 3,
        "thq-cul-024": 3,
        "thq-cul-025": 3,
        "thq-cul-026": 3,
        "thq-cul-027": 3,
        "thq-cul-028": 3,
        "thq-geo-029": 3,
        "thq-geo-030": 3,
        "thq-geo-031": 3,
        "thq-geo-032": 3,
        "thq-geo-033": 3,
        "thq-geo-034": 3,
        "thq-geo-035": 3,
        "thq-geo-036": 3,
        "thq-geo-037": 3,
        "thq-geo-038": 3,
        "thq-nat-019": 3,
        "thq-nat-020": 3,
        "thq-nat-021": 3,
        "thq-nat-022": 3,
        "thq-nat-023": 3,
        "thq-nat-024": 3,
        "thq-nat-025": 3,
        "thq-nat-026": 3,
        "thq-nat-027": 3,
        "thq-nat-028": 3,
        "thq-cul-029": 3,
        "thq-cul-030": 3,
        "thq-cul-031": 3,
        "thq-cul-032": 3,
        "thq-cul-033": 3,
        "thq-cul-034": 3,
        "thq-cul-035": 3,
        "thq-cul-036": 3,
        "thq-cul-037": 3,
        "thq-cul-038": 3,
        "thq-nat-029": 3,
        "thq-nat-030": 3,
        "thq-nat-031": 3,
        "thq-nat-032": 3,
        "thq-nat-033": 3,
        "thq-nat-034": 3,
        "thq-nat-035": 3,
        "thq-nat-036": 3,
        "thq-nat-037": 3,
        "thq-nat-038": 3,
        "thq-sport-019": 3,
        "thq-sport-020": 3,
        "thq-sport-021": 3,
        "thq-sport-022": 3,
        "thq-sport-023": 3,
        "thq-sport-024": 3,
        "thq-sport-025": 3,
        "thq-sport-026": 3,
        "thq-sport-027": 3,
        "thq-sport-028": 3,
        "thq-lan-028": 3,
        "thq-lan-029": 3,
        "thq-lan-030": 3,
        "thq-lan-031": 3,
        "thq-lan-032": 3,
        "thq-lan-033": 3,
        "thq-lan-034": 3,
        "thq-lan-035": 3,
        "thq-lan-036": 3,
        "thq-lan-037": 3,
        "thq-beg-001": 1,
        "thq-beg-002": 1,
        "thq-beg-003": 1,
        "thq-beg-004": 1,
        "thq-beg-005": 1,
        "thq-beg-006": 1,
        "thq-beg-007": 1,
        "thq-beg-008": 1,
        "thq-beg-009": 1,
        "thq-beg-010": 1,
        "thq-beg-011": 1,
        "thq-beg-012": 1,
        "thq-beg-013": 1,
        "thq-beg-014": 1,
        "thq-beg-015": 1,
        "thq-beg-016": 1,
        "thq-beg-017": 1,
        "thq-beg-018": 1,
        "thq-beg-019": 1,
        "thq-beg-020": 1,
        "thq-beg-021": 1,
        "thq-beg-022": 1,
        "thq-beg-023": 1,
        "thq-beg-024": 1,
        "thq-beg-025": 1,
        "thq-beg-026": 1,
        "thq-beg-027": 1,
        "thq-beg-028": 1,
        "thq-beg-029": 1,
        "thq-beg-030": 1,
        "thq-beg-031": 1,
        "thq-beg-032": 1,
        "thq-beg-033": 1,
        "thq-beg-034": 1,
        "thq-beg-035": 1,
        "thq-beg-036": 1,
        "thq-beg-037": 1,
        "thq-beg-038": 1,
        "thq-beg-039": 1,
        "thq-beg-040": 1,
        "thq-beg-041": 1,
        "thq-beg-042": 1,
        "thq-beg-043": 1,
        "thq-beg-044": 1,
        "thq-beg-045": 1,
        "thq-beg-046": 1,
        "thq-beg-047": 1,
        "thq-beg-048": 1,
        "thq-beg-049": 1,
        "thq-beg-050": 1,
        "thq-beg-051": 2,
        "thq-beg-052": 2,
        "thq-beg-053": 2,
        "thq-beg-054": 2,
        "thq-beg-055": 2,
        "thq-beg-056": 2,
        "thq-beg-057": 2,
        "thq-beg-058": 2,
        "thq-beg-059": 2,
        "thq-beg-060": 2,
        "thq-beg-061": 2,
        "thq-beg-062": 2,
        "thq-beg-063": 2,
        "thq-beg-064": 2,
        "thq-beg-065": 2,
        "thq-beg-066": 2,
        "thq-beg-067": 2,
        "thq-beg-068": 2,
        "thq-beg-069": 2,
        "thq-beg-070": 2,
        "thq-beg-071": 2,
        "thq-beg-072": 2,
        "thq-beg-073": 2,
        "thq-beg-074": 2,
        "thq-beg-075": 2,
        "thq-beg-076": 2,
        "thq-beg-077": 2,
        "thq-beg-078": 2,
        "thq-beg-079": 2,
        "thq-beg-080": 2,
        "thq-beg-081": 2,
        "thq-beg-082": 2,
        "thq-beg-083": 2,
        "thq-beg-084": 2,
        "thq-beg-085": 2,
        "thq-beg-086": 2,
        "thq-beg-087": 2,
        "thq-beg-088": 2,
        "thq-beg-089": 2,
        "thq-beg-090": 2,
        "thq-beg-091": 2,
        "thq-beg-092": 2,
        "thq-beg-093": 2,
        "thq-beg-094": 2,
        "thq-beg-095": 2,
        "thq-beg-096": 2,
        "thq-beg-097": 2,
        "thq-beg-098": 2,
        "thq-beg-099": 2,
        "thq-beg-100": 2,
    };
    const legacyQuestions = questions.filter(question =>
        !question.id.startsWith("thq-beginner-")
    );
    const unreviewedLegacyQuestions = legacyQuestions.filter(question =>
        !Object.prototype.hasOwnProperty.call(legacyDifficultyReview, question.id)
    );
    if (
        unreviewedLegacyQuestions.length > 0 ||
        Object.keys(legacyDifficultyReview).length !== legacyQuestions.length
    ) {
        throw new Error(
            `Schwierigkeitsbewertung unvollständig: ${unreviewedLegacyQuestions.map(question => question.id).join(", ")}`
        );
    }
    for (const question of legacyQuestions) {
        question.difficulty = legacyDifficultyReview[question.id];
    }

    const data = { categories, questions };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = data;
    }

    if (root) {
        root.THAILAND_QUIZ_DATA = data;
    }
})(typeof window !== "undefined" ? window : null);
