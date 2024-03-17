import 'package:flutter/material.dart';

const kDefaultErrorMessage = "An error occurred , please try again later.";

class ErrorScreen extends StatelessWidget {
  const ErrorScreen({super.key, this.message = kDefaultErrorMessage});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Text(message),
      ),
    );
  }
}
