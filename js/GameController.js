class GameController {
    constructor(model, view) {
        this.gameModel = model;
        this.gameView = view;
    }

    resetGame() {
        clearInterval(this.gameModel.intervalID);
        this.gameModel.setIsPlayed(false);
        this.gameModel.clearImages();
        this.gameView.hideGallery();
        this.gameView.showSquares();
        this.gameView.clearSquares();
        this.gameView.clearMessage();
        this.gameView.clearTimer();
        this.gameModel.resetTimer();
        this.gameView.displayTimer(this.gameModel.timer);
        this.gameModel.setGameMode(this.gameView.getGameMode());
    }

    async displayUI() {
        this.gameModel.setSquaresAmount(this.gameView.getSquaresAmount());
        if (this.gameModel.gameMode === 'colors') { 
            this.gameModel.setColors(this.gameModel.squaresAmount);
            this.gameView.renderSquares(this.gameModel.squaresAmount, this.gameModel.gameMode, this.gameModel.colors);
        } else if (this.gameModel.gameMode === 'images') {
            await this.gameModel.getImages(this.gameModel.squaresAmount);
            this.gameModel.setImages(this.gameModel.img);
            this.gameView.renderSquares(this.gameModel.squaresAmount, this.gameModel.gameMode, this.gameModel.images);
        }
    }

    runTime() {
        this.gameModel.intervalID = setInterval(() => {
            this.gameModel.updateTimer();
            this.gameView.displayTimer(this.gameModel.timer);
            if (!this.gameModel.isPlayed) clearInterval(this.gameModel.intervalID);
        }, 1000);
    }

    startGame() {
        this.gameModel.setIsPlayed(true);
        this.gameModel.setCounter();
        this.runTime();
        this.gameView.toggleStartButton(this.gameModel.isPlayed);
    }

    initGame() {
        this.resetGame();
        this.displayUI();
        this.startGame();
    }

    compareSquares(squares) {
        setTimeout(()=> {
            if (squares[0].children[1].style.background === squares[1].children[1].style.background) {
                this.gameView.hideSquare(squares[0]);
                this.gameView.hideSquare(squares[1]);
                this.gameModel.counter --;
            } else {
                this.gameView.rotateSquare(squares[0], 0);
                this.gameView.rotateSquare(squares[1], 0);
            }
            squares.splice(0, 2);
            if (this.gameModel.counter === 0) {
                this.gameModel.setIsPlayed(false);
                this.gameView.displayMessage('win');
                this.gameView.toggleStartButton(this.gameModel.isPlayed);
                this.gameView.hideSquares();
                if(this.gameModel.gameMode === 'images') this.gameView.displayGallery(this.gameModel.img);
            }
        }, 700);
    }

    handleSquare(square) {
        if(square) {
            if (this.gameModel.comparedElements.length < 2 && !square.classList.contains('active')) {
                this.gameView.rotateSquare(square, 1);
                this.gameModel.comparedElements.push(square);
            }
            if (this.gameModel.comparedElements.length === 2) {
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
        document.querySelector('.gallery__arrow--right').addEventListener('click', () => {
            const index = this.gameView.changeImage(1, this.gameModel.img, this.gameModel.curImgIndex);
            this.gameModel.curImgIndex = index;
        });
        document.querySelector('.gallery__arrow--left').addEventListener('click', () => {
            const index = this.gameView.changeImage(-1, this.gameModel.img, this.gameModel.curImgIndex);
            this.gameModel.curImgIndex = index;
        });
    };
}