const heartContainer = document.getElementById('heart-container');
const femaleCharacter = document.getElementById('female-character');
const hugCharacter = document.getElementById('hug-character');
const restartButton = document.getElementById('restart-button');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');
const gameContainer = document.getElementById('game-container');
const obstacleContainer = document.getElementById('obstacle-container');

const NUM_HEARTS = 10;
const NUM_OBSTACLES = 20;
const CHARACTER_SPEED = 1.5; // Reduced speed for better control

let heartsCollected = 0;
let velocity = { x: 0, y: 0 };

// Function to create random hearts
function createHearts() {
    heartContainer.innerHTML = '';
    for (let i = 0; i < NUM_HEARTS; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.style.top = `${Math.random() * (window.innerHeight - 30)}px`;
        heart.style.left = `${Math.random() * (window.innerWidth - 30)}px`;
        heartContainer.appendChild(heart);
    }
}

// Function to create random obstacles
function createObstacles() {
    obstacleContainer.innerHTML = '';
    for (let i = 0; i < NUM_OBSTACLES; i++) {
        const obstacle = document.createElement('div');
        obstacle.className = 'obstacle';
        obstacle.style.top = `${Math.random() * (window.innerHeight - 30)}px`;
        obstacle.style.left = `${Math.random() * (window.innerWidth - 30)}px`;
        obstacleContainer.appendChild(obstacle);
    }
}

// Initialize game
function startGame() {
    document.getElementById('intro-screen').style.display = 'none';
    gameContainer.style.display = 'block';
    restartButton.style.display = 'none';
    createHearts();
    createObstacles();
    femaleCharacter.style.display = 'block'; // Ensure female character is shown
    hugCharacter.style.display = 'none';
    heartsCollected = 0;
    scoreDisplay.innerText = `Hearts Collected: ${heartsCollected}`;
    document.addEventListener('mousemove', moveCharacter);
    document.addEventListener('touchmove', touchMove);
    requestAnimationFrame(gameLoop);
}

// Move female character towards the mouse cursor
function moveCharacter(e) {
    const rect = gameContainer.getBoundingClientRect();
    const targetX = e.clientX - rect.left;
    const targetY = e.clientY - rect.top;
    const dx = targetX - (femaleCharacter.offsetLeft + femaleCharacter.offsetWidth / 2);
    const dy = targetY - (femaleCharacter.offsetTop + femaleCharacter.offsetHeight / 2);
    const angle = Math.atan2(dy, dx);

    velocity.x = CHARACTER_SPEED * Math.cos(angle);
    velocity.y = CHARACTER_SPEED * Math.sin(angle);

    // Flip character based on horizontal direction
    if (dx >= 0) {
        femaleCharacter.classList.add('facing-right');
        femaleCharacter.classList.remove('facing-left');
    } else {
        femaleCharacter.classList.add('facing-left');
        femaleCharacter.classList.remove('facing-right');
    }
}

// Move character based on touch input
function touchMove(e) {
    const touch = e.touches[0];
    const rect = gameContainer.getBoundingClientRect();
    const targetX = touch.clientX - rect.left;
    const targetY = touch.clientY - rect.top;
    const dx = targetX - (femaleCharacter.offsetLeft + femaleCharacter.offsetWidth / 2);
    const dy = targetY - (femaleCharacter.offsetTop + femaleCharacter.offsetHeight / 2);
    const angle = Math.atan2(dy, dx);

    velocity.x = CHARACTER_SPEED * Math.cos(angle);
    velocity.y = CHARACTER_SPEED * Math.sin(angle);

    // Flip character based on horizontal direction
    if (dx >= 0) {
        femaleCharacter.classList.add('facing-right');
        femaleCharacter.classList.remove('facing-left');
    } else {
        femaleCharacter.classList.add('facing-left');
        femaleCharacter.classList.remove('facing-right');
    }
}

// Game loop for smooth movement
function gameLoop() {
    // Move character
    femaleCharacter.style.left = `${femaleCharacter.offsetLeft + velocity.x}px`;
    femaleCharacter.style.top = `${femaleCharacter.offsetTop + velocity.y}px`;

    // Check for collisions
    checkCollisions();

    // Request next frame
    requestAnimationFrame(gameLoop);
}

// Check for collisions with hearts and obstacles
function checkCollisions() {
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach(heart => {
        const rect1 = femaleCharacter.getBoundingClientRect();
        const rect2 = heart.getBoundingClientRect();

        if (!(rect1.right < rect2.left ||
              rect1.left > rect2.right ||
              rect1.bottom < rect2.top ||
              rect1.top > rect2.bottom)) {
            heart.remove();
            heartsCollected++;
            scoreDisplay.innerText = `Hearts Collected: ${heartsCollected}`;

            if (heartsCollected >= NUM_HEARTS) {
                endGame();
            }
        }
    });

    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obstacle => {
        const rect1 = femaleCharacter.getBoundingClientRect();
        const rect2 = obstacle.getBoundingClientRect();

        if (!(rect1.right < rect2.left ||
              rect1.left > rect2.right ||
              rect1.bottom < rect2.top ||
              rect1.top > rect2.bottom)) {
            endGame(); // End game on obstacle collision
        }
    });
}

// End the game
function endGame() {
    document.removeEventListener('mousemove', moveCharacter);
    document.removeEventListener('touchmove', touchMove);
    femaleCharacter.style.display = 'none';
    hugCharacter.style.display = 'block';
    restartButton.style.display = 'block';
}

// Restart the game
function restartGame() {
    hugCharacter.style.display = 'none';
    startGame();
}

// Event Listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
