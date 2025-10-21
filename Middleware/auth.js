const authMiddleware = (req, res, next) => {
  if (req.session && req.session.user) {
    // Set req.user for convenience
    req.user = req.session.user;
    return next();
  }
  
  // If not authenticated, redirect to login or return error
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    // API request - return JSON error
    return res.status(401).json({ 
      success: false, 
      message: "Authentication required" 
    });
  } else {
    // Page request - redirect to login
    return res.redirect('/login');
  }
};

module.exports = authMiddleware;