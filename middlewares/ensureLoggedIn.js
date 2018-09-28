const ensureLoggedIn = (redirectTo) => (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect(redirectTo||"/auth/login");
    }
  };

  const ensureLoggedOut = (redirectTo) => (req, res, next) => {
    if (!req.user) {
      next();
    } else {
      res.redirect(redirectTo||"/auth/login");
    }
  };

  module.exports = {ensureLoggedIn,ensureLoggedOut};