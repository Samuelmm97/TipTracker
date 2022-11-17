import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:tip_tracker/config/routes/routes.dart';
import 'package:tip_tracker/utils/services/secure_storage_service.dart';

class UserPage extends StatefulWidget {
  const UserPage({super.key});

  @override
  State<UserPage> createState() => _UserPageState();
}

class _UserPageState extends State<UserPage> {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: GestureDetector(
        onTap: () async {
          await SecureStorageService().deleteAll();
          if (!mounted) return;
          await Navigator.pushNamedAndRemoveUntil(
              context, Routes.authIndexScreen, (route) => false);
        },
        child: Text(
          'LOGOUT',
          style: GoogleFonts.jost(fontSize: 32),
        ),
      ),
    );
  }
}
