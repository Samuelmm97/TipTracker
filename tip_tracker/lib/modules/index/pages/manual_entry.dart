import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class ManualEntry extends StatefulWidget {
  const ManualEntry({Key? key}) : super(key: key);

  @override
  State<ManualEntry> createState() => _ManualEntryState();
}

//  List of options for the toggle buttons
final List<Widget> options = <Widget>[
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

// Labels for manual input
String _val = '0';
final List<String> _label = ["mi", "\$", "hrs"];
final List<int> numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, -1, 0, -1];

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
                      _val = '0';
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
        body: Center(
            child: Column(
          children: [
            (_selectedOption.indexOf(true) == 1)
                ? Text(
                    "${_label[_selectedOption.indexOf(true)]}" "${_val}",
                    style: GoogleFonts.jost(
                      fontSize: 52,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xffEFD6AC),
                    ),
                  )
                : Text(
                    "${_val}" " ${_label[_selectedOption.indexOf(true)]}",
                    style: GoogleFonts.jost(
                      fontSize: 52,
                      fontWeight: FontWeight.w500,
                      color: const Color(0xffEFD6AC),
                    ),
                  ),
            SizedBox(
              height: 50,
            ),
            keypadWidget(),
          ],
        )));
  }

  Widget keypadWidget() {
    return Flexible(
      child: GridView.builder(
        padding: const EdgeInsets.symmetric(
          horizontal: 40,
        ),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3,
          childAspectRatio: 1.5,
          crossAxisSpacing: 8,
          mainAxisSpacing: 8,
        ),
        itemCount: numbers.length,
        itemBuilder: (BuildContext context, int index) {
          int number = numbers[index];
          if (index == 9) return Container(height: 0, width: 0);
          return InkWell(
            borderRadius: BorderRadius.circular(360),
            //  TODO: Add limit size of input
            onTap: () {
              //  If val is 0 replace with new val
              if (_val == '0') {
                try {
                  setState(() => _val =
                      _val.replaceRange(_val.length - 1, _val.length, ''));
                } catch (e) {
                  print("Error removing $e");
                }
                setState(() => _val = '$_val$number');
              }
              //  Delete Option TODO: When all is deleted add a 0
              else if (index == 11) {
                try {
                  setState(() => _val =
                      _val.replaceRange(_val.length - 1, _val.length, ''));
                } catch (e) {
                  print("Error removing $e");
                }
              }
              //  TODO: Add limit to how many digits a number may have
              else {
                setState(() => _val = '$_val$number');
              }
            },

            //  Buttons Design TODO: Match Template with fonts and color
            child: Container(
              child: index == 11
                  ? Icon(Icons.backspace, color: Colors.grey)
                  : Text(
                      '$number',
                      style: TextStyle(color: Colors.white),
                    ),
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: Colors.black38,
                shape: BoxShape.circle,
              ),
            ),
          );
        },
      ),
    );
  }
}
