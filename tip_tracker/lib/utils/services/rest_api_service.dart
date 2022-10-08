import 'dart:convert';

import 'package:tip_tracker/constants/api_path.dart';
import 'package:http/http.dart' as http;
import 'package:tip_tracker/utils/helpers/logger_helper.dart';
import 'package:tip_tracker/utils/services/secure_storage_service.dart';

class RestApiService {
  static String apiPath = ApiPath.androidLocalHost;

  static Future<dynamic> _get(String url) async {
    try {
      String? jwt = await SecureStorageService().readItem("jwt");
      final response = await http.get(
        Uri.parse(url),
        headers: {
          "Accept": "application/json",
          "Authorization": jwt ?? "None",
        },
      );
      return response;
    } catch (e) {
      logger.e(e.toString());
      throw Exception(e.toString());
    }
  }

  static Future<dynamic> _post(String url, Map<String, String> body) async {
    try {
      String? jwt = await SecureStorageService().readItem("jwt");
      final response = await http.post(
        body: json.encode(body),
        Uri.parse(url),
        headers: {
          "Accept": "application/json",
          "Content-type": "application/json",
          "Authorization": jwt ?? "None",
        },
      );
      return response;
    } catch (e) {
      logger.e(e.toString());
      throw Exception(e.toString());
    }
  }

  static Future<dynamic> authenticate(String email, String password) async {
    Map<String, String> body = {
      "email": email,
      "password": password,
    };
    return await _post(
      "$apiPath/api/get_token",
      body,
    );
  }

  static Future<dynamic> login(String email, String password) async {
    Map<String, String> body = {
      "email": email,
      "password": password,
    };
    return await _post("$apiPath/api/login", body);
  }

  static Future<dynamic> registerUser(
      String email, String password, String confirmPassword) async {
    Map<String, String> body = {
      "email": email,
      "password": password,
    };
    return await _post("$apiPath/api/register", body);
  }
}
