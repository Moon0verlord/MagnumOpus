import 'package:flutter/material.dart';

class Dashboard extends StatefulWidget {
  @override
  _DashboardState createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  int selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    Widget getPageWidget() {
      switch (selectedIndex) {
        case 0:
          return DashboardContent();
        case 1:
          return Placeholder();
        case 2:
          return Placeholder();
        default:
          throw UnimplementedError();
      }
    }

    return LayoutBuilder(
      builder: (context, constraints) {
        return Scaffold(
          body: Row(
            children: [
              SafeArea(
                child: NavigationRail(
                  extended: constraints.maxWidth > 600,
                  destinations: const [
                    NavigationRailDestination(
                      icon: Icon(Icons.favorite_border),
                      label: Text('Dashboard'),
                    ),
                    NavigationRailDestination(
                      icon: Icon(Icons.bookmark_border),
                      label: Text('Second'),
                    ),
                    NavigationRailDestination(
                      icon: Icon(Icons.star_border),
                      label: Text('Third'),
                    ),
                  ],
                  selectedIndex: selectedIndex,
                  onDestinationSelected: (value) {
                    setState(() {
                      selectedIndex = value;
                    });
                  },
                ),
              ),
              Expanded(
                child: Container(
                  color: Theme.of(context).colorScheme.primaryContainer,
                  child: getPageWidget(), // Dynamically display the selected page/widget
                ),
              ),
            ],
          ),
        );
      }
    );
  }
}

// Define a separate widget for the Dashboard content
class DashboardContent extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            'Dashboard Home',
            style: Theme.of(context).textTheme.headlineMedium,
          ),
          ElevatedButton(
            onPressed: () {
              // Your button action here
            },
            child: Text('Dashboard Action'),
          ),
          // Add more widgets here as needed for your dashboard
        ],
      ),
    );
  }
}
