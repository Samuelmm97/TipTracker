import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/core/auth/login/cubit/login_model.dart';
import 'package:tip_tracker/core/auth/login/cubit/login_repository.dart';
import 'package:tip_tracker/utils/helpers/response_helper.dart';

part 'login_state.dart';

/// # Description:
///
///   This cubit is used to manage the [LoginState]. It's constructor sets the
///   current state to [LoginInitial]. On creation, this cubit also creates
///   a [LoginModel] to get users login information and [LoginRepository] for
///   the API calls. When the [login] method is called, this cubit emits state
///   [LoginAuthenticating]. On failure, it emits [LoginError] with the given
///   error message. If login is successful, it emits [LoginAuthenticated].
///
class LoginCubit extends Cubit<LoginState> {
  LoginCubit() : super(LoginInitial());

  String errorMessage = "";
  LoginModel loginModel = LoginModel();
  LoginRepository loginRepository = LoginRepository();

  /// Attempts to login the user.
  /// returns Future<bool> if login is successful.
  Future<bool> login() async {
    try {
      emit(LoginAuthenticating());
      await loginRepository.login(loginModel);
      loginModel = LoginModel();
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
