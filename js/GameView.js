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

    showSquares() { this.elements.squares.style.display = 'block'; }
    hideSquares() { this.elements.squares.style.display = 'none'; }

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