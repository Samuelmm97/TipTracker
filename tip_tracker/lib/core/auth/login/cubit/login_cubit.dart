import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/core/auth/login/cubit/login_repository.dart';
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
      // dynamic response =
      await loginRepository.login(email, password);

      // Authentication successful

      // Store JWT
      // await storage.addNewItem(email, "jwt", response);

      email = "";
      password = "";
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
