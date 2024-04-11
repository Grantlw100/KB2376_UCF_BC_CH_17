const jwt = require('jsonwebtoken');

const secret = process.env.SECRET_KEY;
const expiration = process.env.EXPIRATION;

module.exports = {
  authMiddleware: function ({ req }) {
    // Initialize token as null
    let token = null;

    // Safely try to extract the token from the Authorization header
    if (req && req.headers.authorization) {
      token = req.headers.authorization.split(' ').pop().trim();
    }

    // If there's no token, return null
    if (!token) {
      return null;
    }

    // Verify token and return user data
    try {
      const { data } = jwt.verify(token, secret, { expiresIn: expiration });
      return { user: data };
    } catch {
      console.log('Invalid token');
      return null;
    }
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
