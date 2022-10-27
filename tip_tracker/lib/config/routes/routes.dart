import 'package:flutter/material.dart';
import 'package:tip_tracker/modules/index/index_screen.dart';
import 'package:tip_tracker/core/auth/auth_index_screen.dart';
import 'package:tip_tracker/core/auth/login/login_screen.dart';
import 'package:tip_tracker/core/auth/registration/registration_screen.dart';
import 'package:tip_tracker/modules/index/index_screen.dart';
import 'package:tip_tracker/modules/splash/splash_screen.dart';

class Routes {
  static String indexScreen = "/";
  static String splashScreen = "/splashscreen/";
  static String userScreen = "/user/";
  static String loginScreen = "/login/";
  static String registerScreen = "/register/";
  static String authIndexScreen = "/auth/";

  static Map<String, WidgetBuilder> buildRoutes() {
    return {
      // AUTHENTICATION
      splashScreen: (BuildContext context) => const SplashScreen(),
      loginScreen: (BuildContext context) => const LoginScreen(),
      registerScreen: (BuildContext context) => const RegistrationScreen(),
      authIndexScreen: (BuildContext context) => const AuthIndexScreen(),
      // ForgotPassword.routeName: (BuildContext context) =>
      //     ForgotPassword(),

      // Modules
      indexScreen: (BuildContext context) => const IndexScreen(),
      // userScreen: (BuildContext context) => const UserProfileScreen(),
    };
  }
}
