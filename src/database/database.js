import sqlite from "sqlite3";

const db = new sqlite.Database("database.db");

export function getData(table, columns, valuesToGet) {
	return query(db.get, queryString(table, columns, valuesToGet));
}

export function getAllData(table, columns, valuesToGet) {
	return query(db.all, queryString(table, columns, valuesToGet));
}

export function queryString(table, columns, valuesToGet) {
	let string = `SELECT * FROM ${table} WHERE ${columns[0]} = '${valuesToGet[0]}'`;
	
	for (let i = 1; i < columns.length; ++i) {
		string += ` AND ${columns[i]} == '${valuesToGet[i]}'`;
	}

	return string;
}

export function query(queryFunction, query) {
	return new Promise((resolve, reject) => {
		queryFunction(query, (err, rows) => {
			if (err) {
				reject(err);
			}
			else {
				resolve(rows);
			}
		});
	})
}

export default db;