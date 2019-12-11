var app;
var map;
var nwCorner;
var seCorner;
var bounds;


function Init(){
    //Vue stuff
    app = new Vue({
        el: "#app",
        data: {
            searchInput: "",
            searchType: ''
        }
    });
    //mapstuff
    nwCorner = L.latLng(44.988164, -93.207677);
    seCorner = L.latLng(44.890712, -93.004602);
    bounds   = L.latLngBounds(nwCorner, seCorner);
    map      = L.map('map',{
        center: [44.949642, -93.093124],
        zoom: 12,
        maxZoom:18,
        minZoom:11,
        maxBounds: bounds

    });
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',{}).addTo(map);
    L.marker([44.949642, -93.093124],{title: 'Saint Paul'}).addTo(map);


}
function findAdress(){
      // search if the search type is an address
    if(app.searchType == 'Address'){
        getJSON('https://nominatim.openstreetmap.org/search?q=' + app.searchInput + '&format=json',function(err, data) {
            var lat = data[0].lat;
            var lon = data[0].lon;
            console.log(data);

            //checks if address is inside st paul
            if(data[0].display_name.includes('Saint Paul')){
                map.panTo(new L.LatLng(lat, lon));
                var searchResult = L.marker([lat, lon],{title: app.searchInput}).addTo(map);
            }
            else{
                alert("Your search is outside St. Paul")
            }

        });
    }
    else if(app.searchType == 'Latitude and Longitude'){
        var coordinates = [];
        coordinates = app.searchInput.split(',');
        map.panTo(new L.LatLng(coordinates[0], coordinates[1]));
        L.marker([coordinates[0], coordinates[1]], {title : app.searchInput}).addTo(map);
    }
    else{
        alert('Please pick a search type for you search to work. Thank you!');
    }
  
}

var getJSON = function(url, callback) {
//function to get the json object from the api
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};