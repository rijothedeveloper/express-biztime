/** Database setup for BizTime. */
const { client } = require("pg");

let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = "postgresql:///users_test";
} else {
  DB_URI = "postgresql:///users";
}

let db = new client({
  connectionString: DB_URI,
});

db.connect();

exports.module = db;
