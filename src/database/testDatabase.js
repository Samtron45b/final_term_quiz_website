const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("database.db");

db.serialize(() => {
    db.run("PRAGMA foreign_keys = ON");

	db.all("SELECT * FROM user", (err, rows) => console.log(rows));
	db.all("SELECT * FROM quiz", (err, rows) => console.log(rows));
	db.all("SELECT * FROM question", (err, rows) => console.log(rows));

	db.all(`SELECT * FROM question JOIN quiz ON question.quizId = quiz.id`, (err, rows) => console.log(rows));
});

db.close();