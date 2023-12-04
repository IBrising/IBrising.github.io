  var base;
 var punti=0;
 var rig=6;
 var col=6;
 var minuti=0;
 var secondi=0;
 var decimi=0;
 var nuovoNumero;
 var record=0;
 window.onload = function(){
    record = recuperaRecord();
    document.getElementById("record").innerText = record;
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
            let maxValore = Math.max(...base.map(row => Math.max(...row)))

            if (maxValore === 2 || maxValore === 0) {
                nuovoNumero = 2;
            } else if (maxValore === 64) {
                
                nuovoNumero = Math.random() < 0.5 ? 2 : 4;
            } else if (maxValore === 128) {
                nuovoNumero = 4;
            } else if (maxValore === 256) {
               
                nuovoNumero = Math.random() < 0.5 ? 4 : 8;
            } else {
                
                nuovoNumero = Math.pow(2, Math.floor(Math.random() * Math.log2(maxValore) + 1));
            }

            base[r][c] = nuovoNumero;
            let piastr = document.getElementById(r.toString() + "-" + c.toString());
            piastr.innerText = nuovoNumero.toString();
            piastr.classList.add("p" + nuovoNumero.toString(), "nuova-piastr");

            setTimeout(() => {
                piastr.style.transition = 'transform 0.3s ease-in-out';
                piastr.style.transform = 'scale(1)';
            }, 100);

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
    }
    else if(e.code == "ArrowRight"){
        slittadestra();
        if (haiPerso()) {
            alert("Hai perso!");
            location.reload();
        }
        
        due();
    }
    else if(e.code == "ArrowUp"){
        slittaSopra();
        if (haiPerso()) {
            alert("Hai perso!");
            location.reload();
        }
      
        due();
    }
    else if(e.code == "ArrowDown"){
        slittaSotto();
        if (haiPerso()) {
            alert("Hai perso!");
            location.reload();
        }
     
        due();
    }
    document.getElementById("punti").innerText = punti;
 })
 let startTouchX, startTouchY;

 document.addEventListener("touchstart", (e) => {
     startTouchX = e.touches[0].clientX;
     startTouchY = e.touches[0].clientY;
 });
 
 document.addEventListener("touchmove", (e) => {
     e.preventDefault(); // Per evitare lo scrolling della pagina su dispositivi mobili
 });
 
 document.addEventListener("touchend", (e) => {
     const endTouchX = e.changedTouches[0].clientX;
     const endTouchY = e.changedTouches[0].clientY;
 
     const deltaX = endTouchX - startTouchX;
     const deltaY = endTouchY - startTouchY;
 
     if (Math.abs(deltaX) > Math.abs(deltaY)) {
         if (deltaX > 0) {
            slittasinistra();
            if (haiPerso()) {
                alert("Hai perso!");
                location.reload();
            }
            
            due();
             due();
         } else {
            slittasinistra();
            if (haiPerso()) {
                alert("Hai perso!");
                location.reload();
            }
            
            due();
            
         }
     } else {
         if (deltaY > 0) {
            slittaSotto();
            if (haiPerso()) {
                alert("Hai perso!");
                location.reload();
            }
         
            due();

         } else {
            slittaSopra();
            if (haiPerso()) {
                alert("Hai perso!");
                location.reload();
            }
          
            due();

         }
     }
 
     if (haiPerso()) {
         alert("Hai perso!");
         location.reload();
     }
 
     due();
     document.getElementById("punti").innerText = punti;
 });

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
 function recuperaRecord() {
    const recordSalvato = localStorage.getItem('record');
    return recordSalvato ? parseInt(recordSalvato) : 0;
}
 function haiPerso() {
    if (punti > record) {
        record = punti;
        localStorage.setItem('record', record.toString());
        aggiornaRecordVisuale(); 
    }
    
    for (let r = 0; r < rig; r++) {
        for (let c = 0; c < col; c++) {
            if (base[r][c] === 0) {
                return false; 
            }
        }
    }

   
    for (let r = 0; r < rig; r++) {
        for (let c = 0; c < col; c++) {
            if ((r !== rig - 1 && base[r][c] === base[r + 1][c]) || 
                (c !== col - 1 && base[r][c] === base[r][c + 1])) {
                return false; 
            }
        }
    }

    return true;
}
function aggiornaRecordVisuale() {
    const recordElement = document.getElementById("record");
    if (recordElement) {
        recordElement.innerText = record;
    }
}
