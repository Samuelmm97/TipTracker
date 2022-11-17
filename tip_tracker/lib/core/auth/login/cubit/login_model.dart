/// This class is used to manage the data used to login the user through
/// [LoginCubit].
class LoginModel {
  String email;
  String password;

  LoginModel({
    this.email = "",
    this.password = "",
  });

  /// Returns this model as a JSON structure, [Map] of keys that are of type
  /// [String], and values that may be of any type, in dart.
  ///
  /// ```
  /// {
  ///   "email": "email@test.com",
  ///   "password": "password123",
  /// }
  /// ```
  Map<String, dynamic> toJson() => {
        "email": email,
        "password": password,
      };
}
