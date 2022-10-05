// -----------------------------------------------------
//  SKRIP S POMOCNYMI FUNKCEMI PRO KONTROKU A UPRAVU DAT
// ------------------------------------------------------


// prevod znaku ASCII do binarni soustavy
function getBinaryMsg(text) {
    let ret = "";
    for (let i = 0; i < text.length; i++) {
        let char = text[i].charCodeAt(0).toString(2);
        while (char.length < 8) {
            char = "0" + char;
        }
        ret += char;
    }
    return ret;
}


// prevod binarni soustavy/retezce na znaky ASCII
function convertBinaryToString(binaryText) {
    let ret = "";
    for (let i = 0; i < binaryText.length; i += 8) {
        let c = 0;
        for (let j = 0; j < 8; j++) {
            c <<= 1;
            c |= parseInt(binaryText[i + j]);
        }
        if (c !== 0) {
            ret += String.fromCharCode(c);
        }
    }
    return ret;
}


// prevod znaku ASCII na cislo
function convertPasswordIntoKey(input) {
    let ret = "";

    // cyklus pro prevod vsech znaku ASCII na cislo
    for (let i = 0; i < input.length; i++) {
        ret += input[i].charCodeAt(0);
    }
    return ret;
}


// odstraneni diakritiky
function substitutionDiacritic(text) {
    text = text.split("");
    let special = "ÁáÉéĚěÍíÓóÚúŮůÝýŽžŠšČčŘřČčĎďŤťŇň";
    let normal = "AaEeEeIiOoUuUuYyZzSsCcRrCcDdTtNn";
    let ret = [];

    for (let i = 0; i < text.length; i++) {
        if (special.indexOf(text[i]) !== -1) {
            ret[i] = normal.substr(special.indexOf(text[i]), 1);
        } else
            ret[i] = text[i];
    }
    return ret.join("");
}


// kontrola nevybraneho souboru
function controlInputFile(id) {
    if ($("input[name=" + id + "]").get(0).files.length !== 0)
        return 1;
    return;
}


// kontrola pro prazdneho textove pole na vstupu
function wiewInputText(id) {
    if ($(id).val() !== "")
        return 1;
    return;
}


// kontrola typu souboru u obrazku
function controlFileImg(file) {
    if ($.inArray(file["type"], ["image/jpg", "image/jpeg", "image/png"]) > 0)
        return 1;
    return;
}


// kontrola pruhlednosti pozadi u obrazku
function controlAlphaChannel(canvas, context) {
    let data = context.getImageData(0, 0, canvas[0].width, canvas[0].height).data;
    for (let i = 3; i < data.length; i += 4) {
        if (data[i] === 0) {
            return 1;
        }
    }
    return;
}

