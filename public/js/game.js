// socket.socket.sessionid - own id
// socket.socket.connect() - for next connects (only for first connect this is: io.connect())


// ############ GAME VARIABLES ###########################################################################
var canvas;                                                                      // main canvas tilemap
var ctx;
var canvas2;                                                                     // main canvas for local player                                                                     
var ctx2;
var canvas3;                                                                     // main canvas for remote players                                                                     
var ctx3;

var canvas20;                                                                    // CHWILOWE DLA INNYCH (strzaly, bonusy)                                                              
var ctx20;

var canvas_sm1;                                                                  // small canvas tilemap
var ctx_sm1;
var canvas_sm2;                                                                  // small canvas other draws 
var ctx_sm2;

var socket;                                                                      // Socket connection
var keys;                                                                        // Keyboard input
var mouse;                                                                       // Mouse input                                                          

var user;                                                                        // user name
var localPlayer;                                                                 // Local player
var playerImg = new Image();
playerImg.src = "img/tanks_sheet.png";
var remotePlayers;                                                               // Remote players
var exist_players;                                                               // this is array with position of exist players (to escape from collision with exist players on start)

var stage;                                                                       // Stage object
var tiles;                                                                       // Tiles object
var shoots;                                                                      // Shoots object
var camera;                                                                      // Camera object
var bonus;                                                                       // Bonus object



// ############ GAME INITIALISATION ###########################################################################
function init(user_name) {

    canvas = document.getElementById("tilemapCanvas");                            // main canvas tileMap
    ctx = canvas.getContext("2d");
    canvas2 = document.getElementById("localPlayerCanvas");                       // main canvas for local player
    ctx2 = canvas2.getContext("2d");
    canvas3 = document.getElementById("remotePlayersCanvas");                     // main canvas for remote players
    ctx3 = canvas3.getContext("2d");

    canvas20 = document.getElementById("otherCanvas");                            // CHWILOWY DLA INNYCH
    ctx20 = canvas20.getContext("2d");

    canvas_sm1 = document.getElementById("smallmapCanvas");                       // small canvas tileMap
    ctx_sm1 = canvas_sm1.getContext("2d");
    canvas_sm2 = document.getElementById("smallCanvas");                          // small canvas other draws
    ctx_sm2 = canvas_sm2.getContext("2d");

    user = user_name;

    socket = io.connect();

    exist_players = [];                                                           // Initialise exist players array
    setEventHandlers();                                                           // Start listening for events 

    keys = new Keys();                                                            // Initialise keyboard controls
    mouse = new Mouse();                                                          // Initialise mouse

    stage = new Stage();
    stage.stage_2();

    camera = new Camera(2, canvas.width / tiles.size - 3, 2, canvas.height / tiles.size - 3);   // Initialise camera and set edges positions

    var bonusImg = new Image();
    bonusImg.src = "img/bonus.png";
    var x_values = [0, 32, 64];
    var y_values = [0];
    bonus = new Bonus(bonusImg, 32, x_values, y_values);

    remotePlayers = [];                                                           // Initialise remote players array
    shoots = [];                                                                  // Initialise shoots array 
}
;



// ############ GAME EVENT HANDLERS ###########################################################################
var setEventHandlers = function () {
    window.addEventListener("keydown", onKeydown, false);                         // Keyboard events
    window.addEventListener("keyup", onKeyup, false);
    canvas2.addEventListener("mousedown", onClick, false);                         // Mouse events

    socket.on("connect", onSocketConnected);                                      // Socket connection successful
    socket.on("disconnect", onSocketDisconnect);                                  // Socket disconnection
    socket.on("exist players", onExistPlayers);                                   // Exist players message received
    socket.on("new player", onNewPlayer);                                         // New player message received
    socket.on("move player", onMovePlayer);                                       // Player move message received
    socket.on("hit player", onHitPlayer);                                         // Hit player message received
    socket.on("game message", onGameMessage);                                     // Game message received (by space click)
    socket.on("info message", onInfoMessage);                                     // Info about player killed received
    socket.on("get chat", onGetChat);                                             // chat message received
    socket.on("get shoot", onGetShoot);                                           // shoot message received
    socket.on("own disconnect", onOwnDisconnect);                                 // another player disconnected
    socket.on("end score", onEndScore);                                           // localPlayer end score message received 

    socket.on("bonus", onBonus);                                                  // bonus message received  
    socket.on("add life", onAddLife);                                             // add life message received  
    socket.on("add turbo shoot", onTurboShoot);                                   // add turbo shoot message received 
    socket.on("turbo shoot off", onTurboShootOff);                                // turbo shoot off message received 
    socket.on("add immortal", onAddImmortal);                                     // add immortal message received 
    socket.on("immortal off", onImmortalOff);                                     // immortal off message received 
};



// ############ GAME ANIMATION LOOP #########################################################################
function animate() {
    if (localPlayer) {
        update();
        draw();
    }
    window.requestAnimFrame(animate);                                             // Request a new animation frame using Paul Irish's shim
}
;



// ############ GAME UPDATE ##############
function update() {

    if (localPlayer) {
        // localPlayer move   
        if (localPlayer.update_pos(keys)) {                                           // player move by keys
            move();
        } else if (mouse.move_active == 1) {                                          // this is for continuous move after mouse click 
            mouse.mouseMove();
            move();
        }
    }
}
;



// ############ GAME DRAW #################
function draw() {

    if (localPlayer) {

        ctx20.clearRect(0, 0, canvas2.width, canvas2.height);                      // clean canvas 
        ctx_sm2.clearRect(0, 0, canvas_sm2.width, canvas_sm2.height);

        for (var i = 0; i < shoots.length; i++) {                                      // draw shoots
            if (shoots[i].active == 0) {                                                // if shoot already isn't active
                shoots.splice(shoots.indexOf(shoots[i]), 1);                                 // remove it from shoots array
            } else {                                                                    // if shoot is active
                if (shoots[i].user == localPlayer.id) {
                    shoots[i].draw_shoot(ctx20, localPlayer);                                   // draw this shoot
                } else {
                    for (var j = 0; j < remotePlayers.length; j++) {                               // draw remote players
                        if (shoots[i].user == remotePlayers[j].id) {
                            shoots[i].draw_shoot(ctx20, remotePlayers[j]);                        // draw this shoot
                        }
                    }
                    ;
                }
            }
        }

        tiles.draw_smallDraws(ctx_sm2, stage.scale);                                        // drav moving on small map

        if (bonus.active == 1) {                                                            // draw bonus
            bonus.draw_bonus(ctx20);
        }
    }
}
;

