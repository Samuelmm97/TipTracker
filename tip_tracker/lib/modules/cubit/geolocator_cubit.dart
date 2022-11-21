import 'dart:async';
import 'dart:developer';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:geolocator/geolocator.dart';
import 'package:tip_tracker/utils/services/secure_storage_service.dart';

part 'geolocator_state.dart';

class GeolocatorCubit extends Cubit<GeolocatorState> {
  Position? position;
  // static const String _kLocationServicesDisabledMessage =
  //     'Location services are disabled.';
  // static const String _kPermissionDeniedMessage = 'Permission denied.';
  // static const String _kPermissionDeniedForeverMessage =
  //     'Permission denied forever.';
  // static const String _kPermissionGrantedMessage = 'Permission granted.';
  String address = "";
  bool useLocation = false;
  String displayValue = "";
  String statusDisplayValue = "";
  String serviceStatusValue = "";
  String locationAccuracyStatusValue = "";
  StreamSubscription<Position>? positionStreamSubscription;
  StreamSubscription<ServiceStatus>? _serviceStatusStreamSubscription;
  bool positionStreamStarted = false;

  final GeolocatorPlatform _geolocatorPlatform = GeolocatorPlatform.instance;

  GeolocatorCubit() : super(GeolocatorInitial()) {
    emit(GeolocatorLoading());
    SecureStorageService().readItem("address").then((value) => {
          if (value == null)
            {
              toggleListening(),
            }
          else
            {
              address = value,
              useLocation = false,
            }
        });
  }

  Future<void> getCurrentPosition() async {
    try {
      emit(GeolocatorLoading());
      final hasPermission = await _handlePermission();
      if (!hasPermission) {
        emit(GeolocatorLackPermission());
        return;
      }
      position = await _geolocatorPlatform.getCurrentPosition();
      emit(GeolocatorLoaded(position!));
    } catch (e) {
      log("Error: ${e.toString()}");
      emit(ErrorState());
    }
  }

  Future<bool> _handlePermission() async {
    bool serviceEnabled;
    LocationPermission permission;

    // Test if location services are enabled.
    serviceEnabled = await _geolocatorPlatform.isLocationServiceEnabled();
    if (!serviceEnabled) {
      // Location services are not enabled don't continue
      // accessing the position and request users of the
      // App to enable the location services.

      return false;
    }

    permission = await _geolocatorPlatform.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await _geolocatorPlatform.requestPermission();
      if (permission == LocationPermission.denied) {
        // Permissions are denied, next time you could try
        // requesting permissions again (this is also where
        // Android's shouldShowRequestPermissionRationale
        // returned true. According to Android guidelines
        // your App should show an explanatory UI now.

        return false;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      // Permissions are denied forever, handle appropriately.

      return false;
    }

    // When we reach here, permissions are granted and we can
    // continue accessing the position of the device.
    return true;
  }

  // bool _isListening() => !(positionStreamSubscription == null ||
  //     positionStreamSubscription!.isPaused);

  // void _toggleServiceStatusStream() {
  //   if (_serviceStatusStreamSubscription == null) {
  //     final serviceStatusStream = _geolocatorPlatform.getServiceStatusStream();
  //     _serviceStatusStreamSubscription =
  //         serviceStatusStream.handleError((error) {
  //       _serviceStatusStreamSubscription?.cancel();
  //       _serviceStatusStreamSubscription = null;
  //     }).listen((serviceStatus) {
  //       String serviceStatusValue;
  //       if (serviceStatus == ServiceStatus.enabled) {
  //         if (positionStreamStarted) {
  //           _toggleListening();
  //         }
  //         serviceStatusValue = 'enabled';
  //       } else {
  //         if (positionStreamSubscription != null) {
  //           setState(() {
  //             positionStreamSubscription?.cancel();
  //             positionStreamSubscription = null;
  //             _updatePositionList(
  //                 _PositionItemType.log, 'Position Stream has been canceled');
  //           });
  //         }
  //         serviceStatusValue = 'disabled';
  //       }
  //     });
  //   }
  // }

  void toggleListening() {
    try {
      if (positionStreamSubscription == null) {
        final positionStream = _geolocatorPlatform.getPositionStream();
        positionStreamSubscription = positionStream.handleError((error) {
          log("Error: ${error.toString()}");
          emit(ErrorState());
          positionStreamSubscription?.cancel();
          positionStreamSubscription = null;
        }).listen((currPosition) => {
              position = currPosition,
              print(position),
              useLocation = true,
              emit(GeolocatorLoaded(position!)),
            });
        positionStreamSubscription?.pause();
      }

      if (positionStreamSubscription == null) {
        return;
      }

      String statusDisplayValue;
      if (positionStreamSubscription!.isPaused) {
        positionStreamSubscription!.resume();
        statusDisplayValue = 'resumed';
      } else {
        positionStreamSubscription!.pause();
        statusDisplayValue = 'paused';
      }
      print(statusDisplayValue);
    } catch (e) {
      log("Error: ${e.toString()}");
      emit(ErrorState());
    }
  }

  // @override
  // void dispose() {
  //   if (positionStreamSubscription != null) {
  //     positionStreamSubscription!.cancel();
  //     positionStreamSubscription = null;
  //   }

  //   super.dispose();
  // }

  Future<void> getLastKnownPosition() async {
    position = await _geolocatorPlatform.getLastKnownPosition();
  }

  // void _getLocationAccuracy() async {
  //   final status = await _geolocatorPlatform.getLocationAccuracy();
  //   _handleLocationAccuracyStatus(status);
  // }

  // void _requestTemporaryFullAccuracy() async {
  //   final status = await _geolocatorPlatform.requestTemporaryFullAccuracy(
  //     purposeKey: "TemporaryPreciseAccuracy",
  //   );
  //   _handleLocationAccuracyStatus(status);
  // }

  // void _handleLocationAccuracyStatus(LocationAccuracyStatus status) {
  //   String locationAccuracyStatusValue;
  //   if (status == LocationAccuracyStatus.precise) {
  //     locationAccuracyStatusValue = 'Precise';
  //   } else if (status == LocationAccuracyStatus.reduced) {
  //     locationAccuracyStatusValue = 'Reduced';
  //   } else {
  //     locationAccuracyStatusValue = 'Unknown';
  //   }
  // }

  // void _openAppSettings() async {
  //   final opened = await _geolocatorPlatform.openAppSettings();
  //   String displayValue;

  //   if (opened) {
  //     displayValue = 'Opened Application Settings.';
  //   } else {
  //     displayValue = 'Error opening Application Settings.';
  //   }
  // }

  Future<void> openLocationSettings() async {
    await _geolocatorPlatform.openLocationSettings();
  }
}
