const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const path = require("path");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

// Load Swagger JSON
const swaggerFilePath = path.join(__dirname, "swagger", "swagger.json");
const swaggerSpec = JSON.parse(fs.readFileSync(swaggerFilePath, "utf8"));

// Routes
const mailgunRoute = require("./routes/mailgun");
const indexRouter = require("./routes/index");
const donorsRouter = require("./routes/donors");
const adminsRouter = require("./routes/admins");
const entitiesRouter = require("./routes/entities");
const doacaoRouter = require("./routes/doacao");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");
const AuthapiRouter = require("../Backend/routes/api/login");
const donorApi = require("./routes/api/donor");
const adminApi = require("./routes/api/admin");
const entidadeApi = require("./routes/api/entidade");
const donationApi = require("./routes/api/donation");

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
const corsOptions = {
  origin: "http://localhost:4200", // replace with your frontend URL
  credentials: true, // allow cookies to be sent and received
  optionsSuccessStatus: 200,
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "PAW", // Change this to a secure secret key
    resave: false,
    saveUninitialized: false,
  })
);

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routes
app.use("/mail", mailgunRoute);
app.use("/", indexRouter);
app.use("/donors", donorsRouter);
app.use("/admins", adminsRouter);
app.use("/entities", entitiesRouter);
app.use("/doacao", doacaoRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/api", AuthapiRouter);
app.use("/api/donor", donorApi);
app.use("/api/admin", adminApi);
app.use("/api/entidade", entidadeApi);
app.use("/api/donations", donationApi);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

// Database connection
mongoose
  .connect(
    "mongodb+srv://Paw:Paw123@cluster0.yqvhug0.mongodb.net/PAW?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Conexão com o MongoDB estabelecida.");
  })
  .catch((erro) => {
    console.log("Erro ao conectar com o MongoDB:", erro);
  });
