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