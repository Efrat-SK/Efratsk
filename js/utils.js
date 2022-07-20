'use strict'


function createBoard(boardSize) {

    var board = []

    for (var i = 0; i < boardSize; i++) {
        board.push([])

        for (var j = 0; j < boardSize; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}

function renderBoard(board) {

    
    var strHTML = '<table border="1"><tbody>'

    for (var i = 0; i < board.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {

            var cell = ''
            if (board[i][j].isShown) {
                if (board[i][j].isMine) cell = MINE
                else cell = board[i][j].minesAroundCount

            } 
            // 
            
            strHTML += `<td class="cell" data-i="${i}" data-j="${j}" onclick="cellLeftClicked(this,${i},${j})" 
            oncontextmenu="javascript:cellRightClicked(this,${i},${j});return false;">${cell}</td>` 
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    const elContainer = document.querySelector('.board-container')  //
    elContainer.innerHTML = strHTML
}

function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue

        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= mat[i].length) continue
            if (mat[i][j].isMine) neighborsCount++
        }
    }
    return neighborsCount
}


function renderCell(elCell, value) {
    elCell.innerHTML = value
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}