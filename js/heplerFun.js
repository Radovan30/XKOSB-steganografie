/*  
Pomocne funkce pro kontrolu a upravu dat
*/

// Prevod znaku ASCII do binarni soustavy
function getBinaryMessage(text) {
    var out = "";
    for (var i = 0; i < text.length; i++) {
        var char = text[i].charCodeAt(0).toString(2);
        while (char.length < 8) {
            char = "0" + char;
        }
        out += char;
    }
    return out;
}

// Prevod binarni soustavy/retezce na znaky ASCII
function convertBinaryToString(binaryText) {
    var out = "";
    for (var i = 0; i < binaryText.length; i += 8) {
        var c = 0;
        for (var j = 0; j < 8; j++) {
            c <<= 1;
            c |= parseInt(binaryText[i + j]);
        }
        if (c !== 0) {
            out += String.fromCharCode(c);
        }
    }
    return out;
}

// Prevod znaku ASCII na cislo
function convertPasswordIntoKey(input) {
    var out = "";

    // Cyklus pro prevod vsech znaku ASCII na cislo
    for (var i = 0; i < input.length; i++) {
        out += input[i].charCodeAt(0);
    }
    return out;
}

// Odstraneni diakritiky
function removeDiacritic(text) {
    text = text.split("");
    var special = "ÁáÉéĚěÍíÓóÚúŮůÝýŽžŠšČčŘřČčĎďŤťŇň";
    var normal = "AaEeEeIiOoUuUuYyZzSsCcRrCcDdTtNn";
    var out = [];

    for (var i = 0; i < text.length; i++) {
        if (special.indexOf(text[i]) !== -1) {
            out[i] = normal.substr(special.indexOf(text[i]), 1);
        } else
            out[i] = text[i];
    }
    return out.join("");
}


// Kontrola zda nevybraneho souboru
function checkInputFile(id) {
    if ($("input[name=" + id + "]").get(0).files.length !== 0)
        return 1;
    return;
}

// Kontrola pro prazdneho textove pole na vstupu
function checkInputText(id) {
    if ($(id).val() !== "")
        return 1;
    return;
}

// Kontrola typu souboru u obrazku
function controlFileImg(file) {
    if ($.inArray(file["type"], ["image/jpg", "image/jpeg", "image/png"]) > 0)
        return 1;
    return;
}


// Kontrola pruhlednosti pozadi u obrazku
function checkAlphaChannel(canvas, context) {
    var data = context.getImageData(0, 0, canvas[0].width, canvas[0].height).data;
    for (var i = 3; i < data.length; i += 4) {
        if (data[i] === 0) {
            return 1;
        }
    }
    return;
}

