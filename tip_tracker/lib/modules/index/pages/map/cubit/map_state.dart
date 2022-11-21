part of 'map_cubit.dart';

abstract class MapState {}

class MapInitial extends MapState {}

class MapLoading extends MapState {}

class MapLoaded extends MapState {}

class MapError extends MapState {
  final String errorMessage;

  MapError(this.errorMessage);
}
