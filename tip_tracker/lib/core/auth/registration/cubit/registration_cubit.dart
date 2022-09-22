import 'package:flutter/foundation.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/core/auth/registration/cubit/registration_repository.dart';
import 'package:tip_tracker/utils/helpers/logger_helper.dart';
import 'package:tip_tracker/utils/helpers/response_helper.dart';
import 'package:tip_tracker/utils/services/secure_storage_service.dart';
part 'registration_state.dart';

class RegistrationCubit extends Cubit<RegistrationState> {
  RegistrationCubit() : super(RegistrationInitial());

  String email = "";
  String password = "";
  String confirmPassword = "";
  String errorMessage = "";

  RegistrationRepository registrationRepository = RegistrationRepository();
  SecureStorageService storage = SecureStorageService();

  Future<bool> registerUser() async {
    try {
      emit(Registering());
      dynamic response = await registrationRepository.registerUser(
          email, password, confirmPassword);

      // Authentication successful
      if (response == true) {
        emit(Registered());
        email = "";
        password = "";
        confirmPassword = "";
        errorMessage = "";
        return true;
      } else {
        errorMessage = ResponseHelper.errorMessage(response);
        emit(RegistrationError(errorMessage));
        if (kDebugMode) {
          logger.w("$errorMessage: Status code: $response");
        }
      }
    } catch (e) {
      emit(RegistrationError(e.toString()));
    }
    return false;
  }
}
