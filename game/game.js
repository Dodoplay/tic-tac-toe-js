// array to keep track of what is in each box of the board
var originalBoard;

const humanPlayer = 'O';
const computerPlayer = 'X';

//all possible comabinations to win
const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]


//select all elements with the ".cell" class (i.e. each box in the table)
const cells = document.querySelectorAll('.cell');
startGame();

function startGame(){
    document.querySelector(".endgame").style.display = "none";
    
    //make the array every number from 0 to 8
    originalBoard = Array.from(Array(9).keys());
    for(var i=0; i< cells.length; i++){
        cells[i].innerHTML = "";
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square){
    //if the box-table still contains a number, that
    //means neither player or computer clicked/chosed that box
    if(typeof originalBoard[square.target.id] == "number" ){
        turn(square.target.id, humanPlayer);
        if(!checkTie()){
            turn(bestSpot(), computerPlayer);
        }
    }
}

function turn(squareId, player){
    originalBoard[squareId] = player;
    document.getElementById(squareId).innerHTML = player;
    let gameWon = checkWin(originalBoard, player);
    if(gameWon){
        gameOver(gameWon);
    }
}

function checkWin(board, player){
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    
    let gameWon = null;
    for(let [index, win] of winCombinations.entries()){
        if(win.every(elem => plays.indexOf(elem) > -1)){
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon){
    for(let index of winCombinations[gameWon.index]){
        document.getElementById(index).style.backgroundColor = 
        gameWon.player == humanPlayer ? 'blue' : 'red';
    }

    for(var i = 0; i<cells.length; i++ ){
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == humanPlayer ? "You WIN!": "You LOSE!")
}


function emptySquare(){
    return originalBoard.filter( s=> typeof s == 'number');
}

//simple function that will help the computerPlayer (AI) choose
//it will just choose the first empty spot (one that still contains a number)
function bestSpot(){
    return emptySquare()[0];
}

function declareWinner(who){
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function checkTie(){
    //emptySquare().length == 0 means every box has been filled
    //we add !checkWin() in the condition, because if player's
    //move is the last, and it is in fact a win, without the check
    //it will be considered a tie because no other moves are possible
    if(emptySquare().length == 0){
        for(var i=0; i< cells.length; i++){
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        
        declareWinner("Tie Game!");
        return true;
    }
}
