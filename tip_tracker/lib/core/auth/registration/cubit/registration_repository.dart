import 'package:dio/dio.dart';
import 'package:tip_tracker/core/auth/registration/cubit/registration_model.dart';
import 'package:tip_tracker/utils/services/rest_api_service.dart';
import 'package:tip_tracker/utils/services/secure_storage_service.dart';

/// Handles the API calls for [RegistrationCubit] through [RestApiService].
class RegistrationRepository {
  Future<Response> register(RegistrationModel registrationModel) async {
    Response response = await RestApiService.register(registrationModel);
    SecureStorageService storage = SecureStorageService();
    await storage.addNewItem(
        "user_id", response.data['data']['user_id'].toString());
    print(await storage.readItem("user_id"));

    return response;
  }
}
