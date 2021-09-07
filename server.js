var express = require("express");
var app = express();
const multer = require("multer");
const bodyParser = require("body-parser");
const fs = require("fs");
/*
const privateKey = fs.readFileSync('/etc/letsencrypt/live/discoo.dog/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/discoo.dog/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/discoo.dog/chain.pem', 'utf8');
const credit = {
	        key: privateKey,
	        cert: certificate,
	        ca: ca
};
const server = require('https').createServer(credit,app);
*/
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    pingTimeout: 180000,
    pingInterval: 25000,
});
const port = process.env.PORT || 5000;
const path = require("path");
const bcrypt = require("bcrypt");
const util = require("util");
const { PassThrough } = require("stream");
var cookieParser = require("cookie-parser");

var mysql = require("mysql");

var session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true,
});
var sharedsession = require("express-socket.io-session");
const { emit } = require("process");

app.use(session);
app.use(cookieParser());

io.use(sharedsession(session));

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "discoodle",
    charset: "utf8mb4",
    dateStrings: true,
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.use(express.urlencoded());
app.use(express.static("img"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const user = [];

const upload = multer({
    dest: "./public/img",
});

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/public/screens/index.html`);
    if (req.session.loggedin != 1) {
        req.session.loggedin = 0;
    }
});

app.post("/index.html", function (req, res) {
    res.redirect(`/index.html?name=${req.body.name}`);
    console.log(`Full name is:${req.body.name} .`);
});

app.post("/writeArticle.html", function (req, res) {
    var p1 = req.param("fradio");
    console.log(p1);
    var p2 = req.param("text");
    console.log(p2);
    var p3 = req.param("articletext");
    console.log(p3);
    var sql =
        "INSERT INTO articles (nom, contenu,auteur,type) VALUES ('" +
        p2 +
        "','" +
        p3 +
        "','" +
        req.session.username +
        "','" +
        p1 +
        "')";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
    });
    res.redirect("/home.html");
});

app.get("/messages", function (req, res) {
    console.log("GET request received at /messages");
    connection.query("SELECT * FROM message_log", function (err, result) {
        if (err) throw err;
        else {
            res.send(result);
        }
    });
});

app.post("/auth", function (request, response) {
    var username = request.body.username;
    var password = request.body.password;
    var us;
    if (username && password) {
        connection.query(
            "SELECT * FROM users WHERE email = ?",
            [username],
            function (error, results, fields) {
                if (results.length > 0) {
                    us = results[0].username;
                    let t = new Promise(function (resolve, reject) {
                        bcrypt.compare(
                            password,
                            results[0].password,
                            function (err, res) {
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(res);
                                }
                            }
                        );
                    });
                    t.then((pswRes) => {
                        if (pswRes == true) {
                            io.emit("logged", request.body.username);
                            request.session.loggedin = true;
                            request.session.username = us;

                            a = results[0].id_user;
                            response.cookie("uid", a);
                            return response.redirect("/screens/home.html");
                        } else {
                            return response.redirect("/screens/log.html");
                        }
                    }).catch((pswRes) => {
                        console.log("error" + pswRes);
                    });
                } else {
                    return response.redirect("/screens/log.html");
                }
                //response.end();
            }
        );
    } else {
        // response.send('Please enter Username and Password!');
        //response.end();
    }
});

app.post("/reg", function (request, response) {
    var password = request.body.password.toString();
    var username = request.body.username;
    var email = request.body.email;
    var passwordBis = request.body.passwordBis;
    var l = true;
    if (username && password && email) {
        connection.query(
            "SELECT * FROM users WHERE username = ?",
            [username],
            function (error, r, fields) {
                if (r.length > 0) {
                    response.send("Le pseudo est deja utilisé");
                    //return response.redirect('/register.html');
                } else if (password == passwordBis) {
                    bcrypt.genSalt(10, function (err, salt) {
                        bcrypt.hash(password, salt, function (err, hash) {
                            var sql =
                                "INSERT INTO users (username,password,email,class) VALUES (?,?,?,0)";
                            var todo = [username, hash, email];
                            connection.query(
                                sql,
                                todo,
                                (err, results, fields) => {
                                    if (err) {
                                        return console.error(err.message);
                                    }
                                    response.redirect("/screens/log.html");
                                }
                            );
                        });
                    });
                }
            }
        );
    } else {
        response.send("Please enter Username and Password!");
        response.end();
    }
});

function test(uid) {
    connection.connect(function (err) {
        connection.query(
            "SELECT profile_picture FROM users WHERE id_user = ?",
            [uid],
            function (err, results, fields) {
                if (err) throw err;
                //console.log(results[0].profile_picture);
                return results[0];
            }
        );
    });
}

io.on("connection", (socket) => {
    var session = socket.handshake.session;

    socket.on("join-channel", (name) => {
        //connection.query('SELECT * FROM message_log', function(error, results, fields){
        //	io.emit('MessageSend',results[0].username,results[1].message,results[2].date);

        //})
        connection.connect(function (err) {
            connection.query(
                "SELECT username, message, date, channel, user_id FROM message_log  WHERE channel= ?",
                [name],
                function (err, results, fields) {
                    if (err) throw err;
                    results.forEach(function (key, index) {
                        let a = new Promise(function (resolve, reject) {
                            connection.connect(function (err) {
                                connection.query(
                                    "SELECT profile_picture FROM users WHERE id_user = ?",
                                    [key.user_id],
                                    function (err, res, fields) {
                                        if (err) throw err;
                                        //console.log(results[0].profile_picture);
                                        resolve(res[0].profile_picture);
                                    }
                                );
                            });
                        });
                        a.then((t) => {
                            io.emit(
                                "OldSend",
                                key.username,
                                key.message,
                                key.date,
                                key.channel,
                                t
                            );
                        }).catch((t) => {
                            console.log("error" + t);
                        });
                    });
                }
            );
        });
    });

    socket.on("OldSend", (name, msg, hour, channel) => {
        io.emit("OldSend", name, msg, hour, channel);
    });

    socket.on("user-created", (name) => {
        user[socket.id] = name;
        var heure = new Date();
        io.emit(
            "MessageSend",
            session.username,
            "est connecté",
            heure.getHours() + ":" + heure.getMinutes()
        );
    });

    socket.on("disconnecting", () => {
        io.emit("MessageSend", user[socket.id], "s'est déconnecté");
    });

    socket.on("disconnecting", () => {
        io.emit("MessageSend", user[socket.id], "s'est déconnecté");
    });

    socket.on("MessageSend", (name, msg, hour, channel, uid, prfPic) => {
        if (name && name.length > 0 && name != null) {
            console.log(channel + "ITS HE ");
            var heure = new Date();
            io.emit(
                "MessageSend",
                session.username,
                msg,
                heure.getHours() + ":" + heure.getMinutes(),
                channel,
                uid,
                prfPic
            );
            connection.query(
                "INSERT INTO message_log (username, message, id, date, channel,user_id) VALUES (?, ?, ?, ?, ?, ?)",
                [session.username, msg, socket.id, new Date(), channel, uid],
                function (error, results, fields) {
                    if (error) throw error;
                }
            );
        }
    });

    socket.on("ImageSend", (name, img) => {
        if (name && name.length > 0 && name != null) {
            io.emit("ImageSend", name, img);
        }
    });

    socket.on("join-room", (roomId, userId) => {
        //Système de room pour le WebRTC - userId est l'ID peer unique de l'utilsateur
        console.log(roomId + " -> this is room id");
        console.log(userId + " -> this is user id");
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-joined", userId);
    });

    socket.on("disconnect", (roomId, userId) => {
        socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });

    socket.on("articleload", () => {
        connection.query(
            "SELECT * FROM articles",
            function (error, results, fields) {
                if (results.length > 0) {
                    io.emit("articleload", results);
                }
            }
        );
    });

    socket.on("checklog", () => {
        if (session.loggedin != 1) {
            io.emit("checklog");
        }
    });

    socket.on("islogged", () => {
        if (session.loggedin != 1) {
            io.emit("islogged");
        } else {
            io.emit("redirecthome");
        }
    });

    //Requêtes BDD

    socket.on("sql-select", function (req, res) {
        connection.query(req, function (error, results, fields) {
            if (results.length > 0) res(results);
            else console.log("No results... yet !");
        });
    });

    socket.on("sql-update", function (req, res) {
        connection.query(req, function (error, results, fields) {
            if (!error) console.log("SUCCESS");
        });
    });

    socket.on("sql-insert", function (req, res) {
        connection.query(req, function (error, results, fields) {
            if (!error) console.log("SUCCESS");
        });
    });
});

//File upload

const errHandler = (err, res) => {
    //Si on réussit pas a upload
    res.status(500).contentType("text/plain").end("Erreur fatale!");
};

//Upload chat
app.post("/upload", upload.single("file"), (req, res) => {
    const original = req.file.path;
    var a =
        "./public/img/" +
        getRandomInt(10000000) +
        path.extname(req.file.originalname).toLowerCase();
    const target = path.join(__dirname, a);

    //jpg, png, jpeg acceptés uniquement.
    if (
        path.extname(req.file.originalname).toLowerCase() === ".png" ||
        path.extname(req.file.originalname).toLowerCase() === ".jpg" ||
        path.extname(req.file.originalname).toLowerCase() === ".jpeg"
    ) {
        fs.rename(original, target, (err) => {
            if (err) return errHandler(err, res);
            io.emit("ImageSend", req.body.uname, a.slice(9));
            heure = new Date();
            var requestt =
                "INSERT INTO message_log (username, message, channel,user_id) VALUES " +
                "(" +
                '"' +
                req.body.username +
                '"' +
                ", " +
                ' "' +
                a.slice(9) +
                '" ' +
                ", " +
                '"' +
                req.body.chanName +
                '"' +
                ", " +
                req.body.uid +
                ")";
            console.log(requestt);
            connection.connect(function (err) {
                connection.query(requestt, function (err, results, fields) {});
            });
            //io.emit('sql-insert', requestt, (results) => {})
            //TODO: PAGE LOADS INFINITELY.
            res.status(200).contentType("text/plain").redirect("/");
        });
    } else {
        fs.unlink(original, (err) => {
            if (err) return errHandler(err, res);

            res.status(403)
                .contentType("text/plain")
                .end("Ce n'est pas une image");
        });
    }
});

app.post("/upload-pp", upload.single("file"), (req, res) => {
    const original = req.file.path;
    var username = session.username;
    var a =
        "./public/img/" +
        getRandomInt(10000000) +
        path.extname(req.file.originalname).toLowerCase();
    const target = path.join(__dirname, a);

    //jpg, png, jpeg acceptés uniquement.
    if (
        path.extname(req.file.originalname).toLowerCase() === ".png" ||
        path.extname(req.file.originalname).toLowerCase() === ".jpg" ||
        path.extname(req.file.originalname).toLowerCase() === ".jpeg"
    ) {
        fs.rename(original, target, (err) => {
            if (err) return errHandler(err, res);
            var tempo = "." + a.slice(8);
            connection.query(
                "UPDATE users SET profile_picture = ? WHERE id_user = ?",
                [tempo, req.cookies.uid],
                function (error, results) {
                    if (error) throw error;
                }
            );
            //TODO: PAGE LOADS INFINITELY.
            res.status(200).contentType("text/plain").redirect("/profile.html");
        });
    } else {
        fs.unlink(original, (err) => {
            if (err) return errHandler(err, res);

            res.status(403)
                .contentType("text/plain")
                .end("Ce n'est pas une image");
        });
    }
});

server.listen(port, () => {
    console.log(`Ca demarre sur le port ${port}`);
    console.log(`http://discoo.dog:${port}/`);
});
