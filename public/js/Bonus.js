// GAME BONUS CLASS
var Bonus = function(bonusImg, size, x_val, y_val) {
   
   this.img = bonusImg;                                                          // img with bonus images 
   this.size = size;                                                             // size bonus img size (width and height)
   this.x_values = x_val;                                                        // array with possible x_values (x position on the img)
   this.y_values = y_val;                                                        // array with possible y_values (y position on the img)
   this.active = 0;                                                              // 1 -bonus is active; 0 -inactive
   this.img_x;                                                                   // actual bonus img x position on the tileMap 
   this.img_y;                                                                   // actual bonus img y position on the tileMap 
   this.kind;                                                                    // kind of bonus
   this.x;                                                                       // x tiles position on the canvas 
   this.y;                                                                       // y tiles position on the canvas
   
   
   var generate_bonus = function() { 
      this.active = 1;                                                           // activate bonus
      this.img_x = this.x_values[Math.floor(Math.random() * this.x_values.length)];  // set x position on the tilemap
//    this.img_y = this.y_values[Math.floor(Math.random() * this.y_values.length)];  // set y position on the tilemap
      this.img_y = 0;
      
//      this.img_x = '32';
      
      switch (this.img_x) {                                                          // set the kind of bonus                                                 
         case '0':
            this.kind = 'star';
            break;
         case '32':
            this.kind = 'bullet';
            break;
         case '64':
            this.kind = 'life';
            break;
      } 
      
      
      do {
         startX = Math.round(Math.random()*(tiles.cols*tiles.size-tiles.size));     // generate random position for bonus
         startY = Math.round(Math.random()*(tiles.rows*tiles.size-tiles.size));
         if (startX % tiles.size != 0 || startY % tiles.size != 0) {                // check if this number is divisible by tiles.size 
            do {startX++;} while (startX % tiles.size != 0);                           // check for another position
            do {startY++;} while (startY % tiles.size != 0);
         }
         this.x = startX/tiles.size;                                                // bonus tile position on tileMap
         this.y = startY/tiles.size;
      } while (tiles.map[this.y][this.x] !== 0)                                     // if in this position isn't wall or something other 
   }
   

   var draw_bonus = function(ctx) { 
      ctx.drawImage(this.img, this.img_x, this.img_y, this.size, this.size, this.x*tiles.size-localPlayer.hor_dir*32, this.y*tiles.size-localPlayer.vert_dir*32, tiles.size, tiles.size);
   }
   
           
   // Define which variables and methods can be accessed ########################################################
	return {
      img: this.img,
      size: this.size,
      x_values: this.x_values,
      y_values: this.y_values, 
      active: this.active,
      img_x: this.img_x,
      img_y: this.img_y,
      kind: this.kind,
      x: this.x,
      y: this.y,
      generate_bonus: generate_bonus,
      draw_bonus: draw_bonus
   }        
   
}