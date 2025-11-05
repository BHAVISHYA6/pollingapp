module.exports = function(req, res, next) {
  // Check if user has admin group
  if (!req.user.groups || !req.user.groups.includes('Admins')) {
    return res.status(403).json({ msg: 'Access denied. Admin only.' });
  }
  next();
};