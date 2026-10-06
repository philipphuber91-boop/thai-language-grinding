(function (root) {
    "use strict";

    const rawWords = [
        ["ใด", "dai", "welcher; welche; welches", "ใด", "dai"],
        ["ประเทศไทย", "prathet Thai", "Thailand", "ประ|เทศ|ไทย", "pra|thêt|Thai"],
        ["กรุงเทพมหานคร", "Krung Thep Maha Nakhon", "Bangkok; wörtlich: Stadt der Engel", "กรุง|เทพ|ม|หา|น|คร", "krung|thêp|ma|ha|na|khon"],
        ["เมืองหลวง", "mueang luang", "Hauptstadt", "เมือง|หลวง", "mueang|luang"],
        ["ศูนย์กลาง", "sun klang", "Zentrum; Mittelpunkt", "ศูนย์|กลาง", "sun|klang"],
        ["ปกครอง", "pok khrong", "regieren; verwalten", "ปก|ครอง", "pok|khrong"],
        ["เกาะ", "ko", "Insel", "เกาะ", "ko"],
        ["เกาะสมุย", "Ko Samui", "Koh Samui", "เกาะ|ส|มุย", "ko|sa|mui"],
        ["เกาะช้าง", "Ko Chang", "Koh Chang", "เกาะ|ช้าง", "ko|chang"],
        ["เกาะพะงัน", "Ko Pha-ngan", "Koh Phangan", "เกาะ|พะ|งัน", "ko|pha|ngan"],
        ["ดอยอินทนนท์", "Doi Inthanon", "Doi Inthanon; höchster Berg Thailands", "ดอย|อิน|ท|นนท์", "doi|in|tha|non"],
        ["จังหวัด", "changwat", "Provinz", "จัง|หวัด", "chang|wat"],
        ["นครราชสีมา", "Nakhon Ratchasima", "Provinz Nakhon Ratchasima", "น|คร|ราช|สี|มา", "na|khon|rat|si|ma"],
        ["โคราช", "Khorat", "Kurzname für Nakhon Ratchasima", "โค|ราช", "kho|rat"],
        ["พรมแดน", "phrom daen", "Landesgrenze", "พรม|แดน", "phrom|daen"],
        ["บก", "bok", "Land; Festland", "บก", "bok"],
        ["พม่า", "Phama", "Myanmar; Birma", "พ|ม่า", "pha|ma"],
        ["ลาว", "Lao", "Laos", "ลาว", "lao"],
        ["กัมพูชา", "Kampuchia", "Kambodscha", "กัม|พู|ชา", "kam|phu|cha"],
        ["มาเลเซีย", "Malesia", "Malaysia", "มา|เล|เซีย", "ma|le|sia"],
        ["เวียดนาม", "Wiatnam", "Vietnam", "เวียด|นาม", "wiat|nam"],
        ["อันดามัน", "Andaman", "Andamanensee", "อัน|ดา|มัน", "an|da|man"],
        ["ทะเลจีนใต้", "Thale Chin Tai", "Südchinesisches Meer", "ทะ|เล|จีน|ใต้", "tha|le|chin|tai"],
        ["ยอดดอย", "yot doi", "Berggipfel", "ยอด|ดอย", "yot|doi"],
        ["สูง", "sung", "hoch", "สูง", "sung"],
        ["ระดับ", "radap", "Niveau; Höhe", "ระ|ดับ", "ra|dap"],
        ["พื้นที่", "phuen thi", "Fläche; Gebiet", "พื้น|ที่", "phuen|thi"],
        ["เชียงราย", "Chiang Rai", "Chiang Rai", "เชียง|ราย", "chiang|rai"],
        ["แม่ฮ่องสอน", "Mae Hong Son", "Mae Hong Son", "แม่|ฮ่อง|สอน", "mae|hong|son"],
        ["สุโขทัย", "Sukhothai", "Sukhothai", "สุ|โข|ทัย", "su|kho|thai"],
        ["ศรีอยุธยา", "Si Ayutthaya", "historischer Name Ayutthayas", "ศรี|อ|ยุ|ธ|ยา", "si|a|yut|tha|ya"],
        ["อยุธยา", "Ayutthaya", "Ayutthaya", "อ|ยุ|ธ|ยา", "a|yut|tha|ya"],
        ["อาณาจักร", "ana chak", "Königreich", "อา|ณา|จักร", "a|na|chak"],
        ["กองทัพ", "kong thap", "Armee; Streitkräfte", "กอง|ทัพ", "kong|thap"],
        ["โจมตี", "chom ti", "angreifen", "โจม|ตี", "chom|ti"],
        ["ทำลาย", "tham lai", "zerstören", "ทำ|ลาย", "tham|lai"],
        ["เปลี่ยนแปลง", "plian plaeng", "verändern; Wandel", "เปลี่ยน|แปลง", "plian|plaeng"],
        ["รัฐธรรมนูญ", "ratthathammanun", "Verfassung", "รัฐ|ธ|รร|ม|นูญ", "rat|tha|tham|ma|nun"],
        ["สมบูรณาญาสิทธิราชย์", "sombunyanasitthirat", "absolute Monarchie", "สม|บูร|ณา|ญา|สิทธิ|ราชย์", "som|bun|ya|na|sit|that"],
        ["วัฒนธรรม", "watthanatham", "Kultur", "วัฒ|น|ธรรม", "wat|tha|tham"],
        ["ธรรมชาติ", "thammachat", "Natur", "ธรรม|ชาติ", "tham|chat"],
        ["โบราณคดี", "boranakhadi", "Archäologie", "โบ|รา|ณ|ค|ดี", "bo|ra|na|kha|di"],
        ["มรดกโลก", "moradok lok", "Welterbe", "ม|ร|ดก|โลก", "mo|ra|dok|lok"],
        ["มรดก", "moradok", "Erbe; Kulturerbe", "ม|ร|ดก", "mo|ra|dok"],
        ["โลก", "lok", "Welt", "โลก", "lok"],
        ["แหล่ง", "laeng", "Ort; Quelle; Stätte", "แหล่ง", "laeng"],
        ["แห่ง", "haeng", "von; der/die/das (Zählwort für Orte)", "แห่ง", "haeng"],
        ["ทะเบียน", "thabian", "Register; Verzeichnis", "ทะ|เบียน", "tha|bian"],
        ["สุโขทัย", "Sukhothai", "Sukhothai", "สุ|โข|ทัย", "su|kho|thai"],
        ["กำแพงเพชร", "Kamphaeng Phet", "Kamphaeng Phet", "กำ|แพง|เพชร", "kam|phaeng|phet"],
        ["ศรีสัชนาลัย", "Si Satchanalai", "Si Satchanalai", "ศรี|สั|ชน|า|ลัย", "si|sat|cha|na|lai"],
        ["บ้านเชียง", "Ban Chiang", "Ban Chiang; archäologische Fundstätte", "บ้าน|เชียง", "ban|chiang"],
        ["ทุ่งใหญ่", "Thung Yai", "Thung Yai", "ทุ่ง|ใหญ่", "thung|yai"],
        ["นเรศวร", "Naresuan", "Naresuan", "น|เรศ|วร", "na|ret|won"],
        ["สงกรานต์", "Songkran", "thailändisches Neujahrsfest im April", "สง|กรานต์", "song|kran"],
        ["เมษายน", "mesayon", "April", "เม|ษา|ยน", "me|sa|yon"],
        ["เทศกาล", "thet sa kan", "Fest; Festival", "เทศ|กาล", "thet|kan"],
        ["วันปีใหม่", "wan pi mai", "Neujahrstag", "วัน|ปี|ใหม่", "wan|pi|mai"],
        ["อาณาจักร", "ana chak", "Königreich", "อา|ณา|จักร", "a|na|chak"],
        ["ลอยกระทง", "Loi Krathong", "Loi Krathong; Lichterfest", "ลอย|กระ|ทง", "loi|kra|thong"],
        ["กระทง", "krathong", "kleines, dekoriertes Schwimmgefäß aus Blättern", "กระ|ทง", "kra|thong"],
        ["โคม", "khom", "Laterne", "โคม", "khom"],
        ["นาฏศิลป์", "natsin", "darstellende Tanzkunst", "นา|ฏ|ศิลป์", "na|ta|sin"],
        ["หน้ากาก", "na kak", "Maske", "หน้า|กาก", "na|kak"],
        ["โขน", "khon", "Khon; thailändisches maskiertes Tanzdrama", "โขน", "khon"],
        ["รามเกียรติ์", "Ramakien", "thailändisches Nationalepos Ramakien", "รา|ม|เกียรติ์", "ra|ma|kiat"],
        ["ไหว้", "wai", "respektvoll grüßen; Wai-Gruß", "ไหว้", "wai"],
        ["เคารพ", "khao rop", "respektieren; Ehrerbietung zeigen", "เคา|รพ", "khao|rop"],
        ["ประเพณี", "prapheni", "Tradition; Brauch", "ประ|เพ|ณี", "pra|phe|ni"],
        ["ประเจียด", "pra chiat", "traditionelles Muay-Thai-Armband", "ประ|เจียด", "pra|chiat"],
        ["มวยไทย", "Muay Thai", "thailändisches Boxen", "มวย|ไทย", "muai|thai"],
        ["มวย", "muai", "Boxkampf; Boxen", "มวย", "muai"],
        ["ศิลปะ", "sinlapa", "Kunst; Kunstform", "ศิ|ล|ปะ", "sin|la|pa"],
        ["แขน", "khaen", "Arm", "แขน", "khaen"],
        ["ขา", "kha", "Bein", "ขา", "kha"],
        ["แข้ง", "khaeng", "Schienbein", "แข้ง", "khaeng"],
        ["ศอก", "sok", "Ellbogen", "ศอก", "sok"],
        ["เข่า", "khao", "Knie", "เข่า", "khao"],
        ["เท้า", "thao", "Fuß", "เท้า", "thao"],
        ["ศีรษะ", "sisa", "Kopf", "ศี|รษะ", "si|sa"],
        ["ลูกบอล", "luk bon", "Ball", "ลูก|บอล", "luk|bon"],
        ["ตะกร้อ", "takro", "Sepak-Takraw-Ball; Korbball", "ตะ|กร้อ", "ta|kro"],
        ["เซปักตะกร้อ", "sepak takraw", "Sepak Takraw", "เซ|ปัก|ตะ|กร้อ", "se|pak|ta|kro"],
        ["นักมวย", "nak muai", "Boxkämpfer", "นัก|มวย", "nak|muai"],
        ["ไหว้ครู", "wai khru", "Ehrerbietung gegenüber dem Lehrer", "ไหว้|ครู", "wai|khru"],
        ["รำมวย", "ram muai", "Muay-Thai-Ritualtanz", "รำ|มวย", "ram|muai"],
        ["สมเด็จ", "somdet", "königlicher Ehrentitel", "สม|เด็จ", "som|det"],
        ["ช้างเอเชีย", "chang Asia", "Asiatischer Elefant", "ช้าง|เอ|เชีย", "chang|e|sia"],
        ["ช้าง", "chang", "Elefant", "ช้าง", "chang"],
        ["อุทยานแห่งชาติ", "uthayan haeng chat", "Nationalpark", "อุ|ท|ยาน|แห่ง|ชาติ", "u|tha|yan|haeng|chat"],
        ["อุทยาน", "uthayan", "Park; Schutzgebiet", "อุ|ท|ยาน", "u|tha|yan"],
        ["ธรรมชาติ", "thammachat", "Natur", "ธรรม|ชาติ", "tham|chat"],
        ["ชายฝั่ง", "chai fang", "Küste", "ชาย|ฝั่ง", "chai|fang"],
        ["ถั่วลิสง", "thua lisong", "Erdnuss", "ถั่ว|ลิ|สง", "thua|li|song"],
        ["ข้าวเหนียว", "khao niao", "Klebreis", "ข้าว|เหนียว", "khao|niao"],
        ["เหนียว", "niao", "klebrig; zäh", "เหนียว", "niao"],
        ["มะละกอ", "malako", "Papaya", "มะ|ละ|กอ", "ma|la|ko"],
        ["ส้มตำ", "som tam", "Som Tam; würziger Papayasalat", "ส้ม|ตำ", "som|tam"],
        ["ผัดไทย", "phat Thai", "Pad Thai", "ผัด|ไทย", "phat|Thai"],
        ["เส้นข้าว", "sen khao", "Reisnudeln", "เส้น|ข้าว", "sen|khao"],
        ["ต้มยำ", "tom yam", "Tom Yam; scharf-saure Suppe", "ต้ม|ยำ", "tom|yam"],
        ["กะทิ", "kathi", "Kokosmilch", "กะ|ทิ", "ka|thi"],
        ["มัสมั่น", "matsaman", "Massaman-Curry", "มัส|มั่น", "mat|man"],
        ["แกง", "kaeng", "Curry; thailändisches Currygericht", "แกง", "kaeng"],
        ["ถั่ว", "thua", "Bohne; Nuss", "ถั่ว", "thua"],
        ["มะม่วง", "mamuang", "Mango", "มะ|ม่วง", "ma|muang"],
        ["ฝรั่ง", "farang", "Guave; umgangssprachlich auch: Westler", "ฝ|รั่ง", "fa|rang"],
        ["กะหล่ำปลี", "kalam pli", "Kohl", "กะ|หล่ำ|ปลี", "ka|lam|pli"],
        ["ข้าวโพด", "khao phot", "Mais", "ข้าว|โพด", "khao|phot"],
        ["สับปะรด", "sapparot", "Ananas", "สับ|ปะ|รด", "sap|pa|rot"],
        ["ขอนแก่น", "Khon Kaen", "Khon Kaen", "ขอน|แก่น", "khon|kaen"],
        ["เชียงใหม่", "Chiang Mai", "Chiang Mai", "เชียง|ใหม่", "chiang|mai"],
        ["นครสวรรค์", "Nakhon Sawan", "Nakhon Sawan", "น|คร|ส|วรรค์", "na|khon|sa|wan"],
        ["อุดรธานี", "Udon Thani", "Udon Thani", "อุ|ดร|ธา|นี", "u|don|tha|ni"],
        ["บุรีรัมย์", "Buriram", "Buriram", "บุ|รี|รัมย์", "bu|ri|ram"],
        ["สุราษฎร์ธานี", "Surat Thani", "Surat Thani", "สุ|ราษฎร์|ธา|นี", "su|rat|tha|ni"],
        ["พังงา", "Phang Nga", "Phang Nga", "พัง|งา", "phang|nga"],
        ["กาญจนบุรี", "Kanchanaburi", "Kanchanaburi", "กาญ|จ|น|บุ|รี", "kan|cha|na|bu|ri"],
        ["เกาหลีใต้", "Kao-li Tai", "Südkorea", "เกา|หลี|ใต้", "kao|li|tai"],
        ["กรุงเทพฯ", "Krung Thep", "Kurzform für Bangkok", "กรุง|เทพฯ", "krung|thep"],
        ["ว่าว", "wao", "Drachen", "ว่าว", "wao"],
        ["สีแดง", "si daeng", "rote Farbe", "สี|แดง", "si|daeng"],
        ["ธงชาติ", "thong chat", "Nationalflagge", "ธง|ชาติ", "thong|chat"],
        ["ยกมือ", "yok mue", "die Hand heben", "ยก|มือ", "yok|mue"],
        ["ก้ม", "kom", "sich beugen; den Kopf senken", "ก้ม", "kom"],
        ["ทักทาย", "thak thai", "begrüßen", "ทัก|ทาย", "thak|thai"],
        ["ศตวรรษ", "satawat", "Jahrhundert", "ศ|ต|วรรษ", "sa|ta|wat"],
        ["เอกลักษณ์", "ekkalak", "einzigartiges Merkmal; Identität", "เอก|ลักษณ์", "ek|lak"],
        ["สหพันธรัฐ", "sahaphanthat", "Bundesstaat", "ส|ห|พัน|ธ|รัฐ", "sa|ha|phan|tha|rat"],
        ["สาธารณรัฐ", "satharanarat", "Republik", "สา|ธา|ร|ณ|รัฐ", "sa|tha|ra|na|rat"],
        ["สังเคราะห์", "sangkro", "synthetisch; künstlich hergestellt", "สัง|เคราะห์", "sang|khro"],
        ["เขต", "khet", "Gebiet; Bezirk", "เขต", "khet"],
        ["แนวคิด", "naeo khit", "Konzept; Idee", "แนว|คิด", "naeo|khit"],
        ["ชนิด", "chanit", "Art; Sorte", "ช|นิด", "cha|nit"],
        ["ผู้คน", "phu khon", "Menschen; Bevölkerung", "ผู้|คน", "phu|khon"],
        ["อาศัย", "asai", "wohnen; leben; sich aufhalten", "อา|ศัย", "a|sai"],
        ["เติบโต", "toep to", "wachsen; groß werden", "เติบ|โต", "toep|to"],
        ["ปัจจุบัน", "patchuban", "Gegenwart; aktuell", "ปัจ|จุ|บัน", "pat|chu|ban"],
        ["ประกาศ", "prakat", "verkünden; bekannt geben", "ประ|กาศ", "pra|kat"],
        ["สัมผัส", "samphat", "berühren; Kontakt", "สัม|ผัส", "sam|phat"],
        ["อนุรักษ์", "anurak", "bewahren; schützen", "อ|นุ|รักษ์", "a|nu|rak"],
        ["ราชธานี", "ratchathani", "Hauptstadt; königliche Stadt", "ราช|ธา|นี", "rat|tha|ni"],
        ["กำเนิด", "kamnoet", "Geburt; Ursprung", "กำ|เนิด", "kam|noet"],
        ["กำเนิดขึ้น", "kamnoet khuen", "entstehen; gegründet werden", "กำ|เนิด|ขึ้น", "kam|noet|khuen"],
        ["เป็นการ", "pen kan", "als; es handelt sich um", "เป็น|การ", "pen|kan"],
        ["อย่างไร", "yang rai", "wie; auf welche Weise", "อย่าง|ไร", "yang|rai"],
        ["เท่าใด", "thao dai", "wie viel; wie groß", "เท่า|ใด", "thao|dai"],
        ["อิทธิพล", "itthiphon", "Einfluss", "อิท|ธิ|พล", "it|thi|phon"],
        ["ธรรมเนียม", "thamnian", "Brauch; Gepflogenheit", "ธรรม|เนียม", "tham|niam"],
        ["วัตถุดิบ", "watthudip", "Zutat; Rohstoff", "วัต|ถุ|ดิบ", "wat|thu|dip"],
        ["ปรุง", "prung", "zubereiten; würzen", "ปรุง", "prung"],
        ["เสิร์ฟ", "soep", "servieren", "เสิร์ฟ", "soep"],
        ["สุก", "suk", "reif; gar", "สุก", "suk"],
        ["เปรี้ยว", "priao", "sauer", "เปรี้ยว", "priao"],
        ["จืด", "chuet", "fade; mild", "จืด", "chuet"],
        ["เด่น", "den", "auffällig; typisch", "เด่น", "den"],
        ["ขม", "khom", "bitter", "ขม", "khom"],
        ["ห้าม", "ham", "verbieten; nicht dürfen", "ห้าม", "ham"],
        ["สามารถ", "samart", "können; fähig sein", "สา|มารถ", "sa|mat"],
        ["ป่า", "pa", "Wald", "ป่า", "pa"],
        ["นิเวศ", "niwet", "Ökologie; ökologisch", "นิ|เวศ", "ni|wet"],
        ["บริเวณ", "boriwen", "Umgebung; Bereich", "บ|ริ|เวณ", "bo|ri|wen"],
        ["ถิ่น", "thin", "Heimat; Gebiet", "ถิ่น", "thin"],
        ["พันธุ์", "phan", "Art; Spezies; Sorte", "พันธุ์", "phan"],
        ["สัตว์", "sat", "Tier", "สัตว์", "sat"],
        ["ข้าวเหนียวมะม่วง", "khao niao mamuang", "Mango mit Klebreis", "ข้าว|เหนียว|มะ|ม่วง", "khao|niao|ma|muang"],
        ["น้ำกะทิ", "nam kathi", "Kokosmilch", "น้ำ|กะ|ทิ", "nam|ka|thi"]
    ];

    const uniqueRawWords = rawWords.filter((word, index) =>
        rawWords.findIndex(candidate => candidate[0] === word[0]) === index
    );
    const validationErrors = [];
    const words = uniqueRawWords.map(([thai, transliteration, meaning, syllableText, syllableReadings]) => {
        const syllables = syllableText.split("|");
        const readings = syllableReadings.split("|");
        if (syllables.join("") !== thai || syllables.length !== readings.length) {
            validationErrors.push(thai);
            return null;
        }
        return {
            id: `quiz-word-${wordsSlug(thai)}`,
            thai,
            transliteration,
            meanings: [meaning],
            syllables: syllables.map((syllable, index) => ({
                thai: syllable,
                transliteration: readings[index]
            }))
        };
    });
    if (validationErrors.length > 0) {
        throw new Error(
            `Quiz-Wörter mit ungültiger Silbenstruktur: ${validationErrors.join(", ")}`
        );
    }

    function wordsSlug(value) {
        return [...value].map(character => character.codePointAt(0).toString(16)).join("-");
    }

    const data = { words };
    if (typeof module !== "undefined" && module.exports) {
        module.exports = data;
    }
    if (root) {
        root.THAILAND_QUIZ_WORDS = data;
    }
})(typeof window !== "undefined" ? window : null);
