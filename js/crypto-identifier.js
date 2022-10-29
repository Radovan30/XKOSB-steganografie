// identifikator sifer

let result = {};

function startIdentify(text, type) {

    type = type || "cipher";
    result = {};

    if (type == "cipher") {
        detectUniqueCipher(text);
        if (result.possibleCipher.length < 1) {
            detectClassicCipher(text);
        }
    }

    return result;
}


// funkce pro detekci substitucnich a transpozicni sifer
function detectClassicCipher(text) {

    // promenne
    let possibleCipher = [];
    let cipherAlgo = [];
    let textNoSpace = text.replace(/\s+/g, "");

    let ic = getIC(textNoSpace);
    let freq = getFrequency(textNoSpace);
    let len = textNoSpace.length;

    // frekfence anglickych znaku
    let charE = freq.E; // 12.7
    let charT = freq.T; // 9.05
    let charA = freq.A; // 8.16
    let charO = freq.O; // 7.50
    let charI = freq.I; // 6.96

    let substitutionCipher = false;
    let transpositionCipher = false;

    // vypis jednotlive frekfence znaku do konzole 
    console.log(charE / len);
    console.log(charT / len);
    console.log(charA / len);
    console.log(charO / len);
    console.log(charI / len);

    // urceni zda patri sifra mezi substitucni nebo transpozicni sifru
    if ((ic >= 0.06 && len >= 50) || (ic >= 0.055 && len < 50)) {
        if ((charE / len) >= 0.10 && (charT / len) >= 0.07 && ((charA / len) >= 0.065 || (charO / len) >= 0.065 || (charI / len) >= 0.06)) {
            transpositionCipher = true;
        } else {
            substitutionCipher = true;
        }
    }

    if (substitutionCipher) {
        possibleCipher.push("Monoalfabetická substituce");
        cipherAlgo.push("Jednoduchá substituční šifra");
        cipherAlgo.push("Caesarova šifra");
        cipherAlgo.push("Afinní šifra");
        cipherAlgo.push("Atbashova šifra");
    } else if (transpositionCipher) {
        possibleCipher.push("Transpoziční šifra");
        cipherAlgo.push("Sloupcová transpozice");
        cipherAlgo.push("Dvojitá transpozice");
        cipherAlgo.push("Skytalé");
        cipherAlgo.push("Šifra železničního plotu (Rail Fence)");
    } else {

        let playfair = false;
        // otestovani sifry
        if ((textNoSpace.length % 2 == 0) && (Object.size(freq) <= 25) && (/^[A-Z]+$/gi.test(textNoSpace))) {
            let tryTxt = textNoSpace.match(/.{1,2}/g);
            playfair = true;
            for (let i = 0; i < tryTxt.length; i++) {
                if (tryTxt[i].charAt(0) == tryTxt[i].charAt(1)) {
                    playfair = false;
                    break;
                }
            }
        }

        if (playfair) possibleCipher.push("Playfairova šifra");

        // Test na moznou Vigenerovou sifru a jeji varianty
        else if (ic < 0.05 && ic >= 0.035) {
            possibleCipher.push("Polyalfabetická substituce");
            cipherAlgo.push("Vigenerova šifra");
            cipherAlgo.push("Autokláv");
            cipherAlgo.push("Beaufortova šifra");
            cipherAlgo.push("Gronsfeldova šifra");

            /*if(/^[ABCDEFGHIKLMNOPQRSTVXYZ&\s]+$/gi.test(text) && cipherAlgo.length < 1){
            	possibleCipher = "Alberti Cipher";
            }*/
        } else if (Object.size(freq) == 5) {
            possibleCipher.push("Polybiův čtverec");
        } else if (/^[02-9]+$/.test(textNoSpace) && textNoSpace.length % 2 == 0) {
            possibleCipher.push("Nihilistická šifra (Substituce)");
        } else if (Object.size(freq) > 26) {
            possibleCipher.push("Homofonní šifra");
        } else if (text.length % 3 == 0 && ic < 0.05) {
            possibleCipher.push("Hill šifra (3x3)");
        }
    }

    result.possibleCipher = possibleCipher;
    if (cipherAlgo.length > 0) result.cipherAlgo = cipherAlgo;
    if (!isNaN(ic)) result.ic = ic;
}


// funkce pro detekci unikatnich sifer
function detectUniqueCipher(text) {

    let possibleCipher = [];
    let textNoSpace = text.replace(/\s+/g, "");

    // pridané vyjimky pro dalsi mozne sifry
    if (/^[\.\-\/\|]+$/g.test(textNoSpace)) {
        possibleCipher.push("Morseova abeceda");
    }
    if (/^[ADFGVX]+$/gi.test(textNoSpace)) {
        possibleCipher.push("ADFGVX Cipher");
    }
    if (/^(?:[AB]{5})+$/gi.test(text.replace(/\s+/g, ""))) {
        possibleCipher.push("Baconian Cipher");
    }
    if (/\s(?:CHA\-GEE|TSE\-NILL|WOL\-LA\-CHEE|NE\-AHS\-JAH|THAN\-ZIE\-CHA|NI\-DAH\-THAN\-ZIE|GAH\-TSO|DZEH|SEIS|LIN)\s/g.test(text)) {
        possibleCipher.push("Navajo Code");
    }
    if (/[†‡¶]/g.test(text)) {
        possibleCipher.push("Gold-Bug");
    }

    result.possibleCipher = possibleCipher;
    console.log("text: ", textNoSpace);
}


// detekce sifrovani
function detectEncoding(text) {

    let possibleEnc = [];
    let textNoSpace = text.replace(/\s+/g, "");

    if (/^\x3c\x7e(?:[\x21-\x7e\n]+)\x7e\x3e$/g.test(text)) {
        possibleEnc.push("Base85 (Ascii85)");
    }
    if (/^[0-9A-Za-z\!#\$%&\(\)\*\+\-\;<=>\?@\^_`\{\}\|~]{20}$/g.test(text)) {
        possibleEnc.push("Base85 (IPv6)");
    }
    if (/^begin\s[0-9]+\s(?:[\x21-\x7e\n]+)`\send/gi.test(text) || /^[\x21-\x7e\n]+\n*\n`/g.test(text)) {
        possibleEnc.push("UUencode");
    }
    if (/^begin\s[0-9]+\s[\w\x21-\x7e]+(?:[a-z0-9\-\+\n]+)\+\send/gi.test(text)) {
        possibleEnc.push("XXencode");
    }
    if (/^\=ybegin[\u0000-\uffff]+\=yend/gi.test(text)) {
        possibleEnc.push("yEnc");
    }
    if (/\:[\x21-\x7e\n]+\:\s*$/g.test(text)) {
        possibleEnc.push("BinHex");
    }

    if (/^(?:[\u0000-\u0029\u0040-\uffff][0-9]+)+$/g.test(text)) {
        possibleEnc.push("Run-Length-Encoding");
    }
    if (/^\x23\x40\x7e\x5e[\u0000-\uffff]+\x5e\x23\x7e\x40$/g.test(text)) {
        possibleEnc.push("Encoded VBScript (.vbe)");
    }
    if (/^\uff9f\u03c9\uff9f\uff89\x3d\x20\x2f\uff40\uff4d\xb4\uff09\uff89\x20\x7e\u253b\u2501\u253b[\u0000-\uffff]+\x28\uff9f\u0398\uff9f\x29\x29\x20\x28\x27\x5f\x27\x29\x3b$/g.test(text)) {
        possibleEnc.push("AAencode");
    }
    if (/^[\x21-\x7e]+=~\[\];[\x21-\x7e]+\"\\\"\"\)\(\)\)\(\);$/.test(text)) {
        possibleEnc.push("JJencode");
    }
    if (/^(?:(?:[bcdfghklmnprstvzx][aeiouy-]){3})+(?:(?:[bcdfghklmnprstvzx][aeiouy]){2})+[bcdfghklmnprstvzx]$/gi.test(textNoSpace)) {
        possibleEnc.push("Bubble-Babble");
    }
    if (/^[-1]+$/g.test(textNoSpace.replace(/[^a-z0-9\-]+/gi, ""))) {
        possibleEnc.push("Spirit DVD Code");
    }

    // Esoterický programovací jazyk
    if (/^[\<\>\+\-\.\,\[\]]+$/g.test(textNoSpace)) {
        possibleEnc.push("Brainfuck");
    }
    if (/^[aceijops]+$/g.test(text)) {
        possibleEnc.push("Alphuck");
    }
    if (/^[\(\)\+\[\]\!]+$/gi.test(text)) {
        possibleEnc.push("JSFuck");
    }
    if (/^(?:Ook[\.\?\!])+$/g.test(textNoSpace)) {
        possibleEnc.push("Ook!");
    }
    if (/^[\.\?\!]+$/g.test(textNoSpace)) {
        possibleEnc.push("Short Ook!");
    }
    if (/^([0-9]+[\+\-\*\/\%\!\`\>\<\^v\?\_\|\"\:\;\\\$\.\,\#gp\&\~\@]+|[\+\-\*\/\%\!\`\>\<\^v\?\_\|\"\:\;\\\$\.\,\#gp\&\~\@]+[0-9]*)+$/g.test(textNoSpace.replace(/(?:\".+\")+/, "")) && /^@$/g.test(text.replace(/[^@]+/g, ""))) {
        possibleEnc.push("Befunge");
    }
    if (/^[FBICRSEOQ\,\:\;\+\-0-9]+$/g.test(textNoSpace) && /,(?=[0-9])/g.test(textNoSpace)) {
        possibleEnc.push("NVSPL2");
    }
    if (/^HAI.+KTHXBYE$/g.test(textNoSpace)) {
        possibleEnc.push("LOLCODE");
    }
    if (/^[\x20\t\n\x0d]{10,}$/g.test(text)) {
        possibleEnc.push("Whitespace (Esolang)");
    }
    if (/^['\(\<BQbcu]+[\&\'\=APabt]+/g.test(textNoSpace)) {
        possibleEnc.push("Malbolge");
    }

    //Zjistěte jakoukoli kompresi souborů
    if (/^\x1f\x8b/gi.test(text)) {
        possibleEnc.push("gz compressed");
    }
    if (/^\x42\x5a\x68/gi.test(text)) {
        possibleEnc.push("bz2 compressed");
    }
    if (/^\x1f(?:\x9d|\xa0)/gi.test(text)) {
        possibleEnc.push("zlib compressed");
    }

    // zjištění HEXa šifrování
    if (/^(?:r[0-9A-F]{2}|\+[0-9A-F]{2}|u[0-9A-F]{2}|\-[0-9A-F]{2}|d[0-9A-F]{2})+$/gi.test(textNoSpace)) {
        possibleEnc.push("HID Keyboard log");
    }
    if (/^Dear(?:Friend|E-Commerceprofessional|Businessperson|Professional|Cybercitizen|Colleague|DecisionMaker|Salaryman|WebSurfer|SirorMadam).+Senatebill.+Title.+Section/gi.test(textNoSpace)) {
        possibleEnc.push("Spammimic");
    }
    if (/^[02-9]+$/.test(textNoSpace) && !/0{2,}|[2345678]{4,}|9{5,}/.test(text) && (/33/.test(text) || /666/.test(text) || /444/.test(text))) {
        possibleEnc.push("T9");
    }

    // detekujte jakoukoli moznou zakladni basy textu
    if (/^[01]+$/g.test(textNoSpace)) {
        if (textNoSpace.length % 5 == 0) {
            possibleEnc.push("Baudot Code");
        }
        possibleEnc.push("Base2 (Binary)");
    } else if (/^[0-7]+$/g.test(textNoSpace)) {
        possibleEnc.push("Base8 (Octal)");
    } else if (/^[0-9]+$/g.test(textNoSpace)) {
        possibleEnc.push("Base10 (Decimal)");
    } else if (/^(?:0x[0-9a-f]+|[0-9a-f]+)$/gi.test(textNoSpace) || /^(?:(\\|0)x[0-9a-f]{2}|(\\|0)u[0-9a-f]{4})+$/gi.test(textNoSpace)) {
        possibleEnc.push("Base16 (Hexadecimal)");
    } else if (/^[A-Z0-9]*=*$/g.test(textNoSpace)) {
        possibleEnc.push("Base32");
    } else if (/^[A-Z0-9\+\/]*=*$/i.test(textNoSpace)) {
        possibleEnc.push("Base64");
    } else if (/^[0-9A-Za-z\.\-\:\+=\^\!\/\*\?&<>\(\)\[\]\{\}@%\$#]+$/g.test(text)) {
        possibleEnc.push("Base85 ZeroMQ (Z85)");
    }

    result.possibleEnc = possibleEnc;
}

// vypocet frekvence
function getIC(text) {
    text = text.toLowerCase().replace(/[^a-z]/g, "");

    let counts = new Array(26);
    let total = 0;
    for (let i = 0; i < 26; i++)
        counts[i] = 0;

    for (let i = 0; i < text.length; i++) {
        counts[text.charCodeAt(i) - 97]++;
        total++;
    }
    let sum = 0;
    for (let i = 0; i < 26; i++)
        sum += counts[i] * (counts[i] - 1);

    let ic = sum / (total * (total - 1));
    console.log("ic: ", ic);

    return ic;
}

// funkce ktera projde text a spocita pismena v textu  
function getFrequency(text, n) {

    n = n || 1;
    n = Number(n);
    text = text.toUpperCase();

    let freq = {};
    for (let i = 0; i <= text.length - n; i++) {
        let character = text.charAt(i);
        for (let j = 1; j < n; j++)
            character += text.charAt(i + j);

        if (freq[character]) {
            freq[character]++;
        } else {
            freq[character] = 1;
        }
    }
    console.log("freq: ", freq);
    return freq;
}

Object.size = function(obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};