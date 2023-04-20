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
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
  3, 3, 3, 3, 3, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 3, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 3, 0, 3, 3, 3, 3, 0, 3, 3, 3, 3, 0, 3, 1, 3, 0,
  3, 3, 3, 3, 0, 3, 3, 3, 3, 0, 3, 1, 1, 3, 0, 3, 1, 1, 3, 0, 3, 1, 1, 3, 0, 3,
  1, 3, 0, 3, 1, 1, 3, 0, 3, 1, 1, 3, 0, 3, 1, 1, 3, 0, 3, 3, 3, 3, 0, 3, 3, 3,
  3, 0, 3, 3, 3, 0, 3, 3, 3, 3, 0, 3, 3, 3, 3, 0, 3, 1, 1, 3, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 3, 0, 3, 3,
  3, 3, 0, 3, 3, 3, 0, 3, 3, 3, 3, 3, 0, 3, 3, 3, 0, 3, 3, 3, 3, 0, 3, 1, 1, 3,
  0, 3, 1, 1, 3, 0, 3, 1, 3, 0, 3, 1, 1, 1, 3, 0, 3, 1, 3, 0, 3, 1, 1, 3, 0, 3,
  1, 1, 3, 0, 3, 1, 1, 3, 0, 3, 1, 3, 0, 0, 3, 1, 3, 0, 0, 3, 1, 3, 0, 3, 1, 1,
  3, 0, 3, 1, 1, 3, 0, 3, 1, 1, 3, 0, 3, 1, 1, 3, 0, 3, 1, 3, 0, 3, 1, 1, 3, 0,
  3, 1, 1, 3, 0, 3, 1, 1, 3, 0, 3, 3, 3, 3, 0, 3, 3, 3, 3, 0, 3, 3, 3, 0, 3, 3,
  3, 3, 0, 3, 3, 3, 3, 0, 3, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 3, 3,
  3, 3, 3, 3, 3, 3, 0, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0,
  3, 2, 2, 2, 2, 2, 2, 2, 3, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 3, 0, 3, 2, 0, 0, 0, 0, 0, 2, 3, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3,
  3, 3, 3, 3, 3, 0, 3, 2, 0, 0, 0, 0, 0, 2, 3, 0, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 2, 2, 0, 0, 0, 2, 2, 3, 0, 3, 3, 3, 3,
  3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 3, 2, 2, 0, 0, 0, 2, 2, 3, 0, 3,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 0, 3, 2, 2, 2, 2, 2, 2, 2,
  3, 0, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3,
  3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 3, 0, 3, 3, 3, 0, 3, 3, 3, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 3, 3, 3, 0, 3, 1, 1, 3, 0, 3, 1, 3, 0, 3, 1,
  3, 3, 3, 0, 3, 3, 3, 0, 3, 3, 3, 1, 3, 0, 3, 1, 3, 0, 3, 1, 1, 3, 0, 3, 1, 3,
  0, 3, 1, 1, 1, 3, 0, 3, 1, 3, 0, 3, 1, 1, 1, 3, 0, 3, 1, 3, 0, 3, 1, 1, 3, 0,
  3, 3, 3, 0, 3, 3, 3, 3, 3, 0, 3, 3, 3, 0, 3, 3, 3, 3, 3, 0, 3, 3, 3, 0, 3, 1,
  1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
  3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1,
];
var pacmanIndex = 652;
var width = 29;
var pinkyFreed = false;
var blinkyFreed = false;
var clydeFreed = false;
var inkyFreed = false;
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
      myIndex += offset;
      if (spacesMoved == 2) {
        spacesMoved = 0;
        direction = "up";
      }
    } else if (direction == "up") {
      myIndex -= offset;
      if (spacesMoved == 2) {
        spacesMoved = 0;
        direction = "down";
      }
    } else if (direction == "right") {
      myIndex += offset;
      if (spacesMoved == 2) {
        spacesMoved = 0;
        direction = "left";
      }
    } else {
      myIndex -= offset;
      if (spacesMoved == 2) {
        spacesMoved = 0;
        direction = "right";
      }
    }
    gridElements[myIndex].classList.add(spriteToMove);
    spacesMoved++;
  }, 700);
}

function spawnSprites() {
  gridElements[pacmanIndex].classList.add("pacMan");

  idlyMoveGhost(width, 418, "pinky", "vertical");
  idlyMoveGhost(width, 420, "blinky", "vertical");
  idlyMoveGhost(width, 422, "inky", "vertical");
  idlyMoveGhost(1, 534, "clyde", "horizontal");
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

/**
 *
 * @param {*} direction: left, right, up, down
 * @param {*} index: where in grid the sprite is
 * @param {*} spriteToMove: Pacman or ghost class name
 */
function moveSprite(direction, index) {
  if (direction === "left") {
    if (
      index % width !== 0 &&
      !gridElements[index - 1].classList.contains("gridWall") &&
      !gridElements[index - 1].classList.contains("ghostPrison") &&
      !gridElements[index - 1].classList.contains("gridCushion")
    )
      return index - 1;
  } else if (direction == "right") {
    if (
      pacmanIndex % width < width - 1 &&
      !gridElements[index + 1].classList.contains("gridWall") &&
      !gridElements[index + 1].classList.contains("ghostPrison") &&
      !gridElements[index + 1].classList.contains("gridCushion")
    )
      return index + 1;
  } else if (direction == "up") {
    if (
      index - width >= 0 &&
      !gridElements[index - width].classList.contains("gridWall") &&
      !gridElements[index - width].classList.contains("ghostPrison") &&
      !gridElements[index - width].classList.contains("gridCushion")
    )
      return index - width;
  } else if (direction == "down") {
    if (
      index + width < width * width &&
      !gridElements[index + width].classList.contains("gridWall") &&
      !gridElements[index + width].classList.contains("ghostPrison") &&
      !gridElements[index + width].classList.contains("gridCushion")
    )
      return index + width;
  }
  return index;
}

/**
 *
 * @param {*} e: returned keydown event
 * Interprets the keyboard key pressed and calls
 * helper function that actually moves the pacman
 */
function interpretMove(e) {
  gridElements[pacmanIndex].classList.remove("pacMan");
  switch (e.keyCode) {
    case 37:
      // Arrow left
      pacmanIndex = moveSprite("left", pacmanIndex);
      if (gridElements[pacmanIndex - 1] === gridElements[493]) {
        pacmanIndex = 520;
      }
      break;
    case 38:
      // Arrow up
      pacmanIndex = moveSprite("up", pacmanIndex);
      break;
    case 39:
      // Arrow right
      pacmanIndex = moveSprite("right", pacmanIndex);
      if (gridElements[pacmanIndex - 1] === gridElements[519]) {
        pacmanIndex = 494;
      }
      break;
    case 40:
      // Arrow down
      pacmanIndex = moveSprite("down", pacmanIndex);
      break;
  }
  gridElements[pacmanIndex].classList.add("pacMan");
}
document.addEventListener("keydown", interpretMove);

document.addEventListener("DOMContentLoaded", main);
