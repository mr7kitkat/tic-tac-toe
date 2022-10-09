/*
1. Start with X or O
2. Change one move after each input
3. on Each input check for winning from that cell
4. If win than show you win else if loose than show you loose else continue
5. If maximum limit reached than show Draw and 
*/

function createMaze(num) {
  if (num < 3) {
    return;
  }
  return Array(num).fill(Array(num).fill(null));
}

// 1. Start with X or O
// 2. Change one move after each input
function gameInput() {
  let input = "x";

  return {
    currentInput() {
      return input;
    },
    nextInput() {
      return input === "x" ? "o" : "x";
    },
    changeInput() {
      input = this.nextInput();
    },
  };
}

// 3. on Each input check for winning from that cell
function checkValidation(ary, input, row, col) {
  function validateRow(ary, row, input) {
    return ary[row].every((item) => item === input);
  }

  function validateCol(ary, col, input) {
    return ary.every((item) => item[col] === input);
  }

  function getDiagonalAxis(ary) {
    const diagonalAry = {
      left: [],
      right: [],
    };

    let len = ary.length - 1;
    for (let row = 0; row <= len; row++) {
      diagonalAry.left.push(ary[row][row]);
      diagonalAry.right.push(ary[row][len - row]);
    }

    return diagonalAry;
  }

  function validateCrossSides(ary, input) {
    if (ary.length % 2 === 0) {
      return;
    }
    const diagonalAxis = getDiagonalAxis(ary);
    console.log(diagonalAxis);

    const left = diagonalAxis["left"].every((item) => item === input);
    const right = diagonalAxis["right"].every((item) => item === input);
    return left || right;
  }
}

console.log(validateCrossSides(arr, 0));
