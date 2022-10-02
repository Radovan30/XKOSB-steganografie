/*
// Kontrola průhlednosti u obrázku.
function checkAlphaChannel(canvas, context) {
    var data = context.getImageData(0, 0, canvas[0].width, canvas[0].height).data;
    for (var i = 3; i < data.length; i += 4) {
        if (data[i] === 0) {
            return 1;
        }
    }
    return;
}
*/

function controllerInputFile(id) {
    if ($("input[name=" + id + "]").get(0).files.length !== 0)
        return 1;
    return;

}

function controllerFileImage(file) {
    if ($.inArray(file["type"], ["image/jpg", "image/jpeg", "image/png"]) > 0)
        return 1;
    return;
}


function originalImage() {
    //document.querySelector("span").innerText = "...Nahrávám..."
    $(".original").addClass("hash-none");
    if (controllerInputFile("baseImage")) {
        previewImage(document.querySelector("input[name=baseImage]").files[0], ".original canvas", function () {
            $(".original").removeClass("hash-none");
        });
    }
}

function previewImage(file, canvasSelector, callback) {
    let context = $(canvasSelector)[0].getContext("2d");
    let read = new FileReader();
    let img = new Image;

    if (!controllerFileImage(file)) {
        window.alert("Vybraný soubor není obrázek, zkuste to znovu!");
        console.log(file);
        document.querySelector("input[name=baseImage]").value = "";
        return;
    }

    read.readAsDataURL(file);
    read.onloadend = function () {
        img.src = URL.createObjectURL(file);
        img.onload = function () {
            $(canvasSelector).prop({
                "width": img.width,
                "height": img.height
            });
            context.drawImage(img, 0, 0);
            callback();
        }
    }
}

// Převod znaků ASCII do binární blokové podoby.
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

// Převod binárního řetězce na znaky ASCII.
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

// Očištění textu od diakritiky.
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

// Převod znaků ASCII do číselné podoby.
function convertPasswordIntoKey(input) {
    var out = "";

    // Cyklus pro převod všech znaků na ASCII hodnoty.
    for (var i = 0; i < input.length; i++) {
        out += input[i].charCodeAt(0);
    }
    return out;
}

// Náhled textu v binárním tvaru.
function previewBinaryMessage() {
    if (checkInputText("#message")) {
        $(".binary p").text(getBinaryMessage(removeDiacritic($("#message").val())));
        $(".binary").removeClass("d-none");
        $(".encoded").addClass("d-none");

        // Kontrola zapnutého šifrování.
        if (checkInputText("#encryptAESPassword")) {
            $(".binary").addClass("d-none");
            previewKey();
        }
    } else {
        $(".encoded").addClass("d-none");
        $(".binary").addClass("d-none");
        $(".encryptMessage").addClass("d-none");
        $(".binaryEncryptMessage").addClass("d-none");
    }
}







/*
// Kontrola průhlednosti u obrázku.
function checkAlphaChannel(canvas, context) {
    var data = context.getImageData(0, 0, canvas[0].width, canvas[0].height).data;
    for (var i = 3; i < data.length; i += 4) {
        if (data[i] === 0) {
            return 1;
        }
    }
    return;
}

// Ocisteni od diakritiky
function transferDiacritic(text) {
    text = text.split("");
    var special = "ÁáÉéĚěÍíÓóÚúŮůÝýŽžŠšČčŘřČčĎďŤťŇň";
    var normal = "AaEeEeIiOoUuUuYyZzSsCcRrCcDdTtNn";
    var ret = [];

    for (var i = 0; i < text.length; i++) {
        if (special.indexOf(text[i]) !== -1) {
            ret[i] = normal.substr(special.indexOf(text[i]), 1);
        } else
            ret[i] = text[i];
    }
    return ret.join("");
}


// Kontrola pro nevybry soubor
function checkInputFile(id) {
    if ($("input[name=" + id + "]").get(0).files.length !== 0)
        return 1;
    return;
}


// Kontrola prazdneho textoveho pole 
function emptyInputText(id) {
    if ($(id).val() !== '')
        return 1;
    return;
}


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


// Prevod znaku ASCII do ciselne podoby
function convertStringToBinary(input) {
    var out = "";

    // Cyklus pro prevod vsech znaku do ASCII hodnot
    for (var i = 0; i < input.length; i++) {
        out += input[i].charCodeAt(0);
    }
    return out;
}


// Prevod binarniho retezce na znaky ASCII
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


// kontrola nevybraneho vstupniho souboru
function controllerInputFile(id) {
    if ($("input[name=" + id + "]").get(0).files.length !== 0)
        return 1;
    return;

}


// kontrolni funkce pro vybrane typy souboru jpg, jpeg, png
function controllerFileImage(file) {
    if ($.inArray(file["type"], ["image/jpg", "image/jpeg", "image/png"]) > 0)
        return 1;
    return;
}

// Vygeneru nahled obrazku
function previewImage(file, canvasSelector, callback) {
    let context = $(canvasSelector)[0].getContext("2d");
    let read = new FileReader();
    let img = new Image;

    // Kontrola vstupniho formatu 
    if (!controllerInputFile(file)) {
        window.alert("Vybraný soubor není obrázek, zkuste to znovu!");
        console.log(file);
        $("input[name=baseImg]").value = "";
        return;
    }

    read.readAsDataURL(file);
    read.onloadend = function () {
        img.src = URL.createObjectURL(file);
        img.onload = function () {
            $(canvasSelector).prop({
                "width": img.width,
                "height": img.height
            });
            context.drawImage(img, 0, 0);
            callback();
        }
    }
}

// Nahled originalniho obrazku pred zakodovanim zpravy
function originalImage() {
    $(".original").addClass("none");
    if (controllerInputFile("baseImg")) {
        previewImage(document.querySelector("input[name=baseImg]").files[0], ".original canvas", function () {
            $(".original").removeClass("none");
        });
    }
}





// f-kce pro nahled textu v binarnim tvaru
function previewBinaryMessage() {
    if (checkInputText(".message").value) {
        $(".binary p").text(getBinaryMessage(removeDiacritic($(".message").val())));
        $(".binary").removeClass("none");
        $(".encoded").addClass("none");

        // Kontrola zapnuteho sifrovani
        if (checkInputText("#encryptAESPassword")) {
            $(".binary").addClass("none");
            previewKey();
        }
    } else {
        $(".encoded").addClass("none");
        $(".binary").addClass("none");
        $(".encryptMessage").addClass("none");
        $(".binaryEncryptMessage").addClass("none");
    }
}



*/