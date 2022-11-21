import 'package:tip_tracker/modules/index/pages/map/cubit/location_model.dart';

class UserModel {
  int id;
  String email;
  // String name;
  // String phone;
  LocationModel location;

  UserModel(
    this.id,
    this.email,
    // this.name, this.phone,
    this.location,
  );

  UserModel.fromJson(dynamic json)
      : id = json["id"],
        email = json["email"],
        // name = json["name"],
        // phone = json["phone"],
        location = LocationModel.fromJson(json["location"]);

  Map<String, dynamic> toJson() => {
        "id": id,
        "email": email,
        // "name": name,
        // "phone": phone,
        "location": location.toJson(),
      };
}
