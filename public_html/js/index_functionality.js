/*
    Jake Gridley
    index_functionality.js: Adds functional to index.html page.
*/


/*
    This function creates a new user if it is not already in the database
*/
function createUser() {
    var url = "http://localhost:3000/add/user/"
    var usernameText = document.getElementById("newUser").value;
    var passwordText = document.getElementById("newPass").value;
    const data = { username: usernameText, password: passwordText };
    document.getElementById("newUser").value = "";
    document.getElementById("newPass").value = "";

    if (usernameText != "" && passwordText != "") { 
        fetch(url, {
            method: 'POST',
            headers: {"Content-Type": 'application/json'},
            body: JSON.stringify(data)
        }).then((res) => {
            return res.text();
        }).then((text) => {
            alert(text);
        }).catch((err) => {console.log(err);});
    } else {
        alert("Please enter an Username and a Password");
    }
}

/*
    This function logs in the user
*/
function userLogin() {
    var url = "http://localhost:3000/login/";
    var usernameText = document.getElementById("oldUser").value;
    var passwordText = document.getElementById("oldPass").value;
    const data = { username: usernameText, password: passwordText };
    document.getElementById("oldUser").value = "";
    document.getElementById("oldPass").value = "";
    url += usernameText + "/" + passwordText; 

    if (usernameText != "" && passwordText != "") { 
        fetch(url).then((res) => {
            return res.text();
        }).then((text) => {
            if (text == "SUCCESS") {
                window.location.href = "menu.html";
            } else {
                document.getElementById("invalidMsg").innerText = "Unable to Log In with that info";
            }
        }).catch((err) => {console.log(err);});
    } else {
        alert("Please enter an Username and a Password");
    }
}