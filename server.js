
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
    pieces: [String]
});
User = mongoose.model("User", userSchema);

var gamePieceSchema = new Schema({
    type: String, // pacman vs ghost
    name: String, // ex Inky Blinky
    lives: Number, // pacman init to 3
    speed: Number, //slow 800 med 600 fast 400
    flashing: Boolean, //init at false
    intermediate: Boolean, // diff
    freed: Boolean, // init to false
    pelletseaten: Number, // pellets eaten init to 0
});
GamePiece = mongoose.model("GamePiece", gamePieceSchema);

var allTimeScoreboard = new Schema({
    TopTenPlayers: [{
        name: String,
        score: Number
    }],
    CurrentSize: Number
});
Scoreboard = mongoose.model("AllTimeScoreboard", allTimeScoreboard);


app.post('/add/custom/', (req, res) => {
    var data = req.body;
    var speed = data["s"];
    var diff = data["d"];
    var user = data["u"];
    var s;
    var gd1 = true;
    var gd2 = false;
    var gd3 = false;
    var gd4 = false;

    console.log(diff);
    console.log(speed);

    if (speed == "slow") {
        s = 800;
    } else if (speed == "medium") {
        s = 600;
    } else if (speed == "fast") {
        s = 400;
    }

    
    if (diff == "medium") {
        gd2 = true;
    } else if (diff == "hard") {
        gd2 = true;
        gd3 = true;
    }

    let p1 = User.findOne({username: user}).exec();
    p1.then((result) => {
        result.pieces = [];
        // update all game pieces with new schema
        var pac = new GamePiece({ type: "pacman", name: "Pacman", lives: 3,  speed: s, flashing: false, intermediate: false, freed: true, pelletseaten: 0});
        pac.save();
        result.pieces.push(pac._id);

        var g1 = new GamePiece({ type: "ghost", name: "Blinky", lives: 0,  speed: s, flashing: false, intermediate: gd1, freed: false, pelletseaten: 0});
        g1.save();
        result.pieces.push(g1._id);

        var g2 = new GamePiece({ type: "ghost", name: "Plinky", lives: 0,  speed: s, flashing: false, intermediate: gd2, freed: false, pelletseaten: 0 });
        g2.save();
        result.pieces.push(g2._id);

        var g3 = new GamePiece({ type: "ghost", name: "Clyde", lives: 0,  speed: s, flashing: false, intermediate: gd3, freed: false, pelletseaten: 0 });
        g3.save();
        result.pieces.push(g3._id);

        var g4 = new GamePiece({ type: "ghost", name: "Inky", lives: 0,  speed: s, flashing: false, intermediate: gd4, freed: false, pelletseaten: 0});
        g4.save();
        result.pieces.push(g4._id);

        result.save();
        res.send("GOOD");


    }).catch((err) => {
        console.log(err);
    });

});

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

app.get('/add/friend/:FRIEND/:USER', (req, res) => {

    var f = req.params.FRIEND;
    var u = req.params.USER;

    let p1 = User.findOne( {username: u}).exec();
    let p2 = User.find( {username: f}).exec();

    p1.then((result) => {
        p2.then((result2) => {
            if (result2.length != 1) {
                res.end("DNE");
            } else {
                for (i in result.friends) {
                    if (result.friends[i] == result2[0].username) {
                        res.end("EXISTS");
                        return;
                    }
                }
                console.log(result2[0].username);
                result.friends.push(result2[0].username);
                result.save();
                res.end("SUCCESS");
            }
        }).catch((err) => {
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
    });
});

app.get("/get/friends/scores/:USER", (req, res) => {
    let u = req.params.USER;
    let p = User.findOne({ username: u }).exec();
    p.then((results) => {
      return results.friends;
    }).then((val) => {
        var promises = [];
        for (i in val) {
            let p1 = User.findOne({ username: val[i] }).exec();
            let friendPromise = p1.then((res1) => {
                let val;
                if (!res1.highscore) {
                    val = "No Score";
                } else {
                    val = res1.highscore;
                }
                return "<div style='border: #ff895d solid 2px; font-size: 2em; font-family:Courier'>" + 
                    res1.username + ":\t" + val + "</div>";
            }).catch((err) => {
                console.log(err);
            });
            promises.push(friendPromise);
        }
        Promise.all(promises).then((texts) => {
            res.send(texts.join(""));
        }).catch((err) => {
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
    });
});
  
// works
app.get("/get/scoreboard/", (req, res) => {

    let p = Scoreboard.findOne({}).exec();

    p.then((result) => {
        let players = result.TopTenPlayers;
        return players;
    }).then((arr) => {
        var html = "";
        for (i in arr) {
            let x = Number(i) + 1;
            html += "<div style='border: #ff895d solid 2px; font-size: 2.2em; font-family:Courier'><div>" + x + ".\t" + 
                arr[i].name + "</div><div>(Score:\t" + arr[i].score + ")</div></div>";
        }
        return html;
    }).then((retval) => {
        res.send(retval);
    }).catch((err) => {
        console.log(err);
    });

});


app.get('/begin/game/:USER', (req,res) => {
    var u = req.params.USER;

    p1 = User.findOne({username: u}).exec();
    p1.then((result) => {
        return result.pieces;
    }).then((val) => {
        var promises = [];
        for (i in val) {
            let p1 = GamePiece.findOne({ _id: val[i] }).exec();
            let piecePromise = p1.then((res1) => {
                return res1;
            }).catch((err) => {
                console.log(err);
            });
            promises.push(piecePromise);
        }        
        Promise.all(promises).then((texts) => {
            res.send(texts);
        }).catch((err) => {
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
    });
});

app.get('/gameover/:USER/:PELLETS', (req,res) => {
    let u = req.params.USER;
    let s = Number(req.params.PELLETS) * 10;
    let p = User.findOne({username: u}).exec();
    let p2 = Scoreboard.findOne({}).exec();

    p.then((result) => {
        if (result.highscore < s) {
            result.highscore = s;
            result.save();
        }
        p2.then((result2) => {
            if (result2.CurrentSize < 10) {
                result2.TopTenPlayers.push({name: u, score: s});
                result2.CurrentSize++;
            } else if (s > result2.TopTenPlayers[9].score) {
                result2.TopTenPlayers[9] = {name: u, score: s};
            }
            let sortedPlayers = result2.TopTenPlayers.sort((val1, val2) => (val2.score - val1.score));
            result2.TopTenPlayers = sortedPlayers;
            result2.save();
        }).catch((err) => {
            console.log(err);
        });
    }).catch((err) => {
        console.log(err);
    });
});

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));

