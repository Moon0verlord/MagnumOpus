import 'dart:ui';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/painting.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: <Widget>[
          Container(
            decoration: const BoxDecoration(
              image: DecorationImage(
                image: AssetImage('images/rdam_img.png'),
                fit: BoxFit.cover,
              ),
            ),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 5.0, sigmaY: 5.0),
              child: Container(
                decoration: BoxDecoration(color: Colors.white.withOpacity(0.0)),
              ),
            ),
          ),
          const Center(
            child: Column(
              children: [
                BuildHeader(),
                Padding(padding: EdgeInsets.all(24.0)),
                InputFields(),
                Padding(padding: EdgeInsets.all(4.0)),
                LoginButton(),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class BuildHeader extends StatelessWidget {
  const BuildHeader({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      margin: const EdgeInsets.only(top: 80),
      child: Column(
        children: [
          Text(
            "Login",
            style: TextStyle(
              fontFamily: 'Montserrat',
              color: theme.colorScheme.inversePrimary,
              fontSize: 45,
              fontWeight: FontWeight.w600,
              shadows: const <Shadow>[
                Shadow(
                  offset: Offset(2.0, 2.0),
                  blurRadius: 5.0,
                  color: Color.fromARGB(145, 0, 0, 0),
                )
              ],
            ),
          ),
          Text(
            "Welcome!",
            style: TextStyle(
                color: theme.colorScheme.onPrimary.withOpacity(0.7),
                fontSize: 16,
                fontFamily: 'Montserrat',
                fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }
}

class InputFields extends StatelessWidget {
  const InputFields({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      child: const Column(
        children: [
          Padding(
            padding: EdgeInsets.all(8.0),
            child: SizedBox(
              width: 250,
              child: TextField(
                style: TextStyle(color: Colors.white70),
                obscureText: false,
                decoration: InputDecoration(
                  enabledBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.white70),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.white70),
                  ),
                  iconColor: Colors.white70,
                  icon: Icon(Icons.email_outlined),
                  border: OutlineInputBorder(),
                  labelText: 'E-mail',
                  labelStyle: TextStyle(color: Colors.white70),
                ),
              ),
            ),
          ),
          Padding(
            padding: EdgeInsets.all(8.0),
            child: SizedBox(
              width: 250,
              child: TextField(
                style: TextStyle(color: Colors.white70),
                obscureText: true,
                decoration: InputDecoration(
                  enabledBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.white70),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.white70),
                  ),
                  iconColor: Colors.white70,
                  icon: Icon(Icons.password_rounded),
                  border: OutlineInputBorder(),
                  labelText: 'Password',
                  labelStyle: TextStyle(color: Colors.white70),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class LoginButton extends StatelessWidget {
  const LoginButton({super.key});

  @override
  Widget build(BuildContext context) {
    var theme = Theme.of(context);

    return ElevatedButton(
      style: ElevatedButton.styleFrom(
          backgroundColor: theme.colorScheme.inversePrimary,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
      ),
      onPressed: () {
        print("LoginPressed");
      },
      child: const Padding(
        padding: EdgeInsets.all(12.0),
        child: Text(
          "Sign In",
          style: TextStyle(
            color: Colors.black87,
            fontFamily: 'Montserrat',
            fontWeight: FontWeight.w600,
            fontSize: 17,
          ),
        ),
      ),
    );
  }
}
