const passport = require("passport");
const JwtExtractToken = require("./extract.jwt");

passport.use(JwtExtractToken);
