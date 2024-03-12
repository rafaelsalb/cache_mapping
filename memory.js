class Memory {
    header = [];
    label_cells = [];
    blocks = [];
    label = "Memória Principal";
    capacity;

    constructor(capacity) {
        this.capacity = capacity;

        this.header.push(new HeaderCell("Bloco", "Palavra"));
        for (let i = 0; i < 4; i++) {
            this.header.push(new Cell(i));
        }

        for (let i = 0; i < capacity / block_size; i++) {
            this.label_cells.push(new LabelCell(i));
            this.blocks.push(new MemoryBlock(i));
        }
    }

    clear() {
        for (let i = 0; i < this.blocks.length; i++) {
            for (let j = 0; j < this.blocks[i].cells.length; j++) {
                this.blocks[i].cells[j].set_hex(0);

                if (j > 4) {
                    this.blocks[i].cells[j].set_data("");
                }
            }
        }
    }

    draw() {
        push();
        textSize(24);
        textAlign(LEFT, TOP);
        strokeWeight(0);
        fill(curr_color_scheme.headers);
        text(this.label, 0, 0);
        pop();

        for (let i = 0; i < this.header.length; i++) {
            push();
            translate(cell_width * i, 30);
            this.header[i].draw();
            pop();
        }
        for (let i = 0; i < this.label_cells.length; i++) {
            push();
            translate(0, 30 + cell_height + cell_height * i);
            this.label_cells[i].draw();
            pop()
        }
        for (let i = 0; i < this.blocks.length; i++) {
            push();
            translate(cell_width, 30 + cell_height + cell_height * i);
            this.blocks[i].draw();
            pop();
        }
    }

    fill() {
        this.clear()
        for (let i = 0; i < this.blocks.length; i++) {
            this.blocks[i] = new MemoryBlock(i.toString(16));
        }
    }

    get_block(tag, block) {
        return this.blocks[tag * block_size + block];
    }

    get_cell(tag, block, index) {
        return this.blocks[tag * block_size + block].cells[index];
    }

    reset() {
        // this.header.length = 0;
        // this.blocks.length = 0;

        // // TODO: change existing cells properties, not replacing them with a new Cell
        // this.header.push(new HeaderCell("Bloco", "Palavra"));
        // for (let i = 0; i < 4; i++) {
        //     this.header.push(new Cell(i));
        // }
        // for (let i = 0; i < this.capacity / block_size; i++) {
        //     this.blocks.push(new MemoryBlock(i.toString(16)));
        // }
    }

    search(address) {
        const binary = Utils.toBinary(address, 6);
        const tag = parseInt(binary.slice(0, 2), 2);
        const block = parseInt(binary.slice(2, 4), 2);
        const index = parseInt(binary.slice(4, 6), 2);

        return this.blocks[tag * block_size + block].cells[index + 1];
    }

    update_color_scheme() {
        this.cell_color = curr_color_scheme.secondary;
    }

}