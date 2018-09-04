const message = document.querySelector('.header__message');
const timer = document.querySelector('.header__timer span');
const squares = document.querySelector('.squares');
const start = document.querySelector('.btn--start');

console.log(timer.innerHTML);

class Game {
    constructor() {
        this.isPlayed = false;
        this.colors = [];
        this.comparedColors = [];
    }

    setSquaresAmount(squaresAmount) {
        this.squaresAmount = squaresAmount;
    }

    setGameMode(gameMode) {
        this.gameMode = gameMode;
    }

    setTimeMode(timeMode) {
        this.timeMode = timeMode;
    }

    setCounter() {
        this.counter = this.squaresAmount / 2;
    }

    resetTimer() {
        this.timer = 0;
    }

    runTime() {
        let intervalID = setInterval(() => {
            game.timer = game.timer + 1;
            if (!game.isPlayed) clearInterval(intervalID);
        }, 1000);
    }

    pickColors(num) {
        for (let i = 0; i < num/2; i ++) {
            const red = Math.floor(Math.random()*16) * 16;
            const green = Math.floor(Math.random()*16) * 16;
            const blue = Math.floor(Math.random()*16) * 16;
            this.colors.push(`rgb(${red}, ${green}, ${blue})`);
            this.colors.push(`rgb(${red}, ${green}, ${blue})`);
        }
    }

    setColors(squares, colors) {
        squares.forEach(el => {
            const index = Math.floor(Math.random()*(colors.length - 1));
            el.style.backgroundColor = colors[index];
            colors.splice(index, 1);
        });
    }
}

const gameView = {
    getSquaresAmount() { return 6; },
    getGameMode() { return 'colors' },
    getTimeMode() { return 'normal'},
    renderSquare(id) {
        const markup = `
            <div class="square" id="square-${id}" >
                <div class="square__side square__side--front"></div>
                <div class="square__side square__side--back"></div>
            </div>
        `;
        document.querySelector('.squares').insertAdjacentHTML('beforeend', markup);
    },
    renderSquares(num) {
        for (let i = 0; i < num; i ++) {
            this.renderSquare(i+1);
        }
    },
    clearSquares() {
        document.querySelector('.squares').innerHTML = '';
    },
    displayMessage(type) {
        type === 'win' ? message.innerHTML = 'Congrats. You won' : message.innerHTML = 'You lost. Try again';
    },
    clearMessage() {
        message.innerHTML = '';
    },
    displayTimer() {
        let intervalID = setInterval(() => {
            timer.innerHTML = game.timer;
            console.log(game.isPlayed);
            if (!game.isPlayed) clearInterval(intervalID);
        }, 1000);
    },
    clearTimer() {
        timer.innerHTML = 0;
    }
};

const game = new Game();

// Starting the game

start.addEventListener('click', e => {
    gameView.clearSquares();
    gameView.clearMessage();
    gameView.clearTimer();
    game.resetTimer();
    game.setSquaresAmount(gameView.getSquaresAmount());
    game.pickColors(game.squaresAmount);
    gameView.renderSquares(game.squaresAmount);
    const squaresSide = document.querySelectorAll('.square__side--back');
    game.setColors(Array.from(squaresSide), game.colors);
    game.setCounter();
    game.isPlayed = true;
    game.runTime();
    gameView.displayTimer();
});

// Handling clicking on squares

squares.addEventListener('click', e => {
    if(game.isPlayed) {
        const square = e.target.closest('.square');
        if (game.comparedColors.length < 2 && !square.classList.contains('active')) {
            square.classList.add('active');
            square.children[0].style.transform = 'rotateY(180deg)';
            square.children[1].style.transform = 'rotateY(0)';
            game.comparedColors.push(square);
        }
        setTimeout(()=> {
            if (game.comparedColors.length === 2) {
                if (game.comparedColors[0].children[1].style.backgroundColor === game.comparedColors[1].children[1].style.backgroundColor) {
                    game.comparedColors[0].style.visibility = 'hidden';
                    game.comparedColors[1].style.visibility = 'hidden';
                    game.counter --;
                } else {
                    game.comparedColors[0].children[0].style.transform = 'rotateY(0)';
                    game.comparedColors[0].children[1].style.transform = 'rotateY(180deg)';
                    game.comparedColors[0].classList.remove('active');
                    game.comparedColors[1].children[0].style.transform = 'rotateY(0)';
                    game.comparedColors[1].children[1].style.transform = 'rotateY(180deg)';
                    game.comparedColors[1].classList.remove('active');
                }
                game.comparedColors.splice(0, 2);
                if (game.counter === 0) {
                    game.isPlayed = false;
                    gameView.displayMessage('win');
                }
            }
        }, 1000);

        
    }
});