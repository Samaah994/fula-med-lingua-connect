
import 'dart:convert';
import 'package:http/http.dart' as http;

class TranslationService {
  static const String baseUrl = 'http://localhost:8000';

  Future<String> translateText({
    required String text,
    required String fromLanguage,
    required String toLanguage,
  }) async {
    try {
      final direction = '${fromLanguage}_to_${toLanguage}';
      
      final response = await http.post(
        Uri.parse('$baseUrl/translate'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'text': text,
          'direction': direction,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['translation'] ?? 'Translation failed';
      } else {
        throw Exception('Translation API error: ${response.statusText}');
      }
    } catch (e) {
      print('Translation error: $e');
      // Fallback for demo
      return '[Translated from $fromLanguage to $toLanguage]: $text';
    }
  }

  List<Map<String, String>> getSupportedLanguages() {
    return [
      {'code': 'en', 'name': 'English', 'flag': '🇬🇧'},
      {'code': 'ff', 'name': 'Fulfulde', 'flag': '🇸🇳'},
      {'code': 'fr', 'name': 'Français', 'flag': '🇫🇷'},
    ];
  }
}
