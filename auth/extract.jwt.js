const { ExtractJwt, Strategy } = require("passport-jwt");
const { ServerConfig } = require('../config');

const JwtExtractToken = new Strategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: ServerConfig.JWT_SECRET,
}, async (payload, done) => done(null, payload));

module.exports = JwtExtractToken;
