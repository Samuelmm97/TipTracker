class ResponseHelper {
  static String errorMessage(int statusCode) {
    // Handle informational status codes
    if (statusCode < 200) {
      return "Unhandled status code";
    }
    // Return redirect
    if (statusCode >= 300 && statusCode < 400) {
      return "Redirect";
    }
    // Invalid request
    else {
      // Return invalid email/password
      if (statusCode == 401 || statusCode == 403) {
        return "Invalid email/password";
      }
      // Return invalid request
      else {
        return "Bad request";
      }
    }
  }
}