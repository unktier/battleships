const row = 10;
const col = 10;

let newRow, newCell, gameActive, boardDestroy, allHits;

const table = document.querySelector('.grid');
const battleLog = document.getElementById('p1');
const battleDiv = document.querySelector('.battlelog');


class Ship {
    constructor(type, health, hits, status) {
        this.type = type;
        this.health = health;
        this.hits = hits;
        this.status = status;
    }

    checkPosition(align, toAdd) {

        // prevents ships from going over multiple rows

        this.pos = [this.pos];
        for (i = 0; i < this.health - 1; i++) {
            if (this.pos[i] < align) {
                this.pos.push(this.pos[i] + toAdd);
            } else {
                this.pos = [];
                this.randomiseShips();
            }
        }
    }

    randomiseShips() {

        // set ship to be on a random position on the board and set whether
        // they are horizontal or vertical
        // 0 = horizontal, 1 = vertical


        this.pos = Math.round(Math.floor(Math.random() * Math.floor(100)));
        this.alignment = Math.round(Math.floor(Math.random() * Math.floor(2)));
        

        if (this.alignment === 0) {
            this.checkPosition(99, 1);
        } else if (this.alignment === 1) {
            this.checkPosition(90, 10);
        }

        // prevents a ship from going off the table

        for (i = 0; i < this.health - 1; i++) {
            if  ((this.pos[i] - 9) % 10 === 0 &&
                (this.pos[i + 1] % 10 === 0)) {
                    this.randomiseShips();
                }
        }
    }      

}      
   

const ships = [];

ships.push(new Ship('Destroyer', 2));
ships.push(new Ship('Submarine', 3));
ships.push(new Ship('Cruiser', 3));
ships.push(new Ship('Battleship', 4));
ships.push(new Ship('Carrier', 5));

function generateBoard() {
    
    // create 10 x 10 table
    boardDestroy = true;
    
        for (i = 0; i < row; i++) {
            newRow  = table.insertRow(-1);
            for (y = 0; y < col; y++) {
                newCell = newRow.insertCell(0); 
                newCell.setAttribute('id', `a${i}${y}`);
            }
        }
    }


function createNewFlatArray(data) {

    let items = [];

    data.forEach(item => items.push(...item.pos));
    
    return items;
}


function noCollision(allShips) {

    // check whether there are duplicates

    while (new Set(createNewFlatArray(allShips)).size !== 
    createNewFlatArray(allShips).length)
    {
        // randomise everything again

        allShips.forEach(ship => {
            ship.randomiseShips(); 
        })
    }  
}


function shipDestroy() {

    ships.forEach(ship => {
        if (ship.hits === ship.health && ship.status === 1) {
            battleLog.innerHTML += `<p class="hit_red">${ship.type} has been destroyed</p>`;
            ship.status = 0;
        }
    })
}


function gameWin() {

    const winHits = ships.reduce((acc, totalHits) => {
        return acc + totalHits.health;
    }, 0);

    const currentHits = ships.reduce((acc, cHits) => {
        return acc + cHits.hits;
    }, 0);

    if (winHits === currentHits) {
        gameActive = false;
        battleLog.innerHTML += `<br>You destroyed all the ships within <strong>${allHits}</strong> turns. <div class="hit_green">You Win!</div>`;
        battleLog.innerHTML += `<p id="last">Play Again?</p>`;
        reButton();
    }
}


function reButton() {

    const restartButton = document.createElement('input');
    restartButton.type = 'button';
    restartButton.value = 'New Game';

    restartButton.setAttribute('class', 'restart');

    battleDiv.appendChild(restartButton);

    document.querySelector('.restart').addEventListener('click', newGame);

}


function newGame() {

    init();

}


table.addEventListener('click', attack);


function attack(e) {

    if (gameActive) {

        const cell = parseInt(e.target.id.substring(1, 3));

        if (e.target.style.background) {
            battleLog.innerHTML += `<p class="hit_blue">You already hit this location</p>`;
        } else  {
            hitDetection(e, cell);
            allHits++;
        }

        shipDestroy();
        gameWin();

    }         
}


function hitDetection(e, block) {    

    if (e.target.id) {
        e.target.style.background = '#003366';
    }

    ships.forEach(ship => {
        
        if (ship.pos.includes(block)) {
            e.target.style.background = 'red';
            ship.hits++;
        }
    })
}


function init() {
    gameActive = true;
    allHits = 0;

    if (boardDestroy) {
        document.getElementsByTagName('tbody')[0].parentNode
        .removeChild(document.getElementsByTagName('tbody')[0]);

        document.querySelector('.restart').remove();
    }

    boardDestroy = false;
    generateBoard();
    ships.forEach(ship => ship.randomiseShips());
    ships.forEach(ship => ship.hits = 0);
    ships.forEach(ship => ship.status = 1);
    noCollision(ships);

    battleLog.innerHTML = '';
    
}

init();

