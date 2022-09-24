import 'package:flutter/material.dart';

class ManualEntry extends StatefulWidget {
  const ManualEntry({Key? key}) : super(key: key);

  @override
  State<ManualEntry> createState() => _ManualEntryState();
}

class _ManualEntryState extends State<ManualEntry> {
  bool tipsOn = true;
  bool hoursOn = true;
  bool milesOn = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xff183A37),

      //  AppBar
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0.0,
        centerTitle: true,
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            //ADD buttons in here
            createButton('Miles'),
            createButton('Tips'),
            createButton('Hours')
          ],
        ),
      ),

      //  Body
      body: SafeArea(
          child: Center(
              child: Column(
        children: [],
      ))),
    );
  }

  GestureDetector createButton(String text) {
    GestureDetector newButton = GestureDetector(
      //Handle Gesture
      onTap: null,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 4),
        child: Center(
          child: Text(
            text,
            style: TextStyle(
              color: Color(0xffEFD6AC),
              fontSize: 16,
            ),
          ),
        ),
      ),
    );

    return newButton;
  }
}
