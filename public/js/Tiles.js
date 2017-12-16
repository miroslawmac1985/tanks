// ############ GAME TILES CLASS ############################################################################
var Tiles = function(tileMap, tileSheet, canvWidth, canvHeight, tileSize, mapRows, mapCols) {
   
   this.map = tileMap;                                                            // map 
   this.sheet = tileSheet;                                                        // img
   this.cWidth = canvWidth;                                                       // canvas width
   this.cHeight = canvHeight;                                                     // canvas height
   this.size = tileSize;                                                          // simple tile width and height
   this.rows = mapRows;                                                           // map rows amount
   this.cols = mapCols;                                                           // map cols amount
   this.camera = 'off';                                                           // camera flag
   this.x;                                                                        // actual localPlayer tile x position on the canvas (no all the map)
   this.y;                                                                        // actual localPlayer tile y position on the canvas (no all the map)
   this.mapIndexOffset = -1;
   
   
   var drawScreen = function(ctx) {
      var canvRow = 0;
      for (var rowCtr=localPlayer.vert_dir; rowCtr<this.rows; rowCtr++) {
         var canvCol = 0;
         for (var colCtr=localPlayer.hor_dir; colCtr<this.cols; colCtr++){
            var tileId = this.map[rowCtr][colCtr]+this.mapIndexOffset;
            if (tileId<0) tileId = 0;
            var sourceX = Math.floor(tileId % 8) *this.size;
            var sourceY = Math.floor(tileId / 8) *this.size;  
            ctx.drawImage(this.sheet, sourceX, sourceY, this.size, this.size, canvCol*this.size, canvRow*this.size, this.size, this.size);
            ++canvCol;
         }
         ++canvRow;
      }
   }
   
   var draw_smallMap = function(ctx,scale) {                                     // draw small map
      var size = this.size/scale;
      for (var rowCtr=0; rowCtr<this.rows; rowCtr++) {                               // draw tiles
         for (var colCtr=0; colCtr<this.cols; colCtr++){
            var tileId = this.map[rowCtr][colCtr]+this.mapIndexOffset;
            if (tileId < 0) tileId = 0;
            var sourceX = Math.floor(tileId % 8) * this.size;
            var sourceY = Math.floor(tileId / 8) * this.size; 
            ctx.drawImage(this.sheet, sourceX, sourceY, this.size, this.size, colCtr*size, rowCtr*size, size, size);
         }
      }
   }  
    
   var draw_smallDraws = function(ctx,scale) { 
      var small_x = (localPlayer.x+localPlayer.hor_dir*32)/scale;                    // draw localPlayer
      var small_y = (localPlayer.y+localPlayer.vert_dir*32)/scale;
      var width = localPlayer.width/scale;
      var height = localPlayer.height/scale;
      ctx.beginPath();
      ctx.rect(small_x, small_y, width, height);
      ctx.fillStyle = 'green';
      ctx.fill();
      
      for (var i=0; i<remotePlayers.length; i++) {                                   // draw remote players
         var small_x = (remotePlayers[i].x+remotePlayers[i].hor_dir*32)/scale;
         var small_y = (remotePlayers[i].y+remotePlayers[i].vert_dir*32)/scale;
         ctx.beginPath();
         ctx.rect(small_x, small_y, width, height);
         ctx.fillStyle = 'blue';
         ctx.fill();
      };
   }
   
   
   // ############ TILES HELPER FUNCTIONS #####################################################################

   
   
   // Define which variables and methods can be accessed ########################################################
   return {
		map: this.map,
		sheet: this.sheet,
      cWidth: this.cWidth,
      cHeight: this.cHeight,
      size: this.size,
      rows: this.rows,
      cols: this.cols,
      camera: this.camera,
      x: this.x,
      y: this.y,
      mapIndexOffset: this.mapIndexOffset,
      drawScreen: drawScreen,
      draw_smallMap: draw_smallMap,
      draw_smallDraws: draw_smallDraws
	}
}
