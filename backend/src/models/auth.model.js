import { db } from "../config/db.js";

// create user

export const createUser = async (
  roleId,
  email,
  passwordHash,
  firstName,
  lastName,
  verifyToken,
  avatar,
) => {
  const [result] = await db.query(
    "INSERT INTO users (role_id, email, password, first_name, last_name, verify_token, avatar_media_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [roleId, email, passwordHash, firstName, lastName, verifyToken, avatar],
  );
  return result.insertId;
};

// find user by email

export const findUserByEmail = async (email) => {
  const [rows] = await db.query(
    `SELECT u.*, r.name AS role
       FROM users u
       JOIN roles r ON r.id = u.role_id
       WHERE u.email = ?`,
    [email],
  );
  return rows[0];
};

// find user to verify email link

export const findUserByVerifyToken = async (token) => {
  const [rows] = await db.query(`SELECT * FROM users WHERE verify_token=?`, [
    token,
  ]);
  return rows[0];
};

// set verify to true and reset verify_token

export const verifyUser = async (userId) => {
  await db.query(
    `UPDATE users SET is_verified=1, verify_token=NULL WHERE id=?`,
    [userId],
  );
};

// find user with a valid token to reset password
export const findUserByResetToken = async (token) => {
  const [rows] = await db.query(`SELECT * FROM users WHERE reset_token=? AND reset_token_expires_at > NOW()`, [
    token,
  ]);
  return rows[0];
};

// update password
export const updatePassword = async (userId, passwordHash) => {
  await db.query(`UPDATE users SET password=? WHERE id =?`, [
    passwordHash,
    userId,
  ]);
};

// 
export const saveResetPassword = async (userId, token) => {
  await db.query(`UPDATE users SET reset_token=?, reset_token_expires_at = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id=?`, [token, userId]);
};

// clear reset_token
export const clearResetToken = async (userId) => {
  await db.query(`UPDATE users SET reset_token=NULL, reset_token_expires_at = NULL WHERE id=?`, [userId]);
};

// update last login
export const updateLastLogin = async (userId) => {
  await db.query(`UPDATE users SET last_login = NOW() WHERE id = ?`, [userId]);
};


// find user by role
export const findRoleByName = async (roleName) => {
  const [rows] = await db.query(
    `SELECT id FROM roles WHERE name=?`,
    [roleName]
  );
  return rows[0];
};
