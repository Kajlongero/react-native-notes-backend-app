const { compare } = require("bcrypt");
const { Strategy } = require("passport-local");
const { unauthorized } = require("@hapi/boom");
const { generateToken } = require("../functions/jwt.functions");
const AuthService = require("../services/auth.service");
const service = new AuthService();

const passportLocalStrategy = new Strategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      const user = await service.getByEmail(email);
      if (!user) throw unauthorized("invalid credentials");

      const comparedPassword = await compare(password, user.auth.password);
      if (!comparedPassword) throw unauthorized("invalid credentials");

      const opts = { sub: user.auth.id, uid: user.id };

      done(null, generateToken(opts));
    } catch (e) {
      done(e, null);
    }
  }
);

module.exports = passportLocalStrategy;
