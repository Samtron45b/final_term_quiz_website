const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

db.run("PRAGMA foreign_keys = ON", (err, row) => {
	if (err) {
		console.log(err);
	}
	else {
		console.log(row);
	}

	db.get("PRAGMA foreign_keys;", (err, row) => {
		console.log(row.foreign_keys == true);
		db.close();	
	});
});