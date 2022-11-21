import 'package:flutter/material.dart';
import 'package:tip_tracker/modules/index/pages/manual_entry.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:tip_tracker/modules/index/pages/map/map_page.dart';
import 'package:tip_tracker/modules/index/pages/user_page.dart';

class IndexScreen extends StatefulWidget {
  const IndexScreen({Key? key}) : super(key: key);

  @override
  State<IndexScreen> createState() => _IndexScreenState();
}

class _IndexScreenState extends State<IndexScreen> {
  int currentIndex = 1;

  final screens = [
    const UserPage(),
    const ManualEntry(),
    Center(
      child: Text(
        'Analytics_PAGE_HERE',
        style: GoogleFonts.jost(fontSize: 32),
      ),
    ),
    const MapPage(),
  ];

  @override
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
        items: const [
          //  Index 0, Account
          BottomNavigationBarItem(
            icon: Icon(Icons.account_circle_sharp),
            label: 'Account',
          ),
          //  Index 1, Manual Entry
          BottomNavigationBarItem(
            icon: Icon(Icons.app_registration_rounded),
            label: 'Custom Entry',
          ),
          //  Index 2, Analytics
          BottomNavigationBarItem(
            icon: Icon(Icons.bar_chart_rounded),
            label: 'Analytics',
          ),
          //  Index 3, Map
          BottomNavigationBarItem(
            icon: Icon(Icons.map),
            label: 'Map',
          ),
        ],
      ),
    );
  }
}
