const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const mongoDB = "mongodb://127.0.0.1:27017/pacman";

app.use(express.static("public_html"));
app.use(express.json());

/*
 * Initialize connection with database and create necessary Schemas.
 * GamePiece object can be either Ghost or PacMan sprites, which
 * is defined by the type attribute. Both game pieces need speed,
 * PacMan needs lives and pellets eaten attribute, and Ghosts need
 * flashing attribute. There will be a single scoreboard object
 * that contains the names and scores of the top 10 PacMan scores
 * played all time. Every time a game is played, we'll update this
 * universal scoreboard if necessary
 */
async function main() {
  mongoose.createConnection(mongoDB);
  await mongoose.connect(mongoDB);
  var Schema = mongoose.Schema;
  var userSchema = new Schema({
    username: String,
    password: String,
    friends: [String],
    highscore: Number,
  });
  User = mongoose.model("User", userSchema);

  var gamePieceSchema = new Schema({
    type: String,
    lives: Number,
    speed: Number,
    flashing: Boolean,
    pelletseaten: Number,
  });
  GamePiece = mongoose.model("GamePiece", gamePieceSchema);

  var allTimeScoreboard = new Schema({
    TopTenPlayerNames: [String],
    TopTenPlayerScores: [Number],
  });
  Scoreboard = mongoose.model("AllTimeScoreboard", allTimeScoreboard);
}

/*
 * Waits for main to run, then creates express server on port 3000.
 */
main()
  .then(() => {
    app.listen(port, (error) => {
      if (error) {
        console.log("Error listening on port", port);
      } else {
        console.log("Listening on port", port);
      }
    });
  })
  .catch((error) => {
    console.log("Error connecting to database: " + error);
  });
