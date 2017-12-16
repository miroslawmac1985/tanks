// GAME BONUS CLASS (SERVER SITE)
var Bonus = function(size, x, y, img_x, img_y, kind, active) {
   
   this.size = size;                                                             // size bonus img size (width and height)
   this.active = active;                                                         // 1 -bonus is active; 0 -inactive
   this.img_x = img_x;                                                           // actual bonus img x position on the tileMap 
   this.img_y = img_y;                                                           // actual bonus img y position on the tileMap 
   this.kind = kind;                                                             // kind of bonus
   this.x = x;                                                                   // x tiles position on the canvas 
   this.y = y;                                                                   // y tiles position on the canvas
           
   
   // Define which variables and methods can be accessed ########################################################
	return {
      size: this.size,                                                           // size bonus img size (width and height)
      active: this.active,
      img_x: this.img_x,
      img_y: this.img_y,
      kind: this.kind,                                                           // kind of bonus
      x: this.x,                                                                 // x tiles position on the canvas 
      y: this.y 
   }        
}


// Export the Bonus class so you can use it in other files by using require("Bonus").Bonus
exports.Bonus = Bonus;