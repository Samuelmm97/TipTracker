import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:tip_tracker/modules/cubit/geolocator_cubit.dart';
import 'package:tip_tracker/modules/index/pages/tipentry/cubit/tip_cubit.dart';

class ManualEntry extends StatefulWidget {
  const ManualEntry({Key? key}) : super(key: key);

  @override
  State<ManualEntry> createState() => _ManualEntryState();
}

//  List of options for the toggle buttons
final List<Widget> options = <Widget>[
  Text(
    'Tips',
    style: GoogleFonts.jost(
      fontSize: 18,
      fontWeight: FontWeight.w500,
      color: const Color(0xff04151F),
    ),
  ),
];

// Labels for manual input
String _val = '0';
String _total = '999';
final int MAXDIG = 6;
final List<String> _label = ["mi", "\$", "hrs"];
final List<int> numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, -1, 0, -1];

class _ManualEntryState extends State<ManualEntry> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: const Color(0xff183A37),

        //  AppBar
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0.0,
          centerTitle: true,
        ),

        //  Body
        body: Center(
            child: Column(
          children: [
            //  Input text fields
            Text(
              "${_label[1]}" "${_val}",
              style: GoogleFonts.jost(
                fontSize: 52,
                fontWeight: FontWeight.w500,
                color: const Color(0xffEFD6AC),
              ),
            ),
            const SizedBox(
              height: 30,
            ),
            keypadWidget(),

            submitButton()
          ],
        )));
  }

  Widget submitButton() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(72, 24, 72, 16),
      child: GestureDetector(
        onTap: () async {
          GeolocatorCubit geoCubit = BlocProvider.of<GeolocatorCubit>(context);
          BlocProvider.of<TipEntryCubit>(context).tipEntryModel.latlng!["lat"] =
              geoCubit.position?.latitude;
          BlocProvider.of<TipEntryCubit>(context).tipEntryModel.latlng!["lng"] =
              geoCubit.position?.longitude;
          await BlocProvider.of<TipEntryCubit>(context).addTip();
        },
        child: Container(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
          decoration: BoxDecoration(
              border: Border.all(color: const Color(0xff0BFF4F)),
              borderRadius: BorderRadius.circular(36)),
          child: const Center(
            child: Text(
              'Submit',
              style: TextStyle(
                color: Color(0xff0BFF4F),
                fontSize: 24,
              ),
            ),
          ),
        ),
      ),
    );
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
          return InkWell(
            borderRadius: BorderRadius.circular(360),
            onTap: () {
              //  If val is 0 replace with new val
              if (_val == '0' && index != 11 && index != 9) {
                try {
                  setState(() => _val =
                      _val.replaceRange(_val.length - 1, _val.length, ''));
                } catch (e) {
                  print("Error removing $e");
                }
                setState(() => _val = '$_val$number');
              }
              //  Delete Option
              else if (index == 11) {
                if (_val.length == 1) {
                  setState(() {
                    _val = '0';
                  });
                } else {
                  try {
                    setState(() => _val =
                        _val.replaceRange(_val.length - 1, _val.length, ''));
                  } catch (e) {
                    print("Error removing $e");
                  }
                }
              } else if (index == 9) {
                if (_val.contains('.') == false) {
                  setState(() {
                    _val = '$_val.';
                  });
                }
              }
              //  Number Input Buttons
              else {
                bool canAdd = true;
                if (_val.contains('.')) {
                  int len = _val.length - _val.indexOf('.');
                  if (len == 3) canAdd = false;
                }
                if (_val.length < MAXDIG && canAdd)
                  setState(() => _val = '$_val$number');
              }
              BlocProvider.of<TipEntryCubit>(context).tipEntryModel.amount =
                  double.parse(_val);
            },

            //  Buttons Design
            child: Container(
              alignment: Alignment.center,
              decoration: const BoxDecoration(
                color: Color(0xff04151F),
                shape: BoxShape.circle,
              ),
              child: index == 11 || index == 9
                  ? index == 11
                      //  Back Arrow
                      ? const Icon(
                          Icons.arrow_back_ios_new_rounded,
                          color: Color(0xff0BFF4F),
                          //size: 50,
                        )
                      //  Dot operator
                      : Container(
                          alignment: Alignment.center,
                          width: 6,
                          height: 6,
                          decoration: const BoxDecoration(
                              color: Color(0xff0BFF4F), shape: BoxShape.circle),
                        )
                  : Text(
                      '$number',
                      style: GoogleFonts.jost(
                        fontSize: 24,
                        fontWeight: FontWeight.w500,
                        color: const Color(0xff0BFF4F),
                      ),
                    ),
            ),
          );
        },
      ),
    );
  }
}
