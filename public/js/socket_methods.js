// ############ SOCKET METHODS ##############################################################################
function onSocketConnected() {                                                   // Socket connected
   console.log("Connected to socket server");
   $('#start_button').css('display', 'none');
   $('#end_button').css('display', 'inline');
   $('#for_game_message').html('<p><span>You are connected</span></p>'); 
};


function onSocketDisconnect() {                                                  // Socket disconnected
	console.log("Disconnected from socket server");
   location.reload();
};


function onExistPlayers(data) {                                                  // Check for exist players and them positions
	if (socket.socket.sessionid == data.id) {
      if (data.exist == 1) {                                                     // players exist
         var exist_player = new Array(data.x/32, data.y/32);                        // this for check actual position exist players
         exist_players.push(exist_player);
      } else if (data.exist == 0) {                                              // players no exist
         startPosForPlayer(exist_players)                                           // Generate start position for local player (without positions of exist players)
         localPlayer = new Player(playerImg, startX, startY, 32, 32, user, 'up', hor_dir, vert_dir, 0, 0);   // INITIALISE LOCAL PLAYER
         console.log("My id: "+socket.socket.sessionid+" - "+localPlayer.username)
         socket.emit("new player", {x: localPlayer.x, y: localPlayer.y, width: localPlayer.width, height:localPlayer.height, user: localPlayer.username, h_dir: localPlayer.hor_dir, v_dir: localPlayer.vert_dir, turbo_shoot: localPlayer.turbo_shoot, immortal: localPlayer.immortal});    // Send local player data to the game server
         localPlayer.id = socket.socket.sessionid;
         localPlayer.draw_player(ctx2);                                          // draw local player 
         $('#players_list ol').append('<li id="'+localPlayer.id+'" class="user">'+localPlayer.username+'<p id="score_'+data.id+'" class="score">0</p><div id="lifes_'+data.id+'" class="lifes"></div></li>');
         tiles.drawScreen(ctx);                                                  // draw main map
         tiles.draw_smallMap(ctx_sm1, stage.scale);                              // draw small map
         tiles.draw_smallDraws(ctx_sm2, stage.scale);                            // draw others draws on the small map
      }
   }
};


function onNewPlayer(data) {                                                     // New remote player
   if (localPlayer != data.id) {
      if (data.exist == 1) {                                                        // if player existed in game after we connected
         console.log("Exist player: "+data.id+" - "+data.user);
      } else if (data.exist == 0) {                                                 // if new player connected
         console.log("New player connected: "+data.id+" - "+data.user);
         $('#for_game_message').html('<p><span>Player '+data.user+' connected</span></p>');
      }
      var newPlayer = new Player(playerImg, data.x, data.y, data.width, data.height, data.user, data.dir, data.h_dir, data.v_dir, data.turbo_shoot, data.immortal);     // Initialise the new player 
      newPlayer.id = data.id;
      remotePlayers.push(newPlayer);                                                // Add new player to the remote players array
      newPlayer.draw_remote_player(ctx3);                                           // Draw remote player
      
      var insert = 0;                                                               // sort players by points
      var scores = $('.score');
      var lifes = data.lifes * 16;
      var player_li = '<li id="'+data.id+'">'+data.user+'<p id="score_'+data.id+'" class="score">'+data.scores+'</p><div id="lifes_'+data.id+'" class="lifes" style="width: '+lifes+'px"></div></li>';
      
      if (scores.length>0) {                                                           // if there exist players
         scores.each(function() {                                                         // players loop 
            var $this = $(this);
            if (data.scores > $this.html() && insert == 0) {                                 // if new player score is greater than exist player score
               $($this.parent()).before(player_li);
               insert = 1;
            } 
         });
         if (insert == 0) {                                                               // if new player score is less than exist players score                                                         
            $('#players_list ol').append(player_li);
         }
      } else {                                                                         // if there doesn't exist players
         $('#players_list ol').append(player_li);
      }
      
   }
};


function onMovePlayer(data) {                                                    // Move remote player
   var movePlayer = playerById(data.id);
	if (!movePlayer) {return;}                                                       // Player not found
   
   movePlayer.x = data.x;                                                           // Update player position
	movePlayer.y = data.y;
   movePlayer.active_dir = data.dir;
   movePlayer.hor_dir = data.h_dir;
   movePlayer.vert_dir = data.v_dir;
   
   ctx3.clearRect(0, 0, canvas3.width, canvas3.height); 
	for (var i=0; i<remotePlayers.length; i++) {                                  // draw remote players
      remotePlayers[i].draw_remote_player(ctx3);
   };
};


function onHitPlayer(data) { 
   var scorer = $('#score_'+data.scorer).text(data.scores)                       // update scores in players list
   if (data.lifes <= 0) {                                                           // if cracked player doesn't have more lifes
      var shoot = shootById(data.shoot);                                
      if (shoot) {shoot.shoot_destroy(shoot.big_explosion)}                            // just in case if shoot doesn't explosion after hit
      if (data.cracked_id == localPlayer.id) {localPlayer.killLocalPlayer()}           // if killed is local player
      else {
         removePlayer = playerById(data.cracked_id);
         if (data.scorer == localPlayer.id) {
            $('#for_game_message').html('<p><span style="color: blue;">You have killed '+removePlayer.username+' !</span></p>');
            socket.emit("info message", {mes: 'Player <span class="success">'+localPlayer.username+'</span> have killed <span class="danger">'+removePlayer.username+'</span> !', killed_id: removePlayer.id});
            if (bonus.active == 0) {                                                      // generate new bonus only if bonus isn't active
               bonus.generate_bonus();
               socket.emit("bonus", {x: bonus.x, y: bonus.y, img_x: bonus.img_x, img_y: bonus.img_y, kind: bonus.kind, size: bonus.size});
            }
         }
         console.log("Player "+removePlayer.username+" has been killed")
         if (!removePlayer) {                                                          // Player not found
            return;
         } else {
            remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);              // Remove player from array
            $('#'+data.cracked_id).remove();                                           // remove player from players list on te site 
         }
         ctx3.clearRect(0, 0, canvas3.width, canvas3.height); 
         for (var i=0; i<remotePlayers.length; i++) {                                  // draw remote players
            remotePlayers[i].draw_remote_player(ctx3);
         };
      }
   }
   
   var insert = 0;                                                                     // sort players by them scores (update scorer)
   scores = $('.score');
   if (scores.length>0) {
      scores.each(function() { 
         var $this = $(this);
         if (data.scores > $this.html() && insert == 0) {
            $($this.parent()).before(scorer.parent())
            insert = 1;
         } 
      });
   }
   
   var lifes = data.lifes *16;                                                         // update cracked player lifes
   $("#lifes_"+data.cracked_id+"").css('width', lifes);
}


function onGameMessage(data) {                                                   // Gsme message received (by space click)
   $('#for_game_message').html('<p><span style="color: #5d5d5d;">'+data.user+': </span>'+data.mes+'</p>');
}


function onInfoMessage(data) {                                                   // Info about player killed 
   if (localPlayer) {                                                               // only for exist players, no for killed player
      $('#for_game_message').html('<p>'+data.mes+'</p>');
   }
}


function onGetChat(data) { 
   $('#chat_box').prepend('<p><span style="color: #5d5d5d;">'+data.user+': </span>'+data.mes+'</p>');
}


function onGetShoot(data) { 
   var shoot = new Shoot(data.x, data.y, data.dir, data.id, data.user);                             
   shoots.push(shoot); 
}


function onOwnDisconnect(data) {                                                 // another player disconnect
   console.log("Player "+data.id+" - "+data.user+" disconnected");                    
   $('#for_game_message').html('<p><span class="danger">Player '+data.user+' disconnected</span></p>');
   removePlayer = playerById(data.id);
   if (!removePlayer) {                                                          // Player not found
		return;
	} else {
      remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);              // Remove player from array
      $('#'+data.id).remove();                                                   // remove player from players list on te site 
   }
}

function onEndScore(data) {                                                      // received message with localPlayer end score
   stage.end(data.score);                                                           // end stage
}

function onBonus(data) {                                                         // bonus message received
   bonus.active = 1;                                                                // set bonus params                                      
   bonus.x = data.x;
   bonus.y = data.y;
   bonus.img_x = data.img_x;
   bonus.img_y = data.img_y;
   bonus.kind = data.kind;
}

function onAddLife(data) {
   bonus.active = 0;
   lifes = data.lifes*16;
   $('#lifes_'+data.id).css('width',lifes)
}

function onTurboShoot(data) {
   bonus.active = 0;
   var player = playerById(data.id);
   player.turbo_shoot = 1;                                                       // activate turbo shoot for player                         
}

function onTurboShootOff(data) {
   var player = playerById(data.id);                                                                   
   player.turbo_shoot = 0;                                                       // disactivate turbo shoot                            
}

function onAddImmortal(data) {
   bonus.active = 0;
   var player = playerById(data.id);
   player.immortal = 1;  
}

function onImmortalOff(data) {
   var player = playerById(data.id);                                                                   
   player.immortal = 0;    
}