import 'package:dio/dio.dart';
import 'package:tip_tracker/modules/index/pages/tipentry/cubit/tip_model.dart';
import 'package:tip_tracker/utils/services/rest_api_service.dart';
import 'package:tip_tracker/utils/services/secure_storage_service.dart';

class TipEntryRepository {
  Future<Response> addTip(TipEntryModel tipEntry) async {
    String? id = await SecureStorageService().readItem("user_id");
    tipEntry.userId = int.parse(id!);
    return await RestApiService.addTip(tipEntry);
  }
}
