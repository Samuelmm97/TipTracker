import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/core/auth/login/cubit/login_repository.dart';
import 'package:tip_tracker/core/auth/login/cubit/user_model.dart';
import 'package:tip_tracker/utils/helpers/logger_helper.dart';
import 'package:tip_tracker/utils/services/secure_storage_service.dart';
part 'login_state.dart';

class LoginCubit extends Cubit {
  LoginCubit() : super(LoginInitial());

  LoginRepository loginRepository = LoginRepository();
  SecureStorageService storage = SecureStorageService();
  String errorMessage = "";

  Future<void> authenticate(email, password) async {
    try {
      emit(LoginAuthenticating());
      dynamic response = await loginRepository.authenticate(email, password);
      await storage.addNewItem(email, "email", email);

      // Authentication successful
      if (response is String) {
        // Store JWT
        await storage.addNewItem(email, "jwt", response);
        emit(LoginAuthenticated());
      } else {
        // Handle informational status codes
        if (response < 200) {
          errorMessage = "Unhandled status code";
          emit(LoginError(errorMessage));
        }
        // Return redirect
        if (response >= 300 && response < 400) {
          errorMessage = "Redirect";
          emit(LoginError(errorMessage));
        } 
        // Invalid request
        else if (response >= 400) {
          // Return invalid email/password
          if (response == 401 || response == 403) {
            errorMessage = "Invalid email/password";
            emit(LoginError(errorMessage));
                        
          } 
          // Return connection issue
          else {
            errorMessage = "Connection issue";
            emit(LoginError(errorMessage));
          }
        }
        // Return connection issue 
        else {
          errorMessage = "Connection issue";
          emit(LoginError("Connection issue."));
        }
        logger.w("$errorMessage: Statuc code: $response");
      }
    } catch (e) {
      emit(LoginError(e.toString()));
    }
  }

  Future<void> login(email, password) async {
    try {
      String? jwt = await storage.readItem("jwt");
      if (jwt == null) {
        emit(LoginError("Authentication failed."));
      } 
      else {
        dynamic response = await loginRepository.login(jwt);

        // Login successful
        if (response is UserModel) {
          emit(LoggedIn(response));
        }
        // Handle informational status codes
        else {
          if (response < 200) {
            errorMessage = "Unhandled status code";
            emit(LoginError(errorMessage));
          }
          // Return redirect
          if (response >= 300 && response < 400) {
            errorMessage = "Redirect";
            emit(LoginError(errorMessage));
          } 
          // Invalid request
          else if (response >= 400) {
            // Return invalid email/password
            if (response == 401 || response == 403) {
              errorMessage = "Invalid email/password";
              emit(LoginError(errorMessage));
                          
            } 
            // Return connection issue
            else {
              errorMessage = "Connection issue";
              emit(LoginError(errorMessage));
            }
          }
          // Return connection issue 
          else {
            errorMessage = "Connection issue";
            emit(LoginError("Connection issue."));
          }
        }
        logger.w("$errorMessage: Statuc code: $response");
      }
    } catch (e) {
      emit(LoginError(e.toString()));
    }
  }
}
