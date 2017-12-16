// GAME PLAYER CLASS
var Player = function (playerImg, startX, startY, width, height, user_name, act, h_dir, v_dir, tur_sh, imm) {

    this.img = playerImg;
    this.x = startX;                                                              // player x position on the canvas in px
    this.y = startY;                                                              // player y position on the canvas in px
    this.width = width                                                            // player width
    this.height = height;                                                         // player height
    this.username = user_name;                                                    // user name
    this.active_dir = act;                                                        // active player look dir, is also useful to set shoot dir
    this.id;                                                                      // user id
    this.moveAmount = 2;                                                          // speed of player move
    this.blocked;                                                                 // block one direction if move key is pressed
    this.hor_dir = h_dir;                                                         // index of start left tile on the tileMap (horizontal: left-right)
    this.vert_dir = v_dir;                                                        // index of start top tile on the tileMap (vertical: up-down))
    this.left_poss = 1;                                                           // helpful variable for left move possibility (no remote player on the left)
    this.right_poss = 1;
    this.up_poss = 1;
    this.down_poss = 1;
    this.cor = 0.1;                                                               // correction - helpful variable for tight places
    this.turbo_shoot = tur_sh;                                                    // turbo shoot: 1 -active; 0 -inactive;
//   this.turbo_shoot =1;
    this.immortal = imm;                                                          // immortality: 1 -active; 0 -inactive;

    var update_pos = function (keys) {                                             // Update player position

//    var prevX = this.x;                                                           // Previous position
//		var prevY = this.y;	

        if (keys.up && this.y > 0) {                                                  // UP
            this.up();
        } else if (keys.down && this.y < canvas.height - tiles.size) {                  // DOWN
            this.down();
        }

        if (keys.left && this.x > 0) {                                                // LEFT
            this.left();
        } else if (keys.right && this.x < canvas.width - tiles.size) {                  // RIGHT
            this.right();
        }
        ;

//		return (prevX != this.x || prevY != this.y) ? true : false;                   // if there is true (player moved) than in game.js is send message about this move to another players                                                 

        if ((keys.up && this.y > 0) || (keys.down && this.y < canvas.height - tiles.size) || (keys.left && this.x > 0) || (keys.right && this.x < canvas.width - tiles.size)) {
            return true;
        } else {
            return false;
        }

    };


    function playersCollide() {                                                   // check for collide with another players
        var cor = 3;                                                                  // variable for correct img opacity (in px)
        var loc_x = this.x + localPlayer.hor_dir * 32;
        var loc_y = this.y + localPlayer.vert_dir * 32;
        var loc_w = this.width;
        var loc_h = this.height;

        this.move_poss();                                                             // move possibility set to 'on'

        for (var i = 0; i < remotePlayers.length; i++) {
            rem_x = remotePlayers[i].x + remotePlayers[i].hor_dir * 32;
            rem_y = remotePlayers[i].y + remotePlayers[i].vert_dir * 32;
            rem_w = remotePlayers[i].width;
            rem_h = remotePlayers[i].height;

//       console.log('collide with: '+remotePlayers[i].id+' - '+remotePlayers[i].username)         // for kill remote player
//       hitRemotePlayer(localPlayer.id, remotePlayers[i].id)             



            if (loc_x + cor < rem_x && loc_x + loc_w - cor > rem_x && (loc_y + cor >= rem_y && loc_y + cor <= rem_y + rem_h || loc_y + loc_h - cor <= rem_y + rem_h && loc_y + loc_h - cor >= rem_y)) {
//            if (this.active_dir == 'right') {this.right_poss = 0;}
                this.right_poss = 0;
            }

            if (loc_x + cor > rem_x && loc_x + cor < rem_x + rem_w && (loc_y + cor >= rem_y && loc_y + cor <= rem_y + rem_h || loc_y + loc_h - cor <= rem_y + rem_h && loc_y + loc_h - cor >= rem_y)) {
//            if (this.active_dir == 'left') {this.left_poss = 0;}
                this.left_poss = 0;
            }

            if (loc_y + cor < rem_y && loc_y + loc_h - cor > rem_y && (loc_x + cor >= rem_x && loc_x + cor <= rem_x + rem_w || loc_x + loc_w - cor <= rem_x + rem_w && loc_x + loc_w - cor >= rem_x)) {
//            if (this.active_dir == 'down') {this.down_poss = 0;}
                this.down_poss = 0;
            }

            if (loc_y + cor > rem_y && loc_y + cor < rem_y + rem_h && (loc_x + cor >= rem_x && loc_x + cor <= rem_x + rem_w || loc_x + loc_w - cor <= rem_x + rem_w && loc_x + loc_w - cor >= rem_x)) {
//            if (this.active_dir == 'up') {this.up_poss = 0;}
                this.up_poss = 0;
            }

        }
    }


    var draw_player = function (ctx) {                                             // Draw player
        var x_look;
        switch (this.active_dir) {                                                    // check for player look dir
            case 'up':
                x_look = 32;
                break;
            case 'right':
                x_look = 64;
                break;
            case 'down':
                x_look = 96;
                break;
            case 'left':
                x_look = 128;
                break;
        }
        ctx.drawImage(this.img, x_look, 0, tiles.size, tiles.size, this.x, this.y, this.width, this.height);     // draw local player
    };


    var draw_remote_player = function (ctx) {                                      // Draw remote players
        var x_look;
        switch (this.active_dir) {
            case 'up':
                x_look = 32;
                break;
            case 'right':
                x_look = 64;
                break;
            case 'down':
                x_look = 96;
                break;
            case 'left':
                x_look = 128;
                break;
        }
        ctx.drawImage(this.img, x_look, 32, tiles.size, tiles.size, this.x + this.hor_dir * tiles.size - localPlayer.hor_dir * tiles.size, this.y + this.vert_dir * tiles.size - localPlayer.vert_dir * tiles.size, this.width, this.height);
    };


    var killLocalPlayer = function () {
        localPlayer = '';
    }


    // ############ PLAYER HELPER FUNCTIONS #####################################################################
    var up = function () {
        if (this.blocked == 'up' && this.up_poss == 1) {                           // check if up is pressed and there aren't remote players up
            if (tiles.map[Math.ceil(tiles.y - 1 + this.vert_dir)][Math.ceil(tiles.x - this.cor + this.hor_dir)] == 0 && tiles.map[Math.ceil(tiles.y - 1 + this.vert_dir)][Math.floor(tiles.x + this.cor + this.hor_dir)] == 0) {   // check if tile up is empty
                this.y -= this.moveAmount;                                           // player move up with moveAmount speed
                tiles.y = this.y / tiles.size;                                         // set new y tile player position
                this.active_dir = 'up';                                              // set active dir for block move in another dir in this moment 
                this.down_poss = 1;                                                  // no remote player on down in this moment
            }
        }
    }
    var down = function () {
        if (this.blocked == 'down' && this.down_poss == 1) {
            if (tiles.map[Math.floor(tiles.y + 1 + this.vert_dir)][Math.ceil(tiles.x - this.cor + this.hor_dir)] == 0 && tiles.map[Math.floor(tiles.y + 1 + this.vert_dir)][Math.floor(tiles.x + this.cor + this.hor_dir)] == 0) {
                this.y += this.moveAmount;
                tiles.y = this.y / tiles.size;
                this.active_dir = 'down';
                this.up_poss = 1;
            }
        }
    }
    var left = function () {
        if (this.blocked == 'left' && this.left_poss == 1) {
            if (tiles.map[Math.ceil(tiles.y - this.cor + this.vert_dir)][Math.ceil(tiles.x - 1 + this.hor_dir)] == 0 && tiles.map[Math.floor(tiles.y + this.cor + this.vert_dir)][Math.ceil(tiles.x - 1 + this.hor_dir)] == 0) {
                this.x -= this.moveAmount;
                tiles.x = this.x / tiles.size;
                this.active_dir = 'left';
                this.right_poss = 1;
            }
        }
    }
    var right = function () {
        if (this.blocked == 'right' && this.right_poss == 1) {
            if (tiles.map[Math.ceil(tiles.y - this.cor + this.vert_dir)][Math.floor(tiles.x + 1 + this.hor_dir)] == 0 && tiles.map[Math.floor(tiles.y + this.cor + this.vert_dir)][Math.floor(tiles.x + 1 + this.hor_dir)] == 0) {
                this.x += this.moveAmount;
                tiles.x = this.x / tiles.size;
                this.active_dir = 'right';
                this.left_poss = 1;
            }
        }
    }

    var move_poss = function () {                                                  // there aren't remote players near localPlayer - move is possibility
        this.left_poss = 1;
        this.right_poss = 1;
        this.up_poss = 1;
        this.down_poss = 1;
    }


    // Define which variables and methods can be accessed ########################################################
    return {
        img: this.img,
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height,
        username: this.username,
        active_dir: this.active_dir,
        id: this.id,
        moveAmount: this.moveAmount,
        blocked: this.blocked,
        hor_dir: this.hor_dir,
        vert_dir: this.vert_dir,
        left_poss: this.left_poss,
        right_poss: this.right_poss,
        up_poss: this.up_poss,
        down_poss: this.down_poss,
        cor: this.cor,
        turbo_shoot: this.turbo_shoot,
        immortal: this.immortal,
        update_pos: update_pos,
        playersCollide: playersCollide,
        draw_player: draw_player,
        draw_remote_player: draw_remote_player,
        killLocalPlayer: killLocalPlayer,
        up: up,
        down: down,
        left: left,
        right: right,
        move_poss: move_poss
    }
};
