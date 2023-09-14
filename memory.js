class Memory
{
    header = [];
    blocks = [];
    label = "Memória Principal";
    capacity;

    constructor(capacity)
    {
        this.capacity = capacity;

        this.header.push(new HeaderCell("Bloco", "Palavra"));
        for(let i = 0; i < 4; i++)
        {
            this.header.push(new Cell(i));
        }
        for(let i = 0; i < capacity / block_size; i++)
        {
            this.blocks.push(new MemoryBlock(i.toString(16)));
        }
    }

    draw()
    {
        push();
        textSize(24);
        textAlign(LEFT, TOP);
        strokeWeight(0);
        fill(curr_color_scheme.headers);
        text(this.label, 0, 0);
        pop();

        for(let i = 0; i < this.header.length; i++)
        {
            push();
            translate(cell_width * i, 30);
            this.header[i].draw();
            pop();
        }
        for(let i = 0; i < this.blocks.length; i++)
        {
            push();
            translate(0, 30 + cell_height + cell_height * i);
            this.blocks[i].draw();
            pop();
        }
    }

    clear()
    {
        for(let i = 0; i < this.blocks.length; i++)
        {
            for(let j = 1; j < this.blocks[i].cells.length; j++)
            {
                this.blocks[i].cells[j].data = "0x00";

                if(j > 4)
                {
                    this.blocks[i].cells[j].data = "";
                }
            }
        }
    }

    fill()
    {
        this.clear()
        for(let i = 0; i < this.blocks.length; i++)
        {
            this.blocks[i] = new MemoryBlock(i.toString(16));
        }
    }

    search(address)
    {
        const binary = Utils.toBinary(address, 6);
        const tag = parseInt(binary.slice(0, 2), 2);
        const block = parseInt(binary.slice(2, 4), 2);
        const index = parseInt(binary.slice(4, 6), 2);

        for(let i = 0; i < this.blocks[0].cells.length; i++)
        {
            this.blocks[tag * block_size + block].cells[i].cell_color = 200;
        }

        return this.blocks[tag * block_size + block].cells[index + 1];
    }

    insert(address, data)
    {
        const binary = Utils.toBinary(address, 6);
        const tag = parseInt(binary.slice(0, 2), 2);
        const block = parseInt(binary.slice(2, 4), 2);
        const index = parseInt(binary.slice(4, 6), 2);

        console.log(tag * block_size + block)
        console.log(index + 1)

        this.blocks[tag * block_size + block].cells[index + 1].data = data;
    }

    reset()
    {
        this.header.length = 0;
        this.blocks.length = 0;
        
        this.header.push(new HeaderCell("Bloco", "Palavra"));
        for(let i = 0; i < 4; i++)
        {
            this.header.push(new Cell(i));
        }
        for(let i = 0; i < this.capacity / block_size; i++)
        {
            this.blocks.push(new MemoryBlock(i.toString(16)));
        }
    }

    update_color_scheme()
    {
        this.cell_color = curr_color_scheme.secondary;
    }

}

class Cache extends Memory
{
    block_use_count;
    block_use_history;

    set_use_count;
    set_use_history;

    constructor(capacity)
    {
        super();
        this.capacity = capacity;
        this.label = "Memória Cache";
        this.header[0] = new HeaderCell("Linha", "Palavra");

        this.header.push(new Cell("TAG"));
        for(let i = 0; i < capacity / block_size; i++)
        {
            this.blocks.push(new CacheLine(i.toString(16)));
        }

        this.clear()
    }

    is_cache_hit(tag, block)
    {
        if (curr_method == METHODS.direct)
        {
            return this.blocks[block].cells[5].data === tag;
        }
        else if (curr_method == METHODS.associative)
        {
            switch (curr_policy) {
                case POLICIES.LFU:
                    for (let i = 0; i < 4; i++) {
                        if (this.blocks[i].cells[5].data === tag) {
                            this.block_use_count[i] += 1;
                            return i;
                        }
                    }
                    return -1;
                case POLICIES.LRU:
                    console.log("hello");
                    for (let i = 0; i < 4; i++) {
                        if (this.blocks[i].cells[5].data === tag) {
                            let temp = i;
                            this.block_use_history.splice(this.block_use_history.indexOf(i), 1);
                            this.block_use_history.unshift(temp);
                            return i;
                        }
                    }
                    let least_recent = this.block_use_history[3];
                    this.block_use_history.splice(3, 1);
                    this.block_use_history.unshift(least_recent);
                    return -1;
                case POLICIES.random:
                    for (let i = 0; i < 4; i++) {
                        if (this.blocks[i].cells[5].data === tag) {
                            return i;
                        }
                    }
                    return -1;
            }
        }
    }

    is_cache_hit_set_associative(address)
    {
        const binary = Utils.toBinary(address, 6);
        const tag = parseInt(binary.slice(0, 3), 2);
        const set = parseInt(binary.slice(3, 4), 2);

        switch (curr_policy) {
            case POLICIES.LFU:
                for (let i = set * 2; i < set * 2 + 2; i++) {
                    if (this.blocks[i].cells[5].data === tag) {
                        this.set_use_count[set][i % 2] += 1;
                        return i;
                    }
                }
                return -1;
            case POLICIES.LRU:
                for (let i = set * 2; i < set * 2 + 2; i++) {
                    if (this.blocks[i].cells[5].data === tag) {
                        let temp = i;
                        this.set_use_history[set].splice(this.set_use_history[set].indexOf(i), 1);
                        this.set_use_history[set].unshift(temp);
                        console.log(this.set_use_history, i);
                        return i;
                    }
                }
                return -1;
            case POLICIES.random:
                for (let i = set * 2; i < set * 2 + 2; i++) {
                    if (this.blocks[i].cells[5].data === tag) {
                        return i;
                    }
                }
                return -1;
        }
    }

    reset()
    {
        for(let i = 0; i < this.capacity / block_size; i++)
        {
            this.blocks[i] = new MemoryBlock(i.toString(16));
        }

        for(let i = 0; i < this.capacity / block_size; i++)
        {
            this.blocks[i] = new CacheLine(i.toString(16));
        }

        this.clear()
        this.block_use_count = [0, 0, 0, 0];
        this.block_use_history = [0, 1, 2, 3];
    }

}
