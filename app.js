/** BizTime express application. */

const express = require("express")
const companyRouter = require("./routes/companies");
const invoiceRouter = require("./routes/invoices");
const industryRouter = require("./routes/industry");

const app = express();
const ExpressError = require("./expressError")

app.use(express.json());

app.use("/companies", companyRouter)
app.use("/invoices", invoiceRouter)
app.use("/industries", industryRouter)
/** 404 handler */

app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err.status,
    message: err.message
  });
});


module.exports = app;
