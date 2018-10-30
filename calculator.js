function number(input) {
document.getElementById("display").value += input;

}
function operator(input) {
document.getElementById("display").value += input;

}
function equals() {
    document.getElementById("display").value = eval(calculator.display.value);
}

function clear() {
    document.getElementById("calculator").reset();
}
