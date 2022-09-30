/*

1.
Set up your project with HTML, CSS and Javascript files and get the Git repo all set up.

2.
You’re going to store the gameboard as an array inside of a Gameboard object, so start there! Your players are also going to be stored in objects… and you’re probably going to want an object to control the flow of the game itself.
Your main goal here is to have as little global code as possible. Try tucking everything away inside of a module or factory. Rule of thumb: if you only ever need ONE of something (gameBoard, displayController), use a module. If you need multiples of something (players!), create them with factories.

3.
Set up your HTML and write a JavaScript function that will render the contents of the gameboard array to the webpage (for now you can just manually fill in the array with "X"s and "O"s)

4.
Build the functions that allow players to add marks to a specific spot on the board, and then tie it to the DOM, letting players click on the gameboard to place their marker. Don’t forget the logic that keeps players from playing in spots that are already taken!

4a.
Think carefully about where each bit of logic should reside. Each little piece of functionality should be able to fit in the game, player or gameboard objects.. but take care to put them in “logical” places. Spending a little time brainstorming here can make your life much easier later!

5.
Build the logic that checks for when the game is over! Should check for 3-in-a-row and a tie.

6.
Clean up the interface to allow players to put in their names, include a button to start/restart the game and add a display element that congratulates the winning player!

7.
Optional - If you’re feeling ambitious create an AI so that a player can play against the computer!
Start by just getting the computer to make a random legal move.
Once you’ve gotten that, work on making the computer smart. It is possible to create an unbeatable AI using the minimax algorithm (read about it here, some googling will help you out with this one)
If you get this running definitely come show it off in the chatroom. It’s quite an accomplishment!


0 1 2
3 4 5
6 7 8


winning:
{
0: [[0, 1  2], [0,4,8], [0,3,6]]
1: [[1,4,7]]
2: [[2,1,0], [2,4,6], [2,5,8]]
3: [[3,4,5]]
4: [[]]
5: [[5,4,3]]
6: [[6,3,0],[6,4,2],[6,7,8]]
7: [[7,4,1]]
8: [[8,7,6],[8,4,0],[8,5,2]]
}
*/

/*
HELPER FUNCTION FOR GETTING COMINBATIONS
*/
var getPermutations = function(list, maxLen) {
  // Copy initial values as arrays
  var perm = list.map(function(val) {
      return [val];
  });
  // Our permutation generator
  var generate = function(perm, maxLen, currLen) {
      // Reached desired length
      if (currLen === maxLen) {
          return perm;
      }
      // For each existing permutation
      for (var i = 0, len = perm.length; i < len; i++) {
          var currPerm = perm.shift();
          // Create new permutation
          for (var k = 0; k < list.length; k++) {
              perm.push(currPerm.concat(list[k]));
          }
      }
      // Recurse
      return generate(perm, maxLen, currLen + 1);
  };
  // Start with size 1 because of initial values
  return generate(perm, maxLen, 1);
};

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

CombinationObject = (setCombination) => {
  const thisCombination = setCombination
  const checkIfSame = (newCombination) => {
    for (let i = 0; i < newCombination.length; i++) {
      if (thisCombination[i] !== newCombination[i]) return false
    }
    return true;
  }
  return {checkIfSame}
}

// MUST PASS A COMBINATION OBJECT TO WINNING COMBINATION
// TO USE JUST TYPE: WinningCombinations.checkForWinnter(CombinationObject([x,x,x]))
WinningCombinations = ( () => {
  combinationArray = [
    //0
    CombinationObject([0,1,2]), CombinationObject([0,4,8]), CombinationObject([0,3,6]),
    //1
    CombinationObject([1,4,7]),
    //2
    CombinationObject([2,1,0]),CombinationObject([2,4,6]),CombinationObject([2,5,8]),
    //3
    CombinationObject([3,4,5]),
    //5
    CombinationObject([5,4,3]),
    //6
    CombinationObject([6,3,0]), CombinationObject([6,4,2]), CombinationObject([6,7,8]),
    //7
    CombinationObject([7,4,1]),
    //8
    CombinationObject([8,7,6]), CombinationObject([8,4,0]), CombinationObject([8,5,2])
  ]
  const checkForWinner = (combinationToCheck) => {
    for (let i = 0; i < combinationArray.length; i++) {
      if (combinationArray[i].checkIfSame(combinationToCheck)) return true
    }
    return false
  }
  return({checkForWinner})
} ) ()

/*
  gameboard array will be an array of spots
*/
Spot = () => {
  let currentMarker = ''
  const getCurrentMark = currentMarker
  const setMark = (mark) => currentMarker = mark
  
  const isTaken = () => currentMarker !== ''

  return {getCurrentMark, setMark, isTaken}
}


const Player = (NAME, MARK) => {

  const name = NAME
  const mark = MARK
  const currentSpots = []

  const getSpotCombinations = () => {
    return getPermutations(currentSpots, 3)
    if (currentSpots.length > 3) {
      console.log('hello from if')
      return k_combinations(currentSpots, 3)
    }
    else {
      /*
      0 1 2 i, i+1, i+2
      0 2 1 i, i+2, i+1
      1 0 2 i+1
      1 2 0
      2 0 1
      2 1 0
      */
      const combinations = []
      let i = 0

      combinations.push([currentSpots[0], currentSpots[1], currentSpots[2]])
      combinations.push([currentSpots[0], currentSpots[2], currentSpots[1]])

      combinations.push([ currentSpots[1], currentSpots[0], currentSpots[2] ])
      combinations.push([ currentSpots[1], currentSpots[2], currentSpots[0] ])


      combinations.push([ currentSpots[2], currentSpots[0], currentSpots[1] ])
      combinations.push([ currentSpots[2], currentSpots[1], currentSpots[0] ])

      return combinations

    }
  }

  const getName = () => name
  const setName = (newName) => name = newName
  
  const getMark = () => mark
  const setMark = (newMark) => mark = newMark

  const setSpot = (spot) => currentSpots.push(spot)

  const getSpots = () => currentSpots

  const resetSpots = () => {
    while (currentSpots.length > 0) {
      currentSpots.pop()
    }
  }

  return {getName, setName, getMark, setMark, getSpots, setSpot, resetSpots, getSpotCombinations}
}


const Game = (() => {

  let roundCount = 0;

  let players = [Player('player1', 'X'), Player('player2', 'O')]

  let gameWinner = ''

  let thereIsAWinner = gameWinner !== ''

  const gridContainer = document.querySelector('.grid-container')

  const checkForWinner = () => {
    for (let i = 0; i < players.length ; i++) {
      let currentPlayerCombinations = players[i].getSpotCombinations()
      console.log(currentPlayerCombinations)
      for(let j = 0; j < currentPlayerCombinations.length; j++) {
        if (WinningCombinations.checkForWinner(currentPlayerCombinations[j])) {
          return true;
          console.log(`set game winner to ${players[i].name}`)
          gameWinner = players[i].name
          thereIsAWinner = true;
          console.log(`there is a winner from checkForWinner: ${thereIsAWinner}`)
        }
      }
    }
  }

  const setPlayers = () => {
  }


  const resetBoard = () => {
    roundCount = 0;
    players[0].resetSpots()
    players[1].resetSpots()
    thereIsAWinner = false
    gameWinner = ''
    removeAllChildNodes(gridContainer)
    drawGrid()

  }

  const currentInfo = () => {
    console.log(`Round count: ${roundCount}`)
    console.log(`player[0] current spots: ${players[0].currentSpots}`)
    console.log(`player[1] current spots: ${players[1].currentSpots}`)
    console.log(`continuePlaying: ${thereIsAWinner}`)
    console.log(`Current winner ${thereIsAWinner === false ? gameWinner : 'nowinner yet'}`)
  }

  const drawGrid = () => {
    for(let i = 0; i < 9; i++) {
      let gridCell = document.createElement('div')
      gridCell.dataset.id = i
      gridCell.addEventListener('click', handleCellClick)
      gridContainer.appendChild(gridCell)
    }
  }

  return {gameWinner, players,checkForWinner, currentInfo, resetBoard, drawGrid}
} ) ()


let currentPlayer = 0

function switchPlayer() {
  currentPlayer = (currentPlayer === 0) ? 1 : 0
  return currentPlayer
}

handleCellClick = function() {
  if (!Game.thereIsAWinner){
    this.textContent = Game.players[currentPlayer].getMark()
    Game.players[currentPlayer].setSpot(Number(this.dataset.id))
    console.log(`player${currentPlayer} selected a tile`)
    let thereIsAWinner = Game.checkForWinner()
    if(thereIsAWinner) {
      console.log(`Game winner is: ${currentPlayer}`)
    }
    else {
      switchPlayer()
    }
  }
}

Game.drawGrid()



const newGameButton = document.querySelector('#new-game-button')
newGameButton.addEventListener('click', () => Game.resetBoard())