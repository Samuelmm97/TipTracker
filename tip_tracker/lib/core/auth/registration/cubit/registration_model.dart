class RegistrationModel {
  String email;
  String fullName;
  String password;
  String confirmPassword;

  RegistrationModel(
    this.email,
    this.fullName,
    this.password,
    this.confirmPassword,
  );

  Map<String, dynamic> toJson() => {
        "email": email,
        "fullName": fullName,
        "password": password,
        "confirmPassword": confirmPassword,
      };
}
