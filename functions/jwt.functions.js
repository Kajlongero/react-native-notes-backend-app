const { verify, sign } = require('jsonwebtoken');
const { ServerConfig } = require('../config')

const generateToken = (data) => {
  return sign({
    sub: data.sub,
    uid: data.uid,
    expiresIn: '30d', 
  }, ServerConfig.JWT_SECRET, { expiresIn: '30d' });
};

const decodeToken = (token) => {
  const decoded = verify(token, ServerConfig.JWT_SECRET);
  
  return decoded;
}

module.exports = {
  generateToken,
  decodeToken,
};