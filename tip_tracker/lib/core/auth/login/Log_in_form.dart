import 'package:flutter/material.dart';

class Log_in_form extends StatefulWidget {
  const Log_in_form({Key? key}) : super(key: key);

  @override
  State<Log_in_form> createState() => _Log_in_formState();
}

class _Log_in_formState extends State<Log_in_form> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: Column(
            children: [Text('Log in form')],
          ),
        ),
      ),
    );
  }
}
