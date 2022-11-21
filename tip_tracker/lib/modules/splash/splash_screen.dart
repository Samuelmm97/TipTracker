import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/config/routes/routes.dart';
import 'package:tip_tracker/modules/splash/cubit/splash_cubit.dart';

// TODO: Check if user has been onboarded.
class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  SplashCubit splashCubit = SplashCubit();

  @override
  void initState() {
    super.initState();
    splashCubit.verifyToken();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<SplashCubit, SplashState>(
      bloc: splashCubit,
      builder: (context, state) {
        if (state is SplashLoaded) {
          SchedulerBinding.instance.addPostFrameCallback((timeStamp) {
            Navigator.pushNamedAndRemoveUntil(
                context, Routes.index, (route) => false);
          });
          splashCubit.close();
        }
        if (state is SplashError) {
          SchedulerBinding.instance.addPostFrameCallback((timeStamp) {
            Navigator.pushNamedAndRemoveUntil(
                context, Routes.authIndex, (route) => false);
          });
          splashCubit.close();
        }
        return Container(
          color: Colors.white,
          child: FlutterLogo(size: MediaQuery.of(context).size.height),
        );
      },
    );
  }
}
