import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';

import 'package:random_products_flutter_app/Screens/Home/home.actions.dart';
import 'package:random_products_flutter_app/Widgets/atom/render_network_image.dart';
import 'package:random_products_flutter_app/Widgets/organisms/index.dart';
import 'package:random_products_flutter_app/Widgets/organisms/render_future_builder.dart';
import 'package:random_products_flutter_app/app_colors.dart';
import 'package:random_products_flutter_app/constants.dart';

class ProductDetails extends StatefulWidget {
  const ProductDetails({super.key, required this.product});

  final Object? product;

  @override
  State<ProductDetails> createState() => _ProductDetailsState();
}

class _ProductDetailsState extends State<ProductDetails> {
  final _buttonCarouselController = CarouselController();

  @override
  Widget build(BuildContext context) {
    final product = (widget.product as Map<String, dynamic>);

    return Scaffold(
      appBar: renderAppBar(
        title: product["name"],
      ),
      backgroundColor: AppColors.greyWhiteColor,
      body: renderFuturebuilder(
        future: getProductById(id: product["productId"]),
        builder: (context, snapshot) {
          return Container(
            padding: const EdgeInsets.symmetric(horizontal: 5),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.start,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CarouselSlider.builder(
                  options: kProductImageSliderOptions,
                  carouselController: _buttonCarouselController,
                  itemCount: snapshot["subImages"].length,
                  itemBuilder: (BuildContext context, int itemIndex,
                          int pageViewIndex) =>
                      Container(
                    color: AppColors.greyWhiteColor,
                    child: renderNetworkImage(
                        snapshot["subImages"][itemIndex]["url"]),
                  ),
                ),
                const SizedBox(
                  height: 10,
                ),
                const SizedBox(
                  height: 5,
                ),
                Text(
                  snapshot["description"],
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(
                  height: 5,
                ),
                Container(
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  child: Text(
                    snapshot["stock"] > 5
                        ? "In Stock"
                        : "Only ${snapshot["stock"]} left in stock - order soon.",
                    style: TextStyle(
                      fontSize: 18,
                      color: snapshot["stock"] > 0 ? Colors.green : Colors.red,
                    ),
                  ),
                ),
                const SizedBox(
                  height: 5,
                ),
                Text(
                  "$kCurrencySymbol ${snapshot["price"]}",
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
