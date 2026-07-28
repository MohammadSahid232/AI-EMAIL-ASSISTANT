const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_key_ai_email_assistant_2026_production', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_ai_email_assistant_2026_production');
};

module.exports = { generateToken, verifyToken };
