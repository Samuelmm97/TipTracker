import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/core/auth/registration/cubit/registration_model.dart';
import 'package:tip_tracker/core/auth/registration/cubit/registration_repository.dart';
import 'package:tip_tracker/utils/helpers/response_helper.dart';
import 'package:tip_tracker/utils/services/secure_storage_service.dart';
part 'registration_state.dart';

class RegistrationCubit extends Cubit<RegistrationState> {
  RegistrationCubit() : super(RegistrationInitial());

  String errorMessage = "";
  RegistrationModel registrationModel = RegistrationModel("", "", "");
  RegistrationRepository registrationRepository = RegistrationRepository();
  SecureStorageService storage = SecureStorageService();

  Future<bool> registerUser() async {
    try {
      emit(Registering());
      await registrationRepository.registerUser(registrationModel);

      // Authentication successful
      registrationModel = RegistrationModel("", "", "");
      emit(Registered());
      return true;
    } catch (e) {
      errorMessage = ResponseHelper.errorMessage(e);
      emit(RegistrationError(errorMessage));
      rethrow;
    }
  }
}
