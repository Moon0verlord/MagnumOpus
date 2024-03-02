import 'package:desktop_v1/user_auth.dart';
import 'package:flutter/material.dart';
import 'package:desktop_v1/dashboard.dart';



void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.lightBlue.shade600),
        brightness: Brightness.light,),
      routes: {
        '/': (context) => LoginPage(),
        '/signup': (context) => SignupPage(),
        '/dashboard': (context) => Dashboard(),
      },
    );
  }
}
