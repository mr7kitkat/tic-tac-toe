/*
1. Start with X or O
2. Change one move after each input
3. on Each input check for winning from that cell
4. If win than show you win else if loose than show you loose else continue
5. If maximum limit reached than show Draw and 
*/

(function () {
  // MODEL ------------------------------------------------------------------------
  function createMaze(num) {
    if (num < 3) {
      return;
    }

    const arr = [];
    for (let i = 0; i < num; i++) {
      arr.push(Array(num).fill(null));
    }

    return arr;
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
      const left = [];
      const right = [];

      let len = ary.length - 1;
      for (let row = 0; row <= len; row++) {
        left.push(ary[row][row]);
        right.push(ary[row][len - row]);
      }

      return [left, right];
    }

    function validateCrossSides(ary, input) {
      if (ary.length % 2 === 0) {
        return;
      }
      const diagonalAxis = getDiagonalAxis(ary);
      return diagonalAxis.some((subAry) =>
        subAry.every((item) => item === input)
      );
    }

    return (
      validateRow(ary, row, input) ||
      validateCol(ary, col, input) ||
      validateCrossSides(ary, input) ||
      false
    );
  }

  // VIEW ------------------------------------------------
  function generateMazeGridFromArray(ary, parentElement) {
    let innerHtml = "";

    ary.forEach((row, ridx) => {
      row.forEach((col, cidx) => {
        innerHtml += `
        <div class="cell border-for-maze flex justify-center align-center" data-rc="${ridx},${cidx}">
          <img src="${
            col === "x"
              ? "./images/cross.svg"
              : col === "o"
              ? "./images/circle.svg"
              : ""
          }" alt="">
        </div>
        `;
      });
    });

    render(parentElement, innerHtml);
  }

  function render(parentElement, child) {
    parentElement.innerHTML = child;
  }

  const mainElement = document.querySelector(".maze");
  const mainAry = createMaze(3);
  mainAry[0][1] = "x";

  generateMazeGridFromArray(mainAry, mainElement);
})();
