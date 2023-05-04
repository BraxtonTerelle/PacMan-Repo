/**
 * Author: Braxton Little
 * Date: 4/12/2023
 * Purpose: This file creates and simulates the running of a classic Pacman arcade
 * game. Once the page is loaded, this file will build the walls of the game, spawn
 * pacman and the ghosts, and execute playing of the game until the user dies 3 times
 * or all of the pellets have been eaten. Functionality is based on pure JS.
 */

var gridElements = [];

/* 0 = pathway
 * 1 = horizontal wall
 * 2 = prison exit
 * 3 = top left corner
 * 4 = top right corner
 * 5 = bottom left corner
 * 6 = bottom right corner
 * 7 = vertical wall
 * 8 = travelled path
 * 9 = right-facing u
 * 10 = down-facing u
 * 11 = left-facing u
 * 12 = up-facing u
 * 13 = square wall
 * 14 = power pellet
 */
var gridLayout = [
  3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4,
  7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7,
  7, 0, 9, 1, 11, 0, 9, 11, 0, 9, 1, 1, 11, 0, 1, 1, 0, 9, 1, 11, 0, 7,
  7, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 7,
  7, 0, 3, 4, 0, 3, 1, 1, 4, 0, 3, 4, 0, 3, 1, 1, 4, 0, 3, 4, 0, 7,
  7, 0, 5, 6, 0, 5, 1, 1, 6, 0, 5, 6, 0, 5, 1, 1, 6, 0, 5, 6, 0, 7,
  7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7,
  5, 1, 1, 1, 4, 0, 10, 0, 3, 1, 2, 1, 4, 0, 3, 4, 0, 3, 1, 1, 1, 6,
  1, 1, 1, 1, 6, 0, 12, 0, 7, 8, 8, 8, 7, 0, 5, 6, 0, 5, 1, 1, 1, 1,
  8, 0, 0, 0, 0, 0, 0, 0, 7, 8, 8, 8, 7, 0, 0, 0, 0, 0, 0, 0, 0, 8,
  1, 1, 1, 1, 4, 0, 10, 0, 7, 8, 8, 8, 7, 0, 3, 4, 0, 3, 1, 1, 1, 1,
  3, 1, 1, 1, 6, 0, 12, 0, 5, 1, 1, 1, 6, 0, 5, 6, 0, 5, 1, 1, 1, 4,
  7, 14, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 7,
  7, 0, 13, 0, 9, 1, 11, 0, 13, 0, 9, 11, 0, 13, 0, 9, 1, 11, 0, 13, 0, 7,
  7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7,
  5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
];
/*
 * Grab all 5 Gamepieces from server on startup to initialize defaults with.
 * Send game end notification to server so he can destroy GamePieces and reset user array
 */
var width;
var username;
var pacmanPiece;
var blinkyPiece;
var pinkyPiece;
var inkyPiece;
var clydePiece;
var madeAutoMove = false;
var selectedSpeed = "";
var selectedDifficulty = "";

/*
* Adds button handlers to setup settings screen buttons, disabling other
* buttons when one is pressed and saving the user's selection
*/
function registerHandlers() {
  document
    .getElementById("startButton")
    .addEventListener("click", interpretPopupResults);
  var setupButtonList = document.getElementsByClassName("setupButton");
  for (var i = 0; i < setupButtonList.length; i++) {
    setupButtonList.item(i).addEventListener("click", (event) => {
      var buttonId = event.target.id;
      if (buttonId != "startButton") {
        event.target.style.backgroundColor = "#005689";
      }
      if (buttonId == "slowSpeed") {
        disableButton("mediumSpeed");
        disableButton("fastSpeed");
        selectedSpeed = "slow";
      } else if (buttonId == "mediumSpeed") {
        disableButton("slowSpeed");
        disableButton("fastSpeed");
        selectedSpeed = "medium";
      } else if (buttonId == "fastSpeed") {
        disableButton("slowSpeed");
        disableButton("mediumSpeed");
        selectedSpeed = "fast";
      } else if (buttonId == "easyDifficulty") {
        disableButton("mediumDifficulty");
        disableButton("hardDifficulty");
        selectedDifficulty = "easy";
      } else if (buttonId == "mediumDifficulty") {
        disableButton("easyDifficulty");
        disableButton("hardDifficulty");
        selectedDifficulty = "medium";
      } else if (buttonId == "hardDifficulty") {
        disableButton("easyDifficulty");
        disableButton("mediumDifficulty");
        selectedDifficulty = "hard";
      }
    });
  }
}

function disableButton(className) {
  var button = document.getElementById(className);
  button.style.backgroundColor = "#f0f0f0";
  button.style.border = "1px solid black";
  button.style.borderRadius = "2px";
}

/*
 * Calls necessary helper functions in a logical order
 */
async function main() {
  username = document.cookie.split("=")[1];
  if (!username) {
    window.location.href = "index.html";
  }
  registerHandlers();
}

/*
* Switche the view from the setup page to the actual game screen,
* adding the score counter at the top, pacman game in the middle, 
* and lives counter at the bottom
*/
function switchViews() {
  var initialContainer = document.getElementById("popupContainer");
  if (initialContainer != null) {
    document.body.removeChild(document.getElementById("popupContainer"));
  }

  var scoreCounter = document.createElement("div");
  scoreCounter.className = "gameData";
  scoreCounter.id = "scoreCounter";
  scoreCounter.innerText = "Score: 00";
  var livesCounter = document.createElement("div");
  livesCounter.className = "gameData";
  livesCounter.innerText = "";
  livesCounter.id = "livesCounter";
  var pacmanLife = document.createElement("div");
  pacmanLife.className = "Pacman";
  pacmanLife.id = "life1";
  livesCounter.appendChild(pacmanLife);
  pacmanLife = document.createElement("div");
  pacmanLife.className = "Pacman";
  pacmanLife.id = "life2";
  livesCounter.appendChild(pacmanLife);
  pacmanLife = document.createElement("div");
  pacmanLife.className = "Pacman";
  pacmanLife.id = "life3";
  livesCounter.appendChild(pacmanLife);

  var pacmanContainer = document.createElement("div");
  pacmanContainer.id = "pacmanContainer";

  document.body.appendChild(scoreCounter);
  document.body.appendChild(pacmanContainer);
  document.body.appendChild(livesCounter);
}

/*
* Retrieves the saved speed and difficulty choices made by the user and
* initialized a new game with these selections, synchronously waiting for
* the game pieces to be created before showing the board and starting the round
*/
function interpretPopupResults() {
  if (selectedSpeed.length == 0 || selectedDifficulty.length == 0) {
    alert("Please select a speed and difficulty!");
  } else {
    var url = "http://localhost:3000/add/custom/";
    var data = { s: selectedSpeed, d: selectedDifficulty, u: username };
    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        switchViews();
        getGamePieces()
          .then(() => {
            startRound();
            pacmanPiece.lives = 3;
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log("Caught error creating game: " + error);
      });
  }
}

/*
* Called once the game is over to remove the pacman screen
* and lives/score counter divs, replacing them with a nice
* end game screen that shows the user their final score
*/
function createEndGameWindow(didWin, pellets) {
  var endGamePopup = document.createElement("div");
  endGamePopup.id = "endGamePopup";
  var endGameHeader = document.createElement("div");
  endGameHeader.id = "endGameHeader";
  var button1Container = document.createElement("div");
  var button2Container = document.createElement("div");
  var playAgainButton = document.createElement("button");
  playAgainButton.id = "playAgainButton";
  playAgainButton.addEventListener("click", () => {
    var endPopup = document.getElementById("endGamePopup");
    if (endPopup != null) {
      document.body.removeChild(endPopup);
    }
    interpretPopupResults();
  });
  playAgainButton.innerText = "Play Again";
  playAgainButton.className = "gameOverButton";
  var newGameButton = document.createElement("button");
  newGameButton.className = "gameOverButton";
  newGameButton.addEventListener("click", () => {
    window.location.href = "./game.html";
  });
  newGameButton.innerText = "New Game";
  if (didWin) {
    endGameHeader.innerText =
      "Congrats, you beat the game! Score: " + pellets * 10;
  } else {
    endGameHeader.innerText = "Good try! Score: " + pellets * 10;
  }
  button1Container.appendChild(playAgainButton);
  button2Container.appendChild(newGameButton);
  endGamePopup.appendChild(endGameHeader);
  endGamePopup.appendChild(button1Container);
  endGamePopup.appendChild(newGameButton);
  document.body.appendChild(endGamePopup);
}

/*
* Called when the game is over (either max pellets eaten or pacman lost
* all of their lives), notifies the server that the game's over to destroy
* the created game piece
*/
function gameOver(didWin, pellets) {
  var url = `http://localhost:3000/gameover/${username}/${pellets}`;
  fetch(url)
    .then(() => {
      console.log("Successfully notified the server that the game's over");
    })
    .catch((error) => {
      console.log("Failed to notify server game's over: " + error);
    });
  setTimeout(() => {
    document.body.removeChild(document.getElementById("pacmanContainer"));
    document.body.removeChild(document.getElementById("livesCounter"));
    document.body.removeChild(document.getElementById("scoreCounter"));
    createEndGameWindow(didWin, pellets);
  }, 1500);
}

/*
* Manually displays a line of text that counts down from 3 until the
* game starts
*/
function showCountdownPopup() {
  var value = 3;
  var countdownText = document.createElement("h4");
  countdownText.innerText = "Starting in: " + value;
  document.body.appendChild(countdownText);
  let countdown = setInterval(() => {
    value -= 1;
    if (value == 0) {
      clearInterval(countdown);
      document.body.removeChild(countdownText);
      return;
    }
    countdownText.innerText = "Starting in: " + value;
  }, 1000);
}


/*
* Initializes all necessary defaults for the game piece
* values and calls spawnSprites to begin the game sequence
*/
function startRound() {
  pacmanPiece.index = 274;
  pacmanPiece.direction = -1;
  pacmanPiece.pelletsThisRound = 0;

  blinkyPiece.index = 0;
  blinkyPiece.freed = false;
  blinkyPiece.flashing = false;
  blinkyPiece.transitioning = false;
  blinkyPiece.pelletsThisRound = 0;
  blinkyPiece.direction = -1;

  pinkyPiece.index = 185;
  pinkyPiece.freed = false;
  pinkyPiece.flashing = false;
  pinkyPiece.transitioning = false;
  pinkyPiece.pelletsThisRound = 0;
  pinkyPiece.direction = -1;

  inkyPiece.index = 187;
  inkyPiece.freed = false;
  inkyPiece.flashing = false;
  inkyPiece.transitioning = false;
  inkyPiece.pelletsThisRound = 0;
  inkyPiece.direction = -1;

  clydePiece.index = 229;
  clydePiece.freed = false;
  clydePiece.flashing = false;
  clydePiece.transitioning = false;
  clydePiece.pelletsThisRound = 0;
  clydePiece.direction = -1;
  width = 22;
  buildWalls();
  showCountdownPopup();
  spawnSprites();
}

/*
 * Grab starting values from server and initialize them here before continuing on with game
 */
function getGamePieces() {
  return new Promise((resolve, reject) => {
    var url = `http://localhost:3000/begin/game/${username}`;
    fetch(url)
      .then((res) => {
        res.text().then((text) => {
          gamePieceList = JSON.parse(text);
          for (var i = 0; i < gamePieceList.length; i++) {
            var piece = gamePieceList[i];
            if (piece != null) {
              if (piece.name == "Inky") {
                inkyPiece = piece;
                inkyPiece.speed += 30;
              } else if (piece.name == "Blinky") {
                blinkyPiece = piece;
                blinkyPiece.speed += 30;
              } else if (piece.name == "Pinky") {
                pinkyPiece = piece;
                pinkyPiece.speed += 30;
              } else if (piece.name == "Clyde") {
                clydePiece = piece;
                clydePiece.speed += 30;
              } else {
                pacmanPiece = piece;
              }
            }
          }
          resolve(text);
        });
      })
      .catch((error) => {
        console.log("error: " + error);
        reject(new Error("Request failed"));
      });
  });
}

/*
 * Idly move the ghosts in their prison cage until they're ready to
 * be freed. Offset represents how many blocks needed to move the ghost.
 * When moving in the y-direction this offset consists of a whole row of blocks,
 * when moving in the x-direction it's just 1. startIndex is the beginning
 * index the ghosts will be places at. spriteToMove is the class name of the ghost
 * we're currently moving, and axis just tells us whether we're moving up/down or
 * left/right
 */

function idlyMoveGhost(offset, spriteToMove, axis) {
  var flashing, transitioning, index;
  if (spriteToMove.name == "Inky") {
    flashing = inkyPiece.flashing;
    transitioning = inkyPiece.transitioning;
    index = inkyPiece.index;
  } else if (spriteToMove.name == "Pinky") {
    flashing = pinkyPiece.flashing;
    transitioning = pinkyPiece.transitioning;
    index = pinkyPiece.index;
  } else if (spriteToMove.name == "Blinky") {
    flashing = blinkyPiece.flashing;
    transitioning = blinkyPiece.transitioning;
    index = blinkyPiece.index;
  } else if (spriteToMove.name == "Clyde") {
    flashing = clydePiece.flashing;
    transitioning = clydePiece.transitioning;
    index = clydePiece.index;
  }
  if (flashing == true) {
    gridElements[index].classList.add("vulnerableGhost");
  } else {
    gridElements[index].classList.add(spriteToMove.name);
  }
  var spacesMoved = 0;
  if (axis == "horizontal") {
    // Right
    spriteToMove.direction = 1;
  } else {
    // Down
    spriteToMove.direction = 2;
  }

  /*
   * Every x milliseconds, replace the image of the ghost at the current
   * index with an empty pathway image, move the ghost 1 block in the
   * desired direction, then add the ghost image to the block at the new index.
   * This simulates movement, where adding/removing the images are done by manually
   * updating the class list of the current block, which is represented as a div
   * within the gridElements array.
   */
  var initialLives = pacmanPiece.lives;
  let idleInterval = setInterval(() => {
    if (spriteToMove.name == "Inky") {
      flashing = inkyPiece.flashing;
      transitioning = inkyPiece.transitioning;
      index = inkyPiece.index;
    } else if (spriteToMove.name == "Pinky") {
      flashing = pinkyPiece.flashing;
      transitioning = pinkyPiece.transitioning;
      index = pinkyPiece.index;
    } else if (spriteToMove.name == "Blinky") {
      flashing = blinkyPiece.flashing;
      transitioning = blinkyPiece.transitioning;
      index = blinkyPiece.index;
    } else if (spriteToMove.name == "Clyde") {
      flashing = clydePiece.flashing;
      transitioning = clydePiece.transitioning;
      index = clydePiece.index;
    }
    if (flashing == true) {
      gridElements[index].classList.add("vulnerableGhost");
    }
    if (
      transitioning == true ||
      initialLives != pacmanPiece.lives ||
      pacmanPiece.pelletsThisRound == 156
    ) {
      clearInterval(idleInterval);
      return;
    }
    gridElements[index].classList.remove(spriteToMove.name);
    gridElements[index].classList.remove("vulnerableGhost");

    if (spriteToMove.direction == 2) {
      if (spacesMoved == 0) {
        spacesMoved = -1;
        spriteToMove.direction = 0;
      }
      spriteToMove.index += offset;
      index += offset;
    } else if (spriteToMove.direction == 0) {
      if (spacesMoved == 0) {
        spacesMoved = -1;
        spriteToMove.direction = 2;
      }
      spriteToMove.index -= offset;
      index -= offset;
    } else if (spriteToMove.direction == 1) {
      if (spacesMoved == 1) {
        spacesMoved = -1;
        spriteToMove.direction = 3;
      }
      spriteToMove.index += offset;
      index += offset;
    } else if (spriteToMove.direction == 3) {
      if (spacesMoved == 1) {
        spacesMoved = -1;
        spriteToMove.direction = 1;
      }
      spriteToMove.index -= offset;
      index -= offset;
    }
    if (flashing == true) {
      gridElements[index].classList.add("vulnerableGhost");
    } else {
      gridElements[index].classList.add(spriteToMove.name);
    }
    spacesMoved++;
  }, (spriteToMove.speed * 2));
}

/*
 * Adds the ghosts and pacman sprites to the game and idly
 * move the ghosts back and forth within their prison by calling
 * a helper function
 */
function spawnSprites() {
  gridElements[pacmanPiece.index].classList.add("Pacman");
  setTimeout(() => {
    document.addEventListener("keydown", makeMove);
    idlyMoveGhost(width, pinkyPiece, "vertical");
    idlyMoveGhost(width, inkyPiece, "vertical");
    idlyMoveGhost(1, clydePiece, "horizontal");
    var initialLives = pacmanPiece.lives;
    releaseGhost(blinkyPiece);
    setTimeout(() => {
      if (initialLives != pacmanPiece.lives) {
        return;
      }
      releaseGhost(inkyPiece);
    }, 4000);
    setTimeout(() => {
      if (initialLives != pacmanPiece.lives) {
        return;
      }
      releaseGhost(pinkyPiece);
    }, 6000);
    setTimeout(() => {
      if (initialLives != pacmanPiece.lives) {
        return;
      }
      releaseGhost(clydePiece);
    }, 8000);
  }, 3000);
}

/**
 * Creates a div for each box in the grid, some of which are actual walls
 * and some that are invisble walls used as "padding" for better proportionality.
 * Manually defines the class each div is part of using the classList property of
 * the div, and finally adds it to both the container div that houses the actual
 * game, as well as the gridElements array for further manipulation during gameplay.
 */
function buildWalls() {
  gridElements = [];
  var mainContainer = document.getElementById("pacmanContainer");
  mainContainer.style.width = "" + width * 35 + "px";
  mainContainer.style.height = "" + 16 * 35 + "px";
  var livesCounter = document.getElementById("livesCounter");
  livesCounter.style.width = "" + width * 35 + "px";
  var scoreCounter = document.getElementById("scoreCounter");
  scoreCounter.style.width = "" + width * 35 + "px";
  for (i = 0; i < gridLayout.length; i++) {
    const gridElement = document.createElement("div");
    if (gridLayout[i] == 0) {
      gridElement.classList.add("availablePath");
    } else if (gridLayout[i] == 1) {
      gridElement.classList.add("wall");
    } else if (gridLayout[i] == 2) {
      gridElement.classList.add("ghostPrison");
    } else if (gridLayout[i] == 3) {
      gridElement.classList.add("cornerWall");
    } else if (gridLayout[i] == 4) {
      gridElement.classList.add("cornerWall");
      gridElement.style.transform = "rotate(90deg)";
    } else if (gridLayout[i] == 5) {
      gridElement.classList.add("cornerWall");
      gridElement.style.transform = "rotate(270deg)";
    } else if (gridLayout[i] == 6) {
      gridElement.classList.add("cornerWall");
      gridElement.style.transform = "rotate(180deg)";
    } else if (gridLayout[i] == 7) {
      gridElement.classList.add("wall");
      gridElement.style.transform = "rotate(90deg)";
    } else if (gridLayout[i] == 8) {
      gridElement.classList.add("travelledPath");
    } else if (gridLayout[i] == 9) {
      gridElement.classList.add("uWall");
    } else if (gridLayout[i] == 10) {
      gridElement.classList.add("uWall");
      gridElement.style.transform = "rotate(90deg)";
    } else if (gridLayout[i] == 11) {
      gridElement.classList.add("uWall");
      gridElement.style.transform = "rotate(180deg)";
    } else if (gridLayout[i] == 12) {
      gridElement.classList.add("uWall");
      gridElement.style.transform = "rotate(270deg)";
    } else if (gridLayout[i] == 13) {
      gridElement.classList.add("squareWall");
    } else if (gridLayout[i] == 14) {
      gridElement.classList.add("powerPellet");
    }
    mainContainer.appendChild(gridElement);
    gridElements.push(gridElement);
  }
  var initialLives = pacmanPiece.lives;
  var shownPellets = [];
  var hiddenPellets = [];
  let blinkInterval = setInterval(() => {
    if (pacmanPiece.lives != initialLives) {
      clearInterval(blinkInterval);
      return;
    }
    shownPellets = [...document.getElementsByClassName("powerPellet")];
    hiddenPellets = [...document.getElementsByClassName("hiddenPellet")];

    for (let i = 0; i < shownPellets.length; i++) {
      shownPellets[i].className = "hiddenPellet";
    }
    for (let i = 0; i < hiddenPellets.length; i++) {
      hiddenPellets[i].className = "powerPellet";
    }
  }, 250);
}

function canMove(direction, index) {
  if (direction == 0) {
    return checkUp(index);
  } else if (direction == 1) {
    return checkRight(index);
  } else if (direction == 2) {
    return checkDown(index);
  } else if (direction == 3) {
    return checkLeft(index);
  }
  return false;
}

/*
 * Checks if the div to the left of the current sprite is
 * anything but a wall and is available to move into. Returns
 * true if so and false otherwise
 */
function checkLeft(index) {
  if (
    (index % width !== 0 &&
      gridElements[index - 1].classList.contains("availablePath")) ||
    gridElements[index - 1].classList.contains("travelledPath") ||
    gridElements[index - 1].classList.contains("powerPellet") ||
    gridElements[index - 1].classList.contains("hiddenPellet")
  ) {
    return true;
  }
  return false;
}

/*
 * Checks if the div to the right of the current sprite is
 * anything but a wall and is available to move into. Returns
 * true if so and false otherwise
 */
function checkRight(index) {
  if (
    (index % width !== 0 &&
      gridElements[index + 1].classList.contains("availablePath")) ||
    gridElements[index + 1].classList.contains("travelledPath") ||
    gridElements[index + 1].classList.contains("powerPellet") ||
    gridElements[index + 1].classList.contains("hiddenPellet")
  ) {
    return true;
  }
  return false;
}

/*
 * Checks if the div above the current sprite is
 * anything but a wall and is available to move into. Returns
 * true if so and false otherwise
 */
function checkUp(index) {
  if (
    (index - width >= 0 &&
      gridElements[index - width].classList.contains("availablePath")) ||
    gridElements[index - width].classList.contains("travelledPath") ||
    gridElements[index - width].classList.contains("powerPellet") ||
    gridElements[index - width].classList.contains("hiddenPellet")
  ) {
    return true;
  }
  return false;
}

/*
 * Checks if the div below the current sprite is
 * anything but a wall and is available to move into. Returns
 * true if so and false otherwise
 */
function checkDown(index) {
  if (
    (index + width < width * width &&
      gridElements[index + width].classList.contains("availablePath")) ||
    gridElements[index + width].classList.contains("travelledPath") ||
    gridElements[index + width].classList.contains("powerPellet") ||
    gridElements[index + width].classList.contains("hiddenPellet")
  ) {
    return true;
  }
  return false;
}

/*
* Called when the pacman character loses a life, checks
* if pacman is out of lives, if not reset the game screen
* after a 1.5 second timeout and continue playing
*/
function lifeLostHelper() {
  if(pacmanPiece.lives==0){
    gameOver(false, pacmanPiece.pelletseaten);
    return;
  }
  document.removeEventListener("keydown", makeMove);
  setTimeout(() => {
    var scoreCounter = document.getElementById("scoreCounter");
    var livesCounter = document.getElementById("livesCounter");
    document.body.removeChild(scoreCounter);
    document.body.removeChild(livesCounter);
    document.body.removeChild(document.getElementById("pacmanContainer"));
    var pacmanContainer = document.createElement("div");
    pacmanContainer.id = "pacmanContainer";
    document.body.appendChild(scoreCounter);
    document.body.appendChild(pacmanContainer);
    document.body.appendChild(livesCounter);
    startRound();
  }, 1500);
}

/*
* Handles sending a recently eaten ghost back to the
* starting prison cage and idly moving the ghost for
* 2 seconds before releasing it again to continue
* chasing pacma
*/
function resetGhost(piece) {
  pacmanPiece.pelletseaten += 15;
  var initialLives = pacmanPiece.lives;
  if (piece.name == "Blinky") {
    blinkyPiece.freed = false;
    blinkyPiece.flashing = false;
    blinkyPiece.index = 186;
    idlyMoveGhost(width, blinkyPiece, "vertical");
    setTimeout(() => {
      let upNext = setInterval(() => {
        if (initialLives != pacmanPiece.lives) {
          clearInterval(upNext);
          return;
        }
        if (
          !pinkyPiece.transitioning &&
          !inkyPiece.transitioning &&
          !clydePiece.transitioning
        ) {
          releaseGhost(blinkyPiece);
          clearInterval(upNext);
        }
      }, 300);
    }, 2000);
  } else if (piece.name == "Inky") {
    inkyPiece.freed = false;
    inkyPiece.flashing = false;
    inkyPiece.index = 187;
    idlyMoveGhost(width, inkyPiece, "vertical");
    setTimeout(() => {
      let upNext = setInterval(() => {
        if (initialLives != pacmanPiece.lives) {
          clearInterval(upNext);
          return;
        }
        if (
          !pinkyPiece.transitioning &&
          !blinkyPiece.transitioning &&
          !clydePiece.transitioning
        ) {
          releaseGhost(inkyPiece);
          clearInterval(upNext);
        }
      }, 300);
    }), 2000;
  } else if (piece.name == "Pinky") {
    pinkyPiece.freed = false;
    pinkyPiece.flashing = false;
    pinkyPiece.index = 185;
    idlyMoveGhost(width, pinkyPiece, "vertical");
    setTimeout(() => {
      let upNext = setInterval(() => {
        if (initialLives != pacmanPiece.lives) {
          clearInterval(upNext);
          return;
        }
        if (
          !inkyPiece.transitioning &&
          !blinkyPiece.transitioning &&
          !clydePiece.transitioning
        ) {
          releaseGhost(pinkyPiece);
          clearInterval(upNext);
        }
      }, 300);
    }), 2000;
  } else if (piece.name == "Clyde") {
    clydePiece.freed = false;
    clydePiece.flashing = false;
    clydePiece.index = 229;
    idlyMoveGhost(1, clydePiece, "horizontal");
    setTimeout(() => {
      let upNext = setInterval(() => {
        if (initialLives != pacmanPiece.lives) {
          clearInterval(upNext);
          return;
        }
        if (
          !pinkyPiece.transitioning &&
          !blinkyPiece.transitioning &&
          !inkyPiece.transitioning
        ) {
          releaseGhost(clydePiece);
          clearInterval(upNext);
        }
      }, 300);
    }), 2000;
  }
}

/*
* Returns true if the index of the pacman gamepiece is the
* same as any of the ghost indexes, and calls lifeLostHelper
* if the ghost aren't flashing. If they are flashing (meaning
* they're vulnerable) call resetGhost to simulate eating them
* and give pacman some bonus points
*/
function isTouchingGhost() {
  if (blinkyPiece.flashing == true) {
    if (pacmanPiece.index == blinkyPiece.index) {
      resetGhost(blinkyPiece);
    } else if (pacmanPiece.index == inkyPiece.index) {
      resetGhost(inkyPiece);
    } else if (pacmanPiece.index == pinkyPiece.index) {
      resetGhost(pinkyPiece);
    } else if (pacmanPiece.index == clydePiece.index) {
      resetGhost(clydePiece);
    }
  } else {
    if (pacmanPiece.index == blinkyPiece.index) {
      pacmanPiece.lives -= 1;
      pacmanPiece.direction = -1;
      pacmanPiece.index = -1;
      lifeLostHelper();
      return true;
    } else if (pacmanPiece.index == inkyPiece.index) {
      pacmanPiece.lives -= 1;
      pacmanPiece.direction = -1;
      pacmanPiece.index = -1;
      lifeLostHelper();
      return true;
    } else if (pacmanPiece.index == pinkyPiece.index) {
      pacmanPiece.lives -= 1;
      pacmanPiece.direction = -1;
      pacmanPiece.index = -1;
      lifeLostHelper();
      return true;
    } else if (pacmanPiece.index == clydePiece.index) {
      pacmanPiece.lives -= 1;
      pacmanPiece.direction = -1;
      pacmanPiece.index = -1;
      lifeLostHelper();
      return true;
    }
  }
  return false;
}

/*
 * pelletThreshold controls how soon does the second
 * ghost come out of the cage and how soon the following
 * ghosts leave their cage.
 */
function checkGameStatus() {
  if (pacmanPiece.pelletsThisRound == 156) {
    gameOver(true, pacmanPiece.pelletseaten);
    document.removeEventListener("keydown", makeMove);
    return;
  } else if (isTouchingGhost()) {
    if (pacmanPiece.lives == 2) {
      var life3 = document.getElementById("life3");
      if (life3 != null) {
        document.getElementById("livesCounter").removeChild(life3);
      }
    } else if (pacmanPiece.lives == 1) {
      var life2 = document.getElementById("life2");
      if (life2 != null) {
        document.getElementById("livesCounter").removeChild(life2);
      }
    } else if (pacmanPiece.lives == 0) {
      var life1 = document.getElementById("life1");
      if (life1 != null) {
        document.getElementById("livesCounter").removeChild(life1);
      }
      document.removeEventListener("keydown", makeMove);
      return;
    }
  }
}

function getXPos(element) {
  const rect = element.getBoundingClientRect();
  return rect.left;
}

function getYPos(element) {
  const rect = element.getBoundingClientRect();
  return rect.top;
}

/*
* If the ghost is using an intermediate AI, use the x and y
* positions of the ghost and pacman to help lead the ghost to
* the pacman. If we can move up and pacman's y value indicates
* he's above us, we'll put heavy bias on moving upwward by generating
* 3 numbers in the same direction for the list
*/
function getIntermediateMoves(direction, index) {
   var directionList = [];
   var xPos = getXPos(gridElements[index]);
   var yPos = getYPos(gridElements[index]);
   var pacmanXPos = getXPos(gridElements[pacmanPiece.index]);
   var pacmanYPos = getYPos(gridElements[pacmanPiece.index]);
    if(direction==0 && pacmanYPos < yPos){
      for(let i = 0; i<2; i++){
        directionList.push(direction);
      }
    }
    else if(direction==1 && pacmanXPos > xPos){
      for(let i = 0; i<2; i++){
        directionList.push(direction);
      }
    }
    else if(direction==2 && pacmanYPos > yPos){
      for(let i = 0; i<2; i++){
        directionList.push(direction);
      }
    }
    if(direction==3 && pacmanXPos < xPos){
      for(let i = 0; i<2; i++){
        directionList.push(direction);
      }
    }
   return directionList;
}

/*
 * Checks if a different direction (other than opposite)
 * is available, and if so does random generator with heavy
 * bias to continuing forward and small chance to turn.
 */
function makeGhostMove(ghost) {
  var initialLives = pacmanPiece.lives;
  var freed, direction, index, difficulty;
  let randomInterval = setInterval(() => {
    if (ghost.name == "Inky") {
      freed = inkyPiece.freed;
      direction = inkyPiece.direction;
      index = inkyPiece.index;
      difficulty = inkyPiece.intermediate;
    } else if (ghost.name == "Pinky") {
      freed = pinkyPiece.freed;
      direction = pinkyPiece.direction;
      index = pinkyPiece.index;
      difficulty = pinkyPiece.intermediate;
    } else if (ghost.name == "Blinky") {
      freed = blinkyPiece.freed;
      direction = blinkyPiece.direction;
      difficulty = blinkyPiece.intermediate;
      index = blinkyPiece.index;
    } else if (ghost.name == "Clyde") {
      freed = clydePiece.freed;
      direction = clydePiece.direction;
      index = clydePiece.index;
      difficulty = clydePiece.intermediate;
    }

    if (
      pacmanPiece.pelletsThisRound == 156 ||
      pacmanPiece.lives != initialLives
    ) {
      clearInterval(randomInterval);
      return;
    }
    if (!freed) {
      clearInterval(randomInterval);
      return;
    }
    let directionList = [];
    if (canMove(direction, index)) {
      for (let i = 0; i < 5; i++) {
        directionList.push(direction);
      }
      if(difficulty){
        directionList = directionList.concat(getIntermediateMoves(direction, index));
      }
    }
    direction += 1;
    if (direction > 3) {
      direction = direction - 4;
    }
    // To the right
    if (canMove(direction, index)) {
      directionList.push(direction);
      if(difficulty){
        directionList = directionList.concat(getIntermediateMoves(direction, index));
      }
    }
    direction += 2;
    if (direction > 3) {
      direction = direction - 4;
    }
    // To the left
    if (canMove(direction, index)) {
      directionList.push(direction);
      if(difficulty){
        directionList = directionList.concat(getIntermediateMoves(direction, index));
      }
    }
    let randomIndex = Math.floor(Math.random() * directionList.length);
    if (directionList.length > 0) {
      ghost.direction = directionList[randomIndex];
    }
    moveSprite(ghost);
  }, ghost.speed);
}

/*
 * Sets a slow path transition to the first cell outside of the prison
 */
function releaseGhost(ghostToRelease) {
  var index, flashing;
  if (ghostToRelease.name == "Inky") {
    flashing = inkyPiece.flashing;
    index = inkyPiece.index;
  } else if (ghostToRelease.name == "Pinky") {
    flashing = pinkyPiece.flashing;
    index = pinkyPiece.index;
  } else if (ghostToRelease.name == "Blinky") {
    flashing = blinkyPiece.flashing;
    index = blinkyPiece.index;
  } else if (ghostToRelease.name == "Clyde") {
    flashing = clydePiece.flashing;
    index = clydePiece.index;
  }
  ghostToRelease.transitioning = true;
  var initialLives = pacmanPiece.lives;

  gridElements[index].classList.remove(ghostToRelease.name);
  gridElements[index].classList.remove("vulnerableGhost");

  ghostToRelease.index = 208;
  index = 208;
  let count = 0;

  if (flashing == true) {
    gridElements[index].classList.add("vulnerableGhost");
  } else {
    gridElements[index].classList.add(ghostToRelease.name);
  }
  let smoothInterval = setInterval(() => {
    if (initialLives != pacmanPiece.lives) {
      clearInterval(smoothInterval);
      return;
    }

    /*if (count == 0) {
      ghostToRelease.index = 208;
    }*/
    if (count == 3) {
      ghostToRelease.freed = true;
      ghostToRelease.transitioning = false;
      clearInterval(smoothInterval);
      let randomNum = Math.floor(Math.random() * 2);
      if (randomNum == 0) {
        ghostToRelease.direction = 1;
      } else {
        ghostToRelease.direction = 3;
      }
      if (ghostToRelease.intermediate == true) {
        //makeIntermediateMove(ghostToRelease)
        makeGhostMove(ghostToRelease);
        return;
      } else {
        makeGhostMove(ghostToRelease);
        return;
      }
    }
    gridElements[index].classList.remove(ghostToRelease.name);
    gridElements[index].classList.remove("vulnerableGhost");

    ghostToRelease.index -= 22;
    index -= 22;
    if (ghostToRelease.flashing == true) {
      gridElements[index].classList.add("vulnerableGhost");
    } else {
      gridElements[index].classList.add(ghostToRelease.name);
    }
    count++;
  }, ghostToRelease.speed);
}

/*
* Makes ghosts vulnerable by setting their flashing
* property to true if it isnt already. If its already
* true, in the spirit of not wasting a power pellet we'll
* just wait until the previous flashing sequence is done
*/
function makeGhostsVulnerable() {
  if (!blinkyPiece.flashing) {
    blinkyPiece.flashing = true;
    inkyPiece.flashing = true;
    pinkyPiece.flashing = true;
    clydePiece.flashing = true;
    var count = 0;
    let vulnerableInterval = setInterval(() => {
      if (count == 4) {
        blinkyPiece.flashing = false;
        inkyPiece.flashing = false;
        pinkyPiece.flashing = false;
        clydePiece.flashing = false;
        clearInterval(vulnerableInterval);
        return;
      }
      count++;
    }, 1000);
  } else {
    setTimeout(() => {
      makeGhostsVulnerable();
    }, 500);
  }
}

/*
 * Moves any sprite in a specified direction by first checking if it
 * can move in that direction, then updating its index accordingly.
 * The function increment/decrements the index by 1 to move right/left,
 * and increment/decrements by a whole row to move up/down. It also
 * enables teleportation feature. Calls checkGameStatus because this function
 * is essentially a while(game isnt over) loop as pacman is always moving
 * (even if not visually, this function is continuously getting called) so
 * check if the game is over to break out of the loop
 */
function moveSprite(spriteToMove) {
  gridElements[spriteToMove.index].classList.remove(spriteToMove.name);
  gridElements[spriteToMove.index].classList.remove("vulnerableGhost");

  if (spriteToMove.direction == 0 && checkUp(spriteToMove.index)) {
    spriteToMove.index -= width;
  } else if (spriteToMove.direction == 1 && checkRight(spriteToMove.index)) {
    spriteToMove.index += 1;
  } else if (spriteToMove.direction == 2 && checkDown(spriteToMove.index)) {
    spriteToMove.index += width;
  } else if (spriteToMove.direction == 3 && checkLeft(spriteToMove.index)) {
    spriteToMove.index -= 1;
  }
  if (spriteToMove.name == "Pacman") {
    var updatedClasses = gridElements[spriteToMove.index].classList;
    if (updatedClasses.contains("availablePath")) {
      updatedClasses.remove("availablePath");
      updatedClasses.add("travelledPath");
      pacmanPiece.pelletseaten += 1;
      pacmanPiece.pelletsThisRound += 1;
      document.getElementById("scoreCounter").innerText =
        "" + pacmanPiece.pelletseaten * 10;
    } else if (
      updatedClasses.contains("powerPellet") ||
      updatedClasses.contains("hiddenPellet")
    ) {
      if (updatedClasses.contains("powerPellet")) {
        updatedClasses.remove("powerPellet");
      } else {
        updatedClasses.remove("hiddenPellet");
      }
      makeGhostsVulnerable();
      updatedClasses.add("travelledPath");
      pacmanPiece.pelletseaten += 5;
      document.getElementById("scoreCounter").innerText =
        "" + pacmanPiece.pelletseaten * 10;
    }
  }
  if (spriteToMove.index == 199) {
    spriteToMove.index = 219;
  } else if (spriteToMove.index == 219) {
    spriteToMove.index = 199;
  }
  if (spriteToMove.type == "ghost" && spriteToMove.flashing == true) {
    gridElements[spriteToMove.index].classList.add("vulnerableGhost");
  } else {
    gridElements[spriteToMove.index].classList.add(spriteToMove.name);
  }
  checkGameStatus();
}

/*
 * Enables pacman's movement by calling movePacman helper
 * every x milliseconds as designated by the chosen pacman
 * speed. This loop will run until a new direction key is
 * pressed by the user, in which case it'll clear the current
 * interval and create a new one with the new direction and
 * start moving the pacman in that direction
 */
function loop(direction) {
  pacmanPiece.direction = direction;
  moveSprite(pacmanPiece);
  let moveInterval = setInterval(() => {
    if (direction != pacmanPiece.direction || pacmanPiece.lives == 0) {
      clearInterval(moveInterval);
      return;
    }
    moveSprite(pacmanPiece);
  }, pacmanPiece.speed);
}

function makeMove(e) {
  madeAutoMove = false;
  interpretMove(e);
}

/**
 *
 * @param {*} e: returned keydown event
 * Interprets the keyboard key pressed and calls
 * helper function that actually moves the pacman
 */
function interpretMove(e) {
  switch (e.keyCode) {
    case 37:
      if (pacmanPiece.direction != 3) {
        if (checkLeft(pacmanPiece.index)) {
          madeAutoMove = true;
          pacmanPiece.direction = 3;
          loop(3);
        } else {
          setTimeout(() => {
            interpretMove(e);
          }, pacmanPiece.speed / 2);
        }
      }
      break;
    case 38:
      if (pacmanPiece.direction != 0) {
        if (checkUp(pacmanPiece.index)) {
          madeAutoMove = true;
          pacmanPiece.direction = 0;
          loop(0);
        } else {
          setTimeout(() => {
            interpretMove(e);
          }, pacmanPiece.speed / 2);
        }
      }
      break;
    case 39:
      if (pacmanPiece.direction != 1) {
        if (checkRight(pacmanPiece.index)) {
          madeAutoMove = true;
          pacmanPiece.direction = 1;
          loop(1);
        } else {
          setTimeout(() => {
            interpretMove(e);
          }, pacmanPiece.speed / 2);
        }
      }
      break;
    case 40:
      if (pacmanPiece.direction != 2) {
        if (checkDown(pacmanPiece.index)) {
          madeAutoMove = true;
          pacmanPiece.direction = 2;
          loop(2);
        } else {
          setTimeout(() => {
            interpretMove(e);
          }, pacmanPiece.speed / 2);
        }
      }
      break;
  }
}

document.addEventListener("DOMContentLoaded", main);
