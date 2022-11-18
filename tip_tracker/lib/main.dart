import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:tip_tracker/config/routes/routes.dart';
import 'package:tip_tracker/core/auth/login/cubit/login_cubit.dart';
import 'package:tip_tracker/core/auth/registration/cubit/registration_cubit.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        Provider<LoginCubit>(
          create: (_) => LoginCubit(),
        ),
        Provider<RegistrationCubit>(
          create: (_) => RegistrationCubit(),
        ),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: kDebugMode,
      title: 'Tips App',
      routes: Routes.buildRoutes(),
      initialRoute: Routes.splash,
    );
  }
}
