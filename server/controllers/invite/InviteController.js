import nodemailer from "nodemailer";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import db from "../../models/db/DbModel.js";

const pool = db;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const sendInviteEmail = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { email, name, inviteCode } = req.body;

    if (!email || !name || !inviteCode) {
      console.log("Missing required fields:", { email, name, inviteCode });
      return res
        .status(400)
        .json({ status: "error", message: "All fields are required" });
    }

    console.log(`Email: ${email}, Name: ${name}, InviteCode: ${inviteCode}`);

    // Check if the email already has an invite
    const checkQuery = "SELECT code FROM invitations WHERE email = ?";
    const [rows] = await connection.execute(checkQuery, [email]);

    let existingInviteCode;
    if (rows.length > 0) {
      existingInviteCode = rows[0].code;
    }

    // If there's already an invite code, use it; otherwise, use the new inviteCode
    const codeToSend = existingInviteCode || inviteCode;

    const signupUrl = `http://37.60.244.17:3000/login?inviteCode=${codeToSend}`;

    // Read the HTML template file
    const templatePath = path.join(__dirname, "invite-template.html");
    const messageHtml = await readFile(templatePath, "utf-8");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Invitation to Join Our Platform",
      html: messageHtml
        .replace("${name}", name)
        .replace("${inviteCode}", codeToSend)
        .replace("${signupUrl}", signupUrl),
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res
          .status(500)
          .json({ status: "error", message: "Error sending invite email" });
      } else {
        console.log("Email sent: " + info.response);

        // If there's no existing invite code, insert the new invitation details into the database
        if (!existingInviteCode) {
          const query =
            "INSERT INTO invitations (email, name, code, created_at) VALUES (?, ?, ?, NOW())";
          await connection.execute(query, [email, name, inviteCode]);
        }

        return res
          .status(200)
          .json({
            status: "success",
            message: "Invitation sent successfully!",
          });
      }
    });
  } catch (error) {
    console.error("Error sending invite email:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  } finally {
    connection.release();
  }
};
