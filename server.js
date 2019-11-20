


/* NOTES
Issues: 

Outline: 
	GET /codes (return JSON/XML of codes:incident type)
		 ?code=[comma seperated list of codes], default = all codes
		 ?format=[json|xml], default = json
	GET /neighborhoods (return JSON/XML of neighborhood ID:name)
	GET /incidents (return JSON/XML of crime incidents ID:{date, time, code, incident, police_grid, neighborhood_number, block})
		 (defaults = all)
		 ?start_date=[yyyy-mm-dd]
		 ?end_date=[yyyy-mm-dd]
		 ?code=[comma separated list of codes to include]
		 ?grid=[comma separated list of police grids to include]
		 ?limit=[max number of incidents to display], default=10 000
		 ?format=[json|xml], default=json
	PUT /new-incident (upload or reject incident data: case_number, date, time, code, incident, police_grid, neighborhood_number, block)

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
	/incidents

*/

var path = require('path');
var express = require('express'); 
var bodyParser = require('body-parser'); 
var favicon = require('serve-favicon'); 
var sqlite3 = require('sqlite3'); 
var js2xml  = require("js2xmlparser");

var port = 8000; 
var public_dir = path.join(__dirname, 'public'); 
var db_filename = path.join(public_dir, 'stpaul_crime.sqlite3'); 

var app = express(); 
app.use(express.static(public_dir)); 
app.use(bodyParser.urlencoded({extended: true})); 
app.use(favicon(path.join(public_dir,'favicon.ico')));

var database = new sqlite3.Database(db_filename, sqlite3.OPEN_READWRITE, (err) => {
	if(err) {
		console.log("Error opening " + db_filename); 
	}
	else {
		console.log("Now connected to " + db_filename); 
	}
}); 

//print one row of the incidents table, for formatting reference
//database.get("select * from incidents", (err, data) => { console.log(data); }); 

//GET codes: return list of codes:incident types
app.get('/codes', (req, res) => {
	/* options
		?code=[comma seperated list of codes], default = all codes
		?format=[json|xml], default = json
	*/
	
	//create a result object
	var codes = {}; 
	//for each valid code in the database, add it to the result as the key for the matching value incident_type. 
	database.each("select * from CODES", (err, row) => {
		 codes["C" + row.code] = row.incident_type;
	}, () =>{
		if(req.query.format == "json"){
			res.type("json").send(codes);
		}
		else if(req.query.format == "xml"){
			var codesXML = js2xml.parse("server",codes);
			res.type("xml").send(codesXML);
		}
		else{
			res.type("json").send(codes);
		}
		//send the result. 
	}); 
	
	//set the res type to json or xml, as selected
	//TODO check the conditional
	
	
}); 
//GET neighborhoods: return list of neighborhood ID:name
app.get('/neighborhoods', (req, res) => {
	
	//create a result object
	var neighborhoods = {}; 
	
	//for each valid ID in the database, add it to the result as the key for the matching neighborhood name. 
	database.each("select * from neighborhoods", (err, row) => {
		neighborhoods["N" + row.neighborhood_number] = row.neighborhood_name; 
	}, () =>{
		if(req.query.format == "json"){
			res.type("json").send(neighborhoods);
		}
		else if(req.query.format == "xml"){
			var nieghborhoodsXML = js2xml.parse("server",neighborhoods);
			res.type("xml").send(nieghborhoodsXML);
		}
		else{
			res.type("json").send(neighborhoods);
		}
	}); 
	
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
	//for each detail, 
	//add the details to an object as values (with their names as keys)
	//add the new object to the result under the key of that ID. 
	//set the res type to json or xml, as selected
	database.each("SELECT * FROM incidents LIMIT 10", (err, row) => {
		var tempIncident = {};
		tempIncident.date = row.date_time.substring(0,10);
		tempIncident.time = row.date_time.substring(11);
		tempIncident.code = row.code;
		tempIncident.incident = row.incident;
		tempIncident.police_grid = row.police_grid;
		tempIncident.neighborhood_number = row.neighborhood_number;
		tempIncident.block = row.block;

		incidents["I" + row.case_number] = tempIncident;
		//console.log(incidents);
	}, () => {
		//send the result. 
		if(req.query.format == "json"){
			res.type("json").send(incidents);
		}
		else if(req.query.format == "xml"){
			var incidentsXML = js2xml.parse("server",incidents);
			res.type("xml").send(incidentsXML);
		}
		else{
			res.type("json").send(incidents);
		}
	});
}); 
//PUT new-incident: add new incident with case number and details (date, time, code, incident, police_grid, neighborhood_number, block)
app.put('/:new-incident', (req, res) => {
	var success = true; 
	var message = ""; 
	
	//create a new object with the input
	var new_incident = {
		case_number: req.body.case_number, 
		date_time: req.body.date + "T" + req.body.time, 
		code: parseInt(req.body.code.substring(1)), 
		incident: req.body.incident, 
		police_grid: parseInt(req.body.police_grid), 
		neighborhood_number: parseInt(req.body.neighborhood_number.substring(1)), 
		block: req.body.block 
	}; 
	
	//check the existing database to see if the ID already exists (if so, reject; else, continue)
	database.each("select case_number from incidents", (err, row) => {
		if(row[0] === new_incident.case_number) {
			success = false; 
			message = "Internal Server Error: user ID already exists"; 
		}
	}); 
	
	//add the new input to the database
	database.run("insert into incidents(case_number, date_time, code, incident, police_grid, neighborhood_number, block) values(?, ?, ?, ?, ?, ?, ?)", [new_incident.case_number, new_incident.date_time, new_incident.code, new_incident.incident, new_incident.police_grid, new_incident.neighborhood_number, new_incident.block], (err) => {
		if(err) {
			console.log("Failed to insert new incident. " + err.message); 
		} else {
			console.log("Row was added to the table: new_incident"); 
			console.log(new_incident); 
		}
	}); 
	
	//send a success message
	if(success) res.status(200).send(new_incident); 
	else res.status(500).send(message); 
}); 

"SELECT * from incidents WHERE CONVERT(DATETIME, date+'T00:00:00.000') < date_time"

console.log('Listening for connections on port '+port+'. '); 
var server = app.listen(port); 