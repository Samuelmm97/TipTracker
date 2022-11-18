part of 'splash_cubit.dart';

/// Abstract state for [SplashCubit].
abstract class SplashState {}

/// Initial state for [SplashCubit].
class SplashInitial extends SplashState {}

/// Splash loading currently state for [SplashCubit].
class SplashLoading extends SplashState {}

/// Splash loaded successful state for [SplashCubit] on correct
/// token verification.
class SplashLoaded extends SplashState {}

/// Splash error state for [SplashCubit].
///
/// Takes an [errorMessage] in it's constructor, to be accessible when this
/// state is emitted.
///
/// ```state.errorMessage```
class SplashError extends SplashState {
  SplashError(this.errorMessage);

  final String errorMessage;
  List<Object> get props => [errorMessage];
}
