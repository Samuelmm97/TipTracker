import 'package:flutter/material.dart';
import 'package:tip_tracker/core/auth/login/login_screen.dart';
import 'package:tip_tracker/core/auth/registration/registration_screen.dart';

class AuthIndexScreen extends StatefulWidget {
  const AuthIndexScreen({Key? key}) : super(key: key);

  @override
  State<AuthIndexScreen> createState() => _AuthIndexScreenState();
}

class _AuthIndexScreenState extends State<AuthIndexScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xff183A37),
      body: SafeArea(
        child: Center(
          child: Column(children: [
            //LOGO
            const SizedBox(height: 149),
            const Text(
              'TIPMATE',
              style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 64,
                  color: Color(0xffEFD6AC)),
            ), //Text

            //Sign in Button
            const SizedBox(
              height: 128,
            ),
            GestureDetector(
              //Handle Gesture
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const LoginScreen()),
                );
              },

              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 25.0),
                child: Container(
                  padding: const EdgeInsets.fromLTRB(16, 12, 12, 16),
                  decoration: BoxDecoration(
                      border: Border.all(color: const Color(0xff0BFF4F)),
                      borderRadius: BorderRadius.circular(16)),
                  child: const Center(
                    child: Text(
                      'Sign In',
                      style: TextStyle(
                        color: Color(0xff0BFF4F),
                        fontSize: 32,
                      ),
                    ),
                  ),
                ),
              ),
            ),

            //Sign UP button
            const SizedBox(
              height: 32,
            ),
            GestureDetector(
              //Handle Gesture
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => const RegistrationScreen()),
                );
              },

              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 25.0),
                child: Container(
                  padding: const EdgeInsets.fromLTRB(16, 12, 12, 16),
                  decoration: BoxDecoration(
                      border: Border.all(color: const Color(0xff0BFF4F)),
                      borderRadius: BorderRadius.circular(16)),
                  child: const Center(
                    child: Text(
                      'Create Account',
                      style: TextStyle(
                        color: Color(0xff0BFF4F),
                        fontSize: 32,
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ]),
        ),
      ),
    );
  }
}
