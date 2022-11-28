class UserModel {
  int id;
  String email;
  // String name;
  // String phone;
  // LocationModel location;

  UserModel(
    this.id,
    this.email,
    // this.name, this.phone, this.location,
  );

  UserModel.fromJson(dynamic json)
      : id = json["id"],
        email = json["email"];
  // name = json["name"],
  // phone = json["phone"],
  // location = LocationModel.fromJson(json["location"]);

  Map<String, dynamic> toJson() => {
        "id": id,
        "email": email,
        // "name": name,
        // "phone": phone,
        // "location": location.toJson(),
      };
}

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
