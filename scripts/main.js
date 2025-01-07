function customPlugins() {
    // it takes the array, loop over it and return another array with mapping
    function getMapping(ary) {
        const size = ary.length;

        const board = ary;
        const column = [];
        const diagonal = [];

        for (let row = 0; row < size; row++) {
            for (let cell = 0; cell < size; cell++) {
                if (!column[cell]) {
                    column[cell] = []
                }

                if (row == cell) {
                    if (!diagonal[0]) {
                        diagonal[0] = []
                    }
                    diagonal[0][row] = board[row][cell];
                }
                column[cell][row] = board[row][cell];
            }
        }

        diagonal[1] = []

        diagonal[1][0] = board[2][0];
        diagonal[1][1] = board[1][1];
        diagonal[1][2] = board[0][2];

        return [...board, ...column, ...diagonal]

    }

    // it runs over all the mapping with target and checks if any 
    // mapping contains the target 3 times 
    function validation(mapping, target) {
        for (let i = 0; i < mapping.length; i++) {
            const status = mapping[i].every(item => item === target)
            if (status === true) return true
        }
        return false
    }

    // custom render logic to run the game in console
    function terminalRender(inputObj) {
        return function () {
            console.log("Score: ")
            console.log(`❌:${inputObj["score"]["❌"]}`)
            console.log(`⭕:${inputObj["score"]["⭕"]}`)
            console.log("--------------------------------");
            console.log(`Current turn: ${inputObj.turn}`);
            console.table(inputObj.maze)
        }
    }

    return {
        getMapping, validation, terminalRender
    }
}

function Board(plugins) {
    // INITILIZATIONS 
    const boardInfo = {
        maze: [],
        size: 3,
        turn: "❌",
        round: 0,
        allowInput: true,
        winner: null,
        score: {
            "❌": 0,
            "⭕": 0
        }
    }


    // adding logic plusins
    const getMapping = plugins.getMapping;
    const validation = plugins.validation;
    const terminalRender = plugins.terminalRender(boardInfo);


    function initializeMaze() {
        for (let row = 0; row < boardInfo.size; row++) {
            boardInfo.maze[row] = [];
            for (let cell = 0; cell < boardInfo.size; cell++) {
                boardInfo.maze[row][cell] = null;
            }
        }

        boardInfo.round++;
        boardInfo.turn = "❌";
        boardInfo.allowInput = true;
        boardInfo.winner = null;

    }

    // first run
    initializeMaze();

    // all the other helper function
    // get maze
    function getMaze() {
        return boardInfo.maze;
    }

    // change turns after each successful move
    function changeTurn() {
        boardInfo.turn = boardInfo.turn === "❌" ? "⭕" : "❌";
    }

    // winner 
    function getCurrentMove() {
        return boardInfo.turn;
    }

    function getScore() {
        return boardInfo.score;
    }

    // allow game to stop if winner is decided
    function stopInput() {
        boardInfo.allowInput = false;
    }


    // winner 
    function getWinner() {
        return boardInfo.winner;
    }

    // checks winner on each input with 2 custom functions
    function checkWinner(target, mappingFucn, validationFuc) {
        const maze = boardInfo.maze;
        const mapping = mappingFucn(maze);
        return validationFuc(mapping, target);
    }

    // this is the main returned logic of the game with controls game
    function mark(row, col, input = boardInfo.turn) {
        // take user inputs only if it is allowed
        if (boardInfo.allowInput) {
            // check if maze is not filled and input is matching with the current turn
            if (boardInfo.maze[row][col] === null && input === boardInfo.turn) {
                boardInfo.maze[row][col] = input;
                // check for winner after input 
                // if any winner found then stop taking inputs
                const gotOurWinner = checkWinner(input, getMapping, validation);
                if (gotOurWinner) {
                    boardInfo.winner = input;
                    boardInfo["score"][input]++;
                    stopInput();
                    return boardInfo.winner;
                }
                // render current state and change turns
                changeTurn();

            }
        }
        return false;
    }

    return {
        mark,
        terminalRender,
        getWinner,
        getMaze,
        getCurrentMove,
        initializeMaze,
        getScore
    }
}

function View() {

    // return dom node as text for a Cell
    function Cell(row, col, value) {
        const visualValue = value === null ? "" : value;

        return `
            <div class="cell flex" data-value=${value} data-row=${row} data-col=${col}>
                <span>${visualValue}</span>
            </div>
            `
    }

    // Construct DOM elements from maze object and a parent node
    function initializeMaze(maze, theParentNode) {
        const size = maze.length;
        let divs = "";
        for (let row = 0; row < size; row++) {
            for (let cell = 0; cell < size; cell++) {
                const value = maze[row][cell];
                divs += Cell(row, cell, value);
            }
        }

        theParentNode.innerHTML = divs;
        return [...theParentNode.children];
    }


    function renderMaze(maze, winStatus, theParentNode, eventHandler) {
        const mazeItems = initializeMaze(maze, theParentNode);

        mazeItems.forEach(cell => {
            if (!winStatus) {
                cell.addEventListener("click", eventHandler);
            }
            else {
                cell.removeEventListener("click", eventHandler);
            }
        });
    }

    function handleWinSituation(dialogBoxElement, winner, replayFunc) {
        dialogBoxElement.showModal();
        // dialogBoxElement selectors
        const winnerElement = dialogBoxElement.querySelector("h2 #winner");
        const replay = dialogBoxElement.querySelector("#replay");
        const closeDialog = dialogBoxElement.querySelector("#close");

        // setting our winner
        winnerElement.innerText = winner;

        replay.addEventListener("click", function () {
            dialogBoxElement.close();
            replayFunc();
        })
        closeDialog.addEventListener("click", function () {
            dialogBoxElement.close();
        });
    }

    function highlightCurrent(scoreParentElement, currentTurn, scoreObj) {
        const playerScores = [...scoreParentElement.children];

        playerScores.forEach(player => {
            player.classList.remove("active");
        })

        playerScores.forEach(player => {
            if (player.dataset.id === currentTurn) {
                player.classList.add("active")
            }

            const scoreElem = player.querySelector(".score");
            scoreElem.dataset.score = scoreObj[player.dataset.id];
            scoreElem.innerText = scoreObj[player.dataset.id];
        })
    }


    return {
        renderMaze, handleWinSituation, highlightCurrent
    }

}




function App(mazeElement, dialogBoxElement) {
    const gameBoard = Board(customPlugins());
    const viewEngine = View();

    function replayGame() {
        gameBoard.initializeMaze();
        render();
    }

    function renderEventHandler() {
        const { row, col } = this.dataset;
        gameBoard.mark(row, col);
        const winner = gameBoard.getWinner();
        if (winner) {
            viewEngine.handleWinSituation(dialogBoxElement, winner, replayGame)
        }
        else {
            render();
        }
    }


    function render() {
        const maze = gameBoard.getMaze();
        const winner = gameBoard.getWinner();
        const currentTurn = gameBoard.getCurrentMove();
        const scoreObj = gameBoard.getScore();

        viewEngine.renderMaze(maze, winner, mazeElement, renderEventHandler)
        viewEngine.highlightCurrent(scoreParentElement, currentTurn, scoreObj);
    }

    render()
}

const mazeElement = document.querySelector(".maze");
const dialogElement = document.querySelector("dialog");
const scoreParentElement = document.querySelector(".score-board");

const game = App(mazeElement, dialogElement, scoreParentElement)