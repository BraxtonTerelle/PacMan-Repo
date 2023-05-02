/**
 * Author: Braxton Little
 * Date: 4/12/2023
 * Purpose: This file creates and simulates the running of a classic Pacman arcade
 * game. Once the page is loaded, this file will build the walls of the game, spawn
 * pacman and the ghosts, and execute playing of the game until the user dies 3 times
 * or all of the pellets have been eaten. Functionality is based on pure JS.
 */

const gridElements = [];

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
  0, 0, 0, 0, 0, 0, 0, 0, 7, 8, 8, 8, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0,
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
var pacmanIndex;
var width;
var pacmanDirection;
var pacmanSpeed;
var ghostSpeed;
var username;
var pacmanPiece;
var blinkyPiece;
var pinkyPiece;
var inkyPiece;
var clydePiece;
var pelletsEaten = 0;
var madeAutoMove = false;

/*
 * Calls necessary helper functions in a logical order
 */
async function main() {
  username = document.cookie.split("=")[1];
  if (!username) {
    window.location.href = "index.html";
  }
  console.log("Before initialized default: " + pacmanPiece);
  initializeDefaults().then(()=>{
    console.log("After default: " + pacmanPiece);
    buildWalls();
    spawnSprites();
  }).catch((error)=>{console.log(error)})
}

function gameOver(didWin) {
  var xhttp = new XMLHttpRequest();
  xhttp.open(
    "GET",
    `http://localhost:3000/gameover/?user=${username}&pelletsEaten=${pelletsEaten}`
  );
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.onreadystatechange = function () {
    if (xhttp.readyState == 4) {
      if (xhttp.status == 200) {
        console.log("Successfully notified server that game ended");
      } else {
        console.log("Failed to notify server that game ended");
      }
    }
  };
  xhttp.send();
  if (didWin) {
    // Show win message
  } else {
    // Show lose message
  }
}

/*
 * Grab starting values from server and initialize them here before continuing on with game
 */
function initializeDefaults() {
  return new Promise((resolve, reject)=>{
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", `http://localhost:3000/begin/game/?user=${username}`);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.onreadystatechange = function () {
    if (xhttp.readyState == 4) {
      if (xhttp.status == 200) {
        gamePieceList = JSON.parse(xhttp.responseText);
        for (piece in gamePieceList) {
          if (piece.name == "Inky") {
            inkyPiece = piece;
          } else if (piece.name == "Blinky") {
            blinkyPiece = piece;
          } else if (piece.name == "Pinky") {
            pinkyPiece = piece;
          } else if (piece.name == "Clyde") {
            clydePiece = piece;
          } else {
            pacmanPiece = piece;
          }
        }
        pacmanIndex = 274;
        width = 22;
        pacmanDirection = -1;
        pacmanSpeed = 200;
        ghostSpeed = 400;
        resolve(xhttp.responseText);
      }
      else{
        reject(new Error("Request failed"));
      }
    }
  };
  xhttp.send();
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
function idlyMoveGhost(offset, startIndex, spriteToMove, axis) {
  gridElements[startIndex].classList.add(spriteToMove);
  var myIndex = startIndex;
  var direction;
  var spacesMoved = 0;
  if (axis == "horizontal") {
    direction = "right";
  } else {
    direction = "down";
  }

  /*
   * Every x milliseconds, replace the image of the ghost at the current
   * index with an empty pathway image, move the ghost 1 block in the
   * desired direction, then add the ghost image to the block at the new index.
   * This simulates movement, where adding/removing the images are done by manually
   * updating the class list of the current block, which is represented as a div
   * within the gridElements array.
   */
  setInterval(() => {
    gridElements[myIndex].classList.remove(spriteToMove);
    if (direction == "down") {
      if (spacesMoved == 0) {
        spacesMoved = -1;
        direction = "up";
      }
      myIndex += offset;
    } else if (direction == "up") {
      if (spacesMoved == 0) {
        spacesMoved = -1;
        direction = "down";
      }
      myIndex -= offset;
    } else if (direction == "right") {
      if (spacesMoved == 1) {
        spacesMoved = -1;
        direction = "left";
      }
      myIndex += offset;
    } else {
      if (spacesMoved == 1) {
        spacesMoved = -1;
        direction = "right";
      }
      myIndex -= offset;
    }
    gridElements[myIndex].classList.add(spriteToMove);
    spacesMoved++;
  }, ghostSpeed);
}

/*
 * Adds the ghosts and pacman sprites to the game and idly
 * move the ghosts back and forth within their prison by calling
 * a helper function
 */
function spawnSprites() {
  gridElements[pacmanIndex].classList.add("pacMan");
  idlyMoveGhost(width, 185, "pinky", "vertical");
  idlyMoveGhost(width, 186, "blinky", "vertical");
  idlyMoveGhost(width, 187, "inky", "vertical");
  idlyMoveGhost(1, 229, "clyde", "horizontal");
}

/**
 * Creates a div for each box in the grid, some of which are actual walls
 * and some that are invisble walls used as "padding" for better proportionality.
 * Manually defines the class each div is part of using the classList property of
 * the div, and finally adds it to both the container div that houses the actual
 * game, as well as the gridElements array for further manipulation during gameplay.
 */
function buildWalls() {
  var mainContainer = document.getElementById("container");
  mainContainer.style.width = "" + width * 35 + "px";
  mainContainer.style.height = "" + 16 * 35 + "px";
  console.log("Setting container to: " + width * 35);
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
    }
    else if (gridLayout[i] == 8) {
      gridElement.classList.add("travelledPath");
    }
    else if (gridLayout[i] == 9) {
      gridElement.classList.add("uWall");
    }
    else if (gridLayout[i] == 10) {
      gridElement.classList.add("uWall");
      gridElement.style.transform = "rotate(90deg)";
    }
    else if (gridLayout[i] == 11) {
      gridElement.classList.add("uWall");
      gridElement.style.transform = "rotate(180deg)";
    }
    else if (gridLayout[i] == 12) {
      gridElement.classList.add("uWall");
      gridElement.style.transform = "rotate(270deg)";
    }
    else if (gridLayout[i] == 13) {
      gridElement.classList.add("squareWall");
    }
    mainContainer.appendChild(gridElement);
    gridElements.push(gridElement);
  }
}

/*
 * Checks if the div to the left of the current sprite is
 * anything but a wall and is available to move into. Returns
 * true if so and false otherwise
 */
function checkLeft(index) {
  if (
    index % width !== 0 &&
    gridElements[index - 1].classList.contains("availablePath") ||
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
    index % width !== 0 &&
    gridElements[index + 1].classList.contains("availablePath") ||
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
    index - width >= 0 &&
    gridElements[index - width].classList.contains("availablePath") ||
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
    index + width < width * width &&
    gridElements[index + width].classList.contains("availablePath") ||
    gridElements[index + width].classList.contains("travelledPath")
  ) {
    return true;
  }
  return false;
}

function checkGameStatus(){
  console.log("Pellets eaten: " + pelletsEaten);
}

function releaseGhost(ghostToRelease){

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
function moveSprite(direction) {
  gridElements[pacmanIndex].classList.remove("pacMan");
  gridElements[pacmanIndex].classList.add("travelledPath");
  if (direction == 0 && checkUp(pacmanIndex)) {
    pacmanIndex -= width;
  } else if (direction == 1 && checkRight(pacmanIndex)) {
    pacmanIndex += 1;
    if (gridElements[pacmanIndex] === gridElements[519]) {
      pacmanIndex = 494;
    }
  } else if (direction == 2 && checkDown(pacmanIndex)) {
    pacmanIndex += width;
  } else if(direction== 3 && checkLeft(pacmanIndex)){
    pacmanIndex -= 1;
      if (gridElements[pacmanIndex] === gridElements[494]) {
        pacmanIndex = 519;
      }
  }
  if(gridElements[pacmanIndex].classList.contains("availablePath")){
    gridElements[pacmanIndex].classList.remove("availablePath")
    pelletsEaten+=1;
  }
  gridElements[pacmanIndex].classList.add("pacMan");
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
  moveSprite(direction);
  let moveInterval = setInterval(() => {
    if (direction != pacmanDirection) {
      clearInterval(moveInterval);
      direction=-1;
    } else {
      moveSprite(direction);
    }
  }, pacmanSpeed);
}

function makeMove(e){
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
      if (pacmanDirection != 3) {
        if (checkLeft(pacmanIndex)) {
          madeAutoMove = true;
          pacmanDirection = 3;
          loop(3);
        } else {
          setTimeout(() => {
            interpretMove(e);
          }, pacmanSpeed / 2);
        }
      }
      break;
    case 38:
      if (pacmanDirection != 0) {
        if (checkUp(pacmanIndex)) {
          madeAutoMove = true;
          pacmanDirection = 0;
          loop(0);
        } else {
          setTimeout(() => {
            interpretMove(e);
          }, pacmanSpeed / 2);
        }
      }
      break;
    case 39:
      if (pacmanDirection != 1) {
        if (checkRight(pacmanIndex)) {
          madeAutoMove = true;
          pacmanDirection = 1;
          loop(1);
        } else {
          setTimeout(() => {
            interpretMove(e);
          }, pacmanSpeed / 2);
        }
      }
      break;
    case 40:
      if (pacmanDirection != 2) {
        if (checkDown(pacmanIndex)) {
          madeAutoMove = true;
          pacmanDirection = 2;
          loop(2);
        } else {
          setTimeout(() => {
            interpretMove(e);
          }, pacmanSpeed / 2);
        }
      }
      break;
  }
}
document.addEventListener("keydown", makeMove);

document.addEventListener("DOMContentLoaded", main);
