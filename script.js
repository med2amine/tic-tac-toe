const gameBoard = (function (){
    const board = Array.from({length : 3},()=> Array(3).fill(null))
    let numplace = 0

    function placeMark(x,o,mark){
        if (board[x][o] === null){
            board[x][o] = mark
            numplace++
            return true
        }
        return false
    }

    function getBoard(){
        const copyBoard = structuredClone(board)
        return copyBoard
    }

    function reset(){
        board.forEach(row=>row.fill(null))
        numplace = 0
        return true
    }

    function isFull(){
        if (numplace === 9){
            return true
        }
        return false
    }

    function getCell(x,o){
        return board[x][o]

    }

    return {
       placeMark,
       getBoard,
       reset,
       isFull,
       getCell
   };


})()

function createPlayer(name, mark) {
    let playerName = name;
    return {
        getName: () => playerName,
        getMark: () => mark,
        setName: (newName) => { playerName = newName; }
    };
}

const gameController = (function(){
    const playerOne = createPlayer('Player 1','X')
    const playerTwo = createPlayer('Player 2','O')
    const winPositions = [
            [[0,0],[0,1],[0,2]],
            [[1,0],[1,1],[1,2]],
            [[2,0],[2,1],[2,2]],
            [[0,0],[1,0],[2,0]],
            [[0,1],[1,1],[2,1]],
            [[0,2],[1,2],[2,2]],
            [[0,0],[1,1],[2,2]],
            [[0,2],[1,1],[2,0]]
        ]
    let gameOver = false
    let currentPlayer = playerOne

    function getCurrentPlayer(){
        return currentPlayer
    }

    function switchTurn(){
        if (getCurrentPlayer() === playerOne){
            currentPlayer = playerTwo
        }else{
            currentPlayer = playerOne
        }
    }
    
    function checkWinner(){
        const Board = gameBoard.getBoard()
        for (let i = 0 ; i<winPositions.length ; i++ ){
            if (Board[winPositions[i][0][0]][winPositions[i][0][1]] === Board[winPositions[i][1][0]][winPositions[i][1][1]] &&
                Board[winPositions[i][0][0]][winPositions[i][0][1]] === Board[winPositions[i][2][0]][winPositions[i][2][1]] &&
                Board[winPositions[i][0][0]][winPositions[i][0][1]] !== null){
                    gameOver = true
                    return playerOne.getMark() === Board[winPositions[i][0][0]][winPositions[i][0][1]] ? 'X' : 'O'
                }
        }
        return null; 
    }
    
    function checkTie(){
        return gameBoard.isFull() && !checkWinner()
    }

    function resetGame(){
        gameBoard.reset()
        gameOver = false
        currentPlayer = playerOne
        return true
    }

    function getGameStatus(){
        return {
            gameOver,
            winner : checkWinner(),
            tie : checkTie()
        }
    }

    function playRound(x,o){
        if (gameOver === true){
            return false
        }
        const placed = gameBoard.placeMark(x,o,currentPlayer.getMark())
        
        if (!placed){
            return false
        }
 
        if (checkWinner()){
            gameOver = true
        }else if (checkTie()){
            gameOver = true
        }else{
            switchTurn()
        }
        return getGameStatus()
    }

    function setPlayerNames(name1, name2) {
        playerOne.setName(name1);
        playerTwo.setName(name2);
    }

    return {
        getCurrentPlayer,
        playRound,
        getGameStatus,
        resetGame,
        setPlayerNames
    };
})()

const squares = document.querySelectorAll('.square')
const turnDisplay = document.getElementById('turn')
const resultDisplay = document.getElementById('result')
const restartButton = document.querySelector('.start-restart')
const playerOneInput = document.getElementById('playerOneName')
const playerTwoInput = document.getElementById('playerTwoName')


const displayController = (function() {
    function renderBoard(){
        const board = gameBoard.getBoard()
        
        squares.forEach((square,index) =>{
            let row = +square.dataset.row
            let col = +square.dataset.col
            square.textContent = board[row][col]
        })
    }

    function updateTurnDisplay(){
        let currentP = gameController.getCurrentPlayer()
        turnDisplay.textContent = `${currentP.getName()}'s turn`
    }

    function updateResultDisplay(){
        let status = gameController.getGameStatus()
        if (status.gameOver && status.winner === 'X'){
            resultDisplay.textContent = 'Player 1 won'
        } else if (status.gameOver && status.winner === 'O'){
            resultDisplay.textContent = 'Player 2 won'
        } else if (status.gameOver && status.tie === true){
            resultDisplay.textContent = "It's a tie"
        }
    }

    function handleSquareClick(event){
        const square = event.target
        let row = +square.dataset.row
        let col = +square.dataset.col
        gameController.playRound(row,col)
        renderBoard()
        updateTurnDisplay()
        updateResultDisplay()
    }

    function handleRestartClick() {
        const p1Name = playerOneInput.value || 'Player 1';
        const p2Name = playerTwoInput.value || 'Player 2';

        gameController.setPlayerNames(p1Name, p2Name);
    
        gameController.resetGame();
        renderBoard();
        updateTurnDisplay();
        resultDisplay.innerHTML = '';
    }

    function init(){
        squares.forEach(square => square.addEventListener('click',handleSquareClick))
        restartButton.addEventListener('click',handleRestartClick)
        renderBoard()
    }

    return {init}

})();

displayController.init()