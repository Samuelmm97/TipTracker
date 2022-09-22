import 'dart:convert';

import 'package:http/http.dart';
import 'package:tip_tracker/core/auth/login/cubit/user_model.dart';
import 'package:tip_tracker/utils/services/rest_api_service.dart';

class LoginRepository {
  // Authenticate user with email and password
  Future<dynamic> authenticate(String email, String password) async {
    Response response = await RestApiService.authenticate(email, password);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      dynamic jsonBody = json.decode(response.body);
      return jsonBody["jwt"];
    } 
    return response.statusCode;
  }

  // Login user
  Future<dynamic> login(String jwt) async {
    Response response = await RestApiService.login();
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return UserModel.fromJson(json.decode(response.body));
    }

    return response.statusCode;
  }
}
