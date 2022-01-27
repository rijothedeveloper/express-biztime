const express = require("express");
const router = new express.Router();
const db = require("../db");
const ExpressError = require("../expressError");

const dbObj = new db("postgresql:///biztime");

router.get("/", async (req, res) => {
    const results = await dbObj.db.query(`SELECT * FROM invoices`);
    return res.json({
      invoices: results.rows,
    });
  });


  module.exports = router