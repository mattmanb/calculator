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
    altCursorInterval:null,
    cursorPos: 0,
    cursorRow: 0,
    insert: false,
    replace: false,
    exponent: false
}
second = false;
degreeMode = {
    active:false,
    deg:true,
    rad:false
};
const trigFuncs = new Set(['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh']);
//hyperbolic function mode for trig functions
let hyp = false;
function setTopRow(topDisplay){
    //sets the first row of the screen's display
    document.getElementById('topRow').innerHTML = topDisplay;
}
function setBottomRow(bottomDisplay){
    //sets the second row of the screen's display
    document.getElementById('bottomDisplay').innerHTML = bottomDisplay;
}
function concatStatement(nextChar) {
    if(degreeMode.active) {
        degreeMode.active = false;
        clearScreen();
    }
    //adds input to the current statement (operator first will take previous answer)
    if(current=="") {
        if(operators.has(nextChar)){
            concatStatement(memory.previousAnswer);
        }
    }
    if(nextChar=='n'){
        current+='-';
    }
    else if(cursor.insert) {
        if(cursor.replace) {
            current = current.substring(0, cursor.cursorPos) + 
                        nextChar + 
                        current.substring(cursor.cursorPos+1, current.length);
            console.log(current)
        }
        else {
            current = current.substring(0, cursor.cursorPos) + 
                        nextChar + 
                        current.substring(cursor.cursorPos, current.length);
        }
    }
    else {
        current += nextChar;
    }
    setBottomRow(current);
    moveCursor();
}
function readStatement(){
    //evaluates the current statement
    if(cursor.cursorRow > 0) {
        concatStatement(getMem(cursor.cursorRow));
        cursor.cursorRow=0;
        moveScreen(cursor.cursorRow);
        console.log('Previous answer/statement fetched!');
        return;
    }
    else if(degreeMode.active) {
        if(cursor.cursorPos==2) {
            degreeMode.deg = false;
            degreeMode.rad = true;
            setTopRow("Radian mode active");
        }
        else {
            degreeMode.deg = true;
            degreeMode.rad = false;
            setTopRow("Degree mode active");
        } 
        degreeMode.active=false;
        current="";
        setBottomRow(current);
    }
    else if(current==""){
        concatStatement(memory.previousAnswer);
        console.log("Previous answer fetched!");
        return;
    }
    else {
        if(degreeMode.deg) {
            convertAngles();
        }
        ans = eval(current);
        if(ans<.00001 && ans>-.00001) {
            ans = 0;
        }
        else if(isNaN(ans)) {
            ans="Not a number!";
        }
        setMem(current,ans);
        current="";
        setTopRow(ans);
        setBottomRow(current);
    }
    resetCursor();
}
function setMem(statement, answer){
    memory.precedingStatement=memory.previousStatement;
    memory.precedingAnswer=memory.previousAnswer;
    memory.previousStatement=statement;
    memory.previousAnswer=answer;
}
function getMem(row){
    if(row==1) {
        return memory.previousAnswer;
    }
    else if(row==2) {
        return memory.previousStatement;
    }
    if(row==3) {
        return memory.precedingAnswer;
    }
    if(row==4) {
        return memory.precedingStatement;
    }
}
function moveCursor() {
    if(!cursor.insert) {
        cursor.cursorPos=current.length;
    }
    cursor.cursorID.style.left=cursor.cursorPos*charWidth + 'px';
}
function resetCursor(){
    cursor.cursorPos = 0;
    cursor.cursorID.style.left=0 + 'px';
    cursor.insert = false;
    cursor.replace = false;
}
function flipCursor(){
    cursor.cursorOn = !(cursor.cursorOn);
    if(cursor.cursorOn) {
        if(cursor.insert) {
            cursor.cursorID.style.backgroundColor = "orchid";
            cursor.cursorID.style.color = "orchid";
        }
        else {
            cursor.cursorID.style.backgroundColor = "black";
            cursor.cursorID.style.color = "black";
        }
        
    }
    else {
        cursor.cursorID.style.backgroundColor = "white";
        cursor.cursorID.style.color = "white";
    }
}
function altFlipCursor(){
    cursor.cursorOn = !(cursor.cursorOn);
    if(cursor.cursorOn) {
        document.getElementById('bottomDisplay').style.backgroundColor='black';
        document.getElementById('bottomDisplay').style.color='white';
    }
    else {
        document.getElementById('bottomDisplay').style.backgroundColor='white';
        document.getElementById('bottomDisplay').style.color='black';
    }
}
function enableCursor(){
    clearInterval(cursor.cursorInterval);
    cursor.cursorInterval = setInterval(flipCursor, 530);
}
function enableAltCursor(){
    clearInterval(cursor.altCursorInterval);
    cursor.altCursorInterval = setInterval(altFlipCursor, 530);
}
function disableCursor(){
    clearInterval(cursor.cursorInterval);
    cursor.cursorID.style.backgroundColor = "white";
    cursor.cursorID.style.color = "white";
}
function disableAltCursor() {
    clearInterval(cursor.altCursorInterval);
    document.getElementById('bottomDisplay').style.backgroundColor='white';
    document.getElementById('bottomDisplay').style.color='black';
}
function moveLeft() {
    if(degreeMode.active && cursor.cursorPos>0) {
        cursor.cursorID.style.left = cursor.cursorPos*16.5 - 33 + 'px';
        cursor.cursorPos-=2;
    }
    if(cursor.cursorPos>0) {
        cursor.cursorID.style.left = cursor.cursorPos*16.5 - 16.5 + 'px';
        cursor.cursorPos--;
    }
}
function moveRight() {
    if(degreeMode.active && current.length>cursor.cursorPos) {
        moveCursor();
        cursor.cursorPos+=2;
    }
    else if(current.length>cursor.cursorPos) {
        cursor.cursorID.style.left = cursor.cursorPos*16.5 + 16.5 + 'px';
        cursor.cursorPos++;
    }
}
function moveUp() {
    if(cursor.cursorRow<4) {
        cursor.cursorRow++;
        moveScreen(cursor.cursorRow);
        disableCursor();
        enableAltCursor();
    }
}
function moveDown() {
    if(cursor.cursorRow>0) {
        cursor.cursorRow--;
        moveScreen(cursor.cursorRow);
        enableAltCursor();
        if(cursor.cursorRow==0){
            disableAltCursor();
            enableCursor();
        }
    }
    console.log('cursorRow is', cursor.cursorRow);
}
function moveScreen(row){
    cursor.cursorRow=row;
    if(cursor.cursorRow==0) {
        setBottomRow(current);
        setTopRow(memory.previousAnswer);
        disableAltCursor();
        enableCursor();
        console.log(current);
    }
    if(cursor.cursorRow==1) {
        setBottomRow(memory.previousAnswer);
        setTopRow(memory.previousStatement);
    }
    else if(cursor.cursorRow==2) {
        setBottomRow(memory.previousStatement);
        setTopRow(memory.precedingAnswer);
    }
    else if(cursor.cursorRow==3) {
        setBottomRow(memory.precedingAnswer);
        setTopRow(memory.precedingStatement);
    }
    else if(cursor.cursorRow==4) {
        setBottomRow(memory.precedingStatement);
        setTopRow("");
    }
}
function toggleSecond() {
    second = !second;
    let firstClass = document.getElementsByClassName('first');
    let secondClass = document.getElementsByClassName('second');
    if(second) {
        for(elem of firstClass) {
            elem.style.color='white';
        }
        for(elem of secondClass) {
            elem.style.color='black';
        }
    }
    else{
        for(elem of firstClass) {
            elem.style.color='black';
        }
        for(elem of secondClass) {
            elem.style.color='white';
        }
    }
}
function toggleDegreeMode() {
    degreeMode.active=true;
    clearScreen();
    current="D R";
    setBottomRow(current);
}
function degreeToRadian(degAngle) {
    let radAngle = degAngle * (Math.PI/180);
    return radAngle;
}
function convertAngles() { 
    //this function converts all angles in the
    //current string from degrees to radians for
    //the Math.trig function to work correctly
    //(this is only called during 'readstatement'
    //when degree mode is active)
    found = true;
    let index = 0;
    let currentAngle="";
    let convertedAngle=0;
    let endAngle=0;
    while(index+5<current.length) {
        //gets string of next three characters in the current string
        let nextThree = current.substring(index, index+3);
        //gets string of next four characters in the current string
        let nextFour = current.substring(index, index+4);
        if(trigFuncs.has(nextThree)) {
            index+=4;
            endAngle=current.indexOf(')',index);
            currentAngle=current.substring(index,endAngle);
            convertedAngle=degreeToRadian(parseInt(currentAngle));
            newCurrent=current.replace(currentAngle, convertedAngle.toString());
            current=newCurrent;
            index=endAngle+1;
        }
        else if(trigFuncs.has(nextFour)) {
            index+=5;
            endAngle=current.indexOf(')',index);
            currentAngle=current.substring(index,endAngle);
            convertedAngle=degreeToRadian(parseInt(currentAngle));
            newCurrent=current.replace(currentAngle, convertedAngle.toString());
            current=newCurrent;
            index=endAngle+1;
        }
        index++;
    }
}
function del_ins() {
    //Insert function
    if(second) {
        cursor.insert = !cursor.insert;
        console.log("Insert is", cursor.insert);
    }
    //Delete Function
    else {
        if(cursor.cursorPos == 0) {
            current = current.substring(1, current.length);
        }
        else if(cursor.cursorPos == current.length-1) {
            current = current.substring(0, current.length-1);
        }
        else {
            current = current.substring(0, cursor.cursorPos)
                        + current.substring(cursor.cursorPos+1, current.length);
        }
        setBottomRow(current);
    }
}
function log_antiLog() {
    if(second) {
        concatStatement("10**");
    }
    else {
        concatStatement("Math.log10(");
    }
}
function fact_fracDec() {
    if(second) {

    }
    else {
        concatStatement("factorial(");
    }
}
function factorial(num) {
    if(num==0 || num == 1) {
        return 1;
    }
    for(let i = num - 1; i >= 1; i--) {
        num *= i;
    }
    return num;
}
function degRad_coord() {
    degreeMode.active=true;
    clearScreen();
    current="° r";
    setBottomRow(current);
}
function natLog_antiNatLog() {
    if(second) {
        concatStatement("Math.E**");
    }
    else {
        concatStatement("Math.log(");
    }
}
function mixedFrac_convertFrac() {
    concatStatement("X+n/d");
    cursor.insert = true;
    cursor.replace = true;
    while(cursor.cursorPos > 0) {
        moveLeft();
    }
}
function pi_hyp() {
    if(second) {
        hyp = true;
    }
    else {
        concatStatement("Math.PI");
    }
}
function sinArcSin() {
    if(second) {
        if(hyp) {
            concatStatement("Math.asinh(");
            hyp = false;
        }
        else {
            concatStatement("Math.asin(");

        }
    }
    else {
        if(hyp) {
            concatStatement("Math.sinh(");
            hyp = false;
        }
        else {
            concatStatement("Math.sin(");
        }
    }
}
function cosArcCos() {
    if(second) {
        if(hyp) {
            concatStatement("Math.acosh(");
            hyp = false;
        }
        else {
            concatStatement("Math.acos(");
        }
    }
    else {
        concatStatement("Math.cos(");
    }
}
function tanArcTan() {
    if(second) {
        if(hyp) {
            concatStatement("Math.atanh(");
            hyp = false;
        }
        else {
            concatStatement("Math.atan(");
        }
    }
    else {
        if(hyp) {
            concatStatement("Math.tanh(");
            hyp = false;
        }
        else {
            concatStatement("Math.tan(");
        }
    }
}
function clearScreen(){
    current="";
    setTopRow(current);
    setBottomRow(current);
    resetCursor();
    enableCursor();
    cursor.cursorRow=0;
}
function power_xRoot() {
    if(second) {

    }
    else {
        concatStatement("**");
    }
}
function recip_expo() {
    if(second) {

    }
    else {
        concatStatement("**-1");
    }
}
function leftP_percent() {
    if(second) {

    }
    else {
        concatStatement('&#x28');
    }
}
function rightP_comma() {
    if(second) {
        concatStatement(",");
    }
    else {
        concatStatement('&#x29');
    }
}
function square_squareRoot() {
    if(second) {

    }
    else {
        concatStatement("**2");
    }
}
function memVar_clrVar() {
    if(second) {

    }
    else {

    }
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