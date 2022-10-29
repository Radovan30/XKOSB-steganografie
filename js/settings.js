// import skriptu 
import { VigenereChiper } from './vigenereChiper.js'


// nastaveni promennych
const process = new VigenereChiper(undefined, undefined);
const fieldInputText = document.querySelector('.inputText');
const fieldInputPass = document.querySelector('.inputPass');
const fieldResult = document.querySelector('.result');

const btnEnc = document.querySelector('.btn.enc');
const btnDec = document.querySelector('.btn.dec');
const btnCop = document.querySelector('.btn.cop');

//let alphabet = document.getElementById("alphabet").innerHTML = VigenereChiper;

let ret;


// spusti zakodovani po kliknuti na knoflik zakodovat 
btnEnc.addEventListener('click', () => {
    let text = fieldInputText.value.length;
    let key = fieldInputPass.value.length;
    console.log("klic =>", text);
    console.log("text =>", key);

    if (text == 0) {
        window.alert("Zadej zpravu do textového pole!");
    }
    else if (key == 0) {
        window.alert("Zadej šifrovací klíč!");
    }
    else

        process.input(fieldInputText.value, fieldInputPass.value);
    ret = process.encypt().join('');
    fieldResult.innerText = ret;
})

// spusti rozkodovani po kliknuti na knoflik rozkodovat 
btnDec.addEventListener('click', () => {
    let text = fieldInputText.value.length;
    let key = fieldInputPass.value.length;
    if (text == 0) {
        window.alert("Zadej zpravu do textového pole!");
    }
    else if (key == 0) {
        window.alert("Zadej šifrovací klíč!");
    }
    else
    process.input(fieldInputText.value, fieldInputPass.value);
    ret = process.decypt().join('');
    fieldResult.innerText = ret;
})


// kopirovani vystupniho textu 
btnCop.addEventListener('click', () => {
    let copyText = document.getElementById("result");
    copyText.select();
    document.execCommand("copy");
});

