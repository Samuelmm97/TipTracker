import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/core/auth/login/login_screen.dart';
import 'package:tip_tracker/core/auth/registration/registration_screen.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({Key? key}) : super(key: key);

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  //  Text field controllers
  static final fname = TextEditingController();
  static final lname = TextEditingController();
  static final phoneNo = TextEditingController();

  @override
  void initState() {
    super.initState();
    // TODO init controllers
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xff183A37),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
              //  TODO cuibit BlocBuilder
              ),
        ),
      ),
    );
  }
}
