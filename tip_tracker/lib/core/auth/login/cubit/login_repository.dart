import 'dart:convert';

import 'package:http/http.dart';
import 'package:tip_tracker/utils/services/rest_api_service.dart';

class LoginRepository {
  Future<dynamic> login(String email, String password) async {
    Response response = await RestApiService.login(email, password);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      dynamic jsonBody = await json.decode(json.encode(response.body));
      // return jsonBody["jwt"];
      return jsonBody;
    } else {
      return response.statusCode;
    }
  }

  // Future<dynamic> login(String jwt) async {}
}
