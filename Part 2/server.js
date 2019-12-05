/* St Paul Crimes UI webpage. 
Main page: 
    Search bar (locations by lat/lon, address, etc)
    Map 
        Scrolling is bounded to not leave St Paul
        Markers on the map show crime data on mouseover
    Table of crimes currently visible on map
    Link to about page 
About Page: 
    Short bio about each team member (including a photo)
    Description of the tools (frameworks, APIs, etc.) you used to create the application
    Video demo of the application (2 - 4 minutes) - include voiceover
        Can natively embed or upload to YouTube and embed
    Six interesting findings that you discovered using your application
    Link to map page
*/

//imports and global variables 
var path       = require('path');
var express    = require('express'); 
var bodyParser = require('body-parser'); 

var port        = 8000; 
var public_dir  = path.join(__dirname, 'public'); 

//create the server
var app = express(); 
app.use(express.static(public_dir)); 
app.use(bodyParser.urlencoded({extended: true})); 

//handle the main page
app.get("./index.html", (req, res) => {

}); 

//handle the about page
app.get("./about", (req, res) => {

}); 

//run the server
console.log('Listening for connections on port '+port+'. '); 
var server = app.listen(port); 