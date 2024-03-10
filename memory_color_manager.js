class MemoryColorManager {
    constructor(main_memory, cache) {
        this.main_memory = main_memory;
        this.cache = cache;
    }

    memory_read(block_index, cell_index) {
        for (const block of this.main_memory.blocks) {
            for (const cell of block.cells) {
                cell.cell_color = curr_color_scheme.secondary;
            }
        }

        for (let i = 0; i < 4; i++) {
            this.main_memory.blocks[block_index].cells[i].cell_color = color(128);
        }
        this.main_memory.blocks[block_index].cells[cell_index].cell_color = color(160);
    }

    cache_hit(line_index, cell_index) {
        for (let block of this.cache.blocks) {
            block.cells.forEach(cell => { cell.cell_color = curr_color_scheme.secondary; });
        }
        for (let cell of this.cache.blocks[line_index].cells) {
            cell.cell_color = color(32, 160, 32);
        }
        this.cache.blocks[line_index].cells[cell_index].cell_color = color(32, 255, 32);
    }

    cache_miss(line_index, cell_index) {
        for (let block of this.cache.blocks) {
            block.cells.forEach(cell => { cell.cell_color = curr_color_scheme.secondary; });
        }
        for (let cell of this.cache.blocks[line_index].cells) {
            cell.cell_color = color(160, 32, 32);
        }
        this.cache.blocks[line_index].cells[cell_index].cell_color = color(255, 32, 32);
    }

    reset_memory() {
        for (const block of this.main_memory.blocks) {
            block.cells.forEach(cell => { cell.cell_color = curr_color_scheme.secondary; });
        }
    }

    reset_cache() {
        for (const block of this.cache.blocks) {
            block.cells.forEach(cell => { cell.cell_color = curr_color_scheme.secondary; });
        }
    }
}