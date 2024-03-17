class Counter {
    draw(counters, highlight_idx) {
        push();
        translate(0, cell_height - 2);
        for (let i = 0; i < 4; i++) {
            translate(0, cell_height);
            strokeWeight(2);
            stroke(curr_color_scheme.borders);
            fill(i === highlight_idx ? curr_color_scheme.terciary : curr_color_scheme.secondary);
            rect(-32, 0, 32, 32);
            textAlign(RIGHT, CENTER);
            strokeWeight(1);
            textSize(16);
            fill(255);
            text(counters[i], -4, 16);
        }
        pop();
    }
}