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
var fs         = require('fs'); 
var path       = require('path');
var express    = require('express'); 
var bodyParser = require('body-parser'); 

var port        = 8000; 
var public_dir  = path.join(__dirname, 'public'); 

//create the server
var app = express(); 
app.use(express.static(public_dir)); 
app.use(bodyParser.urlencoded({extended: true})); 

//handle the main (map) page 
app.get("/", (req, res) => {
    console.log("attempting to get the main page")

    ReadFile(path.join(public_dir, 'map.html')).then((template) => {
        //The Map. 
        //location search bar
        //filter options? 
        //table of currently visible locations
        //to add something to the html: make an html comment, then template.replace(comment, new info). 
        res.type('html').send(template.toString()); 

    }, (err) => {
        res.status(404).send("couldn't load the main (map) page. "+err); 

    }); 
}); 

//handle the about page
app.get("/about", (req, res) => {
    console.log("attempting to get the about page"); 
    
    ReadFile(path.join(public_dir, 'about.html')).then((template) => {
        //the main info is already in the html
        res.type('html').send(template.toString()); 

    }, (err) => {
        res.status(404).send("couldn't load the about page. "+err); 

    }); 
}); 


function ReadFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data.toString());
            }
        });
    });
}


//run the server
console.log('Listening for connections on port '+port+'. '); 
var server = app.listen(port); 