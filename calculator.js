//power starts as off
let power=false;
//current statement starts as an empty string
let current="";
//set of operator characters
const operators = new Set(['+','-','*','/']);
//constant for all buttons in the program
const buttons = document.getElementsByTagName("button");
//turn off all buttons since calculator is off
for (const button of buttons) {
    button.disabled = true;
}
//on off button needs to be on at all times
document.getElementById('onoff').disabled = false;
//this calculator stores the previous two expressions and their answers
memory = {
    previousStatement:null,
    previousAnswer:null,
    precedingStatement:null,
    precedingAnswer:null
}
const charWidth = 18;
cursor = {
    cursorID: document.getElementById('cursor'),
    cursorOn: false,
    cursorInterval: null,
    cursorPos: 0,
    cursorRow: 0
}
function togglePower(){
    //This function turns the power on or off
    power =! power;
    if(power) {
        document.getElementById('screen').style.backgroundColor = "white";
        document.getElementById('topRow').style.display = "block";
        document.getElementById('bottomRow').style.display = "block";
        for (const button of buttons) {
            button.disabled = false;
        }
        enableCursor();
    }
    else {
        document.getElementById('screen').style.backgroundColor = "grey";
        document.getElementById('topRow').style.display = "none";
        document.getElementById('bottomRow').style.display = "none";
        clearScreen();
        for (const button of buttons) {
            button.disabled = true;
        }
        disableCursor();
    }
    document.getElementById('onoff').disabled = false;
}
function setTopRow(topDisplay){
    //sets the first row of the screen's display
    document.getElementById('topRow').innerHTML = topDisplay;
}
function setBottomRow(bottomDisplay){
    //sets the second row of the screen's display
    document.getElementById('bottomDisplay').innerHTML = bottomDisplay;
}
function concatStatement(nextChar) {
    //adds input to the current statement (operator first will take previous answer)
    if(current=="") {
        if(operators.has(nextChar)){
            concatStatement(memory.previousAnswer);
            console.log("Previous answer fetched!");
        }
    }
    if(nextChar=='n'){
        current+='-';
    }
    else {
        current += nextChar;
    }
    setBottomRow(current);
    moveCursor();
    cursor.curserPos = current.length;
}
function readStatement(){
    //evaluates the current statement
    if(current==""){
        concatStatement(memory.previousAnswer);
        console.log("Previous answer fetched!");
        return;
    }
    ans = eval(current);
    setMem(current,ans);
    current="";
    setTopRow(ans);
    setBottomRow(current);
    resetCursor();
}
function setMem(statement, answer){
    memory.precedingStatement=memory.previousStatement;
    memory.precedingAnswer=memory.previousAnswer;
    memory.previousStatement=statement;
    memory.previousAnswer=answer;
}
function clearScreen(){
    current="";
    setTopRow(current);
    setBottomRow(current);
    resetCursor();
}
function moveCursor() {
    cursor.cursorPos=current.length;
    cursor.cursorID.style.left=cursor.cursorPos*charWidth + 'px';
}
function resetCursor(){
    cursor.cursorPos = 0;
    cursor.cursorID.style.left=0 + 'px';
}
function flipCursor(){
    cursor.cursorOn = !(cursor.cursorOn);
    if(cursor.cursorOn) {
        cursor.cursorID.style.backgroundColor = "black";
        cursor.cursorID.style.color = "black";
    }
    else {
        cursor.cursorID.style.backgroundColor = "white";
        cursor.cursorID.style.color = "white";
    }
}
function enableCursor(){
    clearInterval(cursor.cursorInterval);
    cursor.cursorInterval = setInterval(flipCursor, 530);
}
function disableCursor(){
    clearInterval(cursor.cursorInterval);
}
function moveLeft() {
    if(cursor.cursorPos>0) {
        cursor.cursorID.style.left = cursor.cursorPos*16.5 - 16.5 + 'px';
        cursor.cursorPos--;
    }
}
function moveRight() {
    if(current.length>cursor.cursorPos) {
        cursor.cursorID.style.left = cursor.cursorPos*16.5 + 16.5 + 'px';
        cursor.cursorPos++;
    }
}
function moveUp() {
    if(cursor.cursorRow<4) {
        cursor.cursorRow++;
        
    }
}