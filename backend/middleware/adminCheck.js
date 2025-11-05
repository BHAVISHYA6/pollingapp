module.exports = function(req, res, next) {
  if (!req.user.groups || !req.user.groups.includes('Admins')) {
    return res.status(403).json({ msg: 'Access denied. Admin only.' });
  }
  next();
};