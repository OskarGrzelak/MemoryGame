const squaresSide = document.querySelectorAll('.square__side--back');
const squares = document.querySelectorAll('.square');
const start = document.querySelector('.btn--start');

class Game {
    constructor() {
        this.isPlayed = false;
        this.colors = [];
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
    getSquaresAmount() { return 30; },
    getGameMode() { return 'colors' },
    getTimeMode() { return 'normal'} 
};

const game = new Game();

start.addEventListener('click', e => {
    game.isPlayed = true;
    game.setSquaresAmount(gameView.getSquaresAmount());
    game.pickColors(game.squaresAmount);
    game.setColors(Array.from(squaresSide), game.colors)
});

Array.from(squares).forEach(el => el.addEventListener('click', () => {
    if(game.isPlayed) {
        el.children[0].style.transform = 'rotateY(180deg)';
        el.children[1].style.transform = 'rotateY(0)';
    }
}));