import 'dart:async';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/modules/cubit/geolocator_cubit.dart';
import 'package:tip_tracker/modules/index/pages/map/cubit/map_cubit.dart';

class MapPage extends StatefulWidget {
  const MapPage({Key? key}) : super(key: key);

  @override
  State<MapPage> createState() => _MapPageState();
}

class _MapPageState extends State<MapPage> {
  // final double _initFabHeight = 120.0;
  final double _panelHeightOpen = 200;
  final double _panelHeightClosed = 29.0;
  // double _fabHeight = 0;

  final Completer<GoogleMapController> _controller = Completer();
  bool isLoading = false;
  double latitude = 0;
  double longitude = 0;

  Set<Marker> vendorMarkers = {};
  List<Widget> vendorCards = [];

  @override
  Widget build(BuildContext context) {
    Size size = MediaQuery.of(context).size;
    return BlocBuilder<GeolocatorCubit, GeolocatorState>(
      builder: ((context, state) {
        if (state is GeolocatorInitial) {
          return Container();
        } else if (state is GeolocatorLoading) {
          return const Center(child: CircularProgressIndicator());
        } else if (state is GeolocatorLackPermission) {
          return GestureDetector(
            onTap: () async {
              await BlocProvider.of<GeolocatorCubit>(context)
                  .openLocationSettings();
            },
            child: SizedBox(
              height: size.height * .2,
              width: size.width * .4,
              child: const Text("Enable Location Services"),
            ),
          );
        } else if (state is GeolocatorLoaded) {
          longitude = state.position.longitude;
          latitude = state.position.latitude;
          return BlocBuilder<MapCubit, MapState>(
            builder: ((context, mapState) {
              return GoogleMap(
                onCameraMove: (position) => {
                  setState(
                    () => {
                      latitude = position.target.latitude,
                      longitude = position.target.longitude,
                    },
                  )
                },
                onCameraIdle: () async => {
                  print("Hello"),
                },
                mapType: MapType.normal,
                markers: vendorMarkers,
                myLocationEnabled: true,
                initialCameraPosition: CameraPosition(
                  target: LatLng(
                    state.position.latitude,
                    state.position.longitude,
                  ),
                  zoom: 14,
                ),
                onMapCreated: (GoogleMapController controller) {
                  _controller.complete(controller);
                  latitude = state.position.latitude;
                  longitude = state.position.longitude;
                },
              );
            }),
          );
        }
        return Container();
      }),
    );
  }
}
