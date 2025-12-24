//Vérification Pseudo + affichage
let pseudoPlayer = sessionStorage.getItem("point&clickKey");
const titlePseudo = document.getElementById('name');
titlePseudo.textContent = pseudoPlayer;

console.log(pseudoPlayer);

if(pseudoPlayer === null){
  window.location.replace("index.html");
}

//Vérification de la page assurer un jeu sans bug 
window.addEventListener('resize', () => {
  window.location.reload();
});

let page = 0;
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    // utilisateur revient → reload immédiat
    window.location.reload();
  }
});


window.addEventListener('load', game);



function game() {
    
    leaderBoard();

    const contentMain = document.getElementById('contentMain');
    const titleMain = document.querySelector('#main h2');
    const zone = document.getElementById("map");
    let images = document.querySelectorAll('.map img');
    const rect = zone.getBoundingClientRect();
    let nbrKill = document.getElementById('score');
    let pause = document.getElementById('settings');
    let unPause = document.getElementById('unPause');
    const screenPause = document.getElementById('gamePause');
    const screenEndGame = document.getElementById('endGame');
    let PausePlay = true;
    const son = new Audio('sound/killSound.mp3');
    const startGame = document.getElementById("start");

    //affichage inGame
    const score = document.getElementById("score");
    const timer = document.getElementById("timer");
    const settings = document.querySelector('.settings svg');

    let historique = [];

    const movers = Array.from(images).map(img => {
        const size = img.getBoundingClientRect().width;
        
        return { 
        el: img, size, // cible la balise HTML
        // Attributs pour chaque balise img différente dans le HTML
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        targetX: Math.random() * (rect.width - size),
        targetY: Math.random() * (rect.height - size),
        speed: 75 + Math.random() * 100, // vitesse aléatoire entre 75 et 175 pixels/sec
        alive: true,
        scale: 0.3 
        };
    });

    let missClick = 0; 
    zone.addEventListener('click', () =>{
      missClick += 1;
    });

    function clamp(value, min, max) {
     return Math.max(min, Math.min(value, max));
    }

    nbrKill = 0;
    let lastTime = null;
    let start = null
    // Fonction pour calculer une nouvelle position cible
    function respawn(m){

          const zone = document.getElementById("map");
          const rect = zone.getBoundingClientRect();
          const size = m.el.getBoundingClientRect().width;

          m.targetX = clamp(Math.random() * rect.width, size/2, rect.width - size/2);
          m.targetY = clamp(Math.random() * rect.height, size/2, rect.height - size/2);

          m.x = clamp(Math.random() * rect.width, size/2, rect.width - size/2);
          m.y = clamp(Math.random() * rect.height, size/2, rect.height - size/2);
          m.scale = 0.3;
          m.el.style.transform = `translate(${m.x}px, ${m.y}px) translate(-50%, -50%) scale(${m.scale})`;
          m.alive = true;
        
    }

    function pickNewTarget(m) {

        const size = m.el.getBoundingClientRect().width;

        m.targetX = clamp(Math.random() * rect.width, size/2, rect.width - size/2);
        m.targetY = clamp(Math.random() * rect.height, size/2, rect.height - size/2);

        console.log(m.targetX, m.targetY);
    }

    movers.forEach(mover =>{
      mover.el.addEventListener('click', () => { 

        son.pause();         
        son.currentTime = 0; 
        son.play();

        nbrKill += 1;
        score.textContent = String(nbrKill).padStart(3,"00");
        mover.alive = false;

        const rectKill = mover.el.getBoundingClientRect();
        
        mover.el.style.left = rectKill.left + 'px';
        mover.el.style.top = rectKill.top + 'px';
        mover.el.style.position = "fixed";

        mover.el.classList.add('kill'); 

        mover.el.addEventListener('animationend', () =>{
          mover.el.classList.remove('kill'); 

          mover.el.style.removeProperty('left');
          mover.el.style.removeProperty('top');
          mover.el.style.removeProperty('position');

          respawn(mover);

        }, { once: true });
      
      });
    });

    let etatGame = false;
    let resetGame = false; 

    function startingGame(){
        const countdown = document.getElementById("countdown");

        countdown.style.display ="flex";
        startGame.style.display="none";

        clearInterval(start);

        resetGame = true; 
        nbrKill = 0;
        missClick = 0;
        a = 30;
        s = 3;

        start = setInterval(() => {
          s-= 1;
          etatGame = false;
          countdown.textContent = String(s).padStart(2, "0");

          countdown.style.animation ="none";
          countdown.offsetHeight;
          countdown.style.animation="fontSizeAnim 1s ease-out";

          if(s === -1){
            clearInterval(start);
            countdown.style.display ="none";
            s = 3;
            countdown.textContent = "03";
            inGame()
          }
        }, 1000);
      }
      
      a = 30;
      let timerGame = null;
      function inGame(){
        
        etatGame = true;
        resetGame = false; 


        settings.style.display ="block";
        timer.style.display ="block";
        score.style.display ="block";

        clearInterval(timerGame);
        console.log(a);
        timerGame = setInterval(() => {

          a-= 1;
          console.log(a);
          timer.textContent = String(a).padStart(2, "0");

          if(a === -1){
            a = 30;
            addNewScore();
            clearInterval(timerGame);
            endScreen();
            addGameHistorical();
          }
        }, 1000);
      }

      let space = false;
      window.addEventListener("keydown",
        function (event) {
          if (event.defaultPrevented) {
            return; 
          }
          switch (event.key) {
            case "Enter":
               if(resetGame) return;

              clearInterval(start);
              playAgain();

              break;
            case "Escape":
              stopAll();

              break;
            case " ":
              if(!etatGame) return;

              space = !space;
              space === true ? gamePause() : stopPause();
              break;
            default:
              return; 
          }

          event.preventDefault();
        },true);

      unPause.addEventListener('click', stopPause);
      pause.addEventListener('click',  gamePause );

      document.querySelectorAll("#reset").forEach(btn => {
        btn.addEventListener("click", () => {
          playAgain();
        });
      });

      document.querySelectorAll("#leave").forEach(btn => {
        btn.addEventListener("click", () => {
          stopAll();
        });
      });

      function playAgain(){

        clearInterval(timerGame);

        timer.textContent = "30";
        score.textContent = "000";

        PausePlay = true;
        requestAnimationFrame(step);

        screenPause.style.display = "none";
        screenEndGame.style.display = "none";

        startingGame();
        
      }

      function gamePause(){

        clearInterval(timerGame);

        screenPause.style.display = "flex";

        PausePlay = !PausePlay;
      }

      function stopPause(){

        inGame();
        screenPause.style.display = "none";
        PausePlay = true;
        requestAnimationFrame(step);
      }

      let accurate = 0;

      function endScreen() {
        const score = document.getElementById('scoreEnd');
        const accurateClick = document.getElementById('accurateEnd');
        const message = document.getElementById('messageEnd');

        screenEndGame.style.display = "flex";

        score.textContent ="Score :"+ nbrKill;
        accurate = (nbrKill/missClick)*100;
        accurateClick.textContent = `Précision :${accurate.toFixed(2)}%`

        const messages = [
          { min: 0, max: 30, text: "Tu peux pas faire pire!!" },
          { min: 30, max: 35, text: "Tu crois c bien ??!" },
          { min: 35, max: 40, text: "Va dormir stp :( !" },
          { min: 40, max: 45, text: "C’est pas fameux hein…!" },
          { min: 45, max: 50, text: "C nuuuulll nuulll" },
          { min: 50, max: 55, text: "Tu crois t chaud?!" },
          { min: 55, max: 75, text: "c'est 95 le record hein!!!" },
          { min: 75, max: Infinity, text: "t fier de toi!?" },
        ];

        const messageObj = messages.find(m => nbrKill >= m.min && nbrKill < m.max);
        message.textContent = messageObj.text;
        
      }

      function stopAll(){

          etatGame = false;
          resetGame = false; 

          startGame.style.display="inline-block";

          clearInterval(start);
          clearInterval(timerGame);

          countdown.textContent = "03";
          score.textContent="000";

          settings.style.display ="none";
          timer.style.display ="none";
          score.style.display ="none";

          screenPause.style.display = "none";
          screenEndGame.style.display = "none";
          countdown.style.display = "none";

          if(!PausePlay){
            PausePlay = true;
            requestAnimationFrame(step);
          }
          
      }
      
      const history = JSON.parse(localStorage.getItem("gameHistory")) || [];
      function addGameHistorical(){

        const date = new Date();

        const day = date.getDate();        
        const month = date.getMonth() + 1; 
        const year = date.getFullYear(); 



        console.log(history.length)
        history.push({
          score: nbrKill,
          acc: accurate,
          date: `${day}/${month}/${year}`
        });
        console.log(history.length)
        // Limite à 20 parties
        if (history.length > 10) {
          history.shift();
        }
        
        localStorage.setItem("gameHistory", JSON.stringify(history));
        historical();
        //Affichage de l'historique
      }

      const btn1 = document.getElementById('boutton1');
      const btn2 = document.getElementById('boutton2');
      let contentHistLead = true;

      function historical(){
        contentMain.innerHTML="";
        if(contentHistLead) return;
        history.forEach(m =>{

          const div = document.createElement('div');

          div.className = "block";
          div.innerHTML =`
            <span class="stat">Score : ${m.score}</span>
            <span class="stat"><img src="img/target.png" alt="target" height="32" width="32">${m.acc.toFixed(2)}%</span>
            <span class="stat">${m.date}</span>
          `
          contentMain.style.flexDirection ="column-reverse";
          contentMain.appendChild(div);
        });
      }

      //BTN Historique
      btn1.addEventListener('click', () => {

          contentHistLead = false;

          btn1.classList.remove('boutton1');
          btn1.classList.add('active');

          btn2.classList.add('boutton2');
          btn2.classList.remove('active');

          titleMain.textContent ="Votre historique";
          historical();

      });

      //BTN Classement
      btn2.addEventListener('click', () => {

          contentHistLead = true;

          btn2.classList.remove('boutton2');
          btn2.classList.add('active');

          btn1.classList.add('boutton1');
          btn1.classList.remove('active');

          titleMain.textContent ="Classement";
          contentMain.innerHTML ="";
          leaderBoard();
      });
      
      async function addNewScore(){

        const date = new Date();

        const day = date.getDate();        
        const month = date.getMonth() + 1; 
        const year = date.getFullYear(); 

        accurate = (nbrKill/missClick)*100;

        try{
          const response = await fetch("php/addScore.php",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                class_pseudo: pseudoPlayer,
                class_score: nbrKill,
                class_precision_score: accurate,
                class_date: date
                
            })
          });
          console.log(response.ok);// true ou false selon le code HTTP
          console.log(response.status);//Affiche le code HTTP

          if (!response.ok) {
            throw new Error("Erreur serveur : " + response.status);//Active le catch envoie ces donné dans le paramètre de catch
          }

          //Objet on utilise ces clé défini en php
          const result = await response.json();

          if (result.success) {
              leaderBoard();
          } else {
              alert("Erreur : " + result.message);
          }

        }catch (error) {
        console.error("Erreur lors de l'envoi :", error);
        }
      }

      async function leaderBoard(){
        try {
          const res = await fetch("php/leaderBoard.php");
          const result = await res.json();

          if (!res.ok) {
            throw new Error("Erreur serveur : " + res.status);//Active le catch envoie ces donné dans le paramètre de catch
          }

          if(result.lead){
            contentMain.innerHTML="";
            let i = 1;
            result.lead.forEach(index =>{
              const div = document.createElement('div');

              div.className ="block"

              div.innerHTML=`
                            <span class="stat"><img src="img/trophy.png" alt="trophy">${i}</span>
                            <span class="stat">${index.class_pseudo}</span>
                            <span class="stat">Score : ${index.class_score}</span>
                            <span class="stat"><img src="img/target.png" alt="target">${index.class_precision_score}%</span>
                          `
              contentMain.style.flexDirection ="column";
              contentMain.appendChild(div);
              i++;
            });
          }

        } catch (error) {
          console.log(error);
        }
      }


      startGame.addEventListener('click', () =>{ 
        startingGame();
        score.textContent = "000";
      });

    // Fonction exécutée à chaque frame pour déplacer les images
    function step(timestamp) {
      // Calcul du temps écoulé depuis la dernière frame (en secondes)
      const timeOfFrame = (timestamp - (lastTime ?? timestamp)) / 1000;
      lastTime = timestamp;

      // Boucle sur tous les éléments à déplacer
      for (const m of movers) {

        if (!m.alive) continue;
        if((m.scale < 1)){m.scale += 0.001}
        // dx et dy représentent la différence horizontale et verticale entre la position actuelle et la cible
        const dx = m.targetX - m.x;
        const dy = m.targetY - m.y;

        // Calcul de la distance entre la position actuelle et la cible
        const dist = Math.hypot(dx, dy); 

        if (dist < 5) pickNewTarget(m); // Si proche de la cible, choisir une nouvelle cible
        else {
            const move = m.speed * timeOfFrame;
            // Mise à jour de la position en tenant compte de la direction
            m.x += (dx / dist) * move;
            m.y += (dy / dist) * move;
            // Application de la nouvelle position à l'élément en le centrant
            m.el.style.transform = `translate(${m.x}px, ${m.y}px) translate(-50%, -50%) scale(${m.scale})`;
        }
      }
      if(PausePlay){
        requestAnimationFrame(step);
      }else{
        lastTime = null;
      }
    }
    requestAnimationFrame(step);
    // Animation lors du kil
}


