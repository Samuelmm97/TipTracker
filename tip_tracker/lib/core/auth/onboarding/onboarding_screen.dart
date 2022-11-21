import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  FocusNode kb1 = FocusNode();
  FocusNode kb2 = FocusNode();
  FocusNode kb3 = FocusNode();

  FocusNode fnode1 = FocusNode();
  FocusNode fnode2 = FocusNode();
  FocusNode fnode3 = FocusNode();

  TextEditingController monthText = TextEditingController();
  TextEditingController dayText = TextEditingController();
  TextEditingController yearText = TextEditingController();

  void focusDateField(FocusNode keyboardNode, FocusNode textNode) {
    setState(() {
      FocusScope.of(context).requestFocus(keyboardNode);
      FocusScope.of(context).requestFocus(textNode);
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        FocusManager.instance.primaryFocus?.unfocus();
      },
      child: Scaffold(
          body: Center(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Flexible(
              child: GestureDetector(
                onTap: () {
                  if (monthText.text.length < 2) {
                    FocusScope.of(context).unfocus();
                    focusDateField(kb1, fnode1);
                  } else if (dayText.text.length < 2) {
                    FocusScope.of(context).unfocus();
                    focusDateField(kb2, fnode2);
                  } else if (yearText.text.length <= 4) {
                    FocusScope.of(context).unfocus();
                    focusDateField(kb3, fnode3);
                  }
                },
                child: Container(
                  width: 140,
                  decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      border: (fnode1.hasFocus ||
                              fnode2.hasFocus ||
                              fnode3.hasFocus)
                          ? Border.all(color: Colors.blueAccent)
                          : Border.all(color: Colors.black87)),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      RawKeyboardListener(
                        focusNode: kb1,
                        onKey: (event) {
                          if (monthText.text.length == 2 &&
                              event is RawKeyDownEvent) {
                            setState(() {
                              bool found = event.data.logicalKey.keyLabel
                                  .contains(RegExp(r'[0-9]'));

                              if (found && dayText.text.length < 2) {
                                int parse =
                                    int.parse(event.data.logicalKey.keyLabel);
                                dayText.text += parse.toString();
                              }
                            });
                          }
                        },
                        child: SizedBox(
                          width: 28,
                          child: TextFormField(
                            textAlign: TextAlign.justify,
                            focusNode: fnode1,
                            controller: monthText,
                            keyboardType: TextInputType.number,
                            textInputAction: TextInputAction.done,
                            onChanged: (String newVal) {
                              if (newVal.length == 2) {
                                fnode1.unfocus();
                                focusDateField(kb2, fnode2);
                              } else {
                                // Necessary setState to update padding between
                                // this and the proceding slash
                                setState(() {});
                              }
                            },
                            decoration: const InputDecoration(
                              hintText: "mm",
                              enabledBorder: InputBorder.none,
                              focusedBorder: InputBorder.none,
                            ),
                            inputFormatters: [
                              FilteringTextInputFormatter.allow(
                                RegExp(r'[0-9]'),
                              ),
                              LengthLimitingTextInputFormatter(2),
                            ],
                          ),
                        ),
                      ),
                      Padding(
                        padding: monthText.text.isEmpty
                            ? const EdgeInsets.symmetric(horizontal: 5.0)
                            : const EdgeInsets.only(right: 5.0),
                        child: const SizedBox(
                          width: 5,
                          child: Text("/"),
                        ),
                      ),
                      SizedBox(
                        width: 20,
                        child: RawKeyboardListener(
                          focusNode: kb2,
                          onKey: ((event) {
                            if (dayText.text.length == 2 &&
                                event is RawKeyDownEvent) {
                              setState(() {
                                bool found = event.data.logicalKey.keyLabel
                                    .contains(RegExp(r'[0-9]'));

                                if (found && yearText.text.length < 4) {
                                  int parse =
                                      int.parse(event.data.logicalKey.keyLabel);
                                  yearText.text += parse.toString();
                                }
                              });
                            } else if (event.data.logicalKey.keyLabel ==
                                    "Backspace" &&
                                dayText.text.isEmpty &&
                                kb2.hasFocus &&
                                event is RawKeyUpEvent) {
                              fnode2.unfocus();
                              kb2.unfocus();
                              focusDateField(kb1, fnode1);
                            }
                          }),
                          child: TextFormField(
                            focusNode: fnode2,
                            controller: dayText,
                            decoration: const InputDecoration(
                              hintText: "dd",
                              enabledBorder: InputBorder.none,
                              focusedBorder: InputBorder.none,
                            ),
                            keyboardType: TextInputType.number,
                            textInputAction: TextInputAction.done,
                            onChanged: (String newVal) {
                              if (newVal.length == 2) {
                                kb2.unfocus();
                                fnode2.unfocus();
                                focusDateField(kb3, fnode3);
                              } else if (newVal.isEmpty) {
                                fnode2.unfocus();
                                kb2.unfocus();
                                focusDateField(kb1, fnode1);
                              }
                            },
                            inputFormatters: [
                              FilteringTextInputFormatter.allow(
                                RegExp(r'[0-9]'),
                              ),
                              LengthLimitingTextInputFormatter(2),
                            ],
                          ),
                        ),
                      ),
                      const Padding(
                        padding: EdgeInsets.all(5.0),
                        child: SizedBox(
                          width: 5,
                          child: Text("/"),
                        ),
                      ),
                      SizedBox(
                        width: 40,
                        child: RawKeyboardListener(
                          focusNode: kb3,
                          onKey: ((event) {
                            if (event.data.logicalKey.keyLabel == "Backspace" &&
                                yearText.text.isEmpty &&
                                kb3.hasFocus &&
                                event is RawKeyUpEvent) {
                              fnode3.unfocus();
                              kb3.unfocus();
                              focusDateField(kb2, fnode2);
                            }
                          }),
                          child: TextFormField(
                            controller: yearText,
                            focusNode: fnode3,
                            decoration: const InputDecoration(
                              hintText: "yyyy",
                              enabledBorder: InputBorder.none,
                              focusedBorder: InputBorder.none,
                            ),
                            keyboardType: TextInputType.number,
                            textInputAction: TextInputAction.done,
                            onChanged: (String newVal) {
                              if (newVal.length == 4) {
                                fnode3.unfocus();
                                kb3.unfocus();
                              } else if (newVal.isEmpty) {
                                fnode3.unfocus();
                                kb3.unfocus();
                                focusDateField(kb2, fnode2);
                              }
                            },
                            inputFormatters: [
                              FilteringTextInputFormatter.allow(
                                RegExp(r'[0-9]'),
                              ),
                              LengthLimitingTextInputFormatter(4),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      )),
    );
  }
}
