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

    
TODO: 
    Change port to run with dean (check part 1, too)
    Tom: Add your image and bio 
        drop an image named "Tom.png" into the public folder
        replace "test test" in about.html
    Add demo video
    Fill out tool descriptions 
    Add interesting facts about St Paul crime
    Map: database searching
    Map: table of crimes
*/

//imports and global variables 
var fs         = require('fs'); 
var path       = require('path');
var express    = require('express'); 
var bodyParser = require('body-parser');
var cors       = require('cors'); 

var port        = 8000; 
var public_dir  = path.join(__dirname, 'public'); 

//create the server
var app = express(); 
app.use(express.static(public_dir)); 
app.use(bodyParser.urlencoded({extended: true})); 
app.use(cors);

//handle the main (map) page 
//Note: if there is an index.html in the public folder, that file will trigger without this function. 
app.get("/", (req, res) => {
    ReadFile(path.join(public_dir, 'map.html')).then((template) => {
        res.type('html').send(template.toString()); 

    }, (err) => {
        res.status(404).send("couldn't load the main (map) page. "+err); 

    }); 
}); 

//handle the about page
app.get("/about", (req, res) => {
    ReadFile(path.join(public_dir, 'about.html')).then((template) => {
        res.type('html').send(template.toString()); 

    }, (err) => {
        res.status(404).send("couldn't load the about page. "+err); 

    }); 
}); 

//read a file; for the purpose of sending html data to the client
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