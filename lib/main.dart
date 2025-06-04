
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/home_screen.dart';
import 'screens/text_to_text_screen.dart';
import 'screens/text_to_speech_screen.dart';
import 'screens/speech_to_text_screen.dart';
import 'services/translation_service.dart';
import 'services/tts_service.dart';
import 'services/stt_service.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider<TranslationService>(create: (_) => TranslationService()),
        Provider<TTSService>(create: (_) => TTSService()),
        Provider<STTService>(create: (_) => STTService()),
      ],
      child: MaterialApp(
        title: 'Medical Translation App',
        theme: ThemeData(
          primarySwatch: Colors.blue,
          visualDensity: VisualDensity.adaptivePlatformDensity,
        ),
        initialRoute: '/',
        routes: {
          '/': (context) => HomeScreen(),
          '/text-to-text': (context) => TextToTextScreen(),
          '/text-to-speech': (context) => TextToSpeechScreen(),
          '/speech-to-text': (context) => SpeechToTextScreen(),
        },
      ),
    );
  }
}
