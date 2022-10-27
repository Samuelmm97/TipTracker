import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/modules/splash/cubit/splash_repository.dart';
import 'package:tip_tracker/utils/helpers/response_helper.dart';
import 'package:tip_tracker/utils/services/rest_api_service.dart';
part 'splash_state.dart';

class SplashCubit extends Cubit<SplashState> {
  SplashCubit() : super(SplashInitial());

  String errorMessage = "";
  final SplashRepository repository = SplashRepository();

  void verifyToken() async {
    try {
      emit(SplashLoading());
      await RestApiService.verifyToken();
      emit(SplashLoaded(true));
    } catch (e) {
      errorMessage = ResponseHelper.errorMessage(e);
      emit(SplashError(errorMessage));
      rethrow;
    }
  }
}
