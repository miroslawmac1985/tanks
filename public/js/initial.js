$(document).ready(function() {
   
   $('#start_button').click(function() {
      if ($('#user_name').val() != '') {
         var user_name = $('#user_name').val();
         init(user_name);
         animate();
         $('#user_name').val('');
         $('#user_name').css('display', 'none');
         $('<p id="user_name" style="display: inline;"><span style="color: #5d5d5d; font-weight: bold;">User: </span>' + user_name + '</p>').insertAfter('#end_button');
         $('#chat_title').css('display', 'block');
         $('#chat').css('display', 'block');
         $('#chat_box').css('display', 'block');
         $('#begin_game').css('display', 'none');
         $('#for_game_message').css('display', 'block');
         $('#players_list').css('display', 'block');
         $('#otherCanvas').css('background', 'none');
         $('#canvasContainer2').css('display', 'block');
      }
   });
 
})