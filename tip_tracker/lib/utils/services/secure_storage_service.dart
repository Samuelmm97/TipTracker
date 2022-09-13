import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  Future<void> _readAll(String accountName) async {
    await _storage.readAll(
      iOptions: _getIOSOptions(accountName),
      aOptions: _getAndroidOptions(),
    );
  }

  Future<void> deleteAll(accountName) async {
    await _storage.deleteAll(
      iOptions: _getIOSOptions(accountName),
      aOptions: _getAndroidOptions(),
    );
    _readAll(accountName);
  }

  Future<void> addNewItem(String accountName, String key, String value) async {
    await _storage.write(
      key: key,
      value: value,
      iOptions: _getIOSOptions(accountName),
      aOptions: _getAndroidOptions(),
    );
    _readAll(accountName);
  }

  IOSOptions _getIOSOptions(String accountName) => IOSOptions(
        accountName: accountName,
      );

  AndroidOptions _getAndroidOptions() => const AndroidOptions(
        encryptedSharedPreferences: true,
        // sharedPreferencesName: 'Test2',
        // preferencesKeyPrefix: 'Test'
      );
}
