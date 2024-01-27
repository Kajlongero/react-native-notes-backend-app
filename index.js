/* Modelo Transaccional */
const express = require('express');
const cors = require('cors');
const runExpressApp = require('./routes/index.js');
const { ServerConfig } = require('./config/index.js');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

runExpressApp(app);

app.listen(parseInt(ServerConfig.EXPRESS_PORT), () => {
  console.log('App Running');
})