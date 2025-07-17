document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('.game-board');
    const players = [
        { id: 1, element: document.getElementById('player1'), position: 1 },
        { id: 2, element: document.getElementById('player2'), position: 1 }
    ];
    const dice = document.getElementById('dice');
    const rollDiceBtn = document.getElementById('roll-dice');
    const resetGameBtn = document.getElementById('reset-game');
    const currentPlayerSpan = document.getElementById('current-player');

    const boardSize = 100;
    let currentPlayerIndex = 0;
    let isRolling = false;

    const snakesAndLadders = {
        16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78,
        4: 14, 9: 31, 20: 38, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91
    };

    function createBoard() {
        for (let i = 1; i <= boardSize; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.dataset.square = i;
            square.textContent = i;
            if (snakesAndLadders[i]) {
                square.classList.add(i > snakesAndLadders[i] ? 'snake' : 'ladder');
            }
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
        if (isRolling) return;
        isRolling = true;

        const diceValue = Math.floor(Math.random() * 6) + 1;
        const rotations = {
            1: 'rotateY(0deg)',
            2: 'rotateY(-90deg)',
            3: 'rotateX(-90deg)',
            4: 'rotateX(90deg)',
            5: 'rotateY(90deg)',
            6: 'rotateY(180deg)'
        };
        dice.style.transform = `rotateX(720deg) rotateY(720deg) ${rotations[diceValue]}`;

        setTimeout(() => {
            movePlayer(diceValue);
            isRolling = false;
        }, 1500);
    }

    function movePlayer(steps) {
        const currentPlayer = players[currentPlayerIndex];
        const newPosition = currentPlayer.position + steps;

        if (newPosition <= boardSize) {
            currentPlayer.position = newPosition;
            updatePlayerPosition(currentPlayer);

            setTimeout(() => {
                const currentSquare = snakesAndLadders[currentPlayer.position];
                if (currentSquare) {
                    const isSnake = currentPlayer.position > currentSquare;
                    currentPlayer.position = currentSquare;
                    currentPlayer.element.classList.add(isSnake ? 'snake-animation' : 'ladder-animation');
                    setTimeout(() => {
                        updatePlayerPosition(currentPlayer);
                        currentPlayer.element.classList.remove('snake-animation', 'ladder-animation');
                        checkWinCondition();
                    }, 1000);
                } else {
                    checkWinCondition();
                }
            }, 500);
        } else {
            switchPlayer();
        }
    }

    function checkWinCondition() {
        const currentPlayer = players[currentPlayerIndex];
        if (currentPlayer.position === boardSize) {
            currentPlayer.element.classList.add('win-animation');
            setTimeout(() => {
                alert(`Player ${currentPlayer.id} wins!`);
                resetGame();
            }, 2000);
        } else {
            switchPlayer();
        }
    }

    function resetGame() {
        players.forEach(player => {
            player.position = 1;
            player.element.classList.remove('win-animation');
            updatePlayerPosition(player);
        });
        currentPlayerIndex = 0;
        currentPlayerSpan.textContent = players[currentPlayerIndex].id;
    }

    createBoard();
    players.forEach(updatePlayerPosition);
    rollDiceBtn.addEventListener('click', rollDice);
    resetGameBtn.addEventListener('click', resetGame);
});
