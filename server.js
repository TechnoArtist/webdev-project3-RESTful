


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
replace old project code with new project code
	'users' should be replaced with the sql database
	all four response handlers need to have their functions replaced

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

//GET codes: return list of codes:incident types
app.get('/codes', (req, res) => {
	res.type('json').send(users); 
}); 
//GET neighborhoods: return list of neighborhood ID:name
app.get('/neighborhoods', (req, res) => {
	res.type('json').send(users); 
}); 
//GET incidents: return list of incident ID:details (date, time, code, incident, police_grid, neighborhood_number, block)
app.get('/incidents', (req, res) => {
	res.type('json').send(users); 
}); 
//PUT new-incident: add new incident with case number and details (date, time, code, incident, police_grid, neighborhood_number, block)
app.put('/:new-incident', (req, res) => {
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

console.log('Listening for connections on port '+port+'. '); 
var server = app.listen(port); 