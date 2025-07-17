document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('.game-board');
    const player1 = document.getElementById('player1');
    const player2 = document.getElementById('player2');
    const dice = document.getElementById('dice');
    const rollDiceBtn = document.getElementById('roll-dice');
    const currentPlayerSpan = document.getElementById('current-player');
    const resetGameBtn = document.getElementById('reset-game');

    const boardSize = 100;
    const players = [
        { id: 1, element: player1, position: 1 },
        { id: 2, element: player2, position: 1 }
    ];
    let currentPlayerIndex = 0;

    const snakesAndLadders = {
        16: 6,
        47: 26,
        49: 11,
        56: 53,
        62: 19,
        64: 60,
        87: 24,
        93: 73,
        95: 75,
        98: 78,
        4: 14,
        9: 31,
        20: 38,
        28: 84,
        40: 59,
        51: 67,
        63: 81,
        71: 91
    };

    function createBoard() {
        for (let i = 1; i <= boardSize; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.dataset.square = i;
            square.textContent = i;
            board.appendChild(square);
        }
    }

    function updatePlayerPosition(player) {
        const square = document.querySelector(`[data-square="${player.position}"]`);
        const squareRect = square.getBoundingClientRect();
        const boardRect = board.getBoundingClientRect();
        player.element.style.top = `${squareRect.top - boardRect.top}px`;
        player.element.style.left = `${squareRect.left - boardRect.left}px`;
    }

    function switchPlayer() {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        currentPlayerSpan.textContent = players[currentPlayerIndex].id;
    }

    function rollDice() {
        dice.style.animation = 'none';
        void dice.offsetWidth; // Trigger reflow
        dice.style.animation = 'roll 0.5s ease';

        const diceValue = Math.floor(Math.random() * 6) + 1;
        dice.textContent = diceValue;
        movePlayer(diceValue);
    }

    function movePlayer(steps) {
        const currentPlayer = players[currentPlayerIndex];
        currentPlayer.position += steps;

        if (snakesAndLadders[currentPlayer.position]) {
            const isSnake = currentPlayer.position > snakesAndLadders[currentPlayer.position];
            currentPlayer.position = snakesAndLadders[currentPlayer.position];
            if (isSnake) {
                currentPlayer.element.classList.add('snake-animation');
            } else {
                currentPlayer.element.classList.add('ladder-animation');
            }
        }

        if (currentPlayer.position > boardSize) {
            currentPlayer.position = boardSize;
        }

        updatePlayerPosition(currentPlayer);

        if (currentPlayer.position === boardSize) {
            currentPlayer.element.classList.add('victory');
            setTimeout(() => {
                alert(`Player ${currentPlayer.id} wins!`);
                resetGame();
            }, 2000);
        } else {
            switchPlayer();
        }

        setTimeout(() => {
            currentPlayer.element.classList.remove('snake-animation', 'ladder-animation');
        }, 1000);
    }

    function resetGame() {
        players.forEach(player => {
            player.position = 1;
            player.element.classList.remove('victory');
            updatePlayerPosition(player);
        });
        currentPlayerIndex = 0;
        currentPlayerSpan.textContent = players[currentPlayerIndex].id;
    }

    createBoard();
    resetGame();

    rollDiceBtn.addEventListener('click', rollDice);
    resetGameBtn.addEventListener('click', resetGame);
});
