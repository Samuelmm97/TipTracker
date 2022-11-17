import 'package:tip_tracker/core/auth/login/cubit/login_model.dart';
import 'package:tip_tracker/utils/services/rest_api_service.dart';

/// Handles the API calls for [LoginCubit] through [RestApiService].
class LoginRepository {
  Future<void> login(LoginModel loginModel) async {
    await RestApiService.login(loginModel);
  }
}
