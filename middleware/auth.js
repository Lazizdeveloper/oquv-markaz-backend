const adminOnly = (req, res, next) => {
  const adminId = req.headers['admin-id'];
  if (adminId !== process.env.ADMIN_ID) {
    return res.status(403).json({ error: 'Ruxsat etilmagan!' });
  }
  next();
};

module.exports = { adminOnly };