const fs = require('fs');
const path = require('path');

const fetchFiles = (app, route = '/routes') => {
  const getFileNames = fs.readdirSync(route);

  getFileNames.forEach((filename) => {
    const splitedTextName = filename.split(".");
    const requireFile = require(`${route}/${filename}`);

    app.use(`/${splitedTextName[0].toLowerCase()}`, requireFile);
  })
}

module.exports = { fetchFiles };