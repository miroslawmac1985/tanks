// GAME MOUSE CLASS

// event.pageX - real x position in the page (this don't change)
// event.clientX - x position in this moment (depend of browser scrolling)

var Mouse = function() {
   
   this.move_active = 0;
   this.click_x;
   this.click_y;
   
   
   var mouseAction = function(e) {                                               // Click action

      var canv = canvas2;                                                         // set canvas for mouse move

      this.click_x = e.pageX - $(canv).offset().left;                               // params of click - canvas x, y 
      this.click_y = e.pageY - $(canv).offset().top;

      var x_left = localPlayer.x;                                                   // paramas x, y of local player
      var x_right = Math.floor(x_left + localPlayer.width);
      var y_top = Math.floor(localPlayer.y);
      var y_bottom = Math.floor(y_top + localPlayer.height);
      
      if (this.click_x <= x_right && this.click_x >= x_left && this.click_y >= y_top && this.click_y <= y_bottom) {   // if click on the local player
//         canv.onmousemove = function(e) {
//            var x_move = (e.pageX - 200);
//            var y_move = (e.pageY - 172);
//            if (x_move < localPlayer.width/2) {x_move = localPlayer.width/2}        // if click point is outside the canvas
//            else if (x_move > canv.width-localPlayer.width/2) {x_move = canv.width-localPlayer.width/2}
//            if (y_move < localPlayer.height/2) {y_move = localPlayer.height/2}
//            else if (y_move > canv.height-localPlayer.height/2) {y_move = canvas2.height-localPlayer.height/2}
//            localPlayer.x = x_move-localPlayer.width/2;
//            localPlayer.y = y_move-localPlayer.height/2;
//            socket.emit("move player", {x: localPlayer.x, y: localPlayer.y, dir: localPlayer.active_dir, h_dir: localPlayer.hor_dir, v_dir: localPlayer.vert_dir});
//            canv.onmouseup = function(e) {
//               canv.onmousemove = null;
//            }
//         }
      } else {                                                                      // if clicked on empty tile
         this.move_active = 1;
         this.mouseMove();
      }
   }
   
   
   var mouseMove = function() {                                                  // Move player  
      
      var hor_move = 1;                                                             // help variables for check when player end move
      var vert_move = 1;
      
      if (this.click_x < localPlayer.x+localPlayer.width/2-localPlayer.moveAmount) {   // move left
         localPlayer.blocked = 'left';
         localPlayer.left();
      } else if (this.click_x > localPlayer.x+localPlayer.width/2) {                   // move right
         localPlayer.blocked = 'right';
         localPlayer.right();
      } else {
         hor_move = 0;
      }

      if (this.click_y < localPlayer.y+localPlayer.height/2-localPlayer.moveAmount) {  // move up
         localPlayer.blocked = 'up';
         localPlayer.up();
      } else if (this.click_y > localPlayer.y+localPlayer.height/2) {                  // move down
         localPlayer.blocked = 'down';
         localPlayer.down();
      } else {
         vert_move = 0;
      }
      
      if (hor_move == 0 && vert_move == 0) {                                        // if player finished this move
         this.mouseClear();
      }
   }
   

   var mouseClear = function() {                                                 // Stop mouse move 
      this.move_active = 0;
   }
	
   
   // Define which variables and methods can be accessed ########################################################
	return {
      move_active: this.move_active,
      click_x: this.click_x,
      click_y: this.click_y,
		mouseAction: mouseAction,
      mouseMove: mouseMove,
      mouseClear: mouseClear
	};
   
};

