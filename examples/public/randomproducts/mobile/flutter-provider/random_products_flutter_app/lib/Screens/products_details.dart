import 'package:flutter/material.dart';

import 'package:random_products_flutter_app/app_colors.dart';
import 'package:random_products_flutter_app/Widgets/organisms/index.dart';

class ProductDetails extends StatefulWidget {
  const ProductDetails({super.key});

  @override
  State<ProductDetails> createState() => _ProductDetailsState();
}

class _ProductDetailsState extends State<ProductDetails> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: getAppBar(
        title: "Random Products",
      ),
      backgroundColor: AppColors.greyWhiteColor,
      body: const Center(
        child: Text("Product Details"),
      ),
    );
  }
}
