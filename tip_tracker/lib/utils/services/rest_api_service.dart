import 'dart:convert';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:tip_tracker/constants/api_path.dart';
import 'package:tip_tracker/core/auth/login/cubit/login_model.dart';
import 'package:tip_tracker/core/auth/onboarding/cubit/onboarding_model.dart';
import 'package:tip_tracker/core/auth/registration/cubit/registration_model.dart';
import 'package:tip_tracker/modules/index/pages/analytics/cubit/transaction_model.dart';
import 'package:tip_tracker/utils/services/secure_storage_service.dart';

/// This service sets up the get, post methods and backend endpoints. All of
/// which are accessible to the rest of the application.
///
/// [apiPath] holds the API base url.
/// [_storage] holds an instance of the secure storage service.
class RestApiService {
  static String apiPath = ApiPath().apiPath;
  static final SecureStorageService _storage = SecureStorageService();

  /// This function is used for all get methods.
  ///
  /// Adds the current JWTs, in storage, to the headers of this call.
  ///
  /// Returns the [Response], if successful.
  ///
  /// Throws [SocketException], unless the error is [DioError]. Then it rethrows
  /// [DioError].
  static Future<Response> _get(String url) async {
    Map<String, String> headers = {"Accept": "application/json"};
    headers.addAll(await _storage.readTokens());

    final Response response = await Dio().get(
      url,
      options: Options(
        headers: headers,
      ),
    );

    return response;
  }

  /// This function is used for all post methods.
  ///
  /// Adds the current JWTs, in storage, to the headers of this call.
  ///
  /// Attempts to store JWTs from the response, if any.
  ///
  /// Returns the [Response], if successful.
  ///
  /// Throws [SocketException], unless the error is [DioError]. Then it rethrows
  /// [DioError].
  static Future<Response> _post(String url, Map<String, dynamic> body) async {
    Map<String, String> headers = {
      "Acception": "application/json",
      "Content-type": "application/json",
    };
    headers.addAll(await _storage.readTokens());

    final Response response = await Dio().post(
      url,
      data: json.encode(body),
      options: Options(
        headers: headers,
      ),
    );

    _storage.storeTokens(response.headers.map["auth-token"]!.first,
        response.headers.map["refresh-token"]!.first);

    return response;
  }

  // AUTHENTICATION

  /// Makes a call to the login endpoint.
  ///
  /// Returns the response.
  static Future<Response> login(LoginModel loginModel) async {
    return await _post("$apiPath/login", loginModel.toJson());
  }

  /// Makes a call to the register endpoint.
  ///
  /// Returns the response.
  static Future<Response> register(RegistrationModel registrationModel) async {
    return await _post("$apiPath/register", registrationModel.toJson());
  }

  /// Makes a call to the onboarding endpoint.
  ///
  /// Returns the response.
  static Future<Response> onboard(OnboardingModel onboardingModel) async {
    return await _post("$apiPath/onboarding", onboardingModel.toJson());
  }

  /// Makes a call to the token verification endpoint.
  ///
  /// Returns the response.
  static Future<Response> verifyToken() async {
    return await _get("$apiPath/verify_token");
  }

  // TIPS
  static Future<Response> getTransactions(
      String userId, String date, String locaton) async {
    return await _get(
        "$apiPath/transactions?user_id=$userId&date=$date&location=$locaton");
  }

  static Future<Response> postTransaction(
      TransactionModel transactionModel) async {
    return await _post("$apiPath/transactions", transactionModel.toJson());
  }

  static Future<Response> deleteTransaction(String transactionId) async {
    return await _get("$apiPath/transactions/$transactionId");
  }

  static Future<Response> patchTransaction(
      TransactionModel transactionModel) async {
    return await _post("$apiPath/transactions/${transactionModel.id}",
        transactionModel.toJson());
  }
}
