import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ManualEntry extends StatefulWidget {
  const ManualEntry({Key? key}) : super(key: key);

  @override
  State<ManualEntry> createState() => _ManualEntryState();
}

List<Widget> options = <Widget>[
  Text(
    'Miles',
    style: GoogleFonts.jost(
      fontSize: 18,
      fontWeight: FontWeight.w500,
      color: const Color(0xff04151F),
    ),
  ),
  Text(
    'Tips',
    style: GoogleFonts.jost(
      fontSize: 18,
      fontWeight: FontWeight.w500,
      color: const Color(0xff04151F),
    ),
  ),
  Text(
    'Hours',
    style: GoogleFonts.jost(
      fontSize: 18,
      fontWeight: FontWeight.w500,
      color: const Color(0xff04151F),
    ),
  )
];

class _ManualEntryState extends State<ManualEntry> {
  final List<bool> _selectedOption = <bool>[false, true, false];

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
            ToggleButtons(
                direction: Axis.horizontal,
                onPressed: (int index) {
                  setState(() {
                    for (int i = 0; i < _selectedOption.length; i++) {
                      _selectedOption[i] = i == index;
                    }
                  });
                },
                renderBorder: false,
                selectedColor: const Color(0xff183A37),
                fillColor: const Color(0xffEFD6AC),
                constraints: BoxConstraints(
                    minWidth: (MediaQuery.of(context).size.width - 36) / 6),
                isSelected: _selectedOption,
                children: options)
          ],
        ),
      ),

      //  Body
      body: SafeArea(
          child: Center(
              child: Column(
        children: [
          Text(
            '\$99.99',
            style: GoogleFonts.jost(
              fontSize: 72,
              //fontWeight: FontWeight.bold,
              color: const Color(0xffEFD6AC),
            ),
          )
        ],
      ))),
    );
  }
}
