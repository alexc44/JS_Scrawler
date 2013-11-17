jQuery(document).ready(function($) {
	jQuery.getJSON('http://localhost:3000/queue/list', function(data) {
		var items = [];
      $.each( data.queue.urls.items, function( key, val ) {
      console.log(key);
      items.push( "<li class='list-group-item' id='" + key + "'>" + val + "</li>" );
    });
   
    $( "<ul/>", {
      "class": "list-group",
      html: items.join("")
    }).appendTo( "ul" );
	});

  //when user valid form
  
});