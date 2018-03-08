var map;

var latlngCtr = {
	lat: 19.71388249013611,
	lng: 9.209659489448029
};

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		'center' : latlngCtr,
		'zoom' : 3,
		'mapTypeId' : google.maps.MapTypeId.ROADMAP,
		'draggable' : true,
		'scrollwheel' : true
	});

/*	var marker = [];
    	marker[0] = new google.maps.Marker({
			'map' : map,
			'position' : latlng[0],
			'animation' : google.maps.Animation.DROP,
			'title' : 'H+ Sport Vine'
		});

		marker[1] = new google.maps.Marker({
			'map' : map,
			'position' : latlng[1],
			'animation' : google.maps.Animation.DROP,
			'title' : 'H+ Sport Vin Scully'
		});

	var infowindow = [];
	for(let i=0; i<2; i++) {
    	infowindow[i] = new google.maps.InfoWindow({
        	'content' : popupContent[i]
        });

        marker[i].addListener('click', function() {
        	infowindow[i].open(map, marker[i]);
        });
    }*/

}