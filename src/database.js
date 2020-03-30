var mysql = require('mysql');

const dbConnection = mysql.createConnection({
	host     : '172.26.0.2',
	port     : '3306',
	user     : 'workland',
	password : 'workland',
	database : 'datta_tech'
});

dbConnection.connect(function(err) {
	if (err) {
	  return console.error('error: ' + err.message);
	}
	console.log('Connected to the MySQL server.');
  });

module.exports = dbConnection;