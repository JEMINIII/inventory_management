import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import db from "../db.js";

export const register = (req, res) => {
    // Registration logic
    const q = "INSERT INTO user (`name`,`email`,`password`) VALUES (?)";
  
    // Check if req.body.password is defined and is a string
    if (typeof req.body.password !== "undefined" && typeof req.body.password === "string") {
      const myPlaintextPassword = req.body.password;
      const salt = 10;
      const hash = bcrypt.hash(
        myPlaintextPassword.toString(),
        salt,
        (err, hash) => {
          if (err) {
            return res.json({ Error: "Error for hashing password" });
          }
          const values = [req.body.name, req.body.email, hash];
          db.query(q, [values], (err, result) => {
            if (err) {
              return res.json({ Error: "inserting error" });
            }
            return res.json({ Status: "success" });
          });
        }
      );
    } else {
      return res.json({ Error: "Password is missing or not a string" });
    }
  };
  

export const login = (req, res) => {
    const q = "SELECT * FROM user WHERE email = ?";
    db.query(q, [req.body.email], (err, data) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.json(errors);
      } else {
        if (err) {
          return res.json({ Error: "login error" });
        }
        if (data.length > 0) {
          bcrypt.compare(
            req.body.password.toString(),
            data[0].password,
            (err, response) => {
              if (err) {
                return res.json({ Error: "password error" });
              }
              if (response) {
                const { name } = data[0];
                const token = jwt.sign({ name }, "jwt-secret-key", {
                  expiresIn: "1d",
                }); //should be env file and 32 char for security purpose
                // console.log(token)
                res.cookie("token", token);
                req.session.name = data[0].name;
                return res.json({ Status: "success", name: req.session.name });
              } else {
                return res.json({ Error: "Password not matched" });
              }
            }
          );
        } else {
          return res.json({ Error: "No email existed" });
        }
      }
    });
  };
  

export const logout = (req, res) => {
  // Logout logic
  res.clearCookie("token");
  return res.json({ Status: "success" });
};

export default { register, login, logout };
