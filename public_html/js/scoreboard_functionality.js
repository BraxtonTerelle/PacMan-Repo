/*
    Jake Gridley
    scoreboard_functionality.js: Adds functional to scoreboard.html page.
*/

/*
    This function requests data from the server using the fetch api, 
    the data is return as a string of html containing the top 10 users
    scores.
*/
function getScoreboard() {
    var url = "http://localhost:3000/get/scoreboard/";

    fetch(url).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById("scoreboardDiv").innerHTML = text;
    }).catch((err) => {
        console.log(err);
    });

}


