/** Database setup for BizTime. */
const { Client } = require("pg");

// let DB_URI;

// if (process.env.NODE_ENV === "test") {
//   DB_URI = "postgresql:///users_test";
// } else {
//   DB_URI = "postgresql:///users";
// }

// let db = new client({
//   connectionString: DB_URI,
// });

// db.connect();

// exports.module = db;



module.exports = class DB {
  constructor(DB_URI) {
    this.DB_URI = DB_URI;

    this.db = new Client({
      connectionString: this.DB_URI
    });
    this.db.connect();
  }
}

