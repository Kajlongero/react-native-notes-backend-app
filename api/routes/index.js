const { Router } = require('express');
const { fetchFiles } =  require('../functions/node.fetch.files');

const router = Router();

function runExpressApp(app) {
  app.use(router);
  fetchFiles(app, __dirname);
}

module.exports = runExpressApp;
