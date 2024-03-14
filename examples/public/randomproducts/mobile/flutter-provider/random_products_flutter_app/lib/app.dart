import 'package:flutter/material.dart';
import 'package:random_products_flutter_app/app_router.dart';

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: "Random Products App",
      debugShowCheckedModeBanner: false,
      routerConfig: appRouter,
    );
  }
}
