/// This class is used to manage the data used to register the user through
/// [OnboardingCubit].
class OnboardingModel {
  String email;
  String password;
  String confirmPassword;

  OnboardingModel({
    this.email = "",
    this.password = "",
    this.confirmPassword = "",
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
        "password": password,
        "confirmPassword": confirmPassword,
      };
}
