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
        "name": "fries"
    },
    {
        "image": "./assets/french-fries.png",
        "name": "fries"
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
const totalPairs = cards.length / 2;

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
}

function checkForMatch() {
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;

    isMatch ? disableCards() : unflipCards();
    if (isMatch) {
        correct.play();
        if(score === 1){
            runDog();
        }
        if(score === 2){
            runDog2();
        }
        if(score === 3){
            runDog3();
        }
        if(score === 4){
            runDog4();
        }
        if(score === 5){
            runDog5();
        }
        if(score === 6){
            runDog6();
        }
    } 

}

function disableCards() {
    score++;
    document.querySelector(".score").textContent = score;
    lockBoard = true;

    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    resetBoard();

        setTimeout(() => {
        winGame();
    }, 500);

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
    document.querySelector('.home-container').style.display = 'none';
    startIdleAnimation();

}


function winGame(){    
    const parsedScore = parseInt(score, 10);
    const parsedTotal = parseInt(totalPairs, 10);
    if (parsedScore === parsedTotal) {
        showDogHouseAndAnimate();
        console.log("You win!");
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

let animationInterval = null; 

const canvas = document.getElementById("dogCanvas");
const ctx = canvas.getContext("2d");

const spriteIdle = new Image();
spriteIdle.src = "assets/Idle.png";

const spriteRun = new Image();
spriteRun.src = "assets/Walk.png";

const frameWidth = 48;
const frameHeight = 48;

function startIdleAnimation() {
    let currentFrame = 0;
    let totalFrames = 4;
    let frameDelay = 120;

    clearInterval(animationInterval);
    canvas.width = frameWidth * 5;
    canvas.height = frameHeight * 6;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(5, 5);

    animationInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
            spriteIdle,
            currentFrame * frameWidth, 0,
            frameWidth, frameHeight,
            0, 0,
            frameWidth, frameHeight
        );
        currentFrame = (currentFrame + 1) % totalFrames;
    }, frameDelay);
}

function runDog() {
    let currentFrame = 0;
    let totalFrames = 6;
    let frameDelay = 170;

    clearInterval(animationInterval);
    canvas.width = frameWidth * 5;
    canvas.height = frameHeight * 5;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(5, 5);

    animationInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
            spriteRun,
            currentFrame * frameWidth, 0,
            frameWidth, frameHeight,
            0, 0,
            frameWidth, frameHeight
        );
        currentFrame = (currentFrame + 1) % totalFrames;
    }, frameDelay);
}

function runDog2() {
    let currentFrame = 0;
    let totalFrames = 6;
    let frameDelay = 150;

    clearInterval(animationInterval);
    canvas.width = frameWidth * 5;
    canvas.height = frameHeight * 5;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(5, 5);

    animationInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
            spriteRun,
            currentFrame * frameWidth, 0,
            frameWidth, frameHeight,
            0, 0,
            frameWidth, frameHeight
        );
        currentFrame = (currentFrame + 1) % totalFrames;
    }, frameDelay);
}

function runDog3() {
    let currentFrame = 0;
    let totalFrames = 6;
    let frameDelay = 130;

    clearInterval(animationInterval);
    canvas.width = frameWidth * 5;
    canvas.height = frameHeight * 5;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(5, 5);

    animationInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
            spriteRun,
            currentFrame * frameWidth, 0,
            frameWidth, frameHeight,
            0, 0,
            frameWidth, frameHeight
        );
        currentFrame = (currentFrame + 1) % totalFrames;
    }, frameDelay);
}

function runDog4() {
    let currentFrame = 0;
    let totalFrames = 6;
    let frameDelay = 110;

    clearInterval(animationInterval);
    canvas.width = frameWidth * 5;
    canvas.height = frameHeight * 5;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(5, 5);

    animationInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
            spriteRun,
            currentFrame * frameWidth, 0,
            frameWidth, frameHeight,
            0, 0,
            frameWidth, frameHeight
        );
        currentFrame = (currentFrame + 1) % totalFrames;
    }, frameDelay);
}

function runDog5() {
    let currentFrame = 0;
    let totalFrames = 6;
    let frameDelay = 90;

    clearInterval(animationInterval);
    canvas.width = frameWidth * 5;
    canvas.height = frameHeight * 5;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(5, 5);

    animationInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
            spriteRun,
            currentFrame * frameWidth, 0,
            frameWidth, frameHeight,
            0, 0,
            frameWidth, frameHeight
        );
        currentFrame = (currentFrame + 1) % totalFrames;
    }, frameDelay);
}

function runDog6() {
    let currentFrame = 0;
    let totalFrames = 6;
    let frameDelay = 70;

    clearInterval(animationInterval);
    canvas.width = frameWidth * 5;
    canvas.height = frameHeight * 5;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(5, 5);

    animationInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
            spriteRun,
            currentFrame * frameWidth, 0,
            frameWidth, frameHeight,
            0, 0,
            frameWidth, frameHeight
        );
        currentFrame = (currentFrame + 1) % totalFrames;
    }, frameDelay);
}

spriteIdle.onload = startIdleAnimation;


function showDogHouseAndAnimate() {
  const homeContainer = document.querySelector('.home-container');
  const canvas = document.getElementById("dogCanvas");

  homeContainer.style.display = 'block';

  canvas.style.transition = 'transform 2s ease, opacity 2s ease';
  canvas.style.transform = 'translateX(80px) scale(0.2)';
  canvas.style.opacity = '0';

  setTimeout(() => {
    clearInterval(animationInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 2000);
}

