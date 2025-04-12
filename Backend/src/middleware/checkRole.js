export const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      res.status(200).json({ message: "Unauthorised User" });
    }

    next();
  };
};
