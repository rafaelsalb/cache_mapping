const cell_width = 64;
const cell_height = 32;
const mem_capacity_Bytes = 64;
const block_size = 4;
const cache_capacity_Bytes = 16;
const SET_ASSOCIATIVE_WAYS = 2;

const METHODS = {
    direct: 0,
    associative: 1,
    set_associative: 2
};
const METHOD_NAMES = ["Direto", "Associativo", "Associativo por conjuntos"];
let curr_method = METHODS.direct;

const POLICIES = {
    random: 0,
    LFU: 1,
    LRU: 2
};
const POLICY_NAMES = ["Random", "Least Frequently Used (LFU)", "Least Recently Used (LRU)"];
let curr_policy = POLICIES.random;

let fill_on_reset = false;

const COLOR_SCHEMES = {
    dark: {
        headers: 255,
        borders: 255,
        primary: 255,
        secondary: 127,
        terciary: 64,
        background: 32,
        buttons: 233
    },
    light: {
        headers: 0,
        borders: 32,
        primary: 255,
        secondary: 64,
        terciary: 127,
        background: 255,
        buttons: 17
    }
};
let curr_color_scheme = COLOR_SCHEMES.light;