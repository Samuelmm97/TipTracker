class RegistrationModel {
  String email;
  String password;
  String confirmPassword;

  RegistrationModel(
    this.email,
    this.password,
    this.confirmPassword,
  );

  Map<String, dynamic> toJson() => {
        "email": email,
        "password": password,
        "confirmPassword": confirmPassword,
      };
}
