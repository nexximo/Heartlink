const heartContainer = document.getElementById('heart-container');
const femaleCharacter = document.getElementById('female-character');
const hugCharacter = document.getElementById('hug-character');
const restartButton = document.getElementById('restart-button');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');
const gameContainer = document.getElementById('game-container');

const heartPositions = [
    { top: '100px', left: '200px' },
    { top: '200px', left: '300px' },
    { top: '300px', left: '400px' },
    { top: '400px', left: '500px' },
    { top: '500px', left: '600px' },
    { top: '600px', left: '700px' },
    { top: '700px', left: '800px' },
    { top: '800px', left: '900px' },
    { top: '900px', left: '1000px' },
    { top: '1000px', left: '1100px' }
];

let heartsCollected = 0;
let velocity = { x: 0, y: 0 };

// Function to create hearts
function createHearts() {
    heartContainer.innerHTML = '';
    heartPositions.forEach(pos => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.style.top = pos.top;
        heart.style.left = pos.left;
        heartContainer.appendChild(heart);
    });
}

// Initialize game
function startGame() {
    document.getElementById('intro-screen').style.display = 'none';
    gameContainer.style.display = 'block';
    restartButton.style.display = 'none';
    createHearts();
    femaleCharacter.style.display = 'block'; // Ensure female character is shown
    hugCharacter.style.display = 'none';
    heartsCollected = 0;
    scoreDisplay.innerText = `Hearts Collected: ${heartsCollected}`;
    document.addEventListener('mousemove', moveCharacter);
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
    const speed = 2;

    // Update velocity
    velocity.x = speed * Math.cos(angle);
    velocity.y = speed * Math.sin(angle);

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

// Check for collisions with hearts
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

            if (heartsCollected >= 10) {
                endGame();
            }
        }
    });
}

// End the game
function endGame() {
    document.removeEventListener('mousemove', moveCharacter);
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
