import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// The wrapper service created to manage secured storage via [FlutterSecureStorage].
class SecureStorageService {
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  /// Reads all data in secured storage.
  ///
  /// Returns a [Map] of keys of type [String] and values of type [String].
  Future<Map<String, String>> _readAll() async {
    return await _storage.readAll(
      aOptions: _getAndroidOptions(),
    );
  }

  /// Takes in a key of type [String].
  ///
  /// Returns nullable values of type [String].
  Future<String?> readItem(String key) async {
    return await _storage.read(
      key: key,
      aOptions: _getAndroidOptions(),
    );
  }

  /// Wipes all data secure storage.
  Future<void> deleteAll() async {
    await _storage.deleteAll(
      aOptions: _getAndroidOptions(),
    );
  }

  /// Adds a new key, value pair into secure storage.
  ///
  /// Takes in a key of type [String], and value of type [String].
  Future<void> addNewItem(String key, String value) async {
    await _storage.write(
      key: key,
      value: value,
      aOptions: _getAndroidOptions(),
    );
  }

  /// Check Android versions for other encryption options.
  ///
  /// Returns [AndroidOptions] with encryption enabled.
  AndroidOptions _getAndroidOptions() => const AndroidOptions(
        encryptedSharedPreferences: true,
      );

  /// Read encrypted JWT tokens currently stored
  ///
  /// Returns the tokens in a [Map] of keys of type [String] and values of type
  /// [String].
  Future<Map<String, String>> readTokens() async {
    Map<String, String> tokens = {};
    String? authToken = await readItem("auth-token");
    String? refreshToken = await readItem("refresh-token");
    if (authToken != null) {
      tokens["auth-token"] = authToken;
    }
    if (refreshToken != null) {
      tokens["refresh-token"] = refreshToken;
    }
    return tokens;
  }

  /// Encrypt and store JWTs.
  Future<void> storeTokens(String authToken, String refreshToken) async {
    await addNewItem("auth-token", authToken);
    await addNewItem("refresh-token", refreshToken);
  }
}
