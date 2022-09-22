part of 'registration_cubit.dart';

abstract class RegistrationState {}

class RegistrationInitial extends RegistrationState {}

class Registering extends RegistrationState {}

class Registered extends RegistrationState {}

class RegistrationError extends RegistrationState {
  RegistrationError(this.errorMessage);

  final String errorMessage;
  List<Object> get props => [errorMessage];
}