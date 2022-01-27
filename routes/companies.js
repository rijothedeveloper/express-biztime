const express = require("express");
const router = new express.Router();
const db = require("../db");
const ExpressError = require("../expressError");

const dbObj = new db("postgresql:///biztime");

router.get("/", async (req, res) => {
  const results = await dbObj.db.query(`SELECT * FROM companies`);
  return res.json({
    companies: results.rows,
  });
});

router.get("/:code", async (req, res) => {
  const code = req.params.code;
  const results = await dbObj.db.query(
    `SELECT * FROM companies where code=$1`,
    [code]
  );
  return res.json({
    company: results.rows,
  });
});

router.post("/", async (req, res) => {
  const { code, name, description } = req.body;
  const results = await dbObj.db.query(
    `INSERT INTO companies (code, name, description) 
    values ($1, $2, $3) 
    returning code, name, description`,
    [code, name, description]
  );
  return res.status(201).json({
    company: results.rows[0],
  });
});

router.put("/:code", async (req, res, next) => {
  try {
    const { code, name, description } = req.body;
    const oldCode = req.params.code;
    const results = await dbObj.db.query(
      `UPDATE companies SET code=$1, name=$2, description=$3
        where code = $4 
        returning code, name, description`,
      [code, name, description, oldCode]
    );
    if (results.rows.length === 0) {
      throw new ExpressError("company not found", 404);
    }
    return res.json({
      company: results.rows[0],
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:code", async (req, res, next) => {
    try{
        const code = req.params.code;
        const results = await dbObj.db.query(
            `DELETE FROM companies WHERE code = $1 returning code`, [code]
        );
        if (results.rowCount === 0) {
            throw new ExpressError("company not found", 404);
          }
        return res.json({message: "Deleted"})
    } catch (error) {
        next(error)
    }
})

module.exports = router;
