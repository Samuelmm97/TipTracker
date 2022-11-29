import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:tip_tracker/config/routes/routes.dart';
import 'package:tip_tracker/modules/index/pages/Profile/cubit/profile_cubit.dart';
import 'package:tip_tracker/utils/services/secure_storage_service.dart';


class UserPage extends StatefulWidget {
  const UserPage({super.key});

  @override
  State<UserPage> createState() => _UserPageState();
}

class _UserPageState extends State<UserPage> {
  @override
  final double profileHeight = 144;
  final double cover = 140;
  Widget build(BuildContext context) {
    return BlocBuilder<ProfileCubit, ProfileState>(
      builder: ((context, state) {

      if (state is ProfileLoaded) {
        return Scaffold(
            backgroundColor: const Color(0xff183A37),

            body: Stack(
                clipBehavior: Clip.none,
                alignment: Alignment.topCenter,
                children: [
                  Positioned(
                      top: 250,
                      child: createContent()),

                  Positioned(
                      top: 25,
                      child: buildProfileImage()),
                  Positioned(
                      top: 300,
                      left: 135,
                      child: Column(
                        children: [Text(BlocProvider.of<ProfileCubit>(context).userProfileModel!.employeeType),
                          Text("?{BlocProvider.of<ProfileCubit>(context).userProfileModel!.userId}")],
                      )),
                ]
            ) //end of stack
        );
        }
      return Text("no State");
     }
    ));

  }
  Widget buildProfileImage() => CircleAvatar(
    backgroundColor: Colors.grey.shade800,
    radius: profileHeight / 2,
    backgroundImage: NetworkImage(
      'noImage.jpg'
    ),
  );

  Widget createContent() => Container(


          child: GestureDetector(
          onTap: () async {
          await SecureStorageService().deleteAll();
          if (!mounted) return;
          await Navigator.pushNamedAndRemoveUntil(
          context, Routes.authIndex, (route) => false);
        },
          child: Text(
          'LOGOUT',
          style: GoogleFonts.jost(fontSize: 32),
        ),

        ),

  );
}
