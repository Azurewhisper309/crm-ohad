// ✅ userRoutes.js — Authentication and Role Middleware
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import dotenv from "dotenv";

dotenv.config();

const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/discovery/v2.0/keys`,
});

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
};

// ✅ Middleware: Validate AzureAD Token
export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, getKey, {
    audience: process.env.AZURE_CLIENT_ID,
    issuer: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/v2.0`,
    algorithms: ["RS256"],
  }, (err, decoded) => {
    if (err) {
      console.error("Token validation failed:", err);
      return res.status(403).json({ message: "Forbidden - Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

// ✅ Middleware: Role-Based Access Control
export const checkRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles || !req.user.roles.includes(requiredRole)) {
      return res.status(403).json({ message: "Forbidden - Insufficient role" });
    }
    next();
  };
};
