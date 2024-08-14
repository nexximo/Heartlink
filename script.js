const heartContainer = document.getElementById('heart-container');
const femaleCharacter = document.getElementById('female-character');
const hugCharacter = document.getElementById('hug-character');
const restartButton = document.getElementById('restart-button');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');
const gameContainer = document.getElementById('game-container');
const obstacleContainer = document.getElementById('obstacle-container');

const NUM_HEARTS = 10;
const MIN_OBSTACLES = 3; // Minimum number of obstacles
const MAX_OBSTACLES = 5; // Maximum number of obstacles
const CHARACTER_SPEED = 1.5; // Adjusted speed for better control
const INITIAL_LIVES = 3;
const HEART_SIZE = 30; // Size of heart element
const OBSTACLE_SIZE = 30; // Size of obstacle element
const MIN_DISTANCE = 50; // Minimum distance between hearts and obstacles

let heartsCollected = 0;
let lives = INITIAL_LIVES;
let velocity = { x: 0, y: 0 };
let lastHeartPosition = { top: '0px', left: '0px' };

// Function to create random hearts
function createHearts() {
    heartContainer.innerHTML = '';
    let positions = [];

    while (positions.length < NUM_HEARTS) {
        const top = Math.random() * (window.innerHeight - HEART_SIZE) + 'px';
        const left = Math.random() * (window.innerWidth - HEART_SIZE) + 'px';

        let overlap = false;
        for (const pos of positions) {
            const dx = parseInt(left) - parseInt(pos.left);
            const dy = parseInt(top) - parseInt(pos.top);
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < MIN_DISTANCE) {
                overlap = true;
                break;
            }
        }

        if (!overlap) {
            positions.push({ top, left });
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.style.top = top;
            heart.style.left = left;
            heartContainer.appendChild(heart);
        }
    }
}

// Function to create random obstacles
function createObstacles() {
    obstacleContainer.innerHTML = '';
    let positions = [];
    const numObstacles = Math.floor(Math.random() * (MAX_OBSTACLES - MIN_OBSTACLES + 1)) + MIN_OBSTACLES;

    while (positions.length < numObstacles) {
        const top = Math.random() * (window.innerHeight - OBSTACLE_SIZE) + 'px';
        const left = Math.random() * (window.innerWidth - OBSTACLE_SIZE) + 'px';

        let overlap = false;
        for (const pos of positions) {
            const dx = parseInt(left) - parseInt(pos.left);
            const dy = parseInt(top) - parseInt(pos.top);
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < MIN_DISTANCE) {
                overlap = true;
                break;
            }
        }

        if (!overlap && !isNearStartingPosition(left, top)) {
            positions.push({ top, left });
            const obstacle = document.createElement('div');
            obstacle.className = 'obstacle';
            obstacle.style.top = top;
            obstacle.style.left = left;
            obstacle.style.backgroundImage = 'url("christmas-tree2.gif")'; // Obstacle image
            obstacleContainer.appendChild(obstacle);
        }
    }
}

// Helper function to check proximity to the starting position
function isNearStartingPosition(left, top) {
    return Math.abs(parseInt(left)) < MIN_DISTANCE && Math.abs(parseInt(top)) < MIN_DISTANCE;
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
    lives = INITIAL_LIVES;
    velocity = { x: 0, y: 0 }; // Reset velocity
    scoreDisplay.innerText = `Hearts Collected: ${heartsCollected} | Lives: ${lives}`;
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
    if (dx < 0) { // Flip logic adjusted
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
    if (dx < 0) { // Flip logic adjusted
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
            lastHeartPosition.top = heart.style.top;
            lastHeartPosition.left = heart.style.left;
            heart.remove();
            heartsCollected++;
            scoreDisplay.innerText = `Hearts Collected: ${heartsCollected} | Lives: ${lives}`;

            if (heartsCollected >= NUM_HEARTS) {
                endGame(true); // Pass true to indicate success
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
            // Collision detected
            if (lives > 0) {
                lives--; // Decrement lives only if greater than 0
                scoreDisplay.innerText = `Hearts Collected: ${heartsCollected} | Lives: ${lives}`;

                if (lives <= 0) {
                    endGame(false); // Pass false to indicate game over
                }
            }
        }
    });
}

// End the game
function endGame(success) {
    document.removeEventListener('mousemove', moveCharacter);
    document.removeEventListener('touchmove', touchMove);
    femaleCharacter.style.display = 'none';

    if (success) {
        hugCharacter.style.display = 'block';
        // Place hug character at the last heart position
        hugCharacter.style.top = lastHeartPosition.top;
        hugCharacter.style.left = lastHeartPosition.left;
    } else {
        hugCharacter.style.display = 'none';
    }

    restartButton.style.display = 'block';
}

// Restart the game
function restartGame() {
    hugCharacter.style.display = 'none';
    velocity = { x: 0, y: 0 }; // Ensure velocity is reset
    startGame();
}

// Event Listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
