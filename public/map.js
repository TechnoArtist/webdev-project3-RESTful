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
            searchInput: '',
            searchType: '',
            incidents: '', 
            neighborhoods: '', 
            codetypes: '', 
            currentLocation: '',
            popUpMarkers: '',
            computed: {
                visible: function() {
                    
                }
            }
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
    map.on('moveend', function(ev){
        updateLocation();
    });


    getIncidents();
    getNeighborhoodNames();
    getCodeTypes(); 
}
function findAddress(){
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
    //search if the input is a coordinate
    else if(app.searchType == 'Latitude and Longitude'){
        var coordinates = [];
        coordinates = app.searchInput.split(',');
        map.panTo(new L.LatLng(coordinates[0], coordinates[1]));
        L.marker([coordinates[0], coordinates[1]], {title : app.searchInput}).addTo(map);
    }
    else{
        alert('Please pick a search type for your search to work. Thank you!');
    }
   
}
function showMarkerButton(incident, date, time, type, block) {
    block.replace('X', '1');
    getJSON('https://nominatim.openstreetmap.org/search?q=' + block + " Saint Paul " + '&format=json',function(err, data) {
        L.marker([data[0].lat, data[0].lon], {title: 'Incident: ' + incident + '\nDate: ' + date + '\nTime: ' + time + '\nIncident Type: ' + type}).addTo(map);
    });
}
function updateLocation(){
    //If searching by address, just send the map's center coordinates. 
    if(app.searchType == 'Latitude and Longitude'){
        app.currentLocation = map.getCenter();
    }
    //If searching by address, convert the map's center coordinates to a set of addresses, and send that. 
    else{
        getJSON('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + map.getCenter().lat + '&lon=' + map.getCenter().lng, function(err,data){
            app.currentLocation = Object.values(data.address);
        });
    }
    
    //loop through each neighborhood...
    for(let i = 0; i < 17; i++){
        //if it's inside the visible map, set it to 'visible'. 
        if(map.getBounds().contains(neighborhoods.neighborhood[i].LatLng)){
            neighborhoods.neighborhood[i].visible = true;
        } //else, not visible. 
        else{
            neighborhoods.neighborhood[i].visible = false;
        }
    }//for
    
    //retrieve the list of incidents from our restful crime server, and... 
    getJSON('http://cisc-dean.stthomas.edu:8042/incidents?start_date=2019-10-01&end_date=2019-10-31', function(err,data){
        for(key in data){
            if(data.hasOwnProperty(key)){//??
                if(neighborhoods.neighborhood[data[key].neighborhood_number-1].visible == false){
                    //for each row in the incidents table, if it's not currently visible, delete it from the temporary list of incidents. 
                    delete data[key];
                    console.log('deleted');
                }//if
            }//if
        }//for
        
        //Save the temporary list of incidents (the list from the st paul crime api, minus everything except what is also visible in the neighborhoods set). 
        app.incidents = data;
   });//callback
}
"Summit/University"
var neighborhoods = { neighborhood :[
    {"name" : "Conway/Battlecreek/Highwood", "number" : 1,  "crimeCount" : 0, "visible" : true, "LatLng" : new L.LatLng(44.945212, -93.028334)},
    {"name" : "Greater East Side",           "number" : 2,  "crimeCount" : 0, "visible" : true, "LatLng" : new L.LatLng(44.977230, -93.024469)},
    {"name" : "West Side",                   "number" : 3,  "crimeCount" : 0, "visible" : true, "LatLng" : new L.LatLng(44.930275, -93.091862)},
    {"name" : "Dayton's Bluff",              "number" : 4,  "crimeCount" : 0, "visible" : true, "LatLng" : new L.LatLng(44.977515, -93.065958)},
    {"name" : "Payne/Phalen",                "number" : 5,  "crimeCount" : 0, "visible" : true, "LatLng" : new L.LatLng(44.977506, -93.065955)},
    {"name" : "North End",                   "number" : 6,  "crimeCount" : 0, "visible" : true, "LatLng" : new L.LatLng(44.977382, -93.105931)},
    {"name" : "Thomas/Dale(Frogtown)",       "number" : 7,  "crimeCount" : 0, "visible" : true, "LatLng" : new L.LatLng(44.948847, -93.126256)},
    {"name" : "Summit/University",           "number" : 8,  "crimeCount" : 0, "visible" : true, "LatLng" : new L.LatLng(44.959419, -93.126310)},
    {"name" : "West Seventh",                "number" : 9,  "crimeCount" : 0, "visible" : true, "LatLng" : new L.LatLng(44.927528, -93.127019)},
    {"name" : "Como",                        "number" : 10, "crimeCount" : 0, "visible" : true, "LatLng" : new L.LatLng(44.982252, -93.148269)},
    {"name" : "Hamline/Midway",              "number" : 11, "crimeCount" : 0, "visible" : true, "LatLng" : new L.LatLng(44.962871, -93.167019)},
    {"name" : "St. Anthony",                 "number" : 12, "crimeCount" : 0, "visible" : true, "LatLng" : new L.LatLng(44.969933, -93.197514)},
    {"name" : "Union Park",                  "number" : 13, "crimeCount" : 0, "visible" : true, "LatLng" : new L.LatLng(44.948404, -93.174634)},
    {"name" : "Macalester-Groveland",        "number" : 14, "crimeCount" : 0, "visible" : true, "LatLng" : new L.LatLng(44.933938, -93.173002)},
    {"name" : "Highland",                    "number" : 15, "crimeCount" : 0, "visible" : true, "LatLng" : new L.LatLng(44.915371, -93.172227)},
    {"name" : "Summit Hill",                 "number" : 16, "crimeCount" : 0, "visible" : true, "LatLng" : new L.LatLng(44.937250, -93.135795)},
    {"name" : "Capitol River",               "number" : 17, "crimeCount" : 0, "visible" : true, "LatLng" : new L.LatLng(44.949858, -93.095771)}
]    
};
function getIncidents(){
    getJSON('http://cisc-dean.stthomas.edu:8042/incidents?start_date=2019-10-01&end_date=2019-10-31', function(err,data){
        app.incidents = data;
        for(key in data){
            if(data.hasOwnProperty(key)){
                for(let i = 0; i < 17; i++){
                    if((data[key].neighborhood_number) == i+1){
                        neighborhoods.neighborhood[i].crimeCount += 1;
                    }//if
                }//for   
            }//if
        }//for
        loadNeigborhoodMarkers();
   });//callback

}//function
function loadNeigborhoodMarkers(){
    for(let i = 0; i < 17; i++){
        L.marker(neighborhoods.neighborhood[i].LatLng,{title:neighborhoods.neighborhood[i].name + ' : ' + neighborhoods.neighborhood[i].crimeCount}).addTo(map);
    }
}

function getNeighborhoodNames(){
    getJSON('http://cisc-dean.stthomas.edu:8042/neighborhoods', function(err, data) {
        app.neighborhoods = data; 
    }); 
}
function getCodeTypes(){
    getJSON('http://cisc-dean.stthomas.edu:8042/codes', function(err, data) {
        app.codetypes = data; 
    }); 
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