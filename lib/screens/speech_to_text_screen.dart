
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/stt_service.dart';
import '../services/translation_service.dart';

class SpeechToTextScreen extends StatefulWidget {
  @override
  _SpeechToTextScreenState createState() => _SpeechToTextScreenState();
}

class _SpeechToTextScreenState extends State<SpeechToTextScreen> {
  final TextEditingController _resultController = TextEditingController();
  late STTService _sttService;
  
  String _selectedLanguage = 'en';
  bool _isInitialized = false;
  List<String> _availableLocales = [];

  @override
  void initState() {
    super.initState();
    _initializeSTT();
  }

  Future<void> _initializeSTT() async {
    _sttService = Provider.of<STTService>(context, listen: false);
    final success = await _sttService.initialize();
    
    if (success) {
      _availableLocales = await _sttService.getAvailableLocales();
    }
    
    setState(() {
      _isInitialized = success;
    });
    
    if (!success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Speech recognition not available')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final translationService = Provider.of<TranslationService>(context);
    final languages = translationService.getSupportedLanguages();

    return Scaffold(
      appBar: AppBar(
        title: Text('Speech to Text'),
        backgroundColor: Colors.blue[600],
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Language Selection
            Card(
              child: Padding(
                padding: EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Language:', style: TextStyle(fontWeight: FontWeight.bold)),
                    DropdownButton<String>(
                      value: _selectedLanguage,
                      isExpanded: true,
                      onChanged: (value) {
                        setState(() {
                          _selectedLanguage = value!;
                        });
                      },
                      items: languages.map((lang) {
                        return DropdownMenuItem<String>(
                          value: lang['code'],
                          child: Text('${lang['flag']} ${lang['name']}'),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),
            ),
            SizedBox(height: 20),
            
            // Microphone Button
            Center(
              child: GestureDetector(
                onTap: _isInitialized ? _toggleListening : null,
                child: Container(
                  width: 120,
                  height: 120,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: _sttService.isListening 
                        ? Colors.red.withOpacity(0.8)
                        : Colors.blue.withOpacity(0.8),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black26,
                        blurRadius: 10,
                        offset: Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Icon(
                    _sttService.isListening ? Icons.mic : Icons.mic_none,
                    size: 60,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
            SizedBox(height: 16),
            
            Text(
              _sttService.isListening 
                  ? 'Listening... Tap to stop'
                  : 'Tap microphone to start listening',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
            SizedBox(height: 20),
            
            // Status
            if (!_isInitialized)
              Container(
                padding: EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  'Speech recognition not available',
                  style: TextStyle(color: Colors.red),
                  textAlign: TextAlign.center,
                ),
              ),
            
            SizedBox(height: 20),
            
            // Result Text
            Text('Recognized Text:', style: TextStyle(fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: TextField(
                  controller: _resultController,
                  maxLines: null,
                  decoration: InputDecoration(
                    border: InputBorder.none,
                    contentPadding: EdgeInsets.all(12),
                    hintText: 'Recognized speech will appear here...',
                  ),
                ),
              ),
            ),
            SizedBox(height: 16),
            
            // Clear Button
            ElevatedButton.icon(
              onPressed: _clearText,
              icon: Icon(Icons.clear),
              label: Text('Clear Text'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.grey,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _toggleListening() async {
    if (_sttService.isListening) {
      await _sttService.stopListening();
    } else {
      await _sttService.startListening(
        language: _selectedLanguage,
        onResult: (text) {
          setState(() {
            _resultController.text = text;
          });
        },
      );
    }
    setState(() {});
  }

  void _clearText() {
    setState(() {
      _resultController.clear();
    });
  }

  @override
  void dispose() {
    _resultController.dispose();
    _sttService.stopListening();
    super.dispose();
  }
}
