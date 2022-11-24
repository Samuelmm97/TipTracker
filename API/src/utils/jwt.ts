const jwt = require("jsonwebtoken");
const { TokenExpiredError } = jwt;

const catchError = (email: string, err: Error, res: any, req: any, next: any) => {
  if (err instanceof TokenExpiredError) {
    console.log("Token being refreshed for user: " + email);
    const refreshToken = req.header("refresh-token");
    // verify refresh token
    try {
      const refreshVerified = jwt.verify(refreshToken, process.env.JWT_SECRET);

      if (refreshVerified){
        var authToken = jwt.sign({ email: email }, process.env.JWT_SECRET, {
          expiresIn: "15m",
        });

        res.header("auth-token", authToken);
        res.header("refresh-token", refreshToken);

        next();
      }
    } catch (err) {
      return res.status(401).send({message: "Invalid refresh token"});
    }
  } else if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).send({message: "Invalid token"});
  } else {
    return res.status(500).send({message: "Internal server error"});
  }
  res.status(401).send({ message: "Unauthorized." });
  return;
  
};

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
    return catchError(jwt.decode(token)["email"], error, res, req, next);
  }
  next();
};
