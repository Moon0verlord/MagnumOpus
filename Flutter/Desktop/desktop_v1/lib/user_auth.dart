import 'package:flutter/material.dart';
import 'package:path/path.dart';
import 'package:path_provider/path_provider.dart';
import 'package:sqlite3/sqlite3.dart' as sqlite3;

class CustomTextField extends StatefulWidget {
  final TextEditingController controller;
  final IconData icon;
  final String label;
  final bool isPassword;
  final ValueChanged<String>? onFieldSubmitted;
  final String? Function(String?)? validator;

  CustomTextField({
    required this.controller,
    required this.icon,
    required this.label,
    this.isPassword = false,
    this.onFieldSubmitted,
    this.validator,
  });

  @override
  _CustomTextFieldState createState() => _CustomTextFieldState();
}

class _CustomTextFieldState extends State<CustomTextField> {
  bool _obscureText = true;

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: ThemeData(
        textSelectionTheme: TextSelectionThemeData(
          selectionColor: Colors.white70,
        ),
      ),
      child: TextFormField(
        controller: widget.controller,
        cursorColor: Colors.white,
        style: const TextStyle(color: Colors.white),
        decoration: InputDecoration(
          prefixIcon: Icon(widget.icon, color: Colors.white),
          labelText: widget.label,
          hintText: 'Enter your ${widget.label}',
          hintStyle: const TextStyle(color: Colors.white60),
          labelStyle: const TextStyle(color: Colors.white),
          border: const OutlineInputBorder(borderSide: BorderSide(color: Colors.white)),
          focusedBorder: const OutlineInputBorder(borderSide: BorderSide(color: Colors.white)),
          enabledBorder: const OutlineInputBorder(borderSide: BorderSide(color: Colors.white)),
          suffixIcon: widget.isPassword
              ? IconButton(
                  icon: Icon(
                    _obscureText ? Icons.visibility : Icons.visibility_off,
                    color: Colors.white,
                  ),
                  onPressed: () {
                    setState(() {
                      _obscureText = !_obscureText;
                    });
                  },
                )
              : null,
        ),
        obscureText: widget.isPassword ? _obscureText : false,
        onFieldSubmitted: widget.onFieldSubmitted,
        validator: widget.validator,
      ),
    );
  }
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
  final _formKey = GlobalKey<FormState>();

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
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
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
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
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
        backgroundColor: Theme.of(context).colorScheme.secondaryContainer,
        title: const Text('Login'),
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
              child: Form(
                key: _formKey,
                child: Column(
                  children: <Widget>[
                    Image.asset('assets/images/logo.png', width: 150, height: 150),
                    Expanded(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: <Widget>[
                          const Text('Login', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 15),
                          CustomTextField(
                            controller: emailController, 
                          icon: Icons.email, 
                          label: 'Email' ,
                          validator: (value) {
                            if (value!.isEmpty) {
                              return 'Email is required';
                            }
                            if (!value.contains('@')) {
                              return 'Invalid email';
                            }
                            return null;
                          },
                          ),
                          const SizedBox(height: 20),
                          CustomTextField(
                            controller: passwordController, 
                            icon: Icons.lock, 
                            label: 'Password', 
                            isPassword: true,
                            onFieldSubmitted: (_) {
                              if (_formKey.currentState!.validate()) {
                                authenticateUser(context);
                              }
                            },
                            validator: (value) {
                              if (value!.isEmpty) {
                                return 'Password is required';
                              }
                              if (value.length < 6) {
                                return 'Password must be at least 6 characters';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 20),
                          customButton(
                            text: 'Login',
                            onPressed: () {
                              if (_formKey.currentState!.validate()) {
                                authenticateUser(context);
                              }
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
      ),
    );
  }
}




class SignupPage extends StatelessWidget {
  SignupPage({Key? key}) : super(key: key);

  final TextEditingController nameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController = TextEditingController();
  final sqlite3.Database db = sqlite3.sqlite3.open('assets/db/auth.db');
  final _formKey = GlobalKey<FormState>();

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
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),

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
              child: Form(
                key: _formKey,
                child: Column(
                  children: <Widget>[
                    Image.asset('assets/images/logo.png', width: 120, height: 120),
                    Expanded(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: <Widget>[
                          const Text('Signup', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 15),
                          CustomTextField(controller: nameController,
                           icon: Icons.person,
                            label: 'Name'
                            ),
                          const SizedBox(height: 20),
                          CustomTextField(controller: emailController, 
                          icon: Icons.email, 
                          label: 'Email',
                          validator: (value) {
                            if (value!.isEmpty) {
                              return 'Email is required';
                            }
                            if (!value.contains('@')) {
                              return 'Invalid email';
                            }
                            return null;
                          },
                          ),
                          const SizedBox(height: 20),
                          CustomTextField(controller: passwordController, icon: Icons.lock, label: 'Password', isPassword: true),
                          const SizedBox(height: 20),
                          CustomTextField(
                            controller: confirmPasswordController, 
                            icon: Icons.lock, 
                            label: 'Confirm Password', 
                            isPassword: true,
                            onFieldSubmitted: (_) async {
                              if (_formKey.currentState!.validate()) {
                                await registerUser(context);
                              }
                            },
                            validator: (value) {
                              if (value!.isEmpty) {
                                return 'Password is required';
                              }
                              if (value.length < 6) {
                                return 'Password must be at least 6 characters';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 40),
                          customButton(
                            text: 'Signup',
                            onPressed: () async {
                              if (_formKey.currentState!.validate()) {
                                await registerUser(context);
                              }
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
      ),
    );
  }
}