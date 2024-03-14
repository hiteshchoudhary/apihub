import 'package:random_products_flutter_app/Infrastructure/HttpMethods/requesting_methods.dart';

Future getProducts() async {
  final products =
      await ApiService.request(method: "GET", url: "/ecommerce/products");

  print(products);
}
