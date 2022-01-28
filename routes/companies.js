const express = require("express");
const router = new express.Router();
const db = require("../db");
const ExpressError = require("../expressError");
const slugify = require('slugify')

const dbObj = new db("postgresql:///biztime");

router.get("/", async (req, res) => {
  const results = await dbObj.db.query(`SELECT * FROM companies`);
  return res.json({
    companies: results.rows,
  });
});

router.get("/:code", async (req, res, next) => {
  try {
    const code = req.params.code;
    const results = await dbObj.db.query(
      ` SELECT c.code, c.name, c.description, i.industry  FROM companies AS c 
      LEFT JOIN comp_industry AS ci 
      ON c.code = ci.comp_code LEFT JOIN industry AS i  
      on ci.industry_code = i.code  
      WHERE c.code = $1`,
      [code]
    );
    if (results.rowCount === 0) {
      throw new ExpressError("company code is not valid", 404);
    }
    let {newcode, name, description} = results.rows[0]
    let industries = results.rows.map(e => e.industry)
    const company = {
      code: newcode,
      name: name,
      description: description,
      industries: industries
    }
    return res.json({
      company: company
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    const code = slugify(name);
    const results = await dbObj.db.query(
      `INSERT INTO companies (code, name, description) 
    values ($1, $2, $3) 
    returning code, name, description`,
      [code, name, description]
    );
    if (results.rowCount === 0) {
      throw new ExpressError("company not added", 404);
    }
    return res.status(201).json({
      company: results.rows[0],
    });
  } catch (error) {
    return next(error);
  }
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
