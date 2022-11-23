import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/config/routes/routes.dart';
import 'package:tip_tracker/modules/splash/cubit/splash_cubit.dart';

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
                context, Routes.indexScreen, (route) => false);
          });
          splashCubit.close();
        }
        if (state is SplashError) {
          SchedulerBinding.instance.addPostFrameCallback((timeStamp) {
            Navigator.pushNamedAndRemoveUntil(
                context, Routes.authIndexScreen, (route) => false);
          });
          splashCubit.close();
        }
        return Container(
          color: const Color(0xff183A37),
          child: FlutterLogo(size: MediaQuery.of(context).size.height),
        );
      },
    );
  }
}
