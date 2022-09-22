class UserModel {
  int id;
  String name;
  String phone;
  LocationModel location;
  
  UserModel(this.id, this.name, this.phone, this.location);

  UserModel.fromJson(dynamic json):
    id = json["id"],
    name = json["name"],
    phone = json["phone"],
    location = LocationModel.fromJson(json["location"]);

  Map<String, dynamic> toJson() => {
    "id": id,
    "name": name,
    "phone": phone,
    "location": location.toJson(),
  };

}

class LocationModel {
  String? address;
  double? latitude;
  double? longitude;

  LocationModel(this.address, this.latitude, this.longitude);

  LocationModel.fromJson(dynamic json):
    address = json["address"],
    latitude = double.tryParse(json["latitude"]),
    longitude = double.tryParse(json["longitude"]);

  Map<String, dynamic> toJson() => {
    "address": address,
    "latitude": latitude,
    "longitude": longitude,
  };
}