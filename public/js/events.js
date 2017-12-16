// ############ GAME EVENTS ###############################################################################

function onKeydown(e) {                                                          // Keyboard key down
	if (localPlayer) {keys.onKeyDown(e)}
}


function onKeyup(e) {                                                            // Keyboard key up
	if (localPlayer) {keys.onKeyUp(e)}
}


function onClick(e) {                                                            // Mouse click
   if (localPlayer) {
      if (!(localPlayer.update_pos(keys))) {
         mouse.mouseAction(e);                                                   // this only for simple move; to get continuous move update method should be use 
      }
   } 
}  

