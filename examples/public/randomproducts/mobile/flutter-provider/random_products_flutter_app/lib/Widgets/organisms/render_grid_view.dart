import 'package:flutter/material.dart';

Widget renderGridViewBuilder({
  required Function itemBuilder,
  required int itemCount,
  required BuildContext context,
  ScrollController? scrollController,
}) {
  final screenWidth = MediaQuery.of(context).size.width;
  final crossAxisCount = (screenWidth / 200).floor();

  return GridView.builder(
    controller: scrollController,
    physics: const BouncingScrollPhysics(),
    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
      crossAxisCount: crossAxisCount,
      childAspectRatio: 1,
      crossAxisSpacing: 10,
      mainAxisSpacing: 10,
    ),
    itemCount: itemCount,
    keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
    itemBuilder: (BuildContext context, int index) => itemBuilder(
      context,
      index,
    ),
  );
}
