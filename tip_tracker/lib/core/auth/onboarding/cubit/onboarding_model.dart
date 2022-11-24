import 'package:tip_tracker/modules/index/pages/map/cubit/location_model.dart';

/// This class is used to manage the data used to register the user through
/// [OnboardingCubit].
class OnboardingModel {
  String employeeType;
  double? hoursPerWeek; // If stationary
  LocationModel? workAddress; // if stationary
  DateTime? dob;
  double wage;
  int userId;
  String email;

  OnboardingModel({
    this.email = "",
    this.employeeType = "stationary",
    this.hoursPerWeek, // If stationary
    this.workAddress, // if stationary
    this.dob,
    this.wage = 0,
    this.userId = 0,
  });

  /// Returns this model as a JSON structure, [Map] of keys that are of type
  /// [String], and values that may be of any type, in dart.
  ///
  /// ```
  /// {
  ///   "email": "email@test.com",
  ///   "password": "password123",
  ///   "confirmPassword": "password123",
  /// }
  /// ```
  Map<String, dynamic> toJson() => {
        "email": email,
        "employeeType": employeeType,
        "hoursPerWeek": hoursPerWeek, // If stationary
        "workAddress": workAddress!.toJson(), // if stationary
        "wage": wage,
        "userId": userId,
      };
}
