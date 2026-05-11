function requireCreator(req, res, next) {
  if (!req.user.isCreator) {
    return res.status(403).json({
      message: "Creator access required",
    });
  }

  next();
}

module.exports = {
  requireCreator,
};