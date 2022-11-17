import 'package:flutter/material.dart';
import 'package:tip_tracker/modules/index/index_screen.dart';
import 'package:tip_tracker/core/auth/auth_index_screen.dart';
import 'package:tip_tracker/core/auth/login/login_screen.dart';
import 'package:tip_tracker/core/auth/registration/registration_screen.dart';
import 'package:tip_tracker/modules/splash/splash_screen.dart';
import 'package:tip_tracker/main.dart';

/// This class serves 2 purposes. To manage ease of access to all screen routes,
/// and to build those routes via [buildRoutes] for [MyApp].
class Routes {
  static String indexScreen = "/";
  static String splashScreen = "/splashscreen/";
  static String userScreen = "/user/";
  static String loginScreen = "/login/";
  static String registerScreen = "/register/";
  static String authIndexScreen = "/auth/";

  /// Used to build routes for [MyApp].
  ///
  /// Retuns [Map] of keys of type [String] and values of type [WidgetBuilder].
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
