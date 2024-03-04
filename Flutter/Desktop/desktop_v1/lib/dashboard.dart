import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';


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

class Station {
  final String id;
  final String status;
  final String streetname;
  final int maxPower; 

  const Station({required this.id, required this.status, required this.streetname, required this.maxPower});

  factory Station.fromJson(Map<String, dynamic> json) {
    if (json.containsKey('id') && json.containsKey('status') && json.containsKey('streetname') && json.containsKey('maxPower')) {
      return Station(
        id: json['id'],
        status: json['status'],
        streetname: json['streetName'],
        maxPower: json['maxPower'],
      );
    } else {
      throw Exception('Failed to load station data');
    }
  }
}


// Define a separate widget for the Dashboard content
class DashboardContent extends StatelessWidget {

  Future<List<Station>> fetchStationData() async {
    final response = await http.get(Uri.parse('https://schubergphilis.workflows.okta-emea.com/api/flo/d71da429cdb215bef89ffe6448097dee/invoke?clientToken=01d762901510b3c7f422595fa18d8d7bd71c1f3e58ad860fd3ae2d0c87a80955&url=%2Fpoi%2Fv1%2Flocations&method=GET'));
    if (response.statusCode == 200) {
    var jsonResponse = jsonDecode(response.body);
    var stationsJson = jsonResponse['stationList'] as List;
    return stationsJson.map((station) => Station.fromJson(station)).toList();
    } else {
      // If the server returns an error response, throw an exception.
      throw Exception('Failed to load dashboard data');
    }
  }


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
              fetchStationData();
            },
            child: Text('Dashboard Action'),
          ),
          FutureBuilder<List<Station>>(
            future: fetchStationData(),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return  const CircularProgressIndicator();
              } else if (snapshot.hasError) {
                return Text('Error: ${snapshot.error}');
              } else {
                return ListView.builder(
                  itemCount: snapshot.data!.length,
                  itemBuilder: (context, index) {
                  var station = snapshot.data![index];
                  return ListTile(
                    title: Text('ID: ${station.id}'),
                    subtitle: Text('Status: ${station.status}\nStreet Name: ${station.streetname}\nMax Power: ${station.maxPower}'),
                );
              }
            );
          }
            },
          ),
          // Add more widgets here as needed for your dashboard
        ],
      ),
    );
  }
}
