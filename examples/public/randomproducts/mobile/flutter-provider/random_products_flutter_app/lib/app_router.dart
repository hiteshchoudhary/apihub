import 'package:random_products_flutter_app/screens/index.dart';
import 'package:random_products_flutter_app/app_routes.dart';

import 'package:go_router/go_router.dart';

final appRouter = GoRouter(initialLocation: AppRoutes.kHome, routes: [
  GoRoute(
    path: AppRoutes.kHome,
    builder: (context, state) => const Home(),
  ),
  GoRoute(
    path: AppRoutes.kProductDetail,
    builder: (context, state) => const ProductDetails(),
  ),
  GoRoute(
    path: AppRoutes.kSearch,
    builder: (context, state) => const Search(),
  ),
]);
