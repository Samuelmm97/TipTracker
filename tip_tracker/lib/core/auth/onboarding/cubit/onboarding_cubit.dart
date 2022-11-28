import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/core/auth/onboarding/cubit/onboarding_model.dart';
import 'package:tip_tracker/core/auth/onboarding/cubit/onboarding_repository.dart';
part 'onboarding_state.dart';

/// This cubit is used to manage the [OnboardingState]. It's constructor sets the
/// current state to [OnboardingInitial].
///
/// On creation, this cubit also creates a [OnboardingModel] to get users Onboarding
/// information and [OnboardingRepository] for handling API calls.
///
/// When the [onboard] method is called, this cubit emits state
/// [Onboarding].
///
/// If Onboarding is successful, this cubit emits [Onboarded].
///
/// On failure, it emits [OnboardingError] with the given error message and rethrows
/// the current error.
class OnboardingCubit extends Cubit<OnboardingState> {
  OnboardingCubit() : super(OnboardingInitial());

  String errorMessage = "";
  OnboardingModel onboardingModel = OnboardingModel();
  OnboardingRepository onboardingRepository = OnboardingRepository();

  Future<void> updateEmployeeType(String employeeType) async {
    onboardingModel.employeeType = employeeType;
    if (employeeType == "stationary") {
      emit(OnboardingStationary());
    }
    if (employeeType == "mobile") {
      emit(OnboardingMobile());
    }
  }

  /// Attempts to onboard the user.
  ///
  /// Returns true if onboarding is successful, and false if unsuccessful.
  Future<bool> onboard() async {
    try {
      emit(Onboarding());
      Response response = await onboardingRepository.onboard(onboardingModel);
      onboardingModel = OnboardingModel();
      emit(Onboarded());
      return true;
    } catch (e) {
      if (e is DioError) {
        if (e.error is SocketException) {
          errorMessage = "Connection to server failed";
        } else
          errorMessage = e.response?.data['message'];
      }
      emit(OnboardingError(errorMessage));
      print(e);
      rethrow;
    }
  }
}
