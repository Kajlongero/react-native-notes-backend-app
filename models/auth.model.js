const joi = require('joi');

const email = joi.string().email();
const password = joi.string().min(8).max(32);
const username = joi.string().min(3).max(60);

const loginSchema = joi.object({
  email: email.required(),
  password: password.required(),
});

const signupSchema = joi.object({
  email: email.required(),
  password: password.required(),
  username: username.required(),
});

module.exports = {
  loginSchema,
  signupSchema,
};