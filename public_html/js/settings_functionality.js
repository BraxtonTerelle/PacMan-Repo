
/*
    Jake Gridley
    game_functionality.js: Adds functional to game.html page.
*/

/*
    This function is run when the user clicks the start game button on the settings.html page.
    It takes the speed and difficulty from the selection menu and calls fetch to the correct
    endpoint on the server. If the server correctly handles the fetch request, the client
    will redirect to the game.html page.
*/
function startGame() {
    
    var speed = document.getElementById("speedSelection").value;
    var diff = document.getElementById("diffSelection").value;

    var url = "http://localhost:3000/add/custom/";
    var user = document.cookie.split("=")[1];
    
    const data = { s: speed, d: diff, u: user };

    let p = fetch(url, {
        method: 'POST',
        headers: {"Content-Type": 'application/json'},
        body: JSON.stringify(data)
    }).then((res) => {
        return res.text();
    }).then((text) => {
        if (text == "GOOD") {
            window.location.href = "./game.html";
        } else {
            alert("Something went wrong. Please try logging in again. :(");
        }
    }).catch((err) => {
        console.log(err);
    });
}

