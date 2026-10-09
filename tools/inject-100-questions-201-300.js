#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const QUIZ_FILE = path.join(ROOT, "data/thailand-quiz.js");
const WORDS_FILE = path.join(ROOT, "data/thailand-quiz-words.js");
const VOCAB_API = path.join(ROOT, "js/thailand-quiz-vocabulary.js");
const GIGA_FILE = path.join(ROOT, "data/thai-giga-drill.v1.json");

const rawQuestions = [
    ["geography", 1, "แม่น้ำใดเป็นพรมแดนระหว่างไทยกับลาว?", "Welcher Fluss bildet über weite Strecken die Grenze zwischen Thailand und Laos?", [["แม่น้ำโขง", "Mekong"], ["แม่น้ำเจ้าพระยา", "Chao Phraya"], ["แม่น้ำดานูบ", "Donau"], ["แม่น้ำไรน์", "Rhein"]]],
    ["geography", 1, "เกาะสมุยอยู่ในจังหวัดใด?", "In welcher Provinz liegt die Insel Koh Samui?", [["สุราษฎร์ธานี", "Surat Thani"], ["เชียงใหม่", "Chiang Mai"], ["เลย", "Loei"], ["ตราด", "Trat"]]],
    ["geography", 1, "เกาะช้างอยู่ในจังหวัดใด?", "Zu welcher Provinz gehört die Insel Koh Chang?", [["ตราด", "Trat"], ["ภูเก็ต", "Phuket"], ["อุดรธานี", "Udon Thani"], ["ลำปาง", "Lampang"]]],
    ["geography", 1, "อุทยานแห่งชาติภูกระดึงอยู่ในจังหวัดใด?", "In welcher Provinz liegt der Nationalpark Phu Kradueng?", [["เลย", "Loei"], ["กระบี่", "Krabi"], ["พระนครศรีอยุธยา", "Ayutthaya"], ["ชลบุรี", "Chonburi"]]],
    ["geography", 1, "ภาคกลางของไทยมีชื่อเสียงเรื่องใด?", "Wofür ist die zentrale Ebene Thailands besonders bekannt?", [["ที่ราบอุดมสมบูรณ์และนาข้าว", "Fruchtbare Ebenen und Reisfelder"], ["ธารน้ำแข็ง", "Gletscher"], ["ทะเลทราย", "Wüsten"], ["ภูเขาไฟที่ยังปะทุ", "Aktive Vulkane"]]],
    ["geography", 1, "ภาคใต้ของไทยตั้งอยู่บนคาบสมุทรใด?", "Auf welcher Halbinsel liegt der Süden Thailands?", [["คาบสมุทรมลายู", "Malaiische Halbinsel"], ["คาบสมุทรไอบีเรีย", "Iberische Halbinsel"], ["คาบสมุทรอาหรับ", "Arabische Halbinsel"], ["คาบสมุทรบอลข่าน", "Balkanhalbinsel"]]],
    ["geography", 1, "น้ำตกเอราวัณอยู่ในจังหวัดใด?", "In welcher Provinz befinden sich die Erawan-Wasserfälle?", [["กาญจนบุรี", "Kanchanaburi"], ["นครสวรรค์", "Nakhon Sawan"], ["เชียงราย", "Chiang Rai"], ["ระยอง", "Rayong"]]],
    ["geography", 1, "เมืองใดอยู่ทางเหนือสุดของตัวเลือกเหล่านี้?", "Welche dieser Städte liegt im äußersten Norden Thailands?", [["เชียงราย", "Chiang Rai"], ["หาดใหญ่", "Hat Yai"], ["พัทยา", "Pattaya"], ["หัวหิน", "Hua Hin"]]],
    ["geography", 2, "หาดไร่เลย์ซึ่งมีหน้าผาหินปูนสำหรับปีนผาอยู่ในจังหวัดใด?", "Zu welcher Provinz gehört Railay, ein bekanntes Ziel zum Klettern an Kalksteinfelsen?", [["กระบี่", "Krabi"], ["ตราด", "Trat"], ["สุโขทัย", "Sukhothai"], ["ลพบุรี", "Lopburi"]]],
    ["geography", 1, "เชียงคานตั้งอยู่ริมแม่น้ำใด?", "An welchem Fluss liegt Chiang Khan?", [["แม่น้ำโขง", "Mekong"], ["แม่น้ำเจ้าพระยา", "Chao Phraya"], ["แม่น้ำปิง", "Ping"], ["แม่น้ำยม", "Yom"]]],

    ["history", 2, "กษัตริย์พระองค์ใดทรงตั้งกรุงเทพฯ เป็นเมืองหลวงในปี พ.ศ. 2325?", "Welcher König machte Bangkok 1782 zur neuen Hauptstadt?", [["รัชกาลที่หนึ่ง", "Rama I."], ["รัชกาลที่ห้า", "Rama V."], ["สมเด็จพระเจ้าตากสิน", "König Taksin"], ["พ่อขุนรามคำแหง", "König Ramkhamhaeng"]]],
    ["history", 1, "วันจักรีระลึกถึงเรื่องใด?", "Was feiert Thailand am Chakri-Tag?", [["การก่อตั้งราชวงศ์จักรี", "Die Gründung der Chakri-Dynastie"], ["การเริ่มต้นฤดูฝน", "Den Beginn der Regenzeit"], ["การเปิดสนามบินแห่งแรก", "Die Eröffnung des ersten Flughafens"], ["วันปิดภาคเรียน", "Das Ende des Schuljahres"]]],
    ["history", 2, "พุทธศักราชมากกว่าคริสต์ศักราชกี่ปีโดยทั่วไป?", "Um wie viele Jahre liegt die buddhistische Jahreszählung üblicherweise vor der gregorianischen?", [["543 ปี", "543 Jahre"], ["50 ปี", "50 Jahre"], ["100 ปี", "100 Jahre"], ["1.000 ปี", "1.000 Jahre"]]],
    ["history", 2, "ยุคประวัติศาสตร์ที่เริ่มเมื่อกรุงเทพฯ เป็นเมืองหลวงเรียกว่าอะไร?", "Wie heißt die historische Epoche, die mit Bangkok als Hauptstadt begann?", [["รัตนโกสินทร์", "Rattanakosin"], ["ยุคกลาง", "Mittelalter"], ["ยุคเอโดะ", "Edo-Zeit"], ["ยุคโบราณ", "Antike"]]],
    ["history", 2, "สยามรักษาเอกราชในยุคอาณานิคมของยุโรปได้อย่างไร?", "Wie konnte Siam seine staatliche Unabhängigkeit während der europäischen Kolonialzeit bewahren?", [["ใช้การทูตและการประนีประนอมทางการเมือง", "Durch Diplomatie und politische Kompromisse"], ["สร้างกำแพงรอบประเทศ", "Durch eine Mauer rund um das Land"], ["หยุดค้าขายกับทุกประเทศ", "Durch den Verzicht auf Handel"], ["สร้างเรือดำน้ำจำนวนมาก", "Durch den Bau vieler U-Boote"]]],

    ["food", 1, "ไส้อั่วเป็นอาหารชนิดใด?", "Welche Speise ist Sai Ua?", [["ไส้กรอกสมุนไพรแบบภาคเหนือ", "Eine würzige nordthailändische Wurst"], ["ขนมหวานมะม่วง", "Ein süßer Mangokuchen"], ["ซุปกะทิ", "Eine Kokosnusssuppe"], ["ขนมปลา", "Ein Fischdessert"]]],
    ["food", 1, "ข้าวมันไก่ประกอบด้วยอะไรเป็นหลัก?", "Was ist Khao Man Gai?", [["ไก่กับข้าวที่หุงในน้ำซุป", "Huhn mit aromatisch gegartem Reis"], ["ข้าวกับช็อกโกแลต", "Reis mit Schokolade"], ["บะหมี่กับชีส", "Gebratene Nudeln mit Käse"], ["ซุปแตงกวาเย็น", "Eine kalte Gurkensuppe"]]],
    ["food", 1, "ขนมครกทำจากอะไรเป็นหลัก?", "Was sind Khanom Krok?", [["แป้งข้าวเจ้ากับกะทิ", "Kleine Kokos-Reis-Pfannküchlein"], ["เกี๊ยวไส้เนื้อ", "Gefüllte Fleischknödel"], ["เปลือกกล้วยทอด", "Frittierte Bananenschalen"], ["ลูกชิ้นปลาเผ็ด", "Scharfe Fischbällchen"]]],
    ["food", 1, "โรตีสายไหมจากอยุธยามีอะไรอยู่ในแป้งโรตี?", "Wofür ist Roti Sai Mai aus Ayutthaya bekannt?", [["สายไหมหวาน", "Süße Zuckerwatte"], ["ซุปเส้นรสเผ็ด", "Eine scharfe Nudelsuppe"], ["เมล็ดกาแฟคั่ว", "Geröstete Kaffeebohnen"], ["ปลาเค็ม", "Eingelegter Fisch"]]],
    ["food", 1, "หมูปิ้งคืออะไร?", "Was bekommt man bei Moo Ping typischerweise?", [["หมูเสียบไม้ย่าง", "Gegrillte Schweinefleischspieße"], ["ขนมปัง", "Brot"], ["ข้าวโพดต้มกับชีส", "Gekochte Maiskolben mit Käse"], ["มะม่วงกับไอศกรีมพริก", "Mango mit Chili-Eis"]]],
    ["food", 2, "แกงฮังเลเป็นอาหารที่มีชื่อเสียงจากภาคใด?", "Welche Beschreibung passt zu Gaeng Hung Lay?", [["แกงหมูแบบภาคเหนือ", "Ein nordthailändisches Schweinefleisch-Curry"], ["สลัดผลไม้จากภาคใต้", "Ein süßer Fruchtsalat aus dem Süden"], ["ขนมปังกะทิอบ", "Ein gebackenes Kokosbrot"], ["เครื่องดื่มเย็นมะนาว", "Ein kaltes Getränk mit Limette"]]],
    ["food", 1, "ข้าวยำเป็นอาหารแบบใด?", "Was ist Khao Yam?", [["ข้าวคลุกสมุนไพรแบบภาคใต้", "Ein südthailändischer Reis-Salat mit Kräutern"], ["พุดดิ้งช็อกโกแลต", "Ein Schokoladenpudding"], ["ไข่เจียวเย็น", "Ein gebratener Eierkuchen"], ["ขนมแตงโม", "Ein Dessert aus Wassermelone"]]],
    ["food", 1, "ขนมจีนคืออะไร?", "Was sind Khanom Chin?", [["เส้นข้าวหมักที่มักกินกับแกง", "Fermentierte Reisnudeln, oft mit Curry"], ["มันฝรั่งทอด", "Frittierte Kartoffelstäbchen"], ["ลูกอมมะพร้าว", "Süße Kokosbonbons"], ["กล้วยย่าง", "Gegrillte Bananen"]]],
    ["food", 1, "ไก่ย่างหมายถึงอะไร?", "Was bedeutet Kai Yang auf einer Speisekarte?", [["ไก่ย่าง", "Gegrilltes Hähnchen"], ["ไข่ต้มกับน้ำตาล", "Gekochte Eier mit Zucker"], ["สลัดปลาเย็น", "Kalter Fischsalat"], ["ฟักทองผัด", "Gebratener Kürbis"]]],
    ["food", 1, "น้ำพริกหนุ่มเป็นอาหารแบบใด?", "Was ist Nam Prik Noom?", [["น้ำพริกพริกเขียวแบบภาคเหนือ", "Ein nordthailändischer Dip aus grünen Chilis"], ["ชาหวานใส่นม", "Ein süßer Tee mit Milch"], ["ซุปถั่วแดง", "Eine Suppe aus roten Bohnen"], ["ขนมข้าวเหนียว", "Ein Dessert aus Klebreis"]]],
    ["food", 2, "ทำไมก๋วยเตี๋ยวเราจึงมีชื่อนี้?", "Warum heißen Kuai Tiao Ruea auch „Bootsnudeln“?", [["ในอดีตพ่อค้ามักขายจากเรือ", "Früher wurden sie oft von Händlern in Booten verkauft"], ["มีรูปร่างเหมือนเรือ", "Sie haben die Form kleiner Boote"], ["ทำจากไม้เรือ", "Sie werden aus Bootsholz hergestellt"], ["กินได้เฉพาะบนเรือ", "Man kann sie nur auf Booten essen"]]],
    ["food", 1, "ทับทิมกรอบเป็นขนมหวานที่มีอะไร?", "Was ist Tub Tim Krob?", [["แห้วกับกะทิ", "Ein Dessert mit Wasserkastanien und Kokosmilch"], ["ปลาย่างกับมะนาว", "Gegrillter Fisch mit Limette"], ["ซุปสมุนไพรเผ็ด", "Eine scharfe Kräutersuppe"], ["หมูกรอบ", "Knuspriger Schweinebraten"]]],
    ["food", 1, "ผัดซีอิ๊วทำจากอะไรเป็นหลัก?", "Was ist Pad See Ew?", [["เส้นใหญ่ผัดกับซีอิ๊ว", "Gebratene breite Reisnudeln mit dunkler Sojasauce"], ["ข้าวเย็นกับสับปะรดและครีม", "Kalter Reis mit Ananas und Sahne"], ["ซุปแกงกะทิฟักทอง", "Eine Kokos-Curry-Suppe mit Kürbis"], ["เนื้อย่างกับชีส", "Gegrilltes Rindfleisch mit Käse"]]],
    ["food", 1, "ขนมเบื้องมีลักษณะอย่างไร?", "Was sind Khanom Buang?", [["ขนมแป้งกรอบชิ้นเล็กที่มีไส้", "Knusprige kleine Pfannküchlein mit Füllung"], ["บะหมี่เนยถั่ว", "Nudeln mit Erdnussbutter"], ["ข้าวปั้นต้มในซุป", "Gekochte Reisbällchen mit Suppe"], ["มะม่วงดอง", "Eingelegte Mangoscheiben"]]],
    ["food", 1, "บัวลอยมักเสิร์ฟกับอะไร?", "Was ist Bua Loi?", [["เม็ดแป้งข้าวในน้ำกะทิหวาน", "Kleine Reismehlbällchen in süßer Kokosmilch"], ["ปลาหมึกผัดเผ็ด", "Scharf gebratener Tintenfisch"], ["ข้าวเค็มใส่ไก่", "Ein salziger Reiskuchen mit Huhn"], ["กาแฟเย็นมะนาว", "Kalter Kaffee mit Limette"]]],
    ["food", 2, "ปลาเผามักปรุงอย่างไร?", "Woraus besteht Pla Pao typischerweise?", [["ปลาย่างที่พอกเกลือ", "Ein gegrillter, mit Salz umhüllter Fisch"], ["เนื้อดิบกับช็อกโกแลต", "Rohes Rindfleisch mit Schokolade"], ["ข้าวเหนียวทอด", "Frittierter Klebreis"], ["กล้วยในซอสแกง", "Bananen in Currysauce"]]],
    ["food", 2, "เมี่ยงคำกินอย่างไร?", "Was ist Miang Kham?", [["ห่อเครื่องต่างๆ ไว้ในใบไม้แล้วกินเป็นคำ", "Ein kleiner Happen, bei dem Zutaten in ein Blatt gewickelt werden"], ["เป็นข้าวก้อนใหญ่สำหรับงานเทศกาล", "Ein riesiger Reiskuchen für Feste"], ["เป็นซุปหวานใส่เส้น", "Eine süße Suppe mit Nudeln"], ["เป็นเครื่องดื่มข้าวโพดย่าง", "Ein Getränk aus gegrilltem Mais"]]],
    ["food", 1, "ข้าวต้มมัดทำจากอะไร?", "Was ist Khao Tom Mat?", [["ข้าวเหนียวกับกล้วยห่อใบตองแล้วนำไปปรุง", "Klebreis mit Banane, in einem Blatt gegart"], ["บะหมี่ผัดกับเต้าหู้", "Gebratene Nudeln mit Tofu"], ["ซุปกะทิเย็น", "Eine kalte Kokosmilch-Suppe"], ["ไก่ย่างกับมะละกอ", "Gegrilltes Huhn mit Papaya"]]],
    ["food", 1, "แกงส้มมีรสชาติเด่นแบบใด?", "Welcher Geschmack ist für Kaeng Som besonders typisch?", [["เปรี้ยวและเผ็ด", "Sauer und scharf"], ["หวานเหมือนน้ำตาล", "Süß wie Zucker"], ["จืดเหมือนน้ำเปล่า", "Neutral wie Wasser"], ["ขมเหมือนกาแฟดำ", "Bitter wie schwarzer Kaffee"]]],

    ["culture", 1, "ทำไมบ้านไทยแบบดั้งเดิมหลายหลังจึงยกพื้นสูง?", "Warum stehen traditionelle Thai-Häuser oft auf Stelzen?", [["ช่วยป้องกันน้ำท่วมและให้อากาศถ่ายเท", "Das schützt besser vor Überschwemmungen und sorgt für Luftzirkulation"], ["เพื่อให้บ้านอยู่ใกล้เมฆ", "Damit sie näher an den Wolken sind"], ["เพื่อให้ช้างจอดข้างใต้ได้", "Damit Elefanten darunter parken können"], ["เพื่อไม่ต้องสร้างบันได", "Damit man keine Treppen bauen muss"]]],
    ["culture", 1, "ผ้าขาวม้าเป็นของใช้แบบใด?", "Was ist ein Pha Khao Ma?", [["ผ้าลายตารางที่ใช้ได้หลายอย่างในชีวิตประจำวัน", "Ein vielseitiges kariertes Tuch"], ["เครื่องตีระฆังวัด", "Ein Tempelglockenspiel"], ["กาต้มน้ำชา", "Ein besonderer Teekessel"], ["ตะกร้าจับปลา", "Ein traditioneller Fischfangkorb"]]],
    ["culture", 1, "พวงมาลัยคืออะไร?", "Was ist eine Phuang Malai?", [["พวงดอกไม้ที่ร้อยอย่างประณีต", "Eine kunstvoll gebundene Blumengirlande"], ["ก๋วยเตี๋ยวชนิดหนึ่ง", "Eine Art Reisnudel"], ["รองเท้าเต้นรำไม้", "Ein hölzerner Tanzschuh"], ["เครื่องเทศจากภาคเหนือ", "Ein Gewürz aus dem Norden"]]],
    ["culture", 1, "ศาลาในประเทศไทยมักเป็นสถานที่แบบใด?", "Was ist eine Sala in Thailand?", [["ศาลาเปิดโล่งสำหรับพักหรือพบปะกัน", "Ein offener Pavillon zum Ausruhen oder für Begegnungen"], ["อุโมงค์ใต้ดิน", "Ein unterirdischer Tunnel"], ["อาหารปลาและข้าว", "Ein Gericht aus Fisch und Reis"], ["หมวกแบบดั้งเดิม", "Ein traditioneller Hut"]]],
    ["culture", 1, "ผ้าไหมไทยดั้งเดิมทำมาจากอะไร?", "Woraus wird traditionelle Thai-Seide gewonnen?", [["เส้นใยจากรังไหม", "Aus den Fäden von Seidenraupenkokons"], ["ใบปาล์ม", "Aus Palmblättern"], ["รากไผ่", "Aus Bambuswurzeln"], ["กะลามะพร้าว", "Aus Kokosnussschalen"]]],
    ["culture", 1, "หมู่บ้านบ่อสร้างใกล้เชียงใหม่มีชื่อเสียงเรื่องอะไร?", "Wofür ist das Dorf Bo Sang bei Chiang Mai bekannt?", [["ร่มทำมือที่มีลวดลาย", "Für handgefertigte, bemalte Schirme"], ["เรือดำน้ำขนาดใหญ่", "Für große U-Boote"], ["ประติมากรรมน้ำแข็ง", "Für Schneeskulpturen"], ["แก้วจากลาวาภูเขาไฟ", "Für Gläser aus Vulkanlava"]]],
    ["culture", 2, "โนราเป็นศิลปะการแสดงจากภาคใด?", "Was ist Nora?", [["การรำและละครแบบดั้งเดิมจากภาคใต้", "Eine traditionelle Tanz- und Theaterform aus Südthailand"], ["แกงแบบภาคเหนือ", "Ein nordthailändisches Curry"], ["เรือในแม่น้ำโขง", "Ein Bootstyp für den Mekong"], ["วันสำคัญทางพุทธศาสนา", "Ein buddhistischer Feiertag"]]],
    ["culture", 1, "ขันโตกคืออะไร?", "Was ist Khan Tok?", [["โต๊ะเตี้ยทรงกลมที่ใช้เสิร์ฟอาหารทางภาคเหนือ", "Ein niedriger, runder Esstisch aus dem Norden"], ["การแข่งขันเรือใบ", "Ein königlicher Segelwettbewerb"], ["เครื่องดนตรีโลหะ", "Ein traditionelles Musikinstrument aus Metall"], ["ระฆังวัดชนิดหนึ่ง", "Eine besondere Tempelglocke"]]],
    ["culture", 2, "บายศรีมักใช้ในโอกาสใด?", "Wofür wird ein Bai Sri bei Zeremonien verwendet?", [["พิธีอวยพรและต้อนรับ", "Als Arrangement bei Segens- und Willkommensritualen"], ["ใช้เป็นเสื้อกันฝน", "Als Regenmantel"], ["เป็นตะกร้าซื้อปลา", "Als Einkaufskorb für Fische"], ["เป็นโคมไฟริมถนน", "Als Straßenlaterne"]]],
    ["culture", 2, "ลิเกเป็นการแสดงแบบใด?", "Was ist Likay?", [["ละครพื้นบ้านที่มีดนตรีและเครื่องแต่งกายสีสันสดใส", "Eine volkstümliche Theaterform mit Musik und farbenfrohen Kostümen"], ["เรือในนาข้าว", "Ein regionales Boot für Reisfelder"], ["ข้าวเหนียวกับมะม่วง", "Ein Gericht aus Klebreis und Mango"], ["จีวรพระ", "Eine Art Mönchsrobe"]]],
    ["culture", 1, "ช่างทอผ้าทำอะไร?", "Was macht ein traditioneller Handwerker beim Weben von Seide?", [["สานเส้นด้ายบนกี่ให้เป็นผืนผ้า", "Er verknüpft Fäden auf einem Webstuhl zu Stoff"], ["เทโลหะลงในแม่พิมพ์", "Er gießt flüssiges Metall in eine Form"], ["แกะสลักข้าวจากไม้", "Er schnitzt Reis aus Holz"], ["เป่าแก้วให้เป็นผ้า", "Er bläst Glas zu Stoff"]]],
    ["culture", 1, "หลังคาบ้านไทยแบบดั้งเดิมหลายหลังมีลักษณะอย่างไร?", "Was ist ein typisches Merkmal vieler traditioneller Thai-Dächer?", [["ลาดชันเพื่อช่วยระบายน้ำฝน", "Sie sind steil und lassen Regen gut ablaufen"], ["ทำจากหิมะ", "Sie bestehen aus Schnee"], ["แบนและอยู่ใต้ดิน", "Sie sind immer flach und unterirdisch"], ["หมุนตามลม", "Sie drehen sich mit dem Wind"]]],
    ["culture", 2, "ในพิธีแต่งงานไทยบางแบบ ผู้ใหญ่ทำอะไรเพื่ออวยพรคู่บ่าวสาว?", "Was passiert bei einer traditionellen Thai-Hochzeitszeremonie oft beim Segensritual?", [["รดน้ำลงบนมือของคู่บ่าวสาว", "Wasser wird über die Hände des Brautpaars gegossen"], ["ให้ทั้งคู่กระโดดลงแม่น้ำ", "Das Paar springt gemeinsam in einen Fluss"], ["ซ่อนแหวนไว้ในข้าว", "Die Gäste verstecken die Ringe im Reis"], ["ทาสีบ้านเป็นสีน้ำเงิน", "Die Familien bemalen das Haus blau"]]],
    ["culture", 1, "หลังคาวัดไทยหลายแห่งตกแต่งด้วยอะไร?", "Was ist ein auffälliges Merkmal vieler Thai-Tempeldächer?", [["ยอดและลวดลายประดับอย่างประณีต", "Kunstvoll verzierte Dachspitzen und Ornamente"], ["ปล่องไฟน้ำแข็ง", "Schornsteine aus Eis"], ["ลิฟต์แก้วทุกหลัง", "Gläserne Fahrstühle an jedem Gebäude"], ["สนามฟุตบอลใต้ดิน", "Unterirdische Fußballfelder"]]],
    ["culture", 1, "พวงมาลัยดอกไม้มักใช้ทำอะไร?", "Wozu wird eine traditionelle thailändische Blumengirlande oft verwendet?", [["มอบเป็นของขวัญหรือต้อนรับ", "Als Geschenk oder Zeichen des Willkommens"], ["ใช้หุงข้าว", "Als Werkzeug zum Reiskochen"], ["ใช้เป็นตั๋วรถไฟ", "Als Ticket für den Nachtzug"], ["ทำจากเกล็ดปลา", "Als Schmuckstück aus Fischschuppen"]]],
    ["nature", 1, "กระทิงเป็นสัตว์ชนิดใด?", "Welches Tier ist ein Gaur?", [["วัวป่าขนาดใหญ่", "Ein großes wildes Rind"], ["หมีขั้วโลก", "Ein Eisbär"], ["อัลปากา", "Ein Alpaka"], ["ลามา", "Ein Lama"]]],
    ["nature", 1, "สมเสร็จมลายูมีลักษณะเด่นอย่างไร?", "Welches Tier hat ein auffälliges schwarz-weißes Fell und lebt auch in Südthailand?", [["มีลำตัวสีดำและขาว", "Malaiischer Tapir mit auffälligem schwarz-weißem Fell"], ["มีลายทางเหมือนม้าลาย", "Ein Zebra"], ["มีหนามทั่วตัว", "Ein Stinktier"], ["มีขนสีขาวและอาศัยในน้ำแข็ง", "Ein Pinguin"]]],
    ["nature", 1, "นกเงือกจำง่ายจากลักษณะใด?", "Woran erkennt man einen Nashornvogel besonders leicht?", [["จะงอยปากขนาดใหญ่", "An seinem großen, auffälligen Schnabel"], ["มีปีกแปดข้าง", "An acht Flügeln"], ["มีเขากวาง", "An einem Geweih"], ["มีงวงยาว", "An einem langen Rüssel"]]],
    ["nature", 1, "ตัวนิ่มเป็นสัตว์แบบใด?", "Was ist ein Schuppentier (Pangolin)?", [["สัตว์เลี้ยงลูกด้วยนมที่มีเกล็ดซ้อนกัน", "Ein Säugetier mit überlappenden Schuppen"], ["ปลาที่มีขน", "Ein Fisch mit Federn"], ["นกที่ไม่มีปีก", "Ein Vogel ohne Flügel"], ["ผีเสื้อที่มีเขา", "Ein Schmetterling mit Hörnern"]]],
    ["nature", 1, "เต่าทะเลมักวางไข่ที่ไหน?", "Wo legen Meeresschildkröten ihre Eier meist ab?", [["ในหลุมทรายบนชายหาด", "In Sandnestern an Stränden"], ["บนยอดไม้สูง", "In hohen Bäumen"], ["ในบ่อน้ำจืด", "In Süßwasserbrunnen"], ["ในถ้ำน้ำแข็ง", "In Höhlen aus Schnee"]]],
    ["nature", 2, "ทำไมจึงไม่ควรหักหรือนำปะการังกลับบ้าน?", "Warum sollte man Korallen nicht abbrechen oder mitnehmen?", [["ปะการังเป็นที่อยู่อาศัยและเติบโตช้ามาก", "Sie sind wichtige Lebensräume und wachsen sehr langsam"], ["ปะการังอยู่ได้เฉพาะในตู้เย็น", "Sie können nur im Kühlschrank überleben"], ["ปะการังทำจากแก้วและละลายเมื่อร้อน", "Sie sind aus Glas und zerbrechen bei Wärme"], ["ปะการังเป็นอาหารของช้าง", "Sie sind ein beliebtes Futter für Elefanten"]]],
    ["nature", 2, "ปะการังเป็นสิ่งมีชีวิตประเภทใด?", "Was sind Korallen biologisch gesehen?", [["สัตว์ตัวเล็กๆ ที่อยู่รวมกันเป็นกลุ่ม", "Kolonien winziger Tiere"], ["พืชหินชนิดหนึ่ง", "Eine Sorte Steinpflanze"], ["เปลือกหอยที่กลายเป็นหินและยังเติบโต", "Versteinerte Muscheln, die noch wachsen"], ["ปลาตัวเล็กที่เกาะพื้นทะเล", "Kleine Fische, die am Meeresboden kleben"]]],
    ["nature", 2, "ทางเชื่อมผืนป่าช่วยสัตว์ป่าอย่างไร?", "Warum sind Wildtierkorridore zwischen Wäldern wichtig?", [["ช่วยให้สัตว์เดินทางระหว่างถิ่นอาศัยได้", "Sie ermöglichen Tieren, zwischen Lebensräumen zu wandern"], ["พานักท่องเที่ยวไปยังร้านอาหาร", "Sie leiten Touristengruppen zu Restaurants"], ["ป้องกันไม่ให้ต้นไม้โต", "Sie verhindern, dass Bäume wachsen"], ["เป็นที่จอดรถเท่านั้น", "Sie sind ausschließlich Parkplätze"]]],
    ["nature", 2, "ค้างคาวช่วยระบบนิเวศได้อย่างไร?", "Wie helfen Fledermäuse vielen Ökosystemen?", [["กินแมลงและช่วยผสมเกสรพืชบางชนิด", "Sie fressen Insekten und bestäuben manche Pflanzen"], ["ดื่มน้ำเพื่อทำให้แม่น้ำสะอาด", "Sie halten Flüsse sauber, indem sie Wasser trinken"], ["สร้างรังให้ช้าง", "Sie bauen Nester für Elefanten"], ["ไล่นกทุกชนิดออกจากป่า", "Sie vertreiben alle Vögel aus dem Wald"]]],
    ["nature", 1, "พืชกินแมลงมีหม้อไว้ทำอะไร?", "Wozu dient die Kannenform mancher fleischfressender Pflanzen?", [["ดักจับแมลง", "Sie fängt Insekten"], ["เก็บน้ำทะเลให้ปลา", "Sie speichert Salzwasser für Fische"], ["ป้องกันแสงแดด", "Sie schützt die Pflanze vor Licht"], ["เป็นถ้วยให้นก", "Sie wird von Vögeln als Schale benutzt"]]],
    ["nature", 1, "หิ่งห้อยเปล่งแสงเพื่ออะไร?", "Warum leuchten Glühwürmchen?", [["ช่วยดึงดูดคู่", "Unter anderem, um Partner anzulocken"], ["ส่องทางให้รถ", "Damit sie den Weg für Autos beleuchten"], ["ทำให้ปีกแห้ง", "Um ihre Flügel zu trocknen"], ["ช่วยให้นอนกลางวัน", "Damit sie tagsüber schlafen können"]]],
    ["nature", 2, "ทำไมจึงไม่ควรให้อาหารสัตว์ป่าตามสถานที่ท่องเที่ยว?", "Warum sollte man wilde Tiere an Sehenswürdigkeiten nicht füttern?", [["อาจกระทบต่อสุขภาพและพฤติกรรมตามธรรมชาติ", "Das kann Gesundheit und natürliches Verhalten beeinträchtigen"], ["ขนของสัตว์จะเปลี่ยนสี", "Sie verlieren dadurch ihre Fellfarbe"], ["สัตว์จะลืมวิธีว่ายน้ำ", "Sie vergessen, wie man schwimmt"], ["สัตว์จะเชื่องทันที", "Es macht die Tiere automatisch zahm"]]],
    ["nature", 2, "แนวปะการังที่สมบูรณ์ช่วยชายฝั่งอย่างไร?", "Was schützt ein gesundes Korallenriff auch an tropischen Küsten?", [["ช่วยลดแรงคลื่นและเป็นที่อยู่อาศัยของสัตว์", "Es kann Wellen abschwächen und Lebensräume bieten"], ["หยุดเมฆฝนทุกชนิด", "Es verhindert jede Regenwolke"], ["ทำให้น้ำทะเลกลายเป็นน้ำจืด", "Es macht das Meer dauerhaft süß"], ["กันปลาไม่ให้ขึ้นฝั่ง", "Es hält alle Fische an Land"]]],
    ["nature", 2, "นกเงือกกินอะไรเป็นอาหาร?", "Was frisst ein Nashornvogel hauptsächlich?", [["ผลไม้และสัตว์ขนาดเล็ก", "Früchte und kleine Tiere"], ["ทรายเท่านั้น", "Nur Sand"], ["ใยไผ่เท่านั้น", "Ausschließlich Bambusfasern"], ["เต่าทะเลขนาดใหญ่เท่านั้น", "Nur große Meeresschildkröten"]]],
    ["nature", 2, "ป่าบนภูเขาช่วยแม่น้ำอย่างไร?", "Warum sind Wälder in Bergregionen wichtig für Flüsse?", [["ช่วยกักเก็บน้ำในดินและลดการพังทลาย", "Sie halten Wasser im Boden und verringern Erosion"], ["ทำให้น้ำในแม่น้ำเป็นสีฟ้า", "Sie färben das Flusswasser blau"], ["ป้องกันไม่ให้ฝนตก", "Sie verhindern, dass es überhaupt regnet"], ["ทำให้น้ำจืดกลายเป็นน้ำเค็ม", "Sie machen Flüsse salzig"]]],

    ["culture", 1, "หมากรุกไทยเรียกว่าอะไร?", "Was ist Makruk?", [["หมากรุกไทย", "Eine thailändische Schachvariante"], ["เครื่องดื่มมะพร้าวหวาน", "Ein süßes Kokosgetränk"], ["เรือข้ามฟาก", "Ein kleines Fährboot"], ["พิธีตีระฆังวัด", "Ein Tempelglocken-Ritual"]]],
    ["culture", 2, "ขิมเป็นเครื่องดนตรีแบบใด?", "Welches Instrument ist ein Khim?", [["เครื่องสายที่ใช้ไม้เล็กๆ ตี", "Ein Saiteninstrument, das mit kleinen Schlägeln gespielt wird"], ["แตรไม้ไผ่ยาว", "Eine lange Bambustrompete"], ["ระฆังมือขนาดใหญ่", "Eine große Handglocke"], ["กลองดิน", "Eine Trommel aus Ton"]]],
    ["culture", 1, "ระนาดเป็นเครื่องดนตรีที่มีลักษณะคล้ายอะไร?", "Was ist ein Ranat?", [["ระนาดคล้ายเครื่องดนตรีไซโลโฟน", "Ein thailändisches Xylophon-ähnliches Instrument"], ["ร่มแบบดั้งเดิม", "Ein traditioneller Regenschirm"], ["ภาชนะใส่กะทิ", "Ein Gefäß für Kokosmilch"], ["เรือแคนูติดใบ", "Ein Kanu mit Segel"]]],
    ["culture", 1, "แคนเป็นเครื่องดนตรีแบบใด?", "Was ist eine Khaen?", [["เครื่องเป่าปากแบบดั้งเดิม", "Ein traditionelles Mundorgel-Instrument"], ["บันไดไม้ไผ่", "Eine Bambusleiter"], ["ขนมข้าวภาคใต้", "Ein Reiskuchen aus dem Süden"], ["เสาวัดแกะสลัก", "Ein geschnitzter Tempelpfeiler"]]],
    ["culture", 1, "พิณเป็นเครื่องดนตรีที่เล่นอย่างไร?", "Was ist ein Phin?", [["ดีดสาย", "Ein traditionelles gezupftes Saiteninstrument"], ["ใช้ไม้ตี", "Mit Schlägeln schlagen"], ["เป่า", "Blasen"], ["เขย่า", "Schütteln"]]],
    ["culture", 2, "เพลงลูกทุ่งเป็นเพลงแบบใด?", "Was ist Luk Thung?", [["เพลงไทยที่มีเรื่องราวและอิทธิพลจากชีวิตชนบท", "Ein beliebtes thailändisches Musikgenre mit ländlichen Einflüssen"], ["ก๋วยเตี๋ยวชนิดหนึ่ง", "Eine traditionelle Art von Nudelsuppe"], ["ตลาดน้ำ", "Ein schwimmender Markt"], ["ท่ามวย", "Eine Kampfsporttechnik"]]],
    ["culture", 2, "หมอลำเป็นศิลปะเพลงที่เกี่ยวข้องกับภาคใด?", "Was ist Mor Lam?", [["ภาคตะวันออกเฉียงเหนือ", "Ein Musik- und Gesangsstil, besonders mit dem Nordosten verbunden"], ["ภาคเหนือเท่านั้น", "Ein Boot, das nur auf Seen fährt"], ["ชายฝั่งทะเลตะวันออก", "Eine Sorte Kokosnuss"], ["กรุงเทพฯ เท่านั้น", "Ein Tempel aus weißem Stein"]]],
    ["culture", 2, "วงปี่พาทย์คืออะไร?", "Was ist ein Piphat-Ensemble?", [["วงดนตรีไทยที่ใช้เครื่องดนตรีดั้งเดิมหลายชนิด", "Ein Ensemble traditioneller thailändischer Instrumente"], ["กลุ่มพ่อค้าในตลาด", "Eine Gruppe von Straßenhändlern"], ["ทีมปลูกข้าว", "Ein Team beim Reispflanzen"], ["เรือแข่ง", "Eine Art Drachenboot"]]],
    ["culture", 2, "ลิเกมักมีลักษณะการแสดงอย่างไร?", "Was zeichnet eine Likay-Aufführung oft aus?", [["มีดนตรี การเต้น และการแสดงสด", "Musik, Tanz und improvisiertes Schauspiel"], ["ใช้ไม้ฮอกกี้", "Eishockeyschläger"], ["ใช้ลำโพงใต้น้ำ", "Unterwasser-Lautsprecher"], ["ใช้หุ่นแก้ว", "Marionetten aus Glas"]]],
    ["religion", 1, "ชาวพุทธส่วนใหญ่ในไทยนับถือนิกายใด?", "Welche buddhistische Tradition praktizieren die meisten thailändischen Buddhisten?", [["เถรวาท", "Theravada"], ["ศาสนาอิสลาม", "Islam"], ["ศาสนาชินโต", "Shinto"], ["ศาสนาคริสต์", "Christentum"]]],
    ["religion", 1, "เจดีย์ในวัดคือสิ่งก่อสร้างแบบใด?", "Was ist ein Chedi in einer Tempelanlage?", [["เจดีย์ที่มักเก็บพระธาตุ", "Ein stupaartiges Bauwerk, das oft Reliquien beherbergt"], ["เตาทำอาหาร", "Ein Küchenofen"], ["ที่พักช้าง", "Eine Unterkunft für Elefanten"], ["แผงขายของ", "Ein Marktstand"]]],
    ["religion", 2, "อุโบสถในวัดใช้ทำอะไร?", "Wozu dient ein Ubosot in einem buddhistischen Tempel?", [["เป็นสถานที่ประกอบพิธีสำคัญทางศาสนา", "Als geweihter Raum für wichtige religiöse Zeremonien"], ["เป็นสถานีรถไฟ", "Als Bahnhof"], ["เป็นสระว่ายน้ำ", "Als Schwimmbecken"], ["เป็นที่เก็บอาหารริมทาง", "Als Lager für Straßenküchen"]]],
    ["religion", 2, "ประเพณีทอดกฐินจัดขึ้นในช่วงใด?", "Was ist Kathina?", [["หลังช่วงเข้าพรรษาและมีการถวายผ้าแก่พระสงฆ์", "Eine Zeremonie nach der Regenzeit, bei der Mönchen Roben gespendet werden"], ["ช่วงสงกรานต์", "Ein Wasserfest im April"], ["ช่วงแข่งว่าว", "Ein traditioneller Drachenwettbewerb"], ["ช่วงตลาดผ้าไหม", "Ein Markt für Seide"]]],
    ["religion", 2, "การบวชชั่วคราวหมายถึงอะไร?", "Was bedeutet eine zeitweilige Ordination im thailändischen Buddhismus?", [["การบวชเป็นพระในช่วงเวลาจำกัด", "Für eine begrenzte Zeit als Mönch zu leben"], ["การฝึกเป็นผู้ดูแลวัด", "Eine Ausbildung zum Tempelwächter"], ["การย้ายไปอยู่ในวังตลอดชีวิต", "Für immer in einen Palast zu ziehen"], ["การฝึกเป็นนักเต้น", "Eine Ausbildung zum professionellen Tänzer"]]],
    ["religion", 1, "ธรรมะหมายถึงอะไรในพระพุทธศาสนา?", "Was bezeichnet „Dhamma“ im Buddhismus?", [["คำสอนของพระพุทธเจ้า", "Die Lehre und den Weg des Buddha"], ["ระฆังวัดชนิดหนึ่ง", "Eine Sorte Tempelglocke"], ["ปลาศักดิ์สิทธิ์", "Einen heiligen Fisch"], ["อาหารข้าวกับมะม่วง", "Ein Gericht aus Reis und Mango"]]],
    ["religion", 1, "คณะสงฆ์หมายถึงใคร?", "Was ist die Sangha?", [["ชุมชนของพระสงฆ์ในพระพุทธศาสนา", "Die Gemeinschaft buddhistischer Mönche"], ["กลุ่มพ่อค้า", "Eine Gruppe von Straßenhändlern"], ["เรือใบหลวง", "Ein königliches Segelboot"], ["ตลาดเครื่องเทศ", "Ein Gewürzmarkt"]]],
    ["religion", 2, "นอกจากทำพิธีทางศาสนาแล้ว วัดยังเป็นสถานที่สำคัญด้านใด?", "Warum besuchen viele Menschen einen Tempel auch außerhalb religiöser Zeremonien?", [["เป็นสถานที่พบปะและทำกิจกรรมของชุมชน", "Ein wichtiger Ort für Gemeinschaft und Zusammenkunft"], ["เป็นที่ขับเครื่องบินฟรี", "Ein Ort, an dem man kostenlos Flugzeuge steuern darf"], ["เป็นสถานที่ถ่ายทอดฟุตบอลเสมอ", "Ein Ort, an dem immer Fußballspiele übertragen werden"], ["เป็นโรงเรียนทุกแห่ง", "Ein Ersatz für alle Schulen"]]],
    ["religion", 1, "การนั่งสมาธิหมายถึงการทำอะไร?", "Was bedeutet es, vor einer Buddha-Statue zu meditieren?", [["นั่งอย่างสงบและตั้งใจจดจ่อ", "Still sitzen und die Gedanken sammeln"], ["ฝึกเต้นรำ", "Einen traditionellen Tanz üben"], ["นับหน้าต่างวัด", "Die Fenster des Tempels zählen"], ["รอรถโดยสาร", "Auf einen Bus warten"]]],
    ["religion", 2, "ระฆังในวัดอาจใช้ทำอะไรในบางพิธี?", "Wozu dient ein Tempelglockenspiel bei manchen Zeremonien?", [["บอกหรือประกอบช่วงเวลาของพิธี", "Religiöse Momente markieren oder begleiten"], ["วัดอุณหภูมิ", "Die Temperatur des Tempels messen"], ["บอกเวลาเปิดสนามบิน", "Die Öffnungszeiten des Flughafens ankündigen"], ["ไล่นกทุกชนิด", "Alle Vögel aus der Stadt vertreiben"]]],

    ["language_daily", 1, "ภาษาไทยมีเสียงวรรณยุกต์ที่ใช้แยกความหมายกี่เสียง?", "Wie viele bedeutungsunterscheidende Töne hat die thailändische Sprache?", [["ห้าเสียง", "Fünf"], ["สองเสียง", "Zwei"], ["สิบเสียง", "Zehn"], ["ไม่มีเสียงวรรณยุกต์", "Keine"]]],
    ["language_daily", 2, "ในประโยคภาษาไทยทั่วไป เว้นวรรคระหว่างคำอย่างไร?", "Wie werden Wörter in einem gewöhnlichen thailändischen Satz meist voneinander getrennt?", [["ไม่ได้เว้นวรรคทุกคำ แต่มักเว้นระหว่างกลุ่มคำ", "Nicht jedes Wort bekommt ein Leerzeichen; Leerzeichen trennen oft größere Einheiten"], ["ใส่กรอบแยกทุกคำ", "Jedes Wort steht in einem eigenen Kasten"], ["ใช้เครื่องหมายจุลภาคคั่นทุกคำ", "Wörter werden durch Kommas getrennt"], ["ใส่ขีดระหว่างทุกพยางค์", "Zwischen alle Silben kommt ein Bindestrich"]]],
    ["language_daily", 1, "คำเรียกพี่มักใช้เรียกใคร?", "Was bedeutet die Anrede „Phi“ typischerweise im Verhältnis zum Sprecher?", [["คนที่อายุมากกว่าหรือพี่", "Eine ältere Person oder ein älteres Geschwister"], ["สัตว์เลี้ยงแปลกหน้า", "Ein fremdes Haustier"], ["อาคารวัด", "Ein Tempelgebäude"], ["อาหารเส้น", "Ein Gericht mit Nudeln"]]],
    ["language_daily", 1, "คำเรียกน้องมักใช้เรียกใคร?", "Was bedeutet „Nong“ als Anrede typischerweise?", [["คนที่อายุน้อยกว่าหรือน้อง", "Eine jüngere Person oder ein jüngeres Geschwister"], ["คนที่อายุมากกว่า", "Eine ältere Person"], ["สถานีรถไฟ", "Ein Bahnhof"], ["แผงขายของ", "Ein Marktstand"]]],
    ["language_daily", 2, "คำบอกชนิดของสิ่งของใช้ทำอะไรเมื่อนับ?", "Wozu dienen Zählwörter in der thailändischen Sprache?", [["ใช้ร่วมกับตัวเลขและคำนามเมื่อนับสิ่งของ", "Sie werden oft zusammen mit Zahlen und Nomen verwendet"], ["ใช้แทนคำกริยาทั้งหมด", "Sie ersetzen alle Verben"], ["บอกว่าเป็นประโยคคำถามเสมอ", "Sie zeigen immer die Satzfrage an"], ["ใช้เฉพาะในเพลง", "Sie werden nur in Liedern benutzt"]]],
    ["language_daily", 2, "คำขยายอย่างคำว่า สีแดง มักอยู่ตรงไหนเมื่อเทียบกับคำนามในภาษาไทย?", "Wo steht ein beschreibendes Wort wie „rot“ im Thailändischen häufig im Verhältnis zum Nomen?", [["หลังคำนาม", "Nach dem Nomen"], ["หน้าคำนามเสมอ", "Immer vor dem Nomen"], ["ต้นประโยคเท่านั้น", "Nur am Satzanfang"], ["ไม่อยู่ในประโยคเดียวกัน", "Nie im selben Satz"]]],
    ["language_daily", 1, "คำว่า คุณ ใช้ทำอะไรในชีวิตประจำวัน?", "Wozu dient ein höflicher Titel wie „Khun“ im Alltag?", [["ใช้เรียกบุคคลอย่างสุภาพ", "Als respektvolle Anrede für eine Person"], ["ใช้เรียกวันหยุด", "Als Name eines Feiertags"], ["ใช้เรียกสนามบิน", "Als Wort für Flughafen"], ["ใช้เรียกข้าวเหนียว", "Als Bezeichnung für Klebreis"]]],
    ["language_daily", 2, "ทำไมพยางค์เดียวกันในภาษาไทยจึงอาจมีความหมายต่างกัน?", "Warum kann dieselbe thailändische Silbe je nach Tonhöhe etwas anderes bedeuten?", [["เพราะเสียงวรรณยุกต์ช่วยแยกความหมาย", "Weil der Ton die Wortbedeutung unterscheiden kann"], ["เพราะทุกคำต้องมีสี่รูปเขียน", "Weil jedes Wort vier Schreibweisen haben muss"], ["เพราะภาษาไทยไม่ออกเสียงสระ", "Weil Vokale nie gesprochen werden"], ["เพราะความหมายขึ้นกับสีของตัวอักษร", "Weil die Bedeutung von der Schriftfarbe abhängt"]]],
    ["language_daily", 2, "เมื่อนับสิ่งของในภาษาไทย คำบอกชนิดมักอยู่ตรงไหน?", "Wo steht das Zählwort beim Zählen im Thai üblicherweise?", [["หลังคำนามและตัวเลข", "Nach dem Nomen und der Zahl"], ["ก่อนคำนามเสมอ", "Immer vor dem Nomen"], ["ท้ายประโยคเท่านั้น", "Nur am Satzende"], ["แทนตัวเลขทั้งหมด", "Anstelle jeder Zahl"]]],
    ["language_daily", 2, "คำถามแบบใช่หรือไม่ใช่ในภาษาไทยมักทำเครื่องหมายอย่างไร?", "Was zeigt ein Fragewort am Satzende im Thailändischen häufig an?", [["เป็นคำถามที่ตอบได้ว่าใช่หรือไม่ใช่", "Dass eine Ja-Nein-Frage gestellt wird"], ["เป็นเนื้อเพลง", "Dass der Satz ein Liedtext ist"], ["เป็นการบอกราคา", "Dass jemand einen Preis nennt"], ["เป็นการจบประโยคเสมอ", "Dass der Satz bereits beendet ist"]]],

    ["geography", 2, "เกาะเกร็ดใกล้กรุงเทพฯ มีชื่อเสียงเรื่องใด?", "Wofür ist Ko Kret nahe Bangkok besonders bekannt?", [["เครื่องปั้นดินเผาและวัฒนธรรมมอญ", "Töpferhandwerk und Mon-Kultur"], ["ภูเขาที่มีหิมะ", "Schneebedeckte Berge"], ["ลานกระโดดสกี", "Skisprungschanzen"], ["ทะเลทรายทรายแดง", "Eine Wüste aus rotem Sand"]]],
    ["geography", 2, "อุทยานประวัติศาสตร์พิมายมีสิ่งใดให้ชม?", "Was kann man im historischen Park Phimai besonders sehen?", [["โบราณสถานสถาปัตยกรรมแบบขอม", "Eine bedeutende Anlage mit Khmer-Architektur"], ["สนามบินลอยน้ำ", "Einen schwimmenden Flughafen"], ["ปราสาทน้ำแข็งยุคกลาง", "Eine mittelalterliche Burg aus Eis"], ["ท่าเรือโรมันโบราณ", "Einen antiken römischen Hafen"]]],
    ["geography", 2, "เชียงคานมีชื่อเสียงเรื่องใด?", "Wofür ist Chiang Khan am Mekong bekannt?", [["เมืองริมแม่น้ำที่มีบ้านไม้เก่าแก่", "Eine historische Uferstadt mit traditionellen Holzhäusern"], ["รถไฟใต้ทะเล", "Eine U-Bahn unter dem Meer"], ["พีระมิดทราย", "Pyramiden aus Sand"], ["ลานสกี", "Skigebiete"]]],
    ["geography", 1, "หัวหินเป็นสถานที่แบบใด?", "Was ist Hua Hin?", [["เมืองตากอากาศริมทะเล", "Ein bekannter Badeort am Golf von Thailand"], ["จังหวัดทางเหนือสุด", "Eine Provinz im äußersten Norden"], ["วัดกลางกรุงเทพฯ", "Ein Tempel im Zentrum Bangkoks"], ["ช่องเขาที่ติดลาว", "Ein Gebirgspass an der Grenze zu Laos"]]],

    ["beginner_shopping", 1, "ประเทศไทยใช้เงินสกุลใด?", "Wie heißt die Währung, mit der man in Thailand bezahlt?", [["บาท", "Baht"], ["เยน", "Yen"], ["ยูโร", "Euro"], ["รูปี", "Rupie"]]],
    ["beginner_daily_life", 1, "ทำไมอาคารหลายแห่งในไทยจึงใช้พัดลมหรือเครื่องปรับอากาศ?", "Warum sind Ventilatoren und Klimaanlagen in vielen thailändischen Gebäuden nützlich?", [["เพราะอากาศมักร้อนและชื้น", "Weil es häufig warm und feucht ist"], ["เพราะหิมะตกทั้งปี", "Weil es dort das ganze Jahr schneit"], ["เพราะทำให้เกิดเมฆฝน", "Weil sie Regenwolken anziehen"], ["เพราะใช้ทำอาหาร", "Weil sie zum Kochen verwendet werden"]]],
    ["beginner_nature_weather", 2, "ลมที่พัดตามฤดูกาลทำให้หลายพื้นที่ของไทยมีสภาพอากาศแบบใด?", "Welche Witterung bringen saisonale Winde in vielen Teilen Thailands typischerweise mit sich?", [["มีฤดูฝนที่ชัดเจน", "Eine ausgeprägte Regenzeit"], ["มีหิมะตกตลอดเวลา", "Dauerhaften Schneefall"], ["มีพายุทรายในทะเลทราย", "Sandstürme wie in der Sahara"], ["มีน้ำค้างแข็งทุกวัน", "Jeden Tag Frost"]]]
];

const sources = {
    geography: { title: "Tourism Authority of Thailand", url: "https://www.tourismthailand.org/" },
    history: { title: "Thailand.go.th – History and Culture", url: "https://thailand.go.th/" },
    food: { title: "Tourism Authority of Thailand – Thai Food", url: "https://www.tourismthailand.org/" },
    culture: { title: "UNESCO Intangible Cultural Heritage", url: "https://ich.unesco.org/" },
    nature: { title: "Department of National Parks, Wildlife and Plant Conservation", url: "https://www.dnp.go.th/" },
    religion: { title: "Tourism Authority of Thailand – Buddhist Traditions", url: "https://www.tourismthailand.org/" },
    language_daily: { title: "Royal Society of Thailand – Dictionary", url: "https://dictionary.orst.go.th/" },
    beginner_shopping: { title: "Tourism Authority of Thailand", url: "https://www.tourismthailand.org/" },
    beginner_daily_life: { title: "Thailand.go.th – Climate", url: "https://thailand.go.th/" },
    beginner_nature_weather: { title: "Thai Meteorological Department", url: "https://www.tmd.go.th/" }
};

if (rawQuestions.length !== 100) {
    throw new Error(`Expected 100 questions, got ${rawQuestions.length}`);
}

const quizWords = require(WORDS_FILE).words;
const gigaWords = JSON.parse(fs.readFileSync(GIGA_FILE, "utf8")).words;
const vocabulary = require(VOCAB_API).createVocabulary({ gigaWords, quizWords });
const toneWords = new Map(
    [...vocabulary.wordsByThai.values()].map(word => [word.thai, word.transliteration])
);

function transliterate(text) {
    return vocabulary.segment(text).map(part => {
        if (!/\p{Script=Thai}/u.test(part.text)) {
            return part.text;
        }
        const reading = toneWords.get(part.text);
        if (!reading) {
            throw new Error(`Missing transliteration for Thai token: ${part.text}`);
        }
        return reading;
    }).join(" ").replace(/\s+/g, " ").trim();
}

function formatQuestion([category, difficulty, questionTh, questionDe, options], index) {
    const id = `thq-beg-${201 + index}`;
    const optionRows = options.map(([thai, german], optionIndex) =>
        `                [${JSON.stringify(String.fromCharCode(97 + optionIndex))}, ${JSON.stringify(thai)}, ${JSON.stringify(german)}, ${JSON.stringify(transliterate(thai))}]`
    ).join(",\n");
    const answer = options[0];
    const explanationTh = `คำตอบคือ ${answer[0]}`;
    const explanationDe = `Die richtige Antwort ist: ${answer[1]}.`;
    return `        makeQuestion(\n            ${JSON.stringify(id)}, ${JSON.stringify(category)}, ${difficulty}, "single_choice",\n            ${JSON.stringify(questionTh)},\n            ${JSON.stringify(questionDe)},\n            ${JSON.stringify(transliterate(questionTh))},\n            [\n${optionRows}\n            ],\n            "a",\n            ${JSON.stringify(explanationTh)},\n            ${JSON.stringify(explanationDe)},\n            ${JSON.stringify([sources[category]])}\n        )`;
}

function injectQuestions() {
    let content = fs.readFileSync(QUIZ_FILE, "utf8");
    const insertionMarker = "        ...[\n";
    const insertionIndex = content.indexOf(insertionMarker);
    if (insertionIndex < 0 || !content.includes('"thq-beg-200"')) {
        throw new Error("Could not find the end of the thq-beg-200 question pack");
    }

    const firstQuestion = content.indexOf('        makeQuestion(\n            "thq-beg-201",');
    if (firstQuestion >= 0 && firstQuestion < insertionIndex) {
        content = content.slice(0, firstQuestion) + content.slice(insertionIndex);
    }
    content = content.replace(/^\s*"thq-beg-(20[1-9]|2[1-9]\d|300)": [12],\r?\n/gm, "");
    const refreshedInsertionIndex = content.indexOf(insertionMarker);
    const formatted = rawQuestions.map(formatQuestion).join(",\n");
    content = content.slice(0, refreshedInsertionIndex) + formatted + ",\n" +
        content.slice(refreshedInsertionIndex);

    const reviewMarker = '        "thq-beg-200": 1,';
    const reviewIndex = content.indexOf(reviewMarker);
    if (reviewIndex < 0) {
        throw new Error("Could not find thq-beg-200 in legacyDifficultyReview");
    }
    const reviewInsertIndex = reviewIndex + reviewMarker.length;
    const reviewEntries = rawQuestions.map((question, index) =>
        `\n        "thq-beg-${201 + index}": ${question[1]},`
    ).join("");
    content = content.slice(0, reviewInsertIndex) + reviewEntries +
        content.slice(reviewInsertIndex);

    fs.writeFileSync(QUIZ_FILE, content, "utf8");
    console.log("Integrated question IDs thq-beg-201 through thq-beg-300.");
}

injectQuestions();
