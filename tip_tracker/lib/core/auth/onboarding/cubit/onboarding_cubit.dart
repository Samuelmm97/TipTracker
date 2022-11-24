import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/core/auth/onboarding/cubit/onboarding_model.dart';
import 'package:tip_tracker/core/auth/onboarding/cubit/onboarding_repository.dart';
part 'onboarding_state.dart';

class OnboardingCubit extends Cubit<OnboardingState> {
  OnboardingCubit() : super(OnboardingInitial());

  String errorMessage = "";
  OnboardingModel onboardingModel = OnboardingModel();
  OnboardingRepository onboardingRepository = OnboardingRepository();

  setType(String type) {
    try {
      onboardingModel.employeeType = type;
      if (type == "stationary") {
        emit(OnboardingStationary());
      } else if (type == "mobile") {
        emit(OnboardingMobile());
      } else {
        emit(OnboardingError("Invalid employee type."));
      }
    } catch (e) {
      print(e);
    }
  }

  /// Attempts to onboard the user.
  ///
  /// Returns true if onboarding is successful, and false if unsuccessful.
  Future<bool> onboard() async {
    try {
      emit(Onboarding());
      Response response = await onboardingRepository.onboard(onboardingModel);
      if (response.statusCode == 200) {
        onboardingModel = OnboardingModel();
        emit(Onboarded());
        return true;
      } else {
        errorMessage = response.data['message'];
        emit(OnboardingError(errorMessage));
        return false;
      }
    } catch (e) {
      if (e is DioError) {
        errorMessage = e.response!.data['message'];
      } else if (e is SocketException) {
        errorMessage = "Connection to server failed";
      }
      emit(OnboardingError(errorMessage));
      rethrow;
    }
  }
}
