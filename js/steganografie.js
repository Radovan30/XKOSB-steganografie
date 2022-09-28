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


function displayEncodeImage() {
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

function emptyInputText(id) {
    if($(id).val() !== '')
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

function binaryMessage() {
    if (checkInputText("msg")) {
        $("")
    }
}