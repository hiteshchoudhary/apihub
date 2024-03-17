import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'package:random_products_flutter_app/app.dart';
import 'package:random_products_flutter_app/app_theme.dart';

Future main() async {
  await dotenv.load(
    fileName: ".env",
  );
  SystemChrome.setSystemUIOverlayStyle(AppTheme.kSystemOverlayStyle);
  runApp(const MainApp());
}
