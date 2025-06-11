const canvas = document.getElementById("dogCanvas");
const ctx = canvas.getContext("2d");

const sprite = new Image();
sprite.src = "assets/Walk.png"; 

const frameWidth = 48;
const frameHeight = 48;
const totalFrames = 6;

let currentFrame = 0;
let x = 0;
let frameDelay = 100; 

sprite.onload = () => {
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