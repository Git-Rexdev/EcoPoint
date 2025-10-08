
import jwt from 'jsonwebtoken';

// export function signAccess(payload, expiresIn='15m') {
//   return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn });
// }
// export function signRefresh(payload, expiresIn='30d') {
//   return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn });
// }
// export function verifyAccess(token) {
//   return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
// }
// export function verifyRefresh(token) {
//   return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
// }

export const ACCESS_TTL = process.env.ACCESS_TOKEN_TTL || '15m';
export const REFRESH_TTL = process.env.REFRESH_TOKEN_TTL || '30d';

export function signAccess(payload, expiresIn = ACCESS_TTL) {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn });
}
export function signRefresh(payload, expiresIn = REFRESH_TTL) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn });
}
export function verifyAccess(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}
export function verifyRefresh(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

export function decodeToken(token) {
  return jwt.decode(token);
}