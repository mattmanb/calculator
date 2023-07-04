power=false;
current="";
const operators = new Set(['+','-','*','/']);
memory = {
    previousStatement:"0",
    previousAnswer:"0",
    precedingStatement:"0",
    precedingAnswer:"0"
}
function togglePower(){
    //This function 
    power =! power;
    if(power) {
        document.getElementById('screen').style.backgroundColor = "white";
        document.getElementById('displayOne').style.display = "block";
        document.getElementById('displayTwo').style.display = "block";
        console.log('Power On...')
    }
    else {
        document.getElementById('screen').style.backgroundColor = "grey";
        document.getElementById('displayOne').style.display = "none";
        document.getElementById('displayTwo').style.display = "none";
        console.log('Power Off...');
    }
}
function setTopRow(topDisplay){
    document.getElementById('displayOne').innerHTML = topDisplay;
}
function setBottomRow(bottomDisplay){
    document.getElementById('displayTwo').innerHTML = bottomDisplay;
}
function concatStatement(nextChar) {
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
}
function readStatement(){//interprets a math problem
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
}