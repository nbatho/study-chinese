/**
 * Mock Authentication Middleware.
 * Validates request headers for authorization token.
 */
export const checkAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Access Denied: No Bearer Token Provided'
    });
  }

  const token = authHeader.split(' ')[1];

  // In a real application, you would verify the JWT here.
  // We'll just mock it and check if the token is "mock-token" or not empty.
  if (token === 'error-token') {
    return res.status(403).json({
      status: 'error',
      message: 'Access Forbidden: Invalid Token'
    });
  }

  // Set mock user information onto the request
  req.user = {
    id: 'user_123',
    role: 'student',
    username: 'chinese_learner'
  };

  next();
};
