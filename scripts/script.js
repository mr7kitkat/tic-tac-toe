/*
1. Start with X or O
2. Change one move after each input
3. on Each input check for winning from that cell
4. If win than show you win else if loose than show you loose else continue
5. If maximum limit reached than show Draw and 
*/

(function () {
  // ---------------------------------------------MODEL ----------------------------------------
  function createMaze(num) {
    if (num < 3) {
      return;
    }

    const arr = [];
    for (let i = 0; i < num; i++) {
      arr.push(Array(num).fill());
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
  function checkValidation(inputArray, input, row, col) {
    function validateRow(inputArray, row, input) {
      return inputArray[row].every((item) => item === input);
    }

    function validateCol(inputArray, col, input) {
      return inputArray.every((item) => item[col] === input);
    }

    function getDiagonalAxis(inputArray) {
      const left = [];
      const right = [];

      let len = inputArray.length - 1;
      for (let row = 0; row <= len; row++) {
        left.push(inputArray[row][row]);
        right.push(inputArray[row][len - row]);
      }

      return [left, right];
    }

    function validateCrossSides(inputArray, input) {
      if (inputArray.length % 2 === 0) {
        return;
      }
      const diagonalAxis = getDiagonalAxis(inputArray);
      return diagonalAxis.some((subAry) =>
        subAry.every((item) => item === input)
      );
    }

    return (
      validateRow(inputArray, row, input) ||
      validateCol(inputArray, col, input) ||
      validateCrossSides(inputArray, input) ||
      false
    );
  }

  // ---------------------------------HELPER FUNCTION---------------------------------------
  function getRC(event) {
    const RC = event.target.dataset["rc"];
    return RC.split(",").map((num) => Number(num));
  }

  // update array based on input
  function updateArray(event, inputArray, currentInput) {
    const [row, col] = getRC(event);

    if (!inputArray[row][col]) {
      inputArray[row][col] = currentInput;
      return inputArray[row][col];
    }

    return;
  }

  // -------------------------------------------VIEW ----------------------------------------------
  function generateMazeGridFromArray(inputArray, parentElement) {
    let innerHtml = "";

    inputArray.forEach((row, ridx) => {
      row.forEach((col, cidx) => {
        innerHtml += `
        <div class="cell border-for-maze flex justify-center align-center" data-rc="${ridx},${cidx}">
          <img src="" alt="">
        </div>
        `;
      });
    });

    parentElement.innerHTML = innerHtml;
    parentElement.style.gridTemplateColumns = `repeat(${inputArray.length}, 1fr)`;
    parentElement.style.gridTemplateRows = `repeat(${inputArray.length}, 1fr)`;
  }

  function updateImage(cellValue, imageElement) {
    const path = "./images/";
    const circle = "circle.svg";
    const cross = "cross.svg";

    let imageUpdate = 1;
    let imageSrcValue;
    if (cellValue === "x") {
      imageSrcValue = path + cross;
    } else if (cellValue === "o") {
      imageSrcValue = path + circle;
    } else {
      imageSrcValue = "";
      imageUpdate = 0;
    }

    imageElement.src = imageSrcValue;
    return imageUpdate;
  }

  function highlightCurrentPlayer(currentInput) {
    const players = document.querySelector(".players");
    [...players.children].forEach((player) =>
      player.classList.remove("mthighlight")
    );

    players.querySelector(`#p${currentInput}`).classList.add("mthighlight");
  }

  function showWinning(status, currentInput) {
    const conclusion = document.querySelector(".conclusion");
    const img = conclusion.querySelector("img");
    img.classList.add("remove");

    if (status === "win") {
      conclusion.classList.remove("remove");
      img.classList.remove("remove");
      updateImage(currentInput, img);
      conclusion.querySelector(".messege p").textContent = "Wins!";
    }

    if (status === "draw") {
      conclusion.classList.remove("remove");
      conclusion.querySelector(".messege p").textContent = "It's Draw";
    }
  }
  // --------------------------------------------CONTROLLER ---------------------------------------------

  // Workflow Controller -------------------------------------------------------------------------
  // Defauts
  function startGame() {
    const conclusion = document.querySelector(".conclusion");
    conclusion.classList.add("remove");

    const mazeSize = 3;
    const inputManager = gameInput();
    highlightCurrentPlayer(inputManager.currentInput());

    const mazeArray = createMaze(mazeSize);
    const mazeElement = document.querySelector(".maze");

    generateMazeGridFromArray(mazeArray, mazeElement);

    let counter = 0;
    // Handling Clicks
    const cells = document.querySelectorAll(".cell");

    cells.forEach((cell) => {
      cell.addEventListener("click", (eventAttr) => {
        const cellValue = updateArray(
          eventAttr,
          mazeArray,
          inputManager.currentInput()
        );

        if (cellValue) {
          counter += updateImage(cellValue, cell.querySelector("img"));

          if (counter > mazeArray.length * 2 - 2) {
            const [row, col] = getRC(eventAttr);
            const currentInput = inputManager.currentInput();
            const validation = checkValidation(
              mazeArray,
              currentInput,
              row,
              col
            );

            let status = "";
            if (validation) {
              status = "win";
            } else if (counter === mazeArray.length ** 2 && !validation) {
              status = "draw";
            }

            setTimeout(() => {
              showWinning(status, currentInput);
            }, 800);
          }

          inputManager.changeInput();
          highlightCurrentPlayer(inputManager.currentInput());
        }
      });
    });
  }

  window.addEventListener("load", startGame);
  const replayBtn = document.querySelector("button.replay");
  replayBtn.addEventListener("click", startGame);
  // ----------------------------------------------------------------------------------------------------
})();
