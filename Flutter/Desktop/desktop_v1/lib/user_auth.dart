import 'package:flutter/material.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'package:sqlite3/sqlite3.dart' as sqlite3;

// Custom text field widget to reduce duplication
Widget customTextField({
  required TextEditingController controller,
  required IconData icon,
  required String label,
  bool isPassword = false,
}) {
  return TextFormField(
    controller: controller,
    cursorColor: Colors.white,
    style: const TextStyle(color: Colors.white),
    decoration: InputDecoration(
      prefixIcon: Icon(icon, color: Colors.white),
      labelText: label,
      hintText: 'Enter your $label',
      hintStyle: const TextStyle(color: Colors.white60),
      labelStyle: const TextStyle(color: Colors.white),
      border: const OutlineInputBorder(borderSide: BorderSide(color: Colors.white)),
      focusedBorder: const OutlineInputBorder(borderSide: BorderSide(color: Colors.white)),
      enabledBorder: const OutlineInputBorder(borderSide: BorderSide(color: Colors.white)),
    ),
    obscureText: isPassword,
  );
}

// Custom button widget to reduce duplication
Widget customButton({required String text, required VoidCallback onPressed}) {
  return ElevatedButton(
    style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 50)),
    onPressed: onPressed,
    child: Text(text, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500)),
  );
}

// Login page widget
class LoginPage extends StatelessWidget {
  LoginPage({Key? key}) : super(key: key);

  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final sqlite3.Database db = sqlite3.sqlite3.open('assets/db/auth.db');

  // Authentication logic for login
  void authenticateUser(BuildContext context) {
  String email = emailController.text;
  String password = passwordController.text;
  final result = db.select('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
  if (result.isEmpty) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text(
          'Invalid email or password', 
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Theme.of(context).colorScheme.error,
        duration: const Duration(seconds: 3),
      ),
    );
    return;
  } else {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text(
          'User authenticated', 
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Theme.of(context).colorScheme.secondary,
        duration: const Duration(seconds: 3),
      ),
    );
    Navigator.pushNamed(context, '/dashboard');
  }
  print('Email: $email, Password: $password');
  print('Authenticating user...');
}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.secondary,
        title: const Text('Login Page'),
      ),
      body: Center(
        child: SizedBox(
          width: 500,
          height: 600,
          child: Card(
            color: Theme.of(context).colorScheme.primary,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            elevation: 5,
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                children: <Widget>[
                  Image.asset('assets/images/logo.png', width: 150, height: 150),
                  Expanded(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: <Widget>[
                        const Text('Login', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 15),
                        customTextField(controller: emailController, icon: Icons.email, label: 'Email'),
                        const SizedBox(height: 20),
                        customTextField(controller: passwordController, icon: Icons.lock, label: 'Password', isPassword: true),
                        const SizedBox(height: 20),
                        customButton(
                          text: 'Login',
                          onPressed: () {
                            authenticateUser(context);
                          },
                        ),
                        const SizedBox(height: 10),
                        customButton(
                          text: 'Sign up',
                          onPressed: () {
                            Navigator.pushNamed(context, '/signup');
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}


class SignupPage extends StatelessWidget {
  SignupPage({Key? key}) : super(key: key);

  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController = TextEditingController();
  final sqlite3.Database db = sqlite3.sqlite3.open('assets/db/auth.db');

  Future<void> registerUser(BuildContext context) async {
    String email = emailController.text;
    String password = passwordController.text;
    String confirmPassword = confirmPasswordController.text;
    if (password != confirmPassword) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text(
            'Passwords do not match', 
            style: TextStyle(color: Colors.white),
          ),
          backgroundColor: Theme.of(context).colorScheme.error,
          duration: const Duration(seconds: 3),
        ),
      );
      return;
    }
    db.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: const Text(
          'User registered', 
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: Theme.of(context).colorScheme.secondary,
        duration: const Duration(seconds: 3),
      ),
    );
    print('Email: $email, Password: $password');
    print('Registering user...');
    Future.delayed(const Duration(seconds: 2));
    Navigator.pushNamed(context, '/');
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.secondary,
        title: const Text('Signup Page'),
      ),
      body: Center(
        child: SizedBox(
          width: 500,
          height: 600,
          child: Card(
            color: Theme.of(context).colorScheme.primary,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            elevation: 5,
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                children: <Widget>[
                  Image.asset('assets/images/logo.png', width: 150, height: 150),
                  Expanded(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.start,
                      // todo add a name field
                      children: <Widget>[
                        const Text('Signup', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 15),
                        customTextField(controller: emailController, icon: Icons.email, label: 'Email'),
                        const SizedBox(height: 20),
                        customTextField(controller: passwordController, icon: Icons.lock, label: 'Password', isPassword: true),
                        const SizedBox(height: 20),
                        customTextField(controller: confirmPasswordController, icon: Icons.lock, label: 'Confirm Password', isPassword: true),
                        const SizedBox(height: 20),
                        customButton(
                          text: 'Signup',
                          onPressed: () async {
                            await registerUser(context);
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
