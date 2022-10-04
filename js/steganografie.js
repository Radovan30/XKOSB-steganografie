//  CAST SKRIPTU PRO ZASIFROVANI OBRAZKU 

// funkce pro vygeberovani nahledu
function displayImg(file, canvasSelector, ret) {
    let context = $(canvasSelector)[0].getContext("2d");
    let read = new FileReader();
    let img = new Image;

    // kontorla formatu souboru
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

    // vstubni obrazek
    let originalCanvas = $(".original canvas");
    let originalContext = originalCanvas[0].getContext("2d");

    let height = originalCanvas[0].height;
    let width = originalCanvas[0].width;

    // kontrola pruhlednosti na vstupu u obrazku
    if (controlAlphaChannel(originalCanvas, originalContext)) {
        window.alert("Obrazek má pruhledné pozadí, nelze do něj zakódovat zprávu!");
        return;
    }

    // kontrola jestli byla zadana zprava
    if (!wiewInputText("#msg")) {
        window.alert("Nebyla zadana žádna zpráva k zašifrování!");
        return;
    }

    // text na vzstupu
    var text = substitutionDiacritic($("#msg").val());

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
    var msgCanvas = $(".encoded canvas");
    msgCanvas.prop({
        "width": width,
        "height": height
    });
    var msgContext = msgCanvas[0].getContext("2d");

    // cylus pro vlozeni binarni zpravy do obrazku
    let msg = normalizeContext.getImageData(0, 0, width, height);
    for (var c = 0, i = 0; i < msg.data.length; i += 4) {
        for (var j = 0; j < 3; j++) {
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
var cipher = "";



//  CAST SKRIPTU PRO ROZSIFROVANI OBRAZKU 