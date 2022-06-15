(function(){
    let mod = {
        lastClick: 'x',
        winner: null,
        init: function() {
            this.cacheDOM();
            this.generateMaze(this.maze, 3);
            this.renderLastClick();
        },
        cacheDOM : function(){
            this.maze = document.querySelector("main");
            this.currMove = document.querySelector("header img");
            this.winStatus = document.querySelector(".win-status");
            this.winnerIMG = this.winStatus.querySelector(".winner-img");
            this.replayBTN = this.winStatus.querySelector(".replay");

        },
        getImg: function(lookupval) {
            let src;
            if(lookupval === 'x') {
                src = './images/cross.png'
            }else if (lookupval === 'o') {
                src = './images/circle.png'
            }
            return src;
        },
        render: function(ary) {
            for (let i = 0; i < ary.length; i++) {
                for (let j = 0; j < ary[i].length; j++) {
                    const cellElem = document.querySelector(`[data-cell="r${i}c${j}"]`)
                    const cell = ary[i][j];
                    let src = this.getImg(cell);
                    if(src) {
                        cellElem.setAttribute('src', src);
                    }
                }
            }
        },
        renderLastClick: function() {
            let src = this.getImg(this.lastClick);
            this.currMove.setAttribute("src", src);
        },
        generateMaze: function(parentElem, size) {
            this.mazeAry = [];
            parentElem.innerHTML = '';

            parentElem.style.cssText = `        
            grid-template-columns: repeat(${size}, 1fr);
            grid-template-rows: repeat(${size}, 1fr);
            `

            for(let i = 0; i < size; i++) {
                const arr = [];
                for(let j = 0; j < size; j++) {
                    parentElem.innerHTML += `<img src="" alt="" class="cell" data-cell="r${i}c${j}">`;
                    arr.push(null);
                }
                this.mazeAry.push(arr);
            }
            this.cells = document.querySelectorAll(".cell");
            this.watchClicks()
        },
        watchClicks() {
            this.cells.forEach(cell => {
                cell.addEventListener("click", (e) => {
                    if(!this.winner){
                        const cellVal = e.target.dataset.cell.split("");
                        let [, row, , col] = cellVal
                        row = +row;
                        col = +col;
                        
                        if(!this.mazeAry[row][col]) {
                            if(this.lastClick === 'x') {
                                this.mazeAry[row][col] = this.lastClick;
                                this.lastClick = 'o'
                            }
                            else if(this.lastClick === 'o') {
                                this.mazeAry[row][col] = this.lastClick;
                                this.lastClick = 'x'
                            }
                        }
                        this.winner = this.validation(this.mazeAry, row, col);
                    }
                    this.renderLastClick()
                    this.render(this.mazeAry)
                    this.showWin()

                })
            });
        },
        validation: function(ary, row, col) {
            function checkCells() {
                const maxidx = ary.length - 1;
                const clickedCell = ary[row][col];
                let valAry = Array(4).fill(true);
                for (let i = 0; i < ary.length; i++) {
                    // FOR ROW PART
                    const r = ary[i];
                    valAry[0] = r.every(item => item === clickedCell);
                    if (valAry[0]) {
                        break;
                    }
                    
                    if (ary[i][col] !== clickedCell) {
                        valAry[1] = false;
                    }
                    
                    if(ary[i][i] !== clickedCell) {
                        valAry[2] = false;
                    }
                    
                    if(ary[i][maxidx - i] !== clickedCell) {
                        valAry[3] = false;
                    }
                }
                const check = valAry.some(i => i === true);
                return check ? clickedCell : false;
            }

            const ret = checkCells();
            return ret;
        },        
        replay: function() {
            console.log(this)
            this.winner = null;
            this.lastClick = 'x';
            this.generateMaze(this.maze, 3);
            this.winnerIMG.setAttribute("src", '');
            this.winStatus.classList.remove("show");
        },
        showWin: function() {
            if (this.winner) {
                setTimeout(() => {
                    const img = this.getImg(this.winner);
                    this.winnerIMG.setAttribute("src", img);
                    this.winStatus.classList.add("show");
                },500)    
            }

            this.replayBTN.addEventListener("click", () => {
                this.replay()
            })
        }
    }

    mod.init();
})();

