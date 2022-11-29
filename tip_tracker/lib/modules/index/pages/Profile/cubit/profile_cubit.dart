import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/modules/index/pages/Profile/cubit/profile_repository.dart';
import 'package:tip_tracker/modules/index/pages/Profile/cubit/userProfileModel.dart';

part 'profile_state.dart';

class ProfileCubit extends Cubit<ProfileState> {

  String errorMessage = "";
  UserProfileRepository userProfileRepository = UserProfileRepository();
  UserProfileModel? userProfileModel;
  ProfileCubit() : super(ProfileInitial()){
    getProfile();
  }
  Future<void> getProfile() async {
    try {
      emit(ProfileLoading());
      userProfileModel = await userProfileRepository.userProfile();
      emit(ProfileLoaded());
    }
    catch (e) {
      if (e is DioError) {
        errorMessage = e.response!.data['message'];
      } else if (e is SocketException) {
        errorMessage = "Connection to server failed";
      }
      emit(ProfileError(errorMessage));
      rethrow;
    }
  }
}
