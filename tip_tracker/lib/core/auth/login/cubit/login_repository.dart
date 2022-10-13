import 'package:tip_tracker/utils/services/rest_api_service.dart';

class LoginRepository {
  Future<void> login(String email, String password) async {
    await RestApiService.login(email, password);
  }
}
