part of 'login_cubit.dart';

abstract class LoginState {}

class LoginInitial extends LoginState {}

class LoginAuthenticating extends LoginState {}

class LoginAuthenticated extends LoginState {}

class LoginConnecting extends LoginState {}

class LoggedIn extends LoginState {}

class LoginError extends LoginState {
  LoginError(this.errorMessage);

  final String errorMessage;
  List<Object> get props => [errorMessage];
}
