var sections = ["content", "members"];
var liveTiles = {};

var refreshSection = {
	"content": function () {
		var xmlhttp = new XMLHttpRequest();
		var url = "API/users";

		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				var members = JSON.parse(xmlhttp.responseText);
				liveTiles.members = members;
				//This animates the pics in the members tile
				var membersId = 0;
				document.getElementById("facepic").src = liveTiles.members[membersId].picture;
				window.setInterval(function () {
					membersId++;
					document.getElementById("facepic").style.transform = "scale(0.1,0.1)";
					document.getElementById("facepic").style["left"] = (membersId % 3) * 200 + "px";
					setTimeout(function () {
						document.getElementById("facepic").src = liveTiles.members[membersId % liveTiles.members.length].picture;
						document.getElementById("facepic").style.transform = "scale(1,1)";
					}, 1000);
				}, 2000);
			}
		}
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	},
	"members": function () {
		var xmlhttp = new XMLHttpRequest();
		var url = "API/users";

		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				var members = JSON.parse(xmlhttp.responseText);
				document.getElementById("membersList").innerHTML = "";
				members.forEach(function (x) {
					document.getElementById("membersList").innerHTML += '<div class="member"><img src="' + x.picture + '"/><h3>' + x.firstName + '</h3><h4>' + x.lastName + '</h4></div>';
				});
			}
		}
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	}
};

function goTo(section) {
	if (refreshSection[section]) {
		refreshSection[section]();
	}
   	window.scrollTo(0, 0);
	sections.filter(function (x) { return x != section }).forEach(function (x) {
		document.getElementById(x).style.opacity = "0";
		document.getElementById(x).style.visibility = "hidden";
		document.getElementById(x).style["z-index"] = "-999";
	});
	document.getElementById(section).style.opacity = "1";
	document.getElementById(section).style.visibility = "visible";
	document.getElementById(section).style["z-index"] = "0";
}

window.addEventListener("load", function () {
	goTo("content");
	
	
	//This piece of code makes the external link work and animate with just setting the data-openlink property
	var tiles = document.getElementsByClassName("box");
	for (var i = 0; i < tiles.length; i++) {
		var x = tiles[i];
		if (x.dataset.openlink) {
			x.addEventListener("mouseup", (function (x) {
				return function (e) {
					document.getElementById("fadeout").style["z-index"] = "10000";
					document.getElementById("fadeout").style.opacity = "1";
					window.setTimeout(function () {
						document.location = x.dataset.openlink;
					}, 800);
					//In case of mailto:, so the user can keep using the page
					window.setTimeout(function () {
						document.getElementById("fadeout").style["z-index"] = "-10000";
						document.getElementById("fadeout").style.opacity = "0";
					}, 1600);
				}
			})(x));
		}
	}
	
	//This piece of code makes the sections "link"" work and animate with just setting the data-opensection property
	var tiles = document.getElementsByClassName("action");
	for (var i = 0; i < tiles.length; i++) {
		var x = tiles[i];
		if (x.dataset.opensection) {
			x.addEventListener("mouseup", (function (x) {
				return function (e) {
					document.getElementById("fadeout_section").style["z-index"] = "90";
					document.getElementById("fadeout_section").style.opacity = "1";
					window.setTimeout(function () {
						goTo(x.dataset.opensection);
					}, 800);
					window.setTimeout(function () {
						document.getElementById("fadeout_section").style.opacity = "0";
					}, 850);
					window.setTimeout(function () {
						document.getElementById("fadeout_section").style["z-index"] = "-10000";
					}, 1600);
				}
			})(x));
		}
	}

});