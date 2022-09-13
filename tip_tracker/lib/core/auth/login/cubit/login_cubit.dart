import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/core/auth/login/cubit/login_repository.dart';
import 'package:tip_tracker/utils/services/secure_storage_service.dart';
part 'login_state.dart';

class LoginCubit extends Cubit {
  LoginCubit() : super(LoginInitial());

  LoginRepository loginRepository = LoginRepository();

  Future<void> authenticate(email, password) async {
    try {
      emit(LoginAuthenticating());
      SecureStorageService _storage = SecureStorageService();
      dynamic response = await loginRepository.authenticate(email, password);
      _storage.addNewItem(email, "email", email);
      if (response is String) {
        // Store JWT
        _storage.addNewItem(email, "jwt", response);
        emit(LoginAuthenticated());
      } else {
        if (response < 200) {
          // Handle informational status codes
          emit(LoginError("Unhandled status code."));
        }
        if (response >= 300 && response < 400) {
          // Return redirect
          emit(LoginError("Redirection issue."));
        } else if (response >= 400) {
          if (response == 401 || response == 403) {
            // Return invalid email/password
            emit(LoginError("Invalid email/password."));
          } else {
            // Return connection issue
            emit(LoginError("Connection issue."));
          }
        } else {
          // Return connection issue
          emit(LoginError("Connection issue."));
        }
      }
    } catch (e) {
      emit(LoginError(e.toString()));
    }
  }
}
