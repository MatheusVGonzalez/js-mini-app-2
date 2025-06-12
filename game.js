const gridContainer = document.querySelector('.grid-container');

// let cards = [];
// fetch('./data/cards.json')
//   .then(response => response.json())
//   .then(data => {
//     // cards = data.cards;
//     cards = [...data, ...data];;
//     shuffleCards();
//     generateCards();
//   })
//   .catch(error => console.error('Error loading cards:', error));
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


const totalPairs = cards.length / 2;

let firstCard, secondCard;
let lockBoard = false;
let stopBoard = false;
let score = 0;
let restartVar = false;
let audio = new Audio('./assets/click.mp3');
let correct = new Audio('./assets/correct.mp3');
let win = new Audio('./assets/win.mp3');



const level = document.querySelector('.level');
let currentLevel = 1;
let maxLevel = 1; 


// let logCount = 0;

// animation
let animationInterval = null; 

const dogCanvas = document.getElementById("dogCanvas");
const dogCtx = dogCanvas.getContext("2d");


const spriteIdle = new Image();
spriteIdle.src = "assets/Idle.png";

const spriteRun = new Image();
spriteRun.src = "assets/Walk.png";

const spriteHurt = new Image();
spriteHurt.src = "assets/Hurt.png";

const spriteDeath = new Image();
spriteDeath.src = "assets/Death.png";

const dogFrameWidth = 48;
const dogFrameHeight = 48;


const lifeCanvas = document.getElementById("lifeCanvas");
const lifeCtx = lifeCanvas.getContext("2d");

const lifeSprite = new Image();
lifeSprite.src = "./assets/life.png";

const lifeFrameCount = 6;
const lifeFrameWidth = 910;
const lifeFrameHeight = 230;

let currentLifeIndex = 0;

document.querySelector(".score").textContent = score;

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
    if (stopBoard) return;
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
        dogActivate();
        heal();
    } else {
        takeDamage();
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
    dogCanvas.style.transform = "translateX(0px) scale(1)";
    dogCanvas.style.opacity = "1";
    dogActivate();

    currentLifeIndex = 0;
    stopBoard = false;
    drawLifeBarFromSprite();

}

function getLevelFromURL() {
    const params = new URLSearchParams(window.location.search);
    const level = params.get('level') || 'easy';

    if (level === 'easy') {
        maxLevel = 1;
    } else if (level === 'medium') {
        maxLevel = 3;
    } else if (level === 'hard') {
        maxLevel = 6;
    }

    currentLevel = 1;
}


function nextLevel() {
    getLevelFromURL();

    dogCanvas.style.transform = "translateX(0px) scale(1)";
    dogCanvas.style.opacity = "1";
    document.querySelector('.home-container').style.display = 'none';
    if (currentLevel < maxLevel) {
        console.log("Next Level");
        console.log("Next Level");
        currentLevel++;
        resetBoard();
        shuffleCards();
        gridContainer.innerHTML = '';
        generateCards();
        dogActivate();
    } else {
        winGame();
        
    }
}




function winGame(){    
    const parsedScore = parseInt(score, 10);
    const parsedTotal = parseInt(totalPairs, 10);
    if (parsedScore === parsedTotal) {
        showDogHouseAndAnimate();
        console.log("You win!");
    }
}

// function addGameLogEntry(message) {
//   logCount++;
//   const logBox = document.getElementById('game-log');
//   const newLog = document.createElement('div');
//   newLog.textContent = `${String(logCount).padStart(2, '0')} - ${message}`;
//   logBox.appendChild(newLog);
// }


function dogActivate() {
    let currentFrame = 0;
    let totalFrames = 4;
    let frameDelay = 120;

    if (score === 1) {
        totalFrames = 6;
        frameDelay = 170;
    } else if (score === 2) {
        totalFrames = 6;
        frameDelay = 150;
    } else if (score === 3) {
        totalFrames = 6;
        frameDelay = 130;
    } else if (score === 4) {
        totalFrames = 6;
        frameDelay = 110;
    } else if (score === 5) {
        totalFrames = 6;
        frameDelay = 90;
    } else if (score === 6) {
        totalFrames = 6;
        frameDelay = 70;
    }

    clearInterval(animationInterval);
    dogCanvas.width = dogFrameWidth * 5;
    dogCanvas.height = dogFrameHeight * 6;
    dogCtx.setTransform(1, 0, 0, 1, 0, 0);
    dogCtx.scale(5, 5);

    animationInterval = setInterval(() => {
        dogCtx.clearRect(0, 0, dogCanvas.width, dogCanvas.height);
        dogCtx.drawImage(
            score == 0 ? spriteIdle : spriteRun,
            currentFrame * dogFrameWidth, 0,
            dogFrameWidth, dogFrameHeight,
            0, 0,
            dogFrameWidth, dogFrameHeight
        );
        currentFrame = (currentFrame + 1) % totalFrames;
    }, frameDelay);
}

spriteIdle.onload = dogActivate;


function showDogHouseAndAnimate() {
  const homeContainer = document.querySelector('.home-container');

  homeContainer.style.display = 'block';

  dogCanvas.style.transition = 'transform 2s ease, opacity 2s ease';
  dogCanvas.style.transform = 'translateX(80px) scale(0.2)';
  dogCanvas.style.opacity = '0';

  setTimeout(() => {
    clearInterval(animationInterval);
    dogCtx.clearRect(0, 0, dogCanvas.width, dogCanvas.height);
  }, 2000);
}

function drawLifeBarFromSprite() {
    lifeCtx.clearRect(0, 0, lifeCanvas.width, lifeCanvas.height);

    lifeCtx.drawImage(
        lifeSprite,
        0, currentLifeIndex * lifeFrameHeight,  // Y축 기준으로 자르기
        lifeFrameWidth, lifeFrameHeight,
        0, 0,
        lifeFrameWidth, lifeFrameHeight
    );
}

function takeDamage() {
    // hit
    hurt();

    // life bar
    if (currentLifeIndex < lifeFrameCount - 1) {
        currentLifeIndex++;
        drawLifeBarFromSprite();
    }

    
    // if currentLifeIndex == 4 -> die
    if (currentLifeIndex === 4) {;
        death();
        return;
    }

    // again activate after 1 second
    setTimeout(() => {
        dogActivate();
    }, 1000);

}

lifeSprite.onload = drawLifeBarFromSprite;

function hurt() {
    let currentFrame = 0;
    let totalFrames = 2;
    let frameDelay = 120;

    clearInterval(animationInterval);
    dogCanvas.width = dogFrameWidth * 5;
    dogCanvas.height = dogFrameHeight * 6;
    dogCtx.setTransform(1, 0, 0, 1, 0, 0);
    dogCtx.scale(5, 5);

    animationInterval = setInterval(() => {
        dogCtx.clearRect(0, 0, dogCanvas.width, dogCanvas.height);
        dogCtx.drawImage(
            spriteHurt,
            currentFrame * dogFrameWidth, 0,
            dogFrameWidth, dogFrameHeight,
            0, 0,
            dogFrameWidth, dogFrameHeight
        );
        currentFrame = (currentFrame + 1) % totalFrames;
    }, frameDelay);
}

function heal() {
    if (currentLifeIndex > 0) {
        currentLifeIndex--;
        drawLifeBarFromSprite();
    }
}

function death() {
    stopBoard = true;

    let currentFrame = 0;
    let totalFrames = 4;
    let frameDelay = 120;

    clearInterval(animationInterval);
    dogCanvas.width = dogFrameWidth * 5;
    dogCanvas.height = dogFrameHeight * 6;
    dogCtx.setTransform(1, 0, 0, 1, 0, 0);
    dogCtx.scale(5, 5);

    let deathAnimation = () => {
        if (currentFrame < totalFrames) {
            dogCtx.clearRect(0, 0, dogCanvas.width, dogCanvas.height);
            dogCtx.drawImage(
                spriteDeath,
                currentFrame * dogFrameWidth, 0,
                dogFrameWidth, dogFrameHeight,
                0, 0,
                dogFrameWidth, dogFrameHeight
            );
            currentFrame++;
            setTimeout(deathAnimation, frameDelay);
        }
    };
    deathAnimation();
}
