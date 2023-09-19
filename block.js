class MemoryBlock {
    label_cells = [];
    cells = [];
    index = 0;

    constructor(index, rand = true) {
        this.index = index;
        for (let i = 0; i < block_size; i++) {
            this.cells.push(new Cell('', rand));
        }
    }

    draw() {
        for (let i = 0; i < this.cells.length; i++) {
            push();
            translate(cell_width * i, 0);
            this.cells[i].draw();
            pop();
        }
    }

    equals(block_to_compare) {
        let is_equal = false;
        for (let i = 0; i < block_size; i++) {
            is_equal = this.cells[i].data === block_to_compare.cells[i].data;
        }
        return is_equal;
    }

    is_empty() {
        return this.cells[0].data === "";
    }

    // TODO:
    reset() {

    }
}

class CacheLine extends MemoryBlock {
    tag;

    constructor(index) {
        super(index, false);
        this.tag = new TagCell();
    }

    draw() {
        for (let i = 0; i < this.cells.length; i++) {
            push();
            translate(cell_width * i, 0);
            this.cells[i].draw();
            pop();
        }
        push();
        translate(cell_width * 4, 0);
        this.tag.draw();
        pop();
    }

    get_tag() {
        return this.tag;
    }
}
