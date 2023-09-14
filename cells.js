class Cell
{
    cell_color;
    data;

    constructor(data)
    {
        this.data = data === "r" ? "0x" + Math.floor(Math.random() * 255).toString(16) : data;
        this.cell_color = curr_color_scheme.secondary;
    }

    set_text(text)
    {
        this.data = text;
    }

    set_data(data)
    {
        this.data = "0x" + data.toString(16);
    }

    draw()
    {
        strokeWeight(2);
        stroke(curr_color_scheme.borders);
        fill(curr_color_scheme.secondary);
        rect(0, 0, cell_width, cell_height);

        strokeWeight(0);
        fill(curr_color_scheme.primary);
        textSize(12);
        textAlign(CENTER, CENTER);
        text(this.data, cell_width / 2.0, cell_height / 2.0);
    }
}

class HeaderCell extends Cell
{
    constructor(lower_half, upper_half)
    {
        super(lower_half);
        this.data = {"lower_half": lower_half, "upper_half": upper_half};
    }

    set_data(lower_half, upper_half)
    {
        this.data.lower_half = lower_half;
        this.data.upper_half = upper_half;
    }

    draw()
    {
        strokeWeight(2);
        stroke(curr_color_scheme.borders);
        fill(curr_color_scheme.secondary);
        rect(0, 0, cell_width, cell_height);
        strokeWeight(1);
        line(0, 0, cell_width, cell_height);

        strokeWeight(0);
        fill(curr_color_scheme.primary);
        textSize(12);
        textAlign(LEFT, CENTER);
        text(this.data.lower_half, 0, cell_height * 0.75);
        textAlign(RIGHT, TOP);
        text(this.data.upper_half, cell_width, cell_height * 0.05);
    }
    
}