// GAME PLAYER CLASS (SERVER SITE)
// this class is for store players existing in the game after player connect
var Player = function(startX, startY, pl_width, pl_height, user_name, pl_id, pl_dir, h_dir, v_dir, tur_sh, imm) {
	
   var x = startX,
		 y = startY,
       width = pl_width,
       height = pl_height,
       username = user_name,
		 id = pl_id,
       dir = pl_dir,
       hor_dir = h_dir,
       vert_dir = v_dir,
       score = 0,
       lifes = 3,
       turbo_shoot = tur_sh,                                                     // turbo shoot: 1 -active; 0 -inactive;
       immortal = imm;                                                           // immortality: 1 -active; 0 -inactive;
   
   
	// Getters and setters
	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	};

	var setX = function(newX) {
		x = newX;
	};

	var setY = function(newY) {
		y = newY;
	};


	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
      width: width,
      height: height,
      username: username,
		id: id,
      dir: dir,
      hor_dir: hor_dir,
      vert_dir: vert_dir,
      score: score,
      lifes: lifes,
      turbo_shoot: turbo_shoot,
      immortal: immortal
	}
};

// Export the Player class so you can use it in other files by using require("Player").Player
exports.Player = Player;