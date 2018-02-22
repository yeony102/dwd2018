var api = "http://api.giphy.com/v1/gifs/search?&api_key=iQb7L5zfFZlxLI3AJYOAeSawqhHdgzd1&q=";
var q = document.getElementById("mood").textContent;
var img = document.querySelector('img');

$(document).ready(function(){
				$.ajax({
				  url: api+q,
				  dataType: 'jsonp',
				  success: function(giphy) {
					img.src = giphy.data[0].images.fixed_height.url;
				  },
				  error: function() {
					alert("error");
				  }
				});        
			});
