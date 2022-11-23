import 'package:flutter_bloc/flutter_bloc.dart';

part 'onboarding_state.dart';

class OnboardingCubit extends Cubit<OnboardingCubit> {
  OnboardingCubit() : super(OnboardingInitial());
}
