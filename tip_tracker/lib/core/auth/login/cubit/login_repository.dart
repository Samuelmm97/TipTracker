import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart';

class LoginRepository {
  Future<dynamic> authenticate(String email, String password) async {
    Response response = await authenticate(email, password);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      dynamic jsonBody = json.decode(response.body);
      return jsonBody["jwt"];
    } else {
      return response.statusCode;
    }
  }

  Future<dynamic> login(String jwt) async {}
}
