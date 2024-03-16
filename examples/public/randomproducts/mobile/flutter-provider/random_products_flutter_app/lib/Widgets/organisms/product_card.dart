import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:random_products_flutter_app/Widgets/atom/render_network_image.dart';
import 'package:random_products_flutter_app/app_routes.dart';

import 'package:random_products_flutter_app/constants.dart';

class ProductCard extends StatelessWidget {
  const ProductCard({
    super.key,
    required this.id,
    required this.name,
    required this.price,
    required this.imageUrl,
  });

  final String id;
  final String name;
  final int price;
  final String imageUrl;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => GoRouter.of(context).push(
        AppRoutes.kProductDetail,
        extra: {
          "productId": id,
          "name": name,
        },
      ),
      child: Card(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            renderNetworkImage(imageUrl),
            Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 8,
                vertical: 2,
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: ThemeData().textTheme.displayMedium,
                  ),
                  Text(
                    "$kCurrencySymbol$price",
                    style: const TextStyle(
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    );
  }
}
