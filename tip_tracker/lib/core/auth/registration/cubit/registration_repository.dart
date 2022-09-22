import 'package:http/http.dart';
import 'package:tip_tracker/utils/services/rest_api_service.dart';

class RegistrationRepository {
  Future<dynamic> registerUser(
      String email, String password, String confirmPassword) async {
    Response response =
        await RestApiService.registerUser(email, password, confirmPassword);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return true;
    } else {
      return response.statusCode;
    }
  }

  // Future<dynamic> Registration(String jwt) async {}
}
