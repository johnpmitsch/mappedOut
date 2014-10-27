//declaring arrays to store data
var latitude=[];
var longitude=[];
var pictures= [];
var contentstring= [];
var photo_content= [];
var infowindow= [];
var info= [];
var markers= [];
//store tag as a variable
var min='',
	url='',
	a=0;
	
var geocoder;
var map;
var tag;

//store client ID and api URL as an object
instagram = {
    clientID: '03dfcae06e944df4a0e54fad2c3abcab',
    apiHost: 'https://api.instagram.com'
};
	
function loadInstagrams() {
//get info from instagram AJAX
	$.ajax({
	type: "GET",
	dataType: "jsonp",
	cache: false,
	url: instagram.apiHost + "/v1/tags/" + tag + "/media/recent",
    data: {'client_id': instagram.clientID, 'max_tag_id': min,},
	success: function(photos) {
		min = photos.pagination.next_max_tag_id
		url = photos.pagination.next_url;
		//cycle through instagram photos
	    for(i=0;i<photos.data.length;i++){
            // check for location data
			if (photos.data[i].location!=null) {
			//save data from instagram as variables
				var pic = photos.data[i].images.thumbnail.url,
					largepic = photos.data[i].images.low_resolution.url,
					lat = photos.data[i].location.latitude,
					lon = photos.data[i].location.longitude,
					link = photos.data[i].link,
					text = photos.data[i].caption.text;
				//save variables to arrays
					latitude[a]=lat;
					longitude[a]=lon;
					photo_content[a] ="<a target='_blank' href='"+link+"'><img class='insta' src='"+largepic+"'></a><p class='caption'>'"+text+"'</p>",
					//add photo to div to be used for an info window
					contentstring[a]= '<div class="content">'+photo_content[a]+'</div>';
					a++;
			}
	  }
	}
	});
}

//initialize google maps
function initialize() {
	//declare map settings
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(41.8706, -72.8253);
	var mapOptions = {
		center: latlng,
		zoom: 3		
	}; 
	//show map
	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	
	for (i=0;i<500;i++) {
		//check for geolocation on instagram
		if(latitude[i]!=0) {		 
		//add markers to map
			var marker = new google.maps.Marker({
			position: new google.maps.LatLng(latitude[i],longitude[i]),
			map: map,
			identify: i,
			});
			markers.push(marker);
		//add info windows with data
		var infowindow = new google.maps.InfoWindow();
		google.maps.event.addListener(marker, 'click', (function(marker, i) {
			return function() {
				infowindow.setContent(contentstring[i]);
				infowindow.open(map, marker);
			}
		})(marker, i));
		} 
	}
}
function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
  markers = [];
 }

 function settag() {
	tag = document.getElementById('value').value;
	}
	
function go() {
		//setAllMap(null);
		settag();
		loadInstagrams();
		initialize();
		}
		



//load page
$(document).ready(function() {
	google.maps.event.addDomListener(window, 'load', initialize);
	settag();
	});