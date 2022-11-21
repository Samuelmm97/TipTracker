import 'package:flutter/material.dart';
import 'package:tip_tracker/core/auth/onboarding/onboarding_screen.dart';
import 'package:tip_tracker/modules/index/index_screen.dart';
import 'package:tip_tracker/core/auth/auth_index_screen.dart';
import 'package:tip_tracker/core/auth/login/login_screen.dart';
import 'package:tip_tracker/core/auth/registration/registration_screen.dart';
import 'package:tip_tracker/modules/splash/splash_screen.dart';
import 'package:tip_tracker/main.dart';

/// This class serves 2 purposes. To manage ease of access to all screen routes,
/// and to build those routes via [buildRoutes] for [MyApp].
class Routes {
  static String index = "/";
  static String splash = "/splashscreen/";
  static String user = "/user/";
  static String login = "/login/";
  static String register = "/register/";
  static String authIndex = "/auth/";
  static String onboarding = "/onboarding/";

  /// Used to build routes for [MyApp].
  ///
  /// Retuns [Map] of keys of type [String] and values of type [WidgetBuilder].
  static Map<String, WidgetBuilder> buildRoutes() {
    return {
      // AUTHENTICATION
      splash: (BuildContext context) => const SplashScreen(),
      login: (BuildContext context) => const LoginScreen(),
      register: (BuildContext context) => const RegistrationScreen(),
      authIndex: (BuildContext context) => const AuthIndexScreen(),
      onboarding: (BuildContext context) => const OnboardingScreen(),
      // ForgotPassword.routeName: (BuildContext context) =>
      //     ForgotPassword(),

      // Modules
      index: (BuildContext context) => const IndexScreen(),
      // userScreen: (BuildContext context) => const UserProfileScreen(),
    };
  }
}
