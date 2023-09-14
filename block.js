class MemoryBlock
{
    cells = [];
    index = 0;

    constructor(index)
    {
        this.index = index;
        this.cells.push(new Cell(index.toString(16)));
        for(let i = 0; i < block_size; i++)
        {
            this.cells.push(new Cell("r"));
        }
    }

    draw()
    {
        for(let i = 0; i < this.cells.length; i++)
        {
            push();
            translate(cell_width * i, 0);
            this.cells[i].draw();
            pop();
        }
    }
    
}

class CacheLine extends MemoryBlock
{
    constructor(index)
    {
        super(index);
        this.cells.push(new Cell(""));
    }
}
