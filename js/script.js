class GameModel {
    constructor() {
        this.img = [];
        this.curImgIndex = 0;
        this.colors = [];
        this.images = [];
        this.comparedElements = [];
    }

    setSquaresAmount(squaresAmount) { this.squaresAmount = squaresAmount; }

    setGameMode(gameMode) { this.gameMode = gameMode; }

    setTimeMode(timeMode) { this.timeMode = timeMode; }

    setIsPlayed(isPlayed) { this.isPlayed = isPlayed; }

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

    async getImages(num) {
        try {
            const res = await fetch(`https://api.unsplash.com/photos/random?count=${num/2}&client_id=3fe4ce55413a6e155249e96c36371f0ac4a325f45899afc896233ea79c36f63b`);
            const result = await res.json();

            for (let i = 0; i < num/2; i ++) {
                this.img.push({ 
                    url: result[i].urls.small,
                    author: result[i].user.name,
                    authorLink: result[i].user.links.html
                });
            };
            return result;
        } catch(err) {
            console.log(err);
        }
    }

    setImages(img) {
        for (let i = 0; i < img.length; i ++) {
            this.images.push(img[i]);
            this.images.push(this.images[i*2]);
        };
    }

    clearImages() { this.img = [] }
}

class GameView {
    constructor() {
        this.elements = {
            squaresRadios: document.querySelectorAll('.header__radio--squares'),
            modeRadios: document.querySelectorAll('.header__radio--mode'),
            message: document.querySelector('.header__message'),
            timer: document.querySelector('.header__timer span'),
            start: document.querySelector('.btn--start'),
            squares: document.querySelector('.squares'),
            gallery: document.querySelector('.gallery')
        }
    }

    getSquaresAmount() {
        let num;
        Array.from(this.elements.squaresRadios).forEach(el => {    
            if (el.checked) num = parseInt(document.querySelector(`.header__label[for="${el.id}"]`).innerHTML);
        }); 
        return num;
    }

    getGameMode() { 
        let mode;
        Array.from(this.elements.modeRadios).forEach(el => {    
            if (el.checked) mode = document.querySelector(`.header__label[for="${el.id}"]`).innerHTML;
        });
        return mode; 
    }

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

    colorSquare(square, mode, arr) {
        const index = Math.floor(Math.random()*(arr.length - 1));
        mode === 'colors' ? square.children[1].style.background = arr[index] : square.children[1].style.background = `url(${arr[index].url})`;
        arr.splice(index, 1);
    }

    renderSquares(num, mode, arr) {
        for (let i = 0; i < num; i ++) {
            const square = this.renderSquare(i+1);
            this.colorSquare(square, mode, arr)
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

    toggleStartButton(isPlayed) {
        isPlayed ? this.elements.start.innerHTML = 'New game' : this.elements.start.innerHTML = 'Play again?';
    }

    displayGallery(array) { 
        document.querySelector('.gallery__img').src = array[0].url;
        document.querySelector('.credits__name').textContent = array[0].author;
        document.querySelector('.credits__name').href = array[0].authorLink;
        this.elements.gallery.classList.add('gallery--displayed'); 
    }

    hideGallery() { this.elements.gallery.classList.remove('gallery--displayed'); }

    changeImage(sign, array, i) {
        if (sign === 1) {
            if (i < array.length - 1) {
                i++;
            } else {
                i = 0;
            }
        } else {
            if (i > 0) {
                i--;
            } else {
                i = array.length-1;
            }
        }
        document.querySelector('.gallery__img').src = array[i].url;
        document.querySelector('.credits__name').textContent = array[i].author;
        document.querySelector('.credits__name').href = array[i].authorLink;
        return i;
    }
};

class GameController {
    constructor(model, view) {
        this.gameModel = model;
        this.gameView = view;
    }

    resetGame() {
        this.gameModel.setIsPlayed(false);
        this.gameModel.clearImages();
        this.gameView.hideGallery();
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
        let intervalID = setInterval(() => {
            this.gameModel.updateTimer();
            this.gameView.displayTimer(this.gameModel.timer);
            if (!this.gameModel.isPlayed) clearInterval(intervalID);
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
                this.gameView.displayGallery(this.gameModel.img);
            }
        }, 500);
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
        document.querySelector('.gallery__right').addEventListener('click', () => {
            const index = this.gameView.changeImage(1, this.gameModel.img, this.gameModel.curImgIndex);
            this.gameModel.curImgIndex = index;
        });
        document.querySelector('.gallery__left').addEventListener('click', () => {
            const index = this.gameView.changeImage(-1, this.gameModel.img, this.gameModel.curImgIndex);
            this.gameModel.curImgIndex = index;
        });
    };
}

const gameModel = new GameModel();
const gameView = new GameView();
const gameController = new GameController(gameModel, gameView);
gameController.listenEvents();