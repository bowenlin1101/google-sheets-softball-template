const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const positions = ["CF", "LF", "RF", "RR", "LR", "1", "2", "3", "C","SS"];

function INNINGS(innings){
  var number = 0;
  for (i of innings[0]) {
    if (String(i).replace(/ /g,"") != "") {
      number++;
    }
  }
  return number;
}

function POSITIONS(lineup) {
  var missing = [...positions];
  var lineupPos = [];
  for (i of lineup) {
    if (String(i[0]).replace(/ /g,"") != "") {
      lineupPos.push(String(i[0]).replace(/ /g,""));
    }
  }
  var output = "";

  for (i of lineupPos){
    if (missing.includes(i)){
      missing.splice(missing.indexOf(i),1);
    } else if (!missing.includes(i) && positions.includes(i)){
      return `${i} is duplicated`;
    } 
  }
  for (i of missing) {
    output += `${i} `;
  }
  return output;
}

function GIRLS(names, lineup) {
  var number = 0;
  var girlLines = [];
  var lineupPos = [];
  for (i of lineup) {
    lineupPos.push(String(i[0]));
  }

  for (var i = 0; i < names.length; i++) {
    if (names[i][0].includes("*")){
      girlLines.push(parseInt(i));
    }
  }

  for (i of girlLines) {
    if (lineupPos[i].replace(/ /g,"") != ""){
      number++;
    }
  }
  return number;
}

function createTemplate() {
  //Define Active Sheet
  var app = SpreadsheetApp;
  var ss = app.getActiveSpreadsheet();
  var activeSheet = ss.getActiveSheet();
  //Define Input Prompt
  var startPrompt = SpreadsheetApp.getUi().prompt("Put first cell (ex. D2)");
  var endPrompt = SpreadsheetApp.getUi().prompt("Number of players");
  if (startPrompt.getSelectedButton() == SpreadsheetApp.getUi().Button.OK && endPrompt.getSelectedButton() == SpreadsheetApp.getUi().Button.OK){
    var start = startPrompt.getResponseText().replace(/ /g,"");
    var end = `${alphabet[alphabet.indexOf(start.slice(0,1))+7]}${parseInt(endPrompt.getResponseText().replace(/ /g,""))+ parseInt(start.slice(1,start.length))}`;
    var field = activeSheet.getRange(`${start}:${end}`).getValues();

    //Define player names
    var namesRange = `${alphabet[alphabet.indexOf(start.slice(0,1)) - 1]}${parseInt(start.slice(1,start.length))+1}:${alphabet[alphabet.indexOf(start.slice(0,1)) - 1]}${end.slice(1,end.length)}`;
    activeSheet.getRange(`${alphabet[alphabet.indexOf(start.slice(0,1)) - 1]}${parseInt(start.slice(1,start.length))}`).setValue("Names")

    //Put in the Inning Counters
    for (var i = 0; i < field.length; i++){
      var row = i + parseInt(start.slice(1, start.length));
      var letter = alphabet[alphabet.indexOf(end.slice(0,1)) + 1];
      activeSheet.getRange(`${letter}${row}`).setFormula(`=INNINGS(${start.slice(0,1)}${row}:${end.slice(0,1)}${row})`);
    }
    activeSheet.getRange(`${letter}${parseInt(start.slice(1, start.length))}`).setValue("Innings:");
    //Add inning numbers
    for (var i = 0; i < 8; i++) {
      activeSheet.getRange(`${alphabet[alphabet.indexOf(start.slice(0,1))+i]}${parseInt(start.slice(1, start.length))}`).setValue(`${i + 1}`)
    }

    //Put in the Position Counters
    for (var i = 0; i < field[0].length; i++) {
      var row = field.length + parseInt(start.slice(1, start.length));
      var letter = alphabet[i + alphabet.indexOf(start.slice(0,1))];
      activeSheet.getRange(`${letter}${row}`).setFormula(`=POSITIONS(${letter}${parseInt(start.slice(1, start.length))+1}:${letter}${row-1})`);
      activeSheet.getRange(`${alphabet[alphabet.indexOf(start.slice(0,1))-1]}${row}`).setValue("Missing:")
    }
    
    //Put in the Girl Checkers
    for (var i = 0; i < field[0].length; i++) {
      var row = field.length + parseInt(start.slice(1, start.length));
      var letter = alphabet[i + alphabet.indexOf(start.slice(0,1))];
      activeSheet.getRange(`${letter}${row + 1}`).setFormula(`=GIRLS(${namesRange},${letter}${parseInt(start.slice(1, start.length))+1}:${letter}${row-1})`);
      activeSheet.getRange(`${alphabet[alphabet.indexOf(start.slice(0,1))-1]}${row+1}`).setValue("# Girls:")
    }
  }
}
