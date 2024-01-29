const jwt = require("jsonwebtoken");

module.exports = function generate(email,user ) {
  const payload = {
    id: email,
    email:user
  };
  const secretKey = process.env.JWT;
  const options = { expiresIn: "12h" };

  return jwt.sign(payload, secretKey, options);
};
   