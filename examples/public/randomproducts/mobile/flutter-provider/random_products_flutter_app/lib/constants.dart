import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';

const kCurrencySymbol = "₹";

final kProductImageSliderOptions = CarouselOptions(
  aspectRatio: 16 / 9,
  viewportFraction: 0.75,
  enlargeCenterPage: true,
  initialPage: 0,
  reverse: false,
  autoPlay: true,
  autoPlayInterval: const Duration(seconds: 3),
  autoPlayAnimationDuration: const Duration(milliseconds: 800),
  autoPlayCurve: Curves.fastOutSlowIn,
  scrollDirection: Axis.horizontal,
  animateToClosest: true,
  scrollPhysics: const BouncingScrollPhysics(),
);
