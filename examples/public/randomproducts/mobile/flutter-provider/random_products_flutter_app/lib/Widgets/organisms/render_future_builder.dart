import 'package:flutter/material.dart';
import 'package:random_products_flutter_app/Screens/index.dart';

Widget renderFuturebuilder({
  required Future future,
  required Function builder,
}) {
  return FutureBuilder(
    future: future,
    builder: (BuildContext context, AsyncSnapshot snapshot) {
      if (snapshot.connectionState == ConnectionState.waiting) {
        return const Center(
          child: CircularProgressIndicator(),
        );
      }

      if (snapshot.hasError) {
        return const ErrorScreen(
          message: "Something went wrong, please try again later",
        );
      }

      return builder(context, snapshot.data);
    },
  );
}
