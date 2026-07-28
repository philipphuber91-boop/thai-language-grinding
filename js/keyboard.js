/* =========================================================
   KEYBOARD.JS – Zentrales Thai-Tastaturlayout (Kedmanee)

   Einzige Quelle der Wahrheit für:
     - welche physische Taste welches Thai-Zeichen erzeugt
     - ob Shift dabei benötigt wird

   Alle anderen Module fragen NUR dieses Mapping.
   Keine Shift-Logik außerhalb dieser Datei.
========================================================= */

const physicalKeyLayout = {

    // ── Zahlenreihe ──────────────────────────────────────
    "`":  { normal: "ฃ",  shift: "๊"  },
    "1":  { normal: "ๅ",  shift:  null },
    "2":  { normal: "/",   shift: "๑"  },
    "3":  { normal: "-",   shift: "๒"  },
    "4":  { normal: "ภ",  shift: "๓"  },
    "5":  { normal: "ถ",  shift:"๔"   },
    "6":  { normal: "ุ",  shift: "ู"  },
    "7":  { normal: "ึ",  shift: null  },
    "8":  { normal: "ค",  shift: "๕"  },
    "9":  { normal: "ต",  shift: "๖"  },
    "0":  { normal: "จ",  shift: "๗"  },
    "-":  { normal: "ข",  shift: "๘"  },
    "=":  { normal: "ช",  shift: "๙"  },

    // ── Obere Buchstabenreihe ─────────────────────────────
    "q":  { normal: "ๆ",  shift: "๐"  },
    "w":  { normal: "ไ",  shift: null  },
    "e":  { normal: "ำ",  shift: "ฎ"  },
    "r":  { normal: "พ",  shift: "ฑ"  },
    "t":  { normal: "ะ",  shift: "ธ"  },
    "y":  { normal: "ั",  shift: "ํ"  },
    "u":  { normal: "ี",  shift: "๊"  },
    "i":  { normal: "ร",  shift: "ณ"  },
    "o":  { normal: "น",  shift: "ฯ"  },
    "p":  { normal: "ย",  shift: "ญ"  },
    "[":  { normal: "บ",  shift: "ฐ"  },
    "]":  { normal: "ล",  shift: null  },
    "\\": { normal: "ฃ",  shift: "ฅ"  },

    // ── Mittlere Reihe ────────────────────────────────────
    "a":  { normal: "ฟ",  shift: "ฤ"  },
    "s":  { normal: "ห",  shift: "ฆ"  },
    "d":  { normal: "ก",  shift: "ฏ"  },
    "f":  { normal: "ด",  shift: "โ"  },
    "g":  { normal: "เ",  shift: "ฌ"  },
    "h":  { normal: "้",  shift: "็"  },
    "j":  { normal: "่",  shift: "๋"  },
    "k":  { normal: "า",  shift: "ษ"  },
    "l":  { normal: "ส",  shift: "ศ"  },
    ";":  { normal: "ว",  shift: "ซ"  },
    "'":  { normal: "ง",  shift: null  },

    // ── Untere Reihe ──────────────────────────────────────
    "z":  { normal: "ผ",  shift: null  },
    "x":  { normal: "ป",  shift: null  },
    "c":  { normal: "แ",  shift: "ฉ"  },
    "v":  { normal: "อ",  shift: "ฮ"  },
    "b":  { normal: "ิ",  shift: null  },
    "n":  { normal: "ื",  shift: "์"  },
    "m":  { normal: "ท",  shift: null  },
    ",":  { normal: "ม",  shift: "ฒ"  },
    ".":  { normal: "ใ",  shift: "ฬ"  },
    "/":  { normal: "ฝ",  shift: "ฦ"   },

    // ── Leertaste ─────────────────────────────────────────
    " ":  { normal: " ",   shift: null  },
};

/*
 * thaiKeyboardMap  — automatisch abgeleitet
 * Thai-Zeichen → { key: data-key-Wert-der-Taste, shift: boolean }
 *
 * Beispiele:
 *   thaiKeyboardMap["ก"]  = { key: "ก",  shift: false }   // D normal
 *   thaiKeyboardMap["ฏ"]  = { key: "ก",  shift: true  }   // Shift+D
 *   thaiKeyboardMap["ธ"]  = { key: "ะ",  shift: true  }   // Shift+T
 */
const thaiKeyboardMap = {};
for (const [, { normal, shift }] of Object.entries(physicalKeyLayout)) {
    if (normal) thaiKeyboardMap[normal] = { key: normal, shift: false };
    if (shift)  thaiKeyboardMap[shift]  = { key: normal, shift: true  };
}

/*
 * latinToThaiMap — für Tastaturen im Latin-Modus
 * Kleinbuchstabe → primäres Thai-Zeichen der Taste
 *
 * Beispiel: "d" → "ก"
 */
const latinToThaiMap = {};
for (const [physicalKey, { normal }] of Object.entries(physicalKeyLayout)) {
    if (normal) latinToThaiMap[physicalKey] = normal;
}

/*
 * Übersetzt KeyboardEvent.code in den physicalKeyLayout-Schlüssel.
 * Keine zusätzliche Mapping-Tabelle: Ableitung erfolgt direkt aus dem Code-Muster.
 */
function resolvePhysicalLayoutKeyFromCode(code) {
    if (typeof code !== "string" || code.length === 0) {
        return null;
    }

    if (code.startsWith("Key") && code.length === 4) {
        return code.slice(3).toLowerCase();
    }

    if (code.startsWith("Digit") && code.length === 6) {
        return code.slice(5);
    }

    switch (code) {
        case "Backquote": return "`";
        case "Minus": return "-";
        case "Equal": return "=";
        case "BracketLeft": return "[";
        case "BracketRight": return "]";
        case "Backslash": return "\\";
        case "Semicolon": return ";";
        case "Quote": return "'";
        case "Comma": return ",";
        case "Period": return ".";
        case "Slash": return "/";
        case "Space": return " ";
        default: return null;
    }
}

/*
 * Kern-API für den Tutor-Mode:
 * physical code + shift-Status -> Thai-Zeichen aus physicalKeyLayout
 */
function translatePhysicalCode(code, shiftKey) {
    const layoutKey = resolvePhysicalLayoutKeyFromCode(code);

    if (!layoutKey || !physicalKeyLayout[layoutKey]) {
        return null;
    }

    const mapping = physicalKeyLayout[layoutKey];
    const translated = shiftKey ? mapping.shift : mapping.normal;

    return translated || null;
}

/*
 * Convenience-API:
 * KeyboardEvent -> Thai-Zeichen aus physicalKeyLayout
 *
 * Beispiel:
 *   translatePhysicalKey(event) => "ก" (KeyD)
 *   translatePhysicalKey(event) => "ฏ" (Shift+KeyD)
 */
function translatePhysicalKey(event) {
    if (!event || typeof event.code !== "string") {
        return null;
    }

    return translatePhysicalCode(event.code, Boolean(event.shiftKey));
}
