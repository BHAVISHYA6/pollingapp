const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Replace these with your actual values from AWS Cognito
const COGNITO_REGION = 'ap-south-1';  // Your region
const COGNITO_USER_POOL_ID = 'ap-south-1_yg1BWvige';  // Real pool ID
const COGNITO_APP_CLIENT_ID = '722ku1p6eaufa38794deael805';  // Real client ID

// JWKS client to get public keys from Cognito
const client = jwksClient({
  jwksUri: `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}/.well-known/jwks.json`
});

// Function to get signing key
function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    if (err) {
      callback(err);
    } else {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    }
  });
}

// Middleware to verify Cognito token
module.exports = function(req, res, next) {
  // Get token from header
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '') || req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    jwt.verify(token, getKey, {
      algorithms: ['RS256'],
      issuer: `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`,
      audience: COGNITO_APP_CLIENT_ID
    }, (err, decoded) => {
      if (err) {
        console.error('Token verification error:', err);
        return res.status(401).json({ msg: 'Token is not valid' });
      }

      // Add user info to request
      req.user = {
        id: decoded.sub,
        username: decoded['cognito:username'],
        email: decoded.email,
        groups: decoded['cognito:groups'] || []
      };
      
      next();
    });
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};