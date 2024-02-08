const passport = require("passport");
const JwtExtractToken = require("./extract.jwt");
const passportLocalStrategy = require("./local");

passport.use('local', passportLocalStrategy);
passport.use('jwt', JwtExtractToken);
