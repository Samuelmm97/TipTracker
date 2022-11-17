import 'dart:io';

import 'package:flutter/foundation.dart';

/// Class used to dynamically retrieve the necessary API base URL, based on
/// platform and if the application is running in debug or production.
class ApiPath {
  late String apiPath;

  /// Base URL for Android
  static String androidLocalhost = "http://10.0.2.2:3000";

  /// Base URL for iOS.
  static String iosLocalhost = "http://localhost:3000";

  /// Base URL for production.
  static String prod = "API URL!";

  /// If the app is being run in production, this consutructor sets [apiPath] to
  /// [prod]. Otherwise, it sets [apiPath] to it's respective platform URL,
  /// [androidLocalHost] or [iosLocalHost].
  ApiPath() {
    if (!kDebugMode) {
      apiPath = prod;
    } else if (Platform.isAndroid) {
      apiPath = androidLocalhost;
    } else {
      apiPath = iosLocalhost;
    }
  }
}
