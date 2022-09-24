import 'package:flutter/material.dart';
import 'package:tip_tracker/modules/index/pages/manual_entry.dart';

class IndexScreen extends StatefulWidget {
  const IndexScreen({Key? key}) : super(key: key);

  @override
  State<IndexScreen> createState() => _IndexScreenState();
}

class _IndexScreenState extends State<IndexScreen> {
  int currentIndex = 1;

  final screens = [
    const Center(
      child: Text(
        'USER_PAGE_HERE',
        style: TextStyle(fontSize: 32),
      ),
    ),
    const ManualEntry(),
    const Center(
      child: Text(
        'Analytics_PAGE_HERE',
        style: TextStyle(fontSize: 32),
      ),
    ),
  ];

  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xff183A37),
      body: screens[currentIndex],

      //  Bottom Nav Bar
      bottomNavigationBar: BottomNavigationBar(
        //  B. Nav Bar design
        backgroundColor: const Color(0x00ffffff),
        elevation: 0,
        type: BottomNavigationBarType.fixed,
        currentIndex: currentIndex,
        onTap: (index) => setState(() => currentIndex = index),
        selectedItemColor: const Color(0xff0BFF4F),
        unselectedItemColor: const Color(0x550BFF4F),
        iconSize: 36,
        showUnselectedLabels: false,
        selectedFontSize: 12,
        //  Items
        items: [
          //  Index 0, Account
          BottomNavigationBarItem(
            icon: Icon(Icons.account_circle_sharp),
            label: 'Account',
          ),

          //  Index 1, Manual Entery
          BottomNavigationBarItem(
            icon: Icon(Icons.app_registration_rounded),
            label: 'Custom Entry',
          ),

          //  Index 0, Analytics
          BottomNavigationBarItem(
            icon: Icon(Icons.bar_chart_rounded),
            label: 'Analytics',
          ),
        ],
      ),
    );
  }
}
