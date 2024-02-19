import 'package:flutter/material.dart';
import 'package:mobile_mockup_project/login.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // TRY THIS: Try running your application with "flutter run". You'll see
        // the application has a purple toolbar. Then, without quitting the app,
        // try changing the seedColor in the colorScheme below to Colors.green
        // and then invoke "hot reload" (save your changes or press the "hot
        // reload" button in a Flutter-supported IDE, or press "r" if you used
        // the command line to start the app).
        //
        // Notice that the counter didn't reset back to zero; the application
        // state is not lost during the reload. To reset the state, use hot
        // restart instead.
        //
        // This works for code too, not just values: Most code changes can be
        // tested with just a hot reload.
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.cyanAccent.shade400),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'EV DEMO'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  var pageIndex = 0;
  @override
  Widget build(BuildContext context) {
    return Expanded(
        child: HomeScreen(widget: widget),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({
    super.key,
    required this.widget,
  });

  final MyHomePage widget;

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
          ),
          Column(
            children: [
              Align(
                alignment: Alignment.topCenter,
                child: BuildTitle(title: widget.title),
              ),
              Spacer(),
              Align(
                alignment: Alignment.bottomCenter,
                child: BuildButtons(),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class BuildTitle extends StatelessWidget {
  const BuildTitle({super.key, required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      margin: const EdgeInsets.only(top: 80),
      child: Column(
        children: [
          Text(
            title,
            style: TextStyle(
              fontFamily: 'Unbounded',
              color: theme.colorScheme.inversePrimary,
              fontSize: 45,
              fontWeight: FontWeight.w600,
            ),
          ),
          Text(
            "Schuberg Philis EV Charging",
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

class BuildButtons extends StatelessWidget {
  const BuildButtons({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      margin: const EdgeInsets.only(bottom: 130),
      child: Column(
        children: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(
                backgroundColor: theme.colorScheme.inversePrimary),
            onPressed: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                    builder: (context) => const LoginPage()),
              );
            },
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: Text(
                "Log in with account",
                style: TextStyle(
                  color: theme.colorScheme.secondary,
                  fontFamily: 'Montserrat',
                  fontWeight: FontWeight.w600,
                  fontSize: 17,
                ),
              ),
            ),
          ),
          const Padding(padding: EdgeInsets.all(5.0)),
          ElevatedButton(
              style: ElevatedButton.styleFrom(
                  backgroundColor: theme.colorScheme.secondary),
              onPressed: () {
                print("pressed2");
              },
              child: Padding(
                padding: const EdgeInsets.all(12.0),
                child: Text(
                  "Create new account",
                  style: TextStyle(
                    color: theme.colorScheme.inversePrimary,
                    fontFamily: 'Montserrat',
                    fontWeight: FontWeight.w600,
                    fontSize: 17,
                  ),
                ),
              )),
        ],
      ),
    );
  }
}


