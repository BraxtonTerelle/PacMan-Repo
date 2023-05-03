
/*
    Jake Gridley
    friends_functionality.js: Adds functional to friends.html page.
*/


/*
    adds a friend to the current logged in user's friends attribute in the database
    if the username entered exists.
*/
function addFriend() {

    var url = "http://localhost:3000/add/friend/";
    var name = document.getElementById("friendUser").value;
    var user = document.cookie.split("=")[1];
    url += name + "/" + user;
    document.getElementById("friendUser").value = "";

    fetch(url).then((res) => {
        return res.text();
    }).then((val) => {
        if (val == "SUCCESS") {
            alert("Friend Added!");
            location.reload;
        } else if (val == "EXISTS") {
            alert("You have already added this user as a friend.");
        } else {
            alert("This user could not be found!");
        }
    }).catch((err) => {
        console.log(err);
    });
}

/*
    requests data from the user, which is a string of html used to display a user's 
    friends and their highscores.
*/
function getFriendsScores() {
    var url = "http://localhost:3000/get/friends/scores/";
    var user = document.cookie.split("=")[1]; 
    url += user;

    fetch(url).then((res) => {
        return res.text();
    }).then((text) => {
        document.getElementById("friendsListDiv").innerHTML = text;
    }).catch((err) => {
        console.log(err);
    });

}



