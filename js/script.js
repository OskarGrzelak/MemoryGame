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
            squares: document.querySelector('.squares')
        }
    }

    getSquaresAmount() { return 18; }

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

    rotateSquare(square, status) {
        // if status is equal to 1 then turn square to its backside
        status === 1 ? square.classList.add('active') : square.classList.remove('active');
        square.children[`${1 - status}`].style.transform = 'rotateY(180deg)';
        square.children[`${0 + status}`].style.transform = 'rotateY(0)';
    }

    hideSquare(square) { square.style.visibility = 'hidden'; }

    clearSquares() { document.querySelector('.squares').innerHTML = ''; }
    
    displayMessage(type) {
        type === 'win' ? this.elements.message.innerHTML = 'Congrats. You won' : this.elements.message.innerHTML = 'You lost. Try again';
    }

    clearMessage() { this.elements.message.innerHTML = ''; }

    displayTimer(time) { this.elements.timer.innerHTML = time; }

    clearTimer() { this.elements.timer.innerHTML = 0; }
};

class GameController {
    constructor(model, view) {
        this.gameModel = model;
        this.gameView = view;
    }

    resetGame() {
        this.gameView.clearSquares();
        this.gameView.clearMessage();
        this.gameView.clearTimer();
        this.gameModel.resetTimer();
        this.gameView.displayTimer(this.gameModel.timer);
    }

    displayUI() {
        this.gameModel.setSquaresAmount(this.gameView.getSquaresAmount());
        this.gameModel.setColors(this.gameModel.squaresAmount);
        this.gameView.renderSquares(this.gameModel.squaresAmount, this.gameModel.colors);
    }

    runTime() {
        let intervalID = setInterval(() => {
            this.gameModel.updateTimer();
            this.gameView.displayTimer(this.gameModel.timer);
            if (!this.gameModel.isPlayed) clearInterval(intervalID);
        }, 1000);
    }

    startGame() {
        this.gameModel.isPlayed = true;
        this.gameModel.setCounter();
        this.runTime();
    }

    initGame() {
        this.resetGame();
        this.displayUI();
        this.startGame();
    }

    compareSquares(squares) {
        setTimeout(()=> {
            if (squares[0].children[1].style.backgroundColor === squares[1].children[1].style.backgroundColor) {
                gameView.hideSquare(squares[0]);
                gameView.hideSquare(squares[1]);
                gameModel.counter --;
            } else {
                gameView.rotateSquare(squares[0], 0);
                gameView.rotateSquare(squares[1], 0);
            }
            squares.splice(0, 2);
            if (gameModel.counter === 0) {
                gameModel.isPlayed = false;
                gameView.displayMessage('win');
            }
        }, 500);
    }

    handleSquare(square) {
        if(square) {
            if (gameModel.comparedElements.length < 2 && !square.classList.contains('active')) {
                gameView.rotateSquare(square, 1);
                gameModel.comparedElements.push(square);
            }
            if (gameModel.comparedElements.length === 2) {
                this.compareSquares(gameModel.comparedElements);
            }
        }
    }

    // EVENT HANDLERS
    listenEvents() {
        document.querySelector('.btn--start').addEventListener('click', () => this.initGame());
        gameView.elements.squares.addEventListener('click', e => {
            if(gameModel.isPlayed) this.handleSquare(e.target.closest('.square'));
        });
    };
}

const gameModel = new GameModel();
const gameView = new GameView();
const gameController = new GameController(gameModel, gameView);
gameController.listenEvents();