//RTC INTEGRATION - Fonctionnel avec micro + caméra en temps réel.
let params = new URLSearchParams(location.search);
console.log(params.get("room"));

console.log("Finally...");
const roomId = params.get("room");
const uId = params.get("userId");
const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myPeer = new Peer(uId);
console.log("My user id is : " + myPeer.id);
const myVideo = document.createElement("video"); //On crée un  canvas vidéo (qui contiendra l'audio et la vidéo)
myVideo.muted = true; //Pour ne pas entendre sa propre voix
const peers = {}; //Tous les utilisateurs ayant rejoint le P2P

var getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;
getUserMedia(
    { video: true, audio: true },
    function (stream) {
        addVideoStream(myVideo, stream, myPeer.id);
        console.log("is it here ");

        /*myPeer.on('call', (call) => { //Recieves call
    console.log("I recieved a call, hurray !")
    call.answer(stream)
    console.log("I answered the call")
    var vid2 = document.createElement('video')
    call.on('stream', (otherStream) => {
      addVideoStream(vid2, otherStream)
    })
  })*/

        socket.on("user-joined", (userId) => {
            //Only users already in channel recieve this event
            connectToUser(userId, stream);
        });
    },
    function (err) {
        console.log("Failed to get local stream", err);
    }
);

myPeer.on("call", (call) => {
    //Recieves call
    getUserMedia({ video: true, audio: true }, function (stream) {
        console.log("I recieved a call, hurray !");
        call.answer(stream);
        console.log("I answered the call");
        var vid2 = document.createElement("video");
        let count = 0;
        call.on("stream", (otherStream) => {
            count++;
            if (count == 2) {
                addVideoStream(vid2, otherStream, call.peer);
                count = 0;
            }
        });
    });
});

myPeer.on("open", (id) => {
    socket.emit("join-room", roomId, id);
    console.log("Just opened, we emitted !");
});

socket.on("user-disconnected", (userId) => {
    console.log("We recieved : user disconnected");
    if (peers[userId]) peers[userId].close();
});

function connectToUser(userId, stream) {
    console.log("User has joined!");
    var call = myPeer.call(userId, stream);
    console.log("Calling : " + userId);
    var vid = document.createElement("video");
    peers[userId] = call;
    let count = 0;
    call.on("stream", function (remoteStream) {
        //Answered
        console.log("I recieved a stream");
        console.log(userId + " has answered.");
        count++;
        if (count == 2) {
            addVideoStream(vid, remoteStream, userId);
            count = 0;
        }
    });

    call.on("close", () => {
        vid.remove();
    });
}

function addVideoStream(video, stream, uid) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
    });
    console.log("Called with username : " + uid);
    var myDiv = document.createElement("div");
    const myCaption = document.createElement("span");
    var imageDiv = document.createElement("div");
    imageDiv.classList.add("circle-logo");

    var pp;
    var a = "SELECT profile_picture FROM users WHERE id_user = " + uid;
    socket.emit("sql-select", a, (response) => {
        pp = response[0].profile_picture;
        imageDiv.innerHTML = '<img src="' + pp + '" id="imageid">';
        socket.emit(
            "sql-select",
            "SELECT username FROM users WHERE id_user = " + uid,
            (user_res) => {
                myCaption.innerHTML = user_res[0].username;
                myDiv.classList.add("mainDiv");
                myCaption.classList.add("mainCaption");
                myDiv.append(video);
                myDiv.append(myCaption);
                myDiv.append(imageDiv);
                videoGrid.append(myDiv);
            }
        );
    });

    //videoGrid.append(video)
}

function leaveCall() {
    socket.emit("disconnect", roomId, myPeer.id);
}

function leftCall() {
    socket.emit("disconnect", roomId, myPeer.id);
}

function unmuteMic() {
    myVideo.muted = false;
}

function getCookie(name) {
    // Split cookie string and get all individual name=value pairs in an array
    var cookieArr = document.cookie.split(";");

    // Loop through the array elements
    for (var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");

        /* Removing whitespace at the beginning of the cookie name
      and compare it with the given string */
        if (name == cookiePair[0].trim()) {
            // Decode the cookie value and return
            return decodeURIComponent(cookiePair[1]);
        }
    }

    // Return null if not found
    return null;
}
