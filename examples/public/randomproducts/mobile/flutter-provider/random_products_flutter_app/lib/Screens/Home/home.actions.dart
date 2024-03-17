import 'package:random_products_flutter_app/Infrastructure/HttpMethods/requesting_methods.dart';

Future getProducts({
  int page = 1,
  int limit = 20,
}) async {
  final url = "/ecommerce/products?page=$page&limit=$limit";
  final products = await ApiService.request(
    method: "GET",
    url: url,
  );

  return products["data"]["products"];
}

Future getProductById({
  required String id,
}) async {
  final url = "/ecommerce/products/$id";
  final product = await ApiService.request(
    method: "GET",
    url: url,
  );

  return product["data"];
}
