part of 'login_cubit.dart';

/// Abstract state for [LoginCubit].
abstract class LoginState {}

/// Initial state for [LoginCubit].
class LoginInitial extends LoginState {}

/// Authenticating currently state for [LoginCubit].
class LoginAuthenticating extends LoginState {}

/// Login authentication successful state for [LoginCubit].
class LoginAuthenticated extends LoginState {}

/// Login error state for [LoginCubit].
///
/// Takes an [errorMessage] in it's constructor, to be accessible when this
/// state is emitted.
///
/// ```state.errorMessage```
class LoginError extends LoginState {
  LoginError(this.errorMessage);

  final String errorMessage;
  List<Object> get props => [errorMessage];
}
