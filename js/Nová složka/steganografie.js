// ---------------------------------------
//  1.CAST SKRIPTU PRO ZASIFROVANI OBRAZKU 
// ---------------------------------------

// funkce pro vygeberovani nahledu
function displayImg(file, canvasSelector, ret) {
    let context = $(canvasSelector)[0].getContext("2d");
    let read = new FileReader();
    let img = new Image;

    // kontorla formatu obrazku/souboru
    if (!controlFileImg(file)) {
        window.alert("Vybraný soubor není obrazek, nebo nesplňuje povolený format!");
        document.querySelector("input[name=decodeFile]").value = "";
        document.querySelector("input[name=baseImg]").value = "";
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
            ret();
        };
    };
}

// funkce pro nahled originalniho obrazku 
function encodeImg() {
    $(".original").addClass("none");
    if (controlInputFile("baseImg")) {
        displayImg(document.querySelector("input[name=baseImg]").files[0], ".original canvas", function () {
            $(".original").removeClass("none");
        });
    }
}

// funkce pro nahled textu v binarnim tvaru
function binaryMsg() {
    if (wiewInputText("#msg")) {
        $(".binary p").text(getBinaryMsg(substitutionDiacritic($("#msg").val())));
        $(".binary").removeClass("none");
        $(".encoded").addClass("none");
    } else {
        $(".encoded").addClass("none");
        $(".binary").addClass("none");
    }
}

// zakodovani zpravy do obrazku
function encodeMessage() {
    // kontola vlozeneho obrazku
    if (!controlInputFile("baseImg")) {
        window.alert("Nebyl nahraný žádný obrázek!");
        return;
    }

    // vstupni obrazek
    let originalCanvas = $(".original canvas");
    let originalContext = originalCanvas[0].getContext("2d");

    let height = originalCanvas[0].height;
    let width = originalCanvas[0].width;

    // kontrola pruhlednosti na vstupu u obrazku
    if (controlAlphaChannel(originalCanvas, originalContext)) {
        window.alert("Obrazek má pruhledné pozadí, nelze do něj zakódovat zprávu!");
        return;
    }

    // kontrola zadani zpravy do textoveho pole
    if (!wiewInputText("#msg")) {
        window.alert("Nebyla zadana žádna zpráva k zašifrování!");
        return;
    }

    // text na vstupu
    let text = substitutionDiacritic($("#msg").val());

    // kontrola pro existenci zasifrovaneho textu
    if (cipher !== "") {
        text = cipher;
    }

    // kontrola jestli obrazek dokaze pojmout zakodovanou zpavu
    if ((text.length * 8) > (width * height * 3)) {
        window.alert("Zpráva je pro vybraný obrázek příliš dlouhá, napište kratší zpravu nebo změňte obrázek!");
        return;
    }

    // pomocne platno pro upraveny obrazek
    let normalizeCanvas = document.createElement("canvas");
    normalizeCanvas.height = height;
    normalizeCanvas.width = width;
    let normalizeContext = normalizeCanvas.getContext("2d");

    // cysklus pro upravu vstupniho obrazku
    let normalize = originalContext.getImageData(0, 0, width, height);

    // cyklus pro upravu RGB dat obrazku tak, aby byly hodnoty kanalu RGB sude.
    for (let i = 0; i < normalize.data.length; i += 4) {
        for (let j = 0; j < 3; j++) {
            if (normalize.data[i + j] % 2 !== 0) {
                normalize.data[i + j]--;
            }
        }
    }
    normalizeContext.putImageData(normalize, 0, 0);

    // kontrolni vypis upravenych dat
    console.info("Upravené RGBA hodnoty vstupního obrázku:");
    console.info(normalize.data);

    // vystupni platno obrazku
    let msgCanvas = $(".encoded canvas");
    msgCanvas.prop({
        "width": width,
        "height": height
    });
    let msgContext = msgCanvas[0].getContext("2d");

    // cylus pro vlozeni binarni zpravy do obrazku
    let msg = normalizeContext.getImageData(0, 0, width, height);
    for (let c = 0, i = 0; i < msg.data.length; i += 4) {
        for (let j = 0; j < 3; j++) {
            if (c < getBinaryMsg(text).length) {
                msg.data[i + j] += parseInt(getBinaryMsg(text)[c]);
                c++;
            } else {
                break;
            }
        }
    }
    msgContext.putImageData(msg, 0, 0);
    $(".encoded").removeClass("none");

    // Kontrolní výpis obrazových dat se zakódovanou zprávou.
    console.info("RGBA hodnoty vstupního obrázku s vloženou zprávou:");
    console.info(msg.data);
}

// Klíčová proměnná se zašifrovanou zprávou pro lepší manipulaci napříč funkcemi.
let cipher = "";


// ---------------------------------------
//  2.CAST SKRIPTU PRO ROZSIFROVANI OBRAZKU
// ---------------------------------------

 // nahled obrazku se zakodovanou zpravou
 function encodeImage() {
    $(".decode").addClass("none");
    $(".binary-decode").addClass("none");
    if (controlInputFile("decodeFile")) {
        displayImg(document.querySelector("input[name=decodeFile]").files[0], ".decode canvas", function () {
            $(".decode").removeClass("none");
        });
    } else {
        $(".decode").addClass("none");
    }
}

// rozkodovani zpravy z obrazku
function decodeMsg() {
    // kontrola nahraneho obrazku/souboru
    if (!controlInputFile("decodeFile")) {
        window.alert("Nebyl nahrán žádný obrázek!");
        return;
    }

    // vstupni obrazek/soubor
    let originalCanvas = $(".decode canvas");
    let originalContext = originalCanvas[0].getContext("2d");

    // kontorla pruhlednosti pozadi u obrazku/souboru
    if (controlAlphaChannel(originalCanvas, originalContext)) {
        window.alert("Obrázek na vstupu nelze použít, protože obsahuje průhledné pozadí!");
        return;
    }

    // cyklus pro ziskani zakodovane zpravy ze vstupniho obrazku/souboru
    let msg = originalContext.getImageData(0, 0, originalCanvas.width(), originalCanvas.height());
    let binary = "";
    for (let i = 0; i < msg.data.length; i += 4) {
        for (let j = 0; j < 3; j++) {
            if (msg.data[i + j] % 2 !== 0) {
                binary += 1;
            } else {
                binary += 0;
            }
        }
    }

    // vypis do konzole pro kontrolu binarni zpavy
    console.info("Binární tvar zprávy:");
    console.info(binary);

    // ziskani puvodni zpravy
    msg = convertBinaryToString(binary);
    console.info(msg);

    // vypis desifrovane zpravy
    $(".binary-decode p").text(msg);
    $(".binary-decode").removeClass("none");
}

