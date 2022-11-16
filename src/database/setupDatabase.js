const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("database.db");

db.serialize(() => {
    db.run(`CREATE TABLE user (
        username TEXT PRIMARY KEY,
        password TEXT,
        email NOT NULL UNIQUE
    )`);

    const statement = db.prepare("INSERT INTO user VALUES (?, ?, ?)");
    statement.run(["anon", "password1", "anonymous@gmail.com"]);
    statement.finalize();
});

db.close();
