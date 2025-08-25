const jwt = require("../lib/jwt.lib");
require("dotenv").config();
const createError = require("http-errors");

const auth = (req, res, next) => {
  try {
    const authorization = req.headers.authorization || "";
    
    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw createError(401, "Authorization header with Bearer token is required");
    }
    
    const token = authorization.replace("Bearer ", "");
    const isVerified = jwt.verify(token);
    
    if (!isVerified || !isVerified.id) {
      throw createError(401, "Invalid or expired token");
    }
    
    // Add user info to request for use in route handlers
    req.user = isVerified;
    
    next();
  } catch (error) {
    res.status(401);
    res.json({
      success: false,
      message: error.message || "Authentication failed",
    });
  }
};

// Optional authentication middleware - allows endpoints to work with or without JWT
const optionalAuth = (req, res, next) => {
  try {
    const authorization = req.headers.authorization || "";
    
    if (authorization && authorization.startsWith("Bearer ")) {
      const token = authorization.replace("Bearer ", "");
      const isVerified = jwt.verify(token);
      
      if (isVerified && isVerified.id) {
        req.user = isVerified;
        req.isAuthenticated = true;
      }
    }
    
    req.isAuthenticated = req.isAuthenticated || false;
    next();
  } catch (error) {
    // If JWT is invalid, continue without authentication
    req.isAuthenticated = false;
    next();
  }
};

module.exports = { auth, optionalAuth };