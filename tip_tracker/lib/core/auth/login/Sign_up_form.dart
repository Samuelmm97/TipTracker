import 'package:flutter/material.dart';

class Sign_up_form extends StatefulWidget {
  const Sign_up_form({Key? key}) : super(key: key);

  @override
  State<Sign_up_form> createState() => _Sign_up_formState();
}

class _Sign_up_formState extends State<Sign_up_form> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: Column(
            children: [Text('Sign up form')],
          ),
        ),
      ),
    );
  }
}
