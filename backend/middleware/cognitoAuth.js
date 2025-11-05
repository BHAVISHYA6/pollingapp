const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const COGNITO_REGION = 'ap-south-1';
const COGNITO_USER_POOL_ID = 'ap-south-1_yg1BWvige';
const COGNITO_APP_CLIENT_ID = '722ku1p6eaufa38794deael805';

const client = jwksClient({
  jwksUri: `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}/.well-known/jwks.json`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    if (err) {
      console.error('Error getting signing key:', err);
      callback(err);
    } else {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    }
  });
}

module.exports = function(req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '') || req.header('x-auth-token');

  console.log('=== COGNITO AUTH ===');
  console.log('Token received:', token ? 'YES' : 'NO');

  if (!token) {
    console.log('ERROR: No token provided');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    jwt.verify(token, getKey, {
      algorithms: ['RS256'],
      issuer: `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`,
      audience: COGNITO_APP_CLIENT_ID
    }, (err, decoded) => {
      if (err) {
        console.error('Token verification FAILED:', err.message);
        return res.status(401).json({ msg: 'Token is not valid', error: err.message });
      }

      console.log('Token verified SUCCESS!');
      console.log('Username:', decoded['cognito:username']);
      console.log('Groups:', decoded['cognito:groups']);

      req.user = {
        id: decoded.sub,
        username: decoded['cognito:username'],
        email: decoded.email,
        groups: decoded['cognito:groups'] || []
      };
      
      console.log('=== END AUTH ===');
      next();
    });
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};