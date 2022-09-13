import 'package:flutter/material.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xff183A37),
      body: SafeArea(
        child: Center(
          child: Column(children: [
            //LOGO
            SizedBox(height: 149),
            Text(
              'Replace me with logo',
              style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 32,
                  color: Color(0xffEFD6AC)),
            ),

            //Sign in Button

            //Log in Button
          ]),
        ),
      ),
    );
  }
}
