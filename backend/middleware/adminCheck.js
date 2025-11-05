module.exports = function(req, res, next) {
  console.log('=== ADMIN CHECK ===');
  console.log('User groups:', req.user.groups);
  console.log('Is Admin:', req.user.groups?.includes('Admins'));
  
  if (!req.user.groups || !req.user.groups.includes('Admins')) {
    console.log('ERROR: Access denied - not admin');
    return res.status(403).json({ msg: 'Access denied. Admin only.' });
  }
  
  console.log('Admin check PASSED');
  next();
};