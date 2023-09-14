class CPU
{
    memory;
    cache;
    address_in;
    data_out;
    is_cache_hit;

    constructor(memory, cache)
    {
        this.memory = memory;
        this.cache = cache;
        cache.block_use_count = [0, 0, 0, 0];
        cache.block_use_history = [3, 2, 1, 0];
        cache.set_use_count = [
            [0, 0],
            [0, 0]
        ];
        cache.set_use_history = [
            [1, 0],
            [1, 0]
        ];
    }

    draw()
    {
        stroke(curr_color_scheme.borders);
        strokeWeight(2);
        fill(curr_color_scheme.secondary);
        rect(0, 0, 64, 64);

        textAlign(CENTER, CENTER);
        textSize(24);
        strokeWeight(1);
        fill(curr_color_scheme.primary);
        text("CPU", 32, 32);

        if(this.address_in != null)
        {
            strokeWeight(0);
            textSize(20);
            fill(curr_color_scheme.secondary);

            if(this.is_cache_hit)
            {
                text("Cache hit", 32, 80);
            }
            else
            {
                text("Cache miss", 32, 80);
            }

            if (curr_method == METHODS.direct)
            {
                let t = this.address_in.slice(0, 2) + " " + this.address_in.slice(2, 4) + " " + this.address_in.slice(4, 6) + " =>";

                push();
                strokeWeight(0);
                textAlign(RIGHT, CENTER);
                textSize(20);
                text(t, -4, 32);

                push();
                textAlign(LEFT, CENTER);
                rotate(-PI/2);
                text("TAG", -16, -98);
                pop();

                push();
                textAlign(LEFT, CENTER);
                rotate(-PI/2);
                text("LINHA", -16, -71);
                pop();

                push();
                textAlign(LEFT, CENTER);
                rotate(-PI/2);
                text("PALAVRA", -16, -42);
                pop();

                pop();

                textSize(20);

                textAlign(LEFT, CENTER);
                text(this.data_out, 68, 32);
            }
            else if (curr_method == METHODS.associative)
            {
                let t = this.address_in.slice(0, 4) + " " + this.address_in.slice(4, 6) + " =>";

                push();
                strokeWeight(0);
                textAlign(RIGHT, CENTER);
                textSize(20);
                text(t, -4, 32);

                push();
                textAlign(LEFT, CENTER);
                rotate(-PI/2);
                text("TAG", -16, -82);
                pop();

                push();
                textAlign(LEFT, CENTER);
                rotate(-PI/2);
                text("PALAVRA", -16, -42);
                pop();

                pop();

                textSize(20);

                textAlign(LEFT, CENTER);
                text(this.data_out, 68, 32);
            }
            else if (curr_method == METHODS.set_associative) {
                let t = this.address_in.slice(0, 3) + " " + this.address_in.slice(3, 4) + " " + this.address_in.slice(4, 6) + " =>";

                push();
                strokeWeight(0);
                textAlign(RIGHT, CENTER);
                textSize(20);
                text(t, -4, 32);

                push();
                textAlign(LEFT, CENTER);
                rotate(-PI / 2);
                text("TAG", -16, -90);
                pop();

                push();
                textAlign(LEFT, CENTER);
                rotate(-PI / 2);
                text("CONJUNTO", -16, -64);
                pop();

                push();
                textAlign(LEFT, CENTER);
                rotate(-PI / 2);
                text("PALAVRA", -16, -42);
                pop();

                pop();

                textSize(20);

                textAlign(LEFT, CENTER);
                text(this.data_out, 68, 32);
            }
        }
    }

    read(address)
    {
        switch(curr_method)
        {
            case METHODS.direct:
                this.read_direct(address);
                break;
            case METHODS.associative:
                this.read_associative(address);
                break;
            case METHODS.set_associative:
                this.read_set_associative(address);
                break;
        }
    }

    read_direct(address)
    {
        const binary = Utils.toBinary(address, 6);
        const tag = parseInt(binary.slice(0, 2), 2);
        const block = parseInt(binary.slice(2, 4), 2);
        const index = parseInt(binary.slice(4, 6), 2);

        this.address_in = binary + " => ";
        this.is_cache_hit = false;

        for(let i = 0; i < this.memory.blocks.length; i++)
        {
            for(let j = 0; j < this.memory.blocks[i].cells.length; j++)
            {
                this.memory.blocks[i].cells[j].cell_color = curr_color_scheme.secondary;
            }
        }

        if(this.cache.is_cache_hit(tag, block))
        {
            for(let i = 1; i < 5; i++)
            {
                this.memory.blocks[tag * block_size + block].cells[i].cell_color = color(64, 127, 64);
            }
            this.memory.blocks[tag * block_size + block].cells[index + 1].cell_color = color(127, 255, 127);
            this.data_out = " => " + this.cache.blocks[block].cells[index + 1].data;
            this.is_cache_hit = true;
            return this.cache.blocks[block].cells[index + 1].data;
        }

        console.log("Cache miss");
        for(let i = 1; i < 5; i++)
        {
            this.memory.blocks[tag * block_size + block].cells[i].cell_color = color(127, 64, 64);
            this.cache.blocks[block].cells[i] = this.memory.blocks[tag * block_size + block].cells[i];
        }
        this.memory.blocks[tag * block_size + block].cells[index + 1].cell_color = color(255, 127, 127);
        this.cache.blocks[block].cells[5].data = tag;
        this.data_out = " => " +  this.memory.blocks[tag * block_size + block].cells[index + 1].data;
        return this.memory.blocks[tag * block_size + block].cells[index + 1].data;
    }

    read_associative(address)
    {
        const binary = Utils.toBinary(address, 6);
        const tag = parseInt(binary.slice(0, 2), 2);
        const block = parseInt(binary.slice(2, 4), 2);
        const index = parseInt(binary.slice(4, 6), 2);

        this.address_in = binary + " => ";
        this.is_cache_hit = false;

        for(let i = 0; i < this.memory.blocks.length; i++)
        {
            for(let j = 0; j < this.memory.blocks[i].cells.length; j++)
            {
                this.memory.blocks[i].cells[j].cell_color = 127;
            }
        }

        let line = this.cache.is_cache_hit(parseInt(binary.slice(0, 4), 2));

        if(line != -1)
        {
            for(let i = 1; i < 5; i++)
            {
                this.memory.blocks[tag * block_size + block].cells[i].cell_color = color(64, 127, 64);
            }
            this.memory.blocks[tag * block_size + block].cells[index + 1].cell_color = color(127, 255, 127);
            this.data_out = " => " + this.cache.blocks[block].cells[index + 1].data;
            this.is_cache_hit = true;
            return this.cache.blocks[block].cells[index + 1].data;
        }

        if (curr_policy == POLICIES.LFU)
        {
            console.log("Cache miss");

            let least_used = Math.min.apply(Math, cache.block_use_count);
            console.log(least_used);
            least_used = cache.block_use_count.indexOf(least_used);
            console.log(least_used);

            cache.block_use_count[least_used] = 0;

            for(let i = 1; i < 5; i++)
            {
                this.memory.blocks[tag * block_size + block].cells[i].cell_color = color(127, 64, 64);
                this.cache.blocks[least_used].cells[i] = this.memory.blocks[tag * block_size + block].cells[i];
            }
            this.memory.blocks[tag * block_size + block].cells[index + 1].cell_color = color(255, 127, 127);
            this.cache.blocks[least_used].cells[5].data = parseInt(binary.slice(0, 4), 2);
            this.data_out = " => " +  this.memory.blocks[tag * block_size + block].cells[index + 1].data;
            return this.memory.blocks[tag * block_size + least_used].cells[index + 1].data;
        }
        else if (curr_policy == POLICIES.LRU)
        {
            console.log("Cache miss");

            let least_recent = cache.block_use_history[3];
            console.log(least_recent);
            console.log(cache.block_use_history);

            for(let i = 1; i < 5; i++)
            {
                this.memory.blocks[tag * block_size + block].cells[i].cell_color = color(127, 64, 64);
                this.cache.blocks[least_recent].cells[i] = this.memory.blocks[tag * block_size + block].cells[i];
            }
            this.memory.blocks[tag * block_size + block].cells[index + 1].cell_color = color(255, 127, 127);
            this.cache.blocks[least_recent].cells[5].data = parseInt(binary.slice(0, 4), 2);
            this.data_out = " => " +  this.memory.blocks[tag * block_size + block].cells[index + 1].data;
            return this.memory.blocks[tag * block_size + least_recent].cells[index + 1].data;
        }
        else if (curr_policy == POLICIES.random)
        {
            console.log("Cache miss");

            let line = Math.floor(Math.random() * 4);

            for(let i = 1; i < 5; i++)
            {
                this.memory.blocks[tag * block_size + block].cells[i].cell_color = color(127, 64, 64);
                this.cache.blocks[line].cells[i] = this.memory.blocks[tag * block_size + block].cells[i];
            }
            this.memory.blocks[tag * block_size + block].cells[index + 1].cell_color = color(255, 127, 127);
            this.cache.blocks[line].cells[5].data = parseInt(binary.slice(0, 4), 2);
            this.data_out = " => " +  this.memory.blocks[tag * block_size + block].cells[index + 1].data;
            return this.memory.blocks[tag * block_size + line].cells[index + 1].data;
        }
    }

    read_set_associative(address) {
        const binary = Utils.toBinary(address, 6);

        const tag = parseInt(binary.slice(0, 2), 2);
        const block = parseInt(binary.slice(2, 4), 2);
        const index = parseInt(binary.slice(4, 6), 2);

        this.address_in = binary + " => ";
        this.is_cache_hit = false;

        for (let i = 0; i < this.memory.blocks.length; i++) {
            for (let j = 0; j < this.memory.blocks[i].cells.length; j++) {
                this.memory.blocks[i].cells[j].cell_color = 127;
            }
        }

        let line = this.cache.is_cache_hit_set_associative(address);

        if (line != -1) {
            for (let i = 1; i < 5; i++) {
                this.memory.blocks[tag * block_size + block].cells[i].cell_color = color(64, 127, 64);
            }
            this.memory.blocks[tag * block_size + block].cells[index + 1].cell_color = color(127, 255, 127);
            this.data_out = " => " + this.cache.blocks[block].cells[index + 1].data;
            this.is_cache_hit = true;
            return this.cache.blocks[block].cells[index + 1].data;
        }

        const search_tag = parseInt(binary.slice(0, 3), 2);
        const search_set = parseInt(binary.slice(3, 4), 2);

        if (curr_policy == POLICIES.LFU)
        {
            console.log("Cache miss");

            let least_used = Math.min.apply(Math, cache.set_use_count[search_set]);
            least_used = cache.set_use_count[search_set].indexOf(least_used);
            console.log(cache.set_use_count);

            cache.set_use_count[search_set][least_used] = 0;

            for (let i = 1; i < 5; i++)
            {
                this.memory.blocks[tag * block_size + block].cells[i].cell_color = color(127, 64, 64);
                this.cache.blocks[least_used + search_set * 2].cells[i] = this.memory.blocks[tag * block_size + block].cells[i];
            }
            this.memory.blocks[tag * block_size + block].cells[index + 1].cell_color = color(255, 127, 127);
            this.cache.blocks[least_used + search_set * 2].cells[5].data = search_tag;
            this.data_out = " => " + this.memory.blocks[tag * block_size + block].cells[index + 1].data;

            this.address_in = binary + " => ";
            this.is_cache_hit = false;

            return this.memory.blocks[tag * block_size + least_used].cells[index + 1].data;
        }
        else if (curr_policy == POLICIES.LRU) {
            console.log("Cache miss");

            let least_recent = cache.set_use_history[search_set][1];

            for (let i = 1; i < 5; i++) {
                this.memory.blocks[tag * block_size + block].cells[i].cell_color = color(127, 64, 64);
                this.cache.blocks[least_recent + search_set * 2].cells[i] = this.memory.blocks[tag * block_size + block].cells[i];
            }
            this.memory.blocks[tag * block_size + block].cells[index + 1].cell_color = color(255, 127, 127);
            this.cache.blocks[least_recent + search_set * 2].cells[5].data = search_tag;
            this.data_out = " => " + this.memory.blocks[tag * block_size + block].cells[index + 1].data;

            this.address_in = binary + " => ";
            this.is_cache_hit = false;

            return this.memory.blocks[tag * block_size + least_recent].cells[index + 1].data;
        }
        else if (curr_policy == POLICIES.random) {
            console.log("Cache miss");

            let line = Math.floor(Math.random() * 2);

            for (let i = 1; i < 5; i++) {
                this.memory.blocks[tag * block_size + block].cells[i].cell_color = color(127, 64, 64);
                this.cache.blocks[search_set * 2 + line].cells[i] = this.memory.blocks[tag * block_size + block].cells[i];
            }
            this.memory.blocks[tag * block_size + block].cells[index + 1].cell_color = color(255, 127, 127);
            this.cache.blocks[search_set * 2 + line].cells[5].data = parseInt(binary.slice(0, 3), 2);
            this.data_out = " => " + this.memory.blocks[tag * block_size + block].cells[index + 1].data;
            return this.memory.blocks[tag * block_size + line].cells[index + 1].data;
        }

    }

    reset()
    {
        this.address_in = null;

        if (fill_on_reset)
        {
            for (let i = 0; i < 4; i++)
            {
                for (let j = 1; j < 5; j++)
                {
                    this.cache.blocks[i].cells[j] = this.memory.blocks[i].cells[j];
                }
                switch(curr_method)
                {
                    case METHODS.direct:
                        this.cache.blocks[i].cells[5].data = 0;
                        break;
                    case METHODS.associative:
                        this.cache.blocks[i].cells[5].data = i;
                        break;
                    case METHODS.set_associative:
                        this.cache.clear();
                        break;
                }
            }
        }
    }

}
