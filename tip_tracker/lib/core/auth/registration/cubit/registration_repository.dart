import 'package:tip_tracker/core/auth/registration/cubit/registration_model.dart';
import 'package:tip_tracker/utils/services/rest_api_service.dart';

class RegistrationRepository {
  Future<void> registerUser(RegistrationModel registrationModel) async {
    await RestApiService.registerUser(registrationModel);
  }
}
