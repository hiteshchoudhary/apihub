import 'package:go_router/go_router.dart';
import 'package:random_products_flutter_app/Screens/index.dart';

import 'package:random_products_flutter_app/app_routes.dart';

final appRouter = GoRouter(
  initialLocation: AppRoutes.kHome,
  routes: [
    GoRoute(
      path: AppRoutes.kHome,
      builder: (context, state) => const Home(),
    ),
    GoRoute(
      path: AppRoutes.kProductDetail,
      builder: (context, state) {
        return ProductDetails(product: state.extra);
      },
    ),
    GoRoute(
      path: AppRoutes.kSearch,
      builder: (context, state) => const Search(),
    ),
    GoRoute(
      path: AppRoutes.kError,
      builder: (context, state) => const ErrorScreen(),
    ),
  ],
);
