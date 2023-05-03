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
 */
var gridLayout = [
  3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4,
  7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7,
  7, 0, 9, 1, 11, 0, 9, 11, 0, 9, 1, 1, 11, 0, 1, 1, 0, 9, 1, 11, 0, 7,
  7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7,
  7, 0, 3, 4, 0, 3, 1, 1, 4, 0, 3, 4, 0, 3, 1, 1, 4, 0, 3, 4, 0, 7,
  7, 0, 5, 6, 0, 5, 1, 1, 6, 0, 5, 6, 0, 5, 1, 1, 6, 0, 5, 6, 0, 7,
  7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7,
  5, 1, 1, 1, 4, 0, 10, 0, 3, 1, 2, 1, 4, 0, 3, 4, 0, 3, 1, 1, 1, 6,
  1, 1, 1, 1, 6, 0, 12, 0, 7, 8, 8, 8, 7, 0, 5, 6, 0, 5, 1, 1, 1, 1,
  8, 0, 0, 0, 0, 0, 0, 0, 7, 8, 8, 8, 7, 0, 0, 0, 0, 0, 0, 0, 0, 8,
  1, 1, 1, 1, 4, 0, 10, 0, 7, 8, 8, 8, 7, 0, 3, 4, 0, 3, 1, 1, 1, 1,
  3, 1, 1, 1, 6, 0, 12, 0, 5, 1, 1, 1, 6, 0, 5, 6, 0, 5, 1, 1, 1, 4,
  7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7,
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

function switchViews() {
  var initialContainer = document.getElementById("popupContainer");
  if(initialContainer!=null){
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

function gameOver(didWin, pellets) {
  var url = `http://localhost:3000/gameover/${username}/${pacmanPiece.pelletseaten}`;
  fetch(url)
    .then(() => {
      console.log("Successfully notified the server that the game's over");
    })
    .catch((error) => {
      console.log("Failed to notify server game's over: " + error);
    });
    document.body.removeChild(document.getElementById("pacmanContainer"));
    document.body.removeChild(document.getElementById("livesCounter"));
    document.body.removeChild(document.getElementById("scoreCounter"));
    var endGamePopup = document.createElement("div");
    endGamePopup.id = "endGamePopup"
    var endGameHeader = document.createElement("h2");
    var playAgainButton = document.createElement("button");
    playAgainButton.addEventListener("click", ()=>{
      var endPopup = document.getElementById("endGamePopup");
      if(endPopup!=null){
        document.body.removeChild(endPopup);
      }
      interpretPopupResults();
    });
    playAgainButton.innerHTML = `<button class="setupButton">Play Again</button>`;
  if (didWin) {
    endGameHeader.innerText = "Congrats, you beat the game! Score: " + (pellets * 10);

  } else {
    endGameHeader.innerText = "Good try! Score: " + (pellets * 10);
  }
  endGamePopup.appendChild(endGameHeader);
  endGamePopup.appendChild(playAgainButton);
  document.body.appendChild(endGamePopup);
}

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

function startRound() {
  pacmanPiece.index = 274;
  pacmanPiece.direction = -1;
  pacmanPiece.pelletsThisRound = 0;

  blinkyPiece.index = 0;
  blinkyPiece.freed = false;
  blinkyPiece.flashing = false;
  blinkyPiece.pelletsThisRound = 0;
  blinkyPiece.direction = -1;

  pinkyPiece.index = 185;
  pinkyPiece.freed = false;
  pinkyPiece.flashing = false;
  pinkyPiece.pelletsThisRound = 0;
  pinkyPiece.direction = -1;

  inkyPiece.index = 187;
  inkyPiece.freed = false;
  inkyPiece.flashing = false;
  inkyPiece.pelletsThisRound = 0;
  inkyPiece.direction = -1;

  clydePiece.index = 229;
  clydePiece.freed = false;
  clydePiece.flashing = false;
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
  gridElements[spriteToMove.index].classList.add(spriteToMove.name);
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
    if (
      spriteToMove.freed == true ||
      initialLives != pacmanPiece.lives ||
      pacmanPiece.pelletsThisRound == 158
    ) {
      clearInterval(idleInterval);
      return;
    }
    gridElements[spriteToMove.index].classList.remove(spriteToMove.name);
    if (spriteToMove.direction == 2) {
      if (spacesMoved == 0) {
        spacesMoved = -1;
        spriteToMove.direction = 0;
      }
      spriteToMove.index += offset;
    } else if (spriteToMove.direction == 0) {
      if (spacesMoved == 0) {
        spacesMoved = -1;
        spriteToMove.direction = 2;
      }
      spriteToMove.index -= offset;
    } else if (spriteToMove.direction == 1) {
      if (spacesMoved == 1) {
        spacesMoved = -1;
        spriteToMove.direction = 3;
      }
      spriteToMove.index += offset;
    } else if (spriteToMove.direction == 3) {
      if (spacesMoved == 1) {
        spacesMoved = -1;
        spriteToMove.direction = 1;
      }
      spriteToMove.index -= offset;
    }
    gridElements[spriteToMove.index].classList.add(spriteToMove.name);
    spacesMoved++;
  }, spriteToMove.speed);
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
    releaseGhost(blinkyPiece);
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
    }
    mainContainer.appendChild(gridElement);
    gridElements.push(gridElement);
  }
}

function canMove(ghost) {
  if (ghost.direction == 0) {
    return checkUp(ghost.index);
  } else if (ghost.direction == 1) {
    return checkRight(ghost.index);
  } else if (ghost.direction == 2) {
    return checkDown(ghost.index);
  } else if (ghost.direction == 3) {
    return checkLeft(ghost.index);
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
    gridElements[index - 1].classList.contains("travelledPath")
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
    gridElements[index + 1].classList.contains("travelledPath")
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
    gridElements[index - width].classList.contains("travelledPath")
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
    gridElements[index + width].classList.contains("travelledPath")
  ) {
    return true;
  }
  return false;
}

function lifeLostHelper() {
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

function isTouchingGhost() {
  if (blinkyPiece.flashing == true) {
    if (pacmanPiece.index == blinkyPiece.index) {
      // Send piece to start and idle move, releasing after 2 seconds
    } else if (pacmanPiece.index == inkyPiece.index) {
    } else if (pacmanPiece.index == pinkyPiece.index) {
    } else if (pacmanPiece.index == clydePiece.index) {
    }
  } else {
    if (pacmanPiece.index == blinkyPiece.index) {
      pacmanPiece.lives -= 1;
      pacmanPiece.direction = -1;
      if (pacmanPiece.lives != 0) {
        lifeLostHelper();
      }
      return true;
    } else if (pacmanPiece.index == inkyPiece.index) {
      pacmanPiece.lives -= 1;
      pacmanPiece.direction = -1;
      if (pacmanPiece.lives != 0) {
        lifeLostHelper();
      }
      return true;
    } else if (pacmanPiece.index == pinkyPiece.index) {
      pacmanPiece.lives -= 1;
      pacmanPiece.direction = -1;
      if (pacmanPiece.lives != 0) {
        lifeLostHelper();
      }
      return true;
    } else if (pacmanPiece.index == clydePiece.index) {
      pacmanPiece.lives -= 1;
      pacmanPiece.direction = -1;
      if (pacmanPiece.lives != 0) {
        lifeLostHelper();
      }
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
  var pelletseaten = pacmanPiece.pelletseaten;
  if (isTouchingGhost()) {
    pacmanPiece.index = 274;
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
      gameOver(false, pelletseaten);
      document.removeEventListener("keydown", makeMove);
      return;
    }
  } else if (pacmanPiece.pelletsThisRound == 158) {
    gameOver(true, pelletseaten);
    document.removeEventListener("keydown", makeMove);
    return;
  } else {
    let pelletThreshold = 10;
    if (selectedDifficulty == "easy") {
      pelletThreshold += 20;
    } else if (selectedDifficulty == "medium") {
      pelletThreshold += 10;
    }
    // Total # of pellets is 158
    if (pacmanPiece.pelletsThisRound == pelletThreshold) {
      if (pinkyPiece.freed != true) {
        releaseGhost(pinkyPiece);
      }
    } else if (
      pacmanPiece.pelletsThisRound ==
      pelletThreshold + pelletThreshold
    ) {
      if (inkyPiece.freed != true) {
        releaseGhost(inkyPiece);
      }
    } else if (
      pacmanPiece.pelletsThisRound ==
      pelletThreshold + pelletThreshold + pelletThreshold
    ) {
      if (clydePiece.freed != true) {
        releaseGhost(clydePiece);
      }
    }
  }
}

function makeIntermediateMove() {}

/*
 * Checks if a different direction (other than opposite)
 * is available, and if so does random generator with heavy
 * bias to continuing forward and small chance to turn.
 */
function makeRandomMove(ghost) {
  if (ghost.name == "Blinky") {
  }
  var initialLives = pacmanPiece.lives;
  let randomInterval = setInterval(() => {
    if (
      pacmanPiece.pelletsThisRound == 158 ||
      pacmanPiece.lives != initialLives
    ) {
      clearInterval(randomInterval);
      return;
    }
    let directionList = [];
    if (canMove(ghost)) {
      for (let i = 0; i < 5; i++) {
        directionList.push(ghost.direction);
      }
    }
    ghost.direction += 1;
    if (ghost.direction > 3) {
      ghost.direction = ghost.direction - 4;
    }
    // To the right
    if (canMove(ghost)) {
      directionList.push(ghost.direction);
    }
    ghost.direction += 2;
    if (ghost.direction > 3) {
      ghost.direction = ghost.direction - 4;
    }
    // To the left
    if (canMove(ghost)) {
      directionList.push(ghost.direction);
    }
    let randomIndex = Math.floor(Math.random() * directionList.length);
    if (directionList.length > 0) {
      ghost.direction = directionList[randomIndex];
    }
    moveSprite(ghost);
  }, ghost.speed);
}

/*
 * Sets a slow path transition to the first cell outside of
 */
function releaseGhost(ghostToRelease) {
  var initialLives = pacmanPiece.lives;
  //console.log("Releasing " + ghostToRelease.name);
  ghostToRelease.freed = true;
  gridElements[ghostToRelease.index].classList.remove(ghostToRelease.name);
  ghostToRelease.index = 208;
  let count = 0;
  //var element = gridElements[ghostToRelease.index];
  gridElements[ghostToRelease.index].classList.add(ghostToRelease.name);
  let smoothInterval = setInterval(() => {
    if (initialLives != pacmanPiece.lives) {
      clearInterval(smoothInterval);
      return;
    }
    if (count == 0) {
      ghostToRelease.index = 208;
    }
    if (count == 3) {
      clearInterval(smoothInterval);
      let randomNum = Math.floor(Math.random() * 2);
      if (randomNum == 0) {
        ghostToRelease.direction = 1;
      } else {
        ghostToRelease.direction = 3;
      }
      if (ghostToRelease.intermediate == true) {
        //makeIntermediateMove(ghostToRelease)
        makeRandomMove(ghostToRelease);
        return;
      } else {
        makeRandomMove(ghostToRelease);
        return;
      }
    }
    gridElements[ghostToRelease.index].classList.remove(ghostToRelease.name);
    ghostToRelease.index -= 22;
    gridElements[ghostToRelease.index].classList.add(ghostToRelease.name);
    count++;
  }, ghostToRelease.speed);
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
    }
  }
  if (spriteToMove.index == 199 && spriteToMove.direction == 3) {
    spriteToMove.index = 219;
  } else if (spriteToMove.index == 219 && spriteToMove.direction == 1) {
    spriteToMove.index = 199;
  }
  gridElements[spriteToMove.index].classList.add(spriteToMove.name);
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
