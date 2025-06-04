
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/translation_service.dart';

class TextToTextScreen extends StatefulWidget {
  @override
  _TextToTextScreenState createState() => _TextToTextScreenState();
}

class _TextToTextScreenState extends State<TextToTextScreen> {
  final TextEditingController _inputController = TextEditingController();
  final TextEditingController _outputController = TextEditingController();
  
  String _fromLanguage = 'en';
  String _toLanguage = 'ff';
  bool _isTranslating = false;

  @override
  Widget build(BuildContext context) {
    final translationService = Provider.of<TranslationService>(context);
    final languages = translationService.getSupportedLanguages();

    return Scaffold(
      appBar: AppBar(
        title: Text('Text to Text Translation'),
        backgroundColor: Colors.blue[600],
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Language Selection
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('From:', style: TextStyle(fontWeight: FontWeight.bold)),
                      DropdownButton<String>(
                        value: _fromLanguage,
                        isExpanded: true,
                        onChanged: (value) {
                          setState(() {
                            _fromLanguage = value!;
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
                SizedBox(width: 16),
                Icon(Icons.arrow_forward, size: 32),
                SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('To:', style: TextStyle(fontWeight: FontWeight.bold)),
                      DropdownButton<String>(
                        value: _toLanguage,
                        isExpanded: true,
                        onChanged: (value) {
                          setState(() {
                            _toLanguage = value!;
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
              ],
            ),
            SizedBox(height: 20),
            
            // Input Text
            Text('Input Text:', style: TextStyle(fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            TextField(
              controller: _inputController,
              maxLines: 4,
              decoration: InputDecoration(
                border: OutlineInputBorder(),
                hintText: 'Enter text to translate...',
              ),
            ),
            SizedBox(height: 16),
            
            // Translate Button
            ElevatedButton(
              onPressed: _isTranslating ? null : _translateText,
              child: _isTranslating
                  ? Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        ),
                        SizedBox(width: 8),
                        Text('Translating...'),
                      ],
                    )
                  : Text('Translate'),
            ),
            SizedBox(height: 16),
            
            // Output Text
            Text('Translation:', style: TextStyle(fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Expanded(
              child: TextField(
                controller: _outputController,
                maxLines: null,
                readOnly: true,
                decoration: InputDecoration(
                  border: OutlineInputBorder(),
                  hintText: 'Translation will appear here...',
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _translateText() async {
    if (_inputController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Please enter text to translate')),
      );
      return;
    }

    setState(() {
      _isTranslating = true;
    });

    try {
      final translationService = Provider.of<TranslationService>(context, listen: false);
      final translation = await translationService.translateText(
        text: _inputController.text,
        fromLanguage: _fromLanguage,
        toLanguage: _toLanguage,
      );
      
      setState(() {
        _outputController.text = translation;
      });
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Translation completed successfully')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Translation failed: $e')),
      );
    } finally {
      setState(() {
        _isTranslating = false;
      });
    }
  }

  @override
  void dispose() {
    _inputController.dispose();
    _outputController.dispose();
    super.dispose();
  }
}
