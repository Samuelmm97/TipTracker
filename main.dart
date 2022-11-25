//tracking page

library google_maps_flutter_heatmap;

import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_polyline_points/flutter_polyline_points.dart';
import 'package:hm/constants.dart';
import 'package:location/location.dart';
import 'package:google_maps_flutter_heatmap/google_maps_flutter_heatmap.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Google Maps Demo',
      home: MapSample(), //tracking page for mobile
    );
  }
}

class TrackingPage extends StatefulWidget {
  const TrackingPage({Key? key}) : super(key: key);

  @override
  State<TrackingPage> createState() => TrackingPageState();
}

class TrackingPageState extends State<TrackingPage> {
  final Completer<GoogleMapController> _controller = Completer();

  static const LatLng sourceLocation = LatLng(37.335, -122.0327);
  static const LatLng destination = LatLng(37.33429383, -122.06600055);

  List<LatLng> polylineCoordinates = [];
  LocationData? currentLocation;

  BitmapDescriptor sourceIcon = BitmapDescriptor.defaultMarker;
  BitmapDescriptor destinationIcon = BitmapDescriptor.defaultMarker;
  BitmapDescriptor currentLocationIcon = BitmapDescriptor.defaultMarker;

  void getCurrentLocation() async {
    Location location = Location();

    location.getLocation().then(
      (location) {
        currentLocation = location;
      },
    );

    GoogleMapController googleMapController = await _controller.future;

    location.onLocationChanged.listen((newLoc) {
      currentLocation = newLoc;

      googleMapController.animateCamera(
        CameraUpdate.newCameraPosition(
          CameraPosition(
            zoom: 14,
            target: LatLng(
              newLoc.latitude!,
              newLoc.longitude!,
            ),
          ),
        ),
      );

      setState(() {});
    });
  }

  void getPolyPoints() async {
    PolylinePoints polylinePoints = PolylinePoints();

    PolylineResult result = await polylinePoints.getRouteBetweenCoordinates(
      google_api_key,
      PointLatLng(sourceLocation.latitude, sourceLocation.longitude),
      PointLatLng(destination.latitude, destination.longitude),
    );

    if (result.points.isNotEmpty) {
      result.points.forEach(
        (PointLatLng point) => polylineCoordinates.add(
          LatLng(point.latitude, point.longitude),
        ),
      );
      setState(() {});
    }
  }

  void setCustomMarkerIcon() {
    BitmapDescriptor.fromAssetImage(
            ImageConfiguration.empty, "assets/use a source icon")
        .then((icon) {
      sourceIcon = icon;
    });
    BitmapDescriptor.fromAssetImage(
            ImageConfiguration.empty, "assets/use a destination icon")
        .then((icon) {
      destinationIcon = icon;
    });
    BitmapDescriptor.fromAssetImage(
            ImageConfiguration.empty, "assets/use a badge icon")
        .then((icon) {
      currentLocationIcon = icon;
    });
  }

  @override
  void initState() {
    getCurrentLocation();
    setCustomMarkerIcon();
    getPolyPoints();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text(
            "Tracking",
            style: TextStyle(color: Colors.black, fontSize: 16),
          ),
        ),
        body: currentLocation == null
            ? const Center(child: Text("Loading"))
            : GoogleMap(
                initialCameraPosition: CameraPosition(
                  target: LatLng(
                      currentLocation!.latitude!, currentLocation!.longitude!),
                  zoom: 14,
                ),
                polylines: {
                  Polyline(
                    polylineId: PolylineId("route"),
                    points: polylineCoordinates,
                    color: primaryColor,
                    width: 6,
                  ),
                },
                markers: {
                  Marker(
                    markerId: MarkerId("currentLocation"),
                    icon: currentLocationIcon,
                    position: LatLng(currentLocation!.latitude!,
                        currentLocation!.longitude!),
                  ),
                  Marker(
                    markerId: MarkerId("source"),
                    icon: sourceIcon,
                    position: sourceLocation,
                  ),
                  Marker(
                    markerId: MarkerId("destination"),
                    icon: destinationIcon,
                    position: destination,
                  ),
                },
                onMapCreated: (mapController) {
                  _controller.complete(mapController);
                },
              ));
  }
}

class MapSample extends StatefulWidget {
  @override
  State<MapSample> createState() => MapSampleState();
}

//heatmap sample implementation
class MapSampleState extends State<MapSample> {
  Completer<GoogleMapController> _controller = Completer();
  final Set<Heatmap> _heatmaps = {};
  static final CameraPosition _kGooglePlex = CameraPosition(
    target: LatLng(37.42796133580664, -122.085749655962),
    zoom: 14.4746,
  );
  LatLng _heatmapLocation = LatLng(37.42796133580664, -122.085749655962);
  static final CameraPosition _kLake = CameraPosition(
      bearing: 192.8334901395799,
      target: LatLng(37.43296265331129, -122.08832357078792),
      tilt: 59.440717697143555,
      zoom: 19.151926040649414);

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      body: GoogleMap(
        mapType: MapType.hybrid,
        initialCameraPosition: _kGooglePlex,
        heatmaps: _heatmaps,
        onMapCreated: (GoogleMapController controller) {
          _controller.complete(controller);
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _goToTheLake,
        label: Text('To the lake!'),
        icon: Icon(Icons.directions_boat),
      ),
    );
  }

  void _addHeatmap() {
    setState(() {
      _heatmaps.add(Heatmap(
          heatmapId: HeatmapId(_heatmapLocation.toString()),
          points: _createPoints(_heatmapLocation),
          radius: 20,
          visible: true,
          gradient: HeatmapGradient(
              colors: <Color>[Colors.green, Colors.red],
              startPoints: <double>[0.2, 0.8])));
    });
  }

  //heatmap generation helper functions
  List<WeightedLatLng> _createPoints(LatLng location) {
    final List<WeightedLatLng> points = <WeightedLatLng>[];
    //Can create multiple points here
    points.add(_createWeightedLatLng(location.latitude, location.longitude, 1));
    points.add(
        _createWeightedLatLng(location.latitude - 1, location.longitude, 1));
    return points;
  }

  WeightedLatLng _createWeightedLatLng(double lat, double lng, int weight) {
    return WeightedLatLng(point: LatLng(lat, lng), intensity: weight);
  }

  Future<void> _goToTheLake() async {
    final GoogleMapController controller = await _controller.future;
    controller.animateCamera(CameraUpdate.newCameraPosition(_kLake));
  }
}
