const { verify, sign } = require('jsonwebtoken');
const { ServerConfig } = require('../config')

const generateToken = (data) => {
  return sign({
    sub: data.authId,
    uid: data.userId,
    expiresIn: '30d', 
  })
};

const decodeToken = (token) => {
  const decoded = verify(token, ServerConfig.JWT_SECRET);
  
  return decoded;
}

module.exports = {
  generateToken,
  decodeToken,
};