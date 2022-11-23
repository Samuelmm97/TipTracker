import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/core/auth/onboarding/cubit/onboarding_cubit.dart';

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

  //  Page Controller
  final PageController controller = PageController();

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
            child: BlocBuilder<OnboardingCubit, OnboardingState>(
                builder: (context, state) {
              return Expanded(
                //  PageView
                child: PageView(
                  controller: controller,
                  children: [UserOnboarding()],
                ),
              );
            }),
          ),
        ),
      ),
    );
  }

  //  User onboarding page TODO
  Widget UserOnboarding() {
    return Scaffold(
        body: Center(
      child: Text('This is the user onboarding page'),
    ));
  }
}
