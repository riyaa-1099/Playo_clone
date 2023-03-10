const jwt = require("jsonwebtoken");
const secretKey = process.env.secretKey;

function tokencreate(res, userId) {
  let token = jwt.sign({ userId }, process.env.secretKey, { expiresIn: "1h" });

  return { token };
}

module.exports = { tokencreate };
