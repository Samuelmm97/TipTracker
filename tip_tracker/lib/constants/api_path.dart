import 'dart:io';

import 'package:flutter/foundation.dart';

class ApiPath {
  late String apiPath;
  static String androidLocalhost = "http://10.0.2.2:3000";
  static String iosLocalhost = "http://localhost:3000";
  static String host = "API URL!";

  ApiPath() {
    if (!kDebugMode) {
      apiPath = host;
    } else if (Platform.isAndroid) {
      apiPath = androidLocalhost;
    } else {
      apiPath = iosLocalhost;
    }
  }
}
