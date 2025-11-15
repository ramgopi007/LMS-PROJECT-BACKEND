const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    // Get token (from cookie or Authorization header)
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send({ message: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_jwt_secret_key"
    );

    // Attach decoded data to request (userId, email, role)
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid or expired token." });
  }
};

module.exports = {authenticate};
