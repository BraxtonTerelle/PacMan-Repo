/**
 * Author: Braxton Little
 * Date: 4/12/2023
 * Purpose: This file creates and simulates the running of a classic Pacman arcade
 * game. Once the page is loaded, this file will build the walls of the game, spawn
 * pacman and the ghosts, and execute playing of the game until the user dies 3 times
 * or all of the pellets have been eaten. Functionality is based on pure JS.
 */

const gridElements = [];

// 1's indicate walls, 3's indicate cushioning, 0's indicate pathway, and 2's indicate prison walls
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
var pacmanIndex;
var width;
var pinkyFreed;
var blinkyFreed;
var clydeFreed;
var inkyFreed;
var pacmanDirection;
var pacmanSpeed;
var ghostSpeed;


/*
 * Calls necessary helper functions in a logical order
 */
function main() {
  console.log("Main running");
  initializeDefaults();
  buildWalls();
  spawnSprites();
}


/*
 * Grab starting values from server and initialize them here before continuing on with game
 */
function initializeDefaults(){
  pacmanIndex = 623;
  width = 29;
  pinkyFreed = false;
  blinkyFreed = false;
  clydeFreed = false;
  inkyFreed = false;
  pacmanDirection = -1;
  pacmanSpeed = 100;
  ghostSpeed = 400;
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
  }, ghostSpeed);
}

/*
 * Adds the ghosts and pacman sprites to the game and idly
 * move the ghosts back and forth within their prison by calling
 * a helper function
 */
function spawnSprites() {
  gridElements[pacmanIndex].classList.add("pacMan");
  idlyMoveGhost(width, 418, "pinky", "vertical");
  idlyMoveGhost(width, 420, "blinky", "vertical");
  idlyMoveGhost(width, 422, "inky", "vertical");
  idlyMoveGhost(1, 535, "clyde", "horizontal");
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

/*
 * Checks if the div to the left of the current sprite is
 * anything but a wall and is available to move into. Returns
 * true if so and false otherwise
 */
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

/*
 * Checks if the div to the right of the current sprite is
 * anything but a wall and is available to move into. Returns
 * true if so and false otherwise
 */
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

/*
 * Checks if the div above the current sprite is
 * anything but a wall and is available to move into. Returns
 * true if so and false otherwise
 */
function checkUp(index){
  if( index - width >= 0 &&
    !gridElements[index - width].classList.contains("gridWall") &&
    !gridElements[index - width].classList.contains("ghostPrison") &&
    !gridElements[index - width].classList.contains("gridCushion")){
      return true;
    }
    return false;
}

/*
 * Checks if the div below the current sprite is
 * anything but a wall and is available to move into. Returns
 * true if so and false otherwise
 */
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
 * 
 */
function moveSprite(direction, index) {
  if (direction === "left") {
    if (checkLeft(index)) return index - 1;
  } else if (direction == "right") {
    if (checkRight(index)) return index + 1;
  } else if (direction == "down") {
    if (
      checkDown(index)
    )
      return index + width;
  }
  return index;
}

/*
 * Moves any sprite in a specified direction by first checking if it 
 * can move in that direction, then updating its index accordingly.
 * The function increment/decrements the index by 1 to move right/left,
 * and increment/decrements by a whole row to move up/down. It also
 * enables teleportation feature
 */
function moveSprite(direction) {
  gridElements[pacmanIndex].classList.remove("pacMan");
  if (direction == 0 && checkUp(pacmanIndex)) {
    pacmanIndex -=width;
  } else if (direction == 1 && checkRight(pacmanIndex)) {
    pacmanIndex+=1;
    if (gridElements[pacmanIndex] === gridElements[519]) {
      pacmanIndex = 494;
    }
  } else if (direction == 2 && checkDown(pacmanIndex)) {
    pacmanIndex +=width;
  } else{
    if(checkLeft(pacmanIndex)){
    pacmanIndex-=1;
    if (gridElements[pacmanIndex] === gridElements[494]) {
      pacmanIndex = 519;
    }
    }
  }
  gridElements[pacmanIndex].classList.add("pacMan");
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
    } else {
      movePacman(direction);
    }
  }, pacmanSpeed);
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
          setTimeout(()=>{interpretMove(e)}, pacmanSpeed/2);
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
          setTimeout(()=>{interpretMove(e)}, pacmanSpeed/2);
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
          setTimeout(()=>{interpretMove(e)}, pacmanSpeed/2);
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
          setTimeout(()=>{interpretMove(e)}, pacmanSpeed/4);
        }
      }
      break;
  }
}
document.addEventListener("keydown", interpretMove);

document.addEventListener("DOMContentLoaded", main);
