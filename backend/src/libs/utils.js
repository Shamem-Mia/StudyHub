import jwt from "jsonwebtoken";

export const createToken = (email, role) => {
  const payload = {
    email: email,
    role: role,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return token;
};
