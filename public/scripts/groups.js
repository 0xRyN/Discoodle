var defaultId = 'Progra';
console.log(defaultId);
(function($) {
    "use strict"; // Start of use strict


    var socket = io();
    function showGroup(id) {
        defaultId = id;
        if (typeof id == 'undefined') {
            showGroup(defaultId);
            return;
        }

        $('.messages-group').each(function() {
            if ($(this).attr('id') === id) {
                $(this).addClass('show');
            } else {
                $(this).removeClass('show');
            }
        });
        document.getElementById("chanName").setAttribute('value', id+0);
    };

    $(document).ready(function() {
        showGroup(defaultId);
    });


    $(document).on('click', '.trigger-group', function(){ 
        var msg_bar = document.getElementById("msgbar");
        msg_bar.style.visibility='visible' 
        console.log("here");
        console.log($(this).attr('data'));
        var id = $(this).attr('data');
        showGroup(id);
        console.log(id);
        lastId = id;

   });
   $(document).on('click', '.trigger-group-cours', function(){ 
    socket.emit('sql-select', "SELECT usertype FROM users WHERE id_user = "+'"'+ getCookie("uid")+'"', (result) =>{
        console.log(result);
        if(result[0].usertype===0){
            var msg_bar = document.getElementById("msgbar");
            msg_bar.style.visibility='hidden' 
        }
    })


    console.log("here");
    console.log($(this).attr('data'));
    var id = $(this).attr('data');
    showGroup(id);
    console.log(id);

});
})(jQuery); // End of use strict