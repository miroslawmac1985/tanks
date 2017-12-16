// ############ GAME HELPER FUNCTIONS ########################################################################

var shoot_block = 0;                                                             // variable for shoot block for some part of time


// ####### Calculate random start position for local player ####################
function startPosForPlayer(exist_players) {                                        
   do {
      hor_dir = 0;                                                               // define hor i vert dir variables
      vert_dir = 0;
      startX = Math.round(Math.random()*(canvas.width-tiles.size));                 // generate random position for player
      startY = Math.round(Math.random()*(canvas.height-tiles.size));
      if (startX % tiles.size != 0 || startY % tiles.size != 0) {                   // check if this number is divisible by tiles.size                            
         do {startX++;} while (startX % tiles.size != 0);                              // check for another position
         do {startY++;} while (startY % tiles.size != 0);
      }
      
      tiles.x = startX/tiles.size;                                                  // player tile position on tileMap
      tiles.y = startY/tiles.size;

      if (camera) {                                                                 // check if reading of map is move right or down  
         if (tiles.x >= camera.right) {hor_dir = tiles.x+1 - camera.right;}            // set player tile position on tileMap
         if (tiles.y >= camera.down) {vert_dir = tiles.y+1 - camera.down;}
         
         max_h_dir = tiles.cols*tiles.size - canvas.width;                             // set max hor and vert map dir
         max_v_dir = tiles.rows*tiles.size - canvas.height;
         
         if (hor_dir > max_h_dir) {hor_dir = max_h_dir}
         if (vert_dir > max_v_dir) {vert_dir = max_v_dir}
      }

      x = tiles.x;                                                                  // player tile position on tileMap
      y = tiles.y;
      
      tiles.x = tiles.x - hor_dir;                                                  // player tile position on canvas
      tiles.y = tiles.y - vert_dir;
      
      startX = startX - hor_dir*32;                                                 // player px position on canvas
      startY = startY - vert_dir*32;  
   }
   while (tiles.map[y][x] !== 0)                                                    // check if in this position on the map doesn't exist wall or other  
         
   for (var i=0; i<exist_players.length; i++) {                                     // chceck if haven't exist players in this position
      if (x == exist_players[i][0] && y == exist_players[i][1]) {
         console.log('byla kolizja - losowanie powtorzone')
         startPosForPlayer(exist_players)
      }
   }
}


// ####### Find player, shoot by ID ###################################################
function playerById(id) {                                             
	for (var i = 0; i < remotePlayers.length; i++) {
		if (remotePlayers[i].id == id)
			return remotePlayers[i];
	};	
	return false;
};


function shootById(id) {                                             
	for (var i = 0; i < shoots.length; i++) {
		if (shoots[i].id == id)
			return shoots[i];
	};	
	return false;
};


// ####### Kill remote player ##################################################
function hitRemotePlayer (scorer, cracked_id, shoot_id) {
   if (scorer == localPlayer.id) {
      socket.emit("hit player", {cracked_id: cracked_id, scorer: localPlayer.id});
   }
}


// ####### New Shoot ###########################################################
function playerShoot() {                                                         // Ctrl key pressed - Create shoot
   if (shoot_block == 0) {
      var shoot_x = localPlayer.x+localPlayer.hor_dir*32;                              // set shoot x position on the Map (no only on the canvas)
      var shoot_y = localPlayer.y+localPlayer.vert_dir*32;
      var shoot_id = Math.random();
      var shoot_dir = localPlayer.active_dir;                                          // set shoot direction

      if (shoot_dir == 'up') {shoot_y = shoot_y - localPlayer.height/2 -1;}            // set circle shoot start position
      else if (shoot_dir == 'down') {shoot_y = shoot_y + localPlayer.height/2 +1;}
      else if (shoot_dir == 'left') {shoot_x = shoot_x - localPlayer.width/2 -1;}
      else if (shoot_dir == 'right') {shoot_x = shoot_x + localPlayer.width/2 +1;}

      var shoot = new Shoot(shoot_x, shoot_y, shoot_dir, shoot_id, localPlayer.id);    // create shoot object                           
      shoots.push(shoot);                                                              // add shoot to shoots array               
      socket.emit("shoot", {x: shoot.x, y: shoot.y, dir: shoot.dir, id: shoot.id, user: localPlayer.id});   // emit shoot properties to another players

      shoot_block = 1;                                                                 // shoot block
      setTimeout(function(){shoot_block = 0;},100);                                    // shoot unblock
   }   
}


// ####### Send game messages by space click ###################################
function spaceClick() {
   var messages = ["Hello!","Hi","What's your name"];                                     // array with example messages
   var message = [Math.floor(Math.random() * messages.length)]                            // generate random message from array
   $('#for_game_message').html('<p><span style="color: blue;">me: </span>'+messages[message]+'</p>');
   socket.emit("game message", {mes: messages[message], id: localPlayer.id, user: localPlayer.username});
}


// ####### Chat - send message #################################################
function chat() {
   var text = $('#chat_input').val();
   $('#chat_box').prepend('<p><span style="color: blue;">'+localPlayer.username+': </span>'+text+'</p>');
   $('#chat_input').val('')
   socket.emit("chat", {id: localPlayer.id, mes: text, user: localPlayer.username});
}


// ####### Special disconnect ##################################################
function own_disconnect() {
   socket.disconnect();
}


// ####### Player move #########################################################
function move() {
   
   ctx2.clearRect(localPlayer.x-tiles.size*2, localPlayer.y-tiles.size*2, localPlayer.width+tiles.size*4, localPlayer.height+tiles.size*4);      // clear localPlayer canvas
   localPlayer.draw_player(ctx2);                                                // draw local player   
   
   ctx3.clearRect(0, 0, canvas3.width, canvas3.height); 
   for (var i=0; i<remotePlayers.length; i++) {                                  // draw remote players
      remotePlayers[i].draw_remote_player(ctx3);
   };
   
   if (remotePlayers.length > 0) {                                               // check for player collide with another
      localPlayer.playersCollide();
   } else {
      localPlayer.move_poss();
   }
   socket.emit("move player", {x: localPlayer.x, y: localPlayer.y, dir: localPlayer.active_dir, h_dir: localPlayer.hor_dir, v_dir: localPlayer.vert_dir});   // Send local player data to the game server
   if (tiles.camera == 'on') {camera.move();} 
   
   if (bonus.active == 1) {                                                      // check for get bonus
      var cor = 4;                                                                  // helpful variable for correct png
      
      if (localPlayer.x+localPlayer.width >= bonus.x*tiles.size-localPlayer.hor_dir*32+cor && localPlayer.x <= bonus.x*tiles.size+bonus.size-localPlayer.hor_dir*32-cor && localPlayer.y+localPlayer.height >= bonus.y*tiles.size-localPlayer.vert_dir*32+cor && localPlayer.y <= bonus.y*tiles.size+bonus.size-localPlayer.vert_dir*32-cor) {
         
         if (bonus.kind == 'star') {                                                // STAR - immortal
            localPlayer.immortal = 1;                                                  // activate immortal
            socket.emit("add immortal", {id: localPlayer.id});
            setTimeout (function() {                                                   // disactivate immortal            
               localPlayer.immortal = 0;
               socket.emit("immortal off", {id: localPlayer.id});
            }, 30000)
         
         } else if (bonus.kind == 'bullet') {                                       // BULLET - turbo shoot                       
            localPlayer.turbo_shoot = 1;                                               // activate turbo shoot  
            socket.emit("add turbo shoot", {id: localPlayer.id});
            setTimeout (function() {                                                   // disactivate turbo shoot            
               localPlayer.turbo_shoot = 0;
               socket.emit("turbo shoot off", {id: localPlayer.id});
            }, 30000) 
         
         } else if (bonus.kind == 'life') {                                         // LIFE - add life
            socket.emit("add life", {id: localPlayer.id});
         }
         
         bonus.active = 0;                                                          // disactivate this bonus
      }
   }
}