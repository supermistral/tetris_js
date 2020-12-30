class GameWindow {
    reset() {
        canvasContext.clearRect(
            0, 0,
            canvasContext.canvas.width, canvasContext.canvas.height
        );
        this.grid = this.getStartArea();

        let block = new Block(canvasContext);
        this.block = block;
        this.setNewBlock();
    }

    getStartArea() {
        return Array.from(
            { length: AREA_HEIGHT },
            () => Array(AREA_WIDTH).fill(0)
        );
    }

    check(blockTemp) {
        return blockTemp.form.every((width, y) => {
            return width.every((num, x) => {
                let newX = blockTemp.x + x, newY = blockTemp.y + y;
                return (!num || this.inGame(newX, newY));
            });
        });
    }

    inGame(x, y) {
        return (
            x >= 0 && x < AREA_WIDTH && y <= AREA_HEIGHT &&
            this.grid[y] && this.grid[y][x] === 0  
        );
    }

    draw() {
        this.block.draw();
        this.grid.forEach((width, y) => {
            width.forEach((num, x) => {
                if (num) {
                   canvasContext.fillStyle = COLORS[num];
                   canvasContext.fillRect(x, y, 1, 1);
                }
            });
        });
    }

    updateGrid() {
        this.block.form.forEach((width, y) => {
            width.forEach((num, x) => {
                if (num) {
                    this.grid[y + this.block.y][x + this.block.x] = num;
                }
            });
        });
    }

    move() {
        let blockTemp = moves[KEYS.DOWN](this.block);
        if (this.check(blockTemp)) {
            this.block.move(blockTemp);
        }
        else {
            this.updateGrid();
            this.updateLines();

            if (this.block.y == 0) {
                return false;
            }

            this.block = this.blockNext;
            this.block.context = canvasContext;
            this.block.setStartPos();
            this.setNewBlock();
        }
        return true;
    }

    updateLines() {
        let lines = 0;
        this.grid.forEach((width, y) => {
            if (width.every(num => num != 0)) {
                ++lines;
                this.grid.splice(y, 1);
                this.grid.splice.unshift(Array(AREA_WIDTH).fill(0));
            }
        });

        if (lines > 0) {
            scores.lines += lines;
        }
        if (scores.record < scores.lines) {
            scores.record = scores.lines;
        }
    }

    setNewBlock() {
        this.blockNext = new Block(canvasNextContext);
        this.setBlock(canvasNextContext, this.blockNext);

        this.setCurrentBlock();
    }

    setCurrentBlock() {
        this.blockCurrent = this.block.getCopyBlock(canvasCurContext);
        this.setBlock(canvasCurContext, this.blockCurrent);
    }

    setBlock(context, block) {
        block.x = 0;
        context.clearRect(
            0, 0,
            context.canvas.width, context.canvas.height
        );
        block.draw();
    }
}