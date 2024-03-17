import 'package:flutter/material.dart';
import 'package:random_products_flutter_app/Widgets/organisms/render_app_bar.dart';

class Search extends StatefulWidget {
  const Search({super.key});

  @override
  State<Search> createState() => _SearchState();
}

class _SearchState extends State<Search> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: renderAppBar(
        title: "Search",
        automaticallyImplyLeading: false,
      ),
      body: const Center(
        child: Text("Search"),
      ),
    );
  }
}
