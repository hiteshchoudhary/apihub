import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import 'package:random_products_flutter_app/Screens/Home/home.actions.dart';
import 'package:random_products_flutter_app/Widgets/organisms/index.dart';
import 'package:random_products_flutter_app/Widgets/organisms/render_future_builder.dart';
import 'package:random_products_flutter_app/app_colors.dart';
import 'package:random_products_flutter_app/app_routes.dart';

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
      appBar: getAppBar(
        title: "Random Products",
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => GoRouter.of(context).push(AppRoutes.kSearch),
        child: const Icon(
          Icons.search,
        ),
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
