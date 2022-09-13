import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:tip_tracker/constants/api_path.dart';
import 'package:http/http.dart' as http;

class RestApiService {
  static String apiPath = ApiPath.androidLocalHost;

  static Future<dynamic> _get(String url) async {
    try {
      String? jwt = await const FlutterSecureStorage().read(key: "jwt");
      final response = await http.get(
        Uri.parse(url),
        headers: {
          "Accept": "application/json",
          // Send jwt
        },
      );
      return response;
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  static Future<dynamic> _post(String url, Map<String, String> body) async {
    try {
      String? jwt = await const FlutterSecureStorage().read(key: "jwt");
      final response = await http.post(
        body: json.encode(body),
        Uri.parse(url),
        headers: {
          "Accept": "application/json",
          "Content-type": "application/json"
          // Send jwt
        },
      );
      return response;
    } catch (e) {
      throw Exception(e.toString());
    }
  }

  static Future<dynamic> authenticate(String email, String password) async {
    Map<String, String> body = {
      "email": email,
      "password": password,
    };
    return await _post(
      "$apiPath/api/authenticate",
      body,
    );
  }
}
