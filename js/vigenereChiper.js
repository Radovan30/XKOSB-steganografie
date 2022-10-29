export class VigenereChiper {

    data = [
        "A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z",
        "a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
        "á","é","ě","í","ý","ó","ú","ů","ž","š","č","ř","ď","ť","ň",
        "Á","É","Ě","Í","Ý","Ó","Ú","Ů","Ž","Š","Č","Ř","Ď","Ť","Ň",
        "1","2","3","4","5","6","7","8","9","0",
        "~","`","!","@","#","$","%","^","&","*","(",")","-","_","+","=","\\","|","[","]","{","}",";",":","\"","'",",","<",".",">","?","/"," ",
    ]


    constructor(text, password) {
        this['text'] = text;
        this['password'] = password;
    }
    
    input(text,password) {
        this.text = text;
        this.password = password;
        console.log(`Vstupní text: ${text} \nKlíč: ${password}`);
    }

    findKey(dataInput) {
        let temp = [];

        for (let i = 0; i < dataInput.length; i++) {
            for (let j = 0; j < this['data'].length; j++) {
                if (dataInput[i] == this['data'][j]){
                    temp.push(j);
                }
            }
        }

        return temp;
    }

    findLett() {
        let temp = []

        for (let i = 0; i < this['text'].length; i++) {
            if (this['text'][i] > this['data'].length) {
                temp.push(this['data'][this['text'][i] - (this['data'].length -1)]);
            } else {
                temp.push(this['data'][this['text'][i]]);
            }
        }

        return temp;
    }

    extendPass() {
        let temp = [],indc = 0; 

        for (let i = 0; i < this['text'].length; i++) {
            if (indc >= this['password'].length) {
                indc = 0
            } 

            temp.push(this['password'][indc]);
            indc++;
        }

        return temp;
    }

    sum() {
        let temp = []; 

        if (this['text'].length != this['password'].length){
            console.log("Err: nesprávná logika!!!");
        } else {
            for (let i = 0; i < this['text'].length; i++) {
                temp.push(this['text'][i] + this['password'][i]);             
            }
        }

        return temp;
    }

    sub() {
        let temp = [];

        for (let i = 0; i < this['text'].length; i++) {
            let math = this['text'][i] - this['password'][i];

            if (math < 1){
                let TEMP = this['text'][i] + (this['data'].length-1); 
                math = TEMP - this['password'][i]; 
            }

            temp.push(math);
        }

        return temp;
    }

    cek() {
        console.log(this['text']);
        console.log(this['password']);
    }

    flow() {
        this['text'] = this['text'].split('');
        this['password'] = this['password'].split('');

        this.cek();
        
        this['text'] = this.findKey(this['text']);
        this['password'] = this.findKey(this['password']);
        
        this.cek();
        
        this['password'] = this.extendPass();
        
        this.cek();
    }

    encypt() {
        this.flow();

        this['text'] = this.sum();

        this.cek();
        
        console.log("Výsledek kódování: ",this.findLett());

        return this.findLett();
    }
    
    decypt() {
        this.flow();
        
        this['text'] = this.sub();
        
        this.cek();
        
        console.log("Výsledek rozkódování: ",this.findLett());
        
        return this.findLett();
    }
}
