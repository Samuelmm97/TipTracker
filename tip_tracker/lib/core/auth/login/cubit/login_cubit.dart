import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/core/auth/login/cubit/login_model.dart';
import 'package:tip_tracker/core/auth/login/cubit/login_repository.dart';

part 'login_state.dart';

/// This cubit is used to manage the [LoginState]. It's constructor sets the
/// current state to [LoginInitial].
///
/// On creation, this cubit also creates a [LoginModel] to get users login
/// information and [LoginRepository] for handling API calls.
///
/// When the [login] method is called, this cubit emits state
/// [LoginAuthenticating].
///
/// If login is successful, this cubit emits [LoginAuthenticated].
///
/// On failure, it emits [LoginError] with the given error message and rethrows
/// the current error.
class LoginCubit extends Cubit<LoginState> {
  LoginCubit() : super(LoginInitial());

  String errorMessage = "";
  LoginModel loginModel = LoginModel();
  LoginRepository loginRepository = LoginRepository();

  /// Attempts to login the user.
  ///
  /// Returns true if login is successful, and false if unsuccessful.
  Future<bool> login() async {
    try {
      emit(LoginAuthenticating());
      Response response = await loginRepository.login(loginModel);
      loginModel = LoginModel();
      errorMessage = "";
      emit(LoginAuthenticated());
      return true;
    } catch (e) {
      if (e is DioError) {
        errorMessage = e.response!.data['message'];
      } else if (e is SocketException) {
        errorMessage = "Connection to server failed";
      }
      emit(LoginError(errorMessage));
      rethrow;
    }
  }
}
