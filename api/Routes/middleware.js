
import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
  const { token } = req.cookies;
  console.log(token);


  if (!token) {
    return res.status(401).json({ error: "You are not authenticated" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        // Handle expired token
        console.error('JWT Token Expired:', err.expiredAt);
        return res.status(401).json({ error: 'Token has expired' });
      } else {
        // Handle other JWT errors
        console.error('JWT Verification Error:', err);
        return res.status(401).json({ error: 'Token is not valid' });
      }
    }
  
    req.userId = decoded.userId;
    next();
  })
}
