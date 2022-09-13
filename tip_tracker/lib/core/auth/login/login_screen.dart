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
              'TIPMATE',
              style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 64,
                  color: Color(0xffEFD6AC)),
            ), //Text

            //Sign in Button
            SizedBox(
              height: 128,
            ),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 25.0),
              child: Container(
                padding: EdgeInsets.fromLTRB(16, 12, 12, 16),
                decoration: BoxDecoration(
                    border: Border.all(color: Color(0xff0BFF4F)),
                    borderRadius: BorderRadius.circular(16)),
                child: Center(
                  child: Text(
                    'Sign In',
                    style: TextStyle(
                        color: Color(0xff0BFF4F),
                        fontSize: 32,
                        fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ),

            //Log in Button
            SizedBox(
              height: 32,
            ),
            Padding(
              padding: EdgeInsets.symmetric(horizontal: 25.0),
              child: Container(
                padding: EdgeInsets.fromLTRB(16, 12, 12, 16),
                decoration: BoxDecoration(
                    border: Border.all(color: Color(0xff0BFF4F)),
                    borderRadius: BorderRadius.circular(16)),
                child: Center(
                  child: Text(
                    'Create Account',
                    style: TextStyle(
                        color: Color(0xff0BFF4F),
                        fontSize: 32,
                        fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            )
          ]),
        ),
      ),
    );
  }
}
