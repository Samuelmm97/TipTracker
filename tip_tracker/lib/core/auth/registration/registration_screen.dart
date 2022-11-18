import 'package:email_validator/email_validator.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/config/routes/routes.dart';
import 'package:tip_tracker/config/styles/error_message_style.dart';
import 'package:tip_tracker/config/styles/form_field_style.dart';
import 'package:tip_tracker/core/auth/registration/cubit/registration_cubit.dart';

class RegistrationScreen extends StatefulWidget {
  const RegistrationScreen({Key? key}) : super(key: key);

  @override
  State<RegistrationScreen> createState() => _RegistrationScreenState();
}

class _RegistrationScreenState extends State<RegistrationScreen> {
  static final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  final email = TextEditingController();
  final password = TextEditingController();
  final confirmPassword = TextEditingController();

  @override
  void initState() {
    super.initState();
    email.text =
        BlocProvider.of<RegistrationCubit>(context).registrationModel.email;
    password.text =
        BlocProvider.of<RegistrationCubit>(context).registrationModel.password;
    confirmPassword.text = BlocProvider.of<RegistrationCubit>(context)
        .registrationModel
        .confirmPassword;
  }

  // TODO: Display error message

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xff183A37),

      //  Appbar for back button
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0.0,
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            child: BlocBuilder<RegistrationCubit, RegistrationState>(
                builder: (context, state) {
              return Form(
                key: _formKey,
                child: Column(
                  children: [
                    //  Welcome message
                    const Text(
                      'Join Us',
                      style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 48,
                          color: Color(0xffEFD6AC)),
                    ),

                    //Sub Text
                    const Text(
                      'Add Subtext Here',
                      style: TextStyle(fontSize: 16, color: Color(0xffEFD6AC)),
                    ),
                    const SizedBox(
                      height: 64,
                    ),

                    //  Email text field
                    Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: TextFormField(
                          controller: email,
                          style: formFieldTextStyle,
                          decoration: FormFieldInputDecoration('Email'),
                          onChanged: (value) =>
                              BlocProvider.of<RegistrationCubit>(context)
                                  .registrationModel
                                  .email = value,
                          validator: (value) {
                            if (value == "") {
                              return "Field must not be empty";
                            } else if (value != null &&
                                !EmailValidator.validate(value)) {
                              return "Email is not valid";
                            }
                            return null;
                          },
                        )),

                    //  Password text field
                    Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 32),
                      child: TextFormField(
                        controller: password,
                        obscureText: true,
                        style: formFieldTextStyle,
                        decoration: FormFieldInputDecoration('Password'),
                        onChanged: (value) =>
                            BlocProvider.of<RegistrationCubit>(context)
                                .registrationModel
                                .password = value,
                        validator: (value) {
                          if (value == "") {
                            return "Field must not be empty";
                          } else if (value != confirmPassword.text) {
                            return "Passwords do not match";
                          }
                          return null;
                        },
                      ),
                    ),

                    //  Re Enter Password Field
                    Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: TextFormField(
                          controller: confirmPassword,
                          obscureText: true,
                          style: formFieldTextStyle,
                          decoration:
                              FormFieldInputDecoration('Re-enter password'),
                          onChanged: (value) =>
                              BlocProvider.of<RegistrationCubit>(context)
                                  .registrationModel
                                  .password = value,
                          validator: (value) {
                            if (value == "") {
                              return "Field must not be empty";
                            } else if (value != password.text) {
                              return "Passwords do not match";
                            }
                            return null;
                          },
                        )),

                    if (state is RegistrationError)
                      Text(state.errorMessage, style: errorMessageStyle),

                    //  Register button
                    Padding(
                      padding: const EdgeInsets.fromLTRB(64, 32, 64, 16),
                      child: GestureDetector(
                        //On tap await user creation method?
                        onTap: () async {
                          if (_formKey.currentState?.validate() != null &&
                              _formKey.currentState?.validate() == true) {
                            // Login
                            bool loginSuccess =
                                await BlocProvider.of<RegistrationCubit>(
                                        context)
                                    .register();
                            // Do not use BuildContexts across async gaps (don't route without checking if this state is in the tree): https://www.flutteroverflow.dev/use-build-context-synchronously/
                            if (!mounted) return;
                            if (loginSuccess) {
                              await Navigator.pushNamedAndRemoveUntil(
                                  context, Routes.index, (route) => false);
                            }
                          }
                        },
                        child: const Center(
                          child: Text(
                            'Sign Up',
                            style: TextStyle(
                              color: Color(0xff0BFF4F),
                              fontSize: 24,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}
