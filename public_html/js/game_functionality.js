/**
 * Author: Braxton Little
 * Date: 4/12/2023
 * Purpose: This file creates and simulates the running of a classic Pacman arcade
 * game. Once the page is loaded, this file will build the walls of the game, spawn
 * pacman and the ghosts, and execute playing of the game until the user dies 3 times
 * or all of the pellets have been eaten. Functionality is based on pure JS.
 */

const gridElements = [];
var gridLayout = [
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1,
  1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1,
  1, 3, 0, 3, 3, 3, 3, 0, 3, 3, 3, 3, 0, 3, 1, 3, 0, 3, 3, 3, 3, 0, 3, 3, 3, 3, 0, 3, 1,
  1, 3, 0, 3, 1, 1, 3, 0, 3, 1, 1, 3, 0, 3, 1, 3, 0, 3, 1, 1, 3, 0, 3, 1, 1, 3, 0, 3, 1,
  1, 3, 0, 3, 3, 3, 3, 0, 3, 3, 3, 3, 0, 3, 3, 3, 0, 3, 3, 3, 3, 0, 3, 3, 3, 3, 0, 3, 1,
  1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1,
  1, 3, 0, 3, 3, 3, 3, 0, 3, 3, 3, 0, 3, 3, 3, 3, 3, 0, 3, 3, 3, 0, 3, 3, 3, 3, 0, 3, 1,
  1, 3, 0, 3, 1, 1, 3, 0, 3, 1, 3, 0, 3, 1, 1, 1, 3, 0, 3, 1, 3, 0, 3, 1, 1, 3, 0, 3, 1,
  1, 3, 0, 3, 1, 1, 3, 0, 3, 1, 3, 0, 3, 1, 1, 1, 3, 0, 3, 1, 3, 0, 3, 1, 1, 3, 0, 3, 1,
  1, 3, 0, 3, 3, 3, 3, 0, 3, 3, 3, 0, 3, 3, 3, 3, 3, 0, 3, 3, 3, 0, 3, 3, 3, 3, 0, 3, 1,
  1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1,
  1, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 3, 3, 3, 3, 3, 3, 3, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 3, 2, 2, 2, 2, 2, 2, 2, 3, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 3, 2, 0, 0, 0, 0, 0, 2, 3, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1,
  3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 2, 0, 0, 0, 0, 0, 2, 3, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3,
  3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3,
  3, 3, 3, 3, 3, 0, 3, 3, 3, 0, 3, 2, 2, 0, 0, 0, 2, 2, 3, 0, 3, 3, 3, 0, 3, 3, 3, 3, 3,
  1, 1, 1, 1, 3, 0, 3, 1, 3, 0, 3, 2, 2, 0, 0, 0, 2, 2, 3, 0, 3, 1, 3, 0, 3, 1, 1, 1, 1,
  1, 1, 1, 1, 3, 0, 3, 1, 3, 0, 3, 2, 2, 2, 2, 2, 2, 2, 3, 0, 3, 1, 3, 0, 3, 1, 1, 1, 1,
  1, 3, 3, 3, 3, 0, 3, 3, 3, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 3, 3, 0, 3, 3, 3, 3, 1,
  1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1,
  1, 3, 0, 3, 3, 3, 0, 3, 3, 3, 3, 3, 0, 3, 3, 3, 0, 3, 3, 3, 3, 3, 0, 3, 3, 3, 0, 3, 1,
  1, 3, 0, 3, 1, 3, 0, 3, 1, 1, 1, 3, 0, 3, 1, 3, 0, 3, 1, 1, 1, 3, 0, 3, 1, 3, 0, 3, 1,
  1, 3, 0, 3, 3, 3, 0, 3, 3, 3, 3, 3, 0, 3, 1, 3, 0, 3, 3, 3, 3, 3, 0, 3, 3, 3, 0, 3, 1,
  1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1,
  1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];

/*
 * Grab all 5 Gamepieces from server on startup to initialize defaults with.
 * Send game end notification to server so he can destroy GamePieces and reset user array
*/
var pacmanIndex = 623;
var width = 29;
var pinkyFreed = false;
var blinkyFreed = false;
var clydeFreed = false;
var inkyFreed = false;
var pacmanDirection = -1;
const PACMAN_SPEED = 100;
const GHOST_SPEED = 400;

function main() {
  console.log("Main running");
  buildWalls();
  spawnSprites();
}

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

  setInterval(() => {
    gridElements[myIndex].classList.remove(spriteToMove);
    if (direction == "down") {
      if (spacesMoved == 1) {
        spacesMoved = -1;
        direction = "up";
      }
      myIndex += offset;
    } else if (direction == "up") {
      if (spacesMoved == 1) {
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
  }, GHOST_SPEED);
}

function spawnSprites() {
  gridElements[pacmanIndex].classList.add("pacMan");
  idlyMoveGhost(width, 418, "pinky", "vertical");
  idlyMoveGhost(width, 420, "blinky", "vertical");
  idlyMoveGhost(width, 422, "inky", "vertical");
  idlyMoveGhost(1, 535, "clyde", "horizontal");
}

/**
 * Creates a div for each box in the grid, some of which are actual walls
 * and some that are invisble walls used as "padding" for better proportionality
 */
function buildWalls() {
  var mainContainer = document.getElementById("container");
  for (i = 0; i < gridLayout.length; i++) {
    const gridElement = document.createElement("div");
    if (gridLayout[i] == 0) {
      gridElement.classList.add("availablePath");
    } else if (gridLayout[i] == 1) {
      gridElement.classList.add("gridWall");
    } else if (gridLayout[i] == 2) {
      gridElement.classList.add("ghostPrison");
    } else if (gridLayout[i] == 3) {
      gridElement.classList.add("gridCushion");
    }
    mainContainer.appendChild(gridElement);
    gridElements.push(gridElement);
  }
}

function checkLeft(index) {
  if (
    index % width !== 0 &&
    !gridElements[index - 1].classList.contains("gridWall") &&
    !gridElements[index - 1].classList.contains("ghostPrison") &&
    !gridElements[index - 1].classList.contains("gridCushion")
  ) {
    return true;
  }
  return false;
}

function checkRight(index) {
  if (
    index % width !== 0 &&
    !gridElements[index + 1].classList.contains("gridWall") &&
    !gridElements[index + 1].classList.contains("ghostPrison") &&
    !gridElements[index + 1].classList.contains("gridCushion")
  ) {
    return true;
  }
  return false;
}

function checkUp(index){
  if( index - width >= 0 &&
    !gridElements[index - width].classList.contains("gridWall") &&
    !gridElements[index - width].classList.contains("ghostPrison") &&
    !gridElements[index - width].classList.contains("gridCushion")){
      return true;
    }
    return false;
}

function checkDown(index){
if(index + width < width * width &&
  !gridElements[index + width].classList.contains("gridWall") &&
  !gridElements[index + width].classList.contains("ghostPrison") &&
  !gridElements[index + width].classList.contains("gridCushion")){
    return true;
  }
  return false;
}

/**
 *
 * @param {*} direction: left, right, up, down
 * @param {*} index: where in grid the sprite is
 * @param {*} spriteToMove: Pacman or ghost class name
 */
function moveSprite(direction, index) {
  if (direction === "left") {
    if (checkLeft(index)) return index - 1;
  } else if (direction == "right") {
    if (checkRight(index)) return index + 1;
  } else if (direction == "up") {
    if (
     checkUp(index)
    )
      return index - width;
  } else if (direction == "down") {
    if (
      checkDown(index)
    )
      return index + width;
  }
  return index;
}

function loopHelper(direction) {
  gridElements[pacmanIndex].classList.remove("pacMan");
  if (direction == 0) {
    pacmanIndex = moveSprite("up", pacmanIndex);
  } else if (direction == 1) {
    pacmanIndex = moveSprite("right", pacmanIndex);
    if (gridElements[pacmanIndex] === gridElements[519]) {
      pacmanIndex = 494;
    }
  } else if (direction == 2) {
    pacmanIndex = moveSprite("down", pacmanIndex);
  } else{
    pacmanIndex = moveSprite("left", pacmanIndex);
    if (gridElements[pacmanIndex] === gridElements[494]) {
      pacmanIndex = 519;
    }
  }
  gridElements[pacmanIndex].classList.add("pacMan");
}

function loop(direction) {
  loopHelper(direction);
  let moveInterval = setInterval(() => {
    if (direction != pacmanDirection) {
      clearInterval(moveInterval);
    } else {
      loopHelper(direction);
    }
  }, PACMAN_SPEED);
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
      if(pacmanDirection!=3){
        if(checkLeft(pacmanIndex)){
          pacmanDirection = 3;
          loop(3);
        }
        else{
          setTimeout(()=>{interpretMove(e)}, PACMAN_SPEED/2);
        }
      }
      break;
    case 38:
      if(pacmanDirection!=0){
        if(checkUp(pacmanIndex)){
          pacmanDirection = 0;
          loop(0);
        }
        else{
          setTimeout(()=>{interpretMove(e)}, PACMAN_SPEED/2);
        }
      }
      break;
    case 39:
      if(pacmanDirection!=1){
        if(checkRight(pacmanIndex)){
          pacmanDirection = 1;
          loop(1);
        }
        else{
          setTimeout(()=>{interpretMove(e)}, PACMAN_SPEED/2);
        }
      }
      break;
    case 40:
      if(pacmanDirection!=2){
        if(checkDown(pacmanIndex)){
          pacmanDirection = 2;
          loop(2);
        }
        else{
          setTimeout(()=>{interpretMove(e)}, PACMAN_SPEED/4);
        }
      }
      break;
  }
}
document.addEventListener("keydown", interpretMove);

document.addEventListener("DOMContentLoaded", main);
