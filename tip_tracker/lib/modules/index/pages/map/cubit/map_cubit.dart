import 'package:flutter_bloc/flutter_bloc.dart';

part 'map_state.dart';

class MapCubit extends Cubit<MapState> {
  MapCubit() : super(MapInitial());
  String errorMessage = "";
}
