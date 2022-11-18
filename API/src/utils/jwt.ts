const jwt = require("jsonwebtoken");
const { TokenExpiredError } = jwt;
//error handling if [catchError] occurs it displays user info and token refreshed, else returns an unauthorized user status
const catchError = (userId: string, err: Error, res: any, next: any) => {
  if (err instanceof TokenExpiredError) {
    console.log("Token being refreshed...");
    var refreshedToken = jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    res.header("auth-token", refreshedToken);
    next();
  } else {
    res.status(401).send({ message: "Unauthorized." });
    return;
  }
};
//if token is verified it registers user as verified, else it sends a message requiring access token.
export const verifyJWT = (req: any, res: any, next: any) => {
  const token = req.header("auth-token");
  if (!token)
    return res
      .status(401)
      .send({ message: "Unauthorized. Access token is required." });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
  } catch (error: any) {
    return catchError(jwt.decode(token)["email"], error, res, next);
  }
  next();
};
