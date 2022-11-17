import 'package:tip_tracker/core/auth/registration/cubit/registration_model.dart';
import 'package:tip_tracker/utils/services/rest_api_service.dart';

/// Handles the API calls for [RegistrationCubit] through [RestApiService].
class RegistrationRepository {
  Future<void> register(RegistrationModel registrationModel) async {
    await RestApiService.register(registrationModel);
  }
}
