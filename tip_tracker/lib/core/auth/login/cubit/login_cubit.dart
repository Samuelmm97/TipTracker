import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/core/auth/login/cubit/login_model.dart';
import 'package:tip_tracker/core/auth/login/cubit/login_repository.dart';
import 'package:tip_tracker/utils/helpers/response_helper.dart';
import 'package:tip_tracker/utils/services/secure_storage_service.dart';

part 'login_state.dart';

class LoginCubit extends Cubit<LoginState> {
  LoginCubit() : super(LoginInitial());

  String errorMessage = "";
  LoginModel loginModel = LoginModel("", "");
  LoginRepository loginRepository = LoginRepository();
  SecureStorageService storage = SecureStorageService();

  Future<bool> login() async {
    try {
      emit(LoginAuthenticating());
      await loginRepository.login(loginModel);

      // Authentication successful
      LoginModel("", "");
      errorMessage = "";
      emit(LoginAuthenticated());
      return true;
    } catch (e) {
      errorMessage = ResponseHelper.errorMessage(e);
      emit(LoginError(errorMessage));
      rethrow;
    }
  }
}
