import { User } from "../../models/index.js";
import { JwtHelper } from "../../utils/jwt.js";

//identifyUser - Token verify karke user ko req.user mein set karta hai
//Yeh middleware har protected route ke pehle lagega

export const identifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Login required" });

    const decoded = JwtHelper.verifyToken(token);

    // Verify ki user database mein exist karta hai aur active hai
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (user.status !== "active") {
      return res.status(403).json({ message: `Account is ${user.status}` });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Session invalid" });
  }
};

//checkRole - Sirf specific role wale users ko aage jaane deta hai
//Usage: checkRole("system_admin") ya checkRole("system_admin", "hostel_admin")

export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res
        .status(500)
        .json({ message: "Internal Auth Error: Role not resolved" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: '${req.user.role}' role does not have access to this resource`,
      });
    }

    next();
  };
};
