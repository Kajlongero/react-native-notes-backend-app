const { Router } = require("express");

const authRoute = Router();

authRoute.post('/login', async (req, res, next) => {
});

authRoute.post('/signup', async (req, res, next) => {

});

authRoute.delete('/delete-profile', async (req, res, next) => {
  
});

module.exports = authRoute;