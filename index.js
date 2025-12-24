const btnPseudo = document.getElementById('btnPlayer');
const pseudo = document.getElementById('player');
const strError = document.getElementById('error');

let playerName = "";
let messError ="";
let pseudoPlayer = sessionStorage.getItem("point&clickKey");

if(pseudoPlayer !== null){
    window.location.replace("game.html");
}

btnPseudo.addEventListener('click', checkingPseudo);

window.addEventListener("keydown", function (event) {
    if (event.defaultPrevented) {
    return; 
    }
    switch (event.key) {
    case "Enter":
        checkingPseudo();
        break;
    default:
        return; 
    }

    event.preventDefault();
},true);

function checkingPseudo(){
  if((pseudo.value.trim() !== "") && (pseudo.value.trim().length > 2) && (pseudo.value.trim().length < 12)){
      playerName = pseudo.value.replace(/\s+/g, '');
      sessionStorage.setItem("point&clickKey", playerName);
      window.location.replace("game.html");

  }else{
      messError="";
      if(pseudo.value.trim() === ""){messError +="<p>Veuillez entrer un pseudo</p>";}
      if(pseudo.value.trim().length <= 2){messError +="<p>3 caractéres minimun</p>";}
      if(pseudo.value.trim().length >= 12){messError +="<p>12 caractéres maximun</p>";}

      pseudo.style.outline ="2px solid red";
      pseudo.style.outlineOffset ="-4px";
      pseudo.style.animation ="";
      pseudo.offsetHeight;
      pseudo.style.animation ="error 0.5s linear";
      strError.innerHTML = messError;
  }
}