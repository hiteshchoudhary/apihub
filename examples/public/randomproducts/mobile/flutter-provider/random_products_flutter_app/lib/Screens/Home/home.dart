import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:random_products_flutter_app/Screens/Home/home.actions.dart';

import 'package:random_products_flutter_app/Widgets/organisms/index.dart';
import 'package:random_products_flutter_app/app_colors.dart';
import 'package:random_products_flutter_app/app_routes.dart';
import 'package:random_products_flutter_app/constants.dart';

class Home extends StatefulWidget {
  const Home({super.key});

  @override
  State<Home> createState() => _HomeState();
}

class _HomeState extends State<Home> {
  @override
  void initState() {
    super.initState();

    getProducts();
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
      body: renderGridViewBuilder(
        context: context,
        itemBuilder: (context, index) {
          return ProductCard(
            id: kSampleProduct["_id"] as String,
            imageUrl:
                (kSampleProduct["mainImage"] as Map<String, dynamic>)["url"],
            name: kSampleProduct["name"] as String,
            price: 7890,
          );
        },
        itemCount: 10,
      ),
    );
  }
}
