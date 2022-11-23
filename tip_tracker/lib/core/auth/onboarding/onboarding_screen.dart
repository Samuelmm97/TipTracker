import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/core/auth/onboarding/cubit/onboarding_cubit.dart';
import 'package:tip_tracker/config/styles/form_field_style.dart';

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
      resizeToAvoidBottomInset: false,
      backgroundColor: const Color(0xff183A37),
      body: SafeArea(
        child: Center(
          child: BlocBuilder<OnboardingCubit, OnboardingState>(
              builder: (context, state) {
            return Container(
              padding: const EdgeInsets.all(40),
              child: Column(
                children: [
                  Expanded(
                    //  PageView
                    child: PageView(
                      physics: const NeverScrollableScrollPhysics(),
                      controller: controller,
                      children: [userOnboarding(), carPage()],
                    ),
                  ),
                  nextButton(),
                ],
              ),
            );
          }),
        ),
      ),
    );
  }

  //  User onboarding page TODO (Other pages)
  Widget userOnboarding() {
    return Scaffold(
        backgroundColor: Colors.transparent,
        body: SingleChildScrollView(
          child: Center(
              child: Column(
            children: [
              const Text(
                'Let\'s get you set up',
                style: TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 32,
                    color: Color(0xffEFD6AC)),
              ),
              const Padding(
                padding: EdgeInsets.only(top: 16),
                child: Icon(
                  Icons.create,
                  size: 48,
                  color: Color(0xffEFD6AC),
                ),
              ),
              const SizedBox(
                height: 64,
              ),

              //  First Name text field
              Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                  child: TextFormField(
                    controller: fname,
                    style: formFieldTextStyle,
                    decoration: FormFieldInputDecoration('First Name'),
                    // TODO onChanged
                    // TODO validator
                  )),

              //  Last Name text field
              Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                  child: TextFormField(
                    controller: lname,
                    style: formFieldTextStyle,
                    decoration: FormFieldInputDecoration('Last Name'),
                    // TODO onChanged
                    // TODO validator
                  )),

              //  Phone number text field
              Padding(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                  child: TextFormField(
                    controller: phoneNo,
                    style: formFieldTextStyle,
                    decoration: FormFieldInputDecoration('Phone No.'),
                    // TODO onChanged
                    // TODO validator
                  )),
            ],
          )),
        ));
  }

  Widget carPage() {
    return Text('This is the car page');
  }

  //  Next button widget
  Widget nextButton() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(64, 32, 64, 16),
      child: MaterialButton(
        //On tap move to next page if on last page submit
        onPressed: () async {
          //  TODO logic

          controller.nextPage(
              duration: Duration(milliseconds: 100), curve: Curves.linear);
        },

        // Button Design
        child: Container(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
          decoration: BoxDecoration(
              border: Border.all(color: const Color(0xff0BFF4F)),
              borderRadius: BorderRadius.circular(16)),
          child: const Center(
            child: Text(
              'Next',
              style: TextStyle(
                color: Color(0xff0BFF4F),
                fontSize: 24,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
