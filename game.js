const gridContainer = document.querySelector('.grid-container');
let cards = [
    {
        "image": "./assets/apple.png",
        "name": "apple"
        // health
    },
    {
        "image": "./assets/apple.png",
        "name": "apple"
        //not health
    },
    {
        "image": "./assets/burger.png",
        "name": "burger"
    },
    {
        "image": "./assets/burger.png",
        "name": "burger"
    },
    {
        "image": "./assets/carrots.png",
        "name": "carrots"
    },
    {
        "image": "./assets/carrots.png",
        "name": "carrots"
    },
    {
        "image": "./assets/chocolate-bar.png",
        "name": "chocolate"
    },
    {
        "image": "./assets/chocolate-bar.png",
        "name": "chocolate"
    },
    {
        "image": "./assets/french-fries.png",
        "name": "french fries"
    },
    {
        "image": "./assets/french-fries.png",
        "name": "french fries"
    },
    {
        "image": "./assets/pizza.png",
        "name": "pizza"
    },
    {
        "image": "./assets/pizza.png",
        "name": "pizza"
    }
]
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let restartVar = false;
let audio = new Audio('./assets/click.mp3');
let correct = new Audio('./assets/correct.mp3');
let win = new Audio('./assets/win.mp3');

const canvas = document.getElementById("dogCanvas");
const ctx = canvas.getContext("2d");

const sprite = new Image();
sprite.src = "assets/Idle.png"; 

const frameWidth = 48;
const frameHeight = 48;
const totalFrames = 4;

let currentFrame = 0;
let x = 0;
let frameDelay = 100; 



document.querySelector(".score").textContent = score;

// fetch('./data/cards.json')
//   .then(response => response.json())
//   .then(data => {
//     // cards = data.cards;
//     cards = [...data, ...data];;
//     shuffleCards();
//     generateCards();
//   })
//   .catch(error => console.error('Error loading cards:', error));


function shuffleCards() {
    let currentIndex = cards.length, randomIndex, temporaryValue;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = cards[currentIndex];
        cards[currentIndex] = cards[randomIndex];
        cards[randomIndex] = temporaryValue;
    }
}

function generateCards() {
    for (let card of cards) {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('data-name', card.name);
        cardElement.innerHTML = `
            <div class="front">
                <img class="front-image" src=${card.image} alt=${card.name}>
            </div>
            <div class="back"></div>
        `;
        gridContainer.appendChild(cardElement);
        cardElement.addEventListener('click', flipCard);
    }
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;
    audio.play();
    this.classList.add('flipped');
    
    if (!firstCard) {
        firstCard = this;
        return;
    }
    secondCard = this;

    checkForMatch();
    winGame();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? disableCards() : unflipCards();
    if (isMatch) {
        correct.play();
    } 

}

function disableCards() {
    score++;
    document.querySelector(".score").textContent = score;
    lockBoard = true;

    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        
        resetBoard();
    }, 500);
}

function resetBoard() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

function restart() {
    restartVar = true;
    resetBoard();
    shuffleCards();
    score = 0;
    document.querySelector(".score").textContent = score;
    gridContainer.innerHTML = '';
    generateCards();
}
// Jessie's part
let countdown;

const params = new URLSearchParams(window.location.search);
const level = params.get("level");

const levelTimes = {
  easy: 60,
  medium: 35,
  hard: 20
};

const timeInSeconds = levelTimes[level] || 30; 

function startTimer(seconds) {
  if(restartVar == true){
  clearInterval(countdown);
  const timerDisplay = document.getElementById("timer");
  const end = Date.now() + seconds * 1000;

  updateDisplay(seconds);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((end - Date.now()) / 1000);
    if (secondsLeft <= 0) {
      clearInterval(countdown);
      timerDisplay.textContent = "Time's up!";
      restart();
      disablePointer();
      addGameLogEntry("Lose - " + level + " level");
      return;
    }
    updateDisplay(secondsLeft);
  }, 1000);
  }
}

function updateDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${remainderSeconds < 10 ? "0" : ""}${remainderSeconds}`;
  document.getElementById("timer").textContent = display;
}

startTimer(timeInSeconds);

function disablePointer() { //just to disable pointer events on cards - Matheus
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.pointerEvents = 'none';
    });
}


function winGame(){
    if (score === cards.length / 2) {
        clearInterval(countdown);
        addGameLogEntry("Win - "+ level + " level");
        disablePointer();
        win.play();
    }
}

let logCount = 0;

function addGameLogEntry(message) {
  logCount++;
  const logBox = document.getElementById('game-log');
  const newLog = document.createElement('div');
  newLog.textContent = `${String(logCount).padStart(2, '0')} - ${message}`;
  logBox.appendChild(newLog);
}

sprite.onload = () => {
    canvas.width = frameWidth * 5;
    canvas.height = frameHeight * 5;
    ctx.scale(5, 5); 
    setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(
        sprite,
        currentFrame * frameWidth, 0,         
        frameWidth, frameHeight,              
        0, 0,                                 
        frameWidth, frameHeight               
        );

        currentFrame = (currentFrame + 1) % totalFrames;
    }, frameDelay);
};
