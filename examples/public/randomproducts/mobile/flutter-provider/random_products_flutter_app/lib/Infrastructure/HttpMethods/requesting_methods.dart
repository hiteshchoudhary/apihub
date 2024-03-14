import "package:dio/dio.dart";
import "package:fluttertoast/fluttertoast.dart";

import "package:random_products_flutter_app/Infrastructure/Exceptions/api_exception.dart";

var kdioBaseOptions = BaseOptions(
  baseUrl: "http://10.0.2.2:8080",
  contentType: Headers.jsonContentType,
  responseType: ResponseType.json,
);

class ApiService {
  static final Dio _dio = Dio(kdioBaseOptions);

  static Future request({
    required String method,
    required String url,
    dynamic queryParameters = const {},
    Map? body,
    showToast = true,
    String toastMessage = "Something went wrong! Please try again later.",
  }) async {
    print("Requesting to $url");
    print("Method: $method");

    try {
      final Response response = await _dio.get(
        url,
        queryParameters: queryParameters,
      );
      print(response.data);
    } on DioException catch (e) {
      // Fluttertoast.showToast(msg: toastMessage);

      return ApiException(
        e.response!.statusCode!,
        e.message!,
        stackTrace: e.stackTrace,
      );
    } catch (e) {
      print(e.toString());
      return ApiException(500, e.toString());
    }
  }
}
