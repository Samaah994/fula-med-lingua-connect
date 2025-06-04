
import 'package:speech_to_text/speech_to_text.dart';

class STTService {
  static final SpeechToText _speech = SpeechToText();
  bool _isListening = false;
  bool _isAvailable = false;

  bool get isListening => _isListening;
  bool get isAvailable => _isAvailable;

  Future<bool> initialize() async {
    _isAvailable = await _speech.initialize(
      onStatus: (status) {
        print('STT Status: $status');
        _isListening = status == 'listening';
      },
      onError: (error) {
        print('STT Error: $error');
        _isListening = false;
      },
    );
    return _isAvailable;
  }

  Future<void> startListening({
    required Function(String) onResult,
    String language = 'en_US',
  }) async {
    if (!_isAvailable) {
      await initialize();
    }

    if (_isAvailable && !_isListening) {
      await _speech.listen(
        onResult: (result) {
          onResult(result.recognizedWords);
        },
        localeId: _mapLanguageCode(language),
        partialResults: true,
      );
      _isListening = true;
    }
  }

  Future<void> stopListening() async {
    if (_isListening) {
      await _speech.stop();
      _isListening = false;
    }
  }

  String _mapLanguageCode(String language) {
    switch (language) {
      case 'en':
        return 'en_US';
      case 'fr':
        return 'fr_FR';
      case 'ff':
        return 'en_US'; // Fallback for Fulfulde
      default:
        return 'en_US';
    }
  }

  Future<List<String>> getAvailableLocales() async {
    if (!_isAvailable) {
      await initialize();
    }
    
    var locales = await _speech.locales();
    return locales.map((locale) => locale.localeId).toList();
  }
}
