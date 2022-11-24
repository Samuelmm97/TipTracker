part of 'splash_cubit.dart';

abstract class SplashState {}

class SplashInitial extends SplashState {}

class SplashLoading extends SplashState {}

class SplashLoaded extends SplashState {}

class SplashError extends SplashState {
  SplashError(this.errorMessage);

  final String errorMessage;
  List<Object> get props => [errorMessage];
}
