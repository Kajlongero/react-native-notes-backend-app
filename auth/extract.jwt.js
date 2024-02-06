const { ExtractJwt, Strategy } = require("passport-jwt");
const { ServerConfig } = require('../config');

const JwtExtractToken = new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ServerConfig.JWT_SECRET,
});

module.exports = JwtExtractToken;
