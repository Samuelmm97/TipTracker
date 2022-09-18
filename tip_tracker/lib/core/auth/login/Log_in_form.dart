import 'package:flutter/material.dart';

class Log_in_form extends StatefulWidget {
  const Log_in_form({Key? key}) : super(key: key);

  @override
  State<Log_in_form> createState() => _Log_in_formState();
}

class _Log_in_formState extends State<Log_in_form> {
  final _emailFieldController = TextEditingController();
  final _passwordFieldController = TextEditingController();

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
                    padding: const EdgeInsets.symmetric(
                        horizontal: 16, vertical: 32),
                    child: Container(
                      decoration: BoxDecoration(
                          color: const Color(0xff04151F),
                          borderRadius: BorderRadius.circular(16)),
                      child: Padding(
                        padding: const EdgeInsets.only(left: 20.0),
                        child: TextField(
                          controller: _emailFieldController,
                          style: const TextStyle(color: Color(0xff3F3B3B)),
                          decoration: const InputDecoration(
                            border: InputBorder.none,
                            hintText: 'Email',
                            hintStyle: TextStyle(color: Color(0xff3F3B3B)),
                          ),
                        ),
                      ),
                    )),

                //  Password text field
                Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Container(
                      decoration: BoxDecoration(
                          color: const Color(0xff04151F),
                          borderRadius: BorderRadius.circular(16)),
                      child: Padding(
                        padding: const EdgeInsets.only(left: 20.0),
                        child: TextField(
                          controller: _passwordFieldController,
                          obscureText: true,
                          style: const TextStyle(color: Color(0xff3F3B3B)),
                          decoration: const InputDecoration(
                            border: InputBorder.none,
                            hintText: 'Password',
                            hintStyle: TextStyle(color: Color(0xff3F3B3B)),
                          ),
                        ),
                      ),
                    )),

                //  Sign in button
                Padding(
                  padding: const EdgeInsets.fromLTRB(64, 32, 64, 16),
                  child: GestureDetector(
                    //On tap await authorization method?

                    child: Container(
                      padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
                      decoration: BoxDecoration(
                          border: Border.all(color: const Color(0xff0BFF4F)),
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
      ),
    );
  }
}
