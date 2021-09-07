const socket = io("/");

function loadForm() {
    document.getElementById('buttonid').addEventListener('click', openDialog);
    function openDialog() {
        document.getElementById('inputid').click();
    }
    document.getElementById('inputid').addEventListener('change', submitForm);
    function submitForm() {
        if(confirm("Voulez vous vraiment changer votre photo de profil ?")) document.getElementById('autosubmit_form').submit();
    }
}


async function confirmDelete() {
    /*if(confirm("Voulez vous vraiment supprimer votre compte ?")) {
        //socket.emit("del-acc", uid);
        
        alert("Hello");
    }*/
    console.log(await getProfilePictureUrl());
}

function getProfilePictureUrl() {
    //console.log("test")
    return new Promise(function(resolve, reject) {
        var a = "SELECT profile_picture FROM users WHERE id_user = " + getCookie("uid");
        socket.emit("sql-select", a, (response) => {
            //console.log(a);
            resolve(response[0].profile_picture);
        })
    });
}

function getOtherProfilePictureUrl(uid) {
    //console.log("test")
    return new Promise(function(resolve, reject) {
        var a = "SELECT profile_picture FROM users WHERE id_user = " + uid;
        socket.emit("sql-select", a, (response) => {
            //console.log(a);
            resolve(response[0].profile_picture);
        })
    });
}

function getUsername() {
    return new Promise(function(resolve, reject) {
        var a = "SELECT username FROM users WHERE id_user = " + getCookie("uid");
        socket.emit("sql-select", a, (response) => {
            resolve(response[0].username);
        })
    });
}

function setProfilePictureUrl(url) {
    var a = "UPDATE users SET profile_picture = " + url + " WHERE id_user = " + getCookie("uid");
    socket.emit("sql-update", a, (response) => {
        console.log("Done");
    });
}

function getCookie(name) {
    // Split cookie string and get all individual name=value pairs in an array
    var cookieArr = document.cookie.split(";");
    
    // Loop through the array elements
    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");
        
        /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
        if(name == cookiePair[0].trim()) {
            // Decode the cookie value and return
            return decodeURIComponent(cookiePair[1]);
        }
    }
    
    // Return null if not found
    return null;
}