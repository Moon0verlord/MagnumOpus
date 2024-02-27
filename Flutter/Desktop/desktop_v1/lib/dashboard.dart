import 'package:flutter/material.dart';

class Dashboard extends StatefulWidget {
  @override
  _DashboardState createState() => _DashboardState();
}

class _DashboardState extends State<Dashboard> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          SafeArea(
            child: LayoutBuilder(
              builder: (BuildContext context, BoxConstraints constraints) {
                return NavigationRail(
                  extended: true,
                  destinations: const [
                    NavigationRailDestination(
                      icon: Icon(Icons.home),
                      label: Text('Home'),
                    ),
                    NavigationRailDestination(
                      icon: Icon(Icons.charging_station),
                      label: Text('Charging Stations'),
                    ),
                    NavigationRailDestination(
                      icon: Icon(Icons.account_circle),
                      label: Text('Profile'),
                    ),
                    NavigationRailDestination(
                      icon: Icon(Icons.battery_charging_full),
                      label: Text('Charge Status'),
                    ),
                  ],
                  selectedIndex: 0,
                  onDestinationSelected: (value) {
                    print('selected: $value');
                  },
                );
              },
            ),
          ),
          Expanded(
            child: Container(
              color: Theme.of(context).colorScheme.primaryContainer,
              child: const Center(
                child: Text(
                  'Dashboard Screen Placeholder',
                  style: TextStyle(fontSize: 24),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}