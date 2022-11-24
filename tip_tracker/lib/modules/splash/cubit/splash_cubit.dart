import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/modules/splash/cubit/splash_repository.dart';
import 'package:tip_tracker/utils/services/rest_api_service.dart';
part 'splash_state.dart';

class SplashCubit extends Cubit<SplashState> {
  SplashCubit() : super(SplashInitial());

  String errorMessage = "";
  final SplashRepository repository = SplashRepository();

  void verifyToken() async {
    try {
      emit(SplashLoading());
      Response response = await RestApiService.verifyToken();
      errorMessage = "";
      emit(SplashLoaded());
    } catch (e) {
      if (e is DioError) {
        if (e.error is SocketException) {
          errorMessage = "Connection to server failed";
        } else {
          errorMessage = e.response!.data['message'];
        }
      }
      emit(SplashError(errorMessage));
      rethrow;
    }
  }
}
