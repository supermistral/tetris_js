class Block {
    constructor(context) {
        this.context = context;
        this.type = this.getTypeBlock();
        this.form = FORMS[this.type];
        this.color = COLORS[this.type];
        this.y = 0;
        this.setStartPos();
    }

    draw() {
        this.context.fillStyle = this.color;
        this.form.forEach((width, y) => {
            width.forEach((num, x) => {
                if (num) {
                    this.context.fillRect(
                        this.x + x, this.y + y, 1, 1
                    );
                }
            });
        });
    }

    move(value) {
        this.x = value.x;
        this.y = value.y;
        this.form = value.form;
    }

    rotate() {
        for (let y = 0; y < this.form.length; y++) {
            for (let x = 0; x < y; x++) {
                [this.form[x][y], this.form[y][x]] = [this.form[y][x], this.form[x][y]];
            }
        }
        this.form.forEach(width => width.reverse());
        return this;
    }

    setStartPos() {
        this.x = this.getStartPos();
        this.y = 0;
    }

    getRandomValue(number, offset = 0) {
        return Math.floor(Math.random() * number + offset);
    }

    getTypeBlock() {
        return this.getRandomValue(COLORS.length - 1, 1);
    }

    getStartPos() {
        let maxWidth = this.type === 4 ? (AREA_WIDTH - 1) : (AREA_WIDTH - 2); 
        maxWidth = this.type === 1 ? (AREA_WIDTH - 3) : maxWidth;
        return this.getRandomValue(maxWidth);
    }

    getCopyBlock(context) {
        let newBlock = new Block(context);
        newBlock.type = this.type;
        newBlock.form = this.form;
        newBlock.color = this.color;
        return newBlock;
    }
}