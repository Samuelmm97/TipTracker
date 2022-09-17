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
      backgroundColor: const Color(0xff183A37),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            child: Column(
              children: [
                //  Welcome message
                Text(
                  'Welcome Back',
                  style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 48,
                      color: Color(0xffEFD6AC)),
                ),
                SizedBox(
                  height: 64,
                ),

                //  Email text field
                Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16, vertical: 32),
                    child: Container(
                      decoration: BoxDecoration(
                          color: Color(0xff04151F),
                          borderRadius: BorderRadius.circular(16)),
                      child: Padding(
                        padding: EdgeInsets.only(left: 20.0),
                        child: TextField(
                          style: TextStyle(color: Color(0xff3F3B3B)),
                          decoration: InputDecoration(
                            border: InputBorder.none,
                            hintText: 'Email',
                            hintStyle: TextStyle(color: Color(0xff3F3B3B)),
                          ),
                        ),
                      ),
                    )),

                //  Password text field
                Padding(
                    padding: EdgeInsets.symmetric(horizontal: 16),
                    child: Container(
                      decoration: BoxDecoration(
                          color: Color(0xff04151F),
                          borderRadius: BorderRadius.circular(16)),
                      child: Padding(
                        padding: EdgeInsets.only(left: 20.0),
                        child: TextField(
                          obscureText: true,
                          style: TextStyle(color: Color(0xff3F3B3B)),
                          decoration: InputDecoration(
                            border: InputBorder.none,
                            hintText: 'Password',
                            hintStyle: TextStyle(color: Color(0xff3F3B3B)),
                          ),
                        ),
                      ),
                    )),

                //  Sign in button
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 64, vertical: 32),
                  child: Container(
                    padding: EdgeInsets.fromLTRB(16, 8, 16, 8),
                    decoration: BoxDecoration(
                        border: Border.all(color: Color(0xff0BFF4F)),
                        borderRadius: BorderRadius.circular(16)),
                    child: Center(
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
              ],
            ),
          ),
        ),
      ),
    );
  }
}
