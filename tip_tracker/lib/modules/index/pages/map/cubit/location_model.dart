class LocationModel {
  String? address;
  double? latitude;
  double? longitude;

  LocationModel(this.address, this.latitude, this.longitude);

  LocationModel.fromJson(dynamic json)
      : address = json["address"],
        latitude = double.tryParse(json["latitude"]),
        longitude = double.tryParse(json["longitude"]);

  Map<String, dynamic> toJson() => {
        "address": address,
        "latitude": latitude,
        "longitude": longitude,
      };
}
