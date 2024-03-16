import "package:dio/dio.dart";
import 'package:flutter_dotenv/flutter_dotenv.dart';
import "package:fluttertoast/fluttertoast.dart";

import "package:random_products_flutter_app/Infrastructure/Exceptions/api_exception.dart";

final String? _baseUrl = dotenv.env['BACKEND_URL'];
final kdioBaseOptions = BaseOptions(
  baseUrl: _baseUrl!,
  contentType: Headers.jsonContentType,
  responseType: ResponseType.json,
);

class ApiService {
  static final Dio _dio = Dio(kdioBaseOptions);

  static Future request({
    required String method,
    required String url,
    Map? body,
    showToast = true,
    String toastMessage = "Something went wrong! Please try again later",
  }) async {
    try {
      final Response response = await _dio.request(
        url,
        data: body,
        options: Options(method: method),
      );

      return response.data;
    } on DioException catch (e) {
      Fluttertoast.showToast(msg: toastMessage);

      return ApiException(
        e.response!.statusCode!,
        e.message!,
        stackTrace: e.stackTrace,
      );
    } catch (e) {
      return ApiException(500, e.toString());
    }
  }
}
