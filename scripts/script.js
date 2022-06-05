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
const mazeAry = generateMaze(main, 3);

// on click event add icon to svg
const cells = document.querySelectorAll(".cell");
let currentMove = './images/cross.png';

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
    
            console.table(validateCol(mazeAry, row, col));    
        }

    })
})



function validateRow(ary, row, col) {
    const clickedCell = ary[row][col];
    const check = ary[row].every(item => {
        return item === clickedCell;
    });

    return check ? clickedCell : false;
}



function validateCol(ary, row, col) {
    const clickedCell = ary[row][col];
    let flag = false;
    for (let i = 0; i < ary.length; i++) {
        if (ary[i][col] === clickedCell) {
            flag = true;
        }else {
            flag = false;
        }
    }

    return flag ? clickedCell : false;
}

