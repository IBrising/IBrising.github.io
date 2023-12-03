 var base;
 var punti=0;
 var rig=6;
 var col=6;
 var minuti=0;
 var secondi=0;
 var decimi=0;
 window.onload = function(){
    setGioco();
    startCronometro();
    document.getElementById("nuovoGioco").addEventListener("click", nuovoGioco);
 }
function startCronometro(){
    intervallo=setInterval( function (){
        decimi++;
        if(decimi===10){
            decimi=0;
            secondi++;
        }
        if(secondi===60){
            secondi=0;
            minuti++;
        }
        aggTimer();
    },100);
}
function aggTimer(){
    document.getElementById("tempo").innerText = `${minuti < 10 ? '0' : ''}${minuti}:${secondi < 10 ? '0' : ''}${secondi}`;
}
function fermaTimer(){
    clearInterval(intervallo);
}
function nuovoGioco(){
    fermaTimer();
    location.reload();
}

 function setGioco() {
    base =[
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0],
        [0,0,0,0,0,0]
    ]

    for(let r=0;r<rig;r++){
        for(let c=0;c<col;c++){
            let piastr = document.createElement("div");
            piastr.id = r.toString() + "-" +c.toString();
            let num = base[r][c];
            aggiornapiastr(piastr,num);
            document.getElementById("base").append(piastr);
        }
    }
    due();
    due();
 }
 function novuoti(){
    for(let r=0;r<rig;r++){
        for(let c=0;c<col;c++){
            if(base[r][c]==0){
                return true;
            }
        }
    }
    return false;
 }
 function due() {
    if (!novuoti()) {
        return;
    }

    let trova = false;
    while (!trova) {
        let r = Math.floor(Math.random() * rig);
        let c = Math.floor(Math.random() * col);

        if (base[r][c] == 0) {
            base[r][c] = 2;
            let piastr = document.getElementById(r.toString() + "-" + c.toString());
            piastr.innerText = "2";
            piastr.classList.add("p2", "nuova-piastr");


            setTimeout(() => {
                piastr.style.transition = 'transform 0.3s ease-in-out';
                piastr.style.transform = 'scale(1)';
            }, 0);

            setTimeout(() => {
                piastr.classList.remove("nuova-piastr");
            }, 300);

            trova = true;
        }
    }
}
function aggiornapiastr(piastr, num) {
    piastr.innerText = "";
    piastr.classList.value = "";
    piastr.classList.add("piastr");

    if (num > 0) {
        piastr.innerText = num;
        if (num <= 8192) {
            let colorClass = "p" + num.toString();
            piastr.classList.add(colorClass);
            piastr.style.setProperty('--piastr-colore', getComputedStyle(document.documentElement).getPropertyValue('--' + colorClass + '-colore'));
        } else {
            piastr.classList.add("p16384");
            piastr.style.setProperty('--piastr-colore', getComputedStyle(document.documentElement).getPropertyValue('--p16384-colore'));
        }
    }
}
 function aggconAnimatione(piastr, num) {
    return new Promise(resolve => {
        aggiornapiastr(piastr, num);
        piastr.classList.add("slitta-piastr");
        piastr.addEventListener("transitionend", () => {
            piastr.classList.remove("slitta-piastr");
            resolve();
        }, { once: true });
    });
}
 document.addEventListener("keyup",(e) => {
    if(e.code == "ArrowLeft"){
        slittasinistra();
        if (haiPerso()) {
            alert("Hai perso!");
            location.reload();
        }
        due();
        due();
    }
    else if(e.code == "ArrowRight"){
        slittadestra();
        if (haiPerso()) {
            alert("Hai perso!");
            location.reload();
        }
        due();
        due();
    }
    else if(e.code == "ArrowUp"){
        slittaSopra();
        if (haiPerso()) {
            alert("Hai perso!");
            location.reload();
        }
        due();
        due();
    }
    else if(e.code == "ArrowDown"){
        slittaSotto();
        if (haiPerso()) {
            alert("Hai perso!");
            location.reload();
        }
        due();
        due();
    }
    document.getElementById("punti").innerText = punti;
 })
 function filtrazero(riga){
    return riga.filter(num => num != 0);
 }
function slitta(riga){
    riga=filtrazero(riga);

    for(let i=0;i<riga.length-1;i++){
        if(riga[i] == riga[i+1]){
            riga[i] *= 2;
            riga[i+1] = 0;
            punti += riga[i];
        }
    }
    riga=filtrazero(riga);

    while(riga.length < col){
        riga.push(0);
    }
    return riga;
}
 function slittasinistra(){
    for(let r=0;r<rig;r++){
        let riga= base[r];
        riga=slitta(riga);
        base[r]=riga;

        for(let c=0;c<col;c++){
            let piastr=document.getElementById(r.toString() + "-" + c.toString());
            let num= base[r][c];
             aggconAnimatione(piastr, num);
        }
    }
 }
 function slittadestra(){
    for(let r=0;r<rig;r++){
        let riga= base[r];
        riga.reverse();
        riga=slitta(riga);
        riga.reverse();
        base[r]=riga;

        for(let c=0;c<col;c++){
            let piastr=document.getElementById(r.toString() + "-" + c.toString());
            let num= base[r][c];
            aggconAnimatione(piastr, num);
        }
    }
 }
 function slittaSopra(){
   
    for(let c=0;c<col;c++){
        let riga = [base[0][c],base[1][c],base[2][c],base[3][c],base[4][c],base[5][c]];
        riga=slitta(riga);
        for(let r=0;r<rig;r++){
            base[r][c]=riga[r];
            let piastr=document.getElementById(r.toString() + "-" + c.toString());
            let num= base[r][c];
             aggconAnimatione(piastr, num);
        }
    }
 }
 function slittaSotto(){
    for(let c=0;c<col;c++){
        let riga = [base[0][c],base[1][c],base[2][c],base[3][c],base[4][c],base[5][c]];
        riga.reverse();
        riga=slitta(riga);
        riga.reverse();
        for(let r=0;r<rig;r++){
            base[r][c]=riga[r];
            let piastr=document.getElementById(r.toString() + "-" + c.toString());
            let num= base[r][c];
             aggconAnimatione(piastr, num);
        }
    }
 }
 function haiPerso() {
    // Controlla se ci sono piastre vuote sulla board
    for (let r = 0; r < rig; r++) {
        for (let c = 0; c < col; c++) {
            if (base[r][c] === 0) {
                return false; // Se c'è almeno uno zero, ci sono ancora mosse possibili
            }
        }
    }

    // Controlla se ci sono piastre adiacenti uguali
    for (let r = 0; r < rig; r++) {
        for (let c = 0; c < col; c++) {
            if ((r !== rig - 1 && base[r][c] === base[r + 1][c]) || 
                (c !== col - 1 && base[r][c] === base[r][c + 1])) {
                return false; // Se ci sono piastre adiacenti uguali, ci sono ancora mosse possibili
            }
        }
    }

    // Se nessuna delle condizioni precedenti è soddisfatta, il giocatore ha perso
    return true;
}