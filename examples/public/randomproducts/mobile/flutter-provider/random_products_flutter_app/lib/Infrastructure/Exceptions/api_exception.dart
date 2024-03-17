class ApiException implements Exception {
  final int statusCode;
  final String message;
  final StackTrace? stackTrace;

  ApiException(this.statusCode, this.message, {this.stackTrace});
}
