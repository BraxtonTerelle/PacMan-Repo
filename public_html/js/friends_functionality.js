function addFriend() {
  var url = "http://localhost:3000/add/friend/";
  var name = document.getElementById("friendUser").value;
  var user = document.cookie.split("=")[1];
  url += name + "/" + user;
  document.getElementById("friendUser").value = "";

  fetch(url)
    .then((res) => {
      return res.text();
    })
    .then((val) => {
      if (val == "SUCCESS") {
        alert("Friend Added!");
        location.reload;
      } else if (val == "EXISTS") {
        alert("You have already added this user as a friend.");
      } else {
        alert("This user does not exist!");
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function getFriendsScores() {
  var url = "http://localhost:3000/get/friends/scores/";
  var user = document.cookie.split("=")[1];
  url += user;

  fetch(url)
    .then((res) => {
      return res.json();
    })
    .then((obj) => {
      var html = "";
      for (i in obj) {
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
