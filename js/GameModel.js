class GameModel {
    constructor() {
        this.img = [];
        this.curImgIndex = 0;
        this.colors = [];
        this.images = [];
        this.comparedElements = [];
        this.intervalID = 0;
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