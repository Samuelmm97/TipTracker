import 'package:flutter/foundation.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/core/auth/login/cubit/login_repository.dart';
import 'package:tip_tracker/utils/helpers/logger_helper.dart';
import 'package:tip_tracker/utils/helpers/response_helper.dart';
import 'package:tip_tracker/utils/services/secure_storage_service.dart';
part 'login_state.dart';

class LoginCubit extends Cubit<LoginState> {
  LoginCubit() : super(LoginInitial());

  String email = "";
  String password = "";
  String errorMessage = "";

  LoginRepository loginRepository = LoginRepository();
  SecureStorageService storage = SecureStorageService();

  Future<bool> login() async {
    try {
      emit(LoginAuthenticating());
      dynamic response = await loginRepository.login(email, password);

      // Authentication successful
      if (response is String) {
        // Store JWT
        // await storage.addNewItem(email, "jwt", response);
        await storage.addNewItem(email, "email", email);
        emit(LoginAuthenticated());
        email = "";
        password = "";
        errorMessage = "";
        return true;
      } else {
        errorMessage = ResponseHelper.errorMessage(response);
        emit(LoginError(errorMessage));
        if (kDebugMode) {
          logger.w("$errorMessage: Status code: $response");
        }
      }
    } catch (e) {
      if (kDebugMode) {
        logger.e(e.toString());
      }
      emit(LoginError("Connection to server timed out"));
    }
    return false;
  }
}
