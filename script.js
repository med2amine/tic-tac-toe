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

function createPlayer(name,mark){
    return {
        getName : () => name,
        getMark : () => mark
    }
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
                    return playerOne.mark === Board[winPositions[i][0][0]][winPositions[i][0][1]] ? 1 : 2
                }
        }
        return null; 
    }
    
    function playRound(x,o){
        
    }
})()
