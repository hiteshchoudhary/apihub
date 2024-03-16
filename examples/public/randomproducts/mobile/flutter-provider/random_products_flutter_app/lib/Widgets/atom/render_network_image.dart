import 'package:flutter/material.dart';

Widget renderNetworkImage(String imgSource, {BoxFit fit = BoxFit.contain}) {
  return Image.network(
    imgSource,
    fit: fit,
    loadingBuilder: (context, child, loadingProgress) {
      if (loadingProgress == null) return child;

      final calculatedProgress = loadingProgress.expectedTotalBytes != null
          ? loadingProgress.cumulativeBytesLoaded /
              loadingProgress.expectedTotalBytes!
          : null;

      return Center(
        child: CircularProgressIndicator(
          value: calculatedProgress,
          strokeWidth: 0.2,
        ),
      );
    },
    cacheHeight: 150,
    frameBuilder: (context, child, frame, wasSynchronouslyLoaded) {
      if (wasSynchronouslyLoaded) return child;

      return AnimatedOpacity(
        opacity: frame == null ? 0 : 1,
        duration: const Duration(seconds: 1),
        curve: Curves.easeOut,
        child: child,
      );
    },
  );
}
