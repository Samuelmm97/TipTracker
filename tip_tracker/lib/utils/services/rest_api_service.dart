import 'dart:convert';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:tip_tracker/constants/api_path.dart';
import 'package:tip_tracker/core/auth/login/cubit/user_model.dart';
import 'package:tip_tracker/core/auth/registration/cubit/registration_model.dart';
import 'package:tip_tracker/utils/services/secure_storage_service.dart';

class RestApiService {
  // Dynamically retrieves API path
  static String apiPath = ApiPath().apiPath;
  static final SecureStorageService _storage = SecureStorageService();

  /* HTTP METHODS */

  static Future<dynamic> _get(String url) async {
    try {
      Map<String, String> headers = {"Accept": "application/json"};
      headers.addAll(await _storage.readTokens());

      final Response response = await Dio().get(
        url,
        options: Options(
          headers: headers,
        ),
      );
      return response;
    } catch (e) {
      if (e is DioError) {
        if (e.error is SocketException) {
          throw (e.error);
        } else {
          rethrow;
        }
      }
    }
  }

  static Future<dynamic> _post(String url, Map<String, dynamic> body) async {
    try {
      Map<String, String> headers = {
        "Acception": "application/json",
        "Content-type": "application/json",
      };
      headers.addAll(await _storage.readTokens());

      final Response response = await Dio().post(
        url,
        data: json.encode(body),
        options: Options(
          headers: headers,
        ),
      );
      _storage.storeTokens(response.headers.map["auth-token"]!.first,
          response.headers.map["refresh-token"]!.first);
      return response;
    } catch (e) {
      if (e is DioError) {
        if (e.error is SocketException) {
          throw (e.error);
        } else {
          rethrow;
        }
      }
    }
  }

  static Future<dynamic> _put(String url, Map<String, dynamic> body) async {
    try {
      Map<String, String> headers = {
        "Acception": "application/json",
        "Content-type": "application/json",
      };
      headers.addAll(await _storage.readTokens());

      final Response response = await Dio().put(
        url,
        data: json.encode(body),
        options: Options(
          headers: headers,
        ),
      );
      _storage.storeTokens(response.headers.map["auth-token"]!.first,
          response.headers.map["refresh-token"]!.first);
      return response;
    } catch (e) {
      if (e is DioError) {
        if (e.error is SocketException) {
          throw (e.error);
        } else {
          rethrow;
        }
      }
    }
  }

  /* AUTHENTICATION */

  static Future<dynamic> login(String email, String password) async {
    Map<String, String> body = {
      "email": email,
      "password": password,
    };
    return await _post("$apiPath/login", body);
  }

  static Future<dynamic> registerUser(
      RegistrationModel registrationModel) async {
    return await _post("$apiPath/register", registrationModel.toJson());
  }

  static Future<dynamic> verifyToken() async {
    return await _get("$apiPath/verify_token");
  }

  /* USERS */

  static Future<dynamic> profile(String userID) async {
    return await _get("$apiPath/profile/$userID");
  }

  static Future<dynamic> putProfile(String userID, UserModel user) async {
    return await _put("$apiPath/profile/$userID", user.toJson());
  }

  static Future<dynamic> postProfile(String userID, UserModel user) async {
    return await _post("$apiPath/onboarding", user.toJson());
  }
}
