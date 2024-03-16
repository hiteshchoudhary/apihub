import 'package:flutter/material.dart';

TextStyle kTextStyle = const TextStyle(
  color: Colors.black,
  fontSize: 16,
  fontWeight: FontWeight.bold,
);

AppBar renderAppBar({
  required String title,
  bool automaticallyImplyLeading = true,
}) {
  return AppBar(
    title: Text(
      title,
      style: kTextStyle,
    ),
    automaticallyImplyLeading: automaticallyImplyLeading,
  );
}
