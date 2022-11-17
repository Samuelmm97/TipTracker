part of 'registration_cubit.dart';

/// Abstract state for [RegistrationCubit].
abstract class RegistrationState {}

/// Initial state for [RegistrationCubit].
class RegistrationInitial extends RegistrationState {}

/// Register in process state for [RegistrationCubit].
class Registering extends RegistrationState {}

/// Registration successful state for [RegistrationCubit].
class Registered extends RegistrationState {}

/// Registration error state for [RegistrationCubit].
///
/// Takes an [errorMessage] in it's constructor, to be accessible when this
/// state is emitted.
///
/// ```state.errorMessage```
class RegistrationError extends RegistrationState {
  RegistrationError(this.errorMessage);

  final String errorMessage;
  List<Object> get props => [errorMessage];
}
