const jwt = require("jsonwebtoken");

module.exports = {
  checkUserRole
}
// Middleware to check user roles using JWT token
function checkUserRole(req, res, next) {

    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - Missing or invalid token' });
    }

    const token = authorizationHeader.split(' ')[1];
    // Verify the token
    jwt.verify(token, 'your_secret_key', (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
      }
      // Check if the user has the required role
      if (decoded && decoded.role === 'admin') {
        next(); // User has the required role, proceed to the next middleware/route
      } else {
        res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
      }
    });
  
};