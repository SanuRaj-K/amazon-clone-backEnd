const jwt = require("jsonwebtoken");

module.exports = function generate(user) {
  const payload = {
    id: user,
  };
  const secretKey = process.env.JWT;
  const options = { expiresIn: "12h" };

  return jwt.sign(payload, secretKey, options);
};
   