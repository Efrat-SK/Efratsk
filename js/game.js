'use strict'


var gLevel = {
    SIZE: 4,
    MINES: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0, ////////////////////////////////////////////////////////////////////////////////////////
    minesRevealed: false
}

var gNumNonMineCell = gLevel.SIZE ** 2 - gLevel.MINES
console.log('nonMine', gNumNonMineCell)


const MINE = '<img src="img/Mine.jpg"/>'
const FLAG = '<img src="img/Flag.jpg"/>'



var gBoard = buildBoard()
var gMinesLocations

var gStartTime
var gameInterval

function init() {

    console.log('gBoard: ', gBoard)///////////////////////////////////////////////////to cut
    renderBoard(gBoard)

}


function buildBoard() {

    //creat table
    var board = createBoard(gLevel.SIZE)

    //set mines rundomly
    locateMines(gLevel.MINES, board)

    //setMinesNegsCount(board)
    setMinesNegsCount(board)

    return board
}

function locateMines(howManyMine, board) { //////////////////////////////////////////////////cut

    gMinesLocations = []

    for (var i = 0; i < howManyMine; i++) {
        var randomCell = getRandomEmpyCell(board)
        board[randomCell.i][randomCell.j].isMine = true
        gMinesLocations.push(randomCell)
    }
    console.log('gMinesLocations: ', gMinesLocations) /////////////////////////////////////////////

}

function getRandomEmpyCell(board) {
    const emptyCells = []

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {

            if (!board[i][j].isMine) {
                emptyCells.push({ i, j })
            }
        }
    }
    const idx = getRandomInt(0, emptyCells.length)
    return emptyCells[idx]
}

function setMinesNegsCount(board) {

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {

            var coantNeg = countNeighbors(i, j, board)
            board[i][j].minesAroundCount = coantNeg
        }
    }
}


function timer() { /////////////////////////////////////////////////////////////to improve
    var currTime = new Date().getTime()
    var timePassed = new Date(currTime - gStartTime)

    var elTimer = document.querySelector('.timer')

    var mins = timePassed.getMinutes() < 10 ? '0' : ''
    var secs = timePassed.getSeconds() < 10 ? '0' : ''

    var milSecs = timePassed.getMilliseconds() < 100 ? (timePassed.getMilliseconds() < 10 ? '00' : '0') : ''

    elTimer.innerText = `Game time:
    ${mins + timePassed.getMinutes()}:${secs + timePassed.getSeconds()}:${timePassed.getMilliseconds() + milSecs}`
}


function cellLeftClicked(elCell, i, j) {

    isFirstClick()
    if (!gGame.isOn) return

    //if mine - show all mines , end game
    if (gBoard[i][j].isMine) {
        for (var i = 0; i < gMinesLocations.length; i++) {
            var mineLocation = gMinesLocations[i]

            var selector = `[data-i="${mineLocation.i}"][data-j="${mineLocation.j}"]`
            elCell = document.querySelector(selector)
            renderCell(elCell, MINE)
        }
        gGame.minesRevealed = true
        endGame()
        return
    }

    

    //if flag or showen - do nothing
    if (gBoard[i][j].isMarked || gBoard[i][j].isShown) {
        return
    }

    //if number - show number
    else if (!gBoard[i][j].isMine && gBoard[i][j].minesAroundCount > 0) {
        gBoard[i][j].isShown = true
        renderCell(elCell, gBoard[i][j].minesAroundCount)
        gGame.shownCount++
    }
    //if empy -  //nigberloop showing
    else {
        gBoard[i][j].isShown = true
        gGame.shownCount++
    }


    checkGameOver()
}


function cellRightClicked(elCell, i, j) {
    isFirstClick()
    if (!gGame.markedCount) return
    cellMarked(elCell, i, j)
    checkGameOver()
}

function cellMarked(elCell, i, j) { //////////////////////////////web

    //if marked - remove mark
    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false
        renderCell(elCell, '')
        gGame.markedCount--
    }
    //if not marked - mark
    else if (!gBoard[i][j].isMarked && !gBoard[i][j].isShown) {
        gBoard[i][j].isMarked = true
        renderCell(elCell, FLAG)
        gGame.markedCount++
    }
}

function isFirstClick() {
    //if first click - change gGame.isOn = true
    if (gGame.shownCount === 0 && gGame.markedCount === 0 && !gGame.minesRevealed) {
        gGame.isOn = true

        gStartTime = new Date().getTime()
        gameInterval = setInterval(timer, 31)
    }
}



function checkGameOver() {
    //TODO
    //if all mines are marked and all oter cell shown
    console.log('gGame.shownCount: ', gGame.shownCount)
    if (gGame.markedCount === gLevel.MINES && gGame.shownCount === gNumNonMineCell) {
        console.log('win!')
        clearInterval(gameInterval)
        gGame.isOn = false
    }


}

function endGame() {
    clearInterval(gameInterval)
    gGame.isOn = false
    console.log('game over...')

}