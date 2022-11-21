import 'package:dio/dio.dart';
import 'package:tip_tracker/core/auth/onboarding/cubit/onboarding_model.dart';
import 'package:tip_tracker/utils/services/rest_api_service.dart';

/// Handles the API calls for [OnboardingCubit] through [RestApiService].
class OnboardingRepository {
  Future<Response> onboard(OnboardingModel onboardingModel) async {
    return await RestApiService.onboard(onboardingModel);
  }
}
