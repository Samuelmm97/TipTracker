import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/core/auth/registration/cubit/registration_model.dart';
import 'package:tip_tracker/core/auth/registration/cubit/registration_repository.dart';
import 'package:tip_tracker/utils/helpers/response_helper.dart';
import 'package:tip_tracker/utils/services/secure_storage_service.dart';
part 'registration_state.dart';

/// This cubit is used to manage the [RegistrationState]. It's constructor sets the
/// current state to [RegistrationInitial].
///
/// On creation, this cubit also creates a [RegistrationModel] to get users registration
/// information and [RegistrationRepository] for handling API calls.
///
/// When the [register] method is called, this cubit emits state
/// [Registering].
///
/// If Registration is successful, this cubit emits [Registered].
///
/// On failure, it emits [RegistrationError] with the given error message and rethrows
/// the current error.
class RegistrationCubit extends Cubit<RegistrationState> {
  RegistrationCubit() : super(RegistrationInitial());

  String errorMessage = "";
  RegistrationModel registrationModel = RegistrationModel();
  RegistrationRepository registrationRepository = RegistrationRepository();
  SecureStorageService storage = SecureStorageService();

  /// Attempts to register the user.
  ///
  /// Returns true if registration is successful, and false if unsuccessful.
  Future<bool> register() async {
    try {
      emit(Registering());
      await registrationRepository.register(registrationModel);
      registrationModel = RegistrationModel();
      emit(Registered());
      return true;
    } catch (e) {
      errorMessage = ResponseHelper.errorMessage(e);
      emit(RegistrationError(errorMessage));
      rethrow;
    }
  }
}
