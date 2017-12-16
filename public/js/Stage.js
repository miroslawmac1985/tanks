// GAME STAGE CLASS
var Stage = function() {
   
   this.activeStage;                                                             // Stage which is active
   this.scale;                                                                   // Scale for small map
   
   var stage_1 = function() {
      this.activeStage = 'stage_1';
      var tileSheet = new Image();
      tileSheet.src = "img/tanks_sheet.png";
      tileMap = [
              [25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,0,25,25,25 ]
            , [25,0,0,0,0,0,0,0,0,0,0,25,0,0,0,0,0,0,0,0,24,25 ]
            , [25,0,25,0,0,0,0,0,0,0,25,25,0,0,25,25,25,25,0,0,0,25 ]
            , [25,0,25,0,0,0,0,0,25,0,25,25,0,0,0,0,0,25,0,0,0,25 ]
            , [25,0,25,0,0,0,0,0,25,0,0,25,25,25,0,0,0,25,0,25,0,25 ]
            , [25,0,25,25,25,25,25,0,25,0,0,0,0,25,25,0,0,25,0,25,0,25 ]
            , [25,0,25,0,0,0,0,0,0,0,0,0,0,0,25,0,0,25,0,25,0,25 ]
            , [25,0,0,0,25,25,25,25,25,0,0,25,25,0,0,0,0,25,0,0,0,25 ]
            , [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0 ]
            , [25,25,25,25,25,25,25,25,25,25,25,25,25,25,0,25,25,25,25,25,25,25 ]
      ];
      var size = 32;
      var rows = 10;
      var cols = 22; 
      this.scale = 4;
      tiles = new Tiles(tileMap,tileSheet,canvas.width,canvas.height,size,rows,cols);     // Initialise tiles  
      var width = cols*size / this.scale;
      var height = rows*size / this.scale;
      this.canvasResize(width, height)
   }
   
   
   var stage_2 = function() {
      this.activeStage = 'stage_2';
      var tileSheet = new Image();
      tileSheet.src = "img/tanks_sheet.png";
      tileMap = [
              [25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25 ]
            , [25,0,0,0,0,0,0,0,0,0,0,25,0,0,0,0,0,0,0,0,24,25,0,0,25 ]
            , [25,0,25,0,0,0,0,0,0,0,25,25,0,0,25,25,25,25,0,0,0,25,0,0,25 ]
            , [25,0,25,0,0,0,0,0,25,0,25,25,0,0,0,0,0,25,0,0,0,25,25,0,25 ]
            , [25,0,25,0,0,0,0,0,25,0,0,25,25,25,0,0,0,25,0,25,0,0,0,0,25 ]
            , [25,0,25,25,25,25,25,0,25,0,0,0,0,25,25,0,0,25,0,25,0,25,25,0,25 ]
            , [25,0,25,0,0,0,0,0,0,0,0,0,0,0,25,25,0,25,0,25,0,0,0,0,25 ]
            , [25,0,0,0,25,25,25,25,25,0,0,25,25,0,0,0,0,25,0,0,0,25,0,25,25 ]
            , [25,0,25,0,0,0,0,0,25,0,25,25,0,0,0,0,0,25,0,0,0,25,0,0,25 ]
            , [25,0,25,0,0,0,0,0,25,0,0,25,25,25,0,0,0,25,0,0,0,25,25,0,25 ]
            , [25,0,25,25,25,25,25,0,25,0,0,0,0,25,25,0,0,0,0,25,0,25,25,0,25 ]
            , [25,0,25,0,0,0,0,0,0,0,0,0,0,0,25,0,25,25,0,25,0,0,0,0,25 ]
            , [25,0,25,0,0,25,0,0,25,0,25,25,0,0,0,0,0,25,0,0,0,25,0,0,25 ]
            , [25,0,0,0,0,0,0,0,25,0,0,25,25,25,0,0,0,25,0,25,0,25,0,25,25 ]
            , [25,0,25,25,0,25,25,0,25,0,0,0,0,25,25,0,0,25,0,25,0,25,0,0,25 ]
            , [25,0,0,25,25,25,25,25,25,0,0,25,25,0,0,0,0,25,0,0,0,0,0,0,25 ]
            , [25,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,25,0,25 ]
            , [25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25,25 ]
      ];
      var size = 32;
      var rows = 18;
      var cols = 25; 
      this.scale = 4;
      tiles = new Tiles(tileMap,tileSheet,canvas.width,canvas.height,size,rows,cols);     // Initialise tiles  
      var width = cols*size / this.scale;
      var height = rows*size / this.scale;
      this.canvasResize(width, height)
   }
   
   
   var end = function(score) {
      this.activeStage = 'end';
      $('#end_button').css('visibility','hidden');
      $('#for_game_message').html('<p><span style="color: red;">You have been killed!</span></p>');
      
      ctx.clearRect(0, 0, canvas.width, canvas.height); 
      ctx2.clearRect(0, 0, canvas.width, canvas.height); 
      ctx3.clearRect(0, 0, canvas.width, canvas.height); 
      ctx20.clearRect(0, 0, canvas2.width, canvas2.height); 
      ctx.rect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle="black";
      ctx.fill(); 
      ctx20.fillStyle = "white";
      ctx20.font = '80px Arial bold';
      x = canvas.width/4;
      y = canvas.height/2;
      ctx20.fillText("Game over", x, y);
      
      ctx20.font = '20px Arial bold';
      x = canvas.width/2.5;
      y = canvas.height/1.5;
      ctx20.fillText("Your score: "+score+"", x, y);
      
      $('#user_name').css('display','none');
      $('#canvasContainer2').css('display','none');
      $('#players_list').css('display','none');
      $('#chat_title').css('display','none');
      $('#chat').css('display','none');
      $('#chat_box').css('display','none');
      
      setTimeout(function() {socket.disconnect();}, 5000);
   }
   
   
   // ############ PLAYER HELPER FUNCTIONS #####################################################################
   var canvasResize = function(c_width, c_height) {
      $('#canvasContainer2').css('height', c_height);
      $('#canvasContainer2').css('width', c_width);
      
      $('#smallmapCanvas').attr('height', c_height)                                         
      $('#smallmapCanvas').attr('width', c_width)
      $('#smallCanvas').attr('height', c_height)
      $('#smallCanvas').attr('width', c_width)
      
      $('#smallmapCanvas').height(c_height)
      $('#smallmapCanvas').width(c_width)
      $('#smallCanvas').height(c_height)
      $('#smallCanvas').width(c_width)
   }
   
   
   // Define which variables and methods can be accessed ########################################################
	return {
      activeStage: this.activeStage,
      scale: this.scale,        
      stage_1: stage_1,
      stage_2: stage_2,
      end: end,
      canvasResize: canvasResize
   }
   
}


