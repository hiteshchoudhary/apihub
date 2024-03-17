import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import './app_colors.dart';

class AppTheme {
  // System UI Overlay Style
  static SystemUiOverlayStyle kSystemOverlayStyle = const SystemUiOverlayStyle(
    statusBarColor: AppColors.primary,
    statusBarBrightness: Brightness.light,
  );

  // App Theme
  static final ThemeData appTheme = ThemeData(
    scaffoldBackgroundColor: AppColors.greyWhiteColor,
    textTheme: const TextTheme(
      labelLarge: TextStyle(
        color: AppColors.blackColor,
        fontWeight: FontWeight.bold,
        fontSize: 18,
      ),
      displaySmall: TextStyle(
        color: AppColors.blackColor,
        fontWeight: FontWeight.bold,
        fontSize: 15,
      ),
      displayMedium: TextStyle(
        color: AppColors.blackColor,
        fontWeight: FontWeight.bold,
        fontSize: 20,
      ),
      labelMedium: TextStyle(
        fontWeight: FontWeight.bold,
        fontSize: 20,
      ),
      displayLarge: TextStyle(
        fontWeight: FontWeight.w400,
        fontSize: 30,
      ),
    ),
    iconTheme: const IconThemeData(
      color: Colors.black,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.white,
      titleTextStyle: TextStyle(
        fontWeight: FontWeight.w500,
        color: Colors.black,
        fontSize: 15,
      ),
      iconTheme: IconThemeData(
        color: Colors.black,
      ),
      elevation: 2,
    ),
    floatingActionButtonTheme: const FloatingActionButtonThemeData(
      backgroundColor: AppColors.primary,
      splashColor: Colors.white,
      foregroundColor: Colors.white,
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        textStyle: const TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 15,
        ),
      ),
    ),
  );
}
