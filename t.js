console.log('test');

const a = 1; 
let b = 2;
// var c = 3;

function gretting1() {
    console.log('hello world');
}

var greeting2 = function() {
    console.log('hello world');
};

var greeting3 = () => {
    console.log('hello world');
};

var greeting4 = () => console.log('hello world');

function mysum1(x, y) { return x + y; }
function mysum2(x, y) { x + y; } // !!!
const mysum3 = (x, y) => {
    return x + y;
}
const mysum4 = (x, y) => { return x + y; }
const mysum5 = (x, y) => { x + y; }
const mysum6 = (x, y) => x + y;

console.log(mysum1(1, 2));
console.log(mysum2(1, 2));
