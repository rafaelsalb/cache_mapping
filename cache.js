class Cache extends Memory {
    block_use_count;
    block_use_history;

    set_use_count;
    set_use_history;

    counter;

    constructor(capacity) {
        super();
        this.capacity = capacity;
        this.label = "Memória Cache";
        this.header[0] = new HeaderCell("Linha", "Palavra");

        this.header.push(new Cell("TAG"));
        for (let i = 0; i < capacity / block_size; i++) {
            this.label_cells.push(new LabelCell(i));
            this.blocks.push(new CacheLine(i));
        }

        this.block_use_count = [0, 0, 0, 0];
        this.block_use_history = [3, 2, 1, 0];
        this.set_use_count = [
            [0, 0],
            [0, 0]
        ];
        this.set_use_history = [
            [1, 0],
            [1, 0]
        ];
        this.counter = new Counter();
    }

    clear() {
        for (let i = 0; i < this.blocks.length; i++) {
            for (let j = 0; j < this.blocks[i].cells.length; j++) {
                this.blocks[i].cells[j].set_data("");
                this.blocks[i].get_tag().set_data("");
            }
        }
    }

    get_cell(line, index) {
        return this.get_line(line).cells[index];
    }

    // USED ONLY FOR RANDOM ASSOCIATIVE MAPPING
    get_first_empty_line() {
        for (let i = 0; i < 4; i++) {
            if (this.get_line(i).cells.length === 0 || this.get_cell(i, 0).data === "") {
                return i;
            }
        }
        return -1;
    }

    get_first_empty_line_in_set(set) {
        for (let i = set * SET_ASSOCIATIVE_WAYS; i < set * SET_ASSOCIATIVE_WAYS + SET_ASSOCIATIVE_WAYS; i++) {
            if (this.get_line(i).cells.length === 0 || this.get_cell(i, 0).data === "") {
                return i;
            }
        }
        return -1;
    }

    get_line(line) {
        return this.blocks[line];
    }

    // TODO: COMPARE CELLS OF BLOCK AND LINE TO DEAL WITH EITHER MEMORY OR CACHE BEING RESET WITHOUT THE OTHER BEING TOO. 
    is_cache_hit(address, mem_block) {
        let binary = Utils.toBinary(address, 6);
        let tag;
        let block;
        switch (curr_method) {
            case METHODS.direct:
                tag = parseInt(binary.slice(0, 2), 2);
                block = parseInt(binary.slice(2, 4), 2);
                return this.is_cache_hit_direct(tag, block, mem_block);
            case METHODS.associative:
                tag = parseInt(binary.slice(0, 4), 2);
                return this.is_cache_hit_associative(tag, mem_block);
            case METHODS.set_associative:
                tag = parseInt(binary.slice(0, 3), 2);
                let set = parseInt(binary.slice(3, 4), 2);
                return this.is_cache_hit_set_associative(tag, set, mem_block);
        }
    }

    is_cache_hit_associative(tag, mem_block) {
        switch (curr_policy) {
            case POLICIES.LFU:
                for (let i = 0; i < 4; i++) {
                    let curr_line = this.get_line(i);
                    if (curr_line.get_tag().data === tag) {
                        this.block_use_count[i] += 1;
                        return curr_line.equals(mem_block) ? i : -1;
                    }
                }
                return -1;
            case POLICIES.LRU:
                // TODO: PRIORITIZE FILLING THE CACHE BEFORE SWITCHING FILLED LINES
                for (let i = 0; i < 4; i++) {
                    let curr_line = this.get_line(i);
                    if (curr_line.get_tag().data === tag) {
                        let temp = i;
                        this.block_use_history.splice(this.block_use_history.indexOf(i), 1);
                        this.block_use_history.unshift(temp);
                        return curr_line.equals(mem_block) ? i : -1;
                    }
                }
                return -1;
            case POLICIES.random:
                for (let i = 0; i < 4; i++) {
                    let curr_line = this.get_line(i);
                    if (curr_line.get_tag().data === tag) {
                        return curr_line.equals(mem_block) ? i : -1;
                    }
                }
                return -1;
        }
    }

    is_cache_hit_direct(tag, block, mem_block) {
        let is_equal = this.get_line(block).equals(mem_block);
        return this.get_line(block).get_tag().data === tag && is_equal;
    }

    is_cache_hit_set_associative(tag, set, mem_block) {
        switch (curr_policy) {
            case POLICIES.LFU:
                for (let i = set * SET_ASSOCIATIVE_WAYS; i < set * SET_ASSOCIATIVE_WAYS + SET_ASSOCIATIVE_WAYS; i++) {
                    let curr_line = this.get_line(i);
                    if (this.get_line(i).get_tag().data === tag) {
                        this.set_use_count[set][i % 2] += 1;
                        return curr_line.equals(mem_block) ? i : -1;
                    }
                }
                return -1;
            case POLICIES.LRU:
                for (let i = set * SET_ASSOCIATIVE_WAYS; i < set * SET_ASSOCIATIVE_WAYS + SET_ASSOCIATIVE_WAYS; i++) {
                    if (this.get_line(i).get_tag().data === tag) {
                        let curr_line = this.get_line(i);
                        let temp = i;
                        this.set_use_history[set].splice(this.set_use_history[set].indexOf(i), 1);
                        this.set_use_history[set].unshift(temp);
                        return curr_line.equals(mem_block) ? i : -1;
                    }
                }
                return -1;
            case POLICIES.random:
                for (let i = set * SET_ASSOCIATIVE_WAYS; i < set * SET_ASSOCIATIVE_WAYS + SET_ASSOCIATIVE_WAYS; i++) {
                    if (this.get_line(i).get_tag().data === tag) {
                        let curr_line = this.get_line(i);
                        return curr_line.equals(mem_block) ? i : -1;
                    }
                }
                return -1;
        }
    }

    reset() {
        this.clear();
        this.block_use_count = [0, 0, 0, 0];
        this.block_use_history = [3, 2, 1, 0];
        this.set_use_count = [
            [0, 0],
            [0, 0]
        ];
        this.set_use_history = [
            [1, 0],
            [1, 0]
        ];
    }

    draw() {
        super.draw();
        let counters = null;
        let highlight_idx = null;
        if (curr_method === METHODS.associative) {
            switch (curr_policy) {
                case POLICIES.LFU:
                    counters = [...this.block_use_count];
                    let min = Math.min(...counters);
                    highlight_idx = counters.findIndex(i => i === min);
                    console.log(highlight_idx);
                    break;
            }
        }
        if (counters !== null) {
            this.counter.draw(
                counters,
                highlight_idx
            );
        }
    }
}