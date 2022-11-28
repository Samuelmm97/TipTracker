part of 'onboarding_cubit.dart';

/// Abstract state for [OnboardingCubit].
abstract class OnboardingState {}

/// Initial state for [OnboardingCubit].
class OnboardingInitial extends OnboardingState {}

/// Onboarding in process state for [OnboardingCubit].
class Onboarding extends OnboardingState {}

class OnboardingStationary extends OnboardingState {}

class OnboardingMobile extends OnboardingState {}

/// Onboarding successful state for [OnboardingCubit].
class Onboarded extends OnboardingState {}

/// Onboarding error state for [OnboardingCubit].
///
/// Takes an [errorMessage] in it's constructor, to be accessible when this
/// state is emitted.
///
/// ```state.errorMessage```
class OnboardingError extends OnboardingState {
  OnboardingError(this.errorMessage);

  final String errorMessage;
  List<Object> get props => [errorMessage];
}
