var currentChannel;
var globalChannel;

function enableEmo(elem) {
    document.querySelector("#msg").value += elem.textContent;
}
var typeText = 1;

function gText() {
    typeText = 2;
}

function pText() {
    typeText = 1;
}

function display(elemt) {
    var x = document.getElementById(elemt);
    currentChannel = elemt;
    document.getElementById("module2").innerHTML = "";
    //document.getElementById('module2').innerHTML = '<div class="header">Projet de Programmation</div>';
    if (!x) {
        var test = "SELECT * FROM `cours` WHERE libelle_cours = " + elemt;
        //console.log(test);
        socket.emit(
            "sql-select",
            "SELECT * FROM `cours` WHERE libelle_cours = " + '"' + elemt + '"',
            (result) => {
                //console.log(result);
                socket.emit(
                    "sql-select",
                    "SELECT * FROM `modules` WHERE id_cours = " +
                        '"' +
                        result[0].id_cours +
                        '"',
                    (res) => {
                        console.log(res);
                        console.log(res.length);

                        document
                            .getElementById("module2")
                            .insertAdjacentHTML(
                                "beforeEnd",
                                '<div class="items" style="display:block" id="' +
                                    result[0].libelle_cours +
                                    '"><a id="' +
                                    result[0].libelle_cours +
                                    'test" href="#"></a></div>'
                            );
                        var toto = result[0].libelle_cours + "test";
                        document
                            .getElementById(toto)
                            .insertAdjacentHTML(
                                "beforeEnd",
                                '<div class="iteminf">Cours</div>'
                            );
                        for (let i = 0; i < res.length; i++) {
                            console.log("'" + res[i].libelle_module + "'");
                            var p = document.contains(
                                document.getElementById(res[i].libelle_module)
                            );
                            document
                                .getElementById(toto)
                                .insertAdjacentHTML(
                                    "beforeEnd",
                                    '<div class="item trigger-group-cours" id="testtest" data="' +
                                        res[i].libelle_module +
                                        '">' +
                                        res[i].libelle_module +
                                        "</div>"
                                );
                            if (p === false) {
                                document
                                    .getElementById("msg-chan")
                                    .insertAdjacentHTML(
                                        "beforeEnd",
                                        '<div class="messages-group hide-unless-show" id="' +
                                            res[i].libelle_module +
                                            '"><div class="header">' +
                                            res[i].libelle_module +
                                            '</div><div class="messages" id = "' +
                                            res[i].libelle_module +
                                            "0" +
                                            '"></div></div>'
                                    );
                            }

                            socket.emit(
                                "join-channel",
                                res[i].libelle_module + "0"
                            );
                        }
                        var j = document.contains(
                            document.getElementById(
                                "chat" + result[0].libelle_cours
                            )
                        );
                        console.log(j);
                        if (j === true) {
                            var elem = document.getElementById(
                                "chat" + result[0].libelle_cours
                            );
                            elem.remove();
                        }
                        document
                            .getElementById(toto)
                            .insertAdjacentHTML(
                                "beforeEnd",
                                '<div class="iteminf id="temin">Salons Textuels</div>'
                            );
                        document
                            .getElementById(toto)
                            .insertAdjacentHTML(
                                "beforeEnd",
                                '<div class="item trigger-group" id="testtest" data="chat' +
                                    result[0].libelle_cours +
                                    '">' +
                                    result[0].libelle_cours +
                                    " chat</div>"
                            );
                        document
                            .getElementById("msg-chan")
                            .insertAdjacentHTML(
                                "beforeEnd",
                                '<div class="messages-group hide-unless-show" id="chat' +
                                    result[0].libelle_cours +
                                    '"><div class="header">' +
                                    result[0].libelle_cours +
                                    ' chat</div><div class="messages" id ="chat' +
                                    result[0].libelle_cours +
                                    "0" +
                                    '"></div></div>'
                            );
                        socket.emit(
                            "join-channel",
                            "chat" + result[0].libelle_cours + "0"
                        );

                        //document.getElementById(toto).insertAdjacentHTML('beforeEnd','<div class="messages-group hide-unless-show" id="'+res[0].id_cours+'"><div class="header">video'+result[0].id_cours+'</div><div class="messages" id = "'+res[i].libelle_module+"0"+'"></div></div>');
                    }
                );
            }
        );
    }
}
var t;
async function b(uid) {
    t = await getOtherProfilePictureUrl(uid);
    console.log(t);
    return t;
}

$(function () {
    var socket = io();
    const def = "Utilisateur";
    const name = "test";

    let t = new Promise(function (resolve, reject) {
        //var classe;
        socket.emit(
            "sql-select",
            "SELECT class FROM `users` WHERE id_user = " + getCookie("uid"),
            (result) => {
                //console.log("classe :"+getCookie("uid"));
                socket.emit(
                    "sql-select",
                    "SELECT * FROM `users` WHERE id_user = " + getCookie("uid"),
                    (res) => {
                        resolve([result[0].class, res[0].usertype]);
                    }
                );
            }
        );
    });
    t.then((classe) => {
        // console.log(classe[1]==1)
        if (classe[1] == 1) {
            console.log("user type = " + classe[1]);
            socket.emit(
                "sql-select",
                "SELECT * FROM cours INNER JOIN classes WHERE classes.id_classe=cours.id_classe and classes.id_user =" +
                    getCookie("uid"),
                (result) => {
                    console.log("user type = " + classe[1]);
                    var test = "test";
                    for (let i = 0; i < result.length; i++) {
                        var str = result[i].libelle_cours;
                        var strSlice = str.slice(0, 2);
                        document
                            .getElementById("item")
                            .insertAdjacentHTML(
                                "beforeEnd",
                                '<button class="guild-add" onclick=\'display("' +
                                    result[i].libelle_cours +
                                    "\")'>" +
                                    strSlice +
                                    "</button>"
                            );
                    }
                }
            );
        } else if (classe[1] == 0) {
            console.log("cr");
            socket.emit(
                "sql-select",
                "SELECT * FROM `cours` WHERE id_classe =" + classe[0],
                (result) => {
                    console.log("user type = " + classe[1]);
                    var test = "test";
                    for (let i = 0; i < result.length; i++) {
                        var str = result[i].libelle_cours;
                        var strSlice = str.slice(0, 2);
                        document
                            .getElementById("item")
                            .insertAdjacentHTML(
                                "beforeEnd",
                                '<button class="guild-add" onclick=\'display("' +
                                    result[i].libelle_cours +
                                    "\")'>" +
                                    strSlice +
                                    "</button>"
                            );
                    }
                }
            );
        } else if (classe[1] == 2) {
            socket.emit("sql-select", "SELECT * FROM `cours`", (result) => {
                console.log("user type = " + classe[1]);
                var test = "test";
                for (let i = 0; i < result.length; i++) {
                    var str = result[i].libelle_cours;
                    var strSlice = str.slice(0, 2);
                    document
                        .getElementById("item")
                        .insertAdjacentHTML(
                            "beforeEnd",
                            '<button class="guild-add" onclick=\'display("' +
                                result[i].libelle_cours +
                                "\")'>" +
                                strSlice +
                                "</button>"
                        );
                }
            });
        }
    });
    socket.emit("user-created", name);
    socket.emit("checklog");
    var idArray = [];
    $(".messages").each(function () {
        idArray.push(this.id);
    });

    for (const element of idArray) {
        socket.emit("join-channel", element);
    }

    if (localStorage.getItem("nom") !== null) {
        var tabhome = document.getElementById(localStorage.getItem("nom"));
        if ((tabhome.style.display = "none")) {
            display(localStorage.getItem("nom"));
            console.log(localStorage.getItem("nom"));
            localStorage.removeItem("nom");
        }
    }
    socket.on("checklog", () => {
        console.log("FAIT");
        window.location.href = "screens/log.html";
    });
    var username = name;
    var globalUsername;

    $("#msgform").submit(function (e) {
        var emptyMsg = $("#msg").val() === "";
        if (emptyMsg === false) {
            if (typeText === 2) {
                var s = "<h1>" + $("#msg").val();
                +"</h1>";
            } else {
                var s = $("#msg").val();
            }

            e.preventDefault(); // Pour pas que la page se recharge
            globalChannel = defaultId + 0;
            socket.emit(
                "MessageSend",
                username,
                s,
                new Date(),
                defaultId + 0,
                getCookie("uid"),
                profile_link
            ); //Envoyer au socket la val de #msg
            $("#msg").val(""); // On vide pr pouvoir renvoyer un msg

            element = document.getElementById("msg-chan");
            element.scrollTop = element.scrollHeight;
            return false;
        }
    });
    socket.on(
        "MessageSend",
        function (name, msg, hour, channel1, usid, prfPic) {
            if (channel1 == defaultId + "0") {
                var node = document.getElementById(defaultId + "0");
                node.insertAdjacentHTML(
                    "beforeend",
                    '<div class="message"> <div class="icon"><img class="responsive-img" src="' +
                        prfPic +
                        '"/></div> <div class="body"> <div class="user-name">' +
                        name +
                        '</div><div class="hour">' +
                        hour +
                        '</div> <div class="content">' +
                        msg +
                        "</div> </div> </div>"
                );
                element = document.getElementById("msg-chan");
                element.scrollTop = element.scrollHeight;
            }
        }
    );

    socket.on("OldSend", function (name, msg, hour, channel, prPic) {
        element = document.getElementById("msg-chan");
        element.scrollTop = element.scrollHeight;
        var node = document.getElementById(channel);
        if (node != null) {
            if (msg.substring(0, 4) == "img/") {
                node.insertAdjacentHTML(
                    "beforeend",
                    '<div class="message"> <div class="icon"><img class="responsive-img" src="' +
                        prPic +
                        '"/></div> <div class="body"> <div class="user-name">' +
                        name +
                        '</div><div class="hour">' +
                        hour +
                        '</div> <img style="max-width: 200px;"src=./' +
                        msg +
                        "></div> </div>"
                );
            } else {
                node.insertAdjacentHTML(
                    "beforeend",
                    '<div class="message"> <div class="icon"><img class="responsive-img" src="' +
                        prPic +
                        '"/></div> <div class="body"> <div class="user-name">' +
                        name +
                        '</div><div class="hour">' +
                        hour +
                        '</div> <div class="content">' +
                        msg +
                        "</div> </div> </div>"
                );
            }
            //node.insertAdjacentHTML('beforeend', '<div class="message"> <div class="icon"><img class="responsive-img" src="'+prPic+'"/></div> <div class="body"> <div class="user-name">'+name+'</div><div class="hour">'+hour+'</div> <div class="content">'+msg+'</div> </div> </div>');
        }
    });

    socket.on("ImageSend", function (name, img) {
        element = document.getElementById("msg-chan");
        element.scrollTop = element.scrollHeight;
        var node = document.getElementById(defaultId + "0");
        console.log(defaultId);
        node.insertAdjacentHTML(
            "beforeend",
            '<div class="message"><div class="icon"><img class="responsive-img" src="./ProfilDefault.png"/></div> <div class="body"> <div class="user-name">' +
                name +
                '</div> <div class="content"> <img src="' +
                img +
                '" style="max-width: 500px;"/></div> </div> </div>'
        );
    });
});

socket.emit(
    "sql-select",
    "SELECT username FROM users WHERE id_user = " + getCookie("uid"),
    (response) => {
        document
            .getElementById("username")
            .setAttribute("value", response[0].username);
    }
);
document.getElementById("uid").setAttribute("value", getCookie("uid"));
document.getElementById("date").setAttribute("value", new Date());
