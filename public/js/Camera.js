// GAME CAMERA CLASS
var Camera = function(left, right, up, down) {
	
   this.left = left;                                                             // left tile number, in which camera is active 
   this.right = right;                                                           // right tile number, in which camera is active 
   this.up = up;                                                                 // top tile number, in which camera is active 
	this.down = down;                                                             // bottom tile number, in which camera is active 
   
   tiles.camera = 'on';                                                          // enable camera flag


   var move = function() {
      var draw = 0;
      var cor = 32;
      if (Math.ceil(localPlayer.x/32) >= this.right && localPlayer.hor_dir < tiles.cols - tiles.cWidth/tiles.size) {    // right
         ++localPlayer.hor_dir;                                                                                            // change reading for tileMap one tile to the right
         --tiles.x;                                                                                                        // set player tile one tile to the left
//         localPlayer.x -= tiles.size;                                                                                      // set localPlayer x position one tile to the left            
         localPlayer.x = localPlayer.x - cor; 
         draw = 1;                                                                                                         // tileMap should be redraw
      } else if (Math.floor(localPlayer.x/32) <= this.left && localPlayer.hor_dir > 0) {                                // left
         --localPlayer.hor_dir;
         ++tiles.x;
//         localPlayer.x += tiles.size;
         localPlayer.x = localPlayer.x + cor;
         draw = 1;
      }   
      if (Math.ceil(localPlayer.y/32) >= this.down && localPlayer.vert_dir < tiles.rows - tiles.cHeight/tiles.size) {   // down
         ++localPlayer.vert_dir;
         --tiles.y;
//         localPlayer.y -= tiles.size;
         localPlayer.y = localPlayer.y - cor;
         draw = 1;
      } else if (Math.floor(localPlayer.y/32) <= this.up && localPlayer.vert_dir > 0) {                                 // up
         --localPlayer.vert_dir;
         ++tiles.y;
//         localPlayer.y += tiles.size;
         localPlayer.y = localPlayer.y + cor;
         draw = 1;
      } 
      if (draw == 1) {
         ctx.clearRect(0, 0, canvas.width, canvas.height);
         tiles.drawScreen(ctx);                                                  // draw tilemap
      }
   }


	return {
		left: this.left,
		right: this.right,
      up: this.up,
		down: this.down,
      cam_hor_move: this.cam_hor_move,
      cam_vert_move: this.cam_vert_move,
      move: move
	};
};