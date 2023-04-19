const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const port = 3000;
const app = express();
const mongoDB = `mongodb://localhost:27017/pacman`;

app.use(express.static('public_html'));
app.use(express.json());
app.use(bodyparser.json());
app.use(cookieParser());

mongoose.connect(mongoDB, {useNewUrlParser: true});
mongoose.connection.on("err", () => {
    console.log("there was a problem connecting to mongodb");
});
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

// adds a user to the database
app.post('/add/user/', (req,res) => {

    var data = req.body;
    var username = data["username"];
    var password = data["password"];
    var listings = [];
    var purchases = [];

    let p1 = User.find({username:username}).exec();
    p1.then( (results) => {
        if (results.length > 0) {
            res.end("User already exists");
        } else {
            var newUser = new User({ username, password, listings, purchases});
            let p2 = newUser.save();
            p2.then((doc) => {
                res.end("New Account Created!");
            }).catch((err) => {
                console.log(err);
                res.end("Failed to Create New User");
            });
        }
    }).catch((err) => {
        console.log(err);
        res.end("Failed to Create New User");
    })
});

app.get('/login/:user/:pass', (req, res) => {
    var u = req.params.user;
    var p = req.params.pass;

    let p1 = User.find( {username: u, password: p} ).exec();
    p1.then( (results) => {
        if (results.length == 1) {
            res.cookie("login", u, {maxAge: 1200000});
            res.end("SUCCESS");
        } else {
            res.end("Unable to Log in");
        }
    }).catch((err) => {
        console.log(err);
        res.end("Unable to Log in");
    })
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));



/*const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const mongoDB = "mongodb://127.0.0.1:27017/pacman";

app.use(express.static("./public_html/html"));
app.use(express.json());*/

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
/*
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
}*/

/*
 * Waits for main to run, then creates express server on port 3000.
 */
/*
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
*/
