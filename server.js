
// io.sockets.emit - will send the message to all the clients
// socket.broadcast.emit (this.broadcast.emit) - will send the message to all the other clients except the newly created connection
// this.emit - will send the message only to one client


// ############ NODE.JS REQUIREMENTS ##########################################################################
var util = require("util");                                                      // Utility resources (logging, object inspection, etc)
var mysql = require('mysql');                                                    // mysql library

var express = require('express');
var app = express();
var server = require('http').createServer(app);                                 // Create server
var io = require('socket.io').listen(server, {log: false});

var Player = require("./Player").Player;                                         // Server Player class
var Bonus = require("./Bonus").Bonus;                                            // Server Bonus class

var connection;                                                                  // Handler for MySQL connection

// GAME VARIABLES
var players = [];                                                                // Array of connected players
var bonus;                                                                       // bonus variable


// ############ GAME INITIALISATION ###########################################################################
function init() {
    server.listen(8000);                                                          // Listen port 8000                               

    app.get('/', function (req, res) {                                            // Initialise index.html for start application
        res.sendfile(__dirname + '/index.html');
    });

    app.use(express.static(__dirname + '/public'));                               // Add paths to css, js etc.

    setEventHandlers();                                                           // Start listening for events

//   connection = mysql.createConnection({                                       // Connection with mysql database
//      host: 'localhost',
//      user: 'root',
//      password: '',
//      database: 'tanks'
//   });

//   connection.connect(function(err) {                                          // Check if connect is established
//      if (!err) {console.log('mysql connection established');}
//      else {console.log('mysql connection ERROR');}
//   });

}


// ############ GAME EVENT HANDLERS ##########################################################################
var setEventHandlers = function () {
    io.sockets.on("connection", onSocketConnection);
};


function onSocketConnection(client) {                                            // New socket connection
    util.log("New player has connected: " + client.id + "; players: " + players.length + 1);
    Player.id = client.id;

    if (players.length > 0) {                                                        // Check for exist players position and send this info to new connected player (this is helpful for generate new player start position )
        for (var i = 0; i < players.length; i++) {
            this.emit("exist players", {id: client.id, exist: '1', x: players[i].getX(), y: players[i].getY()});  // if there exist players
        }
        this.emit("exist players", {id: client.id, exist: '0'});                         // if there aren't more exist players 
    } else {
        this.emit("exist players", {id: client.id, exist: '0'});                         // if there no exist players
    }

    client.on("disconnect", onClientDisconnect);                                     // Listen for client disconnected
    client.on("new player", onNewPlayer);                                            // Listen for new player message
    client.on("move player", onMovePlayer);                                          // Listen for move player message
    client.on("hit player", onHitPlayer);                                            // Listen for player kill
    client.on("game message", onGameMessage);                                        // Listen for game message (by space click)
    client.on("info message", onInfoMessage);                                        // Listen for info message (info about connect, disconnect, killing etc.)
    client.on("chat", onChat);                                                       // Listen for chat message
    client.on("shoot", onShoot);                                                     // Listen for player shoot  

    client.on("bonus", onBonus);                                                     // Listen for bonus
    client.on("add life", onAddLife);                                                // Listen for add life (from bonus)
    client.on("add turbo shoot", onAddTurboShoot);                                   // Listen for add turbo shoot (from bonus)
    client.on("turbo shoot off", onTurboShootOff);                                   // Listen for turbo shoot off
    client.on("add immortal", onAddImmortal);                                        // Listen for add immortal
    client.on("immortal off", onImmortalOff);                                        // Listen for add immortal off
}
;


function onClientDisconnect() {                                                  // Client disconnected
    util.log("Player has disconnected: " + this.id + "; players: " + players.length);
    var removePlayer = playerById(this.id);
    if (!removePlayer) {                                                             // Player not found
        util.log("Player already disconnect: " + this.id);
        return;
    }
    ;
    players.splice(players.indexOf(removePlayer), 1);                                // Remove player from players array
    this.broadcast.emit("own disconnect", {id: this.id, user: removePlayer.username});

//   var basedata = {socket_id: this.id};
//   connection.query('DELETE FROM users WHERE ?', basedata, function(err, results) {console.log(err); console.log(results)});
}
;


function onNewPlayer(data) {                                                     // New player has joined
    var newPlayer = new Player(data.x, data.y, data.width, data.height, data.user, this.id, 'up', data.h_dir, data.v_dir, data.turbo_shoot, data.immortal);       // Create a new player on the server
    this.broadcast.emit("new player", {exist: 0, id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY(), width: newPlayer.width, height: newPlayer.height, user: newPlayer.username, dir: newPlayer.dir, h_dir: newPlayer.hor_dir, v_dir: newPlayer.vert_dir, scores: newPlayer.score, lifes: newPlayer.lifes, turbo_shoot: newPlayer.turbo_shoot, immortal: newPlayer.immortal});   // emit new player to actual connected players

    var existingPlayer;                                                              // Check for exist players and send them to the new player
    for (var i = 0; i < players.length; i++) {
        existingPlayer = players[i];
        this.emit("new player", {exist: 1, id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY(), width: existingPlayer.width, height: existingPlayer.height, user: existingPlayer.username, dir: existingPlayer.dir, h_dir: existingPlayer.hor_dir, v_dir: existingPlayer.vert_dir, scores: existingPlayer.score, lifes: existingPlayer.lifes, turbo_shoot: existingPlayer.turbo_shoot, immortal: existingPlayer.immortal});  // emit exist players to new connected player
    }
    ;

    players.push(newPlayer);                                                         // Add new player to the players array

    if (bonus) {                                                                     // send to new player bonus position if is active
        if (bonus.active == 1) {
            this.emit("bonus", {x: bonus.x, y: bonus.y, img_x: bonus.img_x, img_y: bonus.img_y, kind: bonus.kind});
        }
    }

//   var basedata  = {username: data.user, socket_id: this.id};                     // Insert user to database
//   connection.query('INSERT INTO users SET ?', basedata, function(err, results) {});
//   connection.query('INSERT INTO users_history SET ?', basedata, function(err, results) {});
}
;


function onMovePlayer(data) {                                                    // Player has moved
    var movePlayer = playerById(this.id);                                            // Find player in array
    if (!movePlayer) {                                                               // Player not found
        util.log("Player not found2: " + this.id);
        return;
    }
    ;
    movePlayer.setX(data.x);                                                         // Update player position
    movePlayer.setY(data.y);
    movePlayer.dir = data.dir;
    movePlayer.hor_dir = data.h_dir;
    movePlayer.vert_dir = data.v_dir;
    this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY(), dir: data.dir, user: movePlayer.username, h_dir: movePlayer.hor_dir, v_dir: movePlayer.vert_dir});  // Broadcast updated position to connected socket clients
}
;


function onHitPlayer(data) {                                                     // Player has been killed
    cracked = playerById(data.cracked_id);
    scorer = playerById(data.scorer);
    ++scorer.score;                                                                 // Update killer score
    --cracked.lifes;                                                                 // Update cracked player lifes
    if (cracked.lifes <= 0) {                                                        // if he doesn't have more lifes
        util.log("Player killed: " + data.cracked_id);
        io.sockets.socket(data.cracked_id).emit("end score", {score: cracked.score});
        var removePlayer = playerById(data.cracked_id);
        if (!removePlayer) {                                                             // Player not found
            util.log("Player not found3: " + data.cracked_id);
            return;
        }
        ;
        players.splice(players.indexOf(removePlayer), 1);
    }

    io.sockets.emit("hit player", {cracked_id: data.cracked_id, scorer: data.scorer, scores: scorer.score, lifes: cracked.lifes, shoot: data.shoot_id});
}


function onGameMessage(data) {                                                   // Game message (by space click)
    this.broadcast.emit("game message", {mes: data.mes, id: data.id, user: data.user});
}


function onInfoMessage(data) {                                                   // Info about player killed
    this.broadcast.emit("info message", {mes: data.mes, killed_id: data.killed_id});
}


function onChat(data) {
    util.log("Get chat: " + data.mes);
    this.broadcast.emit("get chat", {id: data.id, mes: data.mes, user: data.user});
}


function onShoot(data) {
    this.broadcast.emit("get shoot", {x: data.x, y: data.y, dir: data.dir, id: data.id, user: data.user});
}


function onBonus(data) {
    bonus = new Bonus(data.size, data.x, data.y, data.img_x, data.img_y, data.kind, 1);
    this.broadcast.emit("bonus", {x: data.x, y: data.y, img_x: data.img_x, img_y: data.img_y, kind: data.kind});
}


function onAddLife(data) {                                                       // Add life for player
    bonus.active = 0;
    player = playerById(data.id);
    if (player.lifes < 3) {
        ++player.lifes;
    }
    io.sockets.emit("add life", {id: player.id, lifes: player.lifes});
}


function onAddTurboShoot(data) {                                                 // Add turbo shoot for player
    bonus.active = 0;
    var player = playerById(data.id);
    player.turbo_shoot = 1;
    this.broadcast.emit("add turbo shoot", {id: data.id});
}


function onTurboShootOff(data) {                                                 // Turbo shoot off
    var player = playerById(data.id);
    player.turbo_shoot = 0;
    io.sockets.emit("turbo shoot off", {id: data.id});
}


function onAddImmortal(data) {
    bonus.active = 0;
    var player = playerById(data.id);
    player.immortal = 1;
    this.broadcast.emit("add immortal", {id: data.id});
}


function onImmortalOff(data) {
    var player = playerById(data.id);
    player.immortal = 0;
    io.sockets.emit("immortal off", {id: data.id});
}


// ############ GAME HELPER FUNCTIONS #######################################################################
function playerById(id) {                                // Find player by ID
    for (var i = 0; i < players.length; i++) {
        if (players[i].id == id)
            return players[i];
    }
    ;
    return false;
}
;



// ############ RUN THE GAME #######################################################################
init();