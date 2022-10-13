import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  Future<Map<String, String>> _readAll() async {
    return await _storage.readAll(
      aOptions: _getAndroidOptions(),
    );
  }

  Future<String?> readItem(String key) async {
    return await _storage.read(
      key: key,
      aOptions: _getAndroidOptions(),
    );
  }

  Future<void> deleteAll() async {
    await _storage.deleteAll(
      aOptions: _getAndroidOptions(),
    );
  }

  Future<void> addNewItem(String key, String value) async {
    await _storage.write(
      key: key,
      value: value,
      aOptions: _getAndroidOptions(),
    );
  }

  // Check Android versions for other encryption options.
  AndroidOptions _getAndroidOptions() => const AndroidOptions(
        encryptedSharedPreferences: true,
      );

  // Read encrypted JWT tokens currently stored
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

  // Encrypt and store JWT tokens
  Future<void> storeTokens(String authToken, String refreshToken) async {
    await addNewItem("auth-token", authToken);
    await addNewItem("refresh-token", refreshToken);
  }
}
