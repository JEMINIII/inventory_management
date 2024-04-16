import jwt from 'jsonwebtoken';

const verifyUser = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.status(401).json({ Error: "Token is not ok" });
      } else {
        req.name = decoded.name;
        // Log the decoded name for debugging
        console.log(req.name);
        next();
      }
    });
  }
};

export default verifyUser;
