part of 'geolocator_cubit.dart';

abstract class GeolocatorState {}

class GeolocatorInitial extends GeolocatorState {
  List<Object> get props => [];
}

class GeolocatorLoading extends GeolocatorState {
  List<Object> get props => [];
}

class GeolocatorLackPermission extends GeolocatorState {
  List<Object> get props => [];
}

class GeolocatorLoaded extends GeolocatorState {
  GeolocatorLoaded(this.position);

  final Position position;

  List<Object> get props => [position];
}

class ErrorState extends GeolocatorState {
  List<Object> get props => [];
}
