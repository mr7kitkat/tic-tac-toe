const MAZE_BLOCK = document.querySelector("div.maze");


function Board() {
    // INITILIZATIONS
    const size = 3;
    const maze = [];
    let turn = 1;
    let allowInput = true;
    let gotOurWinner = false;

    for (let row = 0; row < size; row++) {
        maze[row] = [];
        for (let cell = 0; cell < size; cell++) {
            maze[row][cell] = null;
        }
    }

    renderArray()


    // helper function nor directly linked to board
    function showwinner() {
        
    }

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

    function validation(mapping, target) {
        for (let i = 0; i < mapping.length; i++) {
            const status = mapping[i].every(item => item === target)
            if (status === true) return true
        }
        return false
    }

    function getXO(num) {
        return num === 1 ? "❌" : "⭕"
    }

    function Cell(row, col, value) {
        const visualValue = value === null ? "" : getXO(value);

        return `
    <div class="cell" data-value=${value} data-row=${row} data-col=${col}>
        <span>${visualValue}</span>
    </div>
    `
    }

    function parseDom(maze, theParentNode) {
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



    function changeTurn() {
        turn = turn === 1 ? 0 : 1;
    }

    function stopInput() {
        allowInput = false;
    }


    function checkWinner(target, mappingFucn = getMapping, validationFuc = validation) {
        const mapping = mappingFucn(maze);
        return validationFuc(mapping, target);
    }


    function handler() {
        const rowValue = this.dataset.row;
        const colValue = this.dataset.col;
        mark(rowValue, colValue);
    }

    function renderArray() {
        const domNodes = parseDom(maze, MAZE_BLOCK);
        domNodes.forEach(domelement => {
            if (allowInput) {
                domelement.addEventListener("click", handler)
            }
            else {
                domelement.removeEventListener("click", handler)

            }
        })
    }

    function mark(row, col, input = turn) {
        // take user inputs only if it is allowed
        if (allowInput) {
            // check if maze is not filled and input is matching with the current turn
            if (maze[row][col] === null && input === turn) {
                maze[row][col] = input;
                // check for winner after input 
                // if any winner found then stop taking inputs
                gotOurWinner = checkWinner(input);
                if (gotOurWinner) {
                    stopInput();
                }
                // render current state and change turns
                renderArray()
                changeTurn()

            }
        }
        return false;
    }

    return { mark }
}





const game = Board()