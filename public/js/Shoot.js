// GAME SHOOT CLASS
var Shoot = function(shoot_x, shoot_y, shoot_dir, shoot_id, shoot_user) {
   
	this.x = shoot_x;                                                             // shoot x position in px in tileMap (no only in canvas)
	this.y = shoot_y;                                                             // shoot y position in px in tileMap (no only in canvas)
   this.speed = 2;                                                               // shoot speed
   this.dir = shoot_dir;                                                         // shoot dir
   this.id = shoot_id;                                                           // shoot id
   this.user = shoot_user;                                                       // shoot user id
   this.initial = 1;                                                             // initialise shoot - to check shoot start position
   this.active = 1;                                                              // 1 -shoot is active; 0 -shoot will be remove;
   this.explosion = 0;                                                           // 1 -shoot will be destroy;
   this.before_explosion = 0.4;                                                  // variable for reaction before explosion
   this.x_value = 160;                                                           // x value for shoot img
   this.small_explosion = 32;                                                    // x value for small explosion img
   this.big_explosion = 96;                                                      // x value for big explosion img
   
   
   var draw_shoot = function(ctx, player) {                                      // Draw shoot
      
      if (player != localPlayer) {                                                // if shooter isn't localPlayer
         this.checkForHitRemote('remote');                                          // check for remote player hit another remote player (shooter: remote)
         this.checkForHitLocalPlayer();                                             // check for hit local player
      } else {this.checkForHitRemote('local');}                                     // check for hit remote player (shooter: local)

      if (this.active == 1) {                                                        // if doesn't hit player
         var cor = 2;                                                                   // helpful correct variable for check shoot to shoot collide
         switch (this.dir) {                                                            // check for walls and another shoots
            
            case 'up':                                                                    // UP
               if (Math.floor(this.y/tiles.size) in tiles.map) {                             // check if this index exist in tiles.map
                  if (tiles.map[Math.floor(this.y/tiles.size)][Math.round(this.x / tiles.size)] == 0) {  // check if next tile is 0
                     for (i=0; i<shoots.length; i++) {                                          // loop for check another shoots position
                        if (this.user != shoots[i].user && this.id != shoots[i].id && this.y <= shoots[i].y && this.x >= shoots[i].x-cor && this.x <= shoots[i].x+cor) {   // if shoot hit another shoot
                           this.shoot_destroy(this.small_explosion);
                        } else if (player.turbo_shoot == 1) {
                           this.y -= this.speed;
                        }   
                     }
                     this.y -= this.speed;
                  } else {this.up_explosion()}
               } else {
                  this.up_explosion();
               }
               break;
            
            case 'down':                                                                 // DOWN
               if (Math.ceil(this.y/tiles.size) in tiles.map) {
                  if (tiles.map[Math.ceil(this.y/tiles.size)][Math.round(this.x/tiles.size)] == 0) {
                     for (i=0; i<shoots.length; i++) {
                        if (this.user != shoots[i].user && this.id != shoots[i].id && this.y >= shoots[i].y && this.x >= shoots[i].x-cor && this.x <= shoots[i].x+cor) {     
                           this.shoot_destroy(this.small_explosion);
                        }  else if (player.turbo_shoot == 1) {
                           this.y += this.speed;
                        }
                     }
                     this.y += this.speed;
                  } else {this.down_explosion()}
               } else {
                  this.down_explosion();
               }   
               break;
            
            case 'left':                                                                 // LEFT     
               if (Math.floor(this.x/tiles.size) in tiles.map[Math.round(this.y/tiles.size)]) {
                  if (tiles.map[Math.round(this.y/tiles.size)][Math.floor(this.x/tiles.size)] == 0) {
                     for (i=0; i<shoots.length; i++) {
                        if (this.user != shoots[i].user && this.id != shoots[i].id && this.x <= shoots[i].x && this.y >= shoots[i].y-cor && this.y <= shoots[i].y+cor) {   
                           this.shoot_destroy(this.small_explosion);
                        }  else if (player.turbo_shoot == 1) {
                           this.x -= this.speed;
                        }
                     }
                     this.x -= this.speed;
                  } else {this.left_explosion()}
               } else {
                  this.left_explosion();
               }
               break;
            
            case 'right':                                                                // RIGHT
               if (Math.ceil(this.x/tiles.size) in tiles.map[Math.round(this.y/tiles.size)]) {
                  if (tiles.map[Math.round(this.y/tiles.size)][Math.ceil(this.x/tiles.size)] == 0) {
                     for (i=0; i<shoots.length; i++) {
                        if (this.user != shoots[i].user && this.id != shoots[i].id && this.x >= shoots[i].x && this.y >= shoots[i].y-cor && this.y <= shoots[i].y+cor) {
                           this.shoot_destroy(this.small_explosion);
                        }  else if (player.turbo_shoot == 1) {
                           this.x += this.speed;
                        }
                     }
                     this.x += this.speed;
                  } else {this.right_explosion()}
               } else {
                  this.right_explosion();
               }
               break;
         }
      }

      ctx.drawImage(tiles.sheet, this.x_value, 64, tiles.size, tiles.size, this.x-localPlayer.hor_dir*32, this.y-localPlayer.vert_dir*32, tiles.size, tiles.size);
	};    
    
    
   // ############ SHOOT HELPER FUNCTIONS #####################################################################
   function checkForHitRemote(shooter) {    
     for (var j=0; j<remotePlayers.length; j++) {                                // check for hit remote player
        var cor = 14;                                                               // help variable
        var cond1 = this.x-remotePlayers[j].hor_dir*tiles.size <= remotePlayers[j].x+cor;
        var cond2 = this.x-remotePlayers[j].hor_dir*tiles.size >= remotePlayers[j].x-cor;
        var cond3 = this.y-remotePlayers[j].vert_dir*tiles.size <= remotePlayers[j].y+cor;
        var cond4 = this.y-remotePlayers[j].vert_dir*tiles.size >= remotePlayers[j].y-cor;
        
        if (cond1 && cond2 && cond3 && cond4) {                                     // localPlayer hit remote player
           this.shoot_destroy(this.big_explosion);
           if (shooter == 'local' && remotePlayers[j].immortal == 0) {
              hitRemotePlayer(localPlayer.id, remotePlayers[j].id)   
           }
        }  
     } 
   }
   
   function checkForHitLocalPlayer() {                                           // check for hit local player
      var cor = 14;  
      var cond5 = this.x-localPlayer.hor_dir*tiles.size <= localPlayer.x+cor;
      var cond6 = this.x-localPlayer.hor_dir*tiles.size >= localPlayer.x-cor;
      var cond7 = this.y-localPlayer.vert_dir*tiles.size <= localPlayer.y+cor;
      var cond8 = this.y-localPlayer.vert_dir*tiles.size >= localPlayer.y-cor;
      
      if (cond5 && cond6 && cond7 && cond8) {                                       // hit localPlayer 
         this.shoot_destroy(this.big_explosion);
      } 
   }
   

   var up_explosion = function() { 
      if (this.y/tiles.size > Math.floor(this.y / tiles.size) + this.before_explosion) {                // if shoot is near wall in this moment
         this.y -= this.speed;
         this.explosion = 1;
      } else if (this.explosion == 1) {
         this.shoot_destroy(this.small_explosion);
      }   
   }
   
   var down_explosion = function() {  
      if (this.y/tiles.size < Math.ceil(this.y / tiles.size) - this.before_explosion) { 
         this.y += this.speed;
         this.explosion = 1;
      } else if (this.explosion == 1) {
         this.shoot_destroy(this.small_explosion);
      }   
   }
   
   var left_explosion = function() {  
      if (this.x/tiles.size > Math.floor(this.x / tiles.size)+this.before_explosion) {
         this.x -= this.speed;
         this.explosion = 1;
      } else if (this.explosion == 1) {
         this.shoot_destroy(this.small_explosion);
      }
   }
   
   var right_explosion = function() {  
      if (this.x/tiles.size < Math.ceil(this.x / tiles.size)-this.before_explosion) { 
         this.x += this.speed;
         this.explosion = 1;
      } else if (this.explosion == 1) {
         this.shoot_destroy(this.small_explosion);
      }   
   }
   
   
   var shoot_destroy = function(destroyValue) {                                  // shoot destroy
      this.x_value = destroyValue;                                                  // change shoot img x value for explosion img x value
      this.active = 0;   
   }
   
   
   return {
		x: this.x,
		y: this.y,
      speed: this.speed,
      dir: this.dir,
      id: this.id,
      user: this.user,
      initial: this.initial,
      active: this.active,
      explosion: this.explosion,
      before_explosion: this.before_explosion,
      x_value: this.x_value,
      small_explosion: this.small_explosion,                                                  
      big_explosion: this.big_explosion,
      draw_shoot: draw_shoot,
      checkForHitRemote: checkForHitRemote,
      checkForHitLocalPlayer: checkForHitLocalPlayer,
      up_explosion: up_explosion,
      down_explosion: down_explosion,
      left_explosion: left_explosion,
      right_explosion: right_explosion,
      shoot_destroy: shoot_destroy
   }
   
};   
