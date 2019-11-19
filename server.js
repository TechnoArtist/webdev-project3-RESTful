


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

Database outline: 
    Codes:
        code (INTEGER) - crime incident type numeric code
        incident_type (TEXT) - crime incident type description
    Neighborhoods:
        neighborhood_number (INTEGER) - neighborhood id
        neighborhood_name (TEXT) - neighborhood name
    Incidents:
        case_number (TEXT): unique id from crime case
        date_time (DATETIME): date and time when incident took place
        code (INTEGER): crime incident type numeric code
        incident (TEXT): crime incident description (more specific than incident_type)
        police_grid (INTEGER): police grid number where incident occurred
        neighborhood_number (INTEGER): neighborhood id where incident occurred
        block (TEXT): approximate address where incident occurred

TODO: 
replace old project code with new project code
	all four response handlers need to have their functions replaced
Should the 'sqlite3.OPEN_READONLY' be changed when setting the database variable? 
Check the conditional in /codes for matching codes
Check if more of the details in /new-incident need to be parsed

*/

var path = require('path');
var express = require('express'); 
var bodyParser = require('body-parser'); 
var favicon = require('serve-favicon'); 
var sqlite3 = require('sqlite3'); 

var port = 8000; 
var public_dir = path.join(__dirname, 'public'); 
var db_filename = path.join(public_dir, 'stpaul_crime.sqlite3'); 

var app = express(); 
app.use(express.static(public_dir)); 
app.use(bodyParser.urlencoded({extended: true})); 
app.use(favicon(path.join(public_dir,'favicon.ico')));

var database = new sqlite3.Database(db_filename, sqlite3.OPEN_READONLY, (err) => {
	if(err) {
		console.log("Error opening " + db_filename); 
	}
	else {
		console.log("Now connected to " + db_filename); 
	}
}); 

//GET codes: return list of codes:incident types
app.get('/codes', (req, res) => {
	/* options
		?code=[comma seperated list of codes], default = all codes
		?format=[json|xml], default = json
	*/
	
	//create a result object
	var codes = {}; 
	
	//for each valid code in the database, add it to the result as the key for the matching value incident_type. 
	database.each("select * from codes", (err, row) => {
		//TODO check the conditional: should mean if the 'code' input contains this code...
		if(typeOf(res.head.code) !== undefined && res.head.code[row[0]] !== undefined) codes[row[0]] = row[1]; 
	}); 
	
	//set the res type to json or xml, as selected
	//TODO check the conditional
	if(res.head.code !== undefined) res.type(res.head.code); 
	else res.type('json'); 
	
	//send the result. 
	res.send(codes); 
	
}); 
//GET neighborhoods: return list of neighborhood ID:name
app.get('/neighborhoods', (req, res) => {
	
	//create a result object
	var neighborhoods = {}; 
	
	//for each valid ID in the database, add it to the result as the key for the matching neighborhood name. 
	database.each("select * from neighborhoods", (err, row) => {
		neighborhoods[row[0]] = row[1]; 
	}); 
	
	//send the result. 
	res.type('json').send(neighborhoods); 
	
}); 
//GET incidents: return list of incident ID:details (date, time, code, incident, police_grid, neighborhood_number, block)
app.get('/incidents', (req, res) => {
	/* options (defaults = show all)
		 ?start_date=[yyyy-mm-dd]
		 ?end_date=[yyyy-mm-dd]
		 ?code=[comma separated list of codes to include]
		 ?grid=[comma separated list of police grids to include]
		 ?limit=[max number of incidents to display], default=10 000
		 ?format=[json|xml], default=json
	*/
	
	//create a result object
	var incidents = {}; 
	
	//for each valid ID in the database (between dates, matching code/grid, until max...), 
	
	//	for each detail, 
	
	//		add the details to an object as values (with their names as keys)
	
	//	add the new object to the result under the key of that ID. 
	
	//set the res type to json or xml, as selected
	
	//send the result. 
	res.send(incidents); 
	
}); 
//PUT new-incident: add new incident with case number and details (date, time, code, incident, police_grid, neighborhood_number, block)
app.put('/:new-incident', (req, res) => {
	var success = true; 
	
	//create a new object with the input
	var new_incident = {
		//TODO check if more of these need to be parsed
		case_number: req.body.case_number; //text ('I' + integer), leave as text
		date: req.body.date, //datetime (date and time are combined in database), leave as string
		time: req.body.time, //datetime (date and time are combined in database), leave as string
		code: req.body.code, //'C' + integer, convert to int
		incident: req.body.incident, //text, leave as text
		police_grid: req.body.police_grid, //integer, parse to int
		neighborhood_number: req.body.neighborhood_number, //'N' + integer, convert to int
		block: req.body.block //text, leave as text
	}; 
	
	//check the existing database to see if the ID already exists (if so, reject; else, continue)
	database.each("select case_number from incidents", (err, row) => {
		if(row[0] === new_incident[case_number]) {
			success = false; 
			res.status(500).send("Internal Server Error: user ID already exists"); 
		}
	}); 
	
	//add the new input to the database
	
	
	
	
	//send a success message
	if(success) res.status(200).send(new_incident); 
	
	//this is code from a different project, only here to help remember syntax
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
	//end of previous project code
}); 

console.log('Listening for connections on port '+port+'. '); 
var server = app.listen(port); 