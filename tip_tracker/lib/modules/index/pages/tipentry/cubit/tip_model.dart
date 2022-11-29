import 'package:tip_tracker/core/user/user_model.dart';

class TipEntryModel {
  int userId;
  LocationModel? address;
  Map<String, dynamic>? latlng = {};
  double amount;

  TipEntryModel({
    this.amount = 0,
    this.userId = 0,
  });

  /// Returns this model as a JSON structure, [Map] of keys that are of type
  /// [String], and values that may be of any type, in dart.
  ///
  /// ```
  /// {
  ///   "userId": "userId@test.com",
  ///   "password": "password123",
  /// }
  /// ```
  Map<String, dynamic> toJson() => {
        "user_id": userId,
        "amount": amount,
        "latlng": latlng,
        "address": address?.toJson(),
      };
}
