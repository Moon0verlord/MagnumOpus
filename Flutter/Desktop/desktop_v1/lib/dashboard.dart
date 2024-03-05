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
                      icon: Icon(Icons.home_outlined),
                      label: Text('Home'),
                    ),
                    NavigationRailDestination(
                      icon: Icon(Icons.battery_4_bar_rounded),
                      label: Text('Requests'),
                    ),
                    NavigationRailDestination(
                      icon: Icon(Icons.charging_station_outlined),
                      label: Text('Charging Stations'),
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
                  child: getPageWidget(),
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
  final double maxPower;

  const Station({required this.id, required this.status, required this.streetname, required this.maxPower});

  factory Station.fromJson(Map<String, dynamic> json) {
    if (json.containsKey('id') && json.containsKey('status') && json['address'].containsKey('streetName') && json.containsKey('maxPower')) {
      return Station(
        id: json['id'],
        status: json['status'],
        streetname: json['address']['streetName'],
        maxPower: (json['maxPower'] as num).toDouble()
      );
    } else {
      throw Exception('Failed to load station data');
    }
  }
}

class DashboardContent extends StatefulWidget {
  const DashboardContent({super.key});

  @override
  _DashboardContentState createState() => _DashboardContentState();
}

class _DashboardContentState extends State<DashboardContent> {
  late Future<List<Station>> stationDataFuture;

  @override
  void initState() {
    super.initState();
    stationDataFuture = fetchStationData();
  }

  Future<List<Station>> fetchStationData() async {
    final response = await http.get(Uri.parse('https://schubergphilis.workflows.okta-emea.com/api/flo/d71da429cdb215bef89ffe6448097dee/invoke?clientToken=01d762901510b3c7f422595fa18d8d7bd71c1f3e58ad860fd3ae2d0c87a80955&url=%2Fpoi%2Fv1%2Flocations&method=GET'));
    if (response.statusCode == 200) {
      var jsonResponse = jsonDecode(response.body);
      var stationsJson = jsonResponse['stationList'] as List;
      return stationsJson.map((station) => Station.fromJson(station)).toList();
    } else {
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
              setState(() {
                stationDataFuture = fetchStationData();
              });
            },
            child: Text('Dashboard Action'),
          ),
          FutureBuilder<List<Station>>(
            future: stationDataFuture,
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const SizedBox(
                  height: 25,
                  child: LinearProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.blue),
                    borderRadius: BorderRadius.all(Radius.circular(4)),
                  ),
                );
              } else if (snapshot.hasError) {
                return Text('Error: ${snapshot.error}');
              } else {
                return Expanded(
                  child: ListView.builder(
                    itemCount: snapshot.data!.length,
                    itemBuilder: (context, index) {
                      var station = snapshot.data![index];
                      return Card(
                        elevation: 5,
                        child: ListTile(
                          title: Text('ID: ${station.id}'),
                          subtitle: Text('Status: ${station.status}\nStreet Name: ${station.streetname}\nMax Power: ${station.maxPower}'),
                          trailing: station.status == 'available'
                          ? ElevatedButton(
                            
                            onPressed: (){

                            },
                            child: const Text('Start'),
                          )
                          : station.status == 'charging'
                          ? ElevatedButton(
                            onPressed: (){
                              
                            },
                            child: const Text('Request'),
                        )
                        : null
                        ),
                      );
                    }
                  ),
                );
              }
            },
          ),
        ],
      ),
    );
  }
}