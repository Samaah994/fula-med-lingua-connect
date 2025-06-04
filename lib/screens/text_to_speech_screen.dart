
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/tts_service.dart';
import '../services/translation_service.dart';

class TextToSpeechScreen extends StatefulWidget {
  @override
  _TextToSpeechScreenState createState() => _TextToSpeechScreenState();
}

class _TextToSpeechScreenState extends State<TextToSpeechScreen> {
  final TextEditingController _textController = TextEditingController();
  late TTSService _ttsService;
  
  String _selectedLanguage = 'en';
  double _speechRate = 0.8;
  double _pitch = 1.0;
  List<String> _availableVoices = [];
  String? _selectedVoice;
  bool _isInitialized = false;

  @override
  void initState() {
    super.initState();
    _initializeTTS();
  }

  Future<void> _initializeTTS() async {
    _ttsService = Provider.of<TTSService>(context, listen: false);
    await _ttsService.initialize();
    
    _availableVoices = await _ttsService.getAvailableVoices();
    if (_availableVoices.isNotEmpty) {
      _selectedVoice = _availableVoices.first;
    }
    
    setState(() {
      _isInitialized = true;
    });
  }

  @override
  Widget build(BuildContext context) {
    final translationService = Provider.of<TranslationService>(context);
    final languages = translationService.getSupportedLanguages();

    return Scaffold(
      appBar: AppBar(
        title: Text('Text to Speech'),
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
            SizedBox(height: 16),
            
            // Voice Settings
            if (_isInitialized) ...[
              Card(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Voice Settings:', style: TextStyle(fontWeight: FontWeight.bold)),
                      SizedBox(height: 8),
                      
                      // Voice Selection
                      if (_availableVoices.isNotEmpty) ...[
                        Text('Voice:'),
                        DropdownButton<String>(
                          value: _selectedVoice,
                          isExpanded: true,
                          onChanged: (value) async {
                            setState(() {
                              _selectedVoice = value!;
                            });
                            await _ttsService.setVoice(value!);
                          },
                          items: _availableVoices.map((voice) {
                            return DropdownMenuItem<String>(
                              value: voice,
                              child: Text(voice),
                            );
                          }).toList(),
                        ),
                        SizedBox(height: 16),
                      ],
                      
                      // Speech Rate
                      Text('Speech Rate: ${_speechRate.toStringAsFixed(1)}'),
                      Slider(
                        value: _speechRate,
                        min: 0.1,
                        max: 2.0,
                        divisions: 19,
                        onChanged: (value) async {
                          setState(() {
                            _speechRate = value;
                          });
                          await _ttsService.setSpeechRate(value);
                        },
                      ),
                      
                      // Pitch
                      Text('Pitch: ${_pitch.toStringAsFixed(1)}'),
                      Slider(
                        value: _pitch,
                        min: 0.5,
                        max: 2.0,
                        divisions: 15,
                        onChanged: (value) async {
                          setState(() {
                            _pitch = value;
                          });
                          await _ttsService.setPitch(value);
                        },
                      ),
                    ],
                  ),
                ),
              ),
              SizedBox(height: 16),
            ],
            
            // Text Input
            Text('Text to Speak:', style: TextStyle(fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Expanded(
              child: TextField(
                controller: _textController,
                maxLines: null,
                decoration: InputDecoration(
                  border: OutlineInputBorder(),
                  hintText: 'Enter text to convert to speech...',
                ),
              ),
            ),
            SizedBox(height: 16),
            
            // Control Buttons
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _isInitialized ? _speak : null,
                    icon: Icon(_ttsService.isPlaying ? Icons.volume_up : Icons.play_arrow),
                    label: Text(_ttsService.isPlaying ? 'Speaking...' : 'Speak'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                    ),
                  ),
                ),
                SizedBox(width: 8),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: _isInitialized ? _stop : null,
                    icon: Icon(Icons.stop),
                    label: Text('Stop'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _speak() async {
    if (_textController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please enter text to speak')),
      );
      return;
    }

    try {
      await _ttsService.speak(_textController.text, _selectedLanguage);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Speech failed: $e')),
      );
    }
  }

  Future<void> _stop() async {
    await _ttsService.stop();
    setState(() {});
  }

  @override
  void dispose() {
    _textController.dispose();
    _ttsService.stop();
    super.dispose();
  }
}
