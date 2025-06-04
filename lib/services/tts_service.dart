
import 'package:flutter_tts/flutter_tts.dart';

class TTSService {
  static final FlutterTts _flutterTts = FlutterTts();
  bool _isPlaying = false;

  bool get isPlaying => _isPlaying;

  Future<void> initialize() async {
    await _flutterTts.setLanguage("en-US");
    await _flutterTts.setSpeechRate(0.8);
    await _flutterTts.setVolume(1.0);
    await _flutterTts.setPitch(1.0);

    _flutterTts.setStartHandler(() {
      _isPlaying = true;
    });

    _flutterTts.setCompletionHandler(() {
      _isPlaying = false;
    });

    _flutterTts.setErrorHandler((message) {
      _isPlaying = false;
      print("TTS Error: $message");
    });
  }

  Future<void> speak(String text, String language) async {
    if (text.isEmpty) return;

    await stop();
    
    // Set language
    String ttsLanguage = _mapLanguageCode(language);
    await _flutterTts.setLanguage(ttsLanguage);
    
    await _flutterTts.speak(text);
  }

  Future<void> stop() async {
    await _flutterTts.stop();
    _isPlaying = false;
  }

  String _mapLanguageCode(String language) {
    switch (language) {
      case 'en':
        return 'en-US';
      case 'fr':
        return 'fr-FR';
      case 'ff':
        return 'en-US'; // Fallback for Fulfulde
      default:
        return 'en-US';
    }
  }

  Future<List<String>> getAvailableVoices() async {
    var voices = await _flutterTts.getVoices;
    return voices.map<String>((voice) => voice['name'].toString()).toList();
  }

  Future<void> setVoice(String voiceName) async {
    var voices = await _flutterTts.getVoices;
    var voice = voices.firstWhere(
      (voice) => voice['name'] == voiceName,
      orElse: () => voices.first,
    );
    await _flutterTts.setVoice(voice);
  }

  Future<void> setSpeechRate(double rate) async {
    await _flutterTts.setSpeechRate(rate);
  }

  Future<void> setPitch(double pitch) async {
    await _flutterTts.setPitch(pitch);
  }
}
