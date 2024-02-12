const express = require("express");
const cors = require("cors");
const runExpressApp = require("./routes/index.js");
const { ServerConfig } = require("./config/index.js");
const {
  LogErrors,
  BoomErrorHandler,
  InternalServerHandler,
} = require("./middlewares/errors.handler.js");

const app = express();

require("./auth/index.js");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

runExpressApp(app);

app.use(LogErrors);
app.use(BoomErrorHandler);
app.use(InternalServerHandler);

app.listen(parseInt(ServerConfig.EXPRESS_PORT), () => {
  console.log("App Running");
});
