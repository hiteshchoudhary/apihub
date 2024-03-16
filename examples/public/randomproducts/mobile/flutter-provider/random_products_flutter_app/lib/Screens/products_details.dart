import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:random_products_flutter_app/Screens/Home/home.actions.dart';
import 'package:random_products_flutter_app/Widgets/organisms/render_future_builder.dart';

import 'package:random_products_flutter_app/app_colors.dart';
import 'package:random_products_flutter_app/Widgets/organisms/index.dart';

class ProductDetails extends StatefulWidget {
  const ProductDetails({super.key, required this.product});

  final Object? product;

  @override
  State<ProductDetails> createState() => _ProductDetailsState();
}

class _ProductDetailsState extends State<ProductDetails> {
  @override
  Widget build(BuildContext context) {
    final product = (widget.product as Map<String, dynamic>);

    return Scaffold(
      appBar: getAppBar(
        title: product["name"],
      ),
      backgroundColor: AppColors.greyWhiteColor,
      body: renderFuturebuilder(
        future: getProductById(id: product["productId"]),
        builder: (context, snapshot) {
          print("snapshot :::::: $snapshot");
          return Container(
            padding: const EdgeInsets.symmetric(horizontal: 5),
            child: Column(
              children: [
                Text(snapshot["name"]),
              ],
            ),
          );
        },
      ),
    );
  }
}
