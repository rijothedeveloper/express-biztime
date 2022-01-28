const express = require("express");
const router = new express.Router();
const db = require("../db");
const ExpressError = require("../expressError");

const dbObj = new db("postgresql:///biztime");

router.get("/", async (req, res) => {
  const results = await dbObj.db.query(`SELECT * FROM industry`);
  return res.json({
    companies: results.rows,
  });
});

module.exports = router