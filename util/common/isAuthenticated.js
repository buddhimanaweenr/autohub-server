import jwt from "jsonwebtoken";
import isEmpty from "./isEmpty";

module.exports = (req, res, next) => {
    if (!isEmpty(req.headers.tokenid)) {
      let decodedToken = null;
      try {
        decodedToken = jwt.verify(req.headers.tokenid, process.env.JWT_SECRET, {
          algorithms: ["HS256"],
        });
      } catch (err) {
        //console.log(err, '\n')
        return res.status(401).json({
          message: "Something went wrong! Please contact IT Support.",
        });
      }

      if (!isEmpty(decodedToken)) {
        next();
      } else {
        return res.status(401).json({
          message: "Invalid Token. Please try login again!",
        });
      }
    } else if(!isEmpty(req.headers["x-api-key"])) {
      if (req.headers["x-api-key"] === process.env.JWT_SECRET) {
        next();
      } else {
        return res.status(401).json({
          message: "Invalid Token. Please try again!",
        });
      }
    } else {
      return res.status(401).json({
        message: "Invalid Token. Please try login again!",
      });
    }
};
