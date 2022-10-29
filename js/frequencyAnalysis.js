// FRAKVECNI ANALYZA

// sort tridici funkce
function sortfunction(a, b) {
    return (b - a);
}

// funkce pro frekvencni analyzu
function frequencyAnalysis(text) {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let frequency = new Array(26);
    frequency['a'] = 0;
    frequency['b'] = 0;
    frequency['c'] = 0;
    frequency['d'] = 0;
    frequency['e'] = 0;
    frequency['f'] = 0;
    frequency['g'] = 0;
    frequency['h'] = 0;
    frequency['i'] = 0;
    frequency['j'] = 0;
    frequency['k'] = 0;
    frequency['l'] = 0;
    frequency['m'] = 0;
    frequency['n'] = 0;
    frequency['o'] = 0;
    frequency['p'] = 0;
    frequency['q'] = 0;
    frequency['r'] = 0;
    frequency['s'] = 0;
    frequency['t'] = 0;
    frequency['u'] = 0;
    frequency['v'] = 0;
    frequency['w'] = 0;
    frequency['x'] = 0;
    frequency['y'] = 0;
    frequency['z'] = 0;

    // cyklus pro zamenu velkych pismen za male
    text = text.toLowerCase();
    for (i = 0; i < text.length; i++) {
        letter = text.charAt(i);
        if (alphabet.indexOf(letter) >= 0) {
            frequency[letter]++;
            console.log(letter);
        }
    }

    // setrideni pole pismen
    let sortedArray = new Array(26);
    for (i = 0; i < 26; i++) {
        letter = alphabet.charAt(i);
        sortedArray[i] = frequency[letter];
    }

    // vypocet procent a pocet znaku do grafu
    sortedArray.sort(sortfunction);
    let step = 110 / sortedArray[0];
    let total = 0;
    let numberOfCharacters = text.length;
    for (i = 0; i < 26; i++) {
        letter = alphabet.charAt(i);
        if (text != "") {
            if (frequency[letter] > 0) {
                percent = (frequency[letter] / numberOfCharacters) * 100;
                percent = percent.toFixed(1) + '%';
                total = frequency[letter];
            } else {
                percent = "";
                total = "";
            }
            height = frequency[letter] * step;
            document.getElementById("graph_" + letter).innerHTML = total + '<div class="column" style="height:' + height + 'px;"></div>';
            document.getElementById("percent_" + letter).innerHTML = percent;
        } else {
            document.getElementById("graph_" + letter).innerHTML = '';
            document.getElementById("percent_" + letter).innerHTML = '';

        }
    }
}

// funkce pro zamenu pismen 
function substituteLetters() {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let plain = "";
    let cipher = document.getElementById("cipher").value.toLowerCase();
    let dict = {};
    let punctuation = [" ", ",", ".", "-", "!", "?", "_", "+"];

    for (i = 0; i < 26; i++) {
        let letter = alphabet.charAt(i);
        let subLetter = document.getElementById("sub_" + letter).value.toUpperCase();
        if (subLetter != "") dict[letter] = subLetter;
    }

    for (i = 0; i < cipher.length; i++) {
        let letter = cipher.charAt(i);
        let subLetter = letter;
        if (letter in dict) {
            subLetter = dict[letter];
        } else if (alphabet.indexOf(letter) >= 0) {
            subLetter = "*";
        }

        plain = plain + subLetter;
    }

    document.getElementById("plain").value = plain;
}

function clearText() {
    document.getElementById("cipher").value = "";
}