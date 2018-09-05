class GameModel {
    constructor() {
        this.isPlayed = false;
        this.colors = [];
        this.comparedElements = [];
    }

    setSquaresAmount(squaresAmount) { this.squaresAmount = squaresAmount; }

    setGameMode(gameMode) { this.gameMode = gameMode; }

    setTimeMode(timeMode) { this.timeMode = timeMode; }

    setCounter() { this.counter = this.squaresAmount / 2; }

    resetTimer() { this.timer = 0; }

    updateTimer() { this.timer ++; }

    pickColor() {
        return `rgb(${Math.floor(Math.random()*16) * 16}, ${Math.floor(Math.random()*16) * 16}, ${Math.floor(Math.random()*16) * 16})`;
    }

    setColors(num) {
        for (let i = 0; i < num/2; i ++) {
            this.colors.push(this.pickColor());
            this.colors.push(this.colors[i*2]);
        };
    }
}

class GameView {
    constructor() {
        this.elements = {
            message: document.querySelector('.header__message'),
            timer: document.querySelector('.header__timer span'),
            squares: document.querySelector('.squares'),
            start: document.querySelector('.btn--start'),
        }
    }

    getSquaresAmount() { return 6; }

    getGameMode() { return 'colors'; }

    getTimeMode() { return 'normal'; }

    renderSquare(id) {
        const markup = `
            <div class="square" id="square-${id}" >
                <div class="square__side square__side--front"></div>
                <div class="square__side square__side--back"></div>
            </div>
        `;
        document.querySelector('.squares').insertAdjacentHTML('beforeend', markup);
        return document.querySelector('.squares').lastElementChild;
    }

    colorSquare(square, colors) {
        const index = Math.floor(Math.random()*(colors.length - 1));
        square.children[1].style.backgroundColor = colors[index];
        colors.splice(index, 1);
    }

    renderSquares(num, colors) {
        for (let i = 0; i < num; i ++) {
            const square = this.renderSquare(i+1);
            this.colorSquare(square, colors)
        };
    }

    clearSquares() { document.querySelector('.squares').innerHTML = ''; }
    
    displayMessage(type) {
        type === 'win' ? this.elements.message.innerHTML = 'Congrats. You won' : this.elements.message.innerHTML = 'You lost. Try again';
    }

    clearMessage() { this.elements.message.innerHTML = ''; }

    displayTimer(time) { this.elements.timer.innerHTML = time; }

    clearTimer() { this.elements.timer.innerHTML = 0; }
};

const gameModel = new GameModel();
const gameView = new GameView();

// Starting the game

const runTime = () => {
    let intervalID = setInterval(() => {
        gameModel.updateTimer();
        gameView.displayTimer(gameModel.timer);
        if (!gameModel.isPlayed) clearInterval(intervalID);
    }, 1000);
}

gameView.elements.start.addEventListener('click', e => {
    gameView.clearSquares();
    gameView.clearMessage();
    gameView.clearTimer();
    gameModel.resetTimer();
    gameModel.setSquaresAmount(gameView.getSquaresAmount());
    gameModel.setColors(gameModel.squaresAmount);
    gameView.renderSquares(gameModel.squaresAmount, gameModel.colors);
    const squaresSide = document.querySelectorAll('.square__side--back');
    gameModel.setColors(Array.from(squaresSide), gameModel.colors);
    gameModel.setCounter();
    gameModel.isPlayed = true;
    runTime();
});

// Handling clicking on squares

gameView.elements.squares.addEventListener('click', e => {
    if(gameModel.isPlayed) {
        const square = e.target.closest('.square');
        if(square) {
            if (gameModel.comparedElements.length < 2 && !square.classList.contains('active')) {
                square.classList.add('active');
                square.children[0].style.transform = 'rotateY(180deg)';
                square.children[1].style.transform = 'rotateY(0)';
                gameModel.comparedElements.push(square);
            }
            setTimeout(()=> {
                if (gameModel.comparedElements.length === 2) {
                    if (gameModel.comparedElements[0].children[1].style.backgroundColor === gameModel.comparedElements[1].children[1].style.backgroundColor) {
                        gameModel.comparedElements[0].style.visibility = 'hidden';
                        gameModel.comparedElements[1].style.visibility = 'hidden';
                        gameModel.counter --;
                    } else {
                        gameModel.comparedElements[0].children[0].style.transform = 'rotateY(0)';
                        gameModel.comparedElements[0].children[1].style.transform = 'rotateY(180deg)';
                        gameModel.comparedElements[0].classList.remove('active');
                        gameModel.comparedElements[1].children[0].style.transform = 'rotateY(0)';
                        gameModel.comparedElements[1].children[1].style.transform = 'rotateY(180deg)';
                        gameModel.comparedElements[1].classList.remove('active');
                    }
                    gameModel.comparedElements.splice(0, 2);
                    if (gameModel.counter === 0) {
                        gameModel.isPlayed = false;
                        gameView.displayMessage('win');
                    }
                }
            }, 1000);
        }
        
    }
});