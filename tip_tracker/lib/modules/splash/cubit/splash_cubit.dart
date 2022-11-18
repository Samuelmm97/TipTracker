import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/modules/splash/cubit/splash_repository.dart';
import 'package:tip_tracker/utils/helpers/response_helper.dart';
import 'package:tip_tracker/utils/services/rest_api_service.dart';
part 'splash_state.dart';

/// This cubit is used to manage the [SplashState]. It's constructor sets the
/// current state to [SplashInitial].
///
/// On creation, this cubit creates and uses [SplashRepository] for handling API calls.
///
/// When the [verifyToken] method is called, this cubit emits state
/// [SplashLoading].
///
/// If Splash is successful, this cubit emits [SplashLoaded].
///
/// On failure, it emits [SplashError] with the given error message and rethrows
/// the current error.
class SplashCubit extends Cubit<SplashState> {
  SplashCubit() : super(SplashInitial());

  String errorMessage = "";
  final SplashRepository repository = SplashRepository();

  /// Attempts to verify JWT stored in secured storage.
  void verifyToken() async {
    try {
      emit(SplashLoading());
      await RestApiService.verifyToken();
      errorMessage = "";
      emit(SplashLoaded());
    } catch (e) {
      errorMessage = ResponseHelper.errorMessage(e);
      emit(SplashError(errorMessage));
      rethrow;
    }
  }
}
