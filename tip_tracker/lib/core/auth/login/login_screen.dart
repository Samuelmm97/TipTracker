import 'package:email_validator/email_validator.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:tip_tracker/config/routes/routes.dart';
import 'package:tip_tracker/core/auth/login/cubit/login_cubit.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  // Used for form validation
  static final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final email = TextEditingController();
  final password = TextEditingController();

  @override
  void initState() {
    super.initState();
    email.text = BlocProvider.of<LoginCubit>(context).email;
    password.text = BlocProvider.of<LoginCubit>(context).password;
  }

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
            child:
                BlocBuilder<LoginCubit, LoginState>(builder: (context, state) {
              return Form(
                key: _formKey,
                child: Center(
                  child: SizedBox(
                    width: MediaQuery.of(context).size.width * .7,
                    child: Column(
                      children: [
                        //  Welcome message
                        const Text(
                          'Welcome Back',
                          style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 48,
                              color: Color(0xffEFD6AC)),
                        ),
                        const SizedBox(
                          height: 64,
                        ),

                        //  Email text field
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 32),
                          child: TextFormField(
                            controller: email,
                            onChanged: (value) =>
                                BlocProvider.of<LoginCubit>(context).email =
                                    value,
                            validator: (value) {
                              if (value == "") {
                                return "Field must not be empty";
                              } else if (value != null &&
                                  !EmailValidator.validate(value)) {
                                return "Email is not valid";
                              }
                              return null;
                            },
                            style: const TextStyle(
                                color: Color.fromARGB(190, 253, 253, 253)),
                            decoration: const InputDecoration(
                              fillColor: Color.fromARGB(255, 4, 21, 31),
                              filled: true,
                              border: OutlineInputBorder(
                                  borderRadius:
                                      BorderRadius.all(Radius.circular(16))),
                              hintText: 'Email',
                              hintStyle: TextStyle(color: Color(0xff3F3B3B)),
                            ),
                          ),
                        ),

                        //  Password text field
                        Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            child: Container(
                              decoration: BoxDecoration(
                                  color: const Color(0xff04151F),
                                  borderRadius: BorderRadius.circular(16)),
                              child: Padding(
                                padding: const EdgeInsets.only(left: 20.0),
                                child: TextFormField(
                                  controller: password,
                                  obscureText: true,
                                  onChanged: (value) =>
                                      BlocProvider.of<LoginCubit>(context)
                                          .password = value,
                                  validator: (value) {
                                    if (value == "") {
                                      return "Field must not be empty";
                                    }
                                    return null;
                                  },
                                  style:
                                      const TextStyle(color: Color(0xff3F3B3B)),
                                  decoration: const InputDecoration(
                                    border: InputBorder.none,
                                    hintText: 'Password',
                                    hintStyle:
                                        TextStyle(color: Color(0xff3F3B3B)),
                                  ),
                                ),
                              ),
                            )),

                        //  Sign in button
                        Padding(
                          padding: const EdgeInsets.fromLTRB(64, 32, 64, 16),
                          child: MaterialButton(
                            //On tap await authorization method?
                            onPressed: () async {
                              if (_formKey.currentState?.validate() != null &&
                                  _formKey.currentState?.validate() == true) {
                                // Login
                                bool loginSuccess =
                                    await BlocProvider.of<LoginCubit>(context)
                                        .login();
                                // Do not use BuildContexts across async gaps (don't route without checking if this state is in the tree): https://www.flutteroverflow.dev/use-build-context-synchronously/
                                if (!mounted) return;
                                if (loginSuccess) {
                                  await Navigator.pushNamedAndRemoveUntil(
                                      context,
                                      Routes.indexScreen,
                                      (route) => false);
                                }
                              }
                            },

                            child: Container(
                              padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
                              decoration: BoxDecoration(
                                  border: Border.all(
                                      color: const Color(0xff0BFF4F)),
                                  borderRadius: BorderRadius.circular(16)),
                              child: const Center(
                                child: Text(
                                  'Sign In',
                                  style: TextStyle(
                                    color: Color(0xff0BFF4F),
                                    fontSize: 24,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),

                        const Text(
                          'Forgot Password',
                          style: TextStyle(color: Color(0xff0BFF4F)),
                        )
                      ],
                    ),
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}
