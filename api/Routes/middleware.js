
import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
      return res.json({ Error: "You are not authenticated" });
    } else {
      jwt.verify(token, "jwt-secret-key", (err, decoded) => {
        if (err) {
          return res.json({ Error: "Token is not ok" });
        } else {
          req.name = decoded.name;
          next();
          
        }
      });
    }
  };