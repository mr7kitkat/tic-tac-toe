// Generate maze using a number
function generateMaze(parentElem, size) {
    const mazeAry = []
    parentElem.innerHTML = '';

    parentElem.style.cssText = `        
    grid-template-columns: repeat(${size}, 1fr);
    grid-template-rows: repeat(${size}, 1fr);
    `

    for(let i = 0; i < size; i++) {
        const arr = [];
        for(let j = 0; j < size; j++) {
            parentElem.innerHTML += `<img src="" alt="" class="cell" data-row="${i}" data-col="${j}">`;
            arr.push(null);
        }
        mazeAry.push(arr);
    }

    return mazeAry;
}

const main = document.querySelector("main");
const currMove = document.querySelector("header img");
const mazeAry = generateMaze(main, 3);

// on click event add icon to svg
const cells = document.querySelectorAll(".cell");
let currentMove = './images/cross.png';
currMove.setAttribute("src", currentMove);

cells.forEach(cell => {
    cell.addEventListener("click", (e) => {
        const row = Number(e.target.dataset.row);
        const col = Number(e.target.dataset.col);


        if(!mazeAry[row][col]) {
            e.target.setAttribute('src', currentMove);

            if (currentMove.includes("cross")) {
                mazeAry[row][col] = 'x';
                currentMove = './images/circle.png';
            }else {
                mazeAry[row][col] = 'o';
                currentMove = './images/cross.png' ;
            }
            
            let winner = validation(mazeAry, row, col);
            if(winner === 'x') {
                currentMove = './images/cross.png' ;
                currMove.nextElementSibling.innerText = 'Wins!'
            }else if(winner === 'o') {
                currentMove = './images/circle.png' ;
                currMove.nextElementSibling.innerText = 'Wins!'
            }

            currMove.setAttribute("src", currentMove);
        }

    })
})





// Functions for Validation
function validation(ary, row, col) {
    const rowPart = validateRow(ary, row, col);
    const colPart = validateCol(ary, row, col);
    const ltrPart = ltrDiagonalMatch(ary, row, col);
    const rtlPart = rtlDiagonalMatch(ary, row, col);

    return rowPart || colPart || ltrPart || rtlPart || false;
}



function validateRow(ary, row, col) {
    const clickedCell = ary[row][col];
    const check = ary[row].every(item => {
        return item === clickedCell;
    });

    return check ? clickedCell : false;
}



function validateCol(ary, row, col) {
    const clickedCell = ary[row][col];
    let flag = true;
    for (let i = 0; i < ary.length; i++) {
        if (ary[i][col] !== clickedCell) {
            flag = false;
        }
    }

    return flag ? clickedCell : false;
}


function ltrDiagonalMatch (ary, row, col) {
    let ltrDiagonalCheck = true;
    const clickedCell = ary[row][col];

    for (let i = 0; i < ary.length; i++) {
        if(ary[i][i] !== clickedCell) {
            ltrDiagonalCheck = false;
        }
    }

    return ltrDiagonalCheck ? clickedCell : false;
}

function rtlDiagonalMatch (ary, row, col) {
    let rtlDiagonalCheck = true;
    const clickedCell = ary[row][col];

    const maxidx = ary.length - 1;
    for (let i = 0; i < ary.length; i++) {
        if(ary[i][maxidx - i] !== clickedCell) {
            rtlDiagonalCheck = false;
        }
    }

    return rtlDiagonalCheck ? clickedCell : false;
}

