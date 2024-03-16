import 'package:flutter/material.dart';

import 'package:random_products_flutter_app/Screens/Home/home.actions.dart';
import 'package:random_products_flutter_app/Widgets/organisms/index.dart';
import 'package:random_products_flutter_app/Widgets/organisms/render_future_builder.dart';
import 'package:random_products_flutter_app/app_colors.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: renderAppBar(
        title: "Random Products",
      ),
      backgroundColor: AppColors.greyWhiteColor,
      body: renderFuturebuilder(
        future: getProducts(),
        builder: (context, snapshot) {
          return renderGridViewBuilder(
            context: context,
            itemCount: snapshot.length,
            itemBuilder: (context, index) {
              final product = snapshot[index];
              return ProductCard(
                id: product!["_id"],
                imageUrl: product["mainImage"]["url"],
                name: product["name"],
                price: product["price"],
              );
            },
          );
        },
      ),
    );
  }
}
