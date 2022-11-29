import 'package:dio/dio.dart';
import 'package:tip_tracker/modules/index/pages/Profile/cubit/userProfileModel.dart';
import 'package:tip_tracker/utils/services/rest_api_service.dart';
import 'package:tip_tracker/utils/services/secure_storage_service.dart';

class UserProfileRepository {
  Future<UserProfileModel> userProfile() async{

    String?userId = await SecureStorageService().readItem("user_id");
    Response response = await RestApiService.getProfile(int.parse(userId!));
    UserProfileModel userProfileModel = UserProfileModel(response.data["data"]["user_id"], response.data["data"]["employee_type"]);

    return userProfileModel;
  }

}
