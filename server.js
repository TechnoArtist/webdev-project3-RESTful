


/* NOTES
Issues: 

Outline: 
	GET /codes (return JSON/XML of codes:incident type)
	GET /neighborhoods (return JSON/XML of neighborhood ID:name)
	GET /incidents (return JSON/XML of crime incidents ID:{date, time, code, incident, police_grid, neighborhood_number, block})
	PUT /new-incident (upload or reject incident data: case_number, date, time, code, incident, police_grid, neighborhood_number, block)

Extra features: 
	GET /codes 
		 ?code=[comma seperated list of codes], default = all codes
		 ?format=[json|xml], default = json
	GET /incidents, defaults = all
		 ?start_date=[yyyy-mm-dd]
		 ?end_date=[yyyy-mm-dd]
		 ?code=[comma separated list of codes to include]
		 ?grid=[comma separated list of police grids to include]
		 ?limit=[max number of incidents to display], default=10 000
		 ?format=[json|xml], default=json

TODO: 

*/

var fs = require('fs');
var path = require('path');
var express = require('express'); 
var bodyParser = require('body-parser'); 
var favicon = require('serve-favicon'); 

var port = 8000; 
var public_dir = path.join(__dirname, 'public'); 
var user_file = path.join(public_dir, 'users.json'); 

var app = express(); 
app.use(express.static(public_dir)); 
app.use(bodyParser.urlencoded({extended: true})); 
app.use(favicon(path.join(public_dir,'favicon.ico')));

users = {}; 
fs.readFile(user_file, (err, data) => {
	if (err) {
		users = {users: []}; 
	}
	else {
		users = JSON.parse(data); 
	}
}); 

//GET: retrieve list of all users
app.get('/:list-users', (req, res) => {
	res.type('json').send(users); 
}); 
//PUT: insert new user in object
app.put('/:add-user', (req, res) => {
	var new_user = {
		id: parseInt(req.body.id, 10), 
		name: req.body.name, 
	}
	var has_id = false; 
	for( let i = 0; i < users.users.length; i++) {
		if(users.users[i].id === new_user.id) has_id = true; 
	}
	if(has_id) {
		res.status(500).send('Internal Server Error: user id already exists'); 
	}
	else {
		users.users.push(new_user); 
		fs.writeFile(user_file, JSON.stringify(users, null, 4), (err) => {
			res.status(200).send(new_user); 
		}); 
	}
}); 
//DELETE: remove user from object
app.delete('/:remove-user', (req, res) => {
	//does the user exist? 
	var success = false; 
	//loop through each user, compare to req.body.id
	for(var i = 0; i < users.users.length; i++) {
		//if a user has that ID, remove the ID
		if(users.users[i].id === parseInt(req.body.id, 10)) {
			delete users.users[i]; // This will remove the object that has a matching ID
			res.status(200).send(users); 
			success = true; 
		}
	}
	//if no users have that ID, send error status 500
	if(!success) res.status(500).send("Could not find a user with ID "+req.body.id+" to delete. "); 
}); 
//POST: update name/email of user
app.post('/:update-user', (req, res) => {
	//TODO posting
}); 

console.log('Listening for connections on port '+port+'. '); 
var server = app.listen(port); 