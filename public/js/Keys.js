// GAME KEYBOARD CLASS
var Keys = function(up, left, right, down, space, enter, ctrl) {
   
	this.up = up || false,
	this.left = left || false,
	this.right = right || false,
	this.down = down || false
   this.space = space || false,
   this.enter = enter || false,
   this.ctrl = ctrl || false;


	var onKeyDown = function(e) {
		switch (e.keyCode) {
			case 37:                                                                // Left
            e.preventDefault();
				this.left = true;
            localPlayer.blocked = 'left';
            if (window.mouse) {if(mouse.move_active == 1) mouse.mouseClear()};         // mouse move clear
				break;
			case 38:                                                                // Up
            e.preventDefault();
				this.up = true;
            localPlayer.blocked = 'up';
            if (window.mouse) {if(mouse.move_active == 1) mouse.mouseClear()};            
				break;
			case 39:                                                                // Right
            e.preventDefault();
				this.right = true; 
            localPlayer.blocked = 'right';
            if (window.mouse) {if(mouse.move_active == 1) mouse.mouseClear()};
				break;
			case 40:                                                                // Down
            e.preventDefault();
            this.down = true;
            localPlayer.blocked = 'down';
            if (window.mouse) {if(mouse.move_active == 1) mouse.mouseClear()};
				break;
         case 32:                                                                // Space
            this.space = true;
            spaceClick()
				break;
         case 13:                                                                // Enter
            this.enter = true;
            chat();
				break; 
         case 17:                                                                // Ctrl
            this.ctrl = true;
            playerShoot()
				break; 
		};
	};
	
   
	var onKeyUp = function(e) {
		switch (e.keyCode) {
			case 37:                   // Left
				this.left = false;
				break;
			case 38:                   // Up
				this.up = false;
				break;
			case 39:                   // Right
				this.right = false;
				break;
			case 40:                   // Down
				this.down = false;
				break;
         case 32:                   // Space   
				this.space = false;
				break;
         case 13:                   // Enter   
				this.enter = false;
				break;
         case 17:                   // Ctrl  
				this.ctrl = false;
				break;
		};
	};

	return {
		up: this.up,
		left: this.left,
		right: this.right,
		down: this.down,
      space: this.space,
      enter: this.enter,
      ctrl: this.ctrl,
		onKeyDown: onKeyDown,
		onKeyUp: onKeyUp
	};
};