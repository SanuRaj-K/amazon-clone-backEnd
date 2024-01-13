const authToken = (req, res, next) => {
  const token = req.cookies;
  console.log(token);
  if (!token) {
    res.status(401).send("unauthorised");
  } else {
    next();
  }
};

module.exports = { authToken };
