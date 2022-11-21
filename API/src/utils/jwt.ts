const jwt = require("jsonwebtoken");
const { TokenExpiredError } = jwt;

const catchError = (email: string, err: Error, req: any, res: any, next: any) => {
  if (err instanceof TokenExpiredError) {
    console.log("Token being refreshed for user: " + email);
    const refreshToken = req.header("refresh-token");
    // verify refresh token
    const refreshVerified = jwt.verify(refreshToken, process.env.JWT_SECRET);

    if (refreshVerified){
      var authToken = jwt.sign({ email: email }, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });

      res.header("auth-token", authToken);
      res.header("refresh-token", refreshToken);

      next();
    }
  } 
  res.status(401).send({ message: "Unauthorized." });
  return;
  
};

export const verifyJWT = (req: any, res: any, next: any) => {
  // Grab the tokens from the header
  const authToken = req.header("auth-token");
  const refreshToken = req.header("refresh-token");

  // Verify the auth token
  if (!authToken) {
    return res
      .status(401)
      .send({ message: "Unauthorized. Access token is required." });
  }
  try {
    // Verify the auth token
    const authVerified = jwt.verify(authToken, process.env.JWT_SECRET);

    // If the auth token is valid, pass the request to the next middleware
    if (authVerified) {
      console.log("Token verified for user: " + authVerified.email);
      req.user = authVerified;
      res.header("auth-token", authToken);
      res.header("refresh-token", refreshToken);
    } 
    // If the auth token is invalid, return an error
    else {
      return res
      .status(401)
      .send({ message: "Unauthorized. Access token is required." });
    }
  } catch (error: any) {
    // If the auth token is expired, try to refresh it
    return catchError(jwt.decode(authToken)["email"], error, req, res, next);
  }
  next();
};
