import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/modules/index/pages/tipentry/cubit/tip_model.dart';
import 'package:tip_tracker/modules/index/pages/tipentry/cubit/tip_repository.dart';

part 'tip_state.dart';

class TipEntryCubit extends Cubit<TipEntryState> {
  TipEntryCubit() : super(TipEntryInitial());
  String errorMessage = "";
  TipEntryModel tipEntryModel = TipEntryModel();
  TipEntryRepository tipEntryRepository = TipEntryRepository();

  Future<void> addTip() async {
    emit(TipEntryLoading());
    print(tipEntryModel.toJson());
    try {
      await tipEntryRepository.addTip(tipEntryModel);
      emit(TipEntryLoaded());
    } catch (e) {
      errorMessage = e.toString();
      emit(TipEntryError(errorMessage));
    }
  }
}
