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

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const results = await dbObj.db.query(
      `SELECT * FROM invoices where id = $1`,
      [id]
    );
    if (results.rowCount === 0) {
      throw new ExpressError("id is not valid", 404);
    }
    return res.json({
      invoice: results.rows,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res) => {
  const { comp_code, amt } = req.body;
  const results = await dbObj.db.query(
    `INSERT INTO invoices (comp_code, amt) 
    values ($1, $2) 
    returning id, comp_code, amt, paid, add_date, paid_date`,
    [comp_code, amt]
  );
  return res.status(201).json({
    invoice: results.rows[0],
  });
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { amt } = req.body;
    const results = await dbObj.db.query(
    `UPDATE invoices SET amt=$1 
    where id = $2 
    returning id, comp_code, amt, paid, add_date, paid_date`,
    [amt, id]
    );
    if (results.rowCount === 0) {
      throw new ExpressError("id is not valid", 404);
    }
    return res.status(201).json({
      invoice: results.rows[0],
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try{
      const id = req.params.id;
      const results = await dbObj.db.query(
          `DELETE FROM invoices WHERE id = $1 returning id`, [id]
      );
      if (results.rowCount === 0) {
          throw new ExpressError("invoice not found", 404);
        }
      return res.json({message: "Deleted"})
  } catch (error) {
      next(error)
  }
})

router.get("/companies/:code", async (req, res, next) => {
  try {
        const code = req.params.code
        const companyres = await dbObj.db.query(
          `select * from companies where code = $1`, [code]
        )
        if(companyres.rowCount===0){
          throw new ExpressError("company code not valid", 404)
        }
        const company = companyres.rows[0]
        const invoiceArrayres = await dbObj.db.query(
          `select id from invoices where comp_code = '${company.code}'`
        )
        const invoiceArray = invoiceArrayres.rows
        return res.json({
          company: {company, invoices: invoiceArray}
        })
  } catch (err) {
    next(err)
  }
})

module.exports = router;
