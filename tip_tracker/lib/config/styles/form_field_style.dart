import 'package:flutter/material.dart';

class FormFieldInputDecoration extends InputDecoration {
  final String hintText;
  final Color fillColor = Color.fromARGB(255, 4, 21, 31);
  final filled = true;
  final border =
      OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(16)));
  final hintStyle = TextStyle(color: Color(0xff3F3B3B));

  FormFieldInputDecoration(this.hintText);
}

TextStyle formFieldTextStyle =
    const TextStyle(color: Color.fromARGB(190, 253, 253, 253));
