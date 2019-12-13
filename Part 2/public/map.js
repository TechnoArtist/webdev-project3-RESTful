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
            searchType: '',
            incidents: '', 
            neighborhoods: '', 
            codetypes: '', 
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
var neighborhoods = { neighborhood :[
    {"name" : "Conway/Battlecreek/Highwood", "number" : 1,  "crimeCount" : 0, "visible" : false, "LatLng" : new L.LatLng(44.945212, -93.028334)},
    {"name" : "Greater East Side",           "number" : 2,  "crimeCount" : 0, "visible" : false, "LatLng" : new L.LatLng(44.977230, -93.024469)},
    {"name" : "West Side",                   "number" : 3,  "crimeCount" : 0, "visible" : false, "LatLng" : new L.LatLng(44.930275, -93.091862)},
    {"name" : "Dayton's Bluff",              "number" : 4,  "crimeCount" : 0, "visible" : false, "LatLng" : new L.LatLng(44.977515, -93.065958)},
    {"name" : "Payne/Phalen",                "number" : 5,  "crimeCount" : 0, "visible" : false, "LatLng" : new L.LatLng(44.977506, -93.065955)},
    {"name" : "North End",                   "number" : 6,  "crimeCount" : 0, "visible" : false, "LatLng" : new L.LatLng(44.977382, -93.105931)},
    {"name" : "Summit/University",           "number" : 7,  "crimeCount" : 0, "visible" : false, "LatLng" : new L.LatLng(44.948847, -93.126256)},
    {"name" : "Thomas/Dale(Frogtown)",       "number" : 8,  "crimeCount" : 0, "visible" : false, "LatLng" : new L.LatLng(44.959419, -93.126310)},
    {"name" : "West Seventh",                "number" : 9,  "crimeCount" : 0, "visible" : false, "LatLng" : new L.LatLng(44.927528, -93.127019)},
    {"name" : "Como",                        "number" : 10, "crimeCount" : 0, "visible" : false, "LatLng" : new L.LatLng(44.982252, -93.148269)},
    {"name" : "Hamline/Midway",              "number" : 11, "crimeCount" : 0, "visible" : false, "LatLng" : new L.LatLng(44.962871, -93.167019)},
    {"name" : "St. Anthony",                 "number" : 12, "crimeCount" : 0, "visible" : false, "LatLng" : new L.LatLng(44.969933, -93.197514)},
    {"name" : "Union Park",                  "number" : 13, "crimeCount" : 0, "visible" : false, "LatLng" : new L.LatLng(44.948404, -93.174634)},
    {"name" : "Macalester-Groveland",        "number" : 14, "crimeCount" : 0, "visible" : false, "LatLng" : new L.LatLng(44.933938, -93.173002)},
    {"name" : "Highland",                    "number" : 15, "crimeCount" : 0, "visible" : false, "LatLng" : new L.LatLng(44.915371, -93.172227)},
    {"name" : "Summit Hill",                 "number" : 16, "crimeCount" : 0, "visible" : false, "LatLng" : new L.LatLng(44.937250, -93.135795)},
    {"name" : "Capitol River",               "number" : 17, "crimeCount" : 0, "visible" : false, "LatLng" : new L.LatLng(44.949858, -93.095771)}
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
        //console.log(neighborhoods.neighborhood[i].crimeCount);
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