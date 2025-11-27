const express = require("express");
const bodyparser = require("body-parser");
const methodOverride = require("method-override");
const cors = require("cors");

const AuthRoutes = require("./routes/Auth");
const UserRoutes = require("./routes/User");
const VehicleRoutes = require("./routes/Vehicle");
const VehicleInspectionRoutes = require("./routes/VehicleInspection");
const QuoteRoutes = require("./routes/Quote");

const app = express();

app.use(cors());
app.use(bodyparser.json({ extended: true, limit: "100mb" }));
app.use(methodOverride());

const logErrors = (err, req, res, next) => {
  console.error(err.stack);
  next(err);
};

const clientErrorHandler = (err, req, res, next) => {
  if (req.xhr) {
    res.status(500).send({ error: "Something failed!" });
  } else {
    next(err);
  }
};

const errorHandler = (err, req, res, next) => {
  res.status(500);
  res.render("error", { error: err });
};

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

app.use("/auth", AuthRoutes);
app.use("/user", UserRoutes);
app.use("/vehicle", VehicleRoutes);
app.use("/vehicle-inspection", VehicleInspectionRoutes);
app.use("/quote", QuoteRoutes);


// If route not found
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Catch all other errors
app.use((err, req, res, next) => {
  res.status(err.status || 501);
  res.json({
    error: {
      code: err.status || 501,
      message: err.message,
    },
  });
});

module.exports = app;
