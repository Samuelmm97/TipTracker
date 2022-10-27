import 'dart:io';

import 'package:dio/dio.dart';

class ResponseHelper {
  static String errorMessage(Object e) {
    if (e is DioError) {
      int? statusCode = e.response?.statusCode;
      // Handle informational status codes
      if (statusCode! < 200) {
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
    // Connection interrupted
    else if (e is SocketException) {
      return "Connection to server lost";
    } else {
      return "Unhandled exception";
    }
  }
}
