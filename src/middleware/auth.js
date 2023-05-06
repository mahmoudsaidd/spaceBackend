import jwt from "jsonwebtoken";
import { userModel } from "../../Database/model/user.model.js";

export const roles = {
  User: "User",
  Admin: "Admin",
  Owner: "Owner",
};

export const auth = (acceptedRoles = [roles.User]) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization?.startsWith(process.env.BearerKey)) {
      return next(new Error("In-valid Bearer key", { cause: 400 }));
    } else {
      const token = authorization.split(process.env.BearerKey)[1];
      const decoded = jwt.verify(token, process.env.tokenSignature);
      if (!decoded?.id || !decoded?.isLoggedIn) {
        return next(new Error("In-valid token payload", { cause: 400 }));
      } else {
        const user = await userModel
          .findById(decoded.id)
          .select("email userName role");
        if (!user) {
          return next(new Error("Not register user", { cause: 404 }));
        } else {
          if (acceptedRoles.includes(user.role)) {
            req.user = user;
            return next();
          } else {
            return next(new Error("Not authorized user", { cause: 403 }));
          }
        }
      }
    }
  };
};
